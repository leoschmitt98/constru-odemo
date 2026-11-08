import './trust-section.css';
import { STORE_CONFIG, whatsappLink } from './catalog/config.js';

// Replace a label or supply a local logo path; no real partnership is asserted.
export const TRUST_BRANDS = Array.from({ length: 6 }, (_, i) => ({
  name: `Marca ${String(i + 1).padStart(2, '0')}`, logo: null,
}));
const section = document.querySelector('.trust-section');
const track = section.querySelector('.trust-brand-track');
TRUST_BRANDS.forEach((brand, i) => {
  const item = document.createElement('div');
  item.className = `trust-brand trust-brand-${i + 1}`;
  if (brand.logo) {
    const img = document.createElement('img');
    img.src = brand.logo; img.alt = brand.name; img.width = 140; img.height = 60;
    img.loading = 'lazy'; img.decoding = 'async'; item.append(img);
  } else {
    const label = document.createElement('span'); label.textContent = brand.name;
    item.append(label);
  }
  track.append(item);
});
section.querySelector('.trust-whatsapp').href = whatsappLink();
if (!STORE_CONFIG.whatsapp) section.querySelector('.trust-contact-note').textContent = 'Contato da loja ainda não informado. Escolha o destinatário ao abrir o WhatsApp.';
const motion = matchMedia('(prefers-reduced-motion:reduce)');
if (!motion.matches) {
  section.classList.add('trust-enhanced');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('trust-visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: .12 });
  section.querySelectorAll('.trust-reveal').forEach(element => observer.observe(element));
  section.addEventListener('focusin', event => event.target.closest('.trust-reveal')?.classList.add('trust-visible'));
}
