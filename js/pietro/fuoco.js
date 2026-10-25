// Pietro: Spegni il Fuoco (livelli a tempo)
// Dipende da: js/common.js

/* --- FUOCO: LIVELLI A TEMPO --- */
const FIRE_SECONDS = 30, MAX_HOUSES = 12;
let level = 1, fires = 0, fireState = 'ready', endAt = 0, timer = null;

const housesFor = lv => Math.min(lv + 2, MAX_HOUSES);   // livello 1 = 3 casette, 2 = 4, ...

function showTime(sec) {
  $('fireTime').textContent = sec;
  $('fireTime').parentElement.classList.toggle('low', sec <= 10 && fireState === 'playing');
}

function buildFire() {
  clearInterval(timer);
  fireState = 'ready';
  const st = $('fireStation');
  st.innerHTML = '';
  for (let i = 1; i <= housesFor(level); i++) {
    const b = document.createElement('button');
    b.className = 'house-box burning';
    b.innerHTML = `<span class="fire-icon">🔥</span><strong>Casetta ${i}</strong>`;
    st.appendChild(b);
  }
  $('fireLevel').textContent = level;
  $('fireMsg').textContent = '';
  $('fireMsg').className = 'msg';
  $('fireBtn').textContent = '▶️ Via!';
  $('fireBtn').style.display = '';
  $('fireHint').textContent = `Spegni tutte le ${housesFor(level)} casette in ${FIRE_SECONDS} secondi!`;
  showTime(FIRE_SECONDS);
}

function endFire(won) {
  clearInterval(timer);
  fireState = won ? 'won' : 'lost';
  const msg = $('fireMsg');
  msg.className = 'msg ' + (won ? 'win' : 'lose');
  if (won) {
    msg.textContent = `🎉 Livello ${level} superato! Prossimo: ${housesFor(level + 1)} casette!`;
    $('fireBtn').textContent = `➡️ Livello ${level + 1}`;
    speak('Bravissimo Pietro! Hai vinto! Livello superato!');
  } else {
    msg.textContent = '⏰ Tempo scaduto! Riprova!';
    $('fireBtn').textContent = '🔄 Riprova';
    speak('Tempo scaduto! Riprova!');
  }
  $('fireBtn').style.display = '';
  showTime(won ? Math.max(0, Math.ceil((endAt - Date.now()) / 1000)) : 0);
}

function tick() {
  const left = Math.ceil((endAt - Date.now()) / 1000);
  if (left <= 0) endFire(false); else showTime(left);
}

$('fireBtn').onclick = () => {
  if (fireState === 'ready') {
    fireState = 'playing';
    endAt = Date.now() + FIRE_SECONDS * 1000;
    $('fireBtn').style.display = 'none';
    $('fireMsg').textContent = '🚒 Spegni, spegni, spegni!';
    speak('Via!');
    showTime(FIRE_SECONDS);
    timer = setInterval(tick, 200);
  } else if (fireState === 'won') {
    level++;
    buildFire();
  } else if (fireState === 'lost') {
    buildFire();
  }
};

$('fireStation').addEventListener('click', e => {
  const house = e.target.closest('.house-box');
  if (!house || fireState !== 'playing' || !house.classList.contains('burning')) return;
  const icon = house.querySelector('.fire-icon');
  house.classList.remove('burning');
  house.classList.add('out');
  icon.textContent = '💧';
  setTimeout(() => { icon.textContent = '🏠'; }, 500);
  $('fireCount').textContent = ++fires;
  if (!document.querySelector('.house-box.burning')) endFire(true);
  else speak('Spento!');
});

buildFire();

// Se si cambia scheda durante una partita, si riparte da capo
document.addEventListener('tabchange', e => {
  if (e.detail !== 'fire' && fireState === 'playing') buildFire();
});
