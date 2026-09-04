#!/usr/bin/env node
// scripts/sync-schemas.js
//
// Extrait automatiquement la liste des schémas disponibles depuis le vrai schemas.js
// de l'appli, pour que le catalogue utilisé par l'IA ne se désynchronise jamais de
// ce qui existe réellement (pas de double saisie manuelle à maintenir).
//
// Usage : node scripts/sync-schemas.js /chemin/vers/schemas.js
//     ou : npm run sync-schemas -- /chemin/vers/schemas.js
//
// À relancer à chaque fois qu'un schéma est ajouté/modifié dans l'appli.

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const schemasJsPath = process.argv[2];
if (!schemasJsPath) {
  console.error("Usage: node scripts/sync-schemas.js /chemin/vers/schemas.js");
  process.exit(1);
}

const resolvedPath = path.resolve(schemasJsPath);
if (!fs.existsSync(resolvedPath)) {
  console.error(`Fichier introuvable : ${resolvedPath}`);
  process.exit(1);
}

const source = fs.readFileSync(resolvedPath, "utf8");

const sandbox = {};
vm.createContext(sandbox);
try {
  vm.runInContext(source, sandbox, { filename: "schemas.js", timeout: 10000 });
} catch (err) {
  console.error(`Erreur en exécutant schemas.js dans le bac à sable : ${err.message}`);
  process.exit(1);
}

const schemas = vm.runInContext(
  'typeof SCHEMAS !== "undefined" ? SCHEMAS : null',
  sandbox
);
if (!Array.isArray(schemas)) {
  console.error("La variable SCHEMAS est introuvable ou invalide dans ce schemas.js.");
  process.exit(1);
}

const outPath = path.join(__dirname, "..", "context", "schemas-catalogue.json");
fs.writeFileSync(outPath, JSON.stringify(schemas, null, 2) + "\n", "utf8");

console.log(`OK — ${schemas.length} schéma(s) extrait(s) vers ${outPath}`);
if (schemas.length === 0) {
  console.log("(Catalogue vide pour l'instant — c'est normal si aucun schéma n'a encore été ajouté.)");
}
