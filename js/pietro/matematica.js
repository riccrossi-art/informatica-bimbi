// Pietro: Conta e Completa (contare, completare serie di disegni, più/meno) per 3 anni e mezzo
// Dipende da: js/common.js, js/quiz.js
(() => {
  const { rnd, pick, numOptions } = Quiz;
  const THEME = ['🚒', '🚂', '🔥', '🚃', '🧯', '🚨'];
  const WORD = ['', 'Uno', 'Due', 'Tre', 'Quattro', 'Cinque'];

  const count = (max, opts) => () => {
    const n = rnd(1, max), e = pick(THEME);
    const nums = shuffle([1, 2, 3, 4, 5].filter(x => x <= Math.max(max, opts) && x !== n)).slice(0, opts - 1);
    return { id: `c${n}${e}`, prompt: 'Quanti sono?', big: Array(n).fill(e).join(' '), bigClass: 'emoji', say: 'Quanti sono?',
      sayOk: `${WORD[n]}! Bravo Pietro!`, optClass: 'num',
      options: [{ label: n, ok: true, say: WORD[n] }, ...nums.map(x => ({ label: x, say: WORD[x] }))] };
  };
  const pattern = kind => () => {
    const [a, b, c] = shuffle([...THEME]);
    const seqs = { AB: [a, b, a, b, a], AAB: [a, a, b, a, a], ABB: [a, b, b, a, b] };
    const k = kind === 'mix' ? pick(['AAB', 'ABB']) : kind;
    const answer = { AB: b, AAB: b, ABB: b }[k];
    return { id: `p${k}${a}${b}`, prompt: 'Quale disegno viene dopo?', big: seqs[k].join(' ') + ' ❓', bigClass: 'emoji',
      say: 'Quale disegno viene dopo?', sayOk: 'Evviva! Hai completato la serie!', optClass: 'emoji',
      options: kind === 'AB' ? [{ label: a }, { label: b, ok: true }] : [{ label: a }, { label: b, ok: true }, { label: c }] };
  };
  const moreLess = () => {
    const e = pick(THEME), more = Math.random() < .6;
    let n1 = rnd(1, 5), n2 = rnd(1, 5);
    while (n1 === n2) n2 = rnd(1, 5);
    const target = more ? Math.max(n1, n2) : Math.min(n1, n2);
    const text = more ? 'Dove ce ne sono di più?' : 'Dove ce ne sono di meno?';
    return { id: `m${n1}${n2}${more}`, prompt: text, big: '🤔', say: text, sayOk: 'Giusto! Bravo Pietro!', optClass: 'group',
      options: [n1, n2].map(n => ({ label: Array(n).fill(e).join(' '), ok: n === target })) };
  };

  Quiz.mount({
    el: $('pMath'), key: 'pietro-math-level', tab: 'math', lang: 'it-IT',
    praise: ['🌟 Bravo Pietro!', '🌟 Che bravo!', '🌟 Evviva!'], retryOk: '✅ Giusto! Al prossimo, al primo colpo!', tryAgain: '🤔 Riprova!',
    levelUpSay: 'Evviva! Livello superato!',
    levels: [
      { name: 'Contiamo fino a 3', intro: 'Conta quante ce ne sono!', make: count(3, 3) },
      { name: 'Contiamo fino a 5', intro: 'Ora ce ne sono di più!', make: count(5, 3) },
      { name: 'Che disegno manca?', intro: 'Quale disegno viene dopo?', make: pattern('AB') },
      { name: 'Serie più lunghe', intro: 'Le serie sono più difficili!', make: pattern('mix') },
      { name: 'Più o meno?', intro: 'Dove ce ne sono di più o di meno?', make: moreLess }
    ]
  });
})();
