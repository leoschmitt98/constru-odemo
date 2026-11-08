export const STORE_CONFIG = {
  // Set country code + DDD + number (digits only), e.g. 55..., when defined.
  // Empty: WhatsApp opens a message with the recipient chosen by the user.
  whatsapp: '',
};
export function whatsappLink(product) {
  const message = product
    ? `Olá! Tenho interesse no produto "${product.name}" que encontrei no catálogo. Gostaria de consultar preço e disponibilidade.`
    : 'Olá! Gostaria de consultar materiais para minha obra.';
  const number = STORE_CONFIG.whatsapp.replace(/\D/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
