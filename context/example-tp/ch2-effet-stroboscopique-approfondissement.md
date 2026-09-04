TP 4 : Effet stroboscopique

Validation Principale :

-   Approfondissement du circuit RC

-   Notion de période

-   Gestion de l'oscilloscope

Validation secondaire :

-   Découverte de l'effet stroboscopique

-   Notion d'amplitude

-   Notion de seuil état haut et état bas

Introduction

Ce TP a pour but de faire clignoter une LED à une fréquence que l'on
choisira en tournant simplement un bouton. C'est le principe du
stroboscope que certains connaissent peut-être déjà depuis leur sortie
en boite le samedi.

-   Justement, avant d'attaquer le TP, regardons ensemble 2 petites
    vidéos pour comprendre ce qu'est l'effet stroboscopique :

<https://www.youtube.com/watch?v=9UJUym4KUpI>

<https://www.youtube.com/watch?v=W3e5vmQsJtw>

Nous souhaitons donc faire clignoter la lampe à une fréquence réglable.
Pour cela, nous pourrions tout simplement alimenter la lampe avec un GBF
et modifier la fréquence du GBF au fur et à mesure.

Mais ce n'est pas ce que nous voulons. Nous ne voulons pas utiliser de
GBF car sinon autant brancher ce dernier directement sur la diode ! Non,
c'est la carte STM32 qui sera chargée d'alimenter directement un circuit
RC et on va utiliser le temps de charge et de décharge de la tension du
condensateur pour modifier la fréquence de la lampe. La STM32 sera donc
utilisée exceptionnellement comme une source de puissance (la LED ne
consommant que très peu de puissance)

A la fin, le montage sera donc le suivant :

![](media/image1.png)

Lisez bien la totalité du sujet.

Ce TP revient donc à modifier la fréquence d'éclairage d'une LED sans
toucher à la source de puissance

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Réalisation du circuit RC à l'aide d'un Générateur

-   Commencer par réaliser un circuit RC avec un GBF en entrée et un
    oscilloscope visualisant la tension d'entrée à l'aide d'un double T
    et d'un câblé BNC-BNC et de la tension aux bornes du condensateur à
    l'aide d'un câble BNC-Banane.

-   Sur le GBF, placer un signal carré d'amplitude variant entre 0 et 5V
    (Ce signal aura donc une valeur moyenne de 2,5V) et de fréquence
    égale à 2Hz (donc très lent)

On rappelle que le temps de charge $t_$ d'un circuit RC est
approximativement égal à 3\*RC. On impose $R = 500k\Omega$.

-   Calculer la valeur de C pour avoir $t_ = 0.1s$

-   Visualisez sur l'oscilloscope la charge du condensateur et mesurer à
    l'aide des curseurs le temps de montée.

Si le temps de montée est de l'ordre de 0.1s :

**Votre circuit RC est désormais prêt. Débranchez-le du GBF et mettez-le
de côté sans toucher aux valeurs de R et C**

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Alimentation et commande par la STM32

On doit maintenant remplacer le générateur par la carte STM32. Pour
cela, il faut définir une stratégie de commande permettant d'avoir une
oscillation au niveau de la tension du condensateur.

La STM joue le rôle de GBF. La stratégie pour alimenter le circuit RC
est la suivante :

1.  Connecter l'entrée du circuit RC à la patte D3 de la STM32 et la
    masse à la masse de la STM32 à l'aide de pince et de pointe
    male-male

2.  Pour permettre l'oscillation, on relève la tension du condensateur
    et on applique la stratégie suivante :

```
<!-- -->
```
a.  Si la tension du condensateur est inférieure à 0.5V, la patte D3
    passe à 1

b.  Si la tension du condensateur est supérieure à 2.8V, la patte D3
    passe à zéro

![](media/image2.png)

-   Commencer par relier la patte D3 à l'entrée du circuit RC et la
    masse de la carte à la masse du circuit.

-   Relier ensuite la tension du condensateur à la patte A3

Il faut maintenant écrire le code. Pour cela, vous pouvez vous aider des
codes précédents et voici les instructions :

1.  **Ne partez pas de rien ! Aidez-vous des codes précédents**

2.  Votre code devra récupérer la tension du condensateur sur la broche
    A3

3.  Dans le set up, n'oubliez pas de paramétrer la liaison série à
    115200 bauds pour pouvoir visualiser des informations sur le
    moniteur série arduino.

4.  Dans le set up toujours, définissez la patte D3 comme une sortie
    (PinMode)

5.  Dans le void loop, votre code devra commencer par récupérer la
    valeur de A3 numérique (entre 0 et 1023), la traduire en une valeur
    de tension entre 0 et 3.3V.

6.  Si la valeur mesurée est supérieure à 2.8V, il faut stopper passer
    la patte D3 à l'état bas, alors que si la valeur est inférieure à
    0.5V, il faut passer D3 à l'état haut

7.  Utiliser digitalWrite pour écrire l'état souhaité dans la patte D3.

8.  Visualisez le moniteur série l'état de A3 et celui de D3.

Donc maintenant :

-   Coder le programme permettant de faire osciller la tension du
    condensateur entre 0.5V et 2.5V.

-   Téléverser votre code dans la STM32

-   A l'aide d'un oscilloscope et du moniteur série, vérifiez le bon
    fonctionnement du montage et affichez les courbes de D3 et A3.

-   Mesurez le temps de montée de la tension du condensateur ainsi que
    son temps de descente. En déduire sa période puis sa fréquence.

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Commande de la LED

Dernière étape, effectuer la commande de la LED

-   Réaliser le montage de la LED + sa petite résistance de 100 ou 200 Ω
    en série. Pour cela, placer une plaquette à essai avec une
    résistance + la LED dessus. Placer en entrée la patte D4 et en
    sortie la masse de la carte STM32

-   Dans le code, rajouter 2 conditions permettant d'allument la lampe
    si la tension du condensateur est supérieure à 1.6V et de l'éteindre
    si elle est inférieure à 1.5V. Pensez à bien déclarer la broche D4,
    à utiliser PinMode correctement et digitalWrite.

-   Téléversez votre programme dans la carte. Votre LED devrait
    clignoter. Tournez les molettes des boites à décades pour changer la
    valeur de la résistance ou du condensateur et regardez l'effet
    produit sur la résistance.

Remarque générale : Ce TP aurait fait fureur dans les années 70-80 mais
aujourd'hui on peut bien sur commander directement la fréquence de
clignotement de la LED par une tempo

Fin du TP

