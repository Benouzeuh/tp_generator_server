TP 3 : Capteur et traitement

Validation Principale :

-   Principe de mesure

-   Traitement d'une donnée

-   Capteur analogique // TOR

Validation Secondaire :

-   Girouette // Touchpad

-   Datasheet

Introduction

L'objectif de ce TP est d'utiliser plusieurs capteurs et de les mettre
ensemble dans un code pour interagir entre eux. Le but du jeu n'est
certainement pas de faire le tour de tous les capteurs mais plutôt de
mettre au point une méthode pour découvrir un capteur que l'on ne
connait pas à partir de sa datasheet.

La méthode à suivre sera donc :

1.  Récupérer la datasheet du capteur et vérifier sa compatibilité avec
    la carte STM32

2.  Comprendre le signal qu'il renvoie

3.  Comprendre le principe de mesure

4.  Mise en œuvre avec la réalisation du code et du montage

L'idée est vraiment de reproduire cette approche sur chaque capteur
utilisé afin d'être autonome et comprendre les technologies utilisées.

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Touchpad

On commence par étudier le capteur tactile Touch Grove. Ce capteur
permet simplement de capter la pression d'un doigt par exemple. Pour
information, la plupart des écrans de téléphones (IPhone, Samsung, etc)
fonctionne exactement grâce au même principe que ce capteur (mais
miniaturisé), ce qui en fait aujourd'hui un des types de capteurs les
plus utilisés dans l'industrie.

Etude de la datasheet

Vous disposez de la datasheet (trouvée sur internet) du capteur dans le
dossier du TP. Dans cette datasheet, cherchez des informations et
conclure sur :

-   Ce capteur peut-il être utilisé avec la STM32 ?

-   Ce capteur pourrait-il être utilisé dans une manette de PS5, de Xbox
    ou de Switch ? (Si vous ne savez pas, posez vous des questions les
    réponses sont toutes accessibles !)

Etude de la sortie fournie par le capteur

Toujours grâce à la datasheet :

-   Ce capteur est-il TOR, analogique numérique ?

-   Quelles peuvent être ces valeurs de sortie ?

Etude de la technologie du capteur

Les datasheets des capteurs grove ne permettent pas souvent de
comprendre la technologie employée. C'est pourquoi je vous propose de
vous rendre sur le net pour aller voir cette page WEB :

<http://interfacetactile.com/ecran-tactile-capacitif>

Cette donnée est bien sûr, comme toujours, en libre-service sur le NET.
A partir de cette page :

-   Expliquer comment fonctionne un capteur tactile. Prenez votre temps
    pour comprendre. Qui ne voudrait pas savoir comment fonctionne
    l'écran de son téléphone ?

Mise en œuvre d'un capteur

On se sert désormais de la STM32 pour mettre en œuvre deux utilisations
du capteur Touch.

Première utilisation : allumer une lampe lorsqu'on touche le capteur et
l'éteindre lorsqu'on enlève le doigt. Pour cela, on va déclarer les
entrées et sorties, déclarer les vitesses de connexions et les pinMode()
dans le set up et créer le programme principal.

-   Créez un code capable d'allumer une LED sur D3 lorsqu'on appuie sur
    le capteur TOUCH sur D2

-   Réalisez le montage et allumez la LED

Bon, c'est un peu trop simple. Imaginez désormais une lampe de chevet.
On souhaite qu'elle s'allume la première fois ou on appuie puis qu'elle
s'éteigne si on réappuie dessus. Je vous fournis une proposition de code
incomplet en utilisant le ! qui permet de switcher d'état un signal
binaire et le while permettant d'attendre la fin d'un état. Vous pouvez
vous appuyer sur ce code pour le comprendre ou créer le vôtre, au choix.

////////////////////////////////////////

const int touch = D2;

const int led = D3;

int touchState = LOW;

int ledState = LOW;

/////////////////////////////////////////////

void setup()

////////////////////////////////////////////

void loop()

Serial.print(\"TOUCH = \");

Serial.print(touchState);

Serial.print(\"\\t led = \");

Serial.println(ledState);

delay(10);

}

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

La girouette

Etude du capteur

La girouette est le deuxième capteur que nous allons étudier. Il permet
bien sur de connaitre la direction du vent. La datasheet est fournie
dans le dossier du TP (et assez difficile à trouver en ligne).

Première remarque : le capteur ne possède que 2 fils. Or, il faut
pouvoir l'alimenter (donc un fil d'alim et un fil de masse) et récupérer
sa valeur de sortie (1 fil capteur). Ce genre de phénomène est toujours
étonnant en première approche. Heureusement la solution se trouve dans
la documentation technique.

-   Dans la doc technique, trouvez le principe de fonctionnement du
    capteur. Combien de valeur peut prendre la tension de sortie ?

-   Trouvez également un schéma de câblage qui permette de récupérer la
    valeur de sortie du capteur.

-   Ce capteur est-il analogique ou numérique ?

Mise en œuvre d'un capteur

Concernant la réalisation pratique, on souhaite utiliser la STM32 pour
alimenter ce capteur.

-   Est-ce réalisable ? Si oui, sur quelle PIN ?

-   Réaliser le montage proposé sur la datasheet. La valeur de la
    résistance est-elle importante ? Que se passerait-il si on changeait
    sa valeur et que l'on prenait par exemple une résistance de 1kΩ ?

-   Relever la tension de sortie à l'aide d'un voltmètre

On souhaite désormais numériser notre mesure

-   Branchez la sortie de la girouette entre A0 et la masse.

-   A l'intérieur du code précédant pour le capteur tactile, écrivez un
    programme permettant de connaitre la position angulaire de la
    girouette (N, NE, E, SE, etc.) dans le moniteur série. Pour réaliser
    ce code, on pourra s'aider des TP précédents et d'une structure à
    double condition portant sur la valeur de la tension relevée :

if( ..... & .....)

Votre code doit désormais être capable de gérer les 2 capteurs.

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Consultation commandé

Dernière partie, l'objectif est de relever la direction du vent et de
l'afficher uniquement lors de l'activation du touchpad. Commençons par
comprendre en quoi l'affichage systématique sur le moniteur série de la
direction du vent peut poser problème.

Le débit est fixé dans le code à 115200 Baud c'est-à-dire ici à 115200
bits par seconde.

-   Sachant que, par exemple lors de vent du Sud-Est, on envoie un
    message « Direction du vent : SE », estimer en première approche le
    nombre minimum de bits émis.

-   En déduire le temps que met la STM à transmettre le message vers
    l'Arduino.

-   En quoi ce phénomène peut-il être gênant pour un TP ? Est réellement
    gênant ici ? (on pourra nuancer la réponse)

On souhaite donc afficher la direction du vent uniquement lors de
l'appuie sur le touchpad. Le cahier des charges est alors le suivant :

1.  Afficher la direction du vent en cas d'appuie sur le touchpad

2.  Tant que le touchpad reste actif, ne réécrire l'information qu'àprès
    environ 2s.

La consigne est donc :

-   Coder la STM pour réaliser cette fonction et contrôlez son bon
    fonctionnement. A quel endroit en rapport avec la mer peut on voir
    ce genre de dispositif ?

