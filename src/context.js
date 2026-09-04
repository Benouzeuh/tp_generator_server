// src/context.js
// Charge le "cadrage" injecté dans le prompt système : la méta des chapitres (générée
// automatiquement depuis data.js par scripts/sync-chapters.js, jamais éditée à la main)
// et les TP d'exemple du prof (déposés à la main dans context/example-tp/, aucune
// modification de code nécessaire pour en ajouter).
//
// Convention de nommage pour les TP d'exemple : "chXX-titre-libre.md" ou "chXX-....txt".
// Le préfixe "chXX" (ex: ch4, ch12, ch22) sert à proposer en priorité les exemples du
// même chapitre que la demande de l'élève. Un fichier sans préfixe "chXX-" reconnu est
// simplement traité comme un exemple générique (toujours utilisable, jamais ignoré).
 
const fs = require("fs");
const path = require("path");
 
const CHAPTERS_META_PATH = path.join(__dirname, "..", "context", "chapters-meta.json");
const EXAMPLE_TP_DIR = path.join(__dirname, "..", "context", "example-tp");
 
let cachedChaptersMeta = null;
let cachedExampleTp = null;
 
function loadChaptersMeta() {
  if (cachedChaptersMeta) return cachedChaptersMeta;
  try {
    const raw = fs.readFileSync(CHAPTERS_META_PATH, "utf8");
    cachedChaptersMeta = JSON.parse(raw);
  } catch (err) {
    console.warn(
      `[context] Impossible de lire ${CHAPTERS_META_PATH} (${err.message}). ` +
        `Lancer "npm run sync-chapters -- /chemin/vers/data.js" pour le générer.`
    );
    cachedChaptersMeta = [];
  }
  return cachedChaptersMeta;
}
 
function loadExampleTp() {
  if (cachedExampleTp) return cachedExampleTp;
  cachedExampleTp = [];
  let files = [];
  try {
    // Seuls les fichiers "chXX-....md/.txt" ou "generique-....md/.txt" sont de vrais
    // TP d'exemple — ça exclut automatiquement le README.md explicatif du dossier
    // (destiné au prof, pas à l'IA) sans que le prof ait à y penser.
    files = fs
      .readdirSync(EXAMPLE_TP_DIR)
      .filter((f) => /^(ch[a-z0-9]+|generique)-.+\.(md|txt)$/i.test(f));
  } catch (err) {
    console.warn(`[context] Dossier ${EXAMPLE_TP_DIR} illisible (${err.message}).`);
    return cachedExampleTp;
  }
 
  for (const file of files) {
    const match = file.match(/^(ch[a-z0-9]+)-/i);
    const content = fs.readFileSync(path.join(EXAMPLE_TP_DIR, file), "utf8").trim();
    if (!content) continue;
    cachedExampleTp.push({
      file,
      chapterId: match ? match[1].toLowerCase() : null,
      content,
    });
  }
  return cachedExampleTp;
}
 
/** Vide le cache — utile si on ajoute des fichiers sans redémarrer le serveur. */
function reloadContext() {
  cachedChaptersMeta = null;
  cachedExampleTp = null;
}
 
/**
 * Construit le bloc de contexte à injecter dans le prompt système, ciblé sur un
 * chapitre si précisé, sinon générique (liste complète condensée des chapitres).
 */
function buildContextBlock(chapterId) {
  const chapters = loadChaptersMeta();
  const examples = loadExampleTp();
 
  let chapterSection;
  if (chapterId) {
    const chap = chapters.find((c) => c.id === chapterId);
    chapterSection = chap
      ? `Chapitre concerné : ${chap.title} (${chap.id}).\nRésumé du cours : ${chap.summary}`
      : `Chapitre "${chapterId}" non reconnu — s'appuyer sur la liste générale des chapitres ci-dessous.`;
  } else {
    chapterSection = "Aucun chapitre précis indiqué par l'élève.";
  }
 
  const chapterList = chapters
    .map((c) => `- ${c.id} — ${c.title} : ${c.summary}`)
    .join("\n");
 
  // Priorité aux exemples du même chapitre, complétés par des exemples génériques
  // si moins de 2 trouvés, pour toujours donner au moins un peu de style de référence.
  const matching = chapterId ? examples.filter((e) => e.chapterId === chapterId) : [];
  const generic = examples.filter((e) => !matching.includes(e));
  const chosen = [...matching, ...generic].slice(0, 2);
 
  const examplesSection = chosen.length
    ? chosen
        .map((e, i) => `--- Exemple de TP du professeur n°${i + 1} (${e.file}) ---\n${e.content}`)
        .join("\n\n")
    : "(Aucun TP d'exemple disponible pour l'instant — le professeur n'en a pas encore déposé.)";
 
  return { chapterSection, chapterList, examplesSection };
}
 
module.exports = { loadChaptersMeta, loadExampleTp, reloadContext, buildContextBlock };
 
