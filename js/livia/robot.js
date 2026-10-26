// Livia: motore del robot Byte, mondi e livelli (usato da coding.js e debug.js)
// Dipende da: js/common.js
const Byte = (() => {
  const M = 'MOVE', L = 'LEFT', R = 'RIGHT', C = 'COLLECT';
  const rep = (n, ...body) => ({ rep: n, body });
  const DR = [-1, 0, 1, 0], DC = [0, 1, 0, -1];            // dir: 0=su 1=destra 2=giù 3=sinistra
  const ARROWS = ['▲', '▶', '▼', '◀'];
  const LABELS = { MOVE: '⬆️ Avanza', LEFT: '↺ Sinistra', RIGHT: '↻ Destra', COLLECT: '🌟 Raccogli' };

  const WORLDS = [
    { name: '🌳 Bosco', repeat: false, from: 0 },
    { name: '🏙️ Città', repeat: true, from: 4 },
    { name: '🚀 Spazio', repeat: true, from: 8 }
  ];

  // sol = soluzione di riferimento (il suo numero di blocchi decide le 3 stelle)
  const LEVELS = [
    { size: 4, start: [0,0], dir: 1, star: [0,3], walls: [], max: 8, sol: [M,M,M,C] },
    { size: 4, start: [0,0], dir: 1, star: [2,2], walls: [], max: 10, sol: [M,M,R,M,M,C] },
    { size: 4, start: [0,0], dir: 1, star: [3,3], walls: [[1,1],[1,2]], max: 13, sol: [R,M,M,M,L,M,M,M,C] },
    { size: 5, start: [0,0], dir: 2, star: [4,4], walls: [[1,0],[1,1],[3,2],[3,3]], max: 14, sol: [L,M,M,M,M,R,M,M,M,M,C] },
    { size: 6, start: [0,0], dir: 1, star: [0,5], walls: [], max: 5, sol: [rep(5,M),C],
      tip: 'Novità: il blocco 🔁 Ripeti! Toccalo, aggiungi dentro i blocchi da ripetere e scegli quante volte con + e −.' },
    { size: 6, start: [0,0], dir: 1, star: [5,5], walls: [[2,2],[3,3]], max: 8, sol: [rep(5,M),R,rep(5,M),C] },
    { size: 5, start: [0,0], dir: 1, star: [4,4], walls: [[0,2],[1,3],[2,4],[2,0],[3,1],[4,2]], max: 8, sol: [rep(4,M,R,M,L),C],
      tip: 'Trucco: puoi ripetere anche un gruppo di blocchi insieme!' },
    { size: 6, start: [0,0], dir: 1, star: [4,4], walls: [[1,1],[1,3],[3,3],[3,2]], max: 10, sol: [rep(2,M,M,R,M,M,L),C] },
    { size: 5, start: [0,0], dir: 2, star: [2,4], walls: [[1,1],[2,2],[3,3],[1,3]], max: 11, sol: [rep(4,M),L,rep(4,M),L,rep(2,M),C],
      tip: 'Puoi usare più blocchi Ripeti nello stesso programma!' },
    { size: 5, start: [0,0], dir: 1, star: [4,0], walls: [[1,0],[2,0],[3,0],[1,1],[2,1],[3,1]], max: 10, sol: [rep(2,M),R,rep(4,M),R,rep(2,M),C] },
    { size: 6, start: [0,0], dir: 1, star: [5,5], walls: [[0,2],[1,3],[2,4],[3,5],[1,0],[2,1],[3,2],[4,3],[5,4]], max: 7, sol: [rep(5,M,R,M,L),C] },
    { size: 6, start: [5,0], dir: 0, star: [0,5], walls: [[4,2],[3,3],[2,4],[1,4],[3,0],[2,1],[1,2],[0,2]], max: 12,
      sol: [rep(3,M,R,M,L),rep(2,M),R,rep(2,M),C], tip: 'Livello finale: scala, poi dritto, poi di nuovo dritto. Ce la fai!' }
  ];

  const count = p => p.reduce((n, b) => n + (typeof b === 'string' ? 1 : 1 + b.body.length), 0);
  const newRobot = lv => ({ r: lv.start[0], c: lv.start[1], dir: lv.dir });

  function expand(p) {                       // programma -> comandi uno per uno (con riferimento al blocco)
    const out = [];
    p.forEach((b, i) => {
      if (typeof b === 'string') out.push({ cmd: b, ref: `${i}` });
      else for (let k = 0; k < b.rep; k++) b.body.forEach((c, j) => out.push({ cmd: c, ref: `${i}-${j}` }));
    });
    return out;
  }

  function exec(lv, rb, cmd) {               // 'ok' | 'wall' | 'win' | 'nostar'
    if (cmd === LEFT_) { rb.dir = (rb.dir + 3) % 4; return 'ok'; }
    if (cmd === RIGHT_) { rb.dir = (rb.dir + 1) % 4; return 'ok'; }
    if (cmd === COLLECT_) return rb.r === lv.star[0] && rb.c === lv.star[1] ? 'win' : 'nostar';
    const nr = rb.r + DR[rb.dir], nc = rb.c + DC[rb.dir];
    if (nr < 0 || nr >= lv.size || nc < 0 || nc >= lv.size || lv.walls.some(w => w[0] === nr && w[1] === nc)) return 'wall';
    rb.r = nr; rb.c = nc;
    return 'ok';
  }
  const LEFT_ = L, RIGHT_ = R, COLLECT_ = C;

  function simulate(lv, p) {                 // senza animazione: 'win' | 'wall' | 'nostar' | 'end'
    const rb = newRobot(lv);
    for (const s of expand(p)) { const r = exec(lv, rb, s.cmd); if (r !== 'ok') return r; }
    return 'end';
  }

  const stars = (lv, p) => { const n = count(p), b = count(lv.sol); return n <= b ? 3 : n <= b + 2 ? 2 : 1; };

  function renderMaze(grid, lv, rb) {
    grid.style.setProperty('--cell', lv.size > 5 ? '46px' : '55px');
    grid.style.gridTemplateColumns = `repeat(${lv.size}, var(--cell))`;
    grid.innerHTML = '';
    for (let r = 0; r < lv.size; r++) for (let c = 0; c < lv.size; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (lv.walls.some(w => w[0] === r && w[1] === c)) cell.classList.add('wall');
      if (r === rb.r && c === rb.c) {
        cell.textContent = '🤖';
        const a = document.createElement('span');
        a.className = 'arrow';
        a.textContent = ARROWS[rb.dir];
        cell.appendChild(a);
      } else if (r === lv.star[0] && c === lv.star[1]) cell.textContent = '🌟';
      grid.appendChild(cell);
    }
  }

  async function play(lv, p, grid, onStep) {  // esegue con animazione
    const rb = newRobot(lv);
    renderMaze(grid, lv, rb);
    for (const s of expand(p)) {
      if (onStep) onStep(s);
      await new Promise(r => setTimeout(r, 450));
      const res = exec(lv, rb, s.cmd);
      renderMaze(grid, lv, rb);
      if (res !== 'ok') return res;
    }
    return 'end';
  }

  /* Disegna il programma. opts: open (ripeti aperto), del (✕), pick (blocchi selezionabili), sel (riferimento scelto) */
  function renderProgram(box, p, opts = {}) {
    box.innerHTML = '';
    if (!p.length) { box.innerHTML = '<span class="empty-hint">Clicca sui blocchi per aggiungerli...</span>'; return; }
    const block = (cmd, ref) => {
      const b = document.createElement('div');
      b.className = 'code-block' + (opts.sel === ref ? ' sel' : '');
      b.dataset.ref = ref;
      if (opts.pick) b.dataset.act = 'pick';
      b.append(LABELS[cmd] + ' ');
      if (opts.del) {
        const x = document.createElement('span');
        x.className = 'remove-btn'; x.textContent = '✕'; x.dataset.act = 'del'; x.dataset.ref = ref;
        b.appendChild(x);
      }
      return b;
    };
    p.forEach((b, i) => {
      if (typeof b === 'string') { box.appendChild(block(b, `${i}`)); return; }
      const d = document.createElement('div');
      d.className = 'rep-block' + (opts.open === i ? ' open' : '');
      d.dataset.act = 'open'; d.dataset.i = i;
      d.innerHTML = `<div class="rep-head">🔁 Ripeti <button class="rep-btn" data-act="dec" data-i="${i}" aria-label="Meno">−</button><b>${b.rep}</b><button class="rep-btn" data-act="inc" data-i="${i}" aria-label="Più">+</button> volte`
        + (opts.del ? ` <span class="remove-btn" data-act="del" data-ref="${i}">✕</span>` : '') + '</div>';
      const body = document.createElement('div');
      body.className = 'rep-body';
      if (!b.body.length) body.innerHTML = '<span class="empty-hint">aggiungi qui i blocchi da ripetere</span>';
      b.body.forEach((c, j) => body.appendChild(block(c, `${i}-${j}`)));
      d.appendChild(body);
      box.appendChild(d);
    });
  }

  return { WORLDS, LEVELS, rep, count, expand, exec, simulate, stars, renderMaze, play, renderProgram, newRobot, LABELS };
})();
