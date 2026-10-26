// Livia: Coding a blocchi (12 livelli in 3 mondi, con il blocco Ripeti e le stelle)
// Dipende da: js/common.js, js/livia/robot.js
(() => {
  const { WORLDS, LEVELS, count, play, renderMaze, renderProgram, stars, newRobot } = Byte;
  const KEY = 'livia-code-stars';
  let saved = (() => {
    try { const a = JSON.parse(localStorage.getItem(KEY)); if (Array.isArray(a) && a.length === LEVELS.length) return a; } catch (e) {}
    return LEVELS.map(() => 0);
  })();
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {} };
  const unlocked = i => i === 0 || saved[i - 1] > 0;
  const worldOf = i => [...WORLDS].reverse().find(w => w.from <= i);

  let cur = saved.findIndex(s => !s);
  if (cur < 0) cur = LEVELS.length - 1;
  let program = [], open = null, running = false;
  const status = $('statusMsg'), seq = $('programSequence');

  function renderLevels() {
    $('levelSelect').innerHTML = WORLDS.map((w, wi) => {
      const end = wi + 1 < WORLDS.length ? WORLDS[wi + 1].from : LEVELS.length;
      let h = `<div class="world"><span class="world-name">${w.name}</span>`;
      for (let i = w.from; i < end; i++) {
        const ok = unlocked(i);
        h += `<button class="level-btn${i === cur ? ' active' : ''}${saved[i] ? ' done' : ''}" data-i="${i}"${ok ? '' : ' disabled'}>`
          + `${ok ? i + 1 : '🔒'}${saved[i] ? `<small>${'⭐'.repeat(saved[i])}</small>` : ''}</button>`;
      }
      return h + '</div>';
    }).join('');
  }

  function draw() {
    const lv = LEVELS[cur];
    renderProgram(seq, program, { open, del: true });
    $('counter').textContent = count(program);
    $('maxBlocks').textContent = lv.max;
    $('repeatBtn').hidden = !worldOf(cur).repeat || open !== null;
    $('closeRepBtn').hidden = open === null;
  }

  function loadLevel(i) {
    if (running) return;
    cur = i; program = []; open = null;
    const lv = LEVELS[cur];
    $('nextLevelBtn').hidden = true;
    $('levelInfo').textContent = `${worldOf(cur).name} · Livello ${cur + 1} · al massimo ${lv.max} blocchi${lv.tip ? '. ' + lv.tip : ''}`;
    setStatus(status, '');
    renderLevels();
    draw();
    renderMaze($('mazeGrid'), lv, newRobot(lv));
  }

  const full = () => setStatus(status, worldOf(cur).repeat ? '📦 Blocchi finiti! Prova a usare 🔁 Ripeti.' : '📦 Blocchi finiti!', '#F59E0B');

  $('levelSelect').addEventListener('click', e => {
    const b = e.target.closest('.level-btn');
    if (b && !b.disabled) loadLevel(+b.dataset.i);
  });

  document.querySelector('#coding .block-buttons').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b || running) return;
    const lv = LEVELS[cur];
    if (b.id === 'closeRepBtn') open = null;
    else if (b.dataset.cmd === 'REPEAT') {
      if (count(program) + 1 > lv.max) return full();
      program.push({ rep: 2, body: [] });
      open = program.length - 1;
    } else {
      if (count(program) >= lv.max) return full();
      (open !== null ? program[open].body : program).push(b.dataset.cmd);
    }
    setStatus(status, '');
    draw();
  });

  seq.addEventListener('click', e => {
    if (running) return;
    const t = e.target.closest('[data-act]');
    if (!t) return;
    const act = t.dataset.act;
    if (act === 'del') {
      const [i, j] = t.dataset.ref.split('-').map(Number);
      if (j === undefined || Number.isNaN(j)) {
        program.splice(i, 1);
        if (open === i) open = null; else if (open !== null && open > i) open--;
      } else program[i].body.splice(j, 1);
    } else if (act === 'inc' || act === 'dec') {
      const r = program[+t.dataset.i];
      r.rep = Math.min(9, Math.max(2, r.rep + (act === 'inc' ? 1 : -1)));
    } else if (act === 'open') open = +t.dataset.i;
    draw();
  });

  $('clearBtn').onclick = () => { if (!running) loadLevel(cur); };
  $('nextLevelBtn').onclick = () => { if (cur + 1 < LEVELS.length) loadLevel(cur + 1); };

  $('runBtn').onclick = async () => {
    if (running) return;
    if (!program.length) return setStatus(status, 'Aggiungi prima qualche blocco!', '#F59E0B');
    if (program.some(b => typeof b !== 'string' && !b.body.length))
      return setStatus(status, 'Il blocco 🔁 Ripeti è vuoto: aggiungi dei blocchi dentro!', '#F59E0B');
    running = true; open = null; draw();
    $('runBtn').disabled = $('clearBtn').disabled = true;
    setStatus(status, '');
    const lv = LEVELS[cur];
    const mark = s => {
      seq.querySelectorAll('.current').forEach(x => x.classList.remove('current'));
      if (s) { const el = seq.querySelector(`.code-block[data-ref="${s.ref}"]`); if (el) el.classList.add('current'); }
    };
    const res = await play(lv, program, $('mazeGrid'), mark);
    mark(null);
    if (res === 'win') {
      const st = stars(lv, program), n = count(program), best = count(lv.sol);
      if (st > saved[cur]) { saved[cur] = st; persist(); }
      renderLevels();
      setStatus(status, `🎉 Bravissima Livia! ${'⭐'.repeat(st)} (${n} blocchi, il minimo è ${best})${st < 3 ? ' Riesci con meno blocchi?' : ''}`, '#10B981');
      $('nextLevelBtn').hidden = cur + 1 >= LEVELS.length;
      speakEn('Great job Livia!');
    } else if (res === 'wall') setStatus(status, '💥 Ops! Byte ha urtato un ostacolo!', '#EF4444');
    else if (res === 'nostar') setStatus(status, '❌ Nessuna stella da raccogliere qui!', '#EF4444');
    else setStatus(status, '🤔 Byte non ha raccolto la stella. Riprova!', '#F59E0B');
    running = false;
    $('runBtn').disabled = $('clearBtn').disabled = false;
  };

  loadLevel(cur);
})();
