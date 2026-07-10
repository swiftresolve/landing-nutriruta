// NutriRuta landing — interacciones mínimas, sin dependencias.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Selector de tema claro/oscuro ---
// El <head> ya aplicó data-theme antes del primer pintado (evita parpadeo);
// aquí solo conectamos el botón y guardamos la preferencia del visitante.
const THEME_KEY = 'nutriruta-theme';
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  const labelFor = (theme) => (theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  themeToggle.setAttribute('aria-label', labelFor(document.documentElement.getAttribute('data-theme')));
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    themeToggle.setAttribute('aria-label', labelFor(next));
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* modo privado: sin persistencia */ }
  });
}

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

// --- Meta Pixel: eventos clave del embudo (además del PageView del <head>) ---
// "Lead" = quiso empezar la app gratis; "InitiateCheckout" = fue al checkout de Hotmart.
// El evento de Compra real lo manda Hotmart directo por su integración con Conversions API.
if (typeof fbq === 'function') {
  document.querySelectorAll('a[href*="nutriruta.app"]').forEach((a) => {
    a.addEventListener('click', () => fbq('track', 'Lead'));
  });
  document.querySelectorAll('a[href*="pay.hotmart.com"]').forEach((a) => {
    const esAnual = a.href.includes('ti1e49b3');
    a.addEventListener('click', () => fbq('track', 'InitiateCheckout', {
      value: esAnual ? 90 : 9,
      currency: 'USD'
    }));
  });
}
