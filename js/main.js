/* ============================================
   NEXUS GYM — MAIN JAVASCRIPT
   Global: Preloader, Navbar, Scroll, Back-Top
   ============================================ */

// ─── CINEMATIC PRELOADER ─────────────────────
function initCinematicPreloader() {
  const pre = document.getElementById('preloader');
  const canvas = document.getElementById('pl-canvas');
  const letters = document.querySelectorAll('.letter');
  const counter = document.getElementById('pl-counter');
  const scanWrap = document.querySelector('.pl-scan-wrap');
  const appWrapper = document.getElementById('app-wrapper');

  if (!pre || !canvas) return;

  // 1. Particle System (Tiny Particles Moving Slowly)
  const ctx = canvas.getContext('2d');
  let dots = [];
  const dotCount = 100;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  for (let i = 0; i < dotCount; i++) {
    dots.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3
    });
  }

  function animateDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(182, 255, 59, 0.3)';
    dots.forEach(d => {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
      if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(animateDots);
  }
  animateDots();

  // 2. Sequence Logic
  async function runSequence() {
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    // Phase 1: NEXUS letters appear one-by-one (Faster)
    await sleep(200);
    for (let i = 0; i < letters.length; i++) {
      letters[i].classList.add('reveal');
      await sleep(80);
    }

    // Phase 2: Loading percentage counts up (Much faster)
    await sleep(100);
    counter.classList.add('visible');
    let count = 0;
    const countInterval = setInterval(() => {
      count += Math.floor(Math.random() * 8) + 5;
      if (count >= 100) {
        count = 100;
        clearInterval(countInterval);
      }
      counter.textContent = count + '%';
    }, 20);

    // Phase 3: Neon line scans underneath
    await sleep(200);
    scanWrap.classList.add('visible');

    // Phase 4: Soft glow pulse
    await sleep(300);
    letters.forEach(l => l.classList.add('glow'));

    // Wait for percentage to finish
    while (count < 100) await sleep(10);

    // Phase 5: Fade out loader and sharpen website
    await sleep(200);
    pre.classList.add('done');
    appWrapper.classList.remove('is-blurred');
    document.body.classList.add('ready');

    // Phase 6: Hero section animates in
    await sleep(200);
    initScrollReveal();
    if (typeof window.initStagger === 'function') window.initStagger();
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 150);
    });
  }

  runSequence();
}
window.addEventListener('DOMContentLoaded', initCinematicPreloader);

// ─── SCROLL PROGRESS BAR ─────────────────────
const scrollBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  if (!scrollBar) return;
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  scrollBar.style.width = pct + '%';
}, { passive: true });

// ─── NAVBAR SCROLL EFFECT ────────────────────
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ─── HAMBURGER MENU ──────────────────────────
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
  });
});

// ─── ACTIVE NAV LINK ─────────────────────────
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href') || '';
  if (href === page || (page === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// ─── BACK TO TOP ─────────────────────────────
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  backTop?.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ─── SCROLL REVEAL ───────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

function initScrollReveal() {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    .forEach(el => revealObserver.observe(el));
}

// ─── ANIMATED COUNTERS ───────────────────────
function animateCounter(el) {
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = (target % 1 === 0 ? Math.floor(current) : current.toFixed(1)) + suffix;
  }, duration / steps);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ─── FAQ ACCORDION ───────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  const icon = item.querySelector('.faq-icon');
  q?.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      const ia = i.querySelector('.faq-a');
      const ii = i.querySelector('.faq-icon');
      if (ia) ia.style.maxHeight = '0';
      if (ii) ii.textContent = '+';
    });
    // Toggle clicked
    if (!isOpen) {
      item.classList.add('open');
      if (a) a.style.maxHeight = a.scrollHeight + 'px';
      if (icon) icon.textContent = '−';
    }
  });
});

// ─── PRICING TOGGLE ──────────────────────────
const pricingToggle = document.getElementById('pricing-toggle');
if (pricingToggle) {
  pricingToggle.addEventListener('change', () => {
    const isYearly = pricingToggle.checked;
    document.querySelectorAll('.price-m').forEach(el => {
      el.style.display = isYearly ? 'none' : 'flex';
    });
    document.querySelectorAll('.price-y').forEach(el => {
      el.style.display = isYearly ? 'flex' : 'none';
    });
    document.querySelector('.toggle-m')?.classList.toggle('active', !isYearly);
    document.querySelector('.toggle-y')?.classList.toggle('active', isYearly);
  });
}

// ─── BMI CALCULATOR ──────────────────────────
const bmiForm = document.getElementById('bmi-form');
if (bmiForm) {
  bmiForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const h = parseFloat(document.getElementById('bmi-h').value) / 100;
    const w = parseFloat(document.getElementById('bmi-w').value);
    if (!h || !w) return;
    const bmi = (w / (h * h)).toFixed(1);
    let cat = '', tip = '';
    if (bmi < 18.5) { cat = 'Underweight'; tip = 'Focus on muscle-building & nutrition programs.'; }
    else if (bmi < 25) { cat = 'Normal Weight'; tip = 'Maintain with our strength & conditioning plans.'; }
    else if (bmi < 30) { cat = 'Overweight'; tip = 'Our HIIT & fat-loss programs will get you there.'; }
    else { cat = 'Obese'; tip = 'Begin your transformation with personal coaching.'; }
    document.getElementById('bmi-result').innerHTML = `
      <div class="calc-result-num">${bmi}</div>
      <div class="calc-result-cat">${cat}</div>
      <p class="calc-result-tip">${tip}</p>`;
    document.getElementById('bmi-result').classList.add('visible');
  });
}

// ─── CALORIE CALCULATOR ──────────────────────
const calForm = document.getElementById('cal-form');
if (calForm) {
  calForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const age = +document.getElementById('cal-age').value;
    const gender = document.getElementById('cal-gender').value;
    const h = +document.getElementById('cal-h').value;
    const w = +document.getElementById('cal-w').value;
    const act = +document.getElementById('cal-act').value;
    let bmr = gender === 'male'
      ? 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * age)
      : 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * age);
    const tdee = Math.round(bmr * act);
    document.getElementById('cal-result').innerHTML = `
      <div class="calc-result-num">${tdee}</div>
      <div class="calc-result-cat">Calories / Day</div>
      <p class="calc-result-tip">Eat ${tdee - 500} kcal to lose weight, ${tdee + 300} kcal to gain muscle.</p>`;
    document.getElementById('cal-result').classList.add('visible');
  });
}

// ─── TYPING EFFECT ───────────────────────────
function initTyping(el) {
  if (!el) return;
  const words = JSON.parse(el.dataset.words || '[]');
  let wIdx = 0, cIdx = 0, deleting = false;
  const tick = () => {
    const word = words[wIdx];
    el.textContent = deleting ? word.slice(0, --cIdx) : word.slice(0, ++cIdx);
    let delay = deleting ? 50 : 100;
    if (!deleting && cIdx === word.length) { delay = 2000; deleting = true; }
    if (deleting && cIdx === 0) { deleting = false; wIdx = (wIdx + 1) % words.length; delay = 400; }
    setTimeout(tick, delay);
  };
  tick();
}
initTyping(document.querySelector('.typing-text'));

// ─── COUNTDOWN TIMER ─────────────────────────
function startCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;
  const end = new Date();
  end.setDate(end.getDate() + 3);
  end.setHours(23, 59, 59, 0);
  const update = () => {
    const now = new Date();
    const diff = end - now;
    if (diff <= 0) { el.innerHTML = '<span>Offer Expired</span>'; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, '0');
    el.innerHTML = `
      <div class="cd-unit"><span class="cd-num">${pad(d)}</span><span class="cd-label">Days</span></div>
      <div class="cd-sep">:</div>
      <div class="cd-unit"><span class="cd-num">${pad(h)}</span><span class="cd-label">Hours</span></div>
      <div class="cd-sep">:</div>
      <div class="cd-unit"><span class="cd-num">${pad(m)}</span><span class="cd-label">Mins</span></div>
      <div class="cd-sep">:</div>
      <div class="cd-unit"><span class="cd-num">${pad(s)}</span><span class="cd-label">Secs</span></div>`;
  };
  update();
  setInterval(update, 1000);
}
startCountdown();

// ─── TESTIMONIALS SLIDER ─────────────────────
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.t-dot');
let current = 0;
function goToSlide(n) {
  slides[current]?.classList.remove('active');
  dots[current]?.classList.remove('active');
  current = (n + slides.length) % slides.length;
  slides[current]?.classList.add('active');
  dots[current]?.classList.add('active');
}
document.querySelector('.t-prev')?.addEventListener('click', () => goToSlide(current - 1));
document.querySelector('.t-next')?.addEventListener('click', () => goToSlide(current + 1));
dots.forEach((d, i) => d.addEventListener('click', () => goToSlide(i)));
if (slides.length) { goToSlide(0); setInterval(() => goToSlide(current + 1), 5000); }

// ─── CONTACT FORM VALIDATION ─────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    contactForm.querySelectorAll('[required]').forEach(field => {
      const err = field.parentElement.querySelector('.field-err');
      if (!field.value.trim()) {
        valid = false;
        field.classList.add('error');
        if (err) err.style.display = 'block';
      } else {
        field.classList.remove('error');
        if (err) err.style.display = 'none';
      }
    });
    const emailEl = document.getElementById('c-email');
    if (emailEl && emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      valid = false;
      emailEl.classList.add('error');
      const err = emailEl.parentElement.querySelector('.field-err');
      if (err) { err.textContent = 'Enter a valid email.'; err.style.display = 'block'; }
    }
    if (valid) {
      const msg = document.getElementById('form-success');
      if (msg) { msg.style.display = 'block'; contactForm.reset(); }
    }
  });
}
