// Livia: Orologio ed Euro (leggere l'ora, monete, resto) - seconda elementare
// Dipende da: js/common.js, js/quiz.js
(() => {
  const { rnd, pick, choice } = Quiz;
  const fmt = (h, m) => `${h}:${String(m).padStart(2, '0')}`;
  const hand = (deg, len, w, col) => `<line x1="50" y1="50" x2="${(50 + len * Math.sin(deg * Math.PI / 180)).toFixed(1)}" y2="${(50 - len * Math.cos(deg * Math.PI / 180)).toFixed(1)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
  const clock = (h, m) => {
    let nums = '';
    for (let i = 1; i <= 12; i++) nums += `<text x="${(50 + 37 * Math.sin(i * Math.PI / 6)).toFixed(1)}" y="${(50 - 37 * Math.cos(i * Math.PI / 6)).toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="9" font-weight="bold" fill="#1E293B">${i}</text>`;
    return `<svg viewBox="0 0 100 100" width="190" height="190" role="img" aria-label="Orologio"><circle cx="50" cy="50" r="47" fill="#fff" stroke="#334155" stroke-width="4"/>${nums}${hand(((h % 12) + m / 60) * 30, 24, 4, '#1E293B')}${hand(m * 6, 36, 2.5, '#DC2626')}<circle cx="50" cy="50" r="3" fill="#1E293B"/></svg>`;
  };
  const ora = minuti => () => {
    const h = rnd(1, 12), m = pick(minuti), ans = fmt(h, m);
    const cand = [fmt(h % 12 + 1, m), fmt((h + 10) % 12 + 1, m), fmt(h, (m + 15) % 60), fmt(h, (m + 30) % 60), fmt(h, (m + 45) % 60), fmt(h % 12 + 1, (m + 30) % 60)];
    return { id: 'o' + ans, prompt: 'Che ore sono? (la lancetta corta indica le ore, quella lunga rossa i minuti)', html: clock(h, m), big: '', optClass: 'num', options: choice(ans, cand) };
  };
  const eur = c => { const e = Math.floor(c / 100), r = c % 100; return r ? `${e},${String(r).padStart(2, '0')} €` : `${e} €`; };
  const soldi = (total, big, prompt) => {
    const c = [total + 50, total - 50, total + 100, total - 100, total + 10, total - 10, total + 20].filter(x => x > 0 && x !== total);
    return { id: big, prompt, big, bigClass: 'mid', optClass: 'mid', options: choice(eur(total), c.map(eur)) };
  };
  const monete = () => {
    const items = [[200, '💶 2 €'], [100, '💶 1 €'], [50, '🪙 50 c'], [500, '💶 5 €'], [20, '🪙 20 c'], [10, '🪙 10 c']];
    const picks = Array.from({ length: rnd(2, 4) }, () => pick(items));
    return soldi(picks.reduce((s, x) => s + x[0], 0), picks.map(x => x[1]).join('  +  ') + '  = ❓', 'Quanti soldi hai in tutto?');
  };
  const resto = () => {
    const [nome, p] = pick([['un gelato', 200], ['un pallone', 450], ['un quaderno', 150], ['una matita', 50], ['un libro', 350], ['un succo', 120], ['una penna', 80]]);
    const paga = pick([500, 1000]);
    return soldi(paga - p, `Compri ${nome} a ${eur(p)} e paghi con ${eur(paga)}. Quanto ti dà di resto il negoziante?`, 'Calcola il resto!');
  };
  Quiz.mount({
    el: $('lClock'), key: 'livia-clock-level', tab: 'orologio', lang: null,
    praise: ['🌟 Esatto!', '🌟 Bravissima Livia!', '🌟 Perfetto!'], retryOk: '✅ Giusto! Al prossimo, al primo colpo!', tryAgain: '🤔 Ci sei quasi, riprova!',
    levels: [
      { name: 'Le ore esatte', intro: 'Leggi l\'orologio quando i minuti sono 0.', make: ora([0]) },
      { name: 'Ore, mezze e quarti', intro: 'Ora anche le e mezza (:30) e i quarti (:15 e :45).', make: ora([0, 15, 30, 45]) },
      { name: 'I minuti', intro: 'Ogni numero dell\'orologio vale 5 minuti!', make: ora([5, 10, 20, 25, 35, 40, 50, 55, 15, 45]) },
      { name: 'Le monete', intro: 'Somma monete e banconote.', make: monete },
      { name: 'Il resto', intro: 'Quanto ti restituiscono quando paghi?', make: resto }
    ]
  });
})();
