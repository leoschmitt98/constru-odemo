import '../style.css';
import './catalog.css';
import { CATEGORIES,loadProducts } from './products.js';
import { defaultState,applyFilters,sortProducts,readState,writeState } from './filters.js';
import { escapeHTML as e,cardHTML } from './view.js';
import { setupDialogs,openDialog,createProductModal } from './product-modal.js';
import { whatsappLink } from './config.js';

setupDialogs();
const search=document.querySelector('#catalog-search');
const sort=document.querySelector('#catalog-sort');
const filterDialog=document.querySelector('#filter-dialog');
const filterTrigger=document.querySelector('#open-filters');
const grid=document.querySelector('#catalog-results');
const chipHost=document.querySelector('.catalog-chips');
const sidebarQuery=matchMedia('(min-width:1024px)');
let products=[],brands=[],state=defaultState();

function updateURL(mode='replace') {
  const url=new URL(location.href);
  writeState(url.searchParams,state);
  if(url.href !== location.href) history[mode==='push'?'pushState':'replaceState']({},'',url);
}
const modal=createProductModal(()=> {
  const url=new URL(location.href);
  if(url.searchParams.has('produto')) {url.searchParams.delete('produto');history.replaceState({},'',url);}
});
function findProduct(slug) { return products.find(product=>product.slug===slug || product.aliases?.includes(slug)); }
function openProduct(slug,update=true) {
  const product=findProduct(slug);
  if(!product) return;
  if(update) {const url=new URL(location.href);url.searchParams.set('produto',product.slug);history.pushState({},'',url);}
  modal.open(product);
}

const form=document.createElement('form');
form.className='catalog-filter-form';
form.setAttribute('aria-label','Filtros de produtos');
function options(name,values) {return values.map(([value,label])=>`<label class="filter-option"><input type="checkbox" name="${name}" value="${e(value)}"/><span>${e(label)}</span></label>`).join('');}
function createFilters() {
  form.innerHTML=`<h2 class="sidebar-title">Filtrar resultados</h2><fieldset><legend>Categoria</legend>${options('categories',CATEGORIES)}</fieldset><fieldset><legend>Faixa de preço</legend><div class="filter-price-inputs"><label>Mínimo (R$)<input type="number" name="minPrice" min="0" step="0.01" inputmode="decimal" placeholder="0"/></label><label>Máximo (R$)<input type="number" name="maxPrice" min="0" step="0.01" inputmode="decimal" placeholder="Sem limite"/></label></div><p class="price-filter-note"></p></fieldset><fieldset><legend>Disponibilidade</legend>${options('availability',[['in_stock','Em estoque'],['on_request','Sob consulta']])}</fieldset><fieldset><legend>Promoções</legend><label class="filter-option"><input type="checkbox" name="promotionOnly"/><span>Apenas ofertas</span></label></fieldset><fieldset><legend>Linha</legend>${options('brands',brands.map(brand=>[brand,brand]))}</fieldset><button type="button" class="catalog-button catalog-button-secondary sidebar-reset" data-reset>Limpar filtros</button>`;
  placeFilters();
}
function placeFilters() {
  const desktop=sidebarQuery.matches;
  if(desktop && filterDialog.open) filterDialog.close();
  const host=document.querySelector(desktop?'#desktop-filter-host':'#mobile-filter-host');
  host.append(form);
}
sidebarQuery.addEventListener('change',placeFilters);
form.addEventListener('submit',event=>event.preventDefault());
function readForm(mode) {
  const values=new FormData(form);
  state.categories=values.getAll('categories');
  state.brands=values.getAll('brands');
  state.availability=values.getAll('availability');
  state.promotionOnly=values.has('promotionOnly');
  for(const key of ['minPrice','maxPrice']) {const input=form.elements.namedItem(key);state[key]=input.value!=='' && input.validity.valid?input.valueAsNumber:null;}
  render();updateURL(mode);
}
form.addEventListener('change',()=>readForm('push'));
form.addEventListener('input',event=> {if(['minPrice','maxPrice'].includes(event.target.name))readForm('replace');});
function syncControls() {
  search.value=state.search;sort.value=state.sort;
  form.querySelectorAll('input').forEach(input=> {
    if(['categories','brands','availability'].includes(input.name))input.checked=state[input.name].includes(input.value);
    else if(input.name==='promotionOnly')input.checked=state.promotionOnly;
    else input.value=state[input.name]??'';
  });
  chipHost.querySelectorAll('button').forEach(button=> {
    const selected=button.dataset.category==='all'?!state.categories.length:state.categories.includes(button.dataset.category);
    button.setAttribute('aria-pressed',String(selected));
  });
}
function render() {
  const filtered=sortProducts(applyFilters(products,state),state.sort);
  grid.innerHTML=filtered.map(cardHTML).join('');
  grid.hidden=!filtered.length;
  document.querySelector('#catalog-empty').hidden=!!filtered.length;
  document.querySelector('#result-count').textContent=`${filtered.length} ${filtered.length===1?'produto encontrado':'produtos encontrados'}`;
  document.querySelector('#show-filter-results').textContent=`Ver ${filtered.length} ${filtered.length===1?'produto':'produtos'}`;
  const number=state.categories.length+state.brands.length+state.availability.length+Number(state.promotionOnly)+Number(state.minPrice!==null)+Number(state.maxPrice!==null);
  document.querySelector('#filter-number').textContent=number?`(${number})`:'';
  form.querySelector('.price-filter-note').textContent=state.minPrice!==null && state.maxPrice!==null && state.minPrice>state.maxPrice?'O mínimo está acima do máximo.':'';
  syncControls();
}
chipHost.innerHTML=[['all','Todos'],...CATEGORIES].map(([key,label])=>`<button data-category="${key}" aria-pressed="false">${label}</button>`).join('');
chipHost.addEventListener('click',event=> {
  const button=event.target.closest('[data-category]');if(!button)return;
  state.categories=button.dataset.category==='all'?[]:[button.dataset.category];render();updateURL('push');
});
search.addEventListener('input',()=> {state.search=search.value;render();updateURL();});
sort.addEventListener('change',()=> {state.sort=sort.value;render();updateURL('push');});
document.addEventListener('click',event=> {
  if(event.target.closest('[data-reset]')) {state=defaultState();render();updateURL('push');}
  const product=event.target.closest('[data-product]');
  if(product){event.preventDefault();openProduct(product.dataset.product);}
});
filterTrigger.addEventListener('click',()=> {filterTrigger.setAttribute('aria-expanded','true');openDialog(filterDialog);});
filterDialog.addEventListener('close',()=>filterTrigger.setAttribute('aria-expanded','false'));
document.querySelector('#show-filter-results').addEventListener('click',()=>filterDialog.close());
addEventListener('popstate',()=> {
  state=readState(new URLSearchParams(location.search),CATEGORIES.map(([key])=>key),brands);render();
  const slug=new URLSearchParams(location.search).get('produto');
  if(slug && findProduct(slug))openProduct(slug,false);else modal.close();
});

const toggle=document.querySelector('.menu-toggle');
const menu=document.querySelector('#catalog-mobile-nav');
function closeMenu(){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menu');}
toggle.addEventListener('click',()=> {const open=menu.hidden;menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');});
addEventListener('keydown',event=> {if(event.key==='Escape')closeMenu();});
matchMedia('(min-width:851px)').addEventListener('change',closeMenu);
document.querySelectorAll('[data-info]').forEach(button=>button.addEventListener('click',()=> {
  closeMenu();const topic=button.dataset.info;
  document.querySelector('#info-title').textContent=topic==='WhatsApp'?'Vamos conversar sobre sua obra.':topic;
  document.querySelector('#info-message').textContent=topic==='Sobre'?'Esta é uma demonstração da vitrine digital Alicerce. Informações sobre a loja serão adicionadas em uma próxima etapa.':'O contato da loja ainda não foi informado. A mensagem está pronta para abrir no WhatsApp; escolha o destinatário para continuar.';
  const link=document.querySelector('#info-whatsapp');link.hidden=topic==='Sobre';link.href=whatsappLink();
  openDialog(document.querySelector('#catalog-info'));
}));

async function initialize() {
  try {
    products=await loadProducts();brands=[...new Set(products.map(product=>product.brand))].sort();
    state=readState(new URLSearchParams(location.search),CATEGORIES.map(([key])=>key),brands);
    createFilters();render();
    const slug=new URLSearchParams(location.search).get('produto');if(slug)openProduct(slug,false);
  }catch(error){document.querySelector('#result-count').textContent='Não foi possível carregar os produtos. Recarregue a página.';console.error(error);}
}
initialize();
