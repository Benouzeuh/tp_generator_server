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
// 20kb suffisait pour texte seul ; une image compressée en base64 peut peser
// quelques centaines de Ko, d'où la limite plus généreuse (bornée côté validation
// applicative juste en dessous, voir MAX_IMAGE_BASE64_CHARS).
app.use(express.json({ limit: "6mb" }));

// ---------- CORS ----------
// ALLOWED_ORIGINS="*" en développement, sinon liste séparée par des virgules
// (ex: "https://revision-bts-ciel.netlify.app"). Ne pas laisser "*" une fois l'URL
// Netlify connue : ça limite qui peut appeler ce serveur (et donc consommer le quota).
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "*").split(",").map((s) => s.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Pas d'en-tête Origin (curl, Postman) OU origine "null" (fichier local ouvert en
      // double-clic, cas fréquent pour tester l'aperçu HTML de l'appli) : toujours autorisé,
      // ce n'est jamais un vrai site tiers qui essaierait d'abuser du quota.
      if (!origin || origin === "null") return callback(null, true);
      if (allowedOrigins.includes("*")) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origine non autorisée par CORS"));
    },
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
function buildMessages(consigne, chapterId, duree, useStm32, image) {
  const { chapterSection, chapterList, examplesSection, structureTemplate, materiel, schemasSection } =
    buildContextBlock(chapterId);

  const schemasBlock = schemasSection
    ? `Banque de schémas électriques disponibles — quand un Document utile a besoin d'un schéma de montage, choisis celui qui correspond le mieux dans cette liste et insère UNIQUEMENT le marqueur "[SCHEMA:identifiant]" à cet endroit (rien d'autre autour, pas de description du schéma en plus) ; si aucun ne correspond, décris le montage en mots comme indiqué plus haut, n'invente jamais d'identifiant absent de cette liste :
${schemasSection}`
    : `Aucun schéma électrique n'est disponible dans la banque pour l'instant — décris toujours les montages en mots (jamais en ASCII-art), comme indiqué plus haut.`;

  const dureeLabel = duree || "2h";
  const dureeBlock = `Durée de séance visée : ${dureeLabel}. Dimensionne le nombre et la profondeur des manipulations en conséquence : un TP de 1h doit être sensiblement plus court/ciblé qu'un TP de 3h (moins de parties, moins de mesures répétées), ne mets pas artificiellement le même contenu quelle que soit la durée.`;

  const stm32Block = useStm32
    ? `L'élève souhaite utiliser la carte STM32 Nucleo L152RE pour ce TP. Si tu choisis de l'utiliser dans le montage, tu DOIS impérativement inclure dans les Documents utiles le marqueur "[SCHEMA:stm32-l152re-pinout]" pour montrer son brochage — ne décris jamais son brochage en mots ou en ASCII-art à la place. Si finalement tu n'utilises pas cette carte pour ce TP, ignore cette consigne.`
    : "";

  const imageBlock = image
    ? `L'élève a joint une image à sa consigne (par exemple une photo d'un composant, une page de datasheet, un schéma existant). Prends-la en compte pour construire le TP : si elle montre un composant ou montage précis, base le TP dessus ; si c'est une datasheet, appuie-toi sur les valeurs qui y figurent plutôt que d'en inventer.`
    : "";

  // Conventions de rendu texte -> PDF : l'appli sait maintenant afficher un
  // vrai indice compact (Us, R1...), le symbole Ω, et un encadré de mise en
  // évidence pour les relations mathématiques, mais seulement si le modèle
  // respecte ces quelques conventions à l'écriture (voir session du 5
  // septembre 2026 avec Ben : corrections du moteur PDF de renderTpToPdf).
  const notationBlock = `Conventions de notation impératives dans le texte généré :
- Indices de variables physiques : accole directement la lettre et l'indice, sans underscore ni accolade (écris "Us", "Ue", "R1", "R2", "Imax" — jamais "U_s", "R_1", "I_max", "U_{s}").
- Unité de résistance : écris toujours le symbole "Ω" (jamais "Ohm" ni "ohm" en toutes lettres). Exemple : "10 kΩ", "220 Ω".
- Toute relation mathématique (formule, fonction de transfert, calcul d'incertitude, application numérique...) doit être isolée sur sa propre ligne, entourée du marqueur [FORMULE] au début et [/FORMULE] à la fin, rien d'autre sur cette ligne. Exemple : [FORMULE]Us = Ue . R2/(R1 + R2)[/FORMULE]. Ne mets jamais une formule au milieu d'une phrase ni entre symboles $ ou \\( \\).`;

  const systemPrompt = `Tu aides des élèves de BTS CIEL (Conception et Intégration de Systèmes Électroniques) à construire eux-mêmes leur propre TP de physique appliquée, à partir d'une consigne qu'ils te donnent.

Cadrage à respecter en priorité (mais tu peux t'en écarter si l'élève demande explicitement autre chose — ce cadrage est une aide, pas une limite stricte) :
- Appuie-toi sur le cours réellement enseigné, résumé ci-dessous.
- Les TP d'exemple du professeur fournis ci-dessous servent UNIQUEMENT à calibrer le niveau de difficulté et l'étendue de ce qui est attendu d'un élève de ce niveau — jamais leur mise en forme ni leur structure, qui ne doivent jamais être reproduites : la structure imposée ci-dessous prévaut toujours, quelle que soit celle des exemples.
- Éviter de faire reposer le TP sur de longs calculs analytiques : privilégier la manipulation, l'observation et l'analyse conceptuelle des résultats. Des calculs simples et ponctuels sont bienvenus, pas des développements longs qui font perdre le fil de la manipulation.
- Registre neutre, académique, adapté à un élève de BTS (pas de familiarité, pas de tutoiement excessif dans le contenu du TP lui-même).
- ${dureeBlock}
${stm32Block ? "- " + stm32Block : ""}
${imageBlock ? "- " + imageBlock : ""}

${notationBlock}

${structureTemplate}

Matériel réellement disponible en salle — le matériel proposé dans le TP (section "Matériel" et schémas) doit être choisi dans cette liste en priorité ; ne pas inventer de référence ou de valeur absente de cette liste, sauf si l'élève en demande explicitement une précise :
${materiel}

${schemasBlock}

${chapterSection}

Liste complète des chapitres du programme (pour te situer si l'élève ne précise pas de chapitre, ou mentionne un autre chapitre que celui indiqué) :
${chapterList}

${examplesSection}`;

  const userContent = image
    ? [
        { type: "text", text: consigne },
        { type: "image_url", image_url: { url: image } },
      ]
    : consigne;

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userContent },
  ];
}

// ---------- Endpoints ----------

app.get("/", (_req, res) => {
  res.json({ ok: true, service: "tp-generator-server" });
});

app.get("/api/status", (_req, res) => {
  res.json(getStatus(getQueueLength()));
});

// Une image trop lourde ralentit inutilement la génération et gaspille le quota
// (les tokens image comptent aussi) — 4 Mo de base64 correspond à une image déjà
// bien compressée côté client (voir app.js, qui redimensionne avant envoi).
const MAX_IMAGE_BASE64_CHARS = 4 * 1024 * 1024;

app.post("/api/generate-tp", ipThrottle, async (req, res) => {
  const { consigne, chapterId, duree, useStm32, image } = req.body || {};

  if (typeof consigne !== "string" || consigne.trim().length < 5) {
    return res.status(400).json({ error: "invalid_input", message: "Consigne manquante ou trop courte." });
  }
  if (consigne.length > 2000) {
    return res.status(400).json({ error: "invalid_input", message: "Consigne trop longue (2000 caractères max)." });
  }
  if (chapterId !== undefined && chapterId !== null && !/^ch[0-9]+$/.test(chapterId)) {
    return res.status(400).json({ error: "invalid_input", message: "Identifiant de chapitre invalide." });
  }
  if (duree !== undefined && !["1h", "2h", "3h"].includes(duree)) {
    return res.status(400).json({ error: "invalid_input", message: "Durée invalide." });
  }
  if (image !== undefined && image !== null) {
    if (typeof image !== "string" || !/^data:image\/(png|jpe?g|webp);base64,/.test(image)) {
      return res.status(400).json({ error: "invalid_input", message: "Format d'image invalide." });
    }
    if (image.length > MAX_IMAGE_BASE64_CHARS) {
      return res.status(400).json({ error: "invalid_input", message: "Image trop lourde." });
    }
  }

  const messages = buildMessages(consigne.trim(), chapterId || null, duree || "2h", !!useStm32, image || null);

  const { promise, positionAtEnqueue } = enqueue(() =>
    generateWithFallback(messages, { onProviderResult: recordProviderResult, hasImage: !!image })
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
