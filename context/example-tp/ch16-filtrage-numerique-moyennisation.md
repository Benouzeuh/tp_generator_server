TP : Filtrage numérique — filtrage par moyennisation et filtre médian

1. Filtrage par moyennisation

En filtrage numérique, d'autres méthodes que l'équation d'Euler existent pour créer
des filtres performants à partir d'équations de récurrence. Un exemple est le
filtrage par moyennisation.

Le défaut étudié précédemment a été créé en modifiant 1 échantillon sur 3 d'un
enregistrement audio. Pour l'éliminer, l'idée est de remplacer chaque point erroné
par la moyenne du point précédent et du point suivant (par exemple
x(3) = (x(2)+x(4))/2), en ne moyennant que les points dont l'indice est multiple de 3.

1. Visualiser les 30 premiers échantillons du signal et constater qu'un échantillon
sur 3 a une valeur très proche de 1.
2. Compléter la fonction fournie en écrivant l'équation permettant de moyenner les
points défectueux.
3. Exécuter la fonction de filtrage moyen, écouter le résultat et regarder son
spectre.
4. La fonction ne traite que les fichiers mono. La modifier pour qu'elle traite aussi
les fichiers stéréo sans problème.

2. Filtrage par filtre médian

L'autre outil statistique souvent associé à la moyenne est la médiane.
1. Se documenter sur ce qu'est la médiane.
2. À l'aide de la fonction de filtrage moyen et d'une fonction médiane, créer une
fonction de filtrage médian permettant de renvoyer le signal filtré par ce filtre.
3. Tester cette fonction. Conclure.
