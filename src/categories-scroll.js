import './categories.css';

const section = document.querySelector('.categories-scroll');
const sticky = section.querySelector('.categories-sticky');
const viewport = section.querySelector('.categories-viewport');
const track = section.querySelector('.categories-track');
const cards = [...track.querySelectorAll('.category-card')];
const previous = section.querySelector('.category-prev');
const next = section.querySelector('.category-next');
const count = section.querySelector('#category-current');
const hint = section.querySelector('#categories-hint');
const desktop = matchMedia('(min-width:1024px) and (min-height:620px) and (prefers-reduced-motion:no-preference)');
const reduced = matchMedia('(prefers-reduced-motion:reduce)');
let maxTravel = 0, sectionTop = 0, target = 0, position = 0, frame = 0, lastTime = 0, current = 0;
let offsets = [], measuring = false;
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

function updateIndicator(x) {
  const progress = maxTravel ? clamp(x / maxTravel) : 0;
  section.style.setProperty('--category-progress', (.04 + .96 * progress).toFixed(4));
  current = Math.round(progress * (cards.length - 1));
  count.textContent = String(current + 1).padStart(2, '0');
  previous.disabled = x < 2;
  next.disabled = x > maxTravel - 2;
}
function schedule() { if (!frame && !document.hidden) frame = requestAnimationFrame(animate); }
function animate(now) {
  frame = 0;
  if (!desktop.matches) { updateIndicator(viewport.scrollLeft); return; }
  const dt = lastTime ? Math.min(64, now - lastTime) : 16;
  lastTime = now;
  position += (target - position) * (1 - Math.exp(-dt / 85));
  if (Math.abs(target - position) < .2) position = target;
  track.style.transform = `translateX(${-position}px)`;
  updateIndicator(position);
  if (position !== target) schedule();
  else lastTime = 0;
}
function onScroll() {
  if (!desktop.matches) return;
  target = clamp(scrollY - sectionTop, 0, maxTravel);
  schedule();
}
function measure() {
  if (measuring) return;
  measuring = true;
  const driven = desktop.matches;
  section.classList.toggle('is-scroll-driven', driven);
  track.style.transform = '';
  viewport.scrollLeft = 0;
  maxTravel = Math.max(0, track.scrollWidth - viewport.clientWidth);
  offsets = cards.map(card => clamp(card.offsetLeft - cards[0].offsetLeft, 0, maxTravel));
  // Only desktop spends vertical distance on horizontal exploration; a short
  // final hold keeps the sixth category comfortably readable before exiting.
  section.style.height = driven ? `${sticky.offsetHeight + maxTravel + 140}px` : '';
  sectionTop = section.getBoundingClientRect().top + scrollY;
  hint.textContent = driven ? 'ROLE PARA EXPLORAR AS CATEGORIAS' : 'DESLIZE PARA EXPLORAR AS CATEGORIAS';
  position = driven ? clamp(scrollY - sectionTop, 0, maxTravel) : 0;
  target = position;
  if (driven) track.style.transform = `translateX(${-position}px)`;
  updateIndicator(position);
  measuring = false;
}
function goTo(index, instant = false) {
  const safeIndex = clamp(index, 0, cards.length - 1);
  const x = instant || !desktop.matches ? offsets[safeIndex] : maxTravel * safeIndex / (cards.length - 1);
  const behavior = instant || reduced.matches ? 'instant' : 'smooth';
  if (desktop.matches) {
    viewport.scrollLeft = 0;
    scrollTo({ top: sectionTop + x, behavior });
    if (instant) { position = target = x; track.style.transform = `translateX(${-x}px)`; updateIndicator(x); }
  } else viewport.scrollTo({ left: x, behavior });
}
function stepNative(direction) {
  const positions = [...new Set(offsets)];
  const x = viewport.scrollLeft;
  const next = direction > 0 ? positions.find(position => position > x + 2) ?? maxTravel : positions.findLast(position => position < x - 2) ?? 0;
  viewport.scrollTo({ left: next, behavior: reduced.matches ? 'instant' : 'smooth' });
}
previous.addEventListener('click', () => desktop.matches ? goTo(current - 1) : stepNative(-1));
next.addEventListener('click', () => desktop.matches ? goTo(current + 1) : stepNative(1));
viewport.addEventListener('scroll', () => { if (!desktop.matches) schedule(); }, { passive: true });
viewport.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft' || event.key === 'Home' || event.key === 'End') {
    event.preventDefault();
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      if (desktop.matches) goTo(current + (event.key === 'ArrowRight' ? 1 : -1));
      else stepNative(event.key === 'ArrowRight' ? 1 : -1);
    } else goTo(event.key === 'Home' ? 0 : cards.length - 1);
  }
});
// Tabbing into translated cards must bring the focused category into view.
viewport.addEventListener('focusin', event => {
  const card = event.target.closest('.category-card');
  if (card && desktop.matches) goTo(cards.indexOf(card), true);
});
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', measure, { passive: true });
desktop.addEventListener('change', measure);
new ResizeObserver(measure).observe(viewport);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
  else { onScroll(); schedule(); }
});
measure();
