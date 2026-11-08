export const escapeHTML = value => String(value).replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
export const money = value => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value);
export function priceHTML(product) {
  if (product.priceType === 'consult' || product.price === null) return '<span class="catalog-consult">Consulte disponibilidade</span>';
  return `${product.priceType==='from'?'<small>A partir de</small>':''}${product.promotion && product.oldPrice ? `<del>${money(product.oldPrice)}</del>`:''}<strong>${money(product.price)}${product.unit?` <span class="catalog-unit">/ ${escapeHTML(product.unit)}</span>`:''}</strong>`;
}
export function cardHTML(product) {
  return `<article class="catalog-card"><a class="catalog-card-photo" href="?produto=${encodeURIComponent(product.slug)}" data-product="${escapeHTML(product.slug)}" aria-label="Ver detalhes de ${escapeHTML(product.name)}"><img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.imageAlt)}" width="640" height="640" loading="lazy" decoding="async"/>${product.badge?`<span class="catalog-badge">${escapeHTML(product.badge)}</span>`:''}</a><div class="catalog-card-info"><p class="catalog-card-category">${escapeHTML(product.categoryLabel)}</p><h2>${escapeHTML(product.name)}</h2><p class="catalog-card-price">${priceHTML(product)}</p><button class="catalog-details" data-product="${escapeHTML(product.slug)}" aria-label="Ver detalhes de ${escapeHTML(product.name)}">Ver detalhes <span aria-hidden="true">→</span></button></div></article>`;
}
