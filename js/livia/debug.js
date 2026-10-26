// Livia: Trova l'errore (il programma di Byte è sbagliato: correggilo!)
// Dipende da: js/common.js, js/livia/robot.js
(() => {
  const { LEVELS, rep, play, renderMaze, renderProgram, newRobot } = Byte;
  const P = s => s.split(' ').map(x => ({ M: 'MOVE', L: 'LEFT', R: 'RIGHT', C: 'COLLECT' }[x]));
  const PUZZLES = [
    { lv: 1, prog: P('M M L M M C') },                         // giro sbagliato
    { lv: 0, prog: P('M M M M C') },                           // un passo di troppo
    { lv: 2, prog: P('R M M M R M M M C') },                   // giro sbagliato
    { lv: 2, prog: P('R M M M L M M M M C') },                 // un passo di troppo
    { lv: 3, prog: P('L M M M M L M M M M C') },               // giro sbagliato
    { lv: 4, prog: [rep(4, 'MOVE'), 'COLLECT'] },              // il ciclo è troppo corto
    { lv: 5, prog: [rep(5, 'MOVE'), 'RIGHT', rep(4, 'MOVE'), 'COLLECT'] }
  ];
  let idx = 0, prog = [], sel = null, running = false, started = false;
  const status = $('dbgStatus'), box = $('dbgProgram');
  const copy = o => JSON.parse(JSON.stringify(o));

  function draw() { renderProgram(box, prog, { pick: true, sel }); }
  function load(i) {
    idx = i; prog = copy(PUZZLES[i].prog); sel = null;
    $('dbgNum').textContent = i + 1;
    $('dbgTotal').textContent = PUZZLES.length;
    $('dbgNext').hidden = true;
    setStatus(status, '');
    draw();
    const lv = LEVELS[PUZZLES[i].lv];
    renderMaze($('dbgGrid'), lv, newRobot(lv));
  }

  box.addEventListener('click', e => {
    if (running) return;
    const t = e.target.closest('[data-act]');
    if (!t) return;
    if (t.dataset.act === 'pick') sel = t.dataset.ref;
    else if (t.dataset.act === 'inc' || t.dataset.act === 'dec') {
      const r = prog[+t.dataset.i];
      r.rep = Math.min(9, Math.max(2, r.rep + (t.dataset.act === 'inc' ? 1 : -1)));
    }
    draw();
  });

  $('dbgFix').addEventListener('click', e => {
    const b = e.target.closest('[data-fix]');
    if (!b || running) return;
    if (sel === null) return setStatus(status, '👆 Prima tocca il blocco da cambiare!', '#F59E0B');
    const [i, j] = sel.split('-').map(Number);
    const top = j === undefined, list = top ? prog : prog[i].body, k = top ? i : j;
    if (b.dataset.fix === 'REMOVE') list.splice(k, 1); else list[k] = b.dataset.fix;
    sel = null;
    setStatus(status, '');
    draw();
  });

  $('dbgReset').onclick = () => { if (!running) load(idx); };
  $('dbgNext').onclick = () => { if (idx + 1 < PUZZLES.length) load(idx + 1); };

  $('dbgRun').onclick = async () => {
    if (running) return;
    running = true; sel = null; draw();
    $('dbgRun').disabled = $('dbgReset').disabled = true;
    setStatus(status, '');
    const res = await play(LEVELS[PUZZLES[idx].lv], prog, $('dbgGrid'), s => {
      box.querySelectorAll('.current').forEach(x => x.classList.remove('current'));
      const el = box.querySelector(`.code-block[data-ref="${s.ref}"]`);
      if (el) el.classList.add('current');
    });
    box.querySelectorAll('.current').forEach(x => x.classList.remove('current'));
    if (res === 'win') {
      const last = idx + 1 >= PUZZLES.length;
      setStatus(status, last ? '🏆 Li hai trovati tutti! Sei una vera detective del codice!' : '🎉 Trovato! Byte ha preso la stella!', '#10B981');
      $('dbgNext').hidden = last;
      speakEn('Bug fixed! Great job!');
    } else setStatus(status, '🔎 Non ancora! Guarda dove si ferma Byte e cerca l\'errore.', '#F59E0B');
    running = false;
    $('dbgRun').disabled = $('dbgReset').disabled = false;
  };

  document.addEventListener('tabchange', e => {
    if (e.detail === 'debug' && !started) { started = true; load(0); }
  });
})();
