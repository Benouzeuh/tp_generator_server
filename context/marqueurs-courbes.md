# Courbes calculées : marqueur [COURBE:type;param1=val1;param2=val2;...]

Pour toute courbe correspondant à l'un des types ci-dessous, utilise ce marqueur
PLUTÔT QUE de décrire la courbe en mots ou de la représenter en ASCII-art — elle est
recalculée et tracée automatiquement à partir des paramètres donnés, donc TOUJOURS
cohérente avec les valeurs numériques de l'exercice/TP (contrairement à une
description en mots, qui ne garantit rien). Isolée sur sa propre ligne, comme
[FORMULE]...[/FORMULE]. Les paramètres sont séparés par ";", au format clé=valeur ;
les listes de valeurs (paramètres "valeurs" et "durees") sont séparées par ",".

Types disponibles (phase 1) :
- `sinusoide;amplitude=A;offset=O;frequence=F;periodes=N` — signal sinusoïdal
  v(t) = O + A·sin(2πFt). `periodes` = nombre de périodes affichées (défaut 3).
- `spectre-sinusoide;amplitude=A;offset=O;frequence=F` — spectre du signal
  ci-dessus (raie continue si offset ≠ 0, raie à F d'amplitude A).
- `signal-paliers;valeurs=v1,v2,...;durees=d1,d2,...;periode=T;periodes=N` —
  signal périodique par paliers (2, 3, 4 ou 5 niveaux selon le nombre de
  valeurs). `durees` = durées relatives de chaque palier dans une période (pas
  besoin qu'elles somment à 1, elles sont proportionnelles). Un signal carré
  classique 0V/5V est `valeurs=0,5;durees=1,1`.
- `spectre-signal-paliers;valeurs=...;durees=...;periode=T;harmoniques=N` —
  spectre du signal ci-dessus (N harmoniques calculées, défaut 12).
- `dtmf;f1=F1;f2=F2;duree=D` — signal DTMF, somme de deux sinusoïdes (`duree`
  optionnelle, en secondes).
- `spectre-dtmf;f1=F1;f2=F2` — spectre du signal ci-dessus (deux raies).

Types disponibles (phase 2 — filtres analogiques) :
- `bode-1er-ordre;type=passe-bas|passe-haut;fc=FC` — diagramme de Bode (gain
  en dB) d'un filtre du 1er ordre.
- `bode-2e-ordre;type=passe-bas|passe-haut|passe-bande;f0=F0;q=Q` — diagramme
  de Bode d'un filtre du 2nd ordre (Q = facteur de qualité).
- `module-h;type=passe-bas|passe-haut|passe-bande;ordre=1|2;fc=FC (ordre 1) ou
  f0=F0;q=Q (ordre 2);echelle=lin|log` — module |H(jω)| en fonction de f,
  échelle LINÉAIRE par défaut (utile pour bien visualiser un pic de résonance
  en valeur réelle, pas en dB).
- `gabarit;type=passe-bas|passe-haut;fp=FP;fa=FA;amax=AMAX;amin=AMIN` — masque
  d'un gabarit de filtre (zones interdites), SANS courbe de filtre dedans —
  c'est une donnée de l'exercice, pas une réponse illustrée à l'avance. `fp`
  = fréquence de la bande passante, `fa` = fréquence de la bande atténuée,
  `amax` = affaiblissement max toléré en bande passante (dB), `amin` =
  affaiblissement min exigé en bande atténuée (dB).
- `gabarit;type=passe-bande;fa1=FA1;fp1=FP1;fp2=FP2;fa2=FA2;amax=AMAX;amin=AMIN`
  — même principe pour un gabarit passe-bande (4 fréquences de coin).

Pour ces filtres, la fréquence de coupure/propre (fc ou f0) et le facteur de
qualité Q se calculent à partir des composants choisis par TES soins pour
l'exercice (ex: fc = 1/(2πRC) pour un RC du 1er ordre) — donne toujours des
valeurs de composants ET la fc/f0/Q qui en découlent de façon cohérente.

Type disponible (phase 3 — ampli-op) :
- `hysteresis;type=inverseur|non-inverseur;vsat=VSAT;vb=VB;vh=VH` — boucle
  d'hystérésis d'un comparateur à trigger de Schmitt. `vsat` = tension de
  saturation (±VSAT), `vb`/`vh` = seuils bas/haut de basculement.

Type disponible (phase 4 — codes de ligne) :
- `code-ligne;codage=CODAGE;mot=MOT;amplitude=A;periode=T` — chronogramme
  temporel d'un mot binaire (`mot`, ex: "1011001") encodé selon `codage` :
  - `nrz` : 1→+A, 0→-A, sur toute la durée du bit.
  - `rz` : 1→+A pendant la 1ère moitié du bit puis retour à 0 ; 0→0 tout le bit.
  - `ami50` : 1→pulse (1ère moitié du bit) de polarité ALTERNÉE à chaque "1"
    successif, retour à 0 sur la 2nde moitié ; 0→0 tout le bit.
  - `nrzi` : transition de niveau au début du bit si bit=1, pas de transition
    si bit=0 (le niveau est maintenu).
  - `manchester` : 1→transition montante au milieu du bit (-A puis +A) ;
    0→transition descendante au milieu du bit (+A puis -A).
  - `manchester-diff` : toujours une transition au milieu du bit (top
    d'horloge) ; en plus, une transition en DÉBUT de bit si bit=0, aucune si
    bit=1.
  - `2b1q` : regroupe les bits par paires, mappées sur 4 niveaux
    (00→-3, 01→-1, 11→+1, 10→+3, échelle ramenée à ±A pour le niveau extrême),
    chaque paire dure 2×periode.

Types disponibles (phase 5 — filtres numériques) :
- `bode-numerique;type=passe-bas|passe-haut;fc=FC;fe=FE` — Bode (gain en dB)
  d'un filtre numérique du 1er ordre (lissage exponentiel), fc = coupure,
  fe = fréquence d'échantillonnage. Tracé de 0 à fe/2 (Nyquist), échelle
  linéaire (pas log, contrairement aux filtres analogiques).
- `bode-numerique;type=passe-bande;f0=F0;q=Q;fe=FE` — Bode d'un résonateur
  numérique du 2nd ordre (f0 = fréquence centrale, Q = facteur de qualité).

Types disponibles (phase 6 — modulations numériques) : pour chaque
modulation, DEUX marqueurs séparés — la courbe TEMPORELLE (signal modulé) et,
sauf pour FSK (non applicable), la CONSTELLATION (plan I/Q). Génère les deux
quand l'exercice porte sur cette modulation — la constellation est
indispensable pour toute question de décodage/lecture de symboles. Les
graduations des constellations sont automatiquement forcées sur des entiers.
- `ask;mot=MOT;f=F;amplitude=A;periode=T` — modulation ASK (tout ou rien) :
  porteuse pleine amplitude si bit=1, coupée si bit=0.
- `constellation-ask;amplitude=A` — ses 2 points (0 et A sur l'axe I).
- `psk;type=bpsk|qpsk;mot=MOT;f=F;amplitude=A;periode=T` — BPSK (1 bit/symbole,
  phase 0/π) ou QPSK (2 bits/symbole, 4 phases à 45°/135°/225°/315°).
- `constellation-psk;type=bpsk|qpsk;amplitude=A` — constellation associée.
- `fsk;mot=MOT;f0=F0;f1=F1;amplitude=A;periode=T` — bit=1→f1, bit=0→f0. Pas de
  constellation pour FSK (n'a pas de représentation I/Q standard) — ne
  demande jamais [COURBE:constellation-fsk...], ça n'existe pas.
- `qam;type=16|64;mot=MOT;f=F;amplitude=A;periode=T` — QAM par groupes de
  4 bits (16-QAM) ou 6 bits (64-QAM), mapping direct binaire->niveau (PAS
  nécessairement Gray codé) sur chaque axe I et Q séparément.
- `constellation-qam;type=16|64;amplitude=A` — grille de points (4×4 ou 8×8),
  chaque point étiqueté par les bits qu'il code (les nBitsPerAxis premiers
  bits → I, les suivants → Q).

N'invente jamais un type ou un paramètre absent de cette liste ; si la courbe dont
tu as besoin ne correspond à aucun type disponible, décris-la en mots à la place
(jamais en ASCII-art).
