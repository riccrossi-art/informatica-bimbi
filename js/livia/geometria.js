// Livia: Figure e Misure (lati, nomi delle figure, lunghezze, pesi, perimetro) - seconda elementare
// Dipende da: js/common.js, js/quiz.js
(() => {
  const { rnd, pick, numOptions, choice } = Quiz;
  const num = (big, ans, prompt, d, cls) => ({ id: prompt + big, prompt, big, bigClass: cls, optClass: 'num', options: numOptions(ans, 4, d || [1, 2, 10]) });
  const SHAPES = [['triangolo', 3], ['quadrato', 4], ['rettangolo', 4], ['pentagono', 5], ['esagono', 6], ['ottagono', 8], ['cerchio', 0]];
  const lati = () => { const [n, l] = pick(SHAPES); return num(`Un ${n}`, l, `Quanti lati ha un ${n}?`, [1, 2, 3]); };
  const DESC = [['ha 3 lati e 3 angoli', 'triangolo'], ['ha 4 lati uguali e 4 angoli retti', 'quadrato'], ['ha 4 lati: due lunghi e due corti', 'rettangolo'],
    ['è tonda e non ha lati', 'cerchio'], ['ha 5 lati', 'pentagono'], ['ha 6 lati', 'esagono'], ['ha 8 lati', 'ottagono']];
  const figura = () => {
    const [d, n] = pick(DESC);
    return { id: 'f' + n, prompt: 'Che figura è?', big: `Questa figura ${d}.`, bigClass: 'text', optClass: 'sent', options: choice(n, SHAPES.map(s => s[0])) };
  };
  const cm = v => v < 100 ? `${v} cm` : v % 100 === 0 ? `${v / 100} m` : `${Math.floor(v / 100)} m ${v % 100} cm`;
  const lunghezze = () => {
    const t = rnd(0, 3), k = rnd(2, 9);
    if (t === 0) return num('1 m = ❓ cm', 100, 'Quanto misura?', [10, 50, 1000]);
    if (t === 1) return num(`${k} m = ❓ cm`, k * 100, 'Trasforma!', [100, 10, 1000]);
    if (t === 2) return num(`${k * 100} cm = ❓ m`, k, 'Trasforma!', [1, 2, 10]);
    const xs = new Set();
    while (xs.size < 3) xs.add(rnd(3, 35) * 10);
    const a = [...xs], lungo = Math.random() < .5, tt = lungo ? Math.max(...a) : Math.min(...a);
    return { id: 'l' + a.join(), prompt: lungo ? 'Quale misura è la più LUNGA?' : 'Quale misura è la più CORTA?', big: '📏', optClass: 'mid', options: a.map(v => ({ label: cm(v), ok: v === tt })) };
  };
  const pesi = () => {
    const t = rnd(0, 3), k = rnd(2, 6);
    if (t === 0) return num('1 kg = ❓ g', 1000, 'Quanto pesa?', [100, 500, 10]);
    if (t === 1) return num(`${k} kg = ❓ g`, k * 1000, 'Trasforma!', [1000, 100, 500]);
    if (t === 2) return num(`${k * 1000} g = ❓ kg`, k, 'Trasforma!');
    return num(`${k} litri = ❓ millilitri (ml)`, k * 1000, 'Trasforma!', [1000, 100, 500]);
  };
  const perimetro = () => {
    const t = rnd(0, 2), a = rnd(2, 9), b = rnd(2, 9);
    if (t === 0) return num(`Un quadrato ha il lato di ${a} cm. Quanto misura il suo perimetro (in cm)?`, 4 * a, 'Perimetro', [4, 2, 1], 'text');
    if (t === 1) return num(`Un rettangolo ha i lati di ${a} cm e ${b} cm. Quanto misura il suo perimetro (in cm)?`, 2 * (a + b), 'Perimetro', [2, 4, 1], 'text');
    return num(`Un triangolo ha tre lati uguali di ${a} cm. Quanto misura il suo perimetro (in cm)?`, 3 * a, 'Perimetro', [3, 1, 2], 'text');
  };
  Quiz.mount({
    el: $('lGeo'), key: 'livia-geo-level', tab: 'geometria', lang: null,
    praise: ['🌟 Esatto!', '🌟 Bravissima Livia!', '🌟 Perfetto!'], retryOk: '✅ Giusto! Al prossimo, al primo colpo!', tryAgain: '🤔 Ci sei quasi, riprova!',
    levels: [
      { name: 'Quanti lati?', intro: 'Conta i lati delle figure.', make: lati },
      { name: 'Che figura è?', intro: 'Riconosci la figura dalla descrizione.', make: figura },
      { name: 'Metri e centimetri', intro: '1 metro = 100 centimetri.', make: lunghezze },
      { name: 'Chili, grammi e litri', intro: '1 chilo = 1000 grammi, 1 litro = 1000 millilitri.', make: pesi },
      { name: 'Il perimetro', intro: 'Il perimetro è la somma di tutti i lati.', make: perimetro }
    ]
  });
})();
