// Livia: Logica e Matematica (calcoli, serie, tabelline, segni, problemi e intrusi)
// Dipende da: js/common.js, js/quiz.js
(() => {
  const { rnd, pick, numOptions } = Quiz;
  const numQ = (big, ans, prompt, deltas, extra = {}) =>
    ({ id: big, prompt, big, optClass: 'num', options: numOptions(ans, 4, deltas), ...extra });

  const calc = () => {
    if (Math.random() < .5) { const a = rnd(1, 19), b = rnd(1, 20 - a); return numQ(`${a} + ${b} = ❓`, a + b, 'Quanto fa?'); }
    const a = rnd(5, 20), b = rnd(1, a - 1);
    return numQ(`${a} − ${b} = ❓`, a - b, 'Quanto fa?');
  };
  const serie = () => {
    const step = pick([2, 3, 4, 5, 10]), down = Math.random() < .3;
    const start = down ? rnd(step * 5, step * 5 + 10) : rnd(0, 15);
    const seq = [0, 1, 2, 3, 4].map(i => start + (down ? -1 : 1) * step * i);
    const h = rnd(1, 4);
    return numQ(seq.map((n, i) => i === h ? '❓' : n).join(',  '), seq[h], 'Completa la serie!', [step, 1, 2 * step]);
  };
  const tabellina = () => { const a = pick([2, 3, 4, 5, 10]), b = rnd(1, 10); return numQ(`${a} × ${b} = ❓`, a * b, 'Tabellina!', [a, 1, 2]); };
  const mancante = () => {
    if (Math.random() < .5) { const a = rnd(3, 15), b = rnd(3, 15); return numQ(`${a} + ❓ = ${a + b}`, b, 'Che numero manca?', [1, 2, 3]); }
    for (;;) {
      const a = rnd(2, 9), b = rnd(2, 9), ops = [['+', a + b], ['−', a - b], ['×', a * b]], k = rnd(0, 2), c = ops[k][1];
      if (c <= 0 || ops.filter(o => o[1] === c).length > 1) continue;      // un solo segno deve funzionare
      return { id: `${a}?${b}=${c}`, prompt: 'Quale segno manca?', big: `${a} ❓ ${b} = ${c}`, optClass: 'num',
        options: ops.map(([s], i) => ({ label: s, ok: i === k })) };
    }
  };
  const problema = () => {
    const t = rnd(0, 3);
    let a = rnd(2, 5), b = rnd(2, 6), text, ans;
    if (t === 0) { text = `Livia ha ${a} scatole con ${b} biscotti ciascuna. Quanti biscotti ha in tutto?`; ans = a * b; }
    else if (t === 1) { a = rnd(8, 20); b = rnd(2, a - 1); text = `Nel cestino ci sono ${a} mele. Ne mangi ${b}. Quante ne restano?`; ans = a - b; }
    else if (t === 2) { a = rnd(5, 15); b = rnd(2, 9); text = `Pietro ha ${a} macchinine e ne riceve ${b} in regalo. Quante ne ha ora?`; ans = a + b; }
    else { text = `Ci sono ${a * b} caramelle da dividere in parti uguali tra ${b} amici. Quante ne prende ciascuno?`; ans = a; }
    return numQ(text, ans, 'Leggi e risolvi!', [1, 2, 3], { bigClass: 'text' });
  };
  const GROUPS = [['🍎', '🍌', '🍇', '🍓', '🍒', '🍐'], ['🐶', '🐱', '🐮', '🐷', '🐸', '🐻'], ['🚗', '🚌', '🚂', '✈️', '🚲', '🚢']];
  const intruso = () => {
    const [g1, g2] = shuffle([...GROUPS]);
    const three = shuffle([...g1]).slice(0, 3), odd = pick(g2);
    return { id: 'i' + three.join('') + odd, prompt: 'Trova l\'intruso: quale non c\'entra con gli altri?', big: '🤔', optClass: 'emoji',
      options: [...three.map(x => ({ label: x })), { label: odd, ok: true }] };
  };
  const confronto = () => {
    const big = Math.random() < .5;
    const gen = () => {
      const t = rnd(0, 2);
      if (t === 0) { const a = rnd(2, 9), b = rnd(2, 9); return [`${a} × ${b}`, a * b]; }
      if (t === 1) { const a = rnd(10, 40), b = rnd(5, 30); return [`${a} + ${b}`, a + b]; }
      const a = rnd(30, 60), b = rnd(5, 25); return [`${a} − ${b}`, a - b];
    };
    let xs;
    do { xs = [gen(), gen(), gen()]; } while (new Set(xs.map(x => x[1])).size < 3);
    const t = big ? Math.max(...xs.map(x => x[1])) : Math.min(...xs.map(x => x[1]));
    return { id: xs.map(x => x[0]).join(), prompt: big ? 'Quale risultato è il più GRANDE?' : 'Quale risultato è il più PICCOLO?', big: '🧮', optClass: 'group',
      options: xs.map(([l, v]) => ({ label: l, ok: v === t })) };
  };

  Quiz.mount({
    el: $('lMath'), key: 'livia-math-level', tab: 'math', lang: null,
    praise: ['🌟 Esatto!', '🌟 Bravissima Livia!', '🌟 Perfetto!'], retryOk: '✅ Giusto! Al prossimo, al primo colpo!', tryAgain: '🤔 Ci sei quasi, riprova!',
    levels: [
      { name: 'Calcolatrice umana', intro: 'Addizioni e sottrazioni fino a 20.', make: calc },
      { name: 'Detective delle serie', intro: 'Trova il numero che manca nella serie.', make: serie },
      { name: 'Campionessa di tabelline', intro: 'Tabelline del 2, 3, 4, 5 e 10.', make: tabellina },
      { name: 'Segni e numeri misteriosi', intro: 'Trova il numero o il segno che manca.', make: mancante },
      { name: 'Grande logica', intro: 'Problemi, intrusi e confronti: serve ragionare!', make: () => pick([problema, problema, intruso, confronto])() }
    ]
  });
})();
