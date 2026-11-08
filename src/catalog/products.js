export const CATEGORIES = [
  ['construcao','Construção'],['eletrica','Elétrica'],['hidraulica','Hidráulica'],
  ['tintas','Tintas'],['acabamentos','Acabamentos'],['ferramentas','Ferramentas'],
];
const local = name => `/images/product-${name}.webp`;
const wires = 'https://images.pexels.com/photos/4480525/pexels-photo-4480525.jpeg?auto=compress&cs=tinysrgb&w=640';
const bricks = 'https://images.pexels.com/photos/20204115/pexels-photo-20204115.jpeg?auto=compress&cs=tinysrgb&w=640';
const make = (id,slug,name,category,price,image,options={}) => ({
  id,slug,name,category,categoryLabel:CATEGORIES.find(([key])=>key===category)[1],
  brand:['Linha Premium','Linha Profissional','Linha Casa'][id%3],
  price,priceType:price === null ? 'consult' : 'fixed',image,
  imageAlt:`${name} — imagem ilustrativa de materiais`,availability:'in_stock',
  featured:false,promotion:false,oldPrice:null,badge:'',keywords:[],
  description:`${name}: uma opção para compor sua obra com praticidade e qualidade. Produto fictício; confirme a adequação ao seu projeto e as condições com o atendimento.`,
  specifications:[['Linha','Demonstração'],['Aplicação','Construção e reforma']],...options,
});
export const products = [
  make(1,'cimento-cp2','Cimento CP II 50kg','construcao',39.9,local('cement'),{featured:true,badge:'Mais vendido',aliases:['cimento-cp2-50kg'],keywords:['cimento','concreto','saco'],specifications:[['Peso','50 kg'],['Tipo','CP II'],['Uso','Preparação de concretos e argamassas']]}),
  make(2,'tinta-premium-18l','Tinta Premium Fosca 18L','tintas',289.9,local('paint'),{featured:true,keywords:['tinta','acrilica','pintura','fosca'],specifications:[['Volume','18 L'],['Acabamento','Fosco'],['Ambiente','Interno / externo']]}),
  make(3,'furadeira-impacto-650w','Furadeira de Impacto 650W','ferramentas',299.9,local('drill'),{featured:true,promotion:true,oldPrice:349.9,badge:'Oferta',keywords:['furadeira','broca','ferramenta','impacto'],specifications:[['Potência','650 W'],['Mandril','13 mm'],['Alimentação','127 V — demonstrativo']]}),
  make(4,'kit-conexoes','Kit de Conexões Água Fria','hidraulica',null,local('plumbing'),{featured:true,badge:'Em destaque',availability:'on_request',keywords:['pvc','tubo','conexoes','agua'],specifications:[['Material','PVC'],['Uso','Água fria'],['Composição','Joelhos, tês e luvas']]}),
  make(5,'porcelanato-acetinado','Porcelanato Acetinado','acabamentos',79.9,local('tile'),{featured:true,priceType:'from',unit:'m²',keywords:['piso','porcelanato','revestimento','pedra'],specifications:[['Dimensões','84 × 84 cm'],['Acabamento','Acetinado'],['Venda','Por m²']]}),
  make(6,'cabo-flexivel-25','Cabo Flexível 2,5mm²','eletrica',149.9,wires,{keywords:['fio','cabo','cobre','eletrica'],specifications:[['Seção','2,5 mm²'],['Comprimento','100 m'],['Material','Cobre']]}),
  make(7,'tijolo-ceramico','Tijolo Cerâmico 9×19×29','construcao',1.29,bricks,{promotion:true,oldPrice:1.59,badge:'Oferta',unit:'un',keywords:['tijolo','bloco','ceramico','alvenaria'],specifications:[['Dimensões','9 × 19 × 29 cm'],['Material','Cerâmica'],['Venda','Unidade']]}),
  make(8,'tinta-fosca-36l','Tinta Acrílica Fosca 3,6L','tintas',69.9,local('paint'),{keywords:['tinta','pintura','acrilica','parede'],specifications:[['Volume','3,6 L'],['Acabamento','Fosco'],['Cor','Branco — demonstrativo']]}),
  make(9,'furadeira-impacto-750w','Furadeira de Impacto 750W','ferramentas',389.9,local('drill'),{badge:'Novidade',keywords:['furadeira','impacto','broca'],specifications:[['Potência','750 W'],['Mandril','13 mm'],['Alimentação','220 V — demonstrativo']]}),
  make(10,'registro-esfera-pvc','Registro de Esfera PVC 25mm','hidraulica',24.9,local('plumbing'),{keywords:['registro','valvula','pvc','agua'],specifications:[['Diâmetro','25 mm'],['Material','PVC'],['Uso','Água fria']]}),
  make(11,'porcelanato-cinza','Porcelanato Cinza Acetinado','acabamentos',89.9,local('tile'),{priceType:'from',unit:'m²',availability:'on_request',keywords:['piso','cinza','porcelanato'],specifications:[['Dimensões','90 × 90 cm'],['Acabamento','Acetinado'],['Venda','Por m²']]}),
  make(12,'cabo-flexivel-4','Cabo Flexível 4mm²','eletrica',219.9,wires,{promotion:true,oldPrice:249.9,badge:'Oferta',keywords:['fio','cabo','cobre','eletrica'],specifications:[['Seção','4 mm²'],['Comprimento','100 m'],['Material','Cobre']]}),
  make(13,'cimento-cp3','Cimento CP III 50kg','construcao',42.9,local('cement'),{keywords:['cimento','concreto','saco'],specifications:[['Peso','50 kg'],['Tipo','CP III'],['Uso','Concretos e argamassas']]}),
  make(14,'tinta-acrilica-18l','Tinta Acrílica Semibrilho 18L','tintas',319.9,local('paint'),{availability:'on_request',keywords:['tinta','acrilica','pintura','semibrilho'],specifications:[['Volume','18 L'],['Acabamento','Semibrilho'],['Ambiente','Interno / externo']]}),
  make(15,'furadeira-profissional-900w','Furadeira Profissional 900W','ferramentas',459.9,local('drill'),{availability:'on_request',keywords:['furadeira','ferramenta','broca','profissional'],specifications:[['Potência','900 W'],['Mandril','13 mm'],['Alimentação','220 V — demonstrativo']]}),
  make(16,'kit-luvas-pvc','Kit de Luvas PVC 25mm','hidraulica',19.9,local('plumbing'),{keywords:['luva','conexao','pvc','agua'],specifications:[['Diâmetro','25 mm'],['Material','PVC'],['Quantidade','6 peças']]}),
  make(17,'revestimento-marmorizado','Revestimento Marmorizado','acabamentos',59.9,local('tile'),{priceType:'from',unit:'m²',promotion:true,oldPrice:69.9,badge:'Oferta',keywords:['revestimento','marmore','parede','piso'],specifications:[['Dimensões','60 × 60 cm'],['Acabamento','Acetinado'],['Venda','Por m²']]}),
  make(18,'cabo-flexivel-6','Cabo Flexível 6mm²','eletrica',329.9,wires,{availability:'on_request',keywords:['fio','cabo','cobre','eletrica'],specifications:[['Seção','6 mm²'],['Comprimento','100 m'],['Material','Cobre']]}),
];
// Replace only this repository function with fetch('/api/products') later.
export async function loadProducts() { return products; }
