TP 4 : Analyse spectrale

Validation Principale :

-   Théorème de Fourier

-   Notion de fondamental et d'harmonique

-   Première approche du spectre

Validation secondaire :

-   Utilisation de Audacity

-   Approche lointaine de filtrage

Introduction

Ce TP a pour objectif de présenter l'étude de la physique par approche
fréquentielle, c'est-à-dire par l'approche de Fourier. Il va se dérouler
en 3 parties avec une première partie classique et 2 jeux :

1.  Une étude de la décomposition spectrale d'un signal périodique en
    utilisant le logiciel FourSimple

2.  Une étude fréquentielle d'un signal DTMF (Dual Tone Modulation
    Frequency) téléphonique utilisé depuis des décennies et encore
    aujourd'hui. Un exemple de longévité exceptionnel dans le monde des
    télécommunications.

3.  Un jeu permettant de « séparer » (très mal) les voix de 2 personnes
    dans un enregistrement audio

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Etude de la décomposition spectrale d'un signal périodique

On commence par utiliser le logiciel FourSimple2 pour comprednre la
décomposition spectrale.

-   Commencer par ouvrir le logiciel FourSimple2 qui devrait se trouver
    sur vos PC

Ce logiciel permet de construire différentes formes de signal (carré,
triangle, etc.) en additionnant des sinusoïdes selon le théorème de
Fourier. Il permet aussi d'approximer au mieux une courbe quelconque en
synthèse libre.

-   Générer un signal carré. Les niveaux des harmoniques devraient aussi
    apparaitre. Changez les différentes harmoniques et regarder l'impact
    sur le signal. Que remarquez-vous pour les harmoniques
    paires (2,4,6...) ? Ceci n'est PAS une règle générale mais est
    valable pour le carré et le triangle.

-   Faites rapidement de même pour le triangle

-   Remplir le document Excel « carre vs triangle ». Comparer leur taux
    de distorsion harmonique. Lequel est le plus dur à faire ?
    Pouvait-on le prévoir et si oui, pourquoi ?

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--
Etude d'un signal DTMF

Vous disposez d'un signal DTMF fourni avec ce TP.

La première étape consiste à prendre en main Audacity.

-   Dans le menu générer, cliquez sur tonalité. Choisissez Sinusoïde de
    fréquence 1000Hz et d'amplitude 0.5V. Visualisez le signal, mesurer
    sa période.

-   Cliquez désormais sur analyse et tracez le spectre

La fonction FFT (tracer le spectre) d'Audacity n'est pas très intuitive
et demande un peu de savoir-faire. Dans l'ordre :

-   Passez la souris sur l'image. La souris devrait pouvoir vous servir
    de curseur. En plus de ça, Audacity vous indique la fréquence du pic
    le plus proche.

-   Dans « algorithme », vérifier que vous êtes bien sur Spectre.

-   Dans « fonction », testez les différentes fenêtres proposées. Ce
    fenêtrage vient en fait de la méthode de calcul utilisée par
    Audacity pour calculer la FFT. Nous en reparlerons dans le prochain
    TP. Aujourd'hui, choisissez La fenêtre Hanning (parfois marquée
    Hann)

-   Pour la taille, là encore ce paramètre vient du calcul de Audacity,
    il n'est pas facile à régler. Faites en sorte d'avoir un pic assez
    fin en augmentant ce paramètre mais pas trop car sinon, vous n'aurez
    plus rien.

-   Enfin l'axe horizontal peut être vu avec une fréquence linéaire ou
    une fréquence logarithmique. Aujourd'hui nous prendrons l'option
    linéaire (mais l'autre nous sera utile bientôt).

-   Une fois tout cela effectué, que peut-on dire des fréquences du
    spectre de cette sinusoïde ? Est-il en accord avec le cours ? On ne
    s'intéressera pas à l'amplitude notée en dB, on le fera plus tard !

-   Recommencez l'opération avec un signal carré puis un signal
    triangle. Comparez rapidement les 2.

Le signal DTMF pour « Dual Tone Modulation Frequency » est une référence
dans le domaine des télécommunications. Il est utilisé pour générer un
son (et un signal électrique) lorsque l'on tape sur les touches d'un
téléphone. La composition d'un numéro se fait donc implicitement par
l'utilisation d'un signal DTMF.

Le principe est simple : Chaque touche appuyée envoie un signal qui est
la somme de 2 fréquences. Une analyse spectrale permet alors à
l'opérateur de deviner la touche sur laquelle vous avez appuyé et donc
le numéro composé.

Le tableau de correspondance est fourni ci-dessous.

![](media/image1.png)

-   Vous disposez d'un fichier sonore dtmf. Charger ce fichier nombre
    dans Audacity et retrouvez les 5 premiers nombres émis en effectuant
    une analyse spectrale.

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--
Une première approche du filtrage

Le filtrage fréquentiel sur Audacity

Nous disposons d'un fichier fourni aavec le TP sur lequel 2 blagues ont
été superposées. Si l'une peut être entendu, c'est beaucoup plus
difficile pour l'autre. Le but est donc d'essayer de séparer les 2
blagues. Autant le dire tout de suite, ce but ne sera pas parfaitement
atteint. En revanche, il est possible d'entendre les 2 blagues
séparément.

-   Pour commencer, générer un signal carré d'amplitude 0.5V et de
    fréquence 1000Hz.

-   Visualisez son spectre comme précédemment

-   Allez désormais dans le menu effet et sélectionnez « filtre
    passe-bas ». Ce filtre permet de ne garder que les « basses
    fréquences », basse par rapport au choix que vous allez faire dans
    « fréquence ». Autrement dit, les fréquences en dessous de celle que
    vous allez choisir ne seront pas modifiées. Par exemple, choisissez
    2000Hz. La fondamentale à 1000Hz ne sera pas modifié. Au-delà de
    2000Hz, au plus la fréquence augmentera, au plus l'harmonique sera
    atténué. On peut moduler la « force » avec laquelle on atténue en
    jouant sur le deuxième paramètre. Testez au minimum (6dB
    normalement) et au maximum (48dB). Dans la suite, on laissera ce
    paramètre à 48dB (et on en reparlera bientôt).

-   Effectuer la même étude avec le filtre passe-haut. Expliquez par
    vous-même comment celui-ci fonctionne

Nous allons enfin essayer de décorréler les 2 blagues. Pour vous aider,
voici un petit morceau extrait de Wikipédia : « Parmi les voix humaines,
la plus grave est celle de l'homme adulte. Viennent ensuite celle de la
femme adulte puis celle de l'enfant qui sont plus aigus ».

-   Quels sont les 2 types de voix que l'on entend ?

-   Quelles fréquences doit-on conserver pour garder la blague que l'on
    entend le moins et enlever celle que l'on comprend déjà ?

-   Quel type de filtre faut-il donc choisir ?

Il faut donc virer la voix que l'on entend déjà et conserver l'autre. Ca
nécessite donc de filtrer... mais pas trop ! Tout se jouera donc sur la
fréquence que vous choisirez dans les paramètres du filtre.

-   Appliquer ce filtre plusieurs fois en changeant de fréquence jusqu'à
    obtenir la deuxième blague (pensez à revenir au signal initial après
    chaque filtrage CTRL+Z sinon les filtrages s'additionneront et vous
    n'entendrez plus rien)

Fin du TP

