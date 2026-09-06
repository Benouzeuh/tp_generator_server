#!/usr/bin/env node
// scripts/sync-exercises.js
//
// Extrait les exercices déjà présents dans le cours (cours.js, intégrés à chaque
// leçon) et dans data.js (EXTRA_EXERCISES, pool "Exercices mélangés") pour servir
// d'exemples de calibration au générateur d'exercices IA — même principe que les
// TP d'exemple du prof pour le générateur de TP, mais ici automatique (pas besoin
// que Ben en rédige de nouveaux à la main, ils existent déjà dans l'appli).
//
// Usage : node scripts/sync-exercises.js /chemin/vers/cours.js /chemin/vers/data.js
//
// À relancer à chaque fois que le contenu du cours change côté appli.

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const coursJsPath = process.argv[2];
const dataJsPath = process.argv[3];
if (!coursJsPath || !dataJsPath) {
  console.error("Usage: node scripts/sync-exercises.js /chemin/vers/cours.js /chemin/vers/data.js");
  process.exit(1);
}

function loadGlobal(filePath, varName) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    console.error(`Fichier introuvable : ${resolved}`);
    process.exit(1);
  }
  const source = fs.readFileSync(resolved, "utf8");
  const sandbox = {};
  vm.createContext(sandbox);
  try {
    vm.runInContext(source, sandbox, { filename: path.basename(filePath), timeout: 10000 });
  } catch (err) {
    console.error(`Erreur en exécutant ${filePath} dans le bac à sable : ${err.message}`);
    process.exit(1);
  }
  const value = vm.runInContext(`typeof ${varName} !== "undefined" ? ${varName} : null`, sandbox);
  if (value === null) {
    console.error(`La variable ${varName} est introuvable dans ${filePath}.`);
    process.exit(1);
  }
  return value;
}

// Retire les balises HTML (<sub>, <span class="q-tag">...) présentes dans le
// texte des questions/corrections — l'IA n'a besoin que du texte, pas de la
// mise en forme prévue pour l'écran.
function stripHtml(s) {
  return String(s || "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Extrait récursivement le texte utile (champs "text") d'une liste de blocs
// de correction — ignore les images (rien d'utile à en tirer en texte) et les
// types non textuels.
function extractCorrectionText(blocks) {
  if (!Array.isArray(blocks)) return "";
  const parts = [];
  blocks.forEach((b) => {
    if (!b || typeof b !== "object") return;
    if (typeof b.text === "string") parts.push(stripHtml(b.text));
    if (Array.isArray(b.items)) parts.push(b.items.map(stripHtml).join(" ; "));
    if (Array.isArray(b.content)) parts.push(extractCorrectionText(b.content));
  });
  return parts.filter(Boolean).join("\n");
}

function normalizeExercise(ex, chapterId) {
  if (!ex || ex.type !== "exercise") return null;
  const questions = Array.isArray(ex.questions) ? ex.questions.map(stripHtml).filter(Boolean) : [];
  const bodyText = extractCorrectionText(ex.body || ex.intro || []);
  const correctionText = extractCorrectionText(ex.correction || []);
  if (questions.length === 0 && !bodyText) return null; // rien d'exploitable (que des images)
  return {
    chapterId,
    title: ex.title || null,
    enonce: bodyText || null,
    questions,
    corrige: correctionText || null,
  };
}

// Parcourt récursivement le contenu d'une leçon (COURS[chapitre]) à la
// recherche de blocs "exercise", où qu'ils soient nichés (directement dans le
// tableau de blocs, ou à l'intérieur d'un "box"/autre conteneur).
function collectExercisesFromLesson(blocks, chapterId, out) {
  if (!Array.isArray(blocks)) return;
  blocks.forEach((b) => {
    if (!b || typeof b !== "object") return;
    if (b.type === "exercise") {
      const normalized = normalizeExercise(b, chapterId);
      if (normalized) out.push(normalized);
    }
    if (Array.isArray(b.content)) collectExercisesFromLesson(b.content, chapterId, out);
  });
}

const COURS = loadGlobal(coursJsPath, "COURS");
const EXTRA_EXERCISES = loadGlobal(dataJsPath, "EXTRA_EXERCISES");

const all = [];

Object.keys(COURS).forEach((chapterId) => {
  const chapter = COURS[chapterId];
  // Une leçon peut être un tableau de blocs directement, ou un objet avec des
  // sous-clés (selon la structure exacte de cours.js) — on gère les deux.
  const blocks = Array.isArray(chapter) ? chapter : chapter && chapter.content ? chapter.content : chapter;
  if (Array.isArray(blocks)) {
    collectExercisesFromLesson(blocks, chapterId, all);
  } else if (blocks && typeof blocks === "object") {
    Object.values(blocks).forEach((v) => {
      if (Array.isArray(v)) collectExercisesFromLesson(v, chapterId, all);
    });
  }
});

(EXTRA_EXERCISES || []).forEach((item) => {
  if (!item || !item.chId || !item.exercise) return;
  const normalized = normalizeExercise(item.exercise, item.chId);
  if (normalized) all.push(normalized);
});

// Regroupe par chapitre pour que le serveur puisse piocher directement les
// exercices du bon chapitre sans avoir à filtrer un tableau à chaque requête.
const byChapter = {};
all.forEach((ex) => {
  if (!byChapter[ex.chapterId]) byChapter[ex.chapterId] = [];
  byChapter[ex.chapterId].push(ex);
});

const outPath = path.join(__dirname, "..", "context", "exercises-existants.json");
fs.writeFileSync(outPath, JSON.stringify(byChapter, null, 2) + "\n", "utf8");

const total = all.length;
const chapterCount = Object.keys(byChapter).length;
console.log(`OK — ${total} exercices extraits sur ${chapterCount} chapitres, écrits vers ${outPath}`);
