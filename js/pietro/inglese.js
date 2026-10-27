// Pietro: Inglese con Pietro (ascolta e tocca l'immagine giusta: nessuna lettura richiesta)
// Dipende da: js/common.js, js/quiz.js
(() => {
  const { rnd, pick } = Quiz;
  const COLORS = [['Red', '#EF4444'], ['Blue', '#3B82F6'], ['Green', '#22C55E'], ['Yellow', '#EAB308'], ['Orange', '#F97316'], ['Purple', '#A855F7']];
  const ANIMALS = [['Dog', '🐶'], ['Cat', '🐱'], ['Cow', '🐮'], ['Pig', '🐷'], ['Frog', '🐸'], ['Bear', '🐻'], ['Duck', '🦆'], ['Lion', '🦁'], ['Horse', '🐴'], ['Fish', '🐟']];
  const VEHICLES = [['Fire truck', '🚒'], ['Train', '🚂'], ['Helicopter', '🚁'], ['Ambulance', '🚑'], ['Car', '🚗'], ['Bus', '🚌'], ['Plane', '✈️'], ['Boat', '⛵'], ['Tractor', '🚜']];
  const NUMBERS = [['One', 1], ['Two', 2], ['Three', 3], ['Four', 4], ['Five', 5]];

  const make = (list, opts, render, cls, kind) => () => {
    const t = pick(list);
    const others = shuffle(list.filter(x => x !== t)).slice(0, opts - 1);
    return { id: kind + t[0], prompt: 'Ascolta e tocca quello giusto!', big: '👂', bigClass: 'emoji', lang: 'en-US',
      say: t[0], sayOk: `Yes! ${t[0]}! Well done!`, okMsg: t[0] + '!', optClass: cls,
      options: [t, ...others].map(x => ({ label: render(x), ok: x === t, say: x[0] })) };
  };
  const dot = c => `<span class="dot" style="background:${c[1]}"></span>`;
  const em = x => x[1];

  Quiz.mount({
    el: $('pEng'), key: 'pietro-eng-level', tab: 'english', lang: 'en-US',
    praise: ['🌟 Bravo Pietro!', '🌟 Well done!', '🌟 Evviva!'], retryOk: '✅ Giusto! Al prossimo, al primo colpo!', tryAgain: '🤔 Try again!',
    levelUpSay: 'Level up! Well done Pietro!',
    levels: [
      { name: 'Colori', intro: 'Ascolta il colore in inglese e tocca il cerchio giusto!', introSay: 'Colors!', make: make(COLORS.slice(0, 4), 2, dot, 'emoji', 'c') },
      { name: 'Più colori', intro: 'Ora i cerchi sono 3!', introSay: 'More colors!', make: make(COLORS, 3, dot, 'emoji', 'c') },
      { name: 'Animali', intro: 'Ascolta il nome dell\'animale e tocca quello giusto!', introSay: 'Animals!', make: make(ANIMALS, 3, em, 'emoji', 'a') },
      { name: 'Pompieri e treni', intro: 'Ascolta e tocca il mezzo giusto!', introSay: 'Fire truck! Train!', make: make(VEHICLES, 3, em, 'emoji', 'v') },
      { name: 'Numeri', intro: 'Ascolta il numero in inglese e tocca quello giusto!', introSay: 'Numbers!', make: make(NUMBERS, 3, x => x[1], 'num', 'n') }
    ]
  });
})();
