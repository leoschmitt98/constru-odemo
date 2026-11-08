import './faq-section.css';
import { whatsappLink } from './catalog/config.js';

const section = document.querySelector('.faq-section');
if (section) {
  const message = 'Olá! Estava vendo o site e gostaria de tirar uma dúvida sobre materiais para minha obra.';
  section.querySelector('.faq-contact').href = whatsappLink().split('?')[0] + '?text=' + encodeURIComponent(message);
  const items = [...section.querySelectorAll('.faq-item')];
  function setOpen(item, open) {
    item.classList.toggle('is-open', open);
    item.querySelector('button').setAttribute('aria-expanded', String(open));
    const answer = item.querySelector('.faq-answer');
    answer.setAttribute('aria-hidden', String(!open));
    answer.inert = !open;
  }
  items.forEach(item => {
    item.querySelector('button').addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      items.forEach(other => setOpen(other, other === item && open));
    });
  });
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!motion.matches && 'IntersectionObserver' in window) {
    const targets = [...section.querySelectorAll('.faq-reveal')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    targets.forEach(target => { target.classList.add('has-reveal'); observer.observe(target); });
    section.addEventListener('focusin', event => event.target.closest('.faq-reveal')?.classList.add('is-visible'));
    motion.addEventListener('change', () => {
      if (motion.matches) { targets.forEach(target => target.classList.add('is-visible')); observer.disconnect(); }
    });
  }
}
