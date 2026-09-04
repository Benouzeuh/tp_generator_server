TP : Modulation numérique

Ce TP repose sur un logiciel de simulation de circuits électroniques (type LTSpice).
L'objectif n'est pas de savoir utiliser ce logiciel en détail, simplement de
comprendre les modulations numériques à partir de simulations déjà construites.

1. Prise en main : modulation ASK

On ouvre un fichier de simulation comprenant un générateur de bits et une
modulation ASK associée, avec des informations sur la fréquence de la porteuse, la
fréquence d'horloge et le temps de simulation.

1.1 Prise en main

1. Lancer la simulation et faire apparaître le signal binaire "bit".
2. Mesurer la durée d'un bit. En déduire le débit binaire du signal.
3. En déduire combien de bits comporte ce signal.

1.2 Étude de la modulation ASK

1. Faire apparaître le signal modulé ASK.
2. Mesurer la période de la porteuse. En déduire la fréquence de la porteuse fp.
3. Combien d'états comporte cette modulation ? En déduire le nom complet de
cette modulation (M-ASK, donner la valeur de M).
4. En déduire combien de bits code 1 symbole.
5. Par quel symbole est codé un bit "0" ? Même question pour un bit "1".
6. Tracer à main levée le diagramme de constellation de cette modulation.
7. Visualiser le spectre (FFT) de la modulation ASK, en échelle linéaire, et zoomer
sur la partie utile.
8. En ne considérant que le lobe principal, donner les fréquences limites de ce lobe.
Est-ce cohérent avec le spectre vu en cours ?

2. La modulation 2PSK (BPSK) et démodulation

2.1 Modulation BPSK

On ouvre un fichier de simulation comportant la modulation en partie haute et la
démodulation en partie basse.
1. Identifier les différentes fonctions schématisées.
2. Trouver la durée d'un bit. En déduire le débit binaire puis le débit de symbole R.
3. Trouver la fréquence de la porteuse.
4. En comparant la porteuse et la modulation PSK, donner le déphasage
correspondant à un bit "0" et celui correspondant à un bit "1".
5. Visualiser le spectre de la modulation PSK. Conclure.

2.2 Démodulation BPSK

Le signal modulé 2-PSK passe d'abord dans un multiplieur qui le multiplie avec sa
propre porteuse.
1. Visualiser le signal en sortie du multiplieur. Peut-on déjà y distinguer les 1 et les
0 ?
2. Quel type de filtre se trouve en sortie du multiplieur ? Quel est son ordre ?
3. Quelle est sa fréquence de coupure ? Visualiser le signal en sortie du filtre et
commenter, en comparant avec le signal binaire émis.
4. À quoi sert le trigger présent dans le schéma ?
5. Visualiser le signal en sortie du trigger et commenter en comparant avec le
signal binaire initial.
6. Résumer le fonctionnement d'un démodulateur BPSK.

3. La modulation QPSK (4-PSK)

On ouvre un fichier de simulation présentant plusieurs signaux, dont "decimal",
"bit0_LSB" et "bit1", ainsi que "In-Phase" et "Quadrature".
1. Pour cette modulation QPSK, combien de bits code un symbole ?
2. Observer le signal "decimal" : combien d'états différents présente-t-il ?
3. Observer les 3 fonctions ensemble : comment le signal "decimal" est-il construit
par rapport aux 2 autres ?
4. Ouvrir la modulation complète et mesurer la fréquence de la porteuse.
5. Mesurer la durée d'un symbole. En déduire la rapidité de modulation R et le
débit binaire D.
6. Combien de points comporte le diagramme de constellation de cette
modulation ?
7. À l'aide des signaux "amplitude" et "phase_degrés", construire le diagramme de
constellation.
8. Calculer cos(45°) et sin(45°).
9. À l'aide des signaux "In-phase" et "Quadrature", retrouver ces valeurs.

4. Modulation 8-PSK

Cette modulation est quasiment la même que la précédente.
1. Combien de bits code un symbole ?
2. En déduire la relation entre le débit binaire D et la rapidité de modulation R.
3. À l'aide des signaux "amplitude" et "phase_degrés", tracer le diagramme de
constellation de cette 8-PSK.

5. Modulation 16-QAM

5.1 Rappel de cours

1. Dans le diagramme de constellation, quelle est la différence entre une
modulation PSK et une modulation ASK ?
2. On dit souvent que la modulation QAM est un mixte entre PSK et ASK.
Commenter.
3. Pour la 16-QAM, combien de bits sont codés par 1 symbole ?

5.2 Le TP

1. Trouver la durée d'un symbole. En déduire le débit de symbole R et le débit
binaire D.
2. Trouver la fréquence de la porteuse.
3. Observer les signaux amplitude et phase : quelle différence avec la modulation
PSK ?
4. Observer précisément les valeurs de I et Q possibles et tenter de reconstituer le
diagramme de constellation.
5. Effectuer la FFT du signal 16-QAM. Que peut-on en dire ?
6. Estimer l'encombrement spectral de cette modulation.
