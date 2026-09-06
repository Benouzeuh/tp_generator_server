# Structure obligatoire d'un exercice

Cette structure est **imposée**, quelle que soit la consigne de l'élève — seul le
contenu s'adapte à la consigne, jamais l'ordre ni la présence de ces blocs. Un
exercice n'est PAS un TP : pas de matériel physique, pas de manipulation à
réaliser — c'est un problème à résoudre sur le papier, avec un corrigé détaillé
à la fin (contrairement à un TP, où l'élève découvre la réponse par la mesure).

Si plusieurs exercices sont demandés, répète cette structure complète pour
chacun — chaque exercice commence par sa propre ligne "Titre : Exercice N —
<titre spécifique>" (ex: "Titre : Exercice 2 — Décharge d'un condensateur"),
en réutilisant exactement la même convention "Titre :" que pour un TP, jamais
un autre type de label pour numéroter les exercices. Chacun a son propre
Corrigé complet — ne regroupe jamais les corrigés de plusieurs exercices
ensemble à la fin.

1. **Titre** de l'exercice (une ligne, descriptif).

2. **Documents utiles** (optionnel — uniquement si un schéma, une courbe ou une
   formule générale aide réellement à comprendre l'énoncé) : mêmes règles que
   pour un TP, à une exception près — **la référence à une datasheet n'est
   PAS un type de Document valide pour un exercice** (elle suppose une
   manipulation physique du composant, hors de propos ici). Un Document ne
   peut donc contenir QUE l'un des trois éléments suivants :
   - une image via [SCHEMA:identifiant] ;
   - une courbe calculée via [COURBE:...] (voir la liste des types disponibles
     fournie séparément) ;
   - une formule générale de cours OU la formule générale de calcul
     d'incertitude, donnée telle quelle, SANS l'appliquer au cas particulier.

   Mêmes interdictions que pour un TP : jamais de raisonnement, d'application
   numérique ou de valeur déduite dans un Document ; jamais d'ASCII-art pour un
   schéma (utiliser [SCHEMA:...] ou [COURBE:...], ou décrire en mots à défaut).

3. **Énoncé** : le contexte et les données numériques du problème (ex : "Soit
   le montage RC suivant, avec R = 1 kΩ et C = 100 nF, alimenté par un
   échelon de tension Ue = 5 V..."). Pas de question ici, juste la situation
   et les données.

4. **Questions** : liste numérotée de consignes actionnables ("Calculer...",
   "Déterminer...", "Tracer...", "Montrer que..."). **Une question ne doit
   JAMAIS être suivie de sa réponse ou de la formule qui la donne directement**
   — même règle que pour un TP (voir plus haut) : si un [FORMULE] présenté
   juste après une question EST la réponse littérale demandée, c'est interdit.
   Les questions restent des questions ; toute la résolution va dans le
   Corrigé ci-dessous.

5. **Corrigé** : contrairement aux Questions, le Corrigé DOIT répondre
   complètement et en détail à chaque question, dans l'ordre, avec le
   raisonnement, les formules utilisées (en LaTeX, voir les conventions plus
   haut) et les applications numériques menées jusqu'au résultat final.
   Commence cette section par la ligne exacte "**Corrigé**" (rien d'autre sur
   cette ligne) pour qu'elle soit reconnue et correctement mise en forme.

Ne jamais omettre le Corrigé, ne jamais le placer ailleurs qu'à la toute fin de
l'exercice, ne jamais répondre aux questions ailleurs que dans le Corrigé.
