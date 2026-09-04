// server.js
// Serveur relais pour le générateur de TP de l'appli de révision BTS CIEL.
// Rôle unique : recevoir la consigne d'un élève, y injecter le cadrage (méta des
// chapitres + TP d'exemple du prof), interroger Groq (avec Mistral en secours si
// Groq échoue), et renvoyer le TP généré. Aucune donnée n'est stockée (pas de base
// de données, pas de compte élève) — voir README.md pour le détail du fonctionnement
// et le guide de déploiement.
 
require("dotenv").config();
 
const express = require("express");
const cors = require("cors");
 
const { generateWithFallback } = require("./src/providers");
const { recordProviderResult, getStatus } = require("./src/rateStatus");
const { enqueue, getQueueLength } = require("./src/queue");
const { buildContextBlock, reloadContext } = require("./src/context");
 
const app = express();
app.use(express.json({ limit: "20kb" }));
 
// ---------- CORS ----------
// ALLOWED_ORIGINS="*" en développement, sinon liste séparée par des virgules
// (ex: "https://revision-bts-ciel.netlify.app"). Ne pas laisser "*" une fois l'URL
// Netlify connue : ça limite qui peut appeler ce serveur (et donc consommer le quota).
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "*").split(",").map((s) => s.trim());
app.use(
  cors({
    origin: allowedOrigins.includes("*") ? true : allowedOrigins,
  })
);
 
// ---------- Anti-abus léger, par IP ----------
// Pas un système de quota par élève (pas d'auth, pas de compte) : juste un garde-fou
// simple pour éviter qu'un seul appareil ne spamme le bouton "Générer" et n'épuise à
// lui seul le quota partagé de toute la classe.
const MIN_INTERVAL_MS = Number(process.env.MIN_INTERVAL_MS || 12 * 1000);
const lastRequestByIp = new Map();
 
function ipThrottle(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const last = lastRequestByIp.get(ip) || 0;
  if (now - last < MIN_INTERVAL_MS) {
    const waitSeconds = Math.ceil((MIN_INTERVAL_MS - (now - last)) / 1000);
    return res.status(429).json({
      error: "too_fast",
      message: `Patiente encore ${waitSeconds}s avant une nouvelle génération.`,
      retryAfterSeconds: waitSeconds,
    });
  }
  lastRequestByIp.set(ip, now);
  next();
}
 
// Nettoyage périodique pour ne pas laisser grossir la Map indéfiniment.
setInterval(() => {
  const cutoff = Date.now() - 10 * 60 * 1000;
  for (const [ip, ts] of lastRequestByIp) {
    if (ts < cutoff) lastRequestByIp.delete(ip);
  }
}, 5 * 60 * 1000).unref();
 
// Recharge périodique du contexte (TP d'exemple ajoutés récemment) sans redéploiement.
setInterval(reloadContext, 5 * 60 * 1000).unref();
 
// ---------- Construction du prompt ----------
function buildMessages(consigne, chapterId) {
  const { chapterSection, chapterList, examplesSection } = buildContextBlock(chapterId);
 
  const systemPrompt = `Tu aides des élèves de BTS CIEL (Conception et Intégration de Systèmes Électroniques) à construire eux-mêmes leur propre TP de physique appliquée, à partir d'une consigne qu'ils te donnent.
 
Cadrage à respecter en priorité (mais tu peux t'en écarter si l'élève demande explicitement autre chose — ce cadrage est une aide, pas une limite stricte) :
- Appuie-toi sur le cours réellement enseigné, résumé ci-dessous.
- Inspire-toi du format, du niveau d'exigence et du style des TP d'exemple du professeur fournis ci-dessous.
- Registre neutre, académique, adapté à un élève de BTS (pas de familiarité, pas de tutoiement excessif dans le contenu du TP lui-même).
- Structure attendue d'un TP, à adapter selon la consigne : objectifs, matériel/prérequis, manipulation(s) pas à pas, questions d'analyse, et si pertinent une piste de correction ou des résultats attendus.
 
${chapterSection}
 
Liste complète des chapitres du programme (pour te situer si l'élève ne précise pas de chapitre, ou mentionne un autre chapitre que celui indiqué) :
${chapterList}
 
${examplesSection}`;
 
  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: consigne },
  ];
}
 
// ---------- Endpoints ----------
 
app.get("/", (_req, res) => {
  res.json({ ok: true, service: "tp-generator-server" });
});
 
app.get("/api/status", (_req, res) => {
  res.json(getStatus(getQueueLength()));
});
 
app.post("/api/generate-tp", ipThrottle, async (req, res) => {
  const { consigne, chapterId } = req.body || {};
 
  if (typeof consigne !== "string" || consigne.trim().length < 5) {
    return res.status(400).json({ error: "invalid_input", message: "Consigne manquante ou trop courte." });
  }
  if (consigne.length > 2000) {
    return res.status(400).json({ error: "invalid_input", message: "Consigne trop longue (2000 caractères max)." });
  }
  if (chapterId !== undefined && chapterId !== null && !/^ch[0-9]+$/.test(chapterId)) {
    return res.status(400).json({ error: "invalid_input", message: "Identifiant de chapitre invalide." });
  }
 
  const messages = buildMessages(consigne.trim(), chapterId || null);
 
  const { promise, positionAtEnqueue } = enqueue(() =>
    generateWithFallback(messages, { onProviderResult: recordProviderResult })
  );
 
  // Informe l'élève de sa position au moment de l'envoi (avant même le résultat),
  // utile pour le front s'il veut afficher "X élève(s) avant toi" immédiatement.
  res.setHeader("X-Queue-Position", String(positionAtEnqueue));
 
  try {
    const result = await promise;
    if (!result.ok) {
      const status = result.error === "rate_limited" ? 503 : 502;
      console.error("[generate-tp] échec des deux fournisseurs:", JSON.stringify(result.attempts));
      return res.status(status).json({
        error: result.error || "generation_failed",
        message:
          result.error === "missing_api_key"
            ? "Le serveur n'est pas encore configuré (clé API manquante)."
            : "Les deux fournisseurs IA sont indisponibles pour l'instant, réessaie dans un instant.",
        debug: result.attempts,
      });
    }
    return res.json({ tp: result.text, provider: result.provider });
  } catch (err) {
    console.error("[generate-tp] erreur inattendue:", err);
    return res.status(500).json({ error: "internal_error", message: "Erreur inattendue du serveur." });
  }
});
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`tp-generator-server à l'écoute sur le port ${PORT}`);
});
