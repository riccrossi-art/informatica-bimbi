// Pietro: Il Treno di Pietro
// Dipende da: js/common.js

/* --- TRENO --- */
const MAX_WAGONS = 10;
let wagons = 0;
function addPart(text) {
  const d = document.createElement('div');
  d.className = 'train-part';
  d.textContent = text;
  $('trainTrack').appendChild(d);
  d.scrollIntoView({ inline: 'end', block: 'nearest' });
}
function resetTrain(announce) {
  $('trainTrack').innerHTML = '';
  wagons = 0;
  addPart('🚂');
  if (announce) speak('Il treno riparte dalla stazione!');
}
document.querySelector('.wagon-picker').addEventListener('click', e => {
  const b = e.target.closest('[data-wagon]');
  if (!b) return;
  if (wagons >= MAX_WAGONS) { speak('Che treno lunghissimo! Premi riparti.'); return; }
  addPart(b.dataset.wagon);
  wagons++;
  speak('Ciu ciu! Vagone aggiunto!');
});
$('trainReset').onclick = () => resetTrain(true);

resetTrain(false);
