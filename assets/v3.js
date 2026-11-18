/* ============================================================
   SCARSELLATO v3 «maison» — shared script (every page).
   1) i18n: ENGLISH is the source and the default for every new visitor.
   2) motion: reveals, letter-roll, halftone, sheets, chapters, process line, guide line, card videos + lightbox.
   3) the live assistant (the product itself) + mobile menu.
   Page dictionaries (before this script):
     window.PAGE_I18N = { fr:{t:{key:html}, qa:[[q,a]…]}, de:{…}, en:{qa:[…]} }
   Vanilla, no CDN, no cookies.
   ============================================================ */
(() => {
  const SHARED = {
    fr: { t: {
      'nav.crafts': 'Métiers', 'nav.approach': "L'approche", 'nav.immo': 'Immobilier', 'nav.work': 'Réalisations', 'nav.write': 'Écrire', 'nav.menu': 'Menu',
      'form.name': 'VOTRE NOM', 'form.email': 'VOTRE E-MAIL', 'form.send': "Envoyer à l'atelier",
      'foot.l': 'Scarsellato — atelier digital · Luxembourg · © 2026', 'foot.r': '0 cookie · 0 traceur',
      'play': '▶ Voir en grand', 'lb.close': 'Fermer ✕', 'ex': '[ exemple ]',
      'chat.toggleAria': "Une question ? Ouvrir l'assistant", 'chat.panelAria': "Assistant de l'atelier", 'chat.head': '( ASSISTANT — EN DIRECT )', 'chat.closeAria': 'Fermer',
      'chat.greet': "Bonjour ! Je réponds en direct, uniquement à partir des informations de l'atelier — je ne devine rien. Posez votre question, ou commencez par l'une de celles-ci :",
      'chat.ph': 'ÉCRIVEZ VOTRE QUESTION…', 'chat.sendAria': 'Envoyer', 'chat.sugg': 'Questions suggérées',
      'chat.note': 'Vos messages servent uniquement à vous répondre. 0 cookie, 0 traceur.', 'chat.typing': "L'assistant écrit…",
      'chat.offline': "L'assistant ne répond pas à l'instant — écrivez à noah@scarsellato.com, réponse le jour même."
    } },
    de: { t: {
      'nav.crafts': 'Gewerke', 'nav.approach': 'Der Ansatz', 'nav.immo': 'Immobilien', 'nav.work': 'Arbeiten', 'nav.write': 'Schreiben', 'nav.menu': 'Menü',
      'form.name': 'IHR NAME', 'form.email': 'IHRE E-MAIL', 'form.send': 'An das Atelier senden',
      'foot.l': 'Scarsellato — digitales Atelier · Luxemburg · © 2026', 'foot.r': '0 Cookies · 0 Tracker',
      'play': '▶ Groß ansehen', 'lb.close': 'Schließen ✕', 'ex': '[ Beispiel ]',
      'chat.toggleAria': 'Eine Frage? Assistent öffnen', 'chat.panelAria': 'Atelier-Assistent', 'chat.head': '( ASSISTENT — LIVE )', 'chat.closeAria': 'Schließen',
      'chat.greet': 'Guten Tag! Ich antworte live, ausschließlich aus den Informationen des Ateliers — ich rate nie. Stellen Sie Ihre Frage, oder beginnen Sie mit einer davon:',
      'chat.ph': 'SCHREIBEN SIE IHRE FRAGE…', 'chat.sendAria': 'Senden', 'chat.sugg': 'Fragevorschläge',
      'chat.note': 'Ihre Nachrichten dienen nur dazu, Ihnen zu antworten. 0 Cookies, 0 Tracker.', 'chat.typing': 'Der Assistent schreibt…',
      'chat.offline': 'Der Assistent antwortet gerade nicht — schreiben Sie an noah@scarsellato.com, Antwort am selben Tag.'
    } },
    en: { t: { 'chat.typing': 'The assistant is writing…', 'chat.sugg': 'Suggested questions', 'lb.close': 'Close ✕',
      'chat.offline': 'The assistant is not answering right now — write to noah@scarsellato.com, same-day reply.' } }
  };
  const PAGE = window.PAGE_I18N || {};
  let saved = null; try { saved = localStorage.getItem('scar-lang'); } catch (e) {}
  // order: ?lang= → the visitor's own saved choice → ENGLISH (browser language deliberately ignored)
  let LANG = (new URLSearchParams(location.search).get('lang') || saved || 'en').toLowerCase();
  if (!['en', 'fr', 'de'].includes(LANG)) LANG = 'en';
  const T = Object.assign({}, SHARED[LANG].t, (PAGE[LANG] || {}).t || {});
  window.SCAR = { LANG, T, QA: (PAGE[LANG] || {}).qa || (PAGE.en || {}).qa || [] };
  document.documentElement.lang = LANG;
  if (LANG !== 'en') {
    if (T['meta.title']) { const x = document.createElement('textarea'); x.innerHTML = T['meta.title']; document.title = x.value; }
    const md = document.querySelector('meta[name="description"]'); if (md && T['meta.desc']) md.setAttribute('content', T['meta.desc']);
    document.querySelectorAll('[data-i18n]').forEach(el => { const v = T[el.dataset.i18n]; if (v != null) el.innerHTML = v; });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => { const v = T[el.dataset.i18nPh]; if (v != null) el.placeholder = v; });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => { const v = T[el.dataset.i18nAria]; if (v != null) el.setAttribute('aria-label', v); });
    // internal links keep the language even when storage is blocked
    document.querySelectorAll('a[href]').forEach(a => {
      const h = a.getAttribute('href'); if (!h || /^(https?:|mailto:|tel:|#)/.test(h)) return;
      const u = new URL(h, location.href); u.searchParams.set('lang', LANG); a.href = u.pathname + u.search + u.hash;
    });
  }
  // explainer videos exist per language: x.mp4 (FR original), x-en.mp4, x-de.mp4
  if (LANG !== 'fr') {
    const loc = v => v && /media\/[\w-]+\.mp4/.test(v) && !/-(en|de)\.mp4/.test(v) ? v.replace(/\.mp4/, `-${LANG}.mp4`) : v;
    document.querySelectorAll('video[src*="media/"], [data-src*="media/"], [data-full*="media/"]').forEach(el => {
      if (el.hasAttribute('src') && el.getAttribute('src').includes('media/')) { el.setAttribute('src', loc(el.getAttribute('src'))); if (el.load) el.load(); }
      if (el.dataset.src) el.dataset.src = loc(el.dataset.src);
      if (el.dataset.full) el.dataset.full = loc(el.dataset.full);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(b => {
    b.setAttribute('aria-current', String(b.dataset.lang === LANG));
    b.addEventListener('click', () => {
      if (b.dataset.lang === LANG) return;
      try { localStorage.setItem('scar-lang', b.dataset.lang); } catch (e) {}
      const u = new URL(location.href); u.searchParams.set('lang', b.dataset.lang); location.replace(u.href);
    });
  });
})();

(() => {
  const T = window.SCAR.T;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- letter-roll: split labels into doubled chars ---------- */
  document.querySelectorAll('.roll').forEach(el => {
    const txt = el.textContent; el.setAttribute('aria-label', txt); el.textContent = '';
    [...txt].forEach((c, i) => { const s = document.createElement('i'); s.textContent = c; s.dataset.c = c; s.style.setProperty('--i', i); s.setAttribute('aria-hidden', 'true'); el.appendChild(s); });
  });

  /* ---------- reveals ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('[data-reveal], .fade').forEach(el => io.observe(el));
  // safety nets: an invisible section is worse than an un-animated one
  requestAnimationFrame(() => document.querySelectorAll('.hero, .hero .fade').forEach(el => el.classList.add('in')));   // the opening never waits
  setTimeout(() => document.querySelectorAll('[data-reveal], .fade').forEach(el => { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in'); }), 2500);

  /* ---------- the single line (école d'art) — drawn on load, follows scroll ---------- */

  const GOLD = '#c6a56c';

  /* ---------- halftone images (gold dots → hover reveals the real world) ---------- */
  const halftones = [];
  const visIO = new IntersectionObserver(es => es.forEach(e => { const h = halftones.find(h => h.cv === e.target); if (h) h.vis = e.isIntersecting; }));
  // src: image URL, or a draw(ctx, cols, rows) function that paints luminance (white = big dots)
  function halftone(cv, src, shift = 0, opts = {}) {
    const build = img => {
      const r = cv.getBoundingClientRect(); if (!r.width) return;
      const dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = r.width * dpr; cv.height = r.height * dpr;
      const ctx = cv.getContext('2d'); const step = (opts.step || 9) * dpr;
      const cols = Math.ceil(cv.width / step), rows = Math.ceil(cv.height / step);
      const off = document.createElement('canvas'); off.width = cols; off.height = rows;
      const o = off.getContext('2d'); o.fillStyle = '#000'; o.fillRect(0, 0, cols, rows);
      if (img) { const s = Math.max(cols / img.width, rows / img.height), w = img.width * s, h = img.height * s; o.drawImage(img, (cols - w) * (0.5 + shift), (rows - h) / 2, w, h); }
      else src(o, cols, rows);
      let data; try { data = o.getImageData(0, 0, cols, rows).data; } catch (e) { return; }
      const old = halftones.findIndex(h => h.cv === cv); if (old > -1) halftones.splice(old, 1);
      const item = { cv, ctx, cols, rows, step, data, dpr, ...opts };
      halftones.push(item); paintHT(item, 0); visIO.observe(cv);
    };
    if (typeof src === 'function') build(null);
    else { const img = new Image(); img.src = src; img.onload = () => build(img); }
  }
  // ---- drawn subjects: each craft shows what it actually is ----
  const rr = (o, x, y, w, h, r, L) => { const v = Math.round(L * 255); o.fillStyle = `rgb(${v},${v},${v})`; o.beginPath(); o.roundRect(x, y, w, h, r); o.fill(); };
  const SHAPES = {
    rr(o, c, r) { o.setTransform(c / 160, 0, 0, r / 90, 0, 0);            // a message thread: demande -> reponse -> relance
      rr(o, 14, 12, 82, 18, 6, .55); rr(o, 20, 18, 50, 3, 1, .95); rr(o, 20, 23, 34, 3, 1, .8);
      rr(o, 62, 37, 86, 20, 6, .95); rr(o, 68, 43, 60, 3, 1, .2); rr(o, 68, 48, 44, 3, 1, .2);
      rr(o, 14, 64, 66, 15, 6, .45); rr(o, 20, 70, 38, 3, 1, .9); },
    auto(o, c, r) { o.setTransform(c / 160, 0, 0, r / 90, 0, 0);          // a workflow: 4 steps, one is "vous validez"
      o.strokeStyle = 'rgb(140,140,140)'; o.lineWidth = 2.2; o.beginPath(); o.moveTo(22, 42); o.lineTo(138, 42); o.stroke();
      [22, 61, 100, 138].forEach((x, i) => { o.fillStyle = i === 2 ? 'rgb(120,120,120)' : 'rgb(245,245,245)'; o.beginPath(); o.arc(x, 42, i === 2 ? 11 : 8, 0, 6.3); o.fill(); rr(o, x - 12, 60, 24, 3, 1, .45); });
      o.strokeStyle = '#000'; o.lineWidth = 2; o.beginPath(); o.moveTo(95, 42); o.lineTo(99, 46); o.lineTo(106, 37); o.stroke(); },
    bot(o, c, r) { o.setTransform(c / 160, 0, 0, r / 90, 0, 0);           // a chat window
      o.strokeStyle = 'rgb(120,120,120)'; o.lineWidth = 2; o.beginPath(); o.roundRect(24, 8, 112, 74, 9); o.stroke();
      rr(o, 76, 18, 52, 13, 5, .55); rr(o, 32, 37, 84, 20, 5, .95); rr(o, 38, 43, 58, 3, 1, .2); rr(o, 38, 48, 44, 3, 1, .2);
      rr(o, 32, 66, 96, 8, 4, .3); }
  };
  const glyph = g => (o, c, r) => { o.fillStyle = '#fff'; o.textAlign = 'center'; o.textBaseline = 'middle'; o.font = `italic 300 ${Math.round(r * (g === '∞' || g === '~' ? 0.62 : 0.86))}px Fraunces, Georgia, serif`; o.fillText(g, c / 2, r * 0.5); };
  function paintHT(h, t) {
    const { ctx, cols, rows, step, data } = h;
    ctx.fillStyle = h.bg || '#12171b'; ctx.fillRect(0, 0, h.cv.width, h.cv.height);
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4; let L = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
      if (h.breathe) L *= 0.86 + 0.14 * Math.sin(t * 0.8 + x * 0.21 + y * 0.17);
      L = Math.min(1, Math.max(0, (L - 0.08) * 1.45)); // lift our dark worlds so the dots read
      const rad = Math.pow(L, 0.9) * step * 0.52;
      if (rad < 0.4) continue;
      ctx.fillStyle = L > 0.62 ? '#eae2d8' : GOLD;
      ctx.beginPath(); ctx.arc(x * step + step / 2, y * step + step / 2, rad, 0, 6.2832); ctx.fill();
    }
  }
  document.querySelectorAll('canvas[data-ht]').forEach(cv => halftone(cv, cv.dataset.ht, parseFloat(cv.dataset.shift || 0)));
  // Portrait slot: halftone placeholder until Noah's real photo lands (swap src → img/noah.jpg)
  const pc = document.getElementById('portrait');
  if (pc) halftone(pc, pc.dataset.src || 'img/world-sante.jpg', 0.1, { step: 8, breathe: true, bg: '#0d1114' });
  document.querySelectorAll('canvas[data-shape]').forEach(cv => halftone(cv, SHAPES[cv.dataset.shape], 0, { step: 7 }));
  const glyphs = () => document.querySelectorAll('canvas[data-glyph]').forEach(cv => { if (cv.offsetParent) halftone(cv, glyph(cv.dataset.glyph), 0, { step: 8, breathe: true, bg: '#12171b' }); });
  (document.fonts && document.fonts.load ? document.fonts.load('italic 300 80px Fraunces').then(glyphs, glyphs) : glyphs());

  // explainer loops play only while hovered
  document.querySelectorAll('.card').forEach(c => {
    const v = c.querySelector('video.mock-vid'); if (!v) return;
    c.addEventListener('mouseenter', () => { if (!v.src) v.src = v.dataset.src; v.currentTime = 0; v.play().catch(() => {}); });
    c.addEventListener('mouseleave', () => v.pause());
  });
  // full-quality explainer in a lightbox
  const lb = document.createElement('div'); lb.className = 'lightbox'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
  lb.innerHTML = `<button class="x" type="button">${T['lb.close'] || 'Close ✕'}</button><video controls playsinline muted loop></video>`;
  document.body.appendChild(lb);
  const lv = lb.querySelector('video');
  const closeLb = () => { lb.classList.remove('open'); lv.pause(); };
  document.querySelectorAll('.play[data-full]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); lv.src = b.dataset.full; lb.setAttribute('aria-label', b.dataset.title); lb.classList.add('open'); lv.play().catch(() => {}); }));
  lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('x')) closeLb(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

  /* ---------- chapters: each sheet slides over the last; the covered one recedes ---------- */
  const chaps = [...document.querySelectorAll('.chap')];
  // a sheet taller than the room it has would hide its own bottom under the next one -> let it scroll normally
  function chapFit() { chaps.forEach(ch => { ch.style.position = ''; const top = parseFloat(getComputedStyle(ch).top); if (ch.offsetHeight > innerHeight - top - 12) ch.style.position = 'relative'; }); }
  chapFit(); addEventListener('resize', chapFit);
  function chapTick() {
    chaps.forEach((ch, i) => {
      const nx = chaps[i + 1]; if (!nx) return;
      const stick = parseFloat(getComputedStyle(nx).top);
      const nt = nx.getBoundingClientRect().top;
      const c = Math.min(1, Math.max(0, 1 - (nt - stick) / (innerHeight - stick)));
      ch.style.setProperty('--c', c.toFixed(3));
    });
  }
  // sheet hairline for sections without data-reveal
  document.querySelectorAll('.sheet:not([data-reveal])').forEach(el => new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { el.classList.add('sheet-in'); o.disconnect(); } }), { threshold: 0.05 }).observe(el));

  /* ---------- pinned horizontal process ---------- */
  const proc = document.getElementById('methode'), track = document.getElementById('pTrack'), fill = document.getElementById('pFill'), count = document.getElementById('pCount');
  // a horizontal, breathing line along the track with a small curl at each step — it travels WITH the cards
  let PL = null;
  function buildPLine() {
    if (!track || innerWidth <= 760) return;
    let svg = track.querySelector('.pline'); if (!svg) { svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.classList.add('pline'); svg.innerHTML = '<path/><circle r="3"/>'; track.prepend(svg); }
    const Wt = track.scrollWidth + 200, cy = 46, steps = [...track.querySelectorAll('.step')];
    svg.setAttribute('width', Wt); svg.setAttribute('viewBox', `0 0 ${Wt} 92`);
    let d = `M-40,${cy}`, x = -40, y = cy, tx = 1;
    const C = (c1, c2, e) => { d += ` C${c1} ${c2} ${e}`; };
    steps.forEach((st, i) => {
      const sx = st.offsetLeft, r = 13 + (i % 2) * 5, amp = 10 + (i % 3) * 5;
      const mid = (x + sx - 30) / 2;                               // a soft wave on the way
      C(`${x + (mid - x) * 0.5},${y}`, `${mid - (mid - x) * 0.5},${cy - amp}`, `${mid},${cy - amp}`);
      C(`${mid + (sx - 30 - mid) * 0.5},${cy - amp}`, `${sx - 30 - (sx - 30 - mid) * 0.5},${cy}`, `${sx - 30},${cy}`);
      const K = 0.5523 * r, ax = sx - 30;                           // a curl above the line, right before the step's number
      C(`${ax + K},${cy}`, `${ax + r},${cy - r + K}`, `${ax + r},${cy - r}`);
      C(`${ax + r},${cy - r - K}`, `${ax + K},${cy - 2 * r}`, `${ax},${cy - 2 * r}`);
      C(`${ax - K},${cy - 2 * r}`, `${ax - r},${cy - r - K}`, `${ax - r},${cy - r}`);
      C(`${ax - r},${cy - r + K}`, `${ax - K},${cy}`, `${ax},${cy}`);
      x = ax; y = cy;
    });
    C(`${x + 120},${cy}`, `${Wt - 160},${cy + 12}`, `${Wt - 40},${cy}`);
    const path = svg.querySelector('path'); path.setAttribute('d', d);
    const L = path.getTotalLength(), S = [];
    for (let l = 0, xm = -1e9; l <= L; l += 5) { const pt = path.getPointAtLength(l); xm = Math.max(xm, pt.x); S.push([l, xm, pt.x, pt.y]); }
    path.style.strokeDasharray = L; PL = { path, tip: svg.querySelector('circle'), L, S };
  }
  buildPLine(); addEventListener('resize', () => { PL = null; buildPLine(); });
  function processTick() {
    if (!proc || getComputedStyle(proc).height === 'auto' || innerWidth <= 760 || reduce) return;
    const r = proc.getBoundingClientRect(); const total = r.height - innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / total));
    const max = track.scrollWidth - innerWidth + Math.max(16, (innerWidth - 1240) / 2);
    track.style.transform = `translate3d(${-p * Math.max(0, max)}px,0,0)`;
    fill.style.width = (p * 100) + '%';
    if (PL) {                                                    // the method's own line: drawn left → right with the cards
      const want = innerWidth * 0.62 + p * Math.max(0, max), S = PL.S;
      let lo = 0, hi = S.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (S[m][1] <= want) lo = m; else hi = m - 1; }
      const len = p >= 0.999 ? PL.L : S[lo][0];
      PL.path.style.strokeDashoffset = PL.L - len; const q = S[lo]; PL.tip.setAttribute('cx', q[2]); PL.tip.setAttribute('cy', q[3]);
    }
    count.textContent = `[ 0${Math.min(4, 1 + Math.floor(p * 3.999))} / 04 ]`;
  }

  /* ---------- the guide: one gold thread that leads the eye through the whole page ---------- */
  const NS = 'http://www.w3.org/2000/svg';
  const gsvg = document.createElementNS(NS, 'svg'); gsvg.classList.add('guide'); gsvg.setAttribute('aria-hidden', 'true');
  const gpath = document.createElementNS(NS, 'path'); const gtip = document.createElementNS(NS, 'circle'); gtip.setAttribute('r', 3.2);
  const ghalo = document.createElementNS(NS, 'circle'); ghalo.setAttribute('r', 9); ghalo.classList.add('halo');
  gsvg.append(gpath, ghalo, gtip); document.body.appendChild(gsvg);
  let G = null, gCur = 0;
  const $ = q => document.querySelector(q);
  const box = el => { const r = el.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top + scrollY, b: r.bottom + scrollY, h: r.height }; };
  const textRight = el => { const rg = document.createRange(); rg.selectNodeContents(el); return rg.getBoundingClientRect().right; };
  function buildGuide() {
    gsvg.style.display = 'none';
    const W = document.documentElement.clientWidth, H = document.documentElement.scrollHeight;
    gsvg.style.display = '';
    gsvg.setAttribute('viewBox', `0 0 ${W} ${H}`); gsvg.style.width = W + 'px'; gsvg.style.height = H + 'px';
    const wl = $('.hero .wrap').getBoundingClientRect().left;
    const mL = Math.max(8, wl * 0.5), mR = W - mL, wob = Math.min(14, mL * 0.35);   // the two free margins
    const X = s => s === 'L' ? mL : mR;
    // 1) everything the line must never cross
    // every direct child of a section's .wrap is content; the gaps between them are where the line may play
    const OBST = 'main section .wrap > *, .marquee, .process, .chapters, .giant, .foot';
    const obs = [...document.querySelectorAll(OBST)].map(box).filter(r => r.h > 0).sort((a, b) => a.t - b.t);
    // 2) full-width bands where nothing sits = free to sweep across
    const gaps = []; let cur = obs[0].b;
    for (const r of obs.slice(1)) { if (r.t - cur > 50) gaps.push({ t: cur, b: r.t, h: r.t - cur }); cur = Math.max(cur, r.b); }
    // ---- pen with a direction: every curve leaves exactly the way the last one arrived (G1) → never an angle ----
    let d = '', pen = [0, 0], tan = [1, 0];
    const nrm = v => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };
    const Mv = (x, y, t = [1, 0]) => { d = `M${x},${y}`; pen = [x, y]; tan = nrm(t); };
    const to = (x, y, t, k1, k2) => {                 // cubic to (x,y) arriving with tangent t
      t = nrm(t); let dist = Math.hypot(x - pen[0], y - pen[1]);
      for (let g = 0; g < 3 && dist > 40; g++) {        // target behind/beside us → turn in quarter arcs first (never a cusp)
        const v = [(x - pen[0]) / dist, (y - pen[1]) / dist];
        if (tan[0] * v[0] + tan[1] * v[1] >= 0.35) break;
        let n = [-tan[1], tan[0]]; if (n[0] * v[0] + n[1] * v[1] < 0) n = [-n[0], -n[1]];
        const R = Math.min(48, dist * 0.25), mx = pen[0] + (tan[0] + n[0]) * R, my = pen[1] + (tan[1] + n[1]) * R;
        d += ` C${pen[0] + tan[0] * R * 0.5523},${pen[1] + tan[1] * R * 0.5523} ${mx - n[0] * R * 0.5523},${my - n[1] * R * 0.5523} ${mx},${my}`;
        pen = [mx, my]; tan = n; dist = Math.hypot(x - pen[0], y - pen[1]);
      }
      k1 = Math.min(k1 ?? dist * 0.42, dist * 0.6); k2 = Math.min(k2 ?? dist * 0.42, dist * 0.6);
      d += ` C${pen[0] + tan[0] * k1},${pen[1] + tan[1] * k1} ${x - t[0] * k2},${y - t[1] * k2} ${x},${y}`;
      pen = [x, y]; tan = t;
    };
    const loop = (r, s, turns = 1) => {               // a circle that leaves and returns tangent to the pen; s=±1 picks the side
      r = Math.max(18, r);                              // never pinch: no loop tighter than 18 px
      const t = tan, n = [-t[1] * s, t[0] * s], c = [pen[0] + n[0] * r, pen[1] + n[1] * r], K = 0.5523;
      const P = th => [c[0] - n[0] * r * Math.cos(th) + t[0] * r * Math.sin(th), c[1] - n[1] * r * Math.cos(th) + t[1] * r * Math.sin(th)];
      const T = th => [n[0] * Math.sin(th) + t[0] * Math.cos(th), n[1] * Math.sin(th) + t[1] * Math.cos(th)];
      const q = Math.round(4 * turns);
      for (let i = 0; i < q; i++) {
        const a = i * Math.PI / 2, b = a + Math.PI / 2, A = P(a), B = P(b), ta = T(a), tb = T(b);
        d += ` C${A[0] + ta[0] * K * r},${A[1] + ta[1] * K * r} ${B[0] - tb[0] * K * r},${B[1] - tb[1] * K * r} ${B[0]},${B[1]}`;
        pen = B; tan = nrm(tb);
      }
    };
    let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const pick = a => a[Math.floor(rnd() * a.length)];
    const side0 = s => s === 'L' ? -1 : 1;           // outward direction of a margin
    // ---- margin travel: varied breathing, leans outward, sometimes a small loop that spills off the page edge ----
    const ride = (side, y1) => {
      const y0 = pen[1], span = y1 - y0; if (span < 30) { to(X(side), y1, [0, 1]); return; }
      const n = Math.max(1, Math.round(span / (260 + rnd() * 260)));
      for (let i = 1; i <= n; i++) {
        const last = i === n, out = side0(side);
        const amp = last ? 0 : (rnd() < 0.5 ? out * (8 + rnd() * Math.min(60, mL * 0.9)) : -out * rnd() * Math.min(8, mL * 0.25));
        to(X(side) + amp, y0 + span * i / n, [0, 1]);
        if (!last && rnd() < 0.35 && span / n > 160) loop(Math.min(36, 14 + rnd() * 26), side === 'L' ? 1 : -1);   // loop opens toward the page edge
      }
    };
    // ---- band gestures: each band gets its own character ----
    const exitTo = (xb, yb, h) => {                  // leave a gesture toward a margin: wide, gentle bend (the line may pass UNDER text)
      const dist = Math.hypot(xb - pen[0], yb - pen[1]), sx = xb > pen[0] ? 0.45 : -0.45;
      to(xb, yb, [sx, 1], dist * 0.32, Math.max(h * 0.6, dist * 0.34));
    };
    const GESTURES = ['S', 'ripple', 'curl', 'double', 'escape', 'spiral'];
    const band = (g, from, toSide, i) => {
      const pad = Math.min(24, g.h * 0.18), ya = g.t + pad, yb = g.b - pad, h = yb - ya, xb = X(toSide);
      ride(from, ya);
      const kind = h < 90 ? 'S' : (W < 700 ? pick(['S', 'ripple', 'escape']) : GESTURES[(i * 5 + Math.floor(rnd() * 3)) % GESTURES.length]);
      const ym = (ya + yb) / 2;
      if (kind === 'S') { const k = Math.max(h * 0.9, Math.abs(xb - pen[0]) * 0.32); to(xb, yb, [0, 1], k, k); return kind; }
      if (kind === 'escape') {                       // leaves the page and comes back lower, from the other edge or the same
        const off = rnd() < 0.5 ? W + 70 : -70;
        to(off, ym, [0, 1], h * 0.45, h * 0.3); to(xb, yb, [0, 1], h * 0.3, h * 0.45); return kind;
      }
      // the others travel across the middle of the band with horizontal tangents
      const dir = xb > pen[0] ? 1 : (xb < pen[0] ? -1 : (pen[0] < W / 2 ? 1 : -1));
      const xs = pen[0], span = xb - xs || dir * W * 0.6;
      const r = Math.min(42, h * 0.22);
      const lo = yb - r * 0.6, hi = ya + r * 2.4;     // keep loops inside the band
      if (kind === 'ripple') {
        const waves = 2 + Math.floor(rnd() * 3), amp = Math.min(h * 0.3, 60);
        to(xs + span * 0.12, ym, [dir, 0], h * 0.4, Math.abs(span) * 0.05);
        for (let w = 1; w <= waves; w++) to(xs + span * (0.12 + 0.76 * w / waves), ym + (w % 2 ? -amp : amp) * (0.6 + 0.4 * rnd()), [dir, 0]);
        exitTo(xb, yb, h); return kind;
      }
      const cx = W * (0.3 + rnd() * 0.4);
      to(cx, lo, [cx > pen[0] ? 1 : -1, 0], h * 0.5);
      const ls = tan[0] > 0 ? -1 : 1;                // circle above the line
      if (kind === 'curl') loop(r, ls);
      if (kind === 'double') { loop(r, ls); to(pen[0] + tan[0] * r * 3.2, lo - r * 0.2, tan); loop(r * 0.6, ls); }
      if (kind === 'spiral') { loop(Math.max(r, 34), ls); loop(Math.max(r, 34) * 0.72, ls); loop(Math.max(r, 34) * 0.52, ls); }
      exitTo(xb, yb, h);
      return kind;
    };
    // ---- 3) the opening stroke (Noah liked it): wave + curl under the buttons, hook back, underline the first door ----
    const ctaEl = $('.hero .ctas .btn') || $('.hero .btn') || $('.hero h1');
    const ctas = box(ctaEl.closest('.ctas') || ctaEl), cta = box(ctaEl);
    const g0 = gaps.find(g => g.t >= ctas.b - 2) || { t: ctas.b, b: ctas.b + 140, h: 140 };
    const y0 = g0.t + 14, y1 = g0.b - 14, bh = y1 - y0, yu = y0 + 6;
    const hiY = y0 + bh * 0.3, loY = y1 - bh * 0.12, r0 = Math.min(34, bh * 0.26);
    Mv(-20, loY, [1, 0]);
    [[W * 0.18, hiY], [W * 0.38, loY], [W * 0.58, hiY + bh * 0.1], [W * 0.78, loY]].forEach(([x, y]) => to(x, y, [1, 0]));
    loop(r0, -1);
    to(W * 0.6, yu, [-1, 0], W * 0.12, W * 0.12);
    to(cta.r + 16, yu, [-1, 0]); to(cta.l + 8, yu + 2, [-1, 0]);          // underline «Voir les métiers»
    to(mL, Math.max(y1, yu + 110), [0, 1], Math.max(42, (cta.l - mL) * 0.6), Math.max(50, bh * 0.5));
    let side = 'L';
    const heroD = d;
    // ---- 4) through the page ----
    const endEl = $('[data-guide-end]') || $('.form button') || [...document.querySelectorAll('main section:last-of-type .btn')].pop() || $('.giant');
    const bt = box(endEl), formGap = gaps.find(g => g.t >= bt.b - 4);
    const methEl = $('.process'); const meth = methEl ? box(methEl) : { t: -1, b: -1 };
    const body = gaps.filter(g => g.t > g0.t && g !== formGap);
    body.forEach((g, i) => {
      const nextT = (body[i + 1] || formGap || { t: 1e9 }).t;
      const mustL = g.b < meth.b && nextT > meth.t;   // the method cards slide through the right margin
      const o = mustL ? 'L' : (rnd() < 0.62 ? 'L' : 'R');   // mostly lands near the titles (left), not always
      band(g, side, o, i);
      side = o;
    });
    // ---- 5) arrival: a last flourish that underlines «Envoyer» ----
    const fy0 = formGap ? formGap.t + 14 : bt.b + 14;
    ride(side, fy0 - 56);
    const uy = fy0 + 4;
    if (side === 'R') { to(bt.r + 40, uy, [-1, 0], 70, 60); to(bt.l + 4, uy + 2, [-1, 0]); to(bt.l - 22, uy - 10, [-1, -0.7]); }
    else { to(bt.l + 70, uy, [1, 0], 56, 46); to(bt.r + 6, uy + 2, [1, 0]); to(bt.r + 30, uy - 10, [1, -0.7]); }
    gpath.setAttribute('d', heroD); const heroLen = gpath.getTotalLength();
    gpath.setAttribute('d', d);
    const L = gpath.getTotalLength(), S = [];
    for (let l = 0, ymax = -1e9; l <= L; l += 6) { const pt = gpath.getPointAtLength(l); ymax = Math.max(ymax, pt.y); S.push([l, ymax, pt.x, pt.y]); }
    G = { L, S, heroLen }; gpath.style.strokeDasharray = L; window.SCAR.tip = window.SCAR.tip || [S[0][2], S[0][3]];
    if (reduce) gCur = L;
  }
  function guideTick() {
    if (!G) return;
    const Y = scrollY + innerHeight * 0.6, S = G.S;
    let lo = 0, hi = S.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (S[m][1] <= Y) lo = m; else hi = m - 1; }
    const target = scrollY + innerHeight >= document.documentElement.scrollHeight - 4 ? G.L : Math.max(G.heroLen, S[lo][0]);
    if (Math.abs(target - gCur) < 0.5 && G.drawn === gCur) return;          // settled: no repaint
    gCur += (target - gCur) * (reduce ? 1 : (gCur < G.heroLen ? 0.035 : 0.09));   // slow, hand-drawn pace for the opening stroke
    if (Math.abs(target - gCur) < 0.5) gCur = target;
    G.drawn = gCur;
    gpath.style.strokeDashoffset = G.L - gCur;
    const k = Math.min(S.length - 1, Math.round(gCur / 6)); gtip.setAttribute('cx', S[k][2]); gtip.setAttribute('cy', S[k][3]); ghalo.setAttribute('cx', S[k][2]); ghalo.setAttribute('cy', S[k][3]); window.SCAR.tip = [S[k][2], S[k][3]];
  }
  let gT; const rebuild = () => { clearTimeout(gT); gT = setTimeout(buildGuide, 150); };
  addEventListener('resize', rebuild); addEventListener('load', rebuild);
  document.querySelectorAll('details').forEach(d => d.addEventListener('toggle', rebuild));
  if (document.fonts) document.fonts.ready.then(rebuild);
  buildGuide();

  /* ---------- loop ---------- */
  let last = 0;
  function frame(ts) {
    const t = ts / 1000;
    processTick(); chapTick(); guideTick();
    if (ts - last > 45) { // ~22fps breathing dots — feels like print, saves battery
      last = ts;
      halftones.forEach(h => h.breathe && h.vis && !reduce && paintHT(h, t));
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

/* ================= the live assistant (the product itself) ================= */
(() => {
  const ENDPOINT = 'https://scarsellato.app.n8n.cloud/webhook/support-bot-demo';
  const { T, QA } = window.SCAR;
  const root = document.getElementById('chat'); if (!root) return;
  const log = document.getElementById('chatLog'), ch = document.getElementById('chatChoices'), tg = document.getElementById('chatToggle'),
        pn = document.getElementById('chatPanel'), cl = document.getElementById('chatClose'), fm = document.getElementById('chatForm'),
        inp = document.getElementById('chatInput'), snd = document.getElementById('chatSend');
  const history = []; let busy = false, setSugg = () => {};
  const say = (role, text, cls) => { const p = document.createElement('p'); p.className = 'chat-msg ' + role + (cls ? ' ' + cls : ''); p.textContent = text; log.appendChild(p); log.scrollTop = log.scrollHeight; return p; };
  const ask = async (q, fallback) => {
    if (busy || !q) return; busy = true; snd.disabled = true; setSugg(false); say('user', q);
    const pending = say('bot', T['chat.typing'] || 'The assistant is writing…', 'pending'); let answer = null;
    try {
      const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 20000);
      const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctl.signal, body: JSON.stringify({ message: q, history: history.slice(-10) }) });
      clearTimeout(to); const j = await r.json(); if (j && typeof j.reply === 'string' && j.reply.trim()) answer = j.reply.trim();
    } catch (e) { /* offline understudy below */ }
    pending.remove(); if (!answer) answer = fallback || T['chat.offline']; say('bot', answer);
    history.push({ role: 'user', content: q }, { role: 'assistant', content: answer }); busy = false; snd.disabled = false;
  };
  (QA || []).forEach(([q, a]) => { const b = document.createElement('button'); b.className = 'chat-choice'; b.type = 'button'; b.textContent = q; b.onclick = () => ask(q, a); ch.appendChild(b); });
  if (ch.children.length) {
    const sw = document.createElement('button'); sw.className = 'chat-sugg-toggle'; sw.type = 'button'; sw.setAttribute('aria-controls', 'chatChoices');
    setSugg = o => { ch.classList.toggle('collapsed', !o); sw.setAttribute('aria-expanded', String(o)); sw.textContent = (T['chat.sugg'] || 'Suggested questions') + (o ? ' ▾' : ' ▸'); };
    sw.onclick = () => setSugg(ch.classList.contains('collapsed')); ch.parentNode.insertBefore(sw, ch); setSugg(true);
  }
  fm.addEventListener('submit', e => { e.preventDefault(); const q = inp.value.trim(); if (!q) return; inp.value = ''; ask(q, null); });
  const open = o => { pn.hidden = !o; tg.setAttribute('aria-expanded', String(o)); if (o) setTimeout(() => inp.focus(), 60); };
  tg.onclick = () => open(pn.hidden); cl.onclick = () => open(false);
  document.querySelectorAll('[data-ask]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); open(true); if (!history.length) ask(b.dataset.ask, null); }));
})();

/* ================= mobile menu ================= */
(() => {
  const b = document.querySelector('.nav-toggle'); if (!b) return;
  const set = o => { document.body.classList.toggle('nav-open', o); b.setAttribute('aria-expanded', String(o)); };
  b.addEventListener('click', () => set(!document.body.classList.contains('nav-open')));
  document.querySelectorAll('.nav ul a').forEach(a => a.addEventListener('click', () => set(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
})();
