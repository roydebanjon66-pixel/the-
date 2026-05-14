/* ============================================
   NEXUS GYM — PREMIUM SERVICES INTERACTIVE
   3D Tilt · Cursor Orb · Magnetic Light
   ============================================ */

'use strict';

(function initPremiumServices() {
  const grid = document.querySelector('.premium-grid');
  const cards = document.querySelectorAll('.p-card');
  const orb = document.getElementById('cursor-orb');

  if (!grid) return;

  // 1. CURSOR ORB FOLLOW
  window.addEventListener('mousemove', e => {
    if (orb) {
      orb.style.display = 'block';
      // Smooth interpolation handled by CSS transition
      orb.style.left = e.clientX + 'px';
      orb.style.top = e.clientY + 'px';
    }

    // 2. CARD MOUSE TRACKING (For radial light effect)
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });

  // 3. 3D TILT EFFECT
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
  });

  // 4. BORDER TRACING ANGLE (Optional enhancement)
  let angle = 0;
  function animateTracing() {
    angle = (angle + 2) % 360;
    cards.forEach(card => {
      card.style.setProperty('--angle', `${angle}deg`);
    });
    requestAnimationFrame(animateTracing);
  }
  animateTracing();

})();
