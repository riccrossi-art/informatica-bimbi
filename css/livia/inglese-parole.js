// Livia: English Words
// Dipende da: js/common.js

/* --- ENGLISH WORDS --- */
const WORDS = [
  ['Gatto','Cat','🐱'],['Cane','Dog','🐶'],['Mela','Apple','🍎'],['Sole','Sun','☀️'],
  ['Libro','Book','📚'],['Casa','House','🏠'],['Pesce','Fish','🐟'],['Albero','Tree','🌳'],
  ['Macchina','Car','🚗'],['Luna','Moon','🌙'],['Uccello','Bird','🐦'],['Banana','Banana','🍌']
].map(([ita, eng, emoji]) => ({ ita, eng, emoji }));
let deck = [], currentWord = null, wordLocked = false;

function nextWord() {
  if (!deck.length) deck = shuffle([...WORDS]);
  currentWord = deck.pop();
  wordLocked = false;
  $('wordEmoji').textContent = currentWord.emoji;
  $('wordIta').textContent = currentWord.ita;
  setStatus($('wordStatus'), '');
  const opts = shuffle([currentWord, ...shuffle(WORDS.filter(w => w !== currentWord)).slice(0, 2)]);
  const grid = $('optionsGrid');
  grid.innerHTML = '';
  opts.forEach(o => {
    const b = document.createElement('button');
    b.className = 'opt-btn';
    b.textContent = o.eng;
    grid.appendChild(b);
  });
}
$('optionsGrid').addEventListener('click', e => {
  const b = e.target.closest('.opt-btn');
  if (!b || wordLocked) return;
  const status = $('wordStatus');
  if (b.textContent === currentWord.eng) {
    wordLocked = true;                       // evita doppi click che saltano parole
    b.classList.add('right');
    setStatus(status, `🌟 Well Done! ${b.textContent} is correct!`, '#10B981');
    speakEn(b.textContent);
    setTimeout(nextWord, 1500);
  } else {
    b.disabled = true;
    setStatus(status, '❌ Try again!', '#EF4444');
  }
});

document.addEventListener('tabchange', e => {
  if (e.detail === 'englishWords' && !currentWord) nextWord();
});
