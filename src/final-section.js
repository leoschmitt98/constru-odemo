import './final-section.css';
import { whatsappLink } from './catalog/config.js';

const finalMessage = 'Olá! Estava navegando pelo site e gostaria de conversar sobre materiais para minha obra.';
const finalWhatsApp = whatsappLink().split('?')[0] + '?text=' + encodeURIComponent(finalMessage);
document.querySelectorAll('.final-whatsapp, .footer-whatsapp').forEach(link => { link.href = finalWhatsApp; });
document.querySelector('#footer-year').textContent = String(new Date().getFullYear());
