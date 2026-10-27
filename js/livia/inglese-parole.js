// Livia: English Words a livelli (la difficoltà cresce con le risposte giuste)
// Dipende da: js/common.js
(() => {
  /* ---- Parole: "italiano inglese emoji", divise per difficoltà (1 facile, 3 difficile) ---- */
  const TIERS = {
    1: 'Gatto Cat 🐱,Cane Dog 🐶,Mela Apple 🍎,Sole Sun ☀️,Libro Book 📚,Casa House 🏠,Pesce Fish 🐟,Albero Tree 🌳,Macchina Car 🚗,Luna Moon 🌙,Uccello Bird 🐦,Banana Banana 🍌,'
     + 'Mucca Cow 🐮,Maiale Pig 🐷,Topo Mouse 🐭,Orso Bear 🐻,Rana Frog 🐸,Anatra Duck 🦆,Leone Lion 🦁,Pecora Sheep 🐑,Uovo Egg 🥚,Torta Cake 🍰,Chiave Key 🔑,Porta Door 🚪,'
     + 'Letto Bed 🛏️,Scarpa Shoe 👟,Occhio Eye 👁️,Orecchio Ear 👂,Naso Nose 👃,Pera Pear 🍐,Foglia Leaf 🍃,Neve Snow ❄️,Autobus Bus 🚌,Nave Ship 🚢,Regalo Gift 🎁',
    2: 'Fiore Flower 🌸,Latte Milk 🥛,Pane Bread 🍞,Cavallo Horse 🐴,Scuola School 🏫,Palla Ball ⚽,Acqua Water 💧,Fuoco Fire 🔥,Nuvola Cloud ☁️,Stella Star ⭐,Cuore Heart ❤️,Mano Hand ✋,'
     + 'Pioggia Rain 🌧️,Aereo Plane ✈️,Barca Boat ⛵,Orologio Clock 🕒,Pollo Chicken 🐔,Tigre Tiger 🐯,Carota Carrot 🥕,Uva Grapes 🍇,Limone Lemon 🍋,Arancia Orange 🍊,Pomodoro Tomato 🍅,'
     + 'Patata Potato 🥔,Biscotto Cookie 🍪,Sedia Chair 🪑,Telefono Phone 📱,Palloncino Balloon 🎈,Campana Bell 🔔,Corona Crown 👑,Occhiali Glasses 👓,Zaino Backpack 🎒,Matita Pencil ✏️,'
     + 'Arcobaleno Rainbow 🌈,Isola Island 🏝️,Onda Wave 🌊,Razzo Rocket 🚀,Treno Train 🚆,Camion Truck 🚚,Trattore Tractor 🚜,Bocca Mouth 👄,Dente Tooth 🦷,Ragno Spider 🕷️,Lumaca Snail 🐌,'
     + 'Ape Bee 🐝,Gufo Owl 🦉,Aquila Eagle 🦅,Volpe Fox 🦊,Lupo Wolf 🐺,Serpente Snake 🐍,Squalo Shark 🦈,Balena Whale 🐳,Granchio Crab 🦀,Tamburo Drum 🥁',
    3: 'Elefante Elephant 🐘,Farfalla Butterfly 🦋,Coniglio Rabbit 🐰,Scimmia Monkey 🐵,Montagna Mountain ⛰️,Bicicletta Bicycle 🚲,Chitarra Guitar 🎸,Formaggio Cheese 🧀,Fragola Strawberry 🍓,'
     + 'Tartaruga Turtle 🐢,Ombrello Umbrella ☂️,Giraffa Giraffe 🦒,Pinguino Penguin 🐧,Dinosauro Dinosaur 🦖,Castello Castle 🏰,Vulcano Volcano 🌋,Elicottero Helicopter 🚁,Ambulanza Ambulance 🚑,'
     + 'Coccodrillo Crocodile 🐊,Delfino Dolphin 🐬,Polpo Octopus 🐙,Coccinella Ladybug 🐞,Canguro Kangaroo 🦘,Cammello Camel 🐫,Pappagallo Parrot 🦜,Violino Violin 🎻,Tromba Trumpet 🎺,'
     + 'Cioccolato Chocolate 🍫,Ciliegia Cherry 🍒,Anguria Watermelon 🍉,Ananas Pineapple 🍍,Orsacchiotto Teddy 🧸,Pianeta Planet 🪐,Fulmine Lightning ⚡,Cervello Brain 🧠,Forbici Scissors ✂️,'
     + 'Martello Hammer 🔨,Pianoforte Piano 🎹,Telescopio Telescope 🔭'
  };
  const WORDS = Object.entries(TIERS).flatMap(([t, s]) => s.split(',').map(x => {
    const [ita, eng, emoji] = x.trim().split(' ');
    return { ita, eng, emoji, tier: +t };
  }));

  /* ---- Livelli: cosa cambia salendo ---- */
  const LEVELS = [
    { name: 'Beginner', tiers: [1], mode: 'pick', opts: 3, emoji: true, ask: 'Come si dice in inglese?',
      intro: 'Scegli la parola inglese giusta tra 3 possibilità.' },
    { name: 'Explorer', tiers: [1, 2], mode: 'pick', opts: 4, emoji: true, ask: 'Come si dice in inglese?',
      intro: 'Ora le scelte sono 4 e le parole sono più varie!' },
    { name: 'Reader', tiers: [2, 3], mode: 'pick', opts: 4, emoji: false, ask: 'Senza disegno! Come si dice in inglese?',
      intro: 'Niente più disegni: devi ricordare le parole da sola!' },
    { name: 'Listener', tiers: [2, 3], mode: 'listen', opts: 4, ask: 'Ascolta la parola e scegli il significato in italiano!',
      intro: 'Ascolta la parola in inglese e scegli cosa vuol dire in italiano. Con 🔊 puoi riascoltarla!' },
    { name: 'Spelling Star', tiers: [2, 3], mode: 'spell', maxLen: 8, emoji: true, ask: 'Metti in ordine le lettere per scrivere la parola!',
      intro: 'Scrivi la parola in inglese toccando le lettere nell\'ordine giusto!' }
  ];
  const NEED = 5;                       // risposte giuste al primo colpo per salire
  const KEY = 'livia-eng-level', MEM = 'livia-eng-mem';
  const load = () => { try { return Math.min(+localStorage.getItem(KEY) || 0, LEVELS.length - 1); } catch (e) { return 0; } };
  const save = n => { try { localStorage.setItem(KEY, n); } catch (e) {} };
  // memoria delle parole già viste (anche tra una partita e l'altra) per variare sempre
  const mem = (() => { try { const m = JSON.parse(localStorage.getItem(MEM)); if (m && m.seen && m.recent) return m; } catch (e) {} return { seen: {}, recent: [] }; })();
  const saveMem = () => { try { localStorage.setItem(MEM, JSON.stringify(mem)); } catch (e) {} };

  let lv = load(), progress = 0, cur = null, locked = false, missed = false, typed = [], epoch = 0, sureTimer = null;
  const later = (fn, ms) => { const e = epoch; setTimeout(() => { if (e === epoch) fn(); }, ms); };
  const show = (el, on) => { el.hidden = !on; el.style.display = on ? '' : 'none'; };   // funziona anche senza la regola CSS [hidden]

  const pool = () => {
    const L = LEVELS[lv];
    return WORDS.filter(w => L.tiers.includes(w.tier) && (L.mode !== 'spell' || w.eng.length <= L.maxLen));
  };
  function draw() {                     // a caso, ma meno probabili le parole viste spesso e mai quelle appena viste
    const p = pool();
    let c = p.filter(w => !mem.recent.includes(w.eng));
    if (c.length < 4) c = p;
    const wts = c.map(w => 1 / (1 + (mem.seen[w.eng] || 0)));
    let r = Math.random() * wts.reduce((a, b) => a + b, 0);
    for (let i = 0; i < c.length; i++) { r -= wts[i]; if (r <= 0) return c[i]; }
    return c[c.length - 1];
  }

  function hud() {
    $('wLevel').textContent = lv + 1;
    $('wLevelName').textContent = LEVELS[lv].name;
    $('wProgress').textContent = `${progress}/${NEED}`;
    $('wBarFill').style.width = (progress / NEED * 100) + '%';
    $('wBar').setAttribute('aria-valuenow', progress);
  }

  function nextWord() {
    const L = LEVELS[lv];
    cur = draw(); locked = false; missed = false; typed = [];
    mem.seen[cur.eng] = (mem.seen[cur.eng] || 0) + 1;
    mem.recent.push(cur.eng);
    if (mem.recent.length > 15) mem.recent.shift();
    saveMem();
    setStatus($('wordStatus'), '');
    $('wordPrompt').textContent = L.ask;
    $('wordEmoji').textContent = L.mode === 'listen' ? '👂' : (L.emoji ? cur.emoji : '🤔');
    $('wordIta').textContent = L.mode === 'listen' ? '' : cur.ita;
    show($('wordContinue'), false);
    show($('wordSpeak'), L.mode === 'listen' || L.mode === 'spell');
    show($('optionsGrid'), L.mode !== 'spell');
    show($('tileArea'), L.mode === 'spell');
    hud();
    if (L.mode === 'spell') buildSpell(); else buildOptions(L);
    if (L.mode === 'listen') speakEn(cur.eng);
  }

  function showLevelIntro() {           // schermata di passaggio: toglie tutto del livello precedente
    locked = true;
    show($('optionsGrid'), false);
    show($('tileArea'), false);
    show($('wordSpeak'), false);
    $('optionsGrid').innerHTML = '';
    $('tiles').innerHTML = '';
    $('wordEmoji').textContent = '🎉';
    $('wordIta').textContent = `Livello ${lv + 1}: ${LEVELS[lv].name}`;
    $('wordPrompt').textContent = LEVELS[lv].intro;
    setStatus($('wordStatus'), '');
    show($('wordContinue'), true);
    hud();
  }

  function buildOptions(L) {
    const others = shuffle(WORDS.filter(w => w !== cur)).slice(0, L.opts - 1);
    const grid = $('optionsGrid');
    grid.innerHTML = '';
    shuffle([cur, ...others]).forEach(o => {
      const b = document.createElement('button');
      b.className = 'opt-btn';
      b.textContent = L.mode === 'listen' ? o.ita : o.eng;
      b.dataset.eng = o.eng;
      grid.appendChild(b);
    });
  }

  function renderSlots() {
    const box = $('slots');
    box.innerHTML = '';
    for (let i = 0; i < cur.eng.length; i++) {
      const s = document.createElement('span');
      s.className = 'slot';
      s.textContent = typed[i] || '';
      box.appendChild(s);
    }
  }
  function buildSpell() {
    const word = cur.eng.toUpperCase();
    const letters = word.split('');
    for (let t = 0; t < 5 && letters.join('') === word; t++) shuffle(letters);
    $('tiles').innerHTML = letters.map(c => `<button class="tile">${c}</button>`).join('');
    renderSlots();
  }

  function win() {
    locked = true;
    const first = !missed;
    if (first) progress++;
    let msg = first ? `🌟 Well Done! ${cur.eng} = ${cur.ita}` : `✅ ${cur.eng} = ${cur.ita}. Al prossimo, al primo colpo!`;
    let say = cur.eng, levelUp = false;
    if (progress >= NEED) {
      progress = 0;
      if (lv < LEVELS.length - 1) {
        lv++; save(lv); levelUp = true;
        msg = `🎉 Level up! Livello ${lv + 1}: ${LEVELS[lv].name}`;
        say = `${cur.eng}. Level up!`;
      } else {
        msg = '🏆 Fantastico! Sei al livello massimo, continua a giocare!';
        say = `${cur.eng}. You are a champion!`;
      }
    }
    hud();
    setStatus($('wordStatus'), msg, '#10B981');
    later(levelUp ? showLevelIntro : nextWord, levelUp ? 1800 : (progress === 0 ? 2500 : 1500));
    speakEn(say);
  }

  /* ---- Eventi ---- */
  $('optionsGrid').addEventListener('click', e => {
    const b = e.target.closest('.opt-btn');
    if (!b || locked || b.disabled) return;
    if (b.dataset.eng === cur.eng) {
      b.classList.add('right');
      win();
    } else {
      missed = true;
      b.disabled = true;
      setStatus($('wordStatus'), '❌ Try again!', '#EF4444');
    }
  });

  $('tiles').addEventListener('click', e => {
    const b = e.target.closest('.tile');
    if (!b || locked || b.disabled) return;
    if (b.textContent === cur.eng[typed.length].toUpperCase()) {
      b.disabled = true;
      typed.push(b.textContent);
      renderSlots();
      setStatus($('wordStatus'), '');
      if (typed.length === cur.eng.length) win();
    } else {
      missed = true;
      setStatus($('wordStatus'), '❌ Non è questa, prova un\'altra lettera!', '#EF4444');
    }
  });

  $('wordSpeak').onclick = () => speakEn(cur.eng);
  $('wordContinue').onclick = () => nextWord();

  // Ricomincia dal livello 1: serve un secondo tocco per confermare (evita errori)
  $('wordRestart').onclick = e => {
    const btn = e.currentTarget;
    if (!btn.classList.contains('sure')) {
      btn.classList.add('sure');
      btn.textContent = '❓ Sicura? Tocca ancora';
      clearTimeout(sureTimer);
      sureTimer = setTimeout(() => { btn.classList.remove('sure'); btn.textContent = '🔄 Dal livello 1'; }, 3000);
      return;
    }
    clearTimeout(sureTimer);
    btn.classList.remove('sure');
    btn.textContent = '🔄 Dal livello 1';
    epoch++;                            // annulla i passaggi di livello già programmati
    lv = 0; progress = 0; save(0);
    nextWord();
  };

  document.addEventListener('tabchange', e => {
    if (e.detail === 'englishWords' && !cur) nextWord();
  });
})();
