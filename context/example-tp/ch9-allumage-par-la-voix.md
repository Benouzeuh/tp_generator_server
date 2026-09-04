TP 10 : filtrage d'un claquement de doigt

Validation secondaire :

-   Filtrage

-   Choix des composants

-   Réalisation pratique

Matériel nécessaire : Grove Micro, Oscillo, STM32,
Résistances, condensateurs, LED, plaquette à essai, 1 grove bouton

Objectif

Nous voulons allumer une LED représentant une lampe par la parole mais
pas par un claquement de doigt. Pour cela, nous utiliserons l'analyse
spectrale

La réalisation

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Récupération sonore et envoi vers l'oscillo

Première étape, nous devons utiliser le grove micro pour récupérer le
signal sonore et la STM32 pour renvoyer ce signal vers un oscillo.
L'objectif est donc de récupérer le signal sonore depuis le capteur de
son et de le réémettre vers un oscilloscope.

-   Brancher le module sonore Grove à la STM32 sur la voie A0 et un
    oscilloscope entre la masse et la voie A0,

-   Utilisez la voie A0 pour récupérer le signal et le transmettre
    directement dans la suite du montage vers un oscilloscope.

```
<!-- -->
```
-   Produisez un « aaaaaaaa » ou un « ooooo » avec votre bouche et
    visualisez le signal sonore à l'oscilloscope. Pour cela, il faudra
    faire un « SINGLE » avec une bonne base de temps.

-   Pour une meilleure visualisation, vous pouvez penser à utiliser le
    couplage CA plutôt que CC afin d'enlever la valeur moyenne.

Le capteur sonore est hypersensible. Trouvez la bonne intensité sonore
qui permet de ne pas trop le saturer.

-   Produisez un « aaaaaaa » et regardez le spectre du signal. Pour
    cela, il faudra faire un enregistrement en mode single. Attention.
    Vérifiez toujours l'instant de déclanchement de votre oscilloscope
    pour que votre signal soit bien à l'écran.

-   Quelle est environ la fréquence fondamentale de votre « aaaaa » ? La
    réponse dépendra des groupes.

-   Réalisez désormais un claquement de doigt et faites la même étude. A
    quelle fréquence se trouve ce claquement de doigt ? La réponse
    dépend de la personne mais devrait se situer autour de 2000Hz.
    Remarque : essayez de ne pas saturer le micro

-   Pour filtrer le claquement et garder la voie, de quel type de filtre
    allons-nous avoir besoin ?

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Etude théorique du filtre RC passe-bas

Soit le filtre habituel :![](media/image1.png)

-   Emettre une hypothèse sur l'ordre et le type de ce filtre

```
<!-- -->
```
-   Calculer par la méthode de votre choix la fonction de transfert
    H(jω)

-   Vérifier votre hypothèse précédente grâce à l'étude de la fonction
    de transfert.

-   Donner la fréquence de coupure en fonction de R et C en égalisant au
    dénominateur la partie réelle et la partie imaginaire.

-   Choisir des valeurs cohérentes de R et C permettant d'avoir une
    fréquence de coupure de 500Hz afin de préserver la voix humaine mais
    d'atténuer le claquement (pour cela, fixer la valeur de R autour de
    10kHz selon votre convenance et calculer l'autre)

Réalisation pratique du filtre RC passe-bas

**Malheureusement, mettre 1 seul petit filtre RC ne suffira pas à faire
fonctionner notre système. Nous allons donc en mettre 2 d'affilés sans
refaire pour autant toute l'étude.** Ce sera donc un filtre d'ordre 2
passe bas avec une fréquence de coupure de l'ordre de 500Hz.

-   Laissez de côté le reste du montage. Montez le double RC sur une
    plaquette à essai avec 2 résistances et 2 condensateurs identiques,
    placez en entrée un GBF avec une sinusoïde d'amplitude 5V et en
    sortie l'oscilloscope.

-   Remplir le tableau Excel en modifiant progressivement la fréquence
    d'entrée du signal

-   Tracer la courbe Gain en fonction de la fréquence

-   Cliquez gauche sur un nombre de l'axe des abscisses et cliquez
    droit. Choisissez alors « échelle logarithmique ». Ce diagramme
    s'appelle un diagramme de Bode en gain.

-   Sur ce diagramme, visualisez 3 zones :

1.  Le plateau

2.  Le virage

3.  La descente en ligne droite

Le virage modélise la fréquence de coupure. Plus précisément, la
fréquence de coupure est définie lorsque la courbe de gain descend de
3dB par rapport à son plateau (ici le plateau étant à 0dB, on regardera
la valeur -3dB). Votre filtre fonctionne-t-il ?

Insertion du filtre RC passe-bas

-   Enlevez désormais le GBF et placez le double filtre RC à la sortie
    A2 de la STM. Brancher l'oscillo à la sortie de votre filtre (entre
    la seconde résistance et le second condensateur)

-   Commencez par émettre la note « aaaaaa ». Le signal est-il
    conservé ? est-il changé ? Etudier l'évolution de son spectre entre
    l'entrée du filtre et la sortie

-   De même, effectuer un claquement de doigt et étudier le signal et
    l'évolution de son spectre.

-   Le filtre est-il fonctionnel ? Réalise-t-il ce que l'on souhaite ?

Allumage d'une lampe à la parole mais pas au claquement de
doigt

Pour conclure ce TP, il faut

-   Renvoyer le signal en sortie du filtre dans la STM (par exemple en
    A1 ou A3)

-   Ecrire la suite du programme qui permet d'allumer une lampe par la
    parole (Si le signal reçu est suffisamment grand, allumer la lampe).

-   Monter le petit circuit avec la LED (et la résistance de contrôle !)
    et vérifier votre code.

Un problème se pose : la lampe ne va pas s'éteindre ! Pour contrer ce
problème, de multiples solutions s'offrent à nous. Je vous propose la
suivante :

-   Ajouter un grove Bouton. Ecrire un code permettant d'éteindre la
    lampe lorsque l'on appuie sur le bouton

Remarque : Si vous avez fini, rien n'empêche d'améliorer le système !

