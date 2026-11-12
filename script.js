// Abstract toggles
document.querySelectorAll('.toggle[aria-controls]').forEach((btn) => {
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
    const text = document.getElementById(btn.dataset.bib).textContent;
    try {
      await navigator.clipboard.writeText(text);
      say('BibTeX copied');
    } catch {
      say('Copy blocked by the browser. Select the text manually.');
    }
  });
});

// Margin-note markers: highlight the note on wide screens, reveal it on narrow ones
document.querySelectorAll('.ref').forEach((ref) => {
  const note = document.getElementById(ref.getAttribute('aria-controls'));
  const narrow = () => window.matchMedia('(max-width: 68rem)').matches;
  ref.addEventListener('mouseenter', () => note.classList.add('is-lit'));
  ref.addEventListener('mouseleave', () => note.classList.remove('is-lit'));
  ref.addEventListener('click', () => {
    if (!narrow()) return;
    const open = note.classList.toggle('open');
    ref.setAttribute('aria-expanded', String(open));
  });
});

// Mark the section in view
const links = [...document.querySelectorAll('.toc ul a')];
const byId = new Map(links.map((a) => [a.hash.slice(1), a]));
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a) => a.removeAttribute('aria-current'));
    byId.get(e.target.id)?.setAttribute('aria-current', 'true');
  });
}, { rootMargin: '-35% 0px -60% 0px' });
byId.forEach((_, id) => observer.observe(document.getElementById(id)));
