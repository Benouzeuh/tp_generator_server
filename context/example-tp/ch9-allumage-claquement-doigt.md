TP 10 : Allumage par claquement de doigt

Validation secondaire :

-   Filtrage

-   Choix des composants

-   Réalisation pratique

Matériel nécessaire : Grove Micro, Oscillo, STM32,
Résistances, condensateurs, bobine, LED, plaquette à essai

Objectif

Nous voulons allumer une LED représentant une lampe par un claquement de
doigt mais pas par la parole. Ce TP est donc l'inverse du précédent TP.

La réalisation Partie 1 : Physique

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Spectre du claquement de doigt

On souhaite visualiser le spectre d'un claquement de doigt pour savoir
quelles sont les fréquences présentes dans ce son.

-   Prenez une STM32 et branchez dessus en A0 un capteur sonore.

-   Visualisez à l'oscilloscope le signal fourni par le capteur.

-   Produisez un clac et regardez ( vous aurez peut etre besoin de
    visualiser la FFT en mode Single). Quelle est la fréquence centrale
    de ce clac ?

Cette fréquence sera la fréquence centrale du filtre que l'on va
construire

Filtrage passe bande

-   Vous disposez de boites à décades de résistances, bobines et
    condensateurs.

-   Avec elles, réalisez un filtre passe-bande en mettant les 3
    composants en série et en prenant la sortie aux bornes du bon
    composant.

-   Calculer la fonction de transfert de ce filtre et la mettre sous la
    forme :

$$H(jw) = \frac2LC}$$

Cette forme ne permet pas de faire apparaitre le facteur de qualité Q.
On reprend donc le calcul pour aller jusqu'à la forme utile du passe
bande d'ordre 2.

-   En divisant par JRCw tous les termes et en se rappelant que 1/j=-j,
    montrer que l'on a :

$$H(jw) = \frac - \frac)}$$

On exprimera Q le facteur de qualité en fonction de R,C et L et f0 en
fonction de L et C

-   Choisissez les valeurs de L et C pour avoir une fréquence centrale
    proche de la fréquence du claquement de doigt

-   Débrouillez-vous pour avoir un Q relativement grand (plus grand que
    1 et si possible assez largement) sans trop diminuer R (R doit
    rester au-dessus de 1k environ). Vous pourrez éventuellement toucher
    à C mais attention à modifier L en conséquence.

-   Remplir le tableau Excel filtre passe bande et tracer le diagramme
    de Bode en gain et en phase de ce filtre. Commenter

La réalisation Partie 2 : Codage

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Capteur son + filtre

-   Branchez en A0 le micro. Faites ressortir le signal et faites-le
    passer dans le filtre passe-bande de la partie précédente.

-   Relier la sortie du filtre passe bande à l'entrée A1 de la STM32.
    Visualiser A1 à l'oscilloscope.

-   Vérifier qu'un son produit par la voix ne perturbe pas le signal en
    A1 et qu'au contraire, un claquement de doigt est perceptible. Notez
    les 2 amplitudes (voix et clac). Attention, le micro ne doit pas
    saturer donc ne hurlez pas dans le micro.

Codage et Allumage d'une lampe au clac

-   Brancher une led (et sa résistance) en D2 de la STM32

-   Ecrire un code qui permette de changer d'état la LED lorsqu'un clac
    est détecté. Pour cela, prenez un seuil au-delà duquel on considère
    que le clac est détecté.

-   Tester

