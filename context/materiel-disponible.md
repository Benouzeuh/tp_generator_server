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

## Appareils de mesure

- Oscilloscope.
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
  une valeur technique précise.

---

Consigne pour l'IA : le matériel proposé dans un TP doit être choisi dans cette
liste en priorité. S'écarter de cette liste uniquement si l'élève demande
explicitement un composant ou un appareil précis non listé ici.

