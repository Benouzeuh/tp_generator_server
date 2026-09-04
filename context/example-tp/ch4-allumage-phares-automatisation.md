TP Automatisation de l'allumage des phares d'une voiture

Validation principale :

-   Codage d'une Nucléo 64 sous IDE Arduino

-   Première approche de l'outil numérique

Validation secondaire :

-   Recherche de documents

-   Chaine de puissance et chaine de commande

-   Loi d'Ohm

Introduction

L'objectif de ce TP est de reproduire le fonctionnement autonome des
phares d'une voiture. Depuis plusieurs années, la plupart des voitures
produites possèdent des feux d'allumage s'allumant automatiquement
lorsque la luminosité baisse (nuit, tunnel). Pour cela, il est bien sur
nécessaire que la voiture puisse connaitre la luminosité ambiante. Elle
doit donc posséder un capteur. Ce capteur doit pouvoir commander
l'allumage des phares via une carte électronique.

Pour reproduire ce fonctionnement, nous allons donc avoir plusieurs
travaux à réaliser :

1.  Trouver un capteur de luminosité

2.  Reproduire les phares d'une voiture

3.  Permettre au capteur de luminosité de commander l'allumage des
    phares

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Capter une intensité lumineuse

Dans votre boite de matériel, vous disposez de nombreux capteurs (micro,
ultrason, pression, etc.).

-   Commencez par repérer le capteur de lumière que l'on appellera
    photodiode (un peu d'anglais devrait vous aider).

-   Chercher sa documentation technique (datasheet en anglais) sur
    internet et repérer à l'intérieur son intervalle de tension
    d'alimentation (la tension qu'il faut lui appliquer) ainsi que son
    temps de réponse (le temps qu'il met à repérer une variation de
    luminosité)

Le fonctionnement d'une photodiode est donné ci-dessous :

![](media/image1.png)

![](media/image2.png)

-   Expliquer en quelques mots le fonctionnement d'une photorésistance
    ou photodiode. Comment fait-elle pour traduire une intensité
    lumineuse en tension ? (Ce n'est pas si évident ! Regardez bien
    votre capteur)

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Prise en main de la carte NUCLEO 64 L152RE

Durant toute l'année, nous allons travailler sur la carte NUCLEO-64
L152RE de chez STMicroélectronics. Cette carte est une carte de
prototypage, c'est-à-dire une carte permettant de mener des projets de
développement. Elle est moins robuste qu'une carte industrielle mais
aussi beaucoup moins chère (autour de 10 euros).

Voici un plan de cette carte :

![](media/image3.png)

On retiendra en priorité :

1.  Les 6 entrées analogiques se trouvent en bas à gauche. Elles sont
    numérotées de A0 à A5. La broche A2 fait aussi sortie analogique.
    Nous auront l'occasion de l'utiliser.

2.  La masse est présente juste au dessus des broches analogiques (les
    deux broches marquées GND).

3.  Les broches numériques se trouvent à droite et sont numérotées de D0
    à D15. En pratique nous utiliserons la plupart du temps les broches
    situées vers le bas de la carte.

4.  La broche D13 est particulière, elle est reliée à une LED dont on
    peut contrôler l'intensité lumineuse. Cette broche est donc
    forcément aussi une sortie analogique.

Enfin, remarquez la présence de nombreuses indications « PWM ». On en
reparlera plus tard pour commander des moteurs en vitesse.

Cette carte peut être utilisée comme ceci mais il est beaucoup plus
agréable de venir ajouter dessus un « shield base ».

![Teensy Grove Base Shield V2.0 pour Arduino : Amazon.fr:
Informatique](media/image4.jpeg)

![population Watt Paine Gillic grove base shield schematic audible actif
Archéologue](media/image5.jpeg)La technologie Grove que nous utilisons
est basée sur le fait que tous les capteurs soient reliés avec la carte
mère par une nappe de 4 fils. Le Shield base est donc là pour vous
permettre de relier les capteurs à la carte très facilement. Le nom des
broches est marqué dessus.

-   Connecter la base Shield sur la carte STM32.

Enfin, en haut à gauche sur le coté de la carte, trouver un petit
interrupteur pouvant varier de 3.3V à 5V. C'est la tension
d'alimentation de la carte.

-   Mettez l'interrupteur sur 3.3V

-   Cette tension est-elle compatible avec l'intervalle trouvé pour la
    photodiode ?

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Prise en main de l'IDE Arduino

**Connecter la carte à l'IDE Arduino**

Piloter la STM32 demande un environnement de développement intégré
(IDE). Pour vous faciliter la vie, nous allons utiliser celui d'Arduino,
compatible avec les STM32. (Pour info, d'autres comme Keil sont bien
plus performants mais aussi plus long à prendre en main).

-   Connectez la STM32 au PC en USB

-   Ouvrez l'IDE d'Arduino

-   Dans « outils », positionnez la souris sur « Type de carte » puis
    « STM32 boards... » et choisissez la NUCLEO-64

-   Juste en dessous, passez la souris sur « Board part number » et
    choisissez la Nucleo L152RE

-   Enfin, plus bas dans « Port », choisissez le port qui n'est PAS le
    port 1.

L'IDE Arduino et la carte STM32 peuvent désormais communiquer. Ces
manipulations seront à faire à chaque fois que vous utiliserez la carte.
Nous allons désormais passer à la partie codage.

**Exemple 1 : Récupérer la valeur d'un capteur : problème du CAN**

Pour commencer, nous allons brancher un potentiomètre en entrée A0 sur
la carte STM32 et relever sa valeur de sortie sur l'ordinateur. Pour
cela :

-   Commencer par brancher le potentiomètre (rotary angle sensor) à la
    patte A0 de la STM32.

Vous remarquerez qu'il ne se passe rien ! Il faut un code. Justement,
l'IDE Arduino possède un nombre important de programme déjà écrit et
servant d'exemple. Pour les trouver, il faut aller dans « fichier » en
haut à gauche puis dans « exemples »

Dans notre cas, nous voulons lire sur le PC la valeur d'un capteur
analogique grâce à la connexion entre le PC la carte qui s'appelle une
liaison « série ».

-   Choisissez donc dans « exemples » le menu « basics » et
    « AnalogReadSerial » qui signifie « Lecture analogique en liaison
    série ». Cliquez. Une nouvelle fenêtre s'ouvre.

-   Recommencer le protocole pour choisir la bonne carte et le bon port.

Avant de regarder le code, commençons par le faire fonctionner. En haut
à gauche, le petit bouton avec un « V » permet de compiler le code.
L'IDE vérifie que vous n'avez pas écrit n'importe quoi.

-   Compilez le code et vérifier qu'il n'y a pas d'erreur sur le bas de
    la page.

Pour envoyer votre code dans la carte, il faut appuyer sur le petit
bouton avec une flèche juste à côté.

-   Téléverser votre code dans la STM32

Désormais la valeur de votre potentiomètre est transmise au PC. Pour la
voir, il faut ouvrir le moniteur série situé en haut à droite de la
page, onglet loupe.

-   Ouvrez le moniteur série et faites varier la valeur de votre
    potentiomètre.

-   Entre quelles valeurs varient le moniteur série ?

Pour expliquer cette valeur, il faut revenir sur l'acquisition de la
valeur du potentiomètre.

-   A l'aide de connecteur male-male, de pinces et d'un voltmètre,
    mesurez la tension réelle fournie par le potentiomètre. Est-elle en
    accord avec la tension lue sur le moniteur série ?

Il reste à comprendre comment on passe de cet intervalle à celui sur le
moniteur série.

Pour cela, il faut savoir que la carte STM32, comme toute carte
électronique, travaille en numérique. Or, la sortie du capteur est
analogique. Il faut donc entre les deux un Convertisseur Analogique
Numérique (CAN). Un CAN est un objet permettant de passer d'une valeur
analogique à une valeur numérique, codé sur des bits (prenant chacun des
valeurs 0 ou 1). Chaque CAN a un nombre de bits.

-   Chercher la datasheet de la NUCLEO64L152RE et trouver le nombre de
    bits du CAN

Si un CAN possède N bits, la valeur minimale de sa sortie étant de 0, sa
valeur maximale sera de 2^N^ -1. Par exemple, si un CAN possède 2 bits,
ses valeurs de sortie en binaire seront 00,01,10 et 11 correspondants en
décimal à 0,1,2 ou 3.

-   Grâce à ces renseignements, expliquer la valeur maximale lue sur le
    moniteur série

Le CAN de la NUCLEO 64 possède donc 1024 états différents permettant de
« tronçonner » la tension du potentiomètre variant de 0 à 3.3V (tension
pleine échelle).

-   En sachant que 3.3V correspond à l'état 1023 et en effectuant un
    produit en croix, montrer que la valeur du moniteur doit être
    multiplier par 3.3/1023 pour retrouver la valeur du potentiomètre en
    volt.

La valeur qui nous intéresse n'est donc pas la valeur fournie par le
moniteur série directement. Pour qu'elle nous soit vraiment utile, il
faut donc légèrement la modifier, ce qui est l'occasion pour nous
d'étudier le code fourni par Arduino.

Ci-dessous un code que j'ai moi-même écrit permettant de retrouver une
valeur intéressante sur le moniteur série :

void setup()

void loop()

Dans ce code, ligne par ligne :

-   Le set up permet d'initialiser la connexion. Le Serial.begin permet
    de définir la vitesse de la liaison entre le PC et la carte. Je
    place ici la vitesse de transfert à 115200 bit/sec, ce qui me permet
    d'avoir une liaison série beaucoup plus rapide que les 9600 bit/sec
    habituellement proposé (attention, il y a des valeurs normalisées)

-   Le Void Loop est le programme principal

-   float sensorValue = analogRead(A0); signifie que je crée une
    variable SensorValue qui va prendre la valeur envoyé par le
    potentiomètre via la liaison série (et donc entre 0 et 1023). Je
    choisis ici un float car il correspond à un nombre à virgule
    (contrairement à un int qui est un entier)

-   sensorValue = sensorValue\*3.3/1023 ; A quoi sert cette ligne ?????

-   Serial.println(sensorValue) permet d'afficher la valeur de
    sensorValue dans le moniteur série

-   Delay(100) permet d'attendre 100ms soit 0.1sec avant de recommencer.

Le code est prêt à être utilisé :

-   Remplacez le code fourni par Arduino par celui-ci. Téléverser le
    code dans la carte et regarder les valeurs données par le moniteur
    série lorsque vous tournez le potentiomètre.

Cette compensation du CAN sera à faire dans la plupart de vos codes.

**Exemple 2 : Allumer la LED D13 et la piloter**

Deuxième travail, la carte L152RE possède une LED que l'on peut
commander sur la patte D13 comme vu précédemment (elle se trouvera sous
le shield base durant ce TP mais vous pourrez la voir en vous penchant).
On souhaite la contrôler proportionnellement à la tension du
potentiomètre.

Pas de panique. Arduino a aussi un exemple pour ça.

-   Dans « exemple », allez dans « analog » puis choisissez
    « analogInOutSerial »

La seule fonction nouvelle est « map ». Elle effectue simplement un
produit en croix entre 2 intervalles de valeurs. Ici, cette fonction
reçoit une information entre 0 et 1023 et la traduit sur un intervalle
entre 0 et 255

-   A qui correspond l'entrée de la fonction map ?

-   A qui correspond la sortie ? En déduire l'intervalle de valeurs
    permettant de commander la LED D13

-   En réalité, cette fonction « map » réalise simplement une division !
    Par combien (environ) ?

-   Combien de bits possède donc le convertisseur numérique analogique
    (CNA) permettant d'alimenter la led ?

-   Quelles sont les valeurs fournies sur le moniteur serie ?

-   Téléverser ce code dans la carte. Voyez vous une LED s'allumer ?
    Chercher l'erreur !

Ce code est une base de travail acceptable fourni par l'IDE d'Arduino
mais en aucun cas satisfaisante comme produit final. Notre travail est
donc de l'améliorer.

Etant donné que ceci est un TP introductif, voici le code amélioré :

const int analogInPin = A0; // Analog input pin that the potentiometer
is attached to

const int analogOutPin = D13; // Analog output pin that the LED is
attached to

float sensorValue = 0; // value read from the pot

float outputValue = 0; // value output to the PWM (analog out)

float sensorValueAnalog = 0;

float outputValuePourcent = 0;

void setup()

void loop()

-   Analyser ce code et dire quelles sont les lignes qui permettent de
    réellement coder la LED et celles qui permettent plutôt de réaliser
    un affichage correct sur le moniteur série.

-   Quelle est la différence entre print et println ?

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Phares commandés

Dernière étape : commander des phares. Notre volonté est donc :

1.  Qu'une LED s'allume si la luminosité diminue

2.  Qu'une LED s'éteigne si la luminosité augmente

L'Arduino renvoyant des valeurs entre 0 et 3.3V, on choisit pour le
moment un seuil de commutation à 1.5 V.

Pour cela, on ne va pas utiliser la diode D13 car ça serait trop
simple ! On va donc commencer par brancher une LED sur une sortie
numérique de la STM32. N'utilisez jamais les pates D0 et D1 de la STM32
car ces 2 pattes numériques ne communiquent pas par défaut avec les
commandes envoyées par l'IDE arduino.

-   Branchez une grosse LED rouge sur la patte D2 de la STM32.
    Attention, n'oubliez pas la résistance (voir TP1), n'oubliez pas non
    plus le retour à la masse et branchez la LED dans le bon sens

Lors de l'utilisation d'une patte numérique, il est nécessaire de la
définir comme une entrée ou une sortie dans l'IDE Arduino. Pour se
faire, on utilisera la fonction pinMode (voir le code en dessous). Une
sortie numérique ne peut prednre que 2 états : LOW ou aussi appelé 0 et
HIGH ou 1.

Dans un premier temps nous allons garder le potentiomètre en A0. Le code
ci-dessous est fourni mais INCOMPLET. Transférez le dans l'IDE et
complétez les 3 endroits remplis par des petits points.

const int analogInPin = A0;

const int digLed = D2;

float sensorValue = 0;

int ledState = HIGH;

void setup()

void loop()

else

digitalWrite(digLed, ledState);

Serial.print(\"sensor = \");

Serial.print(sensorValue);

Serial.print(\"\\t LED = \");

Serial.print(...);

Serial.println(\"%\");

delay(20);

}

-   Dans ce code, comment fonctionne la condition if ?

-   Implémentez le dans la carte SMT32 et vérifiez grâce au moniteur
    série que la LED s'allume lorsque la valeur du potentiomètre est
    supérieure à 1.5V.

-   Enfin, remplacez le potentiomètre par la photodiode et débrouillez
    vous pour successivement l'exposer à la lumière et l'exposer à
    l'obscurité. Vérifiez que cela fonctionne.

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Phares commandés réalistes 

Dernière étape. Notre montage n'est pas réaliste. En effet, la LED est
en ce moment alimentée par la STM32. Or, grosso-modo, la STM32 est
capable de fournir 5V et 20mA soit une puissance de P=UI=0.1W, ce qui
suffit pour alimenter une LED mais en aucun cas des phares de voiture.

Pour rendre ce projet plus réaliste, il faut donc que l'on trouve un
moyen de commander la LED par la STM32 mais de l'alimenter en puissance
par une alimentation différente. On prendra ici une alimentation
stabilisée.

C'est la première fois (et pas la dernière) que l'on voit la différence
entre chaine de puissance et chaine de commande

![](media/image6.png)

![](media/image7.jpeg)Pour relier les 2
chaines, nous utiliserons ici un interrupteur commandé que l'on appelle
un relais.

Ce relais va donc se connecter d'un coté à la chaine de commande
(liaison 4 fils grove) et de l'autre coté à la chaine de puissance (Vous
aurez besoin de 2 fils dénudés, vous devez en avoir dans la boite ainsi
que des tournevis). Son principe :

1.  S'il reçoit en commande un 1 logique, il laisse passer le courant

2.  Sinon, il le coupe

-   Commencer par enlever la LED et la résistance de la connectique D2.
    Remplacez cette dernière par une alimentation stabilisée fournissant
    5V. La LED devrait s'allumer.

-   Puis, remplacer le fil de masse par 2 fils dénudés et placez au
    milieu le relais

-   Connectez le relais au circuit de commande par les 4 fils grove.

-   La LED devrait jouer à nouveau son role de phare commandé.

Fin du TP

