TP 4 Effet stroboscopique : Préambule

Validation Principale :

-   Utiliser des signaux périodiques

-   Utiliser un GBF

-   Utiliser l'oscilloscope

Validation secondaire :

-   Découverte du circuit RC

-   Introduction du boitier Waveforms

-   Découverte des problèmes de masse

Introduction
L'objectif de ce TP est d'introduire les signaux périodiques et le
matériel qui va avec (GBF, Oscilloscope). La priorité sera donnée au
réglage du GBF et de l'oscilloscope.
Ce TP repose sur l'étude du circuit RC, véritable plaque tournante de
la physique appliquée. Les résultats trouvés le concernant seront donc
à retenir au maximum.

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Réalisation du montage RC

Le montage RC sera de loin le montage que l'on étudiera le plus cette
année en TP. On peut le comparer à un rat de laboratoire en biologie.
C'est sur lui que l'on va tester la plupart de nos théories. Il servira
donc de support tout au long de l'année. Son schéma est le suivant :

![](media/image1.png)

En régime périodique, on n'utilise plus d'alimentation stabilisée
fournissant un signal continu, on passe au Générateur Basse Fréquence
(GBF) pouvant générer des signaux entre 10Hz et 1MHz environ. Prenons
ensemble une bonne habitude :

-   Regardez votre GBF et cherchez la connectique appelé « OUTPUT ».
    Placez alors un double T dessus. Sur une des sorties du double T,
    placez un cable BNC BNC et reliez l'autre extrémité à la voie 1 de
    l'oscilloscope.

Ainsi, avant toute utilisation du GBF, cette manipulation doit être
faite. Elle permet de visualiser le signal d'entrée du circuit que l'on
pourra ensuite comparer au signal de sortie.

-   Récupérez maintenant une boite à décades de résistance et une autre
    de condensateur et réalisez le circuit. Utilisez un cable BNC-Banane
    pour relier le GBF au circuit.

-   Réglez le GBF pour obtenir un signal carré d'amplitude 5V et de
    fréquence 1000Hz (voir l'aide à la fin du TP)

-   Réglez la résistance sur R1=10kΩ et le condensateur sur C=100nF

-   Utilisez enfin un deuxième cable BNC-Banane pour relier
    l'oscilloscope aux bornes du condensateur et ainsi mesurer la
    tension Uc.

Les oscilloscopes possèdent tous une touche de réglage simplifiée appelé
« autoset » ou « autoscale » selon les appareils et située en haut à
droite.

-   Sans trop réfléchir, appuyez sur la touche de réglage facile.

Les 2 signaux doivent apparaitre clairement à l'écran. Cette touche est
très pratique dans le cas d'étude simple. Malheureusement, elle ne sert
strictement à rien dans tous les cas un tout petit peu plus complexe.
C'est pourquoi il faut aussi savoir régler manuellement l'oscilloscope
(De plus, vous ne pourrez pas l'utiliser lors du jury final de votre
BTS).

-   Dérégler l'oscilloscope en tournant un peu toutes les molettes et
    notamment les molettes « V/div » des 2 voies ainsi que la molette
    « time/div » commune aux 2 voies (Les 3 molettes sont cote à cote).
    Suivez alors le protocole Oscilloscope à la fin de ce TP pour régler
    à nouveau l\'oscilloscope. Il est indispensable de savoir-faire ça.

Les oscilloscopes sont souvent différents d'une paillasse à l'autre.
Cependant le principe général de réglage reste le même.

-   Visualisez les 2 courbes et comparez-les. Essayez d'expliquer le
    phénomène observer en se rappelant le fonctionnement interne d'une
    résistance et d'un condensateur.

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Première mesures : Temps de montée du montage RC

Le circuit RC possède donc un temps de montée. C'est justement ce temps
de montée qui nous intéresse ici. Nous allons donc effectuer quelques
mesures à l'oscilloscope. Grosso-modo, il existe 2 façons de faire des
mesures sur un oscillo :

1.  Soit en utilisant la touche measure et en récupérant les données
    fournies par l'oscillo

2.  Soit en utilisant les curseurs

Les deux méthodes sont détaillées plus bas ? Il est nécessaire de savoir
faire les 2 et de comprendre laquelle est la plus approprié selon les
situations.

Le temps de montée d'une courbe est défini par le temps que met une
courbe à approcher sa valeur finale.

-   Commencer par remplir le tableau Excel en faisant évoluer la valeur
    du condensateur et en mesurant le temps de montée de la tension Uc à
    l'aide des curseurs.

-   Tracer la courbe du temps de montée en fonction du produit R\*C (si
    besoin le tuto Excel se trouve dans un TP précédent)

-   Quel type de courbe avez-vous ? Faire apparaitre son équation sur le
    graphique

-   En déduire une relation simple entre RC et le temps de montée

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--
Influence de la fréquence sur la sortie du montage

La fréquence du signal entrant dans un circuit RC a une forte influence
sur la forme du signal de sortie, c'est-à-dire la tension du
condensateur.

-   Revenez à la valeur C=100nF

-   Augmenter progressivement la fréquence du GBF jusqu'à 100kHz.

-   Comment se comporte la tension de sortie Uc ?

-   Comment interprétez-vous ce résultat ?

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Visualisation de la tension Ur de la résistance

Lors de l'utilisation de l'oscilloscope, un gros piège est ce que l'on
appelle « le problème de masse ». Nous allons l'illustrer ici.*:*

-   Retirer la mesure de la tension Uc et branchez le cable BNC banane
    aux bornes de la résistance.

-   Commenter ce que vous voyez à l'écran. Un gros problème devrait
    surgir si vous pensez à la loi des mailles

Ce problème est un problème de masse. Avec un oscilloscope, on ne peut
pas directement mesurer la tension d'un dipôle qui n'est pas relié à la
masse. Pour contrer ce problème, on peut utiliser la touche « math » sur
l'oscillo situé dans la zone 1.

-   Visualisez à nouveau Uc sur la voie 2

-   D'après la loi des mailles, à quoi est égale Ur en fonction de E et
    Uc ?

-   Utilisez le résultat de la question précédente et la touche Math à
    bon escient pour visualiser la tension Ur

-   Les variations de Ur sont-elles lentes ou au contraire brutales ?
    Cette mesure respecte-t-elle la loi d'Ohm ?

Utilisation du logiciel Waveform

Dernière découverte de ce TP, le logiciel Waveforms permet de remplacer
un GBF (et même 2 !) et un Oscillo. Mon avis personnel est que le GBF de
Waveform est très bien mais l'oscillo est plutôt adapté au traitement de
données numériques et non analogiques. Il peut bien sur traité les
données analogiques mais il reste moins performant que nos oscilloscopes
classiques. En revanche, il permettra plus tard de lire du BUS I2C, de
la liaison série, du One wire, etc.

Dans tous les cas, une présentation s'imposent.

-   Connecter en USB le boitier et le PC. Sur le boitier, pensez à
    mettre l'adaptateur BNC sans forcer.

-   Ouvrez Waveforms sur les PC

-   Dans WaveGen (le GBF), produisez 2 signaux de 5V et respectivement
    de 1000 et 1001Hz.

-   Faites sortir ces signaux sur W1 et W2 et immédiatement re-rentrer à
    l'aide de câble BNC sur CH1 et CH2.

-   Visualisez alors l'oscilloscope. Que constate-t-on ?

-   Faire passer de 1001 à 1002Hz voire plus.

-   Tentez d'expliquer ce que l'on voit à l'écran et plus généralement
    comment un oscilloscope fait pour synchroniser un signal périodique
    (c'est-à-dire le rendre stable à l'image).

Fin du TP

Principe de connexion et de réglage d'un GBF

Le réglage

-   Tous les GBF permettent au moins de réaliser des ondes sinusoïdales,
    triangles et carrés. Certains permettent de créer d'autres formes
    d'ondes mais nous n'en aurons pas besoin.

Commencer donc par vérifier que vous avez sélectionné la bonne forme

-   Régler la fréquence que vous souhaitez obtenir. Vous pourrez parfois
    rentrer directement la valeur souhaitée ou sinon utiliser un bouton
    rotatif ainsi que le choix de la gamme de fréquence voulue. Tous les
    GBF permettent de visualiser la fréquence émise en sortie du signal

-   Concernant l'amplitude de la tension de sortie, certains GBF
    l'affiche. Malheureusement ce n'est pas le cas de tous. Pour la
    fixer précisément, il faudra donc utiliser un oscilloscope. En
    attendant, placer la tension de sortie à une valeur non nulle mais
    pas trop importante.

-   Certains GBF nécessite l'appuie sur la touche « output » en bas à
    droite de du GBF pour émettre quelque chose. N'oubliez donc pas de
    l'activer si vous l'avez.

La connexion

-   Trouver la connectique BNC « OUTPUT » (attention, il existe aussi
    « output TTL » qui ne nous intéresse pas ici).

-   Brancher sur cette sortie un double T

-   Sur l'une des sorties du double T, prenez un cable BNC BNC et reliez
    le GBF à l'oscillo en voie 1 de préférence (pas d'obligation mais
    prenez l'habitude de choisir systématiquement la même voie, et donc
    la voie 1). Cette connexion permet de visualiser le signal émis à
    l'oscillo et donc également de régler son amplitude

-   Prenez un cable BNC-Banane et reliez le GBF au montage

Principe de réglage d'un Oscilloscope

Un oscilloscope présente grossièrement 4 zones de réglage différentes

![](media/image2.jpeg)

-   Zone 1 : Ajustement en tension, axe vertical, un bouton par voie

-   Zone 2 : Ajustement temporel, axe horizontal, commun aux 2 voies

-   Zone 3 : Trigger

-   Zone 4 : Effectuer des mesures

Pour régler un oscilloscope il faut s'intéresser aux zones 1 à 3 dans
cet ordre (donc de gauche à droite la plupart du temps)

1.  Régler la base d'amplitude des 2 voies pour que le signal ne sorte
    plus par le haut et le bas de l'image. La base d'amplitude que vous
    utilisez est alors visible en bas à gauche de l'écran (par exemple
    1V/div). Vous pouvez aussi décaler les courbes vers le haut ou le
    bas avec les petites molettes.

2.  Régler la base de temps pour être cohérent avec votre signal. Par
    exemple, si vous travaillez à 1kHz, prenez une base de temps de
    l'ordre de 1ms ou un petit peu moins. Celle-ci s'affiche aussi sur
    l'écran de l'oscillo en bas au milieu.

Vous devez maintenant voir à l'écran un signal. Peut-être est-il stable,
peut-être ne l'est-il pas. On dit en franglais qu'il est « triggé » ou
qu'il ne l'est pas. Si le signal est stable, pas besoin du point
suivant.

3.  Pour rendre stable le signal, il est nécessaire de le trigger,
    c'est-à-dire que le synchroniser. Pour cela, aller dans trig menu et
    trigger sur la voie 1, votre entrée. Ensuite, à l'aide de la petite
    molette « level », placez la flèche présente sur la droite de
    l'écran à une hauteur correcte. Pensez aussi à toucher juste à côté
    la molette « position » qui permet de trigger plutôt vers la gauche
    ou vers la droite de l'écran. Mieux vaut la mettre plutôt vers la
    gauche

Normalement votre signal est désormais stable à l'écran

Principe de mesure sur un Oscilloscope

Un oscilloscope mesure des temps ou des tensions. Pour cela, il y a 3
façons majeures de faire :

A l'œil

Cela peut paraitre surprenant mais la première façon de mesurer une
tension sur un oscilloscope est de faire confiance à son œil. Pour cela,
il suffit de compter le nombre de carreau du signal. Par exemple sur
l'image précédente, le signal fait approximativement 2 carreaux. Sachant
que chaque carreau vaut 1V d'après ce qu'il y a marqué en bas à gauche
de l'écran, nous aurons ici un différentiel de tension de 2V entre le
haut et le bas.

Bien sur cette méthode n'est pas précise mais elle permet de régler les
choses approximativement. Par exemple, si vous voulez avoir un signal
d'entrée d'environ 5V, c'est très facile.

A l'aide de mesures automatiques

L'oscilloscope permet grâce à la touche « measure » d'effectuer tout un
tas de mesure automatique (fréquence, période, amplitude, amplitude
crête à crête, etc). Pour cela, rendez vous sur la touche measure,
sélectionnez les curseurs temporels ou d'amplitudes et la voie que vous
souhaitez mesurer. Enfin, demander à l'oscilloscope ce que vous voulez.
Attention, il arrive que l'oscilloscope se trompe ! C'est pourquoi
**toute mesure automatique doit être suivi d'une vérification à l'œil**

A l'aide des curseurs

Enfin, la méthode la plus conventionnelle et précise pour mesurer une
information sur un oscilloscope est la méthode des curseurs. Appuyez sur
le bouton « cursors » et placez les 2 curseurs où vous le souhaitez pour
avoir une mesure facile. Cette méthode est cependant plus lente que la
précédente.

