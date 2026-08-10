/* ============================================================
   SCARSELLATO — SHELL partagé (pages département)
   Fournit : moteur i18n (chaînes communes + dictionnaire de page),
   horloge, preloader, curseur, poussière, boutons magnétiques,
   révélations au scroll, et l'ASSISTANT EN DIRECT (le produit).
   Chaque page définit AVANT ce script :
     window.PAGE_I18N = { fr:{t:{},qa:[[q,a]…]}, en:{…}, de:{…} }
   Vanilla only, zéro dépendance.
   ============================================================ */
(() => {
  'use strict';
  const ENDPOINT = 'https://scarsellato.app.n8n.cloud/webhook/support-bot-demo';

  /* ---------- chaînes communes à toutes les pages ---------- */
  const SHARED = {
    fr: {
      days: ['DIMANCHE','LUNDI','MARDI','MERCREDI','JEUDI','VENDREDI','SAMEDI'],
      months: ['JANVIER','FÉVRIER','MARS','AVRIL','MAI','JUIN','JUILLET','AOÛT','SEPTEMBRE','OCTOBRE','NOVEMBRE','DÉCEMBRE'],
      t: {} /* le FR est la source inline */
    },
    en: {
      days: ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'],
      months: ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'],
      t: {
        'nav.home': 'Home', 'nav.metiers': 'Crafts', 'nav.atelier': 'Atelier', 'nav.contact': 'Contact',
        'cta.talk': 'Start a project',
        'form.name': 'YOUR NAME', 'form.email': 'YOUR E-MAIL', 'form.msg': 'TELL US ABOUT YOUR SITUATION…', 'form.send': 'Send',
        'foot': 'SCARSELLATO — THE DIGITAL ATELIER · LUXEMBOURG · © 2026 · NO COOKIES, NO TRACKERS',
        'chat.toggleAria': 'A question? Open the assistant', 'chat.panelAria': 'Atelier assistant',
        'chat.head': '( ASSISTANT — LIVE )', 'chat.closeAria': 'Close',
        'chat.greet': 'Hello! I answer live, only from the atelier’s own information — I never guess. Ask your question, or start with one of these:',
        'chat.ph': 'WRITE YOUR QUESTION…', 'chat.sendAria': 'Send',
        'chat.sugg': 'Suggested questions',
        'chat.note': 'Your messages are used only to answer you. 0 cookies, 0 trackers.',
        'chat.typing': 'The assistant is writing…',
        'chat.offline': 'The assistant is not answering right now — write to noah@scarsellato.com, same-day reply.'
      }
    },
    de: {
      days: ['SONNTAG','MONTAG','DIENSTAG','MITTWOCH','DONNERSTAG','FREITAG','SAMSTAG'],
      months: ['JANUAR','FEBRUAR','MÄRZ','APRIL','MAI','JUNI','JULI','AUGUST','SEPTEMBER','OKTOBER','NOVEMBER','DEZEMBER'],
      t: {
        'nav.home': 'Start', 'nav.metiers': 'Gewerke', 'nav.atelier': 'Atelier', 'nav.contact': 'Kontakt',
        'cta.talk': 'Projekt besprechen',
        'form.name': 'IHR NAME', 'form.email': 'IHRE E-MAIL', 'form.msg': 'ERZÄHLEN SIE UNS VON IHRER SITUATION…', 'form.send': 'Senden',
        'foot': 'SCARSELLATO — DAS DIGITALE ATELIER · LUXEMBURG · © 2026 · OHNE COOKIES, OHNE TRACKER',
        'chat.toggleAria': 'Eine Frage? Assistent öffnen', 'chat.panelAria': 'Atelier-Assistent',
        'chat.head': '( ASSISTENT — LIVE )', 'chat.closeAria': 'Schließen',
        'chat.greet': 'Guten Tag! Ich antworte live, ausschließlich aus den Informationen des Ateliers — ich rate nie. Stellen Sie Ihre Frage, oder beginnen Sie mit einer davon:',
        'chat.ph': 'SCHREIBEN SIE IHRE FRAGE…', 'chat.sendAria': 'Senden',
        'chat.sugg': 'Fragevorschläge',
        'chat.note': 'Ihre Nachrichten dienen nur dazu, Ihnen zu antworten. 0 Cookies, 0 Tracker.',
        'chat.typing': 'Der Assistent schreibt…',
        'chat.offline': 'Der Assistent antwortet gerade nicht — schreiben Sie an noah@scarsellato.com, Antwort am selben Tag.'
      }
    }
  };

  /* ---------- langue ---------- */
  const PAGE = window.PAGE_I18N || { fr: { t: {}, qa: [] }, en: { t: {}, qa: [] }, de: { t: {}, qa: [] } };
  let stored = null;
  try { stored = localStorage.getItem('scar-lang'); } catch (e) {}
  let LANG = (new URLSearchParams(location.search).get('lang') || stored || (navigator.language || 'fr').slice(0, 2)).toLowerCase();
  if (!SHARED[LANG]) LANG = 'fr';
  const D = {
    days: SHARED[LANG].days,
    months: SHARED[LANG].months,
    t: Object.assign({}, SHARED[LANG].t, (PAGE[LANG] || {}).t || {}),
    qa: (PAGE[LANG] || {}).qa || (PAGE.fr || {}).qa || []
  };

  const applyI18n = (scope = document) => {
    document.documentElement.lang = LANG;
    // document.title est du TEXTE BRUT : une entité HTML (&amp;) s'y afficherait
    // littéralement dans l'onglet. On la décode avant d'assigner.
    if (D.t['meta.title']) {
      const tmp = document.createElement('textarea');
      tmp.innerHTML = D.t['meta.title'];
      document.title = tmp.value;
    }
    const md = document.querySelector('meta[name="description"]');
    if (md && D.t['meta.desc']) md.setAttribute('content', D.t['meta.desc']);
    scope.querySelectorAll('[data-i18n]').forEach(el => { const s = D.t[el.dataset.i18n]; if (s != null) el.innerHTML = s; });
    scope.querySelectorAll('[data-i18n-ph]').forEach(el => { const s = D.t[el.dataset.i18nPh]; if (s != null) el.placeholder = s; });
    scope.querySelectorAll('[data-i18n-aria]').forEach(el => { const s = D.t[el.dataset.i18nAria]; if (s != null) el.setAttribute('aria-label', s); });
    document.querySelectorAll('#langSwitch [data-lang]').forEach(b => b.setAttribute('aria-current', String(b.dataset.lang === LANG)));
  };
  applyI18n();
  document.querySelectorAll('#langSwitch [data-lang]').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.lang === LANG) return;
    try { localStorage.setItem('scar-lang', b.dataset.lang); } catch (e) {}
    const u = new URL(location.href); u.searchParams.set('lang', b.dataset.lang);
    location.replace(u.href);
  }));

  document.documentElement.classList.add('js');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp01 = v => Math.max(0, Math.min(1, v));

  /* ---------- horloge ---------- */
  const liveLine = document.getElementById('liveLine');
  if (liveLine) {
    const tick = () => {
      const d = new Date(), p = n => String(n).padStart(2, '0');
      liveLine.textContent = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())} [LUX] — ${D.days[d.getDay()]} ${d.getDate()} ${D.months[d.getMonth()]} ${d.getFullYear()}`;
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---------- preloader ---------- */
  const loader = document.getElementById('loader');
  if (loader) {
    if (reduced) { loader.remove(); document.documentElement.classList.add('ready'); }
    else {
      const cnt = document.getElementById('loaderCount'), bar = document.getElementById('loaderBar');
      const t0 = performance.now(), DUR = 1100;
      let finished = false;
      const finish = () => {
        if (finished) return; finished = true;
        if (cnt) cnt.textContent = '100';
        if (bar) bar.style.transform = 'scaleX(1)';
        loader.classList.add('done');
        document.documentElement.classList.add('ready');
        setTimeout(() => loader.remove(), 1300);
      };
      const step = now => {
        if (finished) return;
        const p = clamp01((now - t0) / DUR);
        if (cnt) cnt.textContent = String(Math.floor(p * 100)).padStart(2, '0');
        if (bar) bar.style.transform = `scaleX(${p})`;
        if (p < 1) requestAnimationFrame(step); else finish();
      };
      requestAnimationFrame(step);
      setTimeout(finish, DUR + 500); // filet : rAF gelé en onglet d'arrière-plan (leçon 07-26)
    }
  }

  /* ---------- révélations : .reveal -> .in ----------
     FILET DE SÉCURITÉ obligatoire : les éléments partent à opacity 0.
     Si l'observateur ne tire jamais (viewport dégénéré, onglet caché), tout
     se montre après 2,5 s — une section invisible est pire qu'une section non animée. */
  const revealables = [...document.querySelectorAll('.reveal')];
  if (revealables.length) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.15 });
    revealables.forEach(el => io.observe(el));
    setTimeout(() => revealables.forEach(el => el.classList.add('in')), 2500);
  }

  /* ---------- rail de progression + skew de vélocité ---------- */
  const rail = document.querySelector('.progress-rail');
  if (!reduced) {
    let lastY = scrollY, rawV = 0, skew = 0, ticking = false;
    const update = () => {
      ticking = false;
      const y = scrollY;
      rawV = y - lastY; lastY = y;
      if (rail) rail.style.transform = `scaleX(${clamp01(y / Math.max(1, document.documentElement.scrollHeight - innerHeight))})`;
      document.querySelectorAll('[data-parallax]').forEach(el => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translateY(${(r.top * -0.06).toFixed(1)}px) scale(1.06)`;
      });
      if (typeof window.onShellScroll === 'function') window.onShellScroll(y, innerHeight);
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });

    /* curseur + poussière */
    const ring = document.createElement('div'); ring.className = 'cursor-ring';
    const dot = document.createElement('div'); dot.className = 'cursor-dot';
    document.body.append(ring, dot);
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('pointermove', ev => {
      if (ev.pointerType && ev.pointerType !== 'mouse') return;
      mx = ev.clientX; my = ev.clientY;
      dot.style.transform = `translate(${ev.clientX}px, ${ev.clientY}px)`;
      ring.classList.add('on'); dot.classList.add('on');
      ring.classList.toggle('hot', !!(ev.target.closest && ev.target.closest('a, button, input, textarea')));
    }, { passive: true });

    const dustC = document.getElementById('dust');
    let P = [], W = 0, H = 0, DPR = Math.min(devicePixelRatio || 1, 2), ctx = null;
    if (dustC) {
      ctx = dustC.getContext('2d');
      const fit = () => {
        W = dustC.width = Math.floor(innerWidth * DPR); H = dustC.height = Math.floor(innerHeight * DPR);
        dustC.style.width = innerWidth + 'px'; dustC.style.height = innerHeight + 'px';
      };
      fit(); addEventListener('resize', fit);
      const N = matchMedia('(pointer: coarse)').matches ? 220 : 620;
      P = Array.from({ length: N }, () => ({
        x: Math.random() * innerWidth * DPR, y: Math.random() * innerHeight * DPR,
        vx: 0, vy: 0, s: (0.4 + Math.random() * 1.2) * DPR, a: 0.1 + Math.random() * 0.4
      }));
    }

    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx.toFixed(1)}px, ${ry.toFixed(1)}px)`;
      skew += (Math.max(-5, Math.min(5, rawV * 0.045)) - skew) * 0.1; rawV *= 0.85;
      document.documentElement.style.setProperty('--vskew', skew.toFixed(2) + 'deg');
      if (ctx) {
        ctx.clearRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'lighter';
        const mxD = rx * DPR, myD = ry * DPR;
        for (const p of P) {
          p.vx += (Math.random() - 0.5) * 0.05 * DPR;
          p.vy += (Math.random() - 0.5) * 0.05 * DPR;
          const dx = p.x - mxD, dy = p.y - myD, d2 = dx * dx + dy * dy, R = 140 * DPR;
          if (d2 < R * R && d2 > 1) {
            const dd = Math.sqrt(d2), f = (1 - dd / R) * 0.45 * DPR;
            p.vx += (dx / dd) * f + (-dy / dd) * f * 0.7;
            p.vy += (dy / dd) * f + (dx / dd) * f * 0.7;
          }
          p.vx *= 0.96; p.vy *= 0.96; p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x += W; if (p.x > W) p.x -= W;
          if (p.y < 0) p.y += H; if (p.y > H) p.y -= H;
          ctx.globalAlpha = p.a; ctx.fillStyle = 'rgb(198 165 108)';
          ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.2832); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      requestAnimationFrame(loop);
    })();
    update();

    document.querySelectorAll('.magnetic').forEach(b => {
      b.addEventListener('pointermove', ev => {
        if (ev.pointerType && ev.pointerType !== 'mouse') return;
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(ev.clientX - r.left - r.width / 2) * 0.22}px, ${(ev.clientY - r.top - r.height / 2) * 0.22}px)`;
      });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });

    document.querySelectorAll('video.vid').forEach(v => {
      v.muted = true;
      v.play().then(() => v.classList.add('on')).catch(() => {});
    });
  }

  /* ---------- L'ASSISTANT — le produit, en direct sur chaque page ----------
     Les réponses préenregistrées de la page servent de DOUBLURE hors-ligne :
     réseau muet, la page répond quand même. */
  const chatRoot = document.getElementById('chat');
  if (chatRoot) {
    applyI18n(chatRoot);
    const log = document.getElementById('chatLog'), ch = document.getElementById('chatChoices'),
          tg = document.getElementById('chatToggle'), pn = document.getElementById('chatPanel'),
          cl = document.getElementById('chatClose'), fm = document.getElementById('chatForm'),
          inp = document.getElementById('chatInput'), snd = document.getElementById('chatSend');
    const history = [];
    let busy = false;

    /* Les suggestions se replient : visibles à l'ouverture (porte d'entrée),
       repliées dès la première question — sinon elles mangent le journal. */
    let setSugg = () => {};

    const say = (role, text, cls) => {
      const p = document.createElement('p');
      p.className = 'chat-msg ' + role + (cls ? ' ' + cls : '');
      p.textContent = text;
      log.appendChild(p); log.scrollTop = log.scrollHeight;
      return p;
    };

    const ask = async (question, fallback) => {
      if (busy || !question) return;
      busy = true; snd.disabled = true;
      setSugg(false);
      say('user', question);
      const pending = say('bot', D.t['chat.typing'] || 'L’assistant écrit…', 'pending');
      let answer = null;
      try {
        const ctl = new AbortController();
        const to = setTimeout(() => ctl.abort(), 20000);
        const r = await fetch(ENDPOINT, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctl.signal,
          body: JSON.stringify({ message: question, history: history.slice(-10) })
        });
        clearTimeout(to);
        const j = await r.json();
        if (j && typeof j.reply === 'string' && j.reply.trim()) answer = j.reply.trim();
      } catch (e) { /* doublure */ }
      pending.remove();
      if (!answer) answer = fallback || D.t['chat.offline'] || "L’assistant ne répond pas à l’instant — écrivez-nous à noah@scarsellato.com.";
      say('bot', answer);
      history.push({ role: 'user', content: question }, { role: 'assistant', content: answer });
      busy = false; snd.disabled = false;
    };

    (D.qa || []).forEach(([q, a]) => {
      const b = document.createElement('button');
      b.className = 'chat-choice'; b.type = 'button'; b.textContent = q;
      b.onclick = () => ask(q, a);
      ch.appendChild(b);
    });
    if (ch.children.length) {
      const sw = document.createElement('button');
      sw.className = 'chat-sugg-toggle'; sw.type = 'button';
      sw.setAttribute('aria-controls', 'chatChoices');
      setSugg = open => {
        ch.classList.toggle('collapsed', !open);
        sw.setAttribute('aria-expanded', String(open));
        sw.textContent = (D.t['chat.sugg'] || 'Questions suggérées') + (open ? ' ▾' : ' ▸');
      };
      sw.onclick = () => setSugg(ch.classList.contains('collapsed'));
      ch.parentNode.insertBefore(sw, ch);
      setSugg(true);
    }
    fm.addEventListener('submit', ev => {
      ev.preventDefault();
      const q = inp.value.trim();
      if (!q) return;
      inp.value = '';
      ask(q, null);
    });
    const tp = o => { pn.hidden = !o; tg.setAttribute('aria-expanded', String(o)); if (o) setTimeout(() => inp.focus(), 60); };
    tg.onclick = () => tp(pn.hidden); cl.onclick = () => tp(false);

    // n'importe quel [data-ask] ouvre l'assistant et lui pose SA question
    document.querySelectorAll('[data-ask]').forEach(btn => btn.addEventListener('click', () => {
      tp(true);
      if (!history.length) ask(btn.dataset.ask, null);
    }));
    window.scarAsk = (q) => { tp(true); ask(q, null); };
  }
})();
