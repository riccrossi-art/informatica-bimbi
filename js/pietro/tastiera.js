// Pietro: Tastiera Pompieri & Treni
// Dipende da: js/common.js

/* --- TASTIERA A-Z + NUMERI --- */
const themeMap = {
  A:['Autopompa','🚒'],B:['Binario','🛤️'],C:['Caserma','🏢'],D:['Deposito','🏭'],
  E:['Estintore','🧯'],F:['Fuoco','🔥'],G:['Gatto da salvare','🐱'],H:['Heliporto','🚁'],
  I:['Idrante','🚰'],J:['Jolly','🃏'],K:['Koala','🐨'],L:['Locomotiva','🚂'],
  M:['Macchinista','🧑‍✈️'],N:['Nube di fumo','💨'],O:['Orologio','🕒'],P:['Pompiere','👨‍🚒'],
  Q:['Quartier generale','🏬'],R:['Rotaia','🛤️'],S:['Sirena','🚨'],T:['Treno','🚆'],
  U:['Uscita di sicurezza','🚪'],V:['Vigile del fuoco','🧑‍🚒'],
  W:['Walkie-talkie','📻'],X:['Xilofono','🎶'],Y:['Yacht','🛥️'],Z:['Zaino','🎒'],
  0:['Zero','0️⃣'],1:['Uno','1️⃣'],2:['Due','2️⃣'],3:['Tre','3️⃣'],4:['Quattro','4️⃣'],
  5:['Cinque','5️⃣'],6:['Sei','6️⃣'],7:['Sette','7️⃣'],8:['Otto','8️⃣'],9:['Nove','9️⃣']
};
function showKey(key) {
  const k = key.toUpperCase();
  const t = themeMap[k];
  $('keyDisplay').textContent = k;
  const em = $('keyEmoji');
  em.style.animation = 'none'; void em.offsetWidth; em.style.animation = '';
  if (t) {
    em.textContent = t[1];
    $('keyMeaning').textContent = `${k} come ${t[0]}`;
    speak(`${k}, ${t[0]}`);
  } else {
    em.textContent = '🚨';
    $('keyMeaning').textContent = 'Tasto Magico!';
    speak('Bravo Pietro!');
  }
}
$('screenKeys').innerHTML = Object.keys(themeMap)
  .map(k => `<button class="screen-key" data-k="${k}">${k}</button>`).join('');
$('screenKeys').addEventListener('click', e => {
  if (e.target.dataset.k) showKey(e.target.dataset.k);
});
window.addEventListener('keydown', e => {
  if (!$('keyboard').classList.contains('active')) return;          // solo nella scheda tastiera
  if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;        // niente ripetizioni né scorciatoie
  if (e.key.length !== 1 || e.key === ' ') return;                   // ignora Shift, Tab, Invio, F5...
  showKey(e.key);
});
