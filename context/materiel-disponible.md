# Matériel disponible en salle

## Composants passifs

- Résistances disponibles : large gamme de valeurs discrètes en stock — privilégier
  des valeurs simples et courantes (1 kΩ, 10 kΩ...) quand le choix est libre.
- Condensateurs disponibles : large gamme de valeurs discrètes en stock.
- 1 boîte à décades de résistances, 1 boîte à décades de condensateurs, 1 boîte à
  décades de bobines (pour les valeurs précises/réglables).
- LED de couleurs variées disponibles.

## Composants actifs / modules

- Amplificateur opérationnel : TL081.
- Composants Grove (modules prêts à l'emploi, connecteurs 4 fils) : bouton
  poussoir, potentiomètre (rotary angle sensor), micro, photorésistance,
  photodiode, relais (commutation basse fréquence), interrupteur/MOSFET
  (commutation haute fréquence, ex. PWM), girouette analogique (résistance
  variable selon l'angle), débitmètre analogique (à impulsions), capteur
  ultrason HC-SR04 (mesure de distance), émetteur/récepteur ultrason.

## Cartes de développement / microcontrôleurs

- STM32 Nucleo L152RE (carte de référence), toujours avec son shield de base
  (obligatoire pour les montages avec modules Grove).
- Codage possible sous IDE Arduino, aussi bien sur cartes Arduino que sur la
  STM32 Nucleo.
- **Important** : la STM32 ne doit être proposée que si elle est réellement
  codée pour remplir une fonction utile au TP (acquisition de données,
  génération d'un signal, traitement embarqué, communication, asservissement,
  affichage...) — jamais comme simple substitut d'un appareil de mesure déjà
  disponible (ex : ne pas la faire jouer le rôle d'un oscilloscope, d'un GBF
  ou d'un multimètre alors que ces appareils sont déjà dans la salle). Si son
  usage n'apporte rien de plus que l'appareil dédié, ne pas l'inclure.

## Appareils de mesure

- Oscilloscope : considérer qu'il sait faire tout ce qu'un oscilloscope
  classique sait faire en dessous de 10 MHz (mesures temporelles, mode XY,
  curseurs, moyennage...), y compris sa **fonction FFT** pour l'analyse
  spectrale d'un signal. Ne pas inventer de limitation de l'oscilloscope
  au-delà de ce qui est listé ici sans raison précise liée à la consigne.
- Générateur basse fréquence (GBF).
- Multimètre.
- Carte Waveforms (boîtier de mesure/génération USB) — uniquement si nécessaire,
  pas par défaut.

## Alimentation

- Alimentation stabilisée.
- Le GBF sert aussi de source de signal ; toujours prévoir un "double T" en sortie
  de GBF pour dédoubler le signal (une voie vers le montage, une voie vers
  l'oscilloscope).

## Câbles et connectique

- Câbles BNC-BNC, câbles BNC-Banane, câbles "pont" (mâle/femelle ou les deux),
  câbles double puits, double T (dédoublement de signal).

## Plaques d'essai

- Plaquettes à essai (breadboard) disponibles.

## Logiciels

- Scilab (calcul numérique, traitement de signal).
- LTSpice (simulation de circuits électroniques).
- Audacity (édition/analyse audio).
- Binary Viewer.
- Proteus 9 (simulation/schématique électronique).
- Tera Term (terminal série).
- IDE Arduino (programmation Arduino et STM32).
- Suite bureautique : Word, Excel, PowerPoint.

## Simulations et code

- Il est tout à fait possible de proposer une manipulation sous forme de
  simulation Proteus (schématique + simulation), ou de code à écrire/compléter
  sous Scilab (par exemple pour l'étude d'une antenne, un traitement de signal,
  un calcul numérique). Ne pas éviter ce type de manipulation par manque de
  matériel physique — les élèves peuvent demander à une IA (ce générateur ou un
  autre assistant) de les aider à écrire le code correspondant séparément.
- Pour une manipulation impliquant la carte STM32 : deux approches sont
  possibles selon ce que demande la consigne de l'élève. Soit le TP demande à
  l'élève d'écrire lui-même le code (objectif pédagogique de programmation),
  soit le code est directement fourni dans le TP (objectif centré sur la
  mesure/l'analyse plutôt que sur la programmation). Choisir l'une ou l'autre
  selon ce que la consigne de l'élève laisse entendre ; à défaut de précision,
  préférer faire écrire le code par l'élève, plus formateur.

## Fichiers supports

- Fichiers audio (ex : enregistrement avec un défaut sonore à filtrer, fichier
  échantillonné à une fréquence donnée) : peuvent être générés ou fournis à la
  demande. Ne pas éviter de proposer un TP nécessitant un fichier audio
  spécifique pour cette raison — le préciser simplement dans le TP (nom du
  fichier attendu, caractéristiques utiles : fréquence d'échantillonnage,
  format, présence d'un défaut, etc.), le professeur s'occupe de le déposer.
- Datasheets des composants et modules (y compris Grove) : disponibles sans
  problème. Ne pas hésiter à demander à l'élève de s'y référer (ex : "consulter
  la datasheet du capteur X pour telle caractéristique") plutôt que d'inventer
  une valeur technique précise. C'est une compétence attendue en BTS CIEL, pas
  une manipulation à éviter : il est tout à fait pertinent de construire une
  question d'exploitation demandant d'aller chercher une caractéristique
  précise dans une datasheet (ex : "à l'aide de la datasheet de la LED,
  déterminer le courant direct maximal admissible et vérifier que la résistance
  de limitation choisie le respecte").

---

Consigne pour l'IA : le matériel proposé dans un TP doit être choisi dans cette
liste en priorité. S'écarter de cette liste uniquement si l'élève demande
explicitement un composant ou un appareil précis non listé ici.
