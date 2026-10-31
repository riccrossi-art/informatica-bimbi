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
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    speechSynthesis.speak(u);
  } catch (e) { return false; }
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

/* Menù per aree: prima si sceglie l'area (carte grandi), poi uno dei giochi dell'area */
function initAreas(cfg) {
  const show = (el, on) => { el.hidden = !on; el.style.display = on ? '' : 'none'; };
  const menu = $(cfg.menu), bar = $(cfg.bar), nav = $(cfg.nav);
  const btns = [...document.querySelectorAll(cfg.btnSel)], secs = document.querySelectorAll(cfg.secSel);
  function home() {
    secs.forEach(s => s.classList.remove('active'));
    btns.forEach(b => b.classList.remove('active'));
    show(menu, true); show(bar, false); show(nav, false);
    document.dispatchEvent(new CustomEvent('tabchange', { detail: null }));
  }
  function open(card) {
    const mine = btns.filter(b => b.dataset.area === card.dataset.area);
    $(cfg.title).textContent = card.querySelector('.ico').textContent + ' ' + card.querySelector('b').textContent;
    show(menu, false); show(bar, true);
    btns.forEach(b => show(b, mine.includes(b)));
    show(nav, mine.length > 1);
    mine[0].click();
  }
  menu.addEventListener('click', e => { const c = e.target.closest('.area-card'); if (c) open(c); });
  $(cfg.back).onclick = home;
  home();
}
