import { escapeHTML as e, priceHTML } from './view.js';
import { STORE_CONFIG, whatsappLink } from './config.js';

let savedOverflow = null;
const returnFocus = new WeakMap();
export function openDialog(dialog) {
  if (dialog.open) return;
  returnFocus.set(dialog,document.activeElement);
  if (savedOverflow === null) { savedOverflow=document.body.style.overflow; document.body.style.overflow='hidden'; }
  dialog.showModal();
}
export function setupDialogs() {
  document.querySelectorAll('.catalog-dialog').forEach(dialog=> {
    dialog.addEventListener('keydown',event=> {
      if(event.key !== 'Tab') return;
      const focusable=[...dialog.querySelectorAll('a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),[tabindex="0"]')].filter(element=>element.getClientRects().length);
      const first=focusable[0],last=focusable.at(-1);
      if(event.shiftKey && document.activeElement===first) {event.preventDefault();last?.focus();}
      else if(!event.shiftKey && document.activeElement===last) {event.preventDefault();first?.focus();}
    });
    dialog.addEventListener('click',event=> {
      if(event.target !== dialog) return;
      const r=dialog.getBoundingClientRect();
      if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) dialog.close();
    });
    dialog.addEventListener('close',()=> {
      if(!document.querySelector('dialog[open]')) { document.body.style.overflow=savedOverflow??''; savedOverflow=null; }
      const element=returnFocus.get(dialog);
      if(element?.isConnected && element !== document.body && element.getClientRects().length) element.focus({preventScroll:true});
      else document.querySelector('#catalog-search').focus({preventScroll:true});
    });
  });
  document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>document.getElementById(button.dataset.close).close()));
}
export function createProductModal(onClose) {
  const dialog=document.querySelector('#product-dialog');
  const content=document.querySelector('#product-detail');
  let selected=null;
  dialog.addEventListener('close',()=> { selected=null; onClose(); });
  content.addEventListener('click',async event=> {
    if(!event.target.closest('#share-product') || !selected) return;
    const url=new URL(location.href); url.searchParams.set('produto',selected.slug);
    const status=content.querySelector('#share-status');
    try {
      if(navigator.share) await navigator.share({title:selected.name,url:url.href});
      else { await navigator.clipboard.writeText(url.href); status.textContent='Link do produto copiado.'; }
    } catch(error) { if(error.name !== 'AbortError') { status.textContent='Copie este link para compartilhar:'; const input=document.createElement('input'); input.value=url.href; input.readOnly=true; input.setAttribute('aria-label','Link do produto'); status.append(input); input.select(); } }
  });
  return {
    open(product) {
      selected=product;
      content.innerHTML=`<div class="product-detail-image"><img src="${e(product.image)}" alt="${e(product.imageAlt)}" width="640" height="640" decoding="async"/></div><div class="product-detail-copy"><p class="catalog-card-category">${e(product.categoryLabel)} · ${e(product.brand)}</p><h2 id="product-dialog-title">${e(product.name)}</h2><p class="detail-price">${priceHTML(product)}</p><p class="detail-stock"><span aria-hidden="true"></span>${product.availability==='in_stock'?'Em estoque':'Sob consulta'}</p><p class="detail-description">${e(product.description)}</p><h3>Especificações</h3><dl>${product.specifications.map(([key,value])=>`<div><dt>${e(key)}</dt><dd>${e(value)}</dd></div>`).join('')}</dl><div class="detail-actions"><a class="catalog-button" href="${e(whatsappLink(product))}" target="_blank" rel="noopener">Solicitar pelo WhatsApp <span aria-hidden="true">↗</span></a><button class="catalog-button catalog-button-secondary" id="share-product">Compartilhar</button></div>${!STORE_CONFIG.whatsapp?'<p class="detail-contact-note">Contato da loja ainda não informado. Escolha o destinatário ao abrir o WhatsApp.</p>':''}<p class="detail-demo">Imagem, especificações e preços ilustrativos.</p><p id="share-status" role="status"></p></div>`;
      openDialog(dialog);
    },
    close() { if(dialog.open) dialog.close(); },
  };
}
