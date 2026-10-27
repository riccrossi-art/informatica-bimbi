// Motore di quiz a livelli (usato da matematica e inglese): HUD a stelle, passaggio di livello,
// risposte sbagliate che non fanno avanzare, riavvio con conferma, livello salvato.
// Dipende da: js/common.js
const Quiz = (() => {
  const rnd = (a, b) => a + (Math.random() * (b - a + 1) | 0);
  const pick = a => a[Math.random() * a.length | 0];
  // opzioni numeriche: la risposta giusta + distrattori vicini, tutti diversi e >= 0
  function numOptions(ans, n = 4, deltas = [1, 2, 10]) {
    const c = [];
    deltas.forEach(d => { c.push(ans + d, ans - d); });
    for (let d = 1; d < 30; d++) c.push(ans + d, ans - d);
    const uniq = [...new Set(c)].filter(x => x >= 0 && x !== ans);
    const near = uniq.slice(0, deltas.length * 2);
    const others = shuffle([...near]).slice(0, n - 1);
    while (others.length < n - 1) others.push(uniq[others.length + near.length]);
    return [{ label: ans, ok: true }, ...others.map(x => ({ label: x }))];
  }

  const TPL = `<div class="qz-hud"><span>⭐ Livello <b class="qz-lv">1</b>: <span class="qz-name"></span></span>
    <div class="qz-bar" role="progressbar" aria-valuemin="0"><div class="qz-fill"></div></div><span class="qz-prog"></span>
    <button class="qz-restart">🔄 Dal livello 1</button></div>
    <p class="qz-prompt"></p>
    <div class="qz-card"><div class="qz-big"></div>
      <button class="qz-btn qz-say" hidden>🔊 Ascolta</button><button class="qz-btn qz-go" hidden>▶️ Continua</button></div>
    <div class="qz-options"></div><div class="qz-status" aria-live="polite"></div>`;

  function mount(cfg) {
    const root = cfg.el, NEED = cfg.need || 5, LV = cfg.levels;
    root.innerHTML = TPL;
    const q$ = s => root.querySelector(s), status = q$('.qz-status');
    const load = () => { try { return Math.min(+localStorage.getItem(cfg.key) || 0, LV.length - 1); } catch (e) { return 0; } };
    const save = n => { try { localStorage.setItem(cfg.key, n); } catch (e) {} };
    let lv = load(), progress = 0, cur = null, locked = false, missed = false, epoch = 0, sure = null, recent = [];
    const later = (f, ms) => { const e = epoch; setTimeout(() => { if (e === epoch) f(); }, ms); };
    const show = (el, on) => { el.hidden = !on; el.style.display = on ? '' : 'none'; };
    const say = (t, lang) => { if (cfg.lang && t) speak(t, lang || cfg.lang); };

    function hud() {
      q$('.qz-lv').textContent = lv + 1;
      q$('.qz-name').textContent = LV[lv].name;
      q$('.qz-prog').textContent = '⭐'.repeat(progress) + '☆'.repeat(NEED - progress);
      q$('.qz-fill').style.width = (progress / NEED * 100) + '%';
      q$('.qz-bar').setAttribute('aria-valuenow', progress);
    }
    function next() {
      let q;
      for (let t = 0; t < 8; t++) { q = LV[lv].make(); if (!recent.includes(q.id)) break; }
      recent.push(q.id); if (recent.length > 5) recent.shift();
      cur = q; locked = false; missed = false;
      q$('.qz-prompt').textContent = q.prompt;
      const big = q$('.qz-big');
      big.className = 'qz-big ' + (q.bigClass || '');
      big.textContent = q.big;
      show(q$('.qz-say'), !!(cfg.lang && q.say)); show(q$('.qz-go'), false);
      setStatus(status, '');
      const box = q$('.qz-options');
      box.innerHTML = '';
      show(box, true);
      shuffle([...q.options]).forEach(o => {
        const b = document.createElement('button');
        b.className = 'qz-opt ' + (q.optClass || '');
        b.innerHTML = o.label;
        b._o = o;
        box.appendChild(b);
      });
      hud();
      say(q.say, q.lang);
    }
    function intro() {                      // schermata di passaggio: toglie tutto del livello precedente
      locked = true;
      show(q$('.qz-options'), false); show(q$('.qz-say'), false);
      q$('.qz-options').innerHTML = '';
      q$('.qz-big').className = 'qz-big';
      q$('.qz-big').textContent = '🎉';
      q$('.qz-prompt').textContent = `Livello ${lv + 1}: ${LV[lv].name}. ${LV[lv].intro}`;
      setStatus(status, '');
      show(q$('.qz-go'), true);
      say(LV[lv].introSay, cfg.lang);
      hud();
    }
    function win() {
      locked = true;
      const first = !missed;
      if (first) progress++;
      let msg = (first ? pick(cfg.praise) : cfg.retryOk) + (cur.okMsg ? ' ' + cur.okMsg : '');
      let spoken = cur.sayOk, up = false;
      if (progress >= NEED) {
        progress = 0;
        if (lv < LV.length - 1) { lv++; save(lv); up = true; msg = `🎉 Level up! Livello ${lv + 1}: ${LV[lv].name}`; spoken = cfg.levelUpSay || spoken; }
        else { msg = '🏆 Fantastico! Sei al livello massimo, continua a giocare!'; }
      }
      hud();
      setStatus(status, msg, '#10B981');
      later(up ? intro : next, up ? 1800 : (progress === 0 ? 2500 : 1400));
      say(spoken, cur.lang);
    }

    q$('.qz-options').addEventListener('click', e => {
      const b = e.target.closest('.qz-opt');
      if (!b || locked || b.disabled) return;
      if (b._o.ok) { b.classList.add('right'); win(); }
      else { missed = true; b.disabled = true; setStatus(status, cfg.tryAgain, '#EF4444'); say(b._o.say, cur.lang); }
    });
    q$('.qz-say').onclick = () => say(cur.say, cur.lang);
    q$('.qz-go').onclick = next;
    q$('.qz-restart').onclick = e => {      // serve un secondo tocco per confermare
      const btn = e.currentTarget;
      if (!btn.classList.contains('sure')) {
        btn.classList.add('sure'); btn.textContent = '❓ Sicuro? Tocca ancora';
        clearTimeout(sure);
        sure = setTimeout(() => { btn.classList.remove('sure'); btn.textContent = '🔄 Dal livello 1'; }, 3000);
        return;
      }
      clearTimeout(sure); btn.classList.remove('sure'); btn.textContent = '🔄 Dal livello 1';
      epoch++; lv = 0; progress = 0; save(0); next();
    };
    document.addEventListener('tabchange', e => { if (e.detail === cfg.tab && !cur) next(); });
  }
  return { mount, rnd, pick, numOptions };
})();
