const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Abstract toggles
document.querySelectorAll('[aria-controls^="abs-"]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    panel.hidden = open;
    btn.textContent = open ? 'Show abstract' : 'Hide abstract';
  });
});

// Copy BibTeX
const toast = document.querySelector('.toast');
let toastTimer;
function say(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}
document.querySelectorAll('.copy').forEach((btn) => {
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(document.getElementById(btn.dataset.bib).textContent);
      say('BibTeX copied');
    } catch {
      say('Your browser blocked copying. Try again from a secure page.');
    }
  });
});

// Statement: words fill from grey to ink as the section scrolls through view
const fill = document.querySelector('.fill');
if (fill) {
  const words = fill.textContent.trim().split(/\s+/);
  fill.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(' ');
  const spans = [...fill.querySelectorAll('.w')];
  if (reduceMotion) {
    spans.forEach((s) => s.classList.add('on'));
  } else {
    const update = () => {
      const r = fill.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the paragraph's top reaches 85% of the viewport, 1 when its bottom reaches 45%
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.4)));
      const n = Math.round(p * spans.length);
      spans.forEach((s, i) => s.classList.toggle('on', i < n));
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
}

// Sticky bar appears after the hero; mark the section in view
const bar = document.querySelector('.bar');
const hero = document.querySelector('.hero');
new IntersectionObserver(([e]) => bar.classList.toggle('show', !e.isIntersecting), { threshold: 0.05 }).observe(hero);

const links = [...bar.querySelectorAll('ul a')];
const byId = new Map(links.map((a) => [a.hash.slice(1), a]));
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a) => a.removeAttribute('aria-current'));
    byId.get(e.target.id)?.setAttribute('aria-current', 'true');
  });
}, { rootMargin: '-30% 0px -65% 0px' });
byId.forEach((_, id) => spy.observe(document.getElementById(id)));
