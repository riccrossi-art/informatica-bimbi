// Livia: Italiano per la seconda elementare (ortografia, grammatica, parole e lettura)
// Dipende da: js/common.js, js/quiz.js
(() => {
  const { pick, choice } = Quiz;
  const s = x => x.split('|');
  const common = { lang: null, praise: ['🌟 Esatto!', '🌟 Bravissima Livia!', '🌟 Perfetto!'], retryOk: '✅ Giusto! Al prossimo, al primo colpo!', tryAgain: '🤔 Ci sei quasi, riprova!' };
  const fill = (items, prompt, cls) => () => {                 // frase con ❓ e una risposta giusta tra più possibilità
    const [f, ok, ...w] = pick(items);
    return { id: f, prompt, big: f.replace('___', '❓'), bigClass: 'mid', optClass: cls || 'mid', options: [{ label: ok, ok: true }, ...w.map(label => ({ label }))] };
  };

  /* ===== ORTOGRAFIA ===== */
  const DIG = [['monta', 'gn', 'a'], ['spu', 'gn', 'a'], ['ba', 'gn', 'o'], ['lasa', 'gn', 'a'], ['ra', 'gn', 'o'], ['fi', 'gl', 'io'], ['a', 'gl', 'io'], ['fo', 'gl', 'ia'],
    ['fami', 'gl', 'ia'], ['coni', 'gl', 'io'], ['', 'sc', 'uola'], ['', 'sc', 'arpa'], ['', 'sc', 'immia'], ['pe', 'sc', 'e'], ['', 'sc', 'ivolo']];
  const digrafi = () => { const [a, d, b] = pick(DIG); return { id: a + d + b, prompt: 'Quali lettere mancano?', big: `${a}❓${b}`, optClass: 'mid', options: choice(d, ['gn', 'gl', 'sc', 'ci', 'gh']) }; };
  const BENE = ['scuola|squola|scuolla|scoula', 'quaderno|cuaderno|quadermo|quadrerno', 'acqua|aqua|acqa|acua', 'cuore|quore|cuoe|cuorre', 'coniglio|conilio|cogniglio|coniglo',
    'famiglia|familia|famigglia|faniglia', 'pesce|pece|pesche|pessce', 'scimmia|simmia|scimia|scimmmia', 'ombrello|ombrelo|onbrello|ombrelllo', 'lampada|lampata|lanpada|lamppada',
    'cuoco|quoco|cuocco|cuoko', 'ragno|ragnio|ranio|raggno'].map(s);
  const scritta = () => { const [ok, ...w] = pick(BENE); return { id: ok, prompt: 'Quale parola è scritta bene?', big: '✍️', optClass: 'mid', options: [{ label: ok, ok: true }, ...w.map(label => ({ label }))] }; };
  const E = ['Il cielo ___ azzurro.|è|e', 'Marco ___ Livia giocano.|e|è', 'Il gatto ___ nero.|è|e', 'Mi piacciono le mele ___ le pere.|e|è', 'La mamma ___ in cucina.|è|e',
    'Pane ___ latte per colazione.|e|è', '___ un gatto sul tetto.|C\'è|Ce|Ci è', 'Ieri ___ il sole.|c\'era|cera|ceera', 'Dov\'___ la mia penna?|è|e'].map(s);
  const H = ['Io ___ sette anni.|ho|o', 'Tu ___ un libro?|hai|ai', 'Mia sorella ___ un gatto.|ha|a', 'Loro ___ fame.|hanno|anno', 'Vado ___ scuola.|a|ha', 'Vuoi il rosso ___ il blu?|o|ho',
    'Quest\' ___ vado al mare.|anno|hanno', 'Il bimbo ___ sonno.|ha|a', 'Noi ___ sete.|abbiamo|abiamo'].map(s);
  const PUNTI = ['Come ti chiami|?', 'Che bella giornata|!', 'Oggi piove|.', 'Dove abiti|?', 'Evviva, abbiamo vinto|!', 'Il cane dorme|.', 'Quanti anni hai|?', 'Aiuto|!', 'Mamma prepara la cena|.'].map(s);
  const punto = () => { const [f, m] = pick(PUNTI); return { id: f, prompt: 'Quale segno va alla fine della frase?', big: f + ' ❓', optClass: 'num', options: ['.', '?', '!', ','].map(x => ({ label: x, ok: x === m })) }; };
  Quiz.mount({ el: $('lOrt'), key: 'livia-ort-level', tab: 'ortografia', ...common, levels: [
    { name: 'GN, GL, SC', intro: 'Completa le parole con le lettere giuste.', make: digrafi },
    { name: 'Come si scrive?', intro: 'Una sola parola è scritta bene.', make: scritta },
    { name: 'È oppure E?', intro: 'È (verbo) o e (congiunzione)? Attenzione anche a c\'è!', make: fill(E, 'Scegli la parola giusta.') },
    { name: 'Ho, hai, ha, hanno', intro: 'Il verbo avere si scrive con la H!', make: fill(H, 'Scegli la parola giusta.') },
    { name: 'La punteggiatura', intro: 'Punto, punto interrogativo o punto esclamativo?', make: punto }
  ] });

  /* ===== GRAMMATICA ===== */
  const PLUR = ['gatto|gatti', 'casa|case', 'albero|alberi', 'amico|amici', 'libro|libri', 'fiore|fiori', 'mela|mele', 'lupo|lupi', 'scuola|scuole', 'pesce|pesci', 'amica|amiche',
    'bocca|bocche', 'gelato|gelati', 'isola|isole', 'cane|cani', 'nave|navi'].map(s);
  const plurale = () => {
    const [w, p] = pick(PLUR), b = w.slice(0, -1);
    return { id: 'pl' + w, prompt: `Qual è il plurale di "${w}"?`, big: '👥', optClass: 'mid', options: choice(p, ['a', 'e', 'i', 'o'].map(x => b + x)) };
  };
  const ART = [['albero', 'l\''], ['scuola', 'la'], ['zaino', 'lo'], ['gatto', 'il'], ['studente', 'lo'], ['amica', 'l\''], ['sedia', 'la'], ['libro', 'il'], ['scarpa', 'la'], ['gnomo', 'lo'],
    ['elefante', 'l\''], ['quaderno', 'il'], ['specchio', 'lo'], ['isola', 'l\''], ['mela', 'la'], ['pesce', 'il']];
  const articolo = () => { const [w, a] = pick(ART); return { id: 'ar' + w, prompt: 'Quale articolo ci va?', big: `❓ ${w}`, optClass: 'mid', options: ['il', 'lo', 'la', 'l\''].map(x => ({ label: x, ok: x === a })) }; };
  const FRASI = ['Il gatto:N nero:A dorme:V sul divano:N', 'La mamma:N prepara:V una torta:N dolce:A', 'Il bambino:N corre:V nel parco:N verde:A', 'Marco:N mangia:V una mela:N rossa:A',
    'La maestra:N legge:V un libro:N interessante:A', 'Il cane:N piccolo:A abbaia:V forte', 'Le bambine:N giocano:V con la palla:N gialla:A', 'Il sole:N splende:V nel cielo:N azzurro:A'];
  const KIND = { N: 'NOME', A: 'AGGETTIVO', V: 'VERBO' };
  const parti = () => {
    const toks = pick(FRASI).split(' ').map(t => t.split(':')), tag = pick(['N', 'A', 'V']);
    const ok = toks.find(t => t[1] === tag)[0], altri = shuffle(toks.filter(t => t[1] !== tag).map(t => t[0])).slice(0, 3);
    return { id: toks.map(t => t[0]).join(' ') + tag, prompt: `Quale parola è un ${KIND[tag]}?`, big: toks.map(t => t[0]).join(' '), bigClass: 'text', optClass: 'mid',
      options: [{ label: ok, ok: true }, ...altri.map(label => ({ label }))] };
  };
  const TEMPI = ['Ieri Marco ___ al parco.|è andato|va|andrà|andare', 'Oggi io ___ la pizza.|mangio|mangerò|mangiato|mangiare', 'Domani noi ___ al mare.|andremo|andavamo|andati|andare',
    'Ieri la mamma ___ una torta.|ha preparato|prepara|preparerà|preparare', 'Adesso il bambino ___.|dorme|dormirà|ha dormito|dormire', 'Domani Livia ___ a scuola.|andrà|è andata|andava|andare',
    'Ieri i bambini ___ nel parco.|hanno giocato|giocano|giocheranno|giocare', 'Ogni giorno io ___ i denti.|lavo|laverò|ho lavato|lavare'].map(s);
  const ACCORDO = ['Le bambine ___ in giardino.|giocano|gioca|giocare|giochiamo', 'Il cane ___ forte.|abbaia|abbaiano|abbaiamo|abbaiare', 'I fiori ___ rossi.|sono|è|siamo|sei',
    'La mela ___ matura.|è|sono|siete|siamo', 'Gli alberi ___ alti.|sono|è|sei|siamo', 'Tu ___ un bravo disegnatore.|sei|è|sono|siete', 'Noi ___ al cinema.|andiamo|vanno|va|andate',
    'Voi ___ i compiti.|fate|fanno|fa|facciamo', 'Loro ___ la merenda.|mangiano|mangia|mangiamo|mangiate'].map(s);
  Quiz.mount({ el: $('lGram'), key: 'livia-gram-level', tab: 'grammatica', ...common, levels: [
    { name: 'Singolare e plurale', intro: 'Trasforma i nomi dal singolare al plurale.', make: plurale },
    { name: 'Gli articoli', intro: 'Il, lo, la, l\': scegli quello giusto.', make: articolo },
    { name: 'Nomi, aggettivi e verbi', intro: 'Riconosci le parti della frase.', make: parti },
    { name: 'Ieri, oggi, domani', intro: 'Scegli il verbo nel tempo giusto.', make: fill(TEMPI, 'Quale verbo completa la frase?') },
    { name: 'Chi fa che cosa?', intro: 'Il verbo deve andare d\'accordo con chi lo fa.', make: fill(ACCORDO, 'Quale verbo completa la frase?') }
  ] });

  /* ===== PAROLE E LETTURA ===== */
  const CONTR = ['grande|piccolo', 'alto|basso', 'caldo|freddo', 'giorno|notte', 'aperto|chiuso', 'veloce|lento', 'pieno|vuoto', 'felice|triste', 'sopra|sotto', 'dentro|fuori',
    'forte|debole', 'nuovo|vecchio', 'bello|brutto', 'luce|buio', 'amico|nemico'].map(s);
  const contrari = () => { const [a, b] = pick(CONTR); return { id: 'co' + a, prompt: `Qual è il contrario di "${a}"?`, big: '↔️', optClass: 'mid', options: choice(b, CONTR.map(x => x[1])) }; };
  const SIN = ['contento|felice', 'rapido|veloce', 'abitazione|casa', 'dire|parlare', 'finire|terminare', 'cominciare|iniziare', 'bambino|ragazzino', 'sbagliare|errare', 'allegro|gioioso', 'pauroso|spaventoso'].map(s);
  const sinonimi = () => { const [a, b] = pick(SIN); return { id: 'si' + a, prompt: `Quale parola significa quasi lo stesso di "${a}"?`, big: '🟰', optClass: 'mid', options: choice(b, [...SIN.map(x => x[1]), 'lento', 'buio', 'piccolo']) }; };
  const CATS = [['animali', 'cane gatto cavallo mucca pecora'], ['frutta', 'mela pera banana fragola uva'], ['colori', 'rosso blu verde giallo rosa'], ['scuola', 'penna quaderno matita zaino gomma'],
    ['mezzi', 'auto treno aereo nave bici'], ['corpo', 'mano piede naso occhio testa'], ['casa', 'tavolo sedia letto divano armadio']].map(([n, w]) => [n, w.split(' ')]);
  const intruso = () => {
    const [c1, c2] = shuffle([...CATS]), tre = shuffle([...c1[1]]).slice(0, 3), odd = pick(c2[1]);
    return { id: 'in' + tre.join('') + odd, prompt: 'Trova la parola che non c\'entra con le altre!', big: '🤔', optClass: 'mid', options: [...tre.map(label => ({ label })), { label: odd, ok: true }] };
  };
  const SILL = [['sole', 2], ['gatto', 2], ['farfalla', 3], ['elefante', 4], ['scuola', 2], ['albero', 3], ['cioccolato', 4], ['finestra', 3], ['quaderno', 3], ['bicicletta', 4], ['ombrello', 3],
    ['giraffa', 3], ['telefono', 4], ['formica', 3], ['coccodrillo', 4], ['pomodoro', 4], ['mamma', 2], ['pane', 2]];
  const sillabe = () => { const [w, n] = pick(SILL); return { id: 'sl' + w, prompt: `Quante sillabe ha la parola "${w}"?`, big: '👏', optClass: 'num', options: [1, 2, 3, 4, 5].map(x => ({ label: x, ok: x === n })) }; };
  const TESTI = ['Marco ha un cane di nome Briciola. Ogni mattina lo porta al parco.|Come si chiama il cane?|Briciola|Marco|Parco|Mattina', 'Marco ha un cane di nome Briciola. Ogni mattina lo porta al parco.|Dove porta il cane Marco?|Al parco|A scuola|Al mare|In cucina',
    'Livia mette nello zaino il quaderno e l\'astuccio. Poi esce di casa e va a scuola.|Dove va Livia?|A scuola|Al parco|Dal nonno|Al cinema', 'Livia mette nello zaino il quaderno e l\'astuccio. Poi esce di casa e va a scuola.|Che cosa mette nello zaino?|Il quaderno e l\'astuccio|Il pallone|Il gelato|La bicicletta',
    'Ieri ha piovuto tutto il giorno. Pietro ha giocato in casa con le macchinine.|Che tempo faceva ieri?|Pioveva|C\'era il sole|Nevicava|C\'era vento', 'Ieri ha piovuto tutto il giorno. Pietro ha giocato in casa con le macchinine.|Con che cosa ha giocato Pietro?|Con le macchinine|Con il pallone|Con le bambole|Con i libri',
    'In giardino ci sono tre alberi: un melo, un pero e un ciliegio. Il melo è il più alto.|Quanti alberi ci sono?|Tre|Due|Quattro|Sei', 'In giardino ci sono tre alberi: un melo, un pero e un ciliegio. Il melo è il più alto.|Quale albero è il più alto?|Il melo|Il pero|Il ciliegio|Nessuno',
    'Il nonno prepara la torta con le uova, la farina e lo zucchero. Dopo la mette nel forno.|Dove mette la torta il nonno?|Nel forno|In frigorifero|Sul tavolo|In giardino'].map(s);
  const lettura = () => { const [t, q, ok, ...w] = pick(TESTI); return { id: t + q, prompt: q, big: t, bigClass: 'text', optClass: 'sent', cols: '1fr 1fr', options: [{ label: ok, ok: true }, ...w.map(label => ({ label }))] }; };
  Quiz.mount({ el: $('lParole'), key: 'livia-parole-level', tab: 'parole', ...common, levels: [
    { name: 'I contrari', intro: 'Trova la parola che significa il contrario.', make: contrari },
    { name: 'Parole simili', intro: 'Trova la parola che significa quasi lo stesso.', make: sinonimi },
    { name: 'Trova l\'intruso', intro: 'Una parola non appartiene al gruppo.', make: intruso },
    { name: 'Le sillabe', intro: 'Batti le mani: quante sillabe ha la parola?', make: sillabe },
    { name: 'Leggo e capisco', intro: 'Leggi il testo e rispondi alla domanda.', make: lettura }
  ] });
})();
