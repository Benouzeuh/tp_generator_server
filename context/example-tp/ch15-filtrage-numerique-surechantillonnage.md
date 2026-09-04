TP : Numérisation — poids d'un fichier audio et sur-échantillonnage

1. Question de poids

1.1 Poids du fichier audio

Une question importante en numérique est le poids des fichiers.
1. Télécharger un fichier audio dans une variable x.
2. À l'aide de la taille de x et d'un calcul, estimer le poids du fichier en bits puis en
octets.
3. Comparer ce poids à celui indiqué dans les propriétés du fichier. Conclure.

1.2 Réduction du poids

On souhaite faire tenir ce fichier sur un support de stockage presque plein, en
divisant son poids par 8.
1. En s'appuyant sur le TP précédent portant sur l'échantillonnage, proposer une
méthode pour créer un fichier contenant la même musique mais avec un poids 8
fois plus faible (en jouant sur la fréquence d'échantillonnage, réduite à 6000 Hz).
2. Mettre en œuvre cette méthode.
3. La qualité sonore du fichier obtenu est-elle bonne ? Vérifier à l'écoute et avec le
spectre.

2. Reconstruction d'un fichier sous-échantillonné

On suppose ne disposer que du fichier réduit précédent. Le but de cette partie est
de rendre le son plus proche de la version originale, en rééchantillonnant le signal
à 48000 Hz par insertion de points d'échantillonnage entre deux points déjà
présents (méthode permettant de doubler la fréquence d'échantillonnage à chaque
application).
1. À partir de cette méthode, créer une variable échantillonnée à 12000 Hz. Écouter.
Qu'en pense-t-on ?
2. Reproduire cette méthode jusqu'à obtenir une variable échantillonnée à
48000 Hz. Écouter, regarder le spectre et conclure.
