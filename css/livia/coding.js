// Livia: Coding a blocchi
// Dipende da: js/common.js

/* --- CODING LAB --- */
// dir: 0=su, 1=destra, 2=giù, 3=sinistra
const levels = [
  { size: 4, start: [0,0], dir: 1, star: [0,3], walls: [] },
  { size: 4, start: [0,0], dir: 1, star: [2,2], walls: [] },
  { size: 4, start: [0,0], dir: 1, star: [3,3], walls: [[1,1],[1,2]] },
  { size: 5, start: [0,0], dir: 2, star: [4,4], walls: [[1,0],[1,1],[3,2],[3,3]] }
];
const MAX_BLOCKS = 14;   // con 10 il livello 4 era impossibile (servono 11 blocchi)
const ARROWS = ['▲','▶','▼','◀'];
const LABELS = { MOVE:'⬆️ Avanza', LEFT:'↺ Sinistra', RIGHT:'↻ Destra', COLLECT:'🌟 Raccogli' };
let currentLevel = 0, robot = { r:0, c:0, dir:1 }, program = [], running = false;

function loadLevel(idx) {
  if (running) return;
  currentLevel = idx;
  document.querySelectorAll('.level-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
  program = [];
  renderProgram();
  resetLevelState();
}
function resetLevelState() {
  const l = levels[currentLevel];
  robot = { r: l.start[0], c: l.start[1], dir: l.dir };
  renderMaze();
  setStatus($('statusMsg'), '');
}
function renderMaze() {
  const l = levels[currentLevel], grid = $('mazeGrid');
  grid.style.gridTemplateColumns = `repeat(${l.size}, 55px)`;
  grid.innerHTML = '';
  for (let r = 0; r < l.size; r++) for (let c = 0; c < l.size; c++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    if (l.walls.some(w => w[0] === r && w[1] === c)) cell.classList.add('wall');
    if (r === robot.r && c === robot.c) {
      cell.textContent = '🤖';
      const a = document.createElement('span');
      a.className = 'arrow';
      a.textContent = ARROWS[robot.dir];
      cell.appendChild(a);
    } else if (r === l.star[0] && c === l.star[1]) cell.textContent = '🌟';
    grid.appendChild(cell);
  }
}
function renderProgram(active = -1) {
  const seq = $('programSequence');
  $('counter').textContent = program.length;
  $('maxBlocks').textContent = MAX_BLOCKS;
  seq.innerHTML = '';
  if (!program.length) {
    seq.innerHTML = '<span style="color:#64748B;font-size:.9rem">Clicca sui blocchi sopra per aggiungerli...</span>';
    return;
  }
  program.forEach((cmd, idx) => {
    const b = document.createElement('div');
    b.className = 'code-block' + (idx === active ? ' current' : '');
    b.append(LABELS[cmd] + ' ');
    const x = document.createElement('span');
    x.className = 'remove-btn';
    x.textContent = '✕';
    x.onclick = () => { if (!running) { program.splice(idx, 1); renderProgram(); } };
    b.appendChild(x);
    seq.appendChild(b);
  });
}
document.querySelector('.level-select').addEventListener('click', e => {
  const i = [...document.querySelectorAll('.level-btn')].indexOf(e.target);
  if (i >= 0) loadLevel(i);
});
document.querySelector('.block-buttons').addEventListener('click', e => {
  const b = e.target.closest('[data-cmd]');
  if (!b || running || program.length >= MAX_BLOCKS) return;
  program.push(b.dataset.cmd);
  renderProgram();
});
$('clearBtn').onclick = () => { if (!running) { program = []; renderProgram(); resetLevelState(); } };

$('runBtn').onclick = async () => {
  if (running) return;
  const status = $('statusMsg');
  if (!program.length) { setStatus(status, 'Aggiungi prima qualche blocco!', '#F59E0B'); return; }
  running = true;
  $('runBtn').disabled = $('clearBtn').disabled = true;
  resetLevelState();
  const l = levels[currentLevel];
  let done = false;

  for (let i = 0; i < program.length && !done; i++) {
    renderProgram(i);
    await new Promise(r => setTimeout(r, 500));
    const cmd = program[i];
    if (cmd === 'MOVE') {
      let nr = robot.r, nc = robot.c;
      if (robot.dir === 0) nr--; else if (robot.dir === 1) nc++; else if (robot.dir === 2) nr++; else nc--;
      const ok = nr >= 0 && nr < l.size && nc >= 0 && nc < l.size && !l.walls.some(w => w[0] === nr && w[1] === nc);
      if (ok) { robot.r = nr; robot.c = nc; }
      else { setStatus(status, '💥 Ops! Il robot ha urtato un ostacolo!', '#EF4444'); done = true; }
    } else if (cmd === 'LEFT') robot.dir = (robot.dir + 3) % 4;
    else if (cmd === 'RIGHT') robot.dir = (robot.dir + 1) % 4;
    else if (cmd === 'COLLECT') {
      if (robot.r === l.star[0] && robot.c === l.star[1]) {
        setStatus(status, '🎉 Bravissima Livia! Codice eseguito con successo!', '#10B981');
        speakEn('Great job Livia!');
      } else setStatus(status, '❌ Nessuna stella da raccogliere qui!', '#EF4444');
      done = true;
    }
    renderMaze();
  }
  if (!done) setStatus(status, '🤔 Il robot non ha raccolto la stella. Riprova!', '#F59E0B');
  renderProgram();
  running = false;
  $('runBtn').disabled = $('clearBtn').disabled = false;
};

loadLevel(0);
