TP : Adaptation d'impédance

1. Ligne de transmission et régime transitoire

On considère un montage simple : un GBF relié par un câble BNC-BNC à un
oscilloscope (montage en "double T"), avec un câble BNC-Banane libre laissé en
bout de ligne.

Habituellement, l'explication de ce montage est très simple : le GBF émet un signal
capté par l'oscilloscope et aucun courant ne passe dans le câble BNC banane
puisque le circuit est alors ouvert. Même si cette idée est suffisante pour traiter la
plupart des sujets, elle n'est pas exacte : un courant circule dans le câble BNC
Banane pendant un laps de temps très court. On veut avoir une idée du temps que
mettent les électrons à faire l'aller-retour dans le câble coaxial laissé à l'air libre.

1. Mesurer la taille du câble laissé sur l'oscilloscope.
2. Trouver la vitesse des électrons dans un câble coaxial.
3. Calculer le temps aller-retour d'une onde électromagnétique se propageant
dans le câble BNC banane.
4. Justifier que l'on utilise, pour visualiser cette onde, un signal carré dissymétrique
de très haute fréquence et de très petit rapport cyclique.
5. Mettre en place un protocole permettant de visualiser ce phénomène et
l'observer (si le câble n'est pas assez long, rajouter des câbles double puits en
sortie).
6. Donner 2 cas où ce phénomène peut être gênant.

2. Phénomène de rebond en bout de ligne

On se place en régime carré asymétrique (rapport cyclique le plus bas possible) et
à très haute fréquence (environ 1 MHz). On cherche à voir l'impact de ce câble en
fonction de ce qu'il y a au bout (jusqu'à maintenant il n'y avait rien, c'est-à-dire une
impédance infinie).

1. Placer en bout de ligne une résistance variable. Faire varier la valeur de la
résistance et observer ce qu'il se passe. On étudiera en particulier les cas R = 0 Ω,
R = 50 Ω, R très supérieure à 50 Ω.
2. Chercher la valeur de l'impédance d'un câble BNC-Banane. Conclure.
Attention à ne pas confondre résistance et impédance : les câbles ont une
résistance proche de 0 Ω mais une impédance bien plus grande, à cause de leur
effet capacitif et inductif.

3. Adaptation d'impédance en puissance

On s'intéresse à un générateur schématisé par son modèle réel, c'est-à-dire une
source de tension parfaite E en série avec une résistance interne r = 50 Ω, en
sortie sur une résistance de charge R. On fixera E = 5 V et on prendra des
résistances sous forme de boîtes à décades pour modéliser R.

1. Expliquer pourquoi on peut généralement négliger la résistance interne du
générateur lorsque l'on travaille avec des résistances de charge de l'ordre de
10 kΩ.
2. En déduire que dans ce cas on a environ E = U.

On s'intéresse désormais à la puissance reçue par la résistance. On souhaite
trouver expérimentalement la valeur de R_pmax pour laquelle la puissance reçue
par R est maximale.
3. Donner un protocole permettant de trouver R_pmax.
4. Mettre en place ce protocole et trouver la valeur de R_pmax.
5. Conclure sur l'adaptation en puissance. Est-elle identique à celle en tension ?
