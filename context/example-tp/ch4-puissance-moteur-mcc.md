TP : pilotage d'un moteur par PWM

Validation Principale :

-   Puissance

-   Calcul de rapport cyclique et de valeur moyenne

-   Alimentation PWM

Validation secondaire :

-   Différence Relais // MOSFET

-   Fréquence et période

Introduction

Le but du TP aujourd'hui est de réussir à faire changer la vitesse de
rotation d'un moteur en considérant que l'on ne possède qu'une pile,
c'est-à-dire une tension continue fixe (en pratique on prendra des
alimentations stabilisées mais interdiction de changer la valeur de la
tension à partir de la seconde partie du TP). C'est par exemple le cas
de nombreux circuits embarqués. Ce TP nous amènera à parler de :

-   Stratégie de commande d'un moteur : la PWM

-   Puissance

-   Fréquence

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Alimentation du moteur et puissance

Dans cette partie, nous allons mesurer la puissance consommée par un
moteur. Pour cela, il faudra utiliser 2 multimètres : un en voltmètre
sur le moteur et un en ampèremètre entre l'alimentation et le moteur.

Au niveau des connectiques du moteur : le moteur possède un primaire et
un secondaire présentant chacun une cosse rouge et une cosse noire. Ce
sont donc des dipôles. Dans la suite du TP, n'utilisez qu'un seul côté.
L'autre sera laissé libre. De plus, sur l'avant du moteur figure 4
cosses. Elles permettent de relever un signal électrique permettant de
savoir à quelle fréquence tourne le moteur. Les 2 cosses de gauche
permettent l'alimentation en 0-5V et les cosses de droite permettent de
récupérer le signal.

-   Penchez vous sur le moteur. Regardez la partie en mouvement. Qu'y
    a-t-il dessus ?

-   A votre avis, quel type de capteur permet de récupérer la vitesse de
    rotation du moteur ?

On passe à la manipulation.

-   Commencez par brancher le moteur directement sur une alimentation
    stabilisée initialement à 10V. Branchez également un ampèremètre
    pour connaitre avec précision la valeur du courant circulant dans le
    circuit et un voltmètre sur le moteur (en cas de manque d'appareil,
    on pourra la lire directement sur l'alimentation stabilisée).

Le moteur doit désormais tourner. Ce modèle de moteur est très pratique
car il dispose d'un capteur permettant de connaitre sa fréquence de
rotation.

-   Alimentez le capteur de vitesse en 0-5V dans les trous indiqués sur
    le côté du moteur.

-   A l'aide de l'oscilloscope, relevez la courbe de tension en sortie
    de ce capteur et en déduire la fréquence de rotation du moteur grâce
    à la touche « Measure ».

-   Remplir le fichier Excel « Puissance dans un moteur » et tracer la
    courbe de la fréquence de rotation en fonction de la puissance reçue
    par le moteur. Est-elle logique ?

-   Pourquoi le moteur ne tourne-t-il pas lorsqu'on l'alimente avec 1V ?

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

La PWM

On fixe désormais la tension de l'alimentation à 10V et on n'y touche
plus ! Pour réaliser quand même un changement de vitesse du moteur, on
va utiliser une PWM.

Vous pouvez bien sûr utiliser internet pour comprendre ce qu'est la PWM
(MLI en français) mais je vous propose plutôt une approche pratique :

1.  La MLI est un signal électrique envoyé par une carte type STM32. Il
    va commander un grove MOSFET, sorte d'interrupteur faisant tampon
    entre la source de puissance et le moteur. Ce MOSFET permet
    d'alimenter ou pas le moteur en puissance. Il est donc semblable à
    un relais sauf qu'il s'utilise à haute fréquence contrairement au
    relais.

2.  La MLI se commande depuis la STM32 en rentrant des valeurs entre 0
    et 255 (sur 8 bits donc)

3.  La MLI va envoyer un signal carré de tension 0-3.3V et de
    relativement haute fréquence sur la commande du MOSFET. La
    différence entre une commande à l'état 5 ou une autre à 255 sera le
    temps pendant lequel le signal sera à l'état haut. Dans l'état 0, le
    MOSFET ne laissera jamais rien passer. Dans l'état 255, il laissera
    toujours passer la puissance vers le moteur. Entre les 2, il ne
    laissera passer la puissance que pendant un certain pourcentage de
    temps.

Mais le plus simple est encore de regarder sur un oscilloscope.

Avant cela, il faut réussir à coder la sortie PWM de la STM32. Même si
le signal PWM permet de contrôler des objets analogiques, il n'en reste
pas moins un signal à 2 états. Il peut donc être émis par des broches
numériques. Mais attention, pas toutes les broches numériques non plus.

-   A l'aide d'internet, cherchez les pattes de la STM32 L152RE
    permettant de fournir un signal PWM

On souhaite maintenant brancher un potentiomètre en A0 controlant une
PWM en D3. Je vous fournis le code trouvé sur internet qui m'a permis de
coder moi-même ce TP. Je ne promets ni qu'il est juste, ni qu'il est
parfait ni rien du tout (en particulier je ne vous conseille pas
d'utiliser le #define ni la fonction « map ») ! Mais le voici :

Fichier : prgTestLedPiloteeEnPwmViaPotentiometre.ino

Description : Permet de faire varier la luminosité d\'une LED avec un
signal PWM 0-5V,

via un potentiomètre branché sur l\'entrée analogique d\'un Arduino Nano

Auteur : Jérôme TOMSKI (https://passionelectronique.fr/)

Créé le : 10.11.2021

\*/

#define pinOuEstBrancheLePotentiometre 0 // Le potentiomètre servant à
faire varier la luminosité de la LED sera branché sur l\'entrée A0 de
l\'Arduino Nano

#define pinOuEstBrancheLaLED 3 // La LED sera quant à elle branchée sur
la sortie D3 de l\'Arduino Nano (attention : toutes les sorties ne
permettent pas de générer un signal PWM)

int valeurTensionEntreeAnalogique; // Variable qui contiendra la valeur
de la tension mesurée sur l\'entrée analogique (valeur comprise entre 0
et 1023, car lecture sur 10 bits)

int valeurRaccordCycliqueSignalPwm; // Variable qui contiendra la valeur
du rapport cyclique du signal PWM à générer

// ========================

// Initialisation programme

// ========================

void setup()

// =================

// Boucle principale

// =================

void loop()

-   

-   A partir de ce code et des codes des TP précédents, rédigez-en un
    capable de récupérer la valeur du potentiomètre et de le traduire en
    valeur de commande de la PWM

-   Téléversez votre code dans la STM32 et placez un oscilloscope en
    sortie. Visualisez le signal PWM.

![](media/image1.png)

-   Mesurez la fréquence du signal PWM

-   Changez la valeur du potentiomètre. Que se passe-t-il ?

Pour alimenter le moteur, nous allons utiliser un module MOSFET. Le
mosfet joue le rôle d'interrupteur commandé entre l'alimentation et le
moteur. La commande se fera à travers le signal PWM.

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Pilotage moteur par PWM

Intéressons-nous d'abord au MOSFET. Le GROVE MOSFET comporte 3 zones de
connectiques.

1.  La commande du MOSFET à brancher directement sur la PWM en 4 fils

2.  L'entrée (Vin+Masse) à connecter au générateur

3.  La sortie (Vout + Masse) à connecter au moteur

Le schéma du Grove est donné ci-dessous et consultable sur
<https://wiki.seeedstudio.com/Grove-MOSFET/>

![](media/image2.png)

-   Branchez l'ensemble du montage comme ci-dessous en prenant comme
    tension de l'alimentation 10V :

![](media/image3.png)

-   Visualisez à l'oscilloscope la tension d'entrée du moteur et celle
    du capteur de vitesse.

-   Grâce à de bonnes mesures à l'oscilloscope, remplir le tableau Excel
    PWM.

-   Conclure sur le pilotage d'un moteur par PWM

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Petit Bonus : Demander à la carte de calculer elle-même la vitesse du
moteur

Ce TP fonctionne désormais plutôt bien. Cependant, le signal que renvoie
le capteur de vitesse est pénible. En effet, il faut ensuite le traiter
avec un oscilloscope pour connaitre la vitesse de rotation du moteur.
C'est pénible ! Surtout que l'on pourrait tout à fait demander à la
carte STM32 de nous calculer directement la vitesse de rotation du
moteur.

Cette demande est tout à fait possible et plusieurs solutions sont
possibles. Etant prof de physique, je déteste utiliser les fonctions
toutes faites du type PulseIn sans comprendre ce que réalise la
fonction. On va donc essayer de récupérer la vitesse de rotation du
moteur en tr/sec sans utiliser de fonctions toutes prêtes.

**Donc l'objectif est d'afficher la vitesse de rotation du moteur sur le
moniteur série et de la comparer à celle donnée par l'oscilloscope**

Adaptation en tension

Pour mesurer la fréquence de rotation à la Arduino, nous allons utiliser
la tension fournie par le capteur de vitesse et visualisée à
l'oscilloscope. Cependant, cette tension est comprise entre 0 et 5V
alors que nos cartes STM32 sont faites pour récupérer une tension
maximale de 3.3V. Comment faire ?

-   A l'aide de 2 résistances de 100kΩ chacune, réalisez un montage
    permettant de récupérer cette tension sur la voie A1 de la STM32.
    Mesurez alors à l'oscillo les tensions entrantes dans la STM32 et
    vérifiez qu'elles sont inférieures à 3.3V.

Problème de la haute fréquence : optimisation

Deuxième très gros piège : le moteur tourne vite, environ 100 tours par
seconde. Chaque tour, le capteur envoie une impulsion vers le bas. Or,
pour réussir à mesurer sa vitesse, il est nécessaire de mesurer le temps
entre 2 impulsions successives de manière assez précise. On suppose que
pour mesurer ce temps précisément, le code doit être capable d'effectuer
environ 100 mesures entre 2 impulsions. C'est-à-dire que le code doit
avoir le temps de tourner 100 fois entre 2 impulsions.

-   En combien de temps au maximum le code doit-il faire une boucle ?

Bien sur, le delay() gêne mais ce n'est pas très grave, il suffit de le
réduire. Par contre, une autre partie du code dérange.

-   Sur la liaison série, comptez le nombre de caractère transmis entre
    la STM32 et l'ordinateur. Sachant que chaque symbole est codé sur 8
    bits, calculez le nombre de bits utiles transmis puis multipliez par
    1,2 pour avoir approximativement le nombre de bits total.

-   Sachant que la liaison série est paramétrée à 115200 bits/sec,
    calculez le temps nécessaire à l'envoie de ces bits. Est-ce
    compatible avec notre étude ?

En raison de ce phénomène, dans le code final que je vais fournir (trop
compliqué et trop long sinon), je demanderai à la STM de n'envoyer les
données sur la liaison série uniquement si j'appuie sur un bouton que je
brancherais sur la broche D2.

Principe de la mesure de temps : fonction millis() et
micros()

Sur l'IDE Arduino, il est possible de connaitre un temps en utilisant la
fonction millis() qui renvoie des millisecondes ou la fonction micros(),
identique, qui renvoie des microsecondes.

-   Dans notre cas, doit-on plutôt utiliser millis() ou micros() ?
    Pourquoi ?

Pour plus d'information sur ces fonctions, vous pouvez tapper le nom de
ces fonctions sur internet.

Le principe est simple :

-   On fixe un seuil de tension, lorsque ce seuil est dépassé, on lance
    un chronomètre.

-   On attend que la fonction repasse sous ce seuil puis revienne à la
    hauteur de ce seuil

-   On stoppe le chronomètre. On en déduit la période et donc la
    fréquence.

Voici le code entier (pas de piège, il est long) mais si vous voulez
tenter de l'écrire, ne regardez pas !

/////////////////////////////////////////////////////////

const int analogInPin = A0;

const int vitesseMoteur = A1;

const int moteur = D3;

const int bouton = D2;

////////////////////////////////////////////////////

float sensorValue = 0;

float vitesse = 0;

int button = LOW;

int moteurStatePWM = 0;

int boutonswitch = LOW;

int count = LOW;

unsigned long debut;

unsigned long fin;

unsigned long duree;

unsigned long frequence;

//////////////////////////////////////////////////////////////////////////

void setup()

////////////////////////////////////////////////////////////////////////////////

void loop()

if(vitesse\<1.9 & count==HIGH)

if (button==HIGH & boutonswitch==LOW)

if (button==LOW & boutonswitch==HIGH)

delay(0.1);

}

-   Branchez un bouton sur la patte D2 de la STM32 si ce n'est pas déjà
    fait

-   Téléversez ce code dans la STM32 et cliquez sur le bouton pour voir
    apparaitre les résultats sur le moniteur série (il faut bien sur
    ouvrir le moniteur série !!)

-   Conclure sur le code.

-   A quoi servent les variables count et boutonswitch ? (pas si facile)

Fin du TP

