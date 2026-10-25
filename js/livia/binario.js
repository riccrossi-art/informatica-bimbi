// Livia: Pixel & Codice Binario
// Dipende da: js/common.js

/* --- PIXEL ART & BINARIO --- */
const pixels = new Array(16).fill(0);

function buildPixelGrid() {
  const g = document.getElementById('pixelGrid');
  g.innerHTML = '';
  pixels.forEach((v, i) => {
    const p = document.createElement('div');
    p.className = 'pixel' + (v ? ' on' : '');
    p.textContent = v;
    p.onclick = () => { pixels[i] ^= 1; buildPixelGrid(); };
    g.appendChild(p);
  });
  const rows = [];
  for (let i = 0; i < 16; i += 4) rows.push(pixels.slice(i, i + 4).join(''));
  document.getElementById('binaryDisplay').textContent = rows.join(' ');
}

buildPixelGrid();
