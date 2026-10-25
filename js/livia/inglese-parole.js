// Livia: English Words a livelli (la difficoltà cresce con le risposte giuste)
// Dipende da: js/common.js
(() => {
  /* ---- Parole: [italiano, inglese, emoji, fascia di difficoltà 1-3] ---- */
  const WORDS = [
    ['Gatto','Cat','🐱',1],['Cane','Dog','🐶',1],['Mela','Apple','🍎',1],['Sole','Sun','☀️',1],
    ['Libro','Book','📚',1],['Casa','House','🏠',1],['Pesce','Fish','🐟',1],['Albero','Tree','🌳',1],
    ['Macchina','Car','🚗',1],['Luna','Moon','🌙',1],['Uccello','Bird','🐦',1],['Banana','Banana','🍌',1],
    ['Fiore','Flower','🌸',2],['Latte','Milk','🥛',2],['Pane','Bread','🍞',2],['Cavallo','Horse','🐴',2],
    ['Scuola','School','🏫',2],['Palla','Ball','⚽',2],['Acqua','Water','💧',2],['Fuoco','Fire','🔥',2],
    ['Nuvola','Cloud','☁️',2],['Stella','Star','⭐',2],['Cuore','Heart','❤️',2],['Mano','Hand','✋',2],
    ['Pioggia','Rain','🌧️',2],['Aereo','Plane','✈️',2],['Barca','Boat','⛵',2],['Orologio','Clock','🕒',2],
    ['Elefante','Elephant','🐘',3],['Farfalla','Butterfly','🦋',3],['Coniglio','Rabbit','🐰',3],
    ['Scimmia','Monkey','🐵',3],['Montagna','Mountain','⛰️',3],['Bicicletta','Bicycle','🚲',3],
    ['Chitarra','Guitar','🎸',3],['Formaggio','Cheese','🧀',3],['Fragola','Strawberry','🍓',3],
    ['Tartaruga','Turtle','🐢',3],['Ombrello','Umbrella','☂️',3],['Giraffa','Giraffe','🦒',3],
    ['Pinguino','Penguin','🐧',3],['Dinosauro','Dinosaur','🦖',3],['Castello','Castle','🏰',3],
    ['Vulcano','Volcano','🌋',3]
  ].map(([ita, eng, emoji, tier]) => ({ ita, eng, emoji, tier }));

  /* ---- Livelli: cosa cambia salendo ---- */
  const LEVELS = [
    { name: 'Beginner',      tiers: [1],    mode: 'pick',   opts: 3, emoji: true,  ask: 'Come si dice in inglese?' },
    { name: 'Explorer',      tiers: [1, 2], mode: 'pick',   opts: 4, emoji: true,  ask: 'Come si dice in inglese?' },
    { name: 'Reader',        tiers: [2, 3], mode: 'pick',   opts: 4, emoji: false, ask: 'Senza disegno! Come si dice in inglese?' },
    { name: 'Listener',      tiers: [2, 3], mode: 'listen', opts: 4,               ask: 'Ascolta la parola e scegli il significato in italiano!' },
    { name: 'Spelling Star', tiers: [2, 3], mode: 'spell',  maxLen: 8, emoji: true, ask: 'Metti in ordine le lettere per scrivere la parola!' }
  ];
  const NEED = 5;                       // risposte giuste al primo colpo per salire
  const KEY = 'livia-eng-level';
  const load = () => { try { return Math.min(+localStorage.getItem(KEY) || 0, LEVELS.length - 1); } catch (e) { return 0; } };
  const save = n => { try { localStorage.setItem(KEY, n); } catch (e) {} };

  let lv = load(), progress = 0, cur = null, locked = false, missed = false, deck = [], typed = [];

  const pool = () => {
    const L = LEVELS[lv];
    return WORDS.filter(w => L.tiers.includes(w.tier) && (L.mode !== 'spell' || w.eng.length <= L.maxLen));
  };
  function draw() {
    if (!deck.length) {
      const last = cur;
      deck = shuffle(pool());
      if (deck.length > 1 && deck[deck.length - 1] === last) deck.unshift(deck.pop());
    }
    return deck.pop();
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
    setStatus($('wordStatus'), '');
    $('wordPrompt').textContent = L.ask;
    $('wordEmoji').textContent = L.mode === 'listen' ? '👂' : (L.emoji ? cur.emoji : '🤔');
    $('wordIta').textContent = L.mode === 'listen' ? '' : cur.ita;
    $('wordSpeak').hidden = !(L.mode === 'listen' || L.mode === 'spell');
    $('optionsGrid').hidden = L.mode === 'spell';
    $('tileArea').hidden = L.mode !== 'spell';
    hud();
    if (L.mode === 'spell') buildSpell(); else buildOptions(L);
    if (L.mode === 'listen') speakEn(cur.eng);
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
    let letters = word.split('');
    for (let t = 0; t < 5 && letters.join('') === word; t++) shuffle(letters);
    $('tiles').innerHTML = letters.map(c => `<button class="tile">${c}</button>`).join('');
    renderSlots();
  }

  function win() {
    locked = true;
    const first = !missed;
    if (first) progress++;
    let msg = first ? `🌟 Well Done! ${cur.eng} = ${cur.ita}` : `✅ ${cur.eng} = ${cur.ita}. Al prossimo, al primo colpo!`;
    let say = cur.eng, delay = 1500;
    if (progress >= NEED) {
      progress = 0; deck = []; delay = 2500;
      if (lv < LEVELS.length - 1) {
        lv++; save(lv);
        msg = `🎉 Level up! Livello ${lv + 1}: ${LEVELS[lv].name}`;
        say = `${cur.eng}. Level up!`;
      } else {
        msg = '🏆 Fantastico! Sei al livello massimo, continua a giocare!';
        say = `${cur.eng}. You are a champion!`;
      }
    }
    hud();
    setStatus($('wordStatus'), msg, '#10B981');
    setTimeout(nextWord, delay);
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

  document.addEventListener('tabchange', e => {
    if (e.detail === 'englishWords' && !cur) nextWord();
  });
})();
