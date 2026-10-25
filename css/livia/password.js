// Livia: Sicurezza Password
// Dipende da: js/common.js

/* --- PASSWORD --- */
function checkPass() {
  const p = document.getElementById('passInput').value;
  const fb = document.getElementById('passFeedback');
  if (!p) { fb.textContent = ''; return; }
  let score = 0;
  if (p.length >= 8) score++;
  if (p.length >= 12) score++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
  if (/\d/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  const ratings = [
    ['😱 Debolissima! Un hacker la trova subito', '#EF4444'],
    ['😱 Debolissima! Un hacker la trova subito', '#EF4444'],
    ['😕 Debole: aggiungi lunghezza e simboli', '#F59E0B'],
    ['🙂 Discreta, si può migliorare', '#EAB308'],
    ['💪 Forte!', '#10B981'],
    ['🛡️ Fortissima! A prova di hacker', '#10B981']
  ];
  fb.textContent = ratings[score][0];
  fb.style.color = ratings[score][1];
}

$('passInput').addEventListener('input', checkPass);
