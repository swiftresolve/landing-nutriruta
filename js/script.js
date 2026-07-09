// NutriRuta landing — interacciones mínimas, sin dependencias.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Revelado suave al hacer scroll ---
const revealTargets = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealTargets.forEach((el) => el.classList.add('in'));
} else {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealTargets.forEach((el) => io.observe(el));
}

// --- Línea de la Misión 12 semanas: se llena al entrar en vista ---
const timelineFill = document.getElementById('timelineFill');
if (timelineFill) {
  const missionSection = document.querySelector('.mission');
  const fillIO = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        requestAnimationFrame(() => { timelineFill.style.width = '100%'; });
        fillIO.disconnect();
      }
    }
  }, { threshold: 0.3 });
  if (missionSection) fillIO.observe(missionSection);
}

// --- FAQ acordeón ---
document.querySelectorAll('.faq-item').forEach((item) => {
  const btn = item.querySelector('.faq-q');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');
    document.querySelectorAll('.faq-item.is-open').forEach((open) => {
      if (open !== item) {
        open.classList.remove('is-open');
        open.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      }
    });
    item.classList.toggle('is-open', !isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
});

// --- CTA fija en móvil: aparece después del hero ---
const stickyCta = document.getElementById('stickyCta');
const hero = document.querySelector('.hero');
if (stickyCta && hero && 'IntersectionObserver' in window) {
  const stickyIO = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      stickyCta.classList.toggle('is-visible', !entry.isIntersecting);
    }
  }, { threshold: 0 });
  stickyIO.observe(hero);
}
