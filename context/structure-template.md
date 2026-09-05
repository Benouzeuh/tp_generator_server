# Structure obligatoire d'un TP

Cette structure est **imposée**, quelle que soit la consigne de l'élève — seul le
contenu s'adapte à la consigne, jamais l'ordre ni la présence de ces blocs.

1. **Titre** du TP (une ligne, descriptif).

2. **Problématique** : une question ouverte, en une phrase, qui pose l'enjeu
   technique du TP (ex. "Comment concevoir un filtre permettant d'isoler une bande
   de fréquence donnée ?"). Toujours en tout premier, avant le matériel.

3. **Matériel** : liste à puces du matériel nécessaire (composants avec valeurs,
   appareils de mesure, plaque d'essai, alimentations, etc.). Concis, pas de
   justification ici — juste la liste.

4. **Documents utiles** : un ou plusieurs encadrés numérotés ("Document N°1 – ...",
   "Document N°2 – ...", etc.) rassemblant tout ce qui est nécessaire pour réaliser
   le TP sans avoir à rouvrir le cours. Ces documents sont fournis en bloc, avant les
   parties — jamais dispersés dans le texte courant des parties elles-mêmes.

   **Un Document ne peut contenir QUE l'un des quatre éléments suivants — jamais
   autre chose** :
   - une image fournie par l'application via le marqueur [SCHEMA:identifiant]
     (schéma électrique d'un montage, courbe/graphe, brochage d'un composant
     comme la STM32...) ;
   - une formule générale de cours (fonction de transfert, loi physique,
     définition), donnée telle quelle, SANS l'appliquer aux grandeurs
     particulières du montage ;
   - la formule générale de calcul d'incertitude (voir plus haut), donnée telle
     quelle, SANS l'appliquer au cas particulier ;
   - une invitation à consulter la datasheet d'un composant pour y trouver une
     caractéristique précise (ex : "Consulter la datasheet de la LED pour
     déterminer le courant direct maximal admissible").

   **Un Document ne doit JAMAIS contenir de raisonnement, d'interprétation, de
   calcul appliqué, de valeur numérique déduite, ni aucune analyse — même
   partielle. Ce travail revient entièrement à l'élève dans les parties
   Manipulation/Exploitation, jamais fourni à l'avance dans un Document.** Si
   aucun des quatre éléments ci-dessus ne s'applique à ce que tu voulais
   mettre dans un Document, ne crée pas ce Document.

   **Ne jamais représenter un schéma de montage par un dessin ASCII-art ou des
   caractères de dessin de boîtes/lignes (┌─┐│└┘├┤┬┴┼→← etc.), même dans une
   cellule de tableau.** Ce texte n'est jamais mis en forme comme un vrai schéma
   et devient illisible. Utiliser le marqueur [SCHEMA:identifiant] approprié, ou
   à défaut décrire le montage en une ou deux phrases claires — le professeur
   ajoutera un vrai schéma si besoin.

5. **Parties numérotées en chiffres romains** (I, II, III...), chacune structurée en
   exactement deux blocs, toujours dans cet ordre :
   - **Manipulation** : liste numérotée d'actions concrètes à réaliser (câblage,
     réglages du générateur/de l'oscilloscope, mesures à effectuer). Des instructions
     à exécuter, pas des questions.
   - **Exploitation** : questions de calcul et d'analyse à partir des mesures de la
     manipulation qui précède. Formulées comme des consignes actionnables
     ("Calculer...", "Comparer...", "Commenter...").

6. Optionnel, en toute fin de TP : une question de synthèse qui reboucle
   explicitement sur la problématique initiale.

Ne jamais mélanger manipulation et exploitation dans un même bloc, ne jamais mettre
les documents utiles après les parties, ne jamais omettre la problématique initiale.
