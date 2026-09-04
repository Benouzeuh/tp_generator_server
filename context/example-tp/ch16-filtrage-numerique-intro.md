TP : Introduction au filtrage numérique

1. Mise en place du problème

1.1 Problématique

Le TP précédent sur l'échantillonnage avait confronté à un fichier musical
comportant, en plus de la musique, un défaut sonore aigu très désagréable.
L'objectif de ce TP est de détruire ce bruit parasite sans toucher au signal musical.

1.2 Rappel

1. Télécharger le fichier comportant le défaut dans une variable x, l'écouter.
2. Visualiser son spectre à l'aide de la fonction TF(x, Fs) et commenter, en
mentionnant le spectre image.
3. Entre l'écoute et le spectre, quel est le moyen le plus fiable pour détecter le
défaut ? Pourquoi ?

2. Structure d'un passe-bas numérique par l'approximation d'Euler

On fournit un fichier contenant une fonction "filtre_passebas" qui doit filtrer un
signal d'entrée x échantillonné à la fréquence Fe avec une fréquence de coupure fc,
et renvoyer une variable de sortie y filtrée — mais une ligne de code y est
volontairement défectueuse.
1. Visualiser la fonction fournie, s'approprier son fonctionnement et trouver la ligne
défectueuse.
2. En s'aidant de la formule de récurrence d'un filtre passe-bas numérique obtenue
avec l'équation d'Euler, implémenter l'équation du filtre à la place de la ligne
défectueuse.

3. Choix de la fréquence de coupure et filtrage

3.1 Fréquence de coupure et filtrage de base

On dispose de courbes de sensibilité réelles de plusieurs oreilles humaines pour
guider le choix de la fréquence de coupure.
1. À partir de ce document, choisir une fréquence de coupure pour le filtre, lancer
la fonction de filtrage et écouter le son produit. Est-ce concluant ?
2. Dans chaque tentative, visualiser le spectre du signal filtré. Le comparer au
spectre du signal d'origine et conclure sur le filtrage du défaut.

3.2 Filtrage avancé

Dans le monde du filtrage analogique, lorsqu'un filtrage par filtre RC du premier
ordre ne suffit pas, on peut l'améliorer en mettant un deuxième filtre RC à la suite
du premier (filtrage en cascade). En filtrage numérique, on peut de la même façon
filtrer en cascade un signal pour obtenir un filtrage plus performant.
1. En s'appuyant sur ce principe, mettre en œuvre une méthode simple pour
améliorer le filtrage précédent et obtenir un signal dans lequel on entend
clairement la musique mais plus la perturbation.
2. Visualiser le spectre du signal aux différentes étapes de la méthode. Commenter.
3. Conclure sur l'intérêt d'utiliser des filtres d'ordre plus élevé en filtrage
numérique.
