export const defaultState = () => ({categories:[],search:'',brands:[],availability:[],promotionOnly:false,minPrice:null,maxPrice:null,sort:'relevance'});
export const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
export function applyFilters(products,state) {
  const terms = normalize(state.search).split(/\s+/).filter(Boolean);
  return products.filter(product => {
    const text = normalize([product.name,product.categoryLabel,product.brand,...product.keywords].join(' '));
    return (!state.categories.length || state.categories.includes(product.category))
      && terms.every(term=>text.includes(term))
      && (!state.brands.length || state.brands.includes(product.brand))
      && (!state.availability.length || state.availability.includes(product.availability))
      && (!state.promotionOnly || product.promotion)
      // Unknown prices remain visible without a price filter; with a bound,
      // they cannot be asserted to match the user's requested range.
      && (state.minPrice === null || product.price !== null && product.price >= state.minPrice)
      && (state.maxPrice === null || product.price !== null && product.price <= state.maxPrice);
  });
}
export function sortProducts(products,sort) {
  return [...products].sort((a,b) => {
    if (sort === 'price-asc' || sort === 'price-desc') {
      if (a.price === null || b.price === null) return a.price === b.price ? a.id-b.id : a.price === null ? 1 : -1;
      return (a.price-b.price)*(sort === 'price-asc'?1:-1) || a.id-b.id;
    }
    if (sort === 'name') return a.name.localeCompare(b.name,'pt-BR');
    if (sort === 'offers') return Number(b.promotion)-Number(a.promotion) || a.id-b.id;
    return Number(b.featured)-Number(a.featured) || a.id-b.id;
  });
}
export function readState(params,categories,brands) {
  const state = defaultState();
  const list = key => (params.get(key)||'').split(',').filter(Boolean);
  state.categories = list('categoria').filter(value=>categories.includes(value));
  state.brands = list('linhas').filter(value=>brands.includes(value));
  state.availability = list('disponibilidade').filter(value=>['in_stock','on_request'].includes(value));
  state.search = params.get('busca') || '';
  state.promotionOnly = params.get('ofertas') === '1';
  for (const [field,param] of [['minPrice','min'],['maxPrice','max']]) {
    const value = params.get(param);
    state[field] = value !== null && value.trim() && Number.isFinite(Number(value)) && Number(value)>=0 ? Number(value) : null;
  }
  if (['relevance','price-asc','price-desc','name','offers'].includes(params.get('ordem'))) state.sort=params.get('ordem');
  return state;
}
export function writeState(params,state) {
  const values={categoria:state.categories.join(','),busca:state.search,linhas:state.brands.join(','),disponibilidade:state.availability.join(','),ofertas:state.promotionOnly?'1':'',min:state.minPrice??'',max:state.maxPrice??'',ordem:state.sort==='relevance'?'':state.sort};
  Object.entries(values).forEach(([key,value])=> value === '' ? params.delete(key) : params.set(key,String(value)));
}
