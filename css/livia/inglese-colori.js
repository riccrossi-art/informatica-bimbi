// Livia: Listen & Pick Colors
// Dipende da: js/common.js

/* --- ENGLISH COLORS --- */
const COLORS = [['Red','#EF4444'],['Blue','#3B82F6'],['Green','#10B981'],['Yellow','#EAB308']];
let targetColor = 'Red', colorLocked = false;

$('colorCircles').innerHTML = COLORS.map(([n, hex]) =>
  `<button class="color-circle" style="background:${hex}" data-color="${n}" aria-label="Cerchio colorato"></button>`).join('');

function nextColor() {
  const others = COLORS.map(c => c[0]).filter(n => n !== targetColor);
  targetColor = others[Math.random() * others.length | 0];   // mai due volte lo stesso colore
  colorLocked = false;
  setStatus($('colorStatus'), '');
  playColorAudio();
}
function playColorAudio() {
  if (!speakEn(targetColor)) setStatus($('colorStatus'), 'Questo dispositivo non supporta la voce 😢', '#F59E0B');
}
$('speakBtn').onclick = playColorAudio;
$('colorCircles').addEventListener('click', e => {
  const b = e.target.closest('[data-color]');
  if (!b || colorLocked) return;
  const status = $('colorStatus');
  if (b.dataset.color === targetColor) {
    colorLocked = true;
    setStatus(status, `🎉 Correct! That is ${targetColor}!`, '#10B981');
    speakEn('Yes! ' + targetColor);
    setTimeout(nextColor, 1500);
  } else {
    setStatus(status, `❌ Oops! That was not ${targetColor}. Listen again!`, '#EF4444');
  }
});

document.addEventListener('tabchange', e => {
  if (e.detail === 'englishColors') nextColor();
});
