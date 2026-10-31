// Livia: Logica (serie di figure, numeri che crescono, indovinelli, ordini) - seconda elementare
// Dipende da: js/common.js, js/quiz.js
(() => {
  const { rnd, pick, numOptions, choice } = Quiz;
  const SET = ['🔴', '🔵', '🟢', '🟡', '🔺', '⬛', '⭐', '❤️'];
  const serie = () => {
    const [a, b, c] = shuffle([...SET]), k = pick(['ABC', 'AABB', 'ABB', 'ABAC']);
    const s = { ABC: [a, b, c, a, b, c, a, b], AABB: [a, a, b, b, a, a, b], ABB: [a, b, b, a, b, b, a], ABAC: [a, b, a, c, a, b, a] }[k];
    const ans = { ABC: c, AABB: b, ABB: b, ABAC: c }[k];
    return { id: 's' + k + a + b + c, prompt: 'Quale figura continua la serie?', big: s.join(' ') + ' ❓', bigClass: 'mid', optClass: 'emoji', options: choice(ans, SET) };
  };
  const crescenti = () => {
    const st = rnd(1, 2), s0 = rnd(1, 2), v = [0, 1, 2, 3].map(i => s0 + st * i);
    return { id: 'g' + v.join(), prompt: 'Quante stelle ci sono nel gruppo successivo?', big: v.map(n => '⭐'.repeat(n)).join('  |  ') + '  |  ❓', bigClass: 'mid', optClass: 'num',
      options: numOptions(s0 + st * 4, 4, [1, 2]) };
  };
  const indovinello = () => {
    const t = rnd(0, 4), n = rnd(3, 30), k = rnd(2, 9);
    const q = [
      [`Sono un numero. Se mi aggiungi ${k} ottieni ${n + k}. Chi sono?`, n],
      [`Sono un numero. Se mi togli ${k} ottieni ${n}. Chi sono?`, n + k],
      [`Sono un numero. Il mio doppio è ${n * 2}. Chi sono?`, n],
      [`Sono un numero. La mia metà è ${n}. Chi sono?`, n * 2],
      [`Sono un numero. Se mi moltiplichi per ${k} ottieni ${n * k}. Chi sono?`, n]
    ][t];
    return { id: q[0], prompt: 'Risolvi l\'indovinello!', big: q[0], bigClass: 'text', optClass: 'num', options: numOptions(q[1], 4, [1, 2, 10]) };
  };
  const NAMES = ['Anna', 'Bea', 'Carlo', 'Dario', 'Elisa', 'Luca', 'Marta', 'Sara'];
  const classifica = () => {
    const [a, b, c] = shuffle([...NAMES]).slice(0, 3);
    const [cmp, sup, inf] = pick([['veloce', 'veloce', 'lento'], ['forte', 'forte', 'debole'], ['grande', 'grande (di età)', 'piccolo']]);
    const stmts = shuffle([`${a} è più ${cmp} di ${b}.`, `${b} è più ${cmp} di ${c}.`]).join(' ');
    const top = Math.random() < .5;
    return { id: `cl${a}${b}${c}${cmp}${top}`, prompt: `Chi è il più ${top ? sup.split(' ')[0] : inf}?`, big: stmts, bigClass: 'text', optClass: 'mid',
      options: [a, b, c].map(x => ({ label: x, ok: x === (top ? a : c) })) };
  };
  const ordine = () => {
    const [x, y, z] = shuffle(['rossa', 'blu', 'verde']);
    const [txt, ans] = pick([['nel mezzo', y], ['PRIMA di tutte', x], ['ULTIMA', z]]);
    const stmts = shuffle([`La pallina ${x} è prima della ${y}.`, `La pallina ${z} è dopo la ${y}.`]).join(' ');
    return { id: `od${x}${y}${z}${txt}`, prompt: `Le palline sono in fila. Quale pallina è ${txt}?`, big: stmts, bigClass: 'text', optClass: 'mid',
      options: [x, y, z].map(c => ({ label: c, ok: c === ans })) };
  };
  Quiz.mount({
    el: $('lLogic'), key: 'livia-logic-level', tab: 'logica', lang: null,
    praise: ['🌟 Esatto!', '🌟 Bravissima Livia!', '🌟 Perfetto!'], retryOk: '✅ Giusto! Al prossimo, al primo colpo!', tryAgain: '🤔 Ci sei quasi, riprova!',
    levels: [
      { name: 'Serie di figure', intro: 'Trova la figura che continua la serie.', make: serie },
      { name: 'Gruppi che crescono', intro: 'I gruppi di stelle aumentano sempre dello stesso numero.', make: crescenti },
      { name: 'Indovinelli numerici', intro: 'Pensa al numero misterioso!', make: indovinello },
      { name: 'Chi è il primo?', intro: 'Usa gli indizi per mettere in ordine.', make: classifica },
      { name: 'Ragiona sull\'ordine', intro: 'Prima, dopo, nel mezzo: attenzione agli indizi!', make: ordine }
    ]
  });
})();
