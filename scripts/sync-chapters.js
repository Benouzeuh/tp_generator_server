#!/usr/bin/env node
// scripts/sync-chapters.js
//
// Extrait automatiquement {id, number, title, summary} de chaque chapitre depuis le
// vrai data.js de l'appli, pour que la méta utilisée par l'IA ne se désynchronise
// jamais de l'appli (pas de double saisie manuelle à maintenir).
//
// Usage : node scripts/sync-chapters.js /chemin/vers/data.js
//     ou : npm run sync-chapters -- /chemin/vers/data.js
//
// À relancer à chaque fois qu'un chapitre est ajouté/modifié/republié dans l'appli.

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const dataJsPath = process.argv[2];
if (!dataJsPath) {
  console.error("Usage: node scripts/sync-chapters.js /chemin/vers/data.js");
  process.exit(1);
}

const resolvedPath = path.resolve(dataJsPath);
if (!fs.existsSync(resolvedPath)) {
  console.error(`Fichier introuvable : ${resolvedPath}`);
  process.exit(1);
}

const source = fs.readFileSync(resolvedPath, "utf8");

// data.js est un script pensé pour le navigateur (déclare des "const" globales),
// on l'exécute dans un bac à sable Node isolé pour en extraire uniquement CHAPTERS,
// sans jamais toucher au disque ni au réseau depuis ce code exécuté.
const sandbox = {};
vm.createContext(sandbox);
try {
  vm.runInContext(source, sandbox, { filename: "data.js", timeout: 10000 });
} catch (err) {
  console.error(`Erreur en exécutant data.js dans le bac à sable : ${err.message}`);
  process.exit(1);
}

const chapters = vm.runInContext(
  'typeof CHAPTERS !== "undefined" ? CHAPTERS : null',
  sandbox
);
if (!Array.isArray(chapters)) {
  console.error("La variable CHAPTERS est introuvable ou invalide dans ce data.js.");
  process.exit(1);
}

const meta = chapters
  .filter((c) => c.available)
  .map((c) => ({
    id: c.id,
    number: c.number,
    title: c.title,
    summary: c.summary || "",
  }));

const outPath = path.join(__dirname, "..", "context", "chapters-meta.json");
fs.writeFileSync(outPath, JSON.stringify(meta, null, 2) + "\n", "utf8");

console.log(`OK — ${meta.length} chapitres publiés extraits vers ${outPath}`);
