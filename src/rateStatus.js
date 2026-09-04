// src/rateStatus.js
// Garde en mémoire le dernier état de quota connu pour chaque fournisseur (rempli à
// chaque appel réel, jamais par un appel dédié — consulter le statut ne doit pas
// consommer de quota). Sert à répondre instantanément à GET /api/status.

const state = {
  groq: { rateLimit: null, lastError: null, updatedAt: null },
  mistral: { rateLimit: null, lastError: null, updatedAt: null },
};

function recordProviderResult(result) {
  const entry = state[result.provider];
  if (!entry) return;
  entry.updatedAt = Date.now();
  entry.rateLimit = result.rateLimit || entry.rateLimit;
  entry.lastError = result.ok ? null : result.error;
}

// Seuils : en dessous de 25% de marge restante (requêtes OU tokens), on passe à
// l'orange ; à 0 ou en cas de 429 récent, on passe au rouge. Ajustables ici sans
// toucher au reste du serveur si l'usage réel montre qu'ils sont mal calibrés.
const ORANGE_RATIO = 0.25;
const RECENT_ERROR_WINDOW_MS = 20 * 1000;

function levelFromGroq(queueLength) {
  const g = state.groq;

  if (g.lastError && g.updatedAt && Date.now() - g.updatedAt < RECENT_ERROR_WINDOW_MS) {
    if (g.lastError === "missing_api_key") {
      return {
        level: "red",
        message: "Le serveur n'est pas encore configuré (clé API manquante).",
        retryAfterSeconds: null,
      };
    }
    return {
      level: "red",
      message: "Groq est saturé, les nouvelles demandes passent par le secours (Mistral) ou patientent.",
      retryAfterSeconds: g.rateLimit?.retryAfterSeconds ?? 20,
    };
  }

  if (g.rateLimit) {
    const reqRatio =
      g.rateLimit.limitRequests && g.rateLimit.remainingRequests !== null
        ? g.rateLimit.remainingRequests / g.rateLimit.limitRequests
        : 1;
    const tokRatio =
      g.rateLimit.limitTokens && g.rateLimit.remainingTokens !== null
        ? g.rateLimit.remainingTokens / g.rateLimit.limitTokens
        : 1;
    const minRatio = Math.min(reqRatio, tokRatio);

    if (minRatio <= 0) {
      return { level: "red", message: "Quota épuisé pour cette minute, réessaie sous peu.", retryAfterSeconds: 30 };
    }
    if (minRatio < ORANGE_RATIO || queueLength >= 3) {
      return { level: "orange", message: "Ça circule fort, la génération peut prendre un peu plus de temps.", retryAfterSeconds: null };
    }
  }

  if (queueLength >= 3) {
    return { level: "orange", message: "Plusieurs élèves génèrent en même temps, un peu de patience.", retryAfterSeconds: null };
  }

  return { level: "green", message: "Vas-y, ça devrait être rapide.", retryAfterSeconds: null };
}

function getStatus(queueLength) {
  const computed = levelFromGroq(queueLength);
  return {
    level: computed.level,
    message: computed.message,
    retryAfterSeconds: computed.retryAfterSeconds,
    queueLength,
    lastUpdated: state.groq.updatedAt,
  };
}

module.exports = { recordProviderResult, getStatus };
