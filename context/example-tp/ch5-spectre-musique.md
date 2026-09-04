TP 6 : Spectre et musique

Validation Principale :

-   Utilisation poussée de l'oscilloscope (FFT et mode SINGLE)

-   Notion de Décibel

-   Spectre audio

Validation secondaire :

-   THD

-   Utilisation d'un micro

Introduction

Les signaux musicaux sont vraiment les signaux les plus adaptés pour
comprendre la notion de décomposition spectrale et de fréquence. Le but
de ce TP est donc d'approfondir nos connaissances dans le domaine de
Fourier tout en écoutant de la musique. En parallèle, nous allons aussi
progresser dans la connaissance de l'oscilloscope avec des méthodes qui
pourraient être capitales l'an prochain pour le BTS. Pour cela ce TP
comporte 3 parties :

1.  Une partie étude classique d'une sinusoïde et d'un circuit RC
    permettant de voir une FFT et d'effectuer des mode SINGLE à
    l'oscilloscope.

2.  Une étude d'un son enregistré à l'oscilloscope.

3.  Une étude d'un son enregistré en direct grâce à un capteur de bruit
    alimenté par la STM32 (pas de code à réaliser).

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Réaliser une FFT à l'oscilloscope

La première chose à savoir absolument faire est de visualiser une
transformée de Fourier sur un oscilloscope. Attention, les oscilloscopes
sont tous assez différents. En particulier, on possède plusieurs
oscilloscopes SIGLENT très performants mais aussi un peu plus compliqué
à régler. C'est pourquoi, il existe 2 méthodes différentes pour régler
nos oscilloscopes.

Cas d'une sinusoïde

-   Commencez par relier un GBF directement à l'oscilloscope. Prenez par
    exemple une amplitude de 5V et une fréquence de 1kHz. Visualisez
    correctement le signal.

Méthode pour visualiser le spectre **(sauf pour les oscilloscopes
SIGLENT)** :

1.  Visualisez à l'écran un très grand nombre de période (vous devez
    être à la limite de pouvoir les compter)

2.  Appuyez sur la touche Maths de l'oscilloscope et prenez FFT

3.  Ajuster la base de temps pour voir le spectre de façon optimale (1
    coup sur la gauche ou sur la droite, pas plus sinon revenez dans le
    domaine temporel et recommencez)

Méthode pour visualiser le spectre **pour les oscilloscopes SIGLENT** :

1.  Appuyez sur la touche Maths de l'oscilloscope et choisissez FFT
    grâce au bouton en bas à gauche de l'écran

2.  Choisissez la bonne source puis la fenêtre hanning

3.  Ensuite il va vous falloir régler le centre fréquentiel et l'echelle
    Hz/div en même temps. Une bonne solution consiste à mettre l'échelle
    à la même valeur que votre fondamental puis le centre 5 fois plus
    grand (par exemple ici 1KHz/div et 5kHz pour le centre). Ainsi vous
    pourrez voir le signal fondamental et 10 harmoniques.

4.  Cliquez sur next page. Il faut enfin régler Scale et Ref Level pour
    avoir une jolie courbe. Commencez par régler scale pour que le
    signal rentre sur l'écran sans être trop petit (en général 20 ou 10
    dB/carreaux). Puis positionnez Ref Level pour avoir le bas de votre
    courbe sur le bas de votre écran.

5.  Enfin dans unit, veillez simplement à être en dBVrms aujourd'hui
    pour être en accord avec le TP

Pour tout le monde :

-   Visualisez le spectre de la sinusoïde. La forme de la FFT est-elle
    en accord avec le cours ? Il est possible qu'il y ait quelques
    différences, essayez de les expliquer.

-   Dans les options du mode FFT devrait apparaitre l'option « fenêtre »
    qui nous rappelle l'option de Audacity vue précédemment. Testez les
    différentes fenêtres et restez finalement sur celle de Hanning.

-   Effectuer une recherche google pour essayer de comprendre à quoi
    servent les fenêtres lors de la FFT. Pouvez-vous m'expliquer leur
    rôle ?

On souhaite désormais réaliser des mesures dans le mode FFT.

-   Utilisez la touche curseurs, choisissez la voie « Maths » et les
    curseurs fréquence pour commencer. Relevez alors la fréquence
    minimale visible à l'écran, la fréquence maximale et la fréquence de
    la sinusoïde.

Le « SPAN » est défini comme la largeur fréquentielle visible à
l'écran.

-   Calculer ce SPAN dans votre cas précis et comparez le à la valeur
    écrite en bas au milieu de l'écran de l'oscilloscope. Que représente
    cette valeur ?

Passons désormais à l'amplitude des raies. La mesure de ces amplitudes
est beaucoup plus délicate.
Dans curseur, choisissez « amplitude » et mesurez la hauteur du pic.
Attention, il est fort probable que votre mesure ne soit pas
extrêmement précise c'est normal.
Malheureusement cette hauteur est donnée en dB. Pour la tension et le
courant, la grandeur dB est défini par la relation :
**VdBrms=20log(V/Vref)**
Pour un oscilloscope, La tension de référence Vref est de 1V en valeur
efficace, soit environ 1.41V en amplitude.
VdB est donnée par l'oscilloscope. Il ne nous reste plus qu'à calculer
la valeur V en volt. Pour cela il faut inverser la formule.

-   (Calcul théorique très courant au BTS) Démontrer que l'on peut
    écrire :

V=Vref.10^(VdB/20)^

-   Calculer alors la valeur V pour la sinusoïde. Ce résultat était-il
    prévisible ?

Cas d'un signal périodique

On laisse tomber la sinusoïde et on reprend notre bon vieux circuit RC.

-   Réalisez le circuit RC ci-dessous en prenant un GBF comme source de
    tension (Double T, double T, double T...) :

![](media/image1.png)

On prendra R=10kΩ et C=10nF. L'alimentation est un carré de 5V dont la
fréquence est suffisamment faible pour laisser le condensateur se
charger et se décharger complètement.

-   Visualisez l'entrée et la tension du condensateur sur les voies 1 et
    2 de l'oscilloscope.

-   En respectant le protocole précédent, visualisez la FFT du signal
    carré d'entrée (ce doit être une suite de pic décroissant).
    Remplissez alors la première partie du fichier Excel. Pour cela,
    mesurez les fréquences des différentes harmoniques puis mesurez leur
    amplitude en dB. Vous pourrez alors appliquer le résultat du calcul
    effectué précédemment pour avoir leur valeur en Volts

-   Visualisez désormais le spectre du signal de sortie. En première
    impression, comparez avec celui du signal d'entrée. Que peut-on dire
    du sort des basses et hautes fréquences traversant le circuit ?
    Qualifieriez-vous plutôt ce circuit de filtre passe-bas ou
    passe-haut ?

-   Remplissez le tableau Excel en complétant les amplitudes de chaque
    harmonique pour le carré et le signal de sortie. Remplir aussi les
    THD dans les 2 cas et comparez.

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Mode SINGLE et signal non périodique

On reprend le montage RC précédent mais on remplace le GBF par une
alimentation stabilisée. On fixe la tension d'entrée à 5V. On souhaite
toujours visualiser la charge du condensateur. Cependant, cette fois ci,
le phénomène ne se produit qu'une seule fois, lorsqu'on allume le
générateur, pendant quelques millisecondes. Il est donc quasi-impossible
d'appuyer sur le bouton stop pour visualiser cette charge.

Heureusement les oscilloscopes ont une fonction SINGLE qui permet de
n'afficher le signal qu'une seule fois et donc de ne capturer qu'un très
bref instant du temps, un peu comme une photo.

Méthode pour utiliser le mode SINGLE (un immense classique des oraux) :

1.  Essayer de savoir quelles sont les valeurs maximales et minimales de
    la tension observée (par exemple ici à priori, 0V et 5V)

2.  Régler la base d'amplitude pour être sûr de voir tout le signal à
    l'écran en optimisant (ici prendre le calibre 1V/div et situez le
    « 0 » à 1 carreau du bas de l'écran)

3.  Estimer la durée du phénomène n'est pas toujours facile. Si vous ne
    savez pas comment régler la base de temps, choisissez par défaut
    10ms/div, on affinera plus tard

4.  Régler la hauteur du TRIGGER à environ 30% du maximum du signal (ici
    environ 1.5V) et la position horizontale du trigger au niveau du
    premier carreau en partant de la gauche.

5.  Appuyez sur SINGLE

6.  Allumer la source de tension et visualisez à l'oscilloscope.

7.  Affiner le choix de la base de temps en relaçant une acquisition.

-   Visualiser la charge du condensateur ne se produisant qu'une seule
    fois.

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

FFT et mode SINGLE

Cas d'un signal enregistré

Dernière étape de ce TP, nous allons étudier le son produit par une
guitare. J'ai enregistré le « mi » d'une guitare à 330Hz. Vous pouvez
donc remplacer le capteur son par ce signal que vous sortez de
l'oscilloscope grâce à un câble BNC-Jack

-   Lancez la musique sur l'ordinateur en veillant à mettre sa lecture
    en boucle et le son à fond.

-   Branchez le câble Jack directement sur l'oscilloscope.

-   Visualisez le spectre du signal audio. Pour cela, vous devrez
    réaliser une acquisition en mode SINGLE (réglage identique à la
    partie précédente) (mais pour les oscilloscopes Tektronics, avant de
    lancer l'acquisition, passez en mode FFT).

-   Il est possible que le spectre ne soit pas concluant car le SPAN
    était mal choisi. Si c'est le cas, essayez avec une valeur de SPAN
    cohérente avec la fréquence de la corde de « MI » aigu de la
    guitare.

-   Relevez les amplitudes des 5 premières harmoniques et calculez le
    THD de la guitare

Cas d'un signal audio en direct

On passe désormais à l'étude d'un son en direct. Pour analyser le son
d'une guitare, il faut déjà un capteur sonore, ce que nous possédons
grâce au grove Son et à la STM32. Nous allons utiliser la STM32 comme
une alimentation 3.3V

-   Connectez la STM32 à un ordinateur et branchez le capteur son sur A0
    en 4 fils.

-   Utilisez la connectique femelle A0 pour récupérer le signal du
    module son et l'envoyez sur l'oscilloscope.

```
<!-- -->
```
-   Le capteur de bruit présente forcément un offset qui gêne la
    compréhension du phénomène. Placez donc la voie de l'oscilloscope
    sur « AC » dans « CH MENU »

-   Une fois cela fait, prenez la guitare et regardez à l'oscilloscope
    la forme du signal obtenu. Vérifiez que le capteur de bruit ne
    sature pas (ne jouez pas trop fort). Dans le cas où il sature, jouez
    simplement moins fort.

-   ATTENTION : le capteur son ainsi utilisé n'est pas capable
    d'acquérir des tensions fortement négatives. Nous aurons donc
    forcément une saturation basse présente. Cependant, ce phénomène ne
    devrait pas vous déranger pour la suite.

-   Visualisez désormais le spectre du signal audio en suivant
    exactement la même méthode que précédemment. Comparez avec le cas
    précédent.

Fin du TP

