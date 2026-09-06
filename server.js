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

// ---------- Limite quotidienne PAR ÉLÈVE (identifié par IP) ----------
// Pas de compte élève (pas d'auth) : l'IP sert d'identifiant approximatif,
// comme pour le délai de 12s ci-dessus. Chaque élève a droit à 20
// générations de TP et 20 d'exercice par jour, pour qu'un seul élève ne
// puisse pas épuiser le quota Groq/Mistral partagé par toute la classe en
// s'amusant à spammer le bouton "Générer" (demande explicite de Ben, session
// du 5 septembre 2026). Compteurs en mémoire par IP, remis à zéro chaque
// jour (date UTC) — se réinitialisent aussi à chaque redémarrage du serveur,
// ce qui est très bien pour un simple garde-fou anti-abus, pas une
// comptabilité stricte.
const DAILY_LIMIT_TP = Number(process.env.DAILY_LIMIT_TP || 20);
const DAILY_LIMIT_EXERCICE = Number(process.env.DAILY_LIMIT_EXERCICE || 20);
const dailyCountsByIp = new Map(); // ip -> { day, tp, exercice }

function getDailyCounters(ip) {
  const today = new Date().toISOString().slice(0, 10);
  let entry = dailyCountsByIp.get(ip);
  if (!entry || entry.day !== today) {
    entry = { day: today, tp: 0, exercice: 0 };
    dailyCountsByIp.set(ip, entry);
  }
  return entry;
}

function checkAndIncrementDailyLimit(ip, type) {
  const entry = getDailyCounters(ip);
  const limit = type === "tp" ? DAILY_LIMIT_TP : DAILY_LIMIT_EXERCICE;
  if (entry[type] >= limit) return false;
  entry[type]++;
  return true;
}

// Nettoyage périodique des entrées d'un jour révolu (une fois par heure
// suffit largement, pas besoin de plus fréquent pour un compteur quotidien).
setInterval(() => {
  const today = new Date().toISOString().slice(0, 10);
  for (const [ip, entry] of dailyCountsByIp) {
    if (entry.day !== today) dailyCountsByIp.delete(ip);
  }
}, 60 * 60 * 1000).unref();

// Recharge périodique du contexte (TP d'exemple ajoutés récemment) sans redéploiement.
setInterval(reloadContext, 5 * 60 * 1000).unref();

// ---------- Blocs de prompt partagés entre TP et exercices ----------

// Consigne de niveau, partagée entre TP et exercices (demande explicite de
// Ben, session du 5 septembre 2026) : cadre les outils mathématiques
// autorisés en BTS, quel que soit le chapitre — certains chapitres précisent
// déjà des limites plus fines dans leur résumé, mais ce rappel général évite
// tout dérapage vers un niveau prépa/licence par défaut.
function buildNiveauBlock() {
  return `Niveau attendu : BTS, jamais plus. Sauf si le résumé du chapitre l'autorise explicitement pour un point précis, NE JAMAIS faire intervenir :
- un calcul de dérivée ou d'intégrale à réaliser PAR L'ÉLÈVE (les résultats de ce type de calcul, s'ils sont nécessaires, sont à donner directement dans l'énoncé ou le Document, jamais à établir) ;
- une résolution d'équation différentielle (même logique : donner la solution si elle sert à la suite, ne jamais la demander) ;
- un calcul compliqué de module et d'argument d'un nombre complexe (racine carrée de somme de carrés, arctan...) — rester sur des cas simples (complexe réel pur, imaginaire pur, ou déjà sous forme module/argument) ou donner le résultat directement si le calcul n'est pas l'objectif pédagogique de la question.
Toujours ancrer la situation dans un contexte crédible et concret (application réelle, objet du quotidien, système industriel, dispositif médical...), jamais un montage abstrait présenté "hors sol" sans justification d'usage.

IMPÉRATIF — confinement au chapitre demandé : n'utilise QUE les notions, grandeurs et vocabulaire décrits dans "Chapitre concerné" ci-dessous. Ne fais JAMAIS intervenir une notion issue d'un AUTRE chapitre du programme, même si elle te semble naturelle ou que tu la connais par ailleurs (ex : ne jamais parler d'harmoniques/spectre/décomposition de Fourier si le chapitre demandé ne les mentionne pas — c'est une notion vue dans un chapitre ultérieur, l'élève ne l'a pas encore apprise à ce stade). La liste complète des chapitres donnée plus bas sert uniquement de repère général sur la progression du programme — ce n'est JAMAIS une source de contenu à mélanger avec le chapitre effectivement demandé. En cas de doute sur si une notion appartient bien au chapitre demandé, ne l'utilise pas.`;
}

function buildSchemasBlock(schemasSection) {
  return schemasSection
    ? `Banque de schémas électriques disponibles — quand un Document utile a besoin d'un schéma de montage, choisis celui qui correspond le mieux dans cette liste et insère UNIQUEMENT le marqueur "[SCHEMA:identifiant]" à cet endroit (rien d'autre autour, pas de description du schéma en plus) ; si aucun ne correspond, décris le montage en mots comme indiqué plus haut, n'invente jamais d'identifiant absent de cette liste :
${schemasSection}`
    : `Aucun schéma électrique n'est disponible dans la banque pour l'instant — décris toujours les montages en mots (jamais en ASCII-art), comme indiqué plus haut.`;
}

// Réglage "Calcul d'incertitude" choisi dans l'appli (menu déroulant, partagé
// entre TP et exercices) : 0 = aucun, 1 = un seul (défaut), "chaque" = à
// chaque mesure/question de calcul.
function buildIncertitudeBlocks(incertitude, uniteLabel) {
  const setting = incertitude === "0" || incertitude === "chaque" ? incertitude : "1";
  const countBlock =
    setting === "0"
      ? `Incertitudes : n'inclus AUCUN calcul ni question d'incertitude, même en fin d'exercice.`
      : setting === "chaque"
      ? `Incertitudes : calcule/demande l'incertitude sur chaque ${uniteLabel} importante (une question dédiée à chaque fois), pas seulement une fois.`
      : `Incertitudes : pas plus d'UNE question ou courte série de questions sur le calcul d'incertitude au total. Ne jamais la demander sur chaque ${uniteLabel} — c'est un exercice ponctuel, pas une routine à répéter.`;
  const methodBlock =
    setting === "0"
      ? ""
      : `Méthode de calcul d'incertitude — IMPÉRATIF, une seule méthode autorisée en BTS CIEL : la quadrature des incertitudes RELATIVES, valable pour toute grandeur qui s'écrit comme un produit/quotient de puissances des grandeurs mesurées (ex: Rx = R1 . (Ue - Us) / Us). Pour une grandeur G = X1^a1 . X2^a2 . ... (les a_i pouvant être 1, -1, 2...), la formule à utiliser SYSTÉMATIQUEMENT est :
  [FORMULE]\\frac{u(G)}{G} = \\sqrt{\\left(a_1\\frac{u(X_1)}{X_1}\\right)^2 + \\left(a_2\\frac{u(X_2)}{X_2}\\right)^2 + ...}[/FORMULE]
  N'utilise JAMAIS de propagation par dérivées (partielles ou non), de coefficients de sensibilité calculés, ni aucune autre méthode — même simplifiée ou présentée différemment. Si la grandeur étudiée n'est pas un produit/quotient de puissances des grandeurs mesurées (somme, différence isolée, fonction non polynomiale...), NE PROPOSE PAS de question de calcul d'incertitude dessus plutôt que d'improviser une autre méthode.
  Dans un Document théorique fourni au début (rappel de cours) : rappelle UNIQUEMENT cette formule générale telle quelle, SANS l'appliquer ni l'adapter aux grandeurs particulières du cas traité à ce stade — l'application numérique se fait uniquement dans la question dédiée décrite ci-dessus.`;
  return { setting, countBlock, methodBlock };
}

// Conventions de rendu texte -> PDF (MathJax pour les formules) : partagées
// telles quelles entre TP et exercices. `reponseContext` adapte juste le
// vocabulaire de la règle "ne réponds jamais à une question" selon qu'on est
// dans un TP (Manipulation/Exploitation) ou un exercice (Questions/Corrigé).
function buildNotationBlock(incertitude, reponseContext) {
  const { countBlock, methodBlock } = buildIncertitudeBlocks(incertitude, reponseContext.uniteLabel);
  return `Conventions de notation impératives dans le texte généré :
- Toute relation mathématique (formule, fonction de transfert, calcul d'incertitude, application numérique...) doit être isolée sur sa propre ligne, entourée du marqueur [FORMULE] au début et [/FORMULE] à la fin, rien d'autre sur cette ligne — SANS EXCEPTION, y compris pour une formule courte type "f = 1/T" ou "Ueff = Umax". Une formule laissée sans ce marqueur reste du texte brut illisible (ex: "racine((1)/(T)...)") au lieu d'un vrai rendu mathématique. Exemple : [FORMULE]U_s = U_e \\cdot \\frac{R_2}{R_1 + R_2}[/FORMULE].
- À L'INTÉRIEUR d'un bloc [FORMULE]...[/FORMULE] : utilise du LaTeX standard, normalement — \\frac{}{} pour les fractions, \\sqrt{} pour les racines, _{} pour les indices, ^{} pour les exposants, \\Omega/\\pi/\\Delta/\\sum pour les symboles grecs et opérateurs. C'est rendu par un vrai moteur mathématique (MathJax), donc pas besoin de simplifier ou d'éviter ces commandes : écris la formule comme tu l'écrirais naturellement en LaTeX.
- Notation d'incertitude : toujours "u(x)" avec de vraies parenthèses (jamais "u_x" en indice, qui se lirait comme une tout autre grandeur).
- ${countBlock}
${methodBlock ? "- " + methodBlock : ""}
- Ne réponds JAMAIS à une question que tu poses toi-même ${reponseContext.ou} : ${reponseContext.regle}
  MAUVAIS (interdit) : "2. Calculer la résistance de limitation R_LED nécessaire :" suivi immédiatement de [FORMULE]R_{LED} = \\frac{U_e - U_f}{I}[/FORMULE] — ceci EST la réponse à la question posée, donnée avant que l'élève ait cherché.
  BON (attendu) : soit ne rien mettre après la question (l'élève établit lui-même l'expression à partir de la loi d'Ohm/des lois de circuit déjà connues du cours), soit reformuler la question pour qu'elle porte sur autre chose que l'obtention de cette expression (ex: une fois l'expression établie PAR L'ÉLÈVE, lui demander de l'appliquer numériquement).
  Les formules données dans un Document théorique (rappels de cours généraux, lois, relations non spécifiques au cas traité) restent normales : la règle interdit uniquement de donner la réponse littérale à une question juste après l'avoir posée.
- EN DEHORS d'un bloc [FORMULE] (texte courant, listes, descriptions) : pas de moteur mathématique disponible, donc reste simple — accole directement la lettre et l'indice sans underscore ni accolade ("Us", "Ue", "R1", "R2", jamais "U_s", "R_1"), et écris toujours le symbole "Ω" pour une résistance (jamais "Ohm" en toutes lettres), par exemple "10 kΩ".`;
}

// ---------- Construction du prompt : TP ----------
function buildMessages(consigne, chapterId, duree, useStm32, incertitude, image, history) {
  const { chapterSection, chapterList, examplesSection, structureTemplate, courbesMarkdown, materiel, schemasSection } =
    buildContextBlock(chapterId);

  const schemasBlock = buildSchemasBlock(schemasSection);

  const dureeLabel = duree || "2h";
  const dureeBlock = `Durée de séance visée : ${dureeLabel}. Dimensionne le nombre et la profondeur des manipulations en conséquence : un TP de 1h doit être sensiblement plus court/ciblé qu'un TP de 3h (moins de parties, moins de mesures répétées), ne mets pas artificiellement le même contenu quelle que soit la durée.`;

  const stm32Block = useStm32
    ? `L'élève souhaite utiliser la carte STM32 Nucleo L152RE pour ce TP. Si tu choisis de l'utiliser dans le montage, tu DOIS impérativement inclure dans les Documents utiles le marqueur "[SCHEMA:stm32-l152re-pinout]" pour montrer son brochage — ne décris jamais son brochage en mots ou en ASCII-art à la place. Si finalement tu n'utilises pas cette carte pour ce TP, ignore cette consigne.`
    : "";

  const imageBlock = image
    ? `L'élève a joint une image à sa consigne (par exemple une photo d'un composant, une page de datasheet, un schéma existant). Prends-la en compte pour construire le TP : si elle montre un composant ou montage précis, base le TP dessus ; si c'est une datasheet, appuie-toi sur les valeurs qui y figurent plutôt que d'en inventer.`
    : "";

  const niveauBlock = buildNiveauBlock();
  const notationBlock = buildNotationBlock(incertitude, {
    uniteLabel: "mesure",
    ou: "dans le TP",
    regle: "une question de manipulation ou d'exploitation doit rester une question, sans donner juste après le résultat, la formule-réponse ou la démonstration attendue (ça retire tout l'intérêt pédagogique) — même sous forme de \"formule à utiliser\" présentée juste après la question comme si c'était une aide neutre : si cette formule EST la réponse demandée (l'expression littérale qu'on demande d'établir), c'est interdit.",
  });

  const systemPrompt = `Tu aides des élèves de BTS CIEL (Conception et Intégration de Systèmes Électroniques) à construire eux-mêmes leur propre TP de physique appliquée, à partir d'une consigne qu'ils te donnent.

Cadrage à respecter en priorité (mais tu peux t'en écarter si l'élève demande explicitement autre chose — ce cadrage est une aide, pas une limite stricte) :
- IMPÉRATIF : ta réponse doit commencer, dès le tout premier caractère, par "Titre : " suivi du titre du TP. Rien avant — ni commentaire, ni introduction, ni "Voici ton TP", ni ligne vide, ni signe de ponctuation isolé. Exemple de tout premier début de réponse : "Titre : Étude d'un filtre passe-bas du premier ordre".
- Ta réponse ne contient QUE le TP lui-même, du titre jusqu'à la dernière question d'exploitation. N'ajoute aucun commentaire avant ou après (ex: pas de "N'hésite pas à demander de l'aide", pas de résumé final, pas de note personnelle) — rien que le contenu du TP.
- Si l'élève demande une modification par rapport à un TP déjà généré plus haut dans cette conversation (ex: "refais la partie 2 différemment"), renvoie la VERSION COMPLÈTE et à jour du TP entier (du titre à la dernière question), pas seulement le fragment modifié — avec exactement les mêmes règles de mise en forme que pour une génération initiale (toujours commencer par "Titre : ", aucun commentaire).
- Appuie-toi sur le cours réellement enseigné, résumé ci-dessous.
- Les TP d'exemple du professeur fournis ci-dessous servent UNIQUEMENT à calibrer le niveau de difficulté et l'étendue de ce qui est attendu d'un élève de ce niveau — jamais leur mise en forme ni leur structure, qui ne doivent jamais être reproduites : la structure imposée ci-dessous prévaut toujours, quelle que soit celle des exemples.
- Éviter de faire reposer le TP sur de longs calculs analytiques : privilégier la manipulation, l'observation et l'analyse conceptuelle des résultats. Des calculs simples et ponctuels sont bienvenus, pas des développements longs qui font perdre le fil de la manipulation.
- Registre neutre, académique, adapté à un élève de BTS (pas de familiarité, pas de tutoiement excessif dans le contenu du TP lui-même).
- ${dureeBlock}
${stm32Block ? "- " + stm32Block : ""}
${imageBlock ? "- " + imageBlock : ""}

${niveauBlock}

${notationBlock}

${structureTemplate}

${courbesMarkdown}

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

  // Historique de la conversation pour ce TP (demandes de correction
  // ultérieures, session du 5 septembre 2026) : le système reconstruit ce
  // même systemPrompt à chaque appel (déterministe à partir des mêmes
  // chapterId/duree/useStm32/incertitude), donc il forme un préfixe identique
  // d'une requête à l'autre — utile pour le cache automatique de Groq.
  const priorMessages = Array.isArray(history) ? history : [];

  return [
    { role: "system", content: systemPrompt },
    ...priorMessages,
    { role: "user", content: userContent },
  ];
}

// ---------- Construction du prompt : Exercice ----------
function buildExerciceMessages(consigne, chapterId, image, history) {
  const { chapterSection, chapterList, exercisesExamplesSection, structureTemplateExercice, courbesMarkdown, schemasSection } =
    buildContextBlock(chapterId);

  const schemasBlock = buildSchemasBlock(schemasSection);

  // Un seul exercice à la fois (demande explicite de Ben, session du 5
  // septembre 2026 — le choix "plusieurs exercices" a été retiré de l'appli,
  // en partie pour limiter la consommation de tokens par génération).
  const nombreBlock = `Génère UN SEUL exercice. Si le chapitre demandé se prête naturellement à une étude de courbe (lecture/interprétation d'un diagramme de Bode, d'un chronogramme, d'une constellation...), privilégie ce type de question via le marqueur [COURBE:...] (voir la liste des types disponibles fournie séparément) plutôt qu'un exercice purement calculatoire — sans pour autant forcer une courbe hors sujet si le chapitre ne s'y prête pas.`;

  const imageBlock = image
    ? `L'élève a joint une image à sa consigne (par exemple une photo d'un composant, une page de datasheet, un schéma existant). Prends-la en compte pour construire l'exercice : si elle montre un composant ou montage précis, base l'exercice dessus ; si c'est une datasheet, appuie-toi sur les valeurs qui y figurent plutôt que d'en inventer.`
    : "";

  const niveauBlock = buildNiveauBlock();
  // Incertitude : TOUJOURS désactivée pour les exercices (demande explicite
  // de Ben, session du 5 septembre 2026) — contrairement au TP, pas de menu
  // au choix ici, "0" est forcé quoi qu'il arrive.
  const notationBlock = buildNotationBlock("0", {
    uniteLabel: "question de calcul",
    ou: "dans les Questions",
    regle: "une question doit rester une question, sans donner juste après le résultat, la formule-réponse ou la démonstration attendue — même sous forme de \"formule à utiliser\" présentée comme une aide neutre : si cette formule EST la réponse demandée, c'est interdit. Cette règle ne s'applique QU'À la section Questions : le Corrigé, lui, doit au contraire répondre complètement à chaque question, en détail, avec le raisonnement et les applications numériques.",
  });

  const systemPrompt = `Tu aides des élèves de BTS CIEL (Conception et Intégration de Systèmes Électroniques) à s'entraîner en générant un exercice de physique appliquée à résoudre sur le papier, à partir d'une consigne qu'ils te donnent. Contrairement à un TP, il n'y a pas de matériel physique ni de manipulation — c'est un problème avec un corrigé détaillé fourni à la fin, que l'élève peut consulter pour se corriger après avoir cherché.

Cadrage à respecter en priorité (mais tu peux t'en écarter si l'élève demande explicitement autre chose — ce cadrage est une aide, pas une limite stricte) :
- IMPÉRATIF : ta réponse doit commencer, dès le tout premier caractère, par "Titre : " suivi du titre de l'exercice. Rien avant — ni commentaire, ni introduction, ni ligne vide.
- Ta réponse ne contient QUE l'exercice (ou les exercices) lui-même, du titre jusqu'au dernier Corrigé. N'ajoute aucun commentaire avant ou après.
- Si l'élève demande une modification par rapport à un exercice déjà généré plus haut dans cette conversation, renvoie la VERSION COMPLÈTE et à jour (du titre au Corrigé), pas seulement le fragment modifié.
- ${nombreBlock}
- Appuie-toi sur le cours réellement enseigné, résumé ci-dessous.
- Registre neutre, académique, adapté à un élève de BTS.
${imageBlock ? "- " + imageBlock : ""}

${niveauBlock}

${notationBlock}

${structureTemplateExercice}

${courbesMarkdown}

${schemasBlock}

${chapterSection}

Liste complète des chapitres du programme (pour te situer si l'élève ne précise pas de chapitre, ou mentionne un autre chapitre que celui indiqué) :
${chapterList}

Exercices déjà présents dans le cours de ce chapitre — servent UNIQUEMENT à calibrer le niveau de difficulté et le style de question attendu à ce niveau, jamais à être recopiés ni reformulés à l'identique : génère toujours une situation différente (autres valeurs, autre contexte), jamais une simple reformulation de l'un de ces exemples :
${exercisesExamplesSection}`;

  const userContent = image
    ? [
        { type: "text", text: consigne },
        { type: "image_url", image_url: { url: image } },
      ]
    : consigne;

  const priorMessages = Array.isArray(history) ? history : [];

  return [
    { role: "system", content: systemPrompt },
    ...priorMessages,
    { role: "user", content: userContent },
  ];
}

// ---------- Endpoints ----------

app.get("/", (_req, res) => {
  res.json({ ok: true, service: "tp-generator-server" });
});

app.get("/api/status", (req, res) => {
  const counters = getDailyCounters(req.ip);
  res.json({
    ...getStatus(getQueueLength()),
    dailyLimits: {
      tp: { used: counters.tp, limit: DAILY_LIMIT_TP },
      exercice: { used: counters.exercice, limit: DAILY_LIMIT_EXERCICE },
    },
  });
});

// Une image trop lourde ralentit inutilement la génération et gaspille le quota
// (les tokens image comptent aussi) — 4 Mo de base64 correspond à une image déjà
// bien compressée côté client (voir app.js, qui redimensionne avant envoi).
const MAX_IMAGE_BASE64_CHARS = 4 * 1024 * 1024;

// Historique de conversation (demande de correction d'un TP/exercice déjà
// généré) — pas de limite stricte sur le nombre d'échanges pour l'instant
// (décision du 5 septembre 2026, à revoir si l'usage réel pose problème),
// mais on valide quand même la forme pour éviter un payload absurde/corrompu.
// Renvoie { ok:true, value } ou { ok:false, message }.
function validateHistory(history) {
  if (history === undefined || history === null) return { ok: true, value: undefined };
  if (!Array.isArray(history) || history.length > 60) {
    return { ok: false, message: "Historique de conversation invalide." };
  }
  for (const msg of history) {
    if (
      !msg ||
      typeof msg !== "object" ||
      !["user", "assistant"].includes(msg.role) ||
      typeof msg.content !== "string" ||
      msg.content.length > 20000
    ) {
      return { ok: false, message: "Historique de conversation invalide." };
    }
  }
  return { ok: true, value: history };
}

app.post("/api/generate-tp", ipThrottle, async (req, res) => {
  const { consigne, chapterId, duree, useStm32, incertitude, image, history } = req.body || {};

  if (typeof consigne !== "string" || consigne.trim().length < 5) {
    return res.status(400).json({ error: "invalid_input", message: "Consigne manquante ou trop courte." });
  }
  if (consigne.length > 2000) {
    return res.status(400).json({ error: "invalid_input", message: "Consigne trop longue (2000 caractères max)." });
  }
  if (chapterId !== undefined && chapterId !== null && !/^ch[0-9]+$/.test(chapterId)) {
    return res.status(400).json({ error: "invalid_input", message: "Identifiant de chapitre invalide." });
  }
  // Chapitre obligatoire (demande explicite de Ben, session du 5 septembre
  // 2026) : sans lui, l'IA générait "dans le vide", avec sa seule
  // connaissance générale et aucun repère sur le cours réellement enseigné.
  if (!chapterId) {
    return res.status(400).json({ error: "invalid_input", message: "Chapitre manquant — indispensable pour générer un TP cohérent avec le cours." });
  }
  if (duree !== undefined && !["1h", "2h", "3h"].includes(duree)) {
    return res.status(400).json({ error: "invalid_input", message: "Durée invalide." });
  }
  if (incertitude !== undefined && !["0", "1", "chaque"].includes(incertitude)) {
    return res.status(400).json({ error: "invalid_input", message: "Réglage d'incertitude invalide." });
  }
  if (image !== undefined && image !== null) {
    if (typeof image !== "string" || !/^data:image\/(png|jpe?g|webp);base64,/.test(image)) {
      return res.status(400).json({ error: "invalid_input", message: "Format d'image invalide." });
    }
    if (image.length > MAX_IMAGE_BASE64_CHARS) {
      return res.status(400).json({ error: "invalid_input", message: "Image trop lourde." });
    }
  }
  const historyCheck = validateHistory(history);
  if (!historyCheck.ok) {
    return res.status(400).json({ error: "invalid_input", message: historyCheck.message });
  }
  if (!checkAndIncrementDailyLimit(req.ip, "tp")) {
    return res.status(429).json({
      error: "daily_limit_reached",
      message: `Tu as atteint la limite de ${DAILY_LIMIT_TP} générations de TP par jour — réessaie demain.`,
    });
  }

  const messages = buildMessages(consigne.trim(), chapterId || null, duree || "2h", !!useStm32, incertitude || "1", image || null, historyCheck.value);

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

app.post("/api/generate-exercice", ipThrottle, async (req, res) => {
  const { consigne, chapterId, image, history } = req.body || {};

  if (typeof consigne !== "string" || consigne.trim().length < 5) {
    return res.status(400).json({ error: "invalid_input", message: "Consigne manquante ou trop courte." });
  }
  if (consigne.length > 2000) {
    return res.status(400).json({ error: "invalid_input", message: "Consigne trop longue (2000 caractères max)." });
  }
  if (chapterId !== undefined && chapterId !== null && !/^ch[0-9]+$/.test(chapterId)) {
    return res.status(400).json({ error: "invalid_input", message: "Identifiant de chapitre invalide." });
  }
  if (!chapterId) {
    return res.status(400).json({ error: "invalid_input", message: "Chapitre manquant — indispensable pour générer un exercice cohérent avec le cours." });
  }
  if (image !== undefined && image !== null) {
    if (typeof image !== "string" || !/^data:image\/(png|jpe?g|webp);base64,/.test(image)) {
      return res.status(400).json({ error: "invalid_input", message: "Format d'image invalide." });
    }
    if (image.length > MAX_IMAGE_BASE64_CHARS) {
      return res.status(400).json({ error: "invalid_input", message: "Image trop lourde." });
    }
  }
  const historyCheck = validateHistory(history);
  if (!historyCheck.ok) {
    return res.status(400).json({ error: "invalid_input", message: historyCheck.message });
  }
  if (!checkAndIncrementDailyLimit(req.ip, "exercice")) {
    return res.status(429).json({
      error: "daily_limit_reached",
      message: `Tu as atteint la limite de ${DAILY_LIMIT_EXERCICE} générations d'exercice par jour — réessaie demain.`,
    });
  }

  const messages = buildExerciceMessages(
    consigne.trim(),
    chapterId || null,
    image || null,
    historyCheck.value
  );

  const { promise, positionAtEnqueue } = enqueue(() =>
    generateWithFallback(messages, { onProviderResult: recordProviderResult, hasImage: !!image })
  );

  res.setHeader("X-Queue-Position", String(positionAtEnqueue));

  try {
    const result = await promise;
    if (!result.ok) {
      const status = result.error === "rate_limited" ? 503 : 502;
      console.error("[generate-exercice] échec des deux fournisseurs:", JSON.stringify(result.attempts));
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
    console.error("[generate-exercice] erreur inattendue:", err);
    return res.status(500).json({ error: "internal_error", message: "Erreur inattendue du serveur." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`tp-generator-server à l'écoute sur le port ${PORT}`);
});
