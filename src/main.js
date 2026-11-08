import './style.css';
import './categories-scroll.js';
import './products-carousel.js';
import './trust-section.js';
import './faq-section.js';
import './final-section.js';

const section = document.querySelector('.hero-scroll-section');
const sticky = document.querySelector('.hero-sticky');
const video = document.querySelector('#construction-video');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const lines = [...document.querySelectorAll('.headline-line')];
const details = document.querySelector('.hero-details');
const stages = [...document.querySelectorAll('[data-stage]')];
const counter = document.querySelector('#progress-value');
const cue = document.querySelector('.cue-label');
let distance = 1, top = 0, target = 0, displayed = 0, raf = 0, lastTick = 0;
let duration = 0, lastCount = -1, activeStage = -1;
const clamp = value => Math.max(0, Math.min(1, value));
const reveal = (progress, start, end) => {
  const x = clamp((progress - start) / (end - start));
  return x * x * (3 - 2 * x);
};

function measure() {
  top = section.getBoundingClientRect().top + scrollY;
  distance = Math.max(1, section.offsetHeight - sticky.offsetHeight);
  onScroll();
}
function requestTick() {
  if (!raf && !document.hidden) raf = requestAnimationFrame(tick);
}
function onScroll() {
  target = motion.matches ? 1 : clamp((scrollY - top) / distance);
  requestTick();
}
function render(progress) {
  const values = [0.16 + 0.84 * reveal(progress, .12, .28), reveal(progress, .4, .54), reveal(progress, .65, .79)];
  lines.forEach((line, i) => line.style.setProperty('--reveal', values[i].toFixed(4)));
  const detailReveal = reveal(progress, .85, .96);
  details.style.setProperty('--reveal', detailReveal.toFixed(4));
  // Hidden CTAs must not receive keyboard focus or pointer clicks.
  details.inert = detailReveal < .95;
  sticky.style.setProperty('--progress', progress.toFixed(4));
  const count = Math.round(progress * 100);
  if (count !== lastCount) {
    counter.textContent = String(count).padStart(2, '0');
    cue.textContent = count === 100 ? 'ROLE PARA REVER' : 'ROLE PARA CONSTRUIR';
    lastCount = count;
  }
  const stage = progress >= .96 ? 3 : progress >= .65 ? 2 : progress >= .35 ? 1 : 0;
  if (stage !== activeStage) {
    stages.forEach((button, i) => {
      button.classList.toggle('is-active', i === stage);
      if (i === stage) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    activeStage = stage;
  }
}
function tick(now) {
  raf = 0;
  const elapsed = lastTick ? Math.min(now - lastTick, 64) : 16;
  lastTick = now;
  // Time-based interpolation keeps the same easing on 60/120 Hz screens.
  displayed = motion.matches ? 1 : displayed + (target - displayed) * (1 - Math.exp(-elapsed / 110));
  const settled = Math.abs(target - displayed) < .0005;
  if (settled) displayed = target;
  render(displayed);
  // Only one seek at a time: repeated seeks while decoding can starve mobile video.
  // A 6-frame GOP in the supplied film's web copy makes backward seeks inexpensive.
  const endTime = Math.max(0, duration - 1 / 30);
  const desiredTime = displayed * endTime;
  if (duration && !motion.matches && !video.seeking && Math.abs(video.currentTime - desiredTime) > (settled ? .001 : .018)) {
    video.currentTime = desiredTime;
  }
  const videoPending = duration && !motion.matches && Math.abs(video.currentTime - target * endTime) > .025;
  if (!settled || videoPending || video.seeking) requestTick();
  else lastTick = 0;
}
function initializeVideo() {
  duration = Number.isFinite(video.duration) ? video.duration : 0;
  video.pause();
  requestTick();
}
video.addEventListener('loadedmetadata', initializeVideo);
// Cached media may finish loading metadata before the module is evaluated.
if (video.readyState >= 1) initializeVideo();
video.addEventListener('seeked', requestTick);
video.addEventListener('loadeddata', requestTick);
video.addEventListener('error', () => {
  video.style.opacity = '0';
  document.querySelector('.hero-media').style.background = "url('/images/construction-final.jpg') center / cover";
  document.querySelector('.video-status').textContent = 'O vídeo não carregou. Recarregue para explorar a construção.';
  duration = 0;
});
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', measure, { passive: true });
new ResizeObserver(measure).observe(sticky);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { cancelAnimationFrame(raf); raf = 0; lastTick = 0; }
  else onScroll();
});
motion.addEventListener('change', () => { details.inert = false; measure(); });
stages.forEach(button => button.addEventListener('click', () => {
  if (!motion.matches) scrollTo({ top: top + Number(button.dataset.stage) * distance, behavior: 'smooth' });
}));
document.querySelector('.scroll-cue').addEventListener('click', () => {
  scrollTo({ top: top + (target > .98 ? 0 : Math.min(1, target + .25)) * distance, behavior: motion.matches ? 'instant' : 'smooth' });
});

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
function closeMenu() { mobileNav.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Abrir menu'); }
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') !== 'true';
  mobileNav.hidden = !expanded;
  menuToggle.setAttribute('aria-expanded', String(expanded));
  menuToggle.setAttribute('aria-label', expanded ? 'Fechar menu' : 'Abrir menu');
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
mobileNav.querySelector('a').addEventListener('click', closeMenu);
matchMedia('(min-width: 851px)').addEventListener('change', closeMenu);

// This is deliberately a hero-only demo. No invented catalog or WhatsApp number.
const dialog = document.querySelector('.demo-dialog');
document.querySelectorAll('[data-demo]').forEach(button => button.addEventListener('click', () => {
  closeMenu();
  const topic = button.dataset.demo;
  document.querySelector('#dialog-title').textContent = topic === 'WhatsApp' ? 'Vamos conversar sobre sua obra.' : topic === 'Orçamento' ? 'Sua próxima obra começa aqui.' : topic;
  document.querySelector('#dialog-message').textContent = topic === 'WhatsApp' || topic === 'Orçamento' || topic === 'Contato'
    ? 'Este é um projeto de demonstração. O atendimento e os pedidos de orçamento serão conectados quando o contato da loja for definido.'
    : 'Esta demonstração apresenta a primeira experiência da loja. Esta área será desenvolvida na próxima etapa do projeto.';
  dialog.showModal();
}));
document.querySelectorAll('.dialog-close,.dialog-return').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
measure();
