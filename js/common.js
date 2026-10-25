// Funzioni condivise da tutte le pagine
const $ = id => document.getElementById(id);

const shuffle = a => {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

function setStatus(el, msg, color) { el.textContent = msg; el.style.color = color || ''; }

/* Voce (sintesi vocale del browser). Restituisce false se non supportata. */
let muted = false;
function speak(text, lang = 'it-IT') {
  if (!('speechSynthesis' in window)) return false;
  if (muted) return true;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  speechSynthesis.speak(u);
  return true;
}
const speakEn = text => speak(text, 'en-US');

if ($('muteBtn')) $('muteBtn').onclick = e => {
  muted = !muted;
  if (muted && 'speechSynthesis' in window) speechSynthesis.cancel();
  e.currentTarget.textContent = muted ? '🔇 Muto' : '🔊 Voce';
  e.currentTarget.setAttribute('aria-pressed', muted);
};

/* Schede: mostra una sezione e avvisa i giochi con l'evento "tabchange" */
function initTabs(navId, btnSel, key, secSel) {
  $(navId).addEventListener('click', e => {
    const b = e.target.closest(btnSel);
    if (!b) return;
    const id = b.dataset[key];
    document.querySelectorAll(secSel).forEach(s => s.classList.toggle('active', s.id === id));
    document.querySelectorAll(btnSel).forEach(x => x.classList.toggle('active', x === b));
    document.dispatchEvent(new CustomEvent('tabchange', { detail: id }));
  });
}
