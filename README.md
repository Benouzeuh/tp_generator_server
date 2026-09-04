# Serveur relais — Générateur de TP (BTS CIEL)

Petit serveur qui reçoit la consigne d'un élève, y injecte le cadrage pédagogique
(méta des chapitres + TP d'exemple du prof), interroge **Groq** (fournisseur
principal) puis **Mistral en secours** si Groq échoue (panne ou quota atteint), et
renvoie le TP généré. Aucune base de données, aucun compte élève, rien n'est stocké.

## Comment ça marche (résumé)

- `POST /api/generate-tp` `{ consigne, chapterId? }` → `{ tp, provider }`
- `GET /api/status` → `{ level: "green"|"orange"|"red", message, queueLength, ... }`
  (à afficher côté appli comme indicateur "vas-y / patiente / complet")
- Une file d'attente interne traite les demandes une par une pour ne jamais dépasser
  les limites de débit des fournisseurs, même si toute la classe clique en même temps.
- Le cadrage (chapitres + TP d'exemple) est injecté automatiquement dans chaque
  demande — voir `context/`.

## Structure du projet

```
server.js              point d'entrée, endpoints HTTP
src/providers.js        appels Groq / Mistral + bascule automatique
src/queue.js             file d'attente (traitement séquentiel)
src/rateStatus.js       calcul de l'indicateur vert/orange/rouge
src/context.js           chargement méta chapitres + TP d'exemple
scripts/sync-chapters.js  extrait la méta chapitres depuis le vrai data.js de l'appli
context/chapters-meta.json   généré par le script ci-dessus, ne pas éditer à la main
context/example-tp/           dépose ici tes TP d'exemple (voir le README du dossier)
```

## Tester en local (optionnel, avant de déployer)

```bash
npm install
cp .env.example .env
# éditer .env et coller tes deux clés API (voir plus bas comment les obtenir)
npm start
```

Puis dans un autre terminal :
```bash
curl -X POST http://localhost:3000/api/generate-tp \
  -H "Content-Type: application/json" \
  -d '{"consigne":"Un TP sur le filtrage actif passe-bas","chapterId":"ch12"}'
```

## Resynchroniser les chapitres après une mise à jour de l'appli

À chaque fois qu'un chapitre est ajouté, modifié ou republié dans `data.js` :
```bash
npm run sync-chapters -- /chemin/vers/data.js
```
Puis redéployer sur Render (ou simplement redémarrer le service si le fichier a
changé sur le serveur) pour que le changement soit pris en compte.

---

## 🔑 Étape 1 — Créer un compte Groq et récupérer une clé API

1. Aller sur **https://console.groq.com**
2. Créer un compte (email ou Google), **aucune carte bancaire à renseigner**.
3. Une fois connecté, menu de gauche → **API Keys** → **Create API Key**.
4. Lui donner un nom (ex: `tp-generator`), copier la clé affichée (elle ne sera plus
   visible en entier ensuite — la garder de côté).

## 🔑 Étape 2 — Créer un compte Mistral et récupérer une clé API

1. Aller sur **https://console.mistral.ai**
2. Créer un compte, **aucune carte bancaire à renseigner** pour le tier gratuit
   "Experiment".
3. Menu **API Keys** → **Create new key**, copier la clé.
4. Optionnel mais utile : aller voir l'onglet **Limits** pour connaître le débit
   exact par minute de ton compte (ces chiffres ne sont pas toujours publiés
   correctement ailleurs, autant vérifier directement à la source).

## 🚀 Étape 3 — Déployer sur Render

1. Aller sur **https://render.com**, créer un compte si pas déjà fait (le même que
   pour le futur combat/marché fonctionnera).
2. **New +** → **Web Service**.
3. Connecter le dépôt GitHub contenant ce dossier (ou utiliser l'option "Public Git
   Repository" / upload manuel selon ce que propose Render au moment du déploiement).
4. Réglages du service :
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Instance Type** : Free
5. Dans l'onglet **Environment** du service, ajouter les variables :
   - `GROQ_API_KEY` = la clé récupérée à l'étape 1
   - `MISTRAL_API_KEY` = la clé récupérée à l'étape 2
   - `ALLOWED_ORIGINS` = l'URL Netlify de l'appli (ex: `https://revision-bts-ciel.netlify.app`)
     — laisser `*` temporairement si l'URL n'est pas encore connue, à resserrer ensuite.
6. **Deploy**. Au bout de quelques minutes, Render donne une URL du type
   `https://tp-generator-xxxx.onrender.com` — c'est cette URL que l'appli appellera.
7. Vérifier que ça répond : ouvrir `https://tp-generator-xxxx.onrender.com/api/status`
   dans un navigateur, doit afficher un JSON avec `"level":"green"`.

⚠️ **Sur le tier gratuit de Render, le service s'endort après une période
d'inactivité** et met quelques secondes à se réveiller au premier appel suivant.
Normal, pas un bug — prévenir les élèves d'une génération un peu plus longue si
personne ne l'a utilisé récemment.

---

Une fois ces 3 étapes faites et l'URL Render en main, on branche le tout côté appli
(nouvel onglet "Générateur de TP" dans Entraînement).
