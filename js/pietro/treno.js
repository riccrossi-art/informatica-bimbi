// Pietro: Il Treno di Pietro (missioni del capostazione, costruzione libera, partenza animata)
// Dipende da: js/common.js
(() => {
  const WAGONS = { red: '🔴🚃', yellow: '🟡🚃', blue: '🔵🚃', green: '🟢🚃', box: '📦📦', cow: '🐮🚃' };
  const MISSIONS = ['red yellow', 'yellow red blue', 'blue blue red', 'green box yellow', 'red yellow red yellow',
    'cow box cow green', 'blue red green yellow box', 'cow cow yellow red box'].map(s => s.split(' '));
  const MAX = 8, KEY = 'pietro-treno-missione', NUM = ['', 'un', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto'];
  const load = () => { try { return Math.min(+localStorage.getItem(KEY) || 0, MISSIONS.length - 1); } catch (e) { return 0; } };
  const save = n => { try { localStorage.setItem(KEY, n); } catch (e) {} };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let mode = 'mission', wagons = [], mission = load(), going = false;
  const track = $('trainTrack'), rail = $('railway'), msg = $('trainMsg');

  function render(newIdx = -1, wrong = []) {
    track.innerHTML = '<div class="train-part loco">🚂</div>';
    wagons.forEach((w, i) => {
      const d = document.createElement('div');
      d.className = 'train-part' + (i === newIdx ? ' new' : '') + (wrong.includes(i) ? ' wrong' : '');
      d.textContent = WAGONS[w];
      track.appendChild(d);
    });
    if (newIdx >= 0) track.lastElementChild.scrollIntoView({ inline: 'end', block: 'nearest' });
  }
  function showMode() {
    const isM = mode === 'mission';
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    $('orderCard').style.display = isM ? '' : 'none';
    $('trainHint').textContent = isM ? 'Costruisci il treno uguale a quello del capostazione, poi premi Parti!' : 'Aggancia i vagoni che vuoi, poi premi Parti!';
    if (isM) {
      $('orderTrain').textContent = '🚂 ' + MISSIONS[mission].map(w => WAGONS[w]).join(' ');
      $('missionNum').textContent = `Missione ${mission + 1} di ${MISSIONS.length}`;
    }
    setStatus(msg, '');
    rail.classList.remove('arrived');
    render();
  }
  function confetti() {
    for (let i = 0; i < 12; i++) {
      const s = document.createElement('span');
      s.className = 'confetti';
      s.textContent = ['⭐', '🎉', '✨'][i % 3];
      s.style.left = (Math.random() * 92) + '%';
      s.style.animationDelay = (Math.random() * .6) + 's';
      rail.appendChild(s);
      setTimeout(() => s.remove(), 2600);
    }
  }
  async function go() {
    if (going) return;
    if (!wagons.length) return setStatus(msg, 'Aggiungi prima qualche vagone!', '#F59E0B');
    if (mode === 'mission') {
      const t = MISSIONS[mission];
      if (t.length !== wagons.length || t.some((w, i) => w !== wagons[i])) {
        const wrong = wagons.map((w, i) => w !== t[i] ? i : -1).filter(i => i >= 0);
        if (wagons.length < t.length) wrong.push(wagons.length - 1);
        render(-1, wrong);
        setStatus(msg, '🤔 Quasi! Guarda bene l\'ordine del capostazione.', '#F59E0B');
        speak('Quasi! Guarda bene l\'ordine.');
        return;
      }
    }
    going = true;
    setStatus(msg, '');
    rail.classList.remove('go', 'arrived'); void rail.offsetWidth; rail.classList.add('go');
    speak('Ciuf ciuf! Si parte!');
    await sleep(5500);
    rail.classList.remove('go'); rail.classList.add('arrived');   // resta davanti alla stazione
    confetti();
    if (mode === 'mission') {
      const last = mission === MISSIONS.length - 1;
      setStatus(msg, last ? '🏆 Hai finito tutte le missioni! Si ricomincia!' : '🎉 Missione compiuta! Bravo Pietro!', '#15803D');
      speak(last ? 'Evviva! Hai finito tutte le missioni!' : 'Bravo Pietro! Missione compiuta!');
      mission = last ? 0 : mission + 1; save(mission);
      await sleep(2800);
      wagons = []; showMode();
    } else {
      const n = wagons.length;
      setStatus(msg, `🎉 Che bel treno con ${n} vagoni!`, '#15803D');
      speak(`Evviva! Un treno con ${NUM[n]} vagoni!`);
    }
    going = false;
  }

  document.querySelector('#train .wagon-picker').addEventListener('click', e => {
    const b = e.target.closest('[data-wagon]');
    if (!b || going) return;
    if (wagons.length >= MAX) return setStatus(msg, '🚉 Il treno è lunghissimo! Premi Parti.', '#F59E0B');
    wagons.push(b.dataset.wagon);
    setStatus(msg, '');
    render(wagons.length - 1);
  });
  document.querySelector('.train-modes').addEventListener('click', e => {
    const b = e.target.closest('.mode-btn');
    if (!b || going) return;
    mode = b.dataset.mode; wagons = []; showMode();
  });
  $('trainGo').onclick = go;
  $('trainUndo').onclick = () => { if (!going) { wagons.pop(); setStatus(msg, ''); render(); } };
  $('trainReset').onclick = () => { if (!going) { wagons = []; setStatus(msg, ''); render(); } };

  showMode();
})();
