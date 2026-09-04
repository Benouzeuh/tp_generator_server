TP : Échantillonnage et Shannon

1. Introduction

Le but de ce TP est d'appréhender le phénomène de spectre image lors d'un
échantillonnage et d'aborder le repliement de spectre. Pour cela, on travaille sur
des fichiers audio sous Scilab.

2. Prise en main du logiciel

Découverte de la console Scilab (commandes de base, absence de déclaration de
variable), des tableaux/matrices, des structures de boucle (for), et de l'appel de
fonctions déjà écrites (fonction test à exécuter et modifier).

3. Rééchantillonnage d'un fichier audio

On dispose de deux fichiers audio, l'un normal et l'autre comportant un défaut
sonore, ainsi que de fonctions fournies : TF(x, Fe) pour visualiser le spectre d'un
signal, et Reechantillonnage(x, Fe1, Fe2) pour rééchantillonner un signal audio.

3.1 Fichier audio et spectre

1. Télécharger le fichier audio dans une variable x. Quelle est sa fréquence
d'échantillonnage ? Sur combien de bits est-il codé ?
2. Combien la variable x comporte-t-elle de lignes et de colonnes ? Pourquoi y a-t-il
2 lignes pour un fichier stéréo ?
3. À l'aide de la fréquence d'échantillonnage et du nombre de colonnes, prédire la
durée de l'enregistrement puis vérifier avec la fonction d'écoute.
4. Visualiser le spectre à l'aide de la fonction TF. Pourquoi ce spectre est-il
symétrique autour de la moitié de la fréquence d'échantillonnage ? Quel théorème
est à l'origine de ce phénomène ?
5. En déduire pourquoi les fichiers sonores sont couramment codés au-delà de
40 kHz.

3.2 Rééchantillonnage

1. Changer la fréquence d'échantillonnage indiquée à la fonction d'écoute sans
rééchantillonner réellement le signal : que se passe-t-il ? Que fait le logiciel en
réalité ?
2. Utiliser la fonction de rééchantillonnage pour créer un fichier échantillonné à
24000 Hz. Écouter et visualiser son spectre. Commenter, en lien avec la sensibilité
de l'oreille au-delà de 10 kHz (principe à la base du format MP3).

3.3 Fichier comportant un défaut

1. Télécharger le fichier comportant un défaut, l'écouter.
2. Visualiser son spectre. Quelle est la fréquence du défaut rajouté ?
3. Rééchantillonner à 24 kHz. Écouter à nouveau.
4. Visualiser le nouveau spectre. Expliquer les différents pics obtenus à l'aide de la
notion de spectre image.

3.4 Conclusion

Préparer un court exposé expliquant les conséquences du rééchantillonnage et
l'apparition d'un spectre image, en insistant sur l'apparition dans le spectre de
nouvelles fréquences potentiellement gênantes.
