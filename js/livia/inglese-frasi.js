// Livia: English Phrases (saluti, completa la frase, domande e risposte, traduzioni, ascolto)
// Dipende da: js/common.js, js/quiz.js
(() => {
  const { pick, choice } = Quiz;
  const EN = 'en-US';
  const split = s => s.split('|');
  const PH = ['Hello|Ciao', 'Good morning|Buongiorno', 'Good night|Buonanotte', 'Thank you|Grazie', 'Please|Per favore', 'Goodbye|Arrivederci', 'How are you?|Come stai?',
    'I\'m fine, thank you|Sto bene, grazie', 'What\'s your name?|Come ti chiami?', 'My name is Livia|Mi chiamo Livia', 'Nice to meet you|Piacere di conoscerti',
    'I\'m seven years old|Ho sette anni', 'Where are you from?|Di dove sei?', 'I\'m from Italy|Vengo dall\'Italia', 'See you tomorrow|A domani', 'Sorry|Scusa'].map(split);
  const FILL = ['I ___ seven years old.|am|is|are|have', 'She ___ a cat.|has|have|is|are', 'They ___ my friends.|are|is|am|has', 'He ___ football every day.|plays|play|playing|is play',
    'We ___ happy.|are|is|am|be', 'I ___ a brother.|have|has|am|are', '___ you like pizza?|Do|Does|Are|Is', 'The cat ___ on the sofa.|is|are|am|have',
    'My mother ___ in the kitchen.|is|are|am|have', 'Where ___ my shoes?|are|is|am|do', 'I ___ to school by bus.|go|goes|going|am go', 'She ___ a red dress.|wears|wear|wearing|is wear',
    'There ___ two apples on the table.|are|is|am|has', 'It ___ raining.|is|are|am|do', 'My brother ___ got a bike.|has|have|is|are'].map(split);
  const QA = ['What\'s your name?|My name is Livia.', 'How old are you?|I\'m seven.', 'How are you?|I\'m fine, thanks.', 'What colour is the sky?|It\'s blue.', 'Do you like pizza?|Yes, I do.',
    'Where is the book?|It\'s on the table.', 'Can you swim?|Yes, I can.', 'What do you eat for breakfast?|I eat bread and milk.', 'How many legs has a cat?|Four.',
    'Is it sunny today?|No, it\'s raining.', 'What day comes after Monday?|Tuesday.', 'What\'s your favourite animal?|I like dogs.', 'Where do you live?|I live in Rome.'].map(split);
  const TR = ['Ho un cane.|I have a dog.', 'Mi piace la pizza.|I like pizza.', 'Dov\'è il gatto?|Where is the cat?', 'Lei è la mia amica.|She is my friend.', 'Il libro è sul tavolo.|The book is on the table.',
    'Mi piace giocare a calcio.|I like playing football.', 'Noi andiamo a scuola.|We go to school.', 'Lui ha un cappello rosso.|He has a red hat.', 'Che ora è?|What time is it?',
    'Il mio fratellino ha tre anni.|My little brother is three years old.', 'Io bevo il latte.|I drink milk.', 'Oggi è una bella giornata.|It is a nice day today.',
    'Mamma cucina la cena.|Mom cooks dinner.', 'Posso avere dell\'acqua?|Can I have some water?', 'Il cane dorme sul divano.|The dog sleeps on the sofa.'].map(split);
  const base = { optClass: 'sent', cols: '1fr' };

  const saluti = () => { const [e, i] = pick(PH); return { ...base, id: 'ph' + e, prompt: 'Che cosa significa? (ascolta con 🔊)', big: e, bigClass: 'mid', lang: EN, say: e, options: choice(i, PH.map(x => x[1])) }; };
  const completa = () => {
    const [s, ok, ...w] = pick(FILL);
    return { id: s, prompt: 'Scegli la parola giusta per completare la frase.', big: s.replace('___', '❓'), bigClass: 'mid', optClass: 'mid', lang: EN, sayOk: s.replace('___', ok),
      okMsg: s.replace('___', ok), options: [{ label: ok, ok: true }, ...w.map(label => ({ label }))] };
  };
  const domande = () => { const [q, a] = pick(QA); return { ...base, id: 'qa' + q, prompt: 'Scegli la risposta giusta.', big: q, bigClass: 'mid', lang: EN, say: q, options: choice(a, QA.map(x => x[1])) }; };
  const traduci = () => { const [i, e] = pick(TR); return { ...base, id: 'tr' + i, prompt: 'Come si dice in inglese?', big: i, bigClass: 'mid', lang: EN, sayOk: e, options: choice(e, TR.map(x => x[1])) }; };
  const ascolta = () => {
    const [i, e] = pick([...TR, ...PH.map(([e, i]) => [i, e])].filter(x => x[1].length > 5));
    return { ...base, id: 'as' + e, prompt: 'Ascolta la frase e scegli che cosa significa!', big: '👂', bigClass: 'emoji', lang: EN, say: e, sayOk: e, okMsg: `${e} = ${i}`,
      options: choice(i, [...TR.map(x => x[0]), ...PH.map(x => x[1])]) };
  };
  Quiz.mount({
    el: $('lFrasi'), key: 'livia-frasi-level', tab: 'frasi', lang: EN,
    praise: ['🌟 Well done!', '🌟 Great job Livia!', '🌟 Perfect!'], retryOk: '✅ Giusto! Al prossimo, al primo colpo!', tryAgain: '🤔 Try again!', levelUpSay: 'Level up! Great job Livia!',
    levels: [
      { name: 'Hello!', intro: 'Ascolta e scegli che cosa significa la frase.', introSay: 'Hello!', make: saluti },
      { name: 'Completa la frase', intro: 'Scegli la parola giusta (am, is, are, has, have...).', introSay: 'Complete the sentence!', make: completa },
      { name: 'Domande e risposte', intro: 'Scegli la risposta giusta alla domanda.', introSay: 'Questions and answers!', make: domande },
      { name: 'Traduci la frase', intro: 'Dall\'italiano all\'inglese: scegli la frase giusta.', introSay: 'Translate!', make: traduci },
      { name: 'Ascolta e capisci', intro: 'Ascolta una frase in inglese e scegli il significato in italiano.', introSay: 'Listen carefully!', make: ascolta }
    ]
  });
})();
