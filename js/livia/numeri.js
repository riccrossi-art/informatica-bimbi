// Livia: Numeri (valore delle cifre, prima/dopo, confronti, pari/dispari, composizione) - seconda elementare
// Dipende da: js/common.js, js/quiz.js
(() => {
  const { rnd, pick, numOptions, choice } = Quiz;
  const num = (big, ans, prompt, d) => ({ id: prompt + big, prompt, big, optClass: 'num', options: numOptions(ans, 4, d || [1, 2, 10]) });

  const posto = () => {
    const n = rnd(100, 999), [nome, i] = pick([['centinaia', 0], ['decine', 1], ['unità', 2]]);
    return { id: `p${n}${nome}`, prompt: `Qual è la cifra delle ${nome} nel numero ${n}?`, big: String(n).split('').join(' '), optClass: 'num',
      options: choice(String(n)[i], '0123456789'.split('')) };
  };
  const prima_dopo = () => {
    const dopo = Math.random() < .5, n = pick([rnd(10, 98) * 10 + 9, rnd(11, 99) * 10, rnd(11, 998)]);
    return num(String(n), dopo ? n + 1 : n - 1, `Qual è il numero che viene ${dopo ? 'DOPO' : 'PRIMA'}?`);
  };
  const confronto = () => {
    if (Math.random() < .5) {
      const xs = new Set();
      while (xs.size < 3) xs.add(rnd(100, 999));
      const a = [...xs], grande = Math.random() < .5, t = grande ? Math.max(...a) : Math.min(...a);
      return { id: 'c' + a.join(), prompt: grande ? 'Qual è il numero più GRANDE?' : 'Qual è il numero più PICCOLO?', big: '🔢', optClass: 'num',
        options: a.map(x => ({ label: x, ok: x === t })) };
    }
    const a = rnd(100, 999), b = pick([a, rnd(100, 999), a + rnd(1, 20), a - rnd(1, 20)]), s = a < b ? '<' : a > b ? '>' : '=';
    return { id: `s${a}${b}`, prompt: 'Quale segno va messo in mezzo?', big: `${a}  ❓  ${b}`, optClass: 'num', options: ['<', '>', '='].map(x => ({ label: x, ok: x === s })) };
  };
  const mk = par => { const x = rnd(10, 99); return x % 2 === par ? x : x + 1; };
  const pari = () => {
    const t = rnd(0, 2);
    if (t === 0) {
      const pariQ = Math.random() < .5, par = pariQ ? 0 : 1, c = mk(par), w = new Set();
      while (w.size < 3) { const x = mk(1 - par); if (x !== c) w.add(x); }
      return { id: 'pd' + c + pariQ, prompt: `Quale numero è ${pariQ ? 'PARI' : 'DISPARI'}?`, big: '🔢', optClass: 'num', options: [{ label: c, ok: true }, ...[...w].map(label => ({ label }))] };
    }
    if (t === 1) { const n = rnd(2, 49); return num(`Il doppio di ${n}`, n * 2, 'Calcola!', [2, 10, 1]); }
    const n = rnd(1, 49) * 2;
    return num(`La metà di ${n}`, n / 2, 'Calcola!');
  };
  const componi = () => {
    const h = rnd(1, 9), t = rnd(0, 9), u = rnd(0, 9), n = h * 100 + t * 10 + u, k = rnd(0, 2);
    if (k === 0) return num(`${h * 100} + ${t * 10} + ${u} = ❓`, n, 'Componi il numero!', [1, 10, 100]);
    if (k === 1) return num(`${h} centinaia, ${t} decine, ${u} unità = ❓`, n, 'Componi il numero!', [1, 10, 100]);
    return num(`${n} = ${h * 100} + ❓ + ${u}`, t * 10, 'Quanto manca?', [10, 20, 1]);
  };
  Quiz.mount({
    el: $('lNum'), key: 'livia-num-level', tab: 'numeri', lang: null,
    praise: ['🌟 Esatto!', '🌟 Bravissima Livia!', '🌟 Perfetto!'], retryOk: '✅ Giusto! Al prossimo, al primo colpo!', tryAgain: '🤔 Ci sei quasi, riprova!',
    levels: [
      { name: 'Il posto delle cifre', intro: 'Centinaia, decine e unità.', make: posto },
      { name: 'Prima e dopo', intro: 'Trova il numero prima o dopo (attenzione ai cambi di decina e centinaio!).', make: prima_dopo },
      { name: 'Più grande, più piccolo', intro: 'Confronta i numeri fino a 999.', make: confronto },
      { name: 'Pari, doppio e metà', intro: 'Pari, dispari, doppi e metà.', make: pari },
      { name: 'Componi i numeri', intro: 'Metti insieme centinaia, decine e unità.', make: componi }
    ]
  });
})();
