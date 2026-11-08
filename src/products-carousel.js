import './products.css';

const section = document.querySelector('.products-section');
const viewport = section.querySelector('.products-viewport');
const cards = [...section.querySelectorAll('.product-card')];
const previous = section.querySelector('.product-prev');
const next = section.querySelector('.product-next');
const counter = section.querySelector('#product-current');
const reduced = matchMedia('(prefers-reduced-motion:reduce)');
let offsets = [], widths = [], max = 0, gutter = 0, visibleWidth = 0, raf = 0;

function measure() {
  gutter = parseFloat(getComputedStyle(viewport).scrollPaddingLeft) || 0;
  visibleWidth = viewport.clientWidth;
  offsets = cards.map(card => card.offsetLeft - cards[0].offsetLeft);
  widths = cards.map(card => card.offsetWidth);
  max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
  schedule();
}
function update() {
  raf = 0;
  const x = viewport.scrollLeft;
  // Native swipe indicator follows the largest visible card; ties favor the
  // category nearest the reading edge. No layout reads inside the scroll loop.
  let best = 0, visibility = -1;
  cards.forEach((card, i) => {
    const left = offsets[i] + gutter - x;
    const visible = Math.max(0, Math.min(visibleWidth, left + widths[i]) - Math.max(0, left));
    if (visible > visibility + 1) { best = i; visibility = visible; }
  });
  counter.textContent = String(best + 1).padStart(2, '0');
  previous.disabled = x < 2;
  next.disabled = x >= max - 2;
  section.style.setProperty('--products-progress', String(.05 + .95 * (max ? x / max : 0)));
}
function schedule() { if (!raf) raf = requestAnimationFrame(update); }
function goTo(x) { viewport.scrollTo({ left: Math.max(0, Math.min(max, x)), behavior: reduced.matches ? 'instant' : 'smooth' }); }
function step(direction) {
  const x = viewport.scrollLeft;
  const candidates = [...new Set(offsets.map(offset => Math.min(max, offset)))];
  goTo(direction > 0 ? candidates.find(offset => offset > x + 2) ?? max : candidates.findLast(offset => offset < x - 2) ?? 0);
}
previous.addEventListener('click', () => step(-1));
next.addEventListener('click', () => step(1));
viewport.addEventListener('scroll', schedule, { passive:true });
viewport.addEventListener('keydown', event => {
  if (['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) {
    event.preventDefault();
    if (event.key === 'Home' || event.key === 'End') goTo(event.key === 'Home' ? 0 : max);
    else step(event.key === 'ArrowRight' ? 1 : -1);
  }
});
viewport.addEventListener('focusin', event => {
  const index = cards.indexOf(event.target.closest('.product-card'));
  if (index >= 0) viewport.scrollTo({ left:Math.min(max, offsets[index]), behavior:'instant' });
});

// Touch/trackpad remain entirely native. Only primary mouse dragging adds a
// small enhancement; movement under 6px keeps product links normally clickable.
let drag = null, suppressClick = false;
viewport.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'mouse' || event.button !== 0) return;
  drag = { id:event.pointerId, start:event.clientX, scroll:viewport.scrollLeft, moved:false };
  suppressClick = false;
});
viewport.addEventListener('pointermove', event => {
  if (!drag || event.pointerId !== drag.id) return;
  const delta = event.clientX - drag.start;
  if (!drag.moved && Math.abs(delta) > 6) {
    drag.moved = true;
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add('is-dragging');
  }
  if (drag.moved) { event.preventDefault(); viewport.scrollLeft = drag.scroll - delta; }
});
function endDrag() {
  if (!drag) return;
  suppressClick = drag.moved;
  if (viewport.hasPointerCapture(drag.id)) viewport.releasePointerCapture(drag.id);
  const moved = drag.moved;
  drag = null;
  viewport.classList.remove('is-dragging');
  if (moved) {
    const nearest = offsets.reduce((best, x) => Math.abs(Math.min(max,x) - viewport.scrollLeft) < Math.abs(best - viewport.scrollLeft) ? Math.min(max,x) : best, 0);
    goTo(nearest);
  }
}
viewport.addEventListener('pointerup', endDrag);
viewport.addEventListener('pointercancel', endDrag);
viewport.addEventListener('lostpointercapture', endDrag);
viewport.addEventListener('pointerleave', () => { if (drag && !drag.moved) drag = null; });
viewport.addEventListener('dragstart', event => event.preventDefault());
viewport.addEventListener('click', event => { if (suppressClick) { event.preventDefault(); suppressClick = false; } }, true);

section.classList.add('is-enhanced');
const entrance = new IntersectionObserver(entries => {
  if (entries.some(entry => entry.isIntersecting)) { section.classList.add('is-visible'); entrance.disconnect(); }
}, { threshold:.08 });
entrance.observe(section);
// Keyboard users must never focus a link that is still visually concealed.
section.addEventListener('focusin', () => section.classList.add('is-visible'));
new ResizeObserver(measure).observe(viewport);
addEventListener('resize', measure, {passive:true});
measure();
