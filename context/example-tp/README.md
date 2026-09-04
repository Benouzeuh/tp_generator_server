# TP d'exemple

Dépose ici quelques-uns de tes TP existants (au format `.md` ou `.txt`), pour que l'IA
s'inspire de leur structure, de leur niveau d'exigence et de leur style — c'est le
"biais léger" vers tes TP dont tu parlais, sans code à toucher.

## Nommage

`chXX-titre-libre.md`, par exemple :

- `ch4-oscilloscope-fft.md`
- `ch12-filtrage-actif.md`
- `generique-methodologie.md` (sans préfixe reconnu = utilisé comme exemple de style
  général, quel que soit le chapitre demandé par l'élève)

Le préfixe `chXX-` doit correspondre à un `id` de `context/chapters-meta.json`
(ch1 à ch22). Le serveur choisit en priorité les exemples du chapitre demandé par
l'élève, puis complète avec des exemples génériques si besoin.

## Combien en mettre

2 ou 3 TP bien choisis suffisent largement (idéalement dans des styles/chapitres
différents) — inutile d'en déposer des dizaines, ça alourdit chaque requête sans
gain réel de qualité.

## Aucun redémarrage nécessaire pour AJOUTER un fichier

Les nouveaux fichiers sont pris en compte au prochain appel (cache vidé
automatiquement par intervalle — voir server.js). En cas de doute, un redéploiement
Render (2 clics) force le rechargement immédiat.
