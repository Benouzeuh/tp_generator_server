// src/providers.js
// Appels aux API Groq (principal) et Mistral (secours), au format "compatible OpenAI"
// commun aux deux. Toute la logique de bascule Groq -> Mistral vit ici, dans une seule
// fonction (generateWithFallback), pour ne jamais avoir à la retoucher ailleurs si on
// change un jour de fournisseur ou de modèle : seuls le nom du modèle et l'URL changent,
// et les deux vivent en variables d'environnement (voir .env.example).

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";

/**
 * Lit les en-têtes de quota renvoyés par le fournisseur (présents même sur une
 * réponse réussie) pour savoir combien de marge il reste avant la prochaine limite.
 * Les deux fournisseurs utilisent des noms d'en-têtes très proches (héritage du
 * standard popularisé par OpenAI), donc une seule fonction suffit pour les deux.
 */
function parseRateLimitHeaders(headers) {
  const num = (v) => (v === null || v === undefined || v === "" ? null : Number(v));
  return {
    remainingRequests: num(headers.get("x-ratelimit-remaining-requests")),
    limitRequests: num(headers.get("x-ratelimit-limit-requests")),
    remainingTokens: num(headers.get("x-ratelimit-remaining-tokens")),
    limitTokens: num(headers.get("x-ratelimit-limit-tokens")),
    retryAfterSeconds: num(headers.get("retry-after")),
  };
}

async function callProvider({ url, apiKey, model, messages, temperature, maxTokens }) {
  const configuredMaxTokens = Number(process.env.GENERATION_MAX_TOKENS) || 4000;
  if (!apiKey) {
    return { ok: false, status: 0, error: "missing_api_key", rateLimit: null, text: null };
  }

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: temperature ?? 0.7,
        max_tokens: maxTokens ?? configuredMaxTokens,
      }),
    });
  } catch (networkError) {
    // Panne réseau / DNS / timeout — traité comme un échec, déclenchera le secours.
    return { ok: false, status: 0, error: "network_error", rateLimit: null, text: null };
  }

  const rateLimit = parseRateLimitHeaders(response.headers);

  if (!response.ok) {
    // On lit quand même le corps pour le log serveur (pas renvoyé à l'élève tel quel).
    let bodyText = "";
    try {
      bodyText = await response.text();
    } catch (_) {
      /* ignore */
    }
    return {
      ok: false,
      status: response.status,
      error: response.status === 429 ? "rate_limited" : "http_error",
      rateLimit,
      text: null,
      raw: bodyText.slice(0, 500),
    };
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content?.trim() ?? "";

  return { ok: true, status: 200, error: null, rateLimit, text };
}

async function callGroq(messages) {
  const result = await callProvider({
    url: GROQ_URL,
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
    messages,
  });
  return { ...result, provider: "groq" };
}

async function callMistral(messages) {
  const result = await callProvider({
    url: MISTRAL_URL,
    apiKey: process.env.MISTRAL_API_KEY,
    model: process.env.MISTRAL_MODEL || "ministral-14b-2512",
    messages,
  });
  return { ...result, provider: "mistral" };
}

/**
 * Groq en principal. Bascule vers Mistral UNIQUEMENT si Groq échoue explicitement
 * (429 = quota atteint, panne réseau, erreur serveur Groq) — jamais en usage normal.
 * C'est le comportement "secours strict" demandé, appliqué aussi au cas "429" pour
 * absorber les pics de classe sans laisser l'élève face à une erreur.
 *
 * Exception : si le message contient une image (élève ayant joint une photo), on
 * appelle directement Mistral, seul des deux à savoir lire une image — Groq avec le
 * modèle actuel (openai/gpt-oss-120b) est uniquement texte et échouerait à coup sûr.
 */
async function generateWithFallback(messages, { onProviderResult, hasImage } = {}) {
  if (hasImage) {
    const mistralOnly = await callMistral(messages);
    if (onProviderResult) onProviderResult(mistralOnly);
    return mistralOnly;
  }

  const groqResult = await callGroq(messages);
  if (onProviderResult) onProviderResult(groqResult);

  if (groqResult.ok) {
    return groqResult;
  }

  const mistralResult = await callMistral(messages);
  if (onProviderResult) onProviderResult(mistralResult);

  if (mistralResult.ok) {
    return mistralResult;
  }

  // Les deux ont échoué : on garde le détail des deux tentatives pour le debug.
  return { ...mistralResult, attempts: { groq: summarize(groqResult), mistral: summarize(mistralResult) } };
}

function summarize(result) {
  return { status: result.status, error: result.error, raw: result.raw };
}

module.exports = { callGroq, callMistral, generateWithFallback, parseRateLimitHeaders };
