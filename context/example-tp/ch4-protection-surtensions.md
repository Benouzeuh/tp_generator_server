TP 4 : Protection contre les surtensions

Validation Principale :

-   Pont diviseur de tension

-   Chaine de puissance et chaine de commande

-   Gestion d'un circuit un peu plus complexe

Validation Secondaire :

-   Approche des moteurs MCC

-   Prise d'initiative en autonomie

Introduction

L'objectif de ce TP est de reproduire le fonctionnement d'une
installation électrique protégeant les appareils et donc les moteurs
contre une surtension. Cette surtension peut être la conséquence d'un
défaut électrique ou d'un éclair par exemple et est tout à fait capable
de griller un appareil électrique.

Notre souhait est donc de créer un dispositif qui coupe l'alimentation
d'un moteur à courant continu lorsque la tension a ses bornes dépassent
une valeur seuil. C'est exactement ce que nous avons fait pour les
phares automatisés ! Mais quelques petits problèmes vont quand même
apparaitre...

En particulier, nous devons parler sécurité. En usine, lorsqu'un moteur
se coupe pour surtension, la législation interdit toute remise en route
à distance. Pour pouvoir réamorcer le moteur, il faut appuyer sur un
bouton poussoir et en même temps relancer le courant. Nous allons donc
introduire dans la dernière partie de notre TP ce bouton poussoir.

Voici un schéma résumant la totalité du TP

![](media/image1.png)

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Alimentation d'un moteur à courant continu (MCC)

Intéressons-nous d'abord à la liaison entre l'alimentation stabilisé et
le moteur. Les moteurs que nous utilisons sont relativement bruyant
lorsqu'ils tournent vite. Pour fixer un seuil acceptable pour le moteur,
on va s'aider de cette caractéristique.

![](media/image2.png)

-   Régler l'alimentation stabilisée sur 1V et reliez-là au moteur.
    Celui-ci est-il en mouvement ? Tourne-t-il rapidement ?

-   Augmenter progressivement la tension d'alimentation jusqu'à 15V. Que
    constatez-vous ? Expliquer ce phénomène simple.

Pour la suite, on prendra comme seuil de tension acceptable 10V.
Autrement dit, notre objectif est de couper l'alimentation du moteur si
sa tension dépasse 10V.

-   Est-ce cohérent avec votre observation ?

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Récupération de la tension moteur par la carte STM32

Récupérer la tension électrique présente en entrée du montage à l'aide
de la STM32 s'annonce assez facile car cette dernière possède 6 broches
analogiques permettant de récupérer la tension voulue simplement en s'y
connectant.

Cependant, en y réfléchissant, un problème apparait. La STM32 ne peut
acquérir des tensions qu'entre 0V et 3.3V. Or, la tension d'alimentation
peut monter jusqu'à 30V. Avant de récupérer cette tension, il faut donc
la réduire, la diviser pour lui permettre de passer de 30Vmax à 3.3Vmax.

![](media/image3.png)

-   Proposer un dispositif de mesure simple se basant sur 2 résistances
    que nous appellerons R1 et R2.

-   Par combien doit diviser ce dispositif au minimum ?

-   Choisissez 2 résistances de valeurs supérieures à 1kΩ permettant de
    réaliser cette division.

-   Les résistances sont précises à 5% près. Assurez-vous que votre
    montage divise suffisamment pour ne pas griller les STM32. Il vaut
    mieux diviser un peu trop que pas assez.

-   Câblez votre dispositif. Placez l'entrée de ce dernier aux bornes de
    l'alimentation stabilisée et faites entrer sa sortie dans la broche
    A0 de la STM32.

Si tout s'est bien passé, vous devriez pouvoir vérifier au voltmètre que
l'entrée A0 de la STM reçoit des tensions comprises entre 0 et 3.3V.

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Mise en place du relais

Avant de s'intéresser au code sur l'IDE Arduino, on s'intéresse au
dispositif permettant de couper la tension : le relais.

-   Placez un relais sur la masse entre l'alimentation stabilisée et le
    moteur à l'aide de 2 câbles dénudés.

-   Relier la commande du relais à la patte numérique D2 de la STM32.

![](media/image4.png)

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Rédaction du code

Pour réaliser le code permettant au relais de couper le circuit si la
tension est supérieure à 10V, vous n'avez pas vraiment besoin de moi. Le
code du TP précédent sur les phares automatisés fonctionne. Il suffit
d'effectuer une petite modification.

En effet, la variable sensorValue renvoie la tension lue en entrée de la
carte STM32. Cependant, cette tension n'est pas directement la tension
d'alimentation du moteur puisqu'un dispositif permet de rabaisser cette
dernière. Il faut donc compenser l'effet de ce dispositif dans votre
code !

-   Récupérez le code des phares automatisés et enregistrez-le comme un
    nouveau travail sous le nom « surtension ».

-   Modifier la valeur de seuil précédemment fixé.

-   Rajouter une ligne juste après celle réalisant l'acquisition de
    sensorValue permettant de compenser l'effet du pont diviseur.

-   Testez. Si votre alimentation coupe à environ 10V, c'est gagné.

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Rajout du bouton poussoir

Il ne reste plus qu'à rajouter le bouton poussoir. Son fonctionnement
est simple :

1.  Si le moteur fonctionne, le bouton poussoir ne sert à rien

2.  Si l'alimentation se coupe, elle ne peut se rallumer que si le
    bouton poussoir est enfoncé

![](media/image1.png)

-   Le bouton poussoir est-il un composant analogique ou numérique ?

Je vous fournis la structure du code mais pas les lignes correspondantes
aux conditions « if ». A vous d'essayer de tenir les objectifs.

Il est possible de mettre plusieurs conditions dans un if en séparant
chaque condition par un &

Attention, dans un if, le piege est de marquer if(A=0), ca ne peut pas
marcher, il vaudra mieux écrire if(A= = 0). En effet, on ne donne pas la
valeur 0 à A, on l'interroge sur sa valeur.

Pensez à rajouter les valeurs des 2 résistances que vous avez choisies
dans le code, je ne peux pas le faire pour vous.

Remarque : il est possible que vous trouviez des solutions différentes
de la mienne. Si vous devez modifiez la structure du code, pas de
problèmes ! Faites-le !

const int analogInPin = A0;

const int relais = D2;

const int bouton = D3;

float sensorValue = 0;

int relaisState = HIGH;

int boutonState = HIGH;

float R1=....;

float R2=.....;

void setup()

void loop()

if(............)

digitalWrite(relais, relaisState);

Serial.print(\"sensor = \");

Serial.print(sensorValue);

Serial.print(\"\\t RELAIS = \");

Serial.print(relaisState);

Serial.print(\"\\t BOUTON = \");

Serial.println(boutonState);

delay(20);

}

Fin du TP

