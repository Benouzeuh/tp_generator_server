// src/queue.js
// File d'attente en mémoire, traitement un par un (concurrency = 1). C'est volontairement
// simple : pas de base de données, pas de Redis — le serveur Render est mono-instance,
// une file en mémoire suffit et redémarre proprement (file vidée) si le service redémarre.
// Traiter une seule requête à la fois évite aussi de dépasser le débit/minute des
// fournisseurs même en cas de pic (30 clics groupés), au prix d'un peu d'attente.

const pending = [];
let processing = false;

function getQueueLength() {
  return pending.length + (processing ? 1 : 0);
}

function processNext() {
  if (processing || pending.length === 0) return;
  processing = true;
  const job = pending.shift();

  job
    .task()
    .then((result) => job.resolve(result))
    .catch((err) => job.reject(err))
    .finally(() => {
      processing = false;
      processNext();
    });
}

/**
 * Ajoute une tâche à la file. `task` est une fonction async sans argument.
 * Retourne une promesse qui se résout avec le résultat de `task`, plus la position
 * dans la file au moment de l'ajout (utile pour afficher "X élève(s) avant toi").
 */
function enqueue(task) {
  const positionAtEnqueue = getQueueLength();
  const promise = new Promise((resolve, reject) => {
    pending.push({ task, resolve, reject });
  });
  processNext();
  return { promise, positionAtEnqueue };
}

module.exports = { enqueue, getQueueLength };
