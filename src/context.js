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
const STRUCTURE_TEMPLATE_PATH = path.join(__dirname, "..", "context", "structure-template.md");
const STRUCTURE_TEMPLATE_EXERCICE_PATH = path.join(__dirname, "..", "context", "structure-template-exercice.md");
const MATERIEL_PATH = path.join(__dirname, "..", "context", "materiel-disponible.md");
const SCHEMAS_CATALOGUE_PATH = path.join(__dirname, "..", "context", "schemas-catalogue.json");
// Documentation du marqueur [COURBE:...] : extraite de structure-template.md
// (session du 5 septembre 2026) pour être partagée telle quelle entre le
// générateur de TP et le futur générateur d'exercices, sans dupliquer son
// contenu à chaque fois qu'un nouveau type de courbe est ajouté.
const COURBES_MARKDOWN_PATH = path.join(__dirname, "..", "context", "marqueurs-courbes.md");
// Exercices déjà présents dans le cours de l'appli (extraits automatiquement
// par scripts/sync-exercises.js depuis cours.js + data.js) — servent
// d'exemples de calibration pour le générateur d'exercices, comme les TP
// d'exemple pour le générateur de TP, mais sans besoin de rédaction manuelle
// puisqu'ils existent déjà. Chapitres 19/20/21 (CNED) déjà exclus par le script.
const EXERCISES_EXISTANTS_PATH = path.join(__dirname, "..", "context", "exercises-existants.json");
 
let cachedSchemas = null;
 
let cachedStructureTemplate = null;
let cachedStructureTemplateExercice = null;
let cachedMateriel = null;
let cachedCourbesMarkdown = null;
let cachedExercisesExistants = null;
 
function loadExercisesExistants() {
  if (cachedExercisesExistants) return cachedExercisesExistants;
  try {
    cachedExercisesExistants = JSON.parse(fs.readFileSync(EXERCISES_EXISTANTS_PATH, "utf8"));
  } catch (err) {
    console.warn(
      `[context] Impossible de lire ${EXERCISES_EXISTANTS_PATH} (${err.message}). ` +
        `Lancer "npm run sync-exercises -- /chemin/vers/cours.js /chemin/vers/data.js" pour le générer.`
    );
    cachedExercisesExistants = {};
  }
  return cachedExercisesExistants;
}
 
function loadStructureTemplate() {
  if (cachedStructureTemplate) return cachedStructureTemplate;
  try {
    cachedStructureTemplate = fs.readFileSync(STRUCTURE_TEMPLATE_PATH, "utf8").trim();
  } catch (err) {
    console.warn(`[context] Impossible de lire ${STRUCTURE_TEMPLATE_PATH} (${err.message}).`);
    cachedStructureTemplate = "";
  }
  return cachedStructureTemplate;
}
 
function loadStructureTemplateExercice() {
  if (cachedStructureTemplateExercice) return cachedStructureTemplateExercice;
  try {
    cachedStructureTemplateExercice = fs.readFileSync(STRUCTURE_TEMPLATE_EXERCICE_PATH, "utf8").trim();
  } catch (err) {
    console.warn(`[context] Impossible de lire ${STRUCTURE_TEMPLATE_EXERCICE_PATH} (${err.message}).`);
    cachedStructureTemplateExercice = "";
  }
  return cachedStructureTemplateExercice;
}
 
function loadCourbesMarkdown() {
  if (cachedCourbesMarkdown) return cachedCourbesMarkdown;
  try {
    cachedCourbesMarkdown = fs.readFileSync(COURBES_MARKDOWN_PATH, "utf8").trim();
  } catch (err) {
    console.warn(`[context] Impossible de lire ${COURBES_MARKDOWN_PATH} (${err.message}).`);
    cachedCourbesMarkdown = "";
  }
  return cachedCourbesMarkdown;
}
 
// Chapitre -> numéro(s) de phase de courbes concernée(s), reprend exactement
// le mapping de la section "Utilise activement ces courbes" du fichier.
const CHAPITRE_VERS_PHASES_COURBES = {
  ch3: [1], ch5: [1],
  ch7: [2], ch8: [2], ch9: [2],
  ch13: [3],
  ch17: [4],
  ch16: [5],
  ch19: [6],
};
 
// Ne garde que les phases de courbes pertinentes pour le chapitre demandé
// (intro + phases concernées + section finale "Utilise activement"), plutôt
// que d'envoyer systématiquement les 6 phases en entier — deuxième plus gros
// poste du prompt après les schémas (session du 6 septembre 2026). Pour un
// chapitre absent du mapping ci-dessus (usage de courbe possible mais non
// systématique), on garde tout le document par sécurité plutôt que de risquer
// de priver l'IA d'un type de courbe qui serait en fait pertinent.
function getCourbesMarkdownForChapter(chapterId) {
  const full = loadCourbesMarkdown();
  // Chapitre non cartographié : repli sur la phase 1 uniquement (signaux
  // génériques, la plus largement réutilisable en dehors des cas déjà
  // identifiés) plutôt que le document complet — un chapitre non listé ici a
  // rarement besoin d'un type de courbe très spécialisé (Bode, modulation...).
  const phases = CHAPITRE_VERS_PHASES_COURBES[chapterId] || [1];
 
  const introEnd = full.indexOf("Types disponibles (phase 1)");
  const utiliseStart = full.indexOf("## Utilise activement ces courbes");
  if (introEnd === -1 || utiliseStart === -1) return full; // format inattendu -> repli sécurisé
 
  const intro = full.slice(0, introEnd).trim();
  const utiliseSection = full.slice(utiliseStart).trim();
  const phasesBlockRaw = full.slice(introEnd, utiliseStart);
 
  // Découpe le bloc des phases sur chaque en-tête "Type(s) disponible(s) (phase N..."
  const phaseHeaderRe = /Types? disponibles? \(phase (\d)[^)]*\)\s*:/g;
  const matches = [...phasesBlockRaw.matchAll(phaseHeaderRe)];
  const kept = [];
  matches.forEach((m, i) => {
    const num = Number(m[1]);
    if (!phases.includes(num)) return;
    const start = m.index;
    const end = i + 1 < matches.length ? matches[i + 1].index : phasesBlockRaw.length;
    kept.push(phasesBlockRaw.slice(start, end).trim());
  });
 
  return [intro, ...kept, utiliseSection].join("\n\n");
}
 
function loadMateriel() {
  if (cachedMateriel) return cachedMateriel;
  try {
    cachedMateriel = fs.readFileSync(MATERIEL_PATH, "utf8").trim();
  } catch (err) {
    console.warn(`[context] Impossible de lire ${MATERIEL_PATH} (${err.message}).`);
    cachedMateriel = "";
  }
  return cachedMateriel;
}
 
function loadSchemas() {
  if (cachedSchemas) return cachedSchemas;
  try {
    const raw = fs.readFileSync(SCHEMAS_CATALOGUE_PATH, "utf8");
    cachedSchemas = JSON.parse(raw);
  } catch (err) {
    console.warn(
      `[context] Impossible de lire ${SCHEMAS_CATALOGUE_PATH} (${err.message}). ` +
        `Lancer "npm run sync-schemas -- /chemin/vers/schemas.js" pour le générer.`
    );
    cachedSchemas = [];
  }
  return cachedSchemas;
}
 
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
  cachedStructureTemplate = null;
  cachedStructureTemplateExercice = null;
  cachedCourbesMarkdown = null;
  cachedMateriel = null;
  cachedSchemas = null;
  cachedExercisesExistants = null;
}
 
/**
 * Construit le bloc de contexte à injecter dans le prompt système, ciblé sur un
 * chapitre si précisé, sinon générique (liste complète condensée des chapitres).
 */
function buildContextBlock(chapterId) {
  const chapters = loadChaptersMeta();
  const examples = loadExampleTp();
  const schemas = loadSchemas();
  const exercisesByChapter = loadExercisesExistants();
 
  let chapterSection;
  if (chapterId) {
    const chap = chapters.find((c) => c.id === chapterId);
    chapterSection = chap
      ? `Chapitre concerné : ${chap.title} (${chap.id}).\nRésumé du cours : ${chap.summary}`
      : `Chapitre "${chapterId}" non reconnu — s'appuyer sur la liste générale des chapitres ci-dessous.`;
  } else {
    chapterSection = "Aucun chapitre précis indiqué par l'élève.";
  }
 
  // Simple liste de titres (sans résumé) : le chapitre étant désormais
  // obligatoire côté appli, cette liste ne sert plus qu'à situer le chapitre
  // demandé dans la progression globale du programme — le résumé détaillé du
  // chapitre concerné est déjà donné intégralement dans chapterSection, pas
  // besoin de répéter les 22 résumés ici (ça pesait à lui seul plus de 2000
  // tokens à chaque génération, cf session du 6 septembre 2026).
  const chapterList = chapters
    .map((c) => `- ${c.id} — ${c.title}`)
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
 
  // Exercices déjà présents dans le cours pour ce chapitre (voir
  // scripts/sync-exercises.js) — utilisés comme exemples de calibration du
  // générateur d'EXERCICES, séparément des exemples de TP ci-dessus (qui ne
  // conviennent pas : structure et objectif différents). Priorité au
  // chapitre demandé, complété par d'autres chapitres si moins de 3 trouvés.
  const chapterExercises = chapterId ? exercisesByChapter[chapterId] || [] : [];
  const otherExercises = Object.entries(exercisesByChapter)
    .filter(([id]) => id !== chapterId)
    .flatMap(([, list]) => list);
  const chosenExercises = [...chapterExercises, ...otherExercises].slice(0, 3);
  const exercisesExamplesSection = chosenExercises.length
    ? chosenExercises
        .map((ex, i) => {
          const parts = [`--- Exemple d'exercice déjà dans le cours n°${i + 1} (${ex.chapterId}) ---`];
          if (ex.title) parts.push(`Titre : ${ex.title}`);
          if (ex.enonce) parts.push(`Énoncé : ${ex.enonce}`);
          if (ex.questions.length) parts.push(`Questions :\n${ex.questions.map((q) => `- ${q}`).join("\n")}`);
          if (ex.corrige) parts.push(`Corrigé : ${ex.corrige}`);
          return parts.join("\n");
        })
        .join("\n\n")
    : "(Aucun exercice existant disponible pour l'instant sur ce chapitre.)";
 
  // Schémas : filtrés par chapitre (le catalogue grossit au fil du temps —
  // sans ce filtre, il devenait à lui seul le plus gros poste du prompt,
  // largement de quoi dépasser le budget par minute de Groq, session du 6
  // septembre 2026). Le chapitre étant désormais obligatoire côté appli, on
  // ne montre que les schémas de ce chapitre + les schémas génériques
  // (chapterId: null, ex: brochage STM32, captures d'oscilloscope réutilisables).
  const relevantSchemas = chapterId
    ? schemas.filter((s) => s.chapterId === chapterId || s.chapterId === null)
    : schemas;
  const schemasSection = relevantSchemas.length
    ? relevantSchemas.map((s) => `- ${s.id} : ${s.description}`).join("\n")
    : null;
 
  return {
    chapterSection,
    chapterList,
    examplesSection,
    exercisesExamplesSection,
    structureTemplate: loadStructureTemplate(),
    structureTemplateExercice: loadStructureTemplateExercice(),
    courbesMarkdown: getCourbesMarkdownForChapter(chapterId),
    materiel: loadMateriel(),
    schemasSection,
  };
}
 
module.exports = {
  loadChaptersMeta,
  loadExampleTp,
  loadStructureTemplate,
  loadStructureTemplateExercice,
  loadCourbesMarkdown,
  getCourbesMarkdownForChapter,
  loadMateriel,
  loadSchemas,
  loadExercisesExistants,
  reloadContext,
  buildContextBlock,
};
