/* ============================================
   NEXUS GYM — ANIMATION ENGINE
   Custom Cursor · Parallax · Magnetic · Tilt
   Stagger · Image Reveal · Text Scramble
   ============================================ */

'use strict';

// ─── HELPERS ─────────────────────────────────
const q  = (s, p = document) => p.querySelector(s);
const qa = (s, p = document) => [...p.querySelectorAll(s)];
const lerp = (a, b, t) => a + (b - a) * t;

/* ─── 1. CUSTOM CURSOR ───────────────────── */
(function initCursor() {
  // Don't show on touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  // Smooth ring follow
  (function animRing() {
    rx = lerp(rx, mx, 0.12);
    ry = lerp(ry, my, 0.12);
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  // Expand on interactive elements
  const hoverEls = 'a, button, .prog-card, .svc-card, .trainer-card, .pp-card, .price-card, .glass-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverEls)) {
      dot.classList.add('expanded');
      ring.classList.add('expanded');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverEls)) {
      dot.classList.remove('expanded');
      ring.classList.remove('expanded');
    }
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
})();

/* ─── 2. HERO PARALLAX ───────────────────── */
(function initParallax() {
  const hero    = q('.hero');
  const heroBg  = q('.hero-bg');
  const heroImg = q('.hero-img-wrap img');

  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const rate     = scrolled * 0.3;
    const rateImg  = scrolled * 0.15;

    if (heroBg)  heroBg.style.transform  = `translateY(${rate}px)`;
    if (heroImg) heroImg.style.transform  = `translateY(${rateImg}px) scale(1.05)`;
  }, { passive: true });
})();

/* ─── 3. MAGNETIC BUTTONS ───────────────── */
(function initMagnetic() {
  qa('.btn-lime, .btn-outline, .nav-cta, .p-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width  / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      btn.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

/* ─── 4. 3D TILT CARDS ───────────────────── */
(function initTilt() {
  qa('.tilt-card, .prog-card').forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.style.transition = 'transform 0.1s ease';

    card.addEventListener('mousemove', e => {
      const r   = card.getBoundingClientRect();
      const x   = e.clientX - r.left;
      const y   = e.clientY - r.top;
      const cx  = r.width  / 2;
      const cy  = r.height / 2;
      const rx  = ((y - cy) / cy) * -8;
      const ry  = ((x - cx) / cx) *  8;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });
})();

/* ─── 5. STAGGER GRID OBSERVER ──────────── */
(function initStagger() {
  const staggerObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        staggerObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  qa('.stagger-children').forEach(el => staggerObs.observe(el));
})();

// Export for main.js to call after preloader
window.initStagger = function() {
  qa('.stagger-children').forEach(el => {
    el.classList.add('ready-to-stagger');
  });
};

/* ─── 6. IMAGE WIPE REVEAL ───────────────── */
(function initImgReveal() {
  const imgObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        imgObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  qa('.img-reveal').forEach(el => imgObs.observe(el));
})();

/* ─── 7. TEXT SCRAMBLE (Section Titles) ─── */
class TextScramble {
  constructor(el) {
    this.el    = el;
    this.orig  = el.textContent;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#';
    this.frame = 0;
    this.queue = [];
  }
  scramble() {
    const len  = this.orig.length;
    this.queue = [...this.orig].map((char, i) => ({
      from:  char === ' ' ? ' ' : this._rand(),
      to:    char,
      start: Math.floor(Math.random() * 8),
      end:   Math.floor(Math.random() * 8) + i * 1.5,
      char:  ''
    }));
    cancelAnimationFrame(this._raf);
    this._update();
  }
  _update() {
    let output = '';
    let done   = 0;
    this.queue.forEach((item, i) => {
      if (this.frame >= item.end) {
        done++;
        output += item.to;
      } else if (this.frame >= item.start) {
        output += `<span style="color:var(--lime);opacity:0.6">${this._rand()}</span>`;
      } else {
        output += item.from;
      }
    });
    this.el.innerHTML = output;
    this.frame++;
    if (done < this.queue.length) {
      this._raf = requestAnimationFrame(() => this._update());
    } else {
      this.el.textContent = this.orig; // restore for clean DOM
    }
  }
  _rand() { return this.chars[Math.floor(Math.random() * this.chars.length)]; }
}

(function initScramble() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const scrambler = new TextScramble(e.target);
        scrambler.scramble();
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.8 });

  // Apply scramble to section tags only (smaller text, faster effect)
  qa('.section-tag').forEach(el => obs.observe(el));
})();

/* ─── 8. LINE GROW OBSERVER ─────────────── */
(function initLineGrow() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 1 });
  qa('.line-grow').forEach(el => obs.observe(el));
})();

/* ─── 9. SMOOTH SCROLL PROGRESS ─────────── */
(function initSmoothProgress() {
  // Enhanced scroll listener with rAF throttle
  let ticking = false;
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        bar.style.width = Math.min(pct, 100) + '%';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ─── 10. SECTION ENTRANCE GLOW ─────────── */
(function initSectionGlow() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
      } else {
        e.target.classList.remove('in-view');
      }
    });
  }, { threshold: 0.3 });
  qa('section').forEach(s => obs.observe(s));
})();

/* ─── 11. LOGO MARK HOVER ROTATION ──────── */
qa('.logo-svg-mark').forEach(mark => {
  const parent = mark.closest('.nav-logo') || mark.closest('a');
  parent?.addEventListener('mouseenter', () => {
    mark.style.transform = 'rotate(30deg) scale(1.15)';
  });
  parent?.addEventListener('mouseleave', () => {
    mark.style.transform = '';
  });
});

/* ─── 12. STAT STRIP COUNTER ANIMATION ──── */
// Enhanced counter with spring easing
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
function animateCounterSmooth(el) {
  const target   = +el.dataset.count;
  const suffix   = el.dataset.suffix || '';
  const duration = 2200;
  const start    = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased   = easeOutExpo(progress);
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounterSmooth(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
qa('[data-count]').forEach(el => counterObs.observe(el));

/* ─── 13. CARD HOVER GLOW SHADOW ────────── */
qa('.prog-card, .svc-card, .pp-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = '0 30px 80px rgba(0,0,0,0.7), 0 0 40px rgba(182,255,59,0.08)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});

/* ─── 14. PAGE TRANSITION FADE ───────────── */
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('tel') || href.startsWith('mailto')) return;
  link.addEventListener('click', e => {
    e.preventDefault();
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.35s ease';
    setTimeout(() => { window.location.href = href; }, 360);
  });
});

// Page transitions handled by individual logic or preloader
