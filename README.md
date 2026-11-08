# Alicerce — demonstração do hero

Projeto com HTML, CSS e JavaScript puro. Navbar, hero cinematográfico com scroll movie, seção editorial de categorias e vitrine de produtos em destaque. Alicerce é uma identidade temporária; as imagens fornecidas foram usadas como referência de composição.

## Executar

```sh
npm install
npm run dev
```

Para produção: `npm run build`. Para conferir o build: `npm run preview`.

## Estrutura

- `index.html`: estrutura semântica, navegação, conteúdo e diálogo da demonstração.
- `src/style.css`: composição, overlays, breakpoints e redução de movimento.
- `src/main.js`: scroll movie, revelação de conteúdo, navegação e CTAs.
- `src/categories-scroll.js` e `src/categories.css`: interação e composição da segunda seção, isoladas do Hero.
- `src/products-carousel.js` e `src/products.css`: carrossel nativo, controles, indicador e entrada da terceira seção.
- `public/video/construction.mp4`: cópia web do vídeo fornecido.
- `public/images/construction-start.jpg` e `construction-final.jpg`: frames do próprio vídeo, para poster e alternativa estática.
- `package.json` e `package-lock.json`: Vite, única dependência direta de desenvolvimento.

## Scroll movie

A seção mede 360svh no desktop e 380svh no mobile. Dentro dela, o hero fica sticky por 100svh. A posição do scroll, dividida pelo percurso disponível, gera um progresso entre 0 e 1. Uma interpolação temporal em requestAnimationFrame suaviza esse progresso e atualiza o currentTime do vídeo pausado. O scroll inverso retrocede o filme. Buscas são serializadas para não interromper a decodificação continuamente. O início e o final estabilizam nos frames extremos, sem autoplay ou loop.

As três palavras aparecem nos intervalos 12–28%, 40–54% e 65–79%. Texto auxiliar e CTAs aparecem em 85–96%. Os botões invisíveis ficam inert. As etapas inferiores permitem navegar na experiência. O requestAnimationFrame para ao estabilizar e quando a aba fica oculta. As dimensões são armazenadas e atualizadas no resize.

Com prefers-reduced-motion, a seção passa a ocupar uma tela e exibe a casa pronta com todos os textos, sem scroll movie.

## Preparação do vídeo

O arquivo original em Downloads foi preservado. A cópia web remove áudio e faixas pretas, preserva os 1916px de largura originais e usa H.264, CRF 14, preset slow, GOP de 6 frames e faststart. A resolução útil é 1916 × 992, sem as faixas pretas. Esta versão prioriza qualidade visual e tem aproximadamente 26 MB. Keyframes frequentes favorecem o acesso aleatório necessário ao scroll. Os posters foram extraídos desse vídeo; não foram criadas imagens novas. FFmpeg foi utilizado apenas para preparar os assets, sem dependência no projeto.

## Escopo e próximos ajustes

Navbar e CTAs do Hero abrem um diálogo informando o escopo da demonstração. Para ativar atendimento real, é necessário definir o número de WhatsApp. Ofertas, sobre e contato não possuem páginas independentes. Os seis cards de categorias possuem hrefs `/catalogo?categoria=...` e abrem o catálogo funcional filtrado; os destaques da Home abrem diretamente os detalhes dos produtos.

## Seção de categorias

Desktop a partir de 1024px de largura e 620px de altura, sem preferência por redução de movimento: sticky de 100svh, percurso vertical calculado a partir da largura excedente dos cards e uma pausa final de 140px. O scroll controla translateX do track por requestAnimationFrame, com interpolação de 85ms. Não existe carrossel automático nem captura dos eventos de roda/toque.

Abaixo de 1024px, em janelas baixas ou com redução de movimento: overflow-x nativo com scroll-snap. Mobile até 600px usa cards de 82vw e gap de 12px, deixando parte do próximo card à vista. Tablet usa cards de 340px. Breakpoint adicional em 780px de altura compacta a composição desktop.

As setas possuem 44×44px. A região aceita setas do teclado, Home e End; Tab traz o card focado para a área visível no desktop. O indicador acompanha scroll e swipe. Um gradiente de transição independente liga o fundo escuro do Hero ao concreto claro, sem modificar o Hero ou o vídeo.

Fotos temporárias remotas, servidas com largura de 720px, loading lazy e dimensões reservadas:

- [Construção — tijolos](https://www.pexels.com/photo/stack-on-bricks-20204115/)
- [Elétrica — fios](https://www.pexels.com/photo/blue-red-and-yellow-electric-wires-4480525/)
- [Hidráulica — PVC](https://www.pexels.com/photo/stack-of-pvc-pipes-at-a-construction-site-29301874/)
- [Tintas — rolos e balde](https://www.pexels.com/photo/paint-bucket-and-paint-rollers-2293819/)
- [Acabamentos — madeira](https://www.pexels.com/photo/stacks-of-wooden-planks-8817836/)
- [Ferramentas — furadeira](https://www.pexels.com/photo/yellow-cordless-drill-on-workshop-table-30486882/)

Validação em navegador: 360, 375, 390, 430, 768, 1024 e 1440px; sem overflow da página. Conferidos percurso desktop nos dois sentidos, acesso ao sexto card, swipe por eventos de toque emulados, foco nos seis links, redução de movimento e console sem erros ou warnings. O Hero mantém os tempos de 0, aproximadamente 5,05 e 10,10 segundos em 0%, 50% e 100%, e o vídeo e CSS originais mantêm os mesmos hashes.

Melhorias futuras da seção: trocar fotos temporárias por uma série própria com iluminação uniforme, hospedar versões locais em WebP/AVIF e testar o swipe em aparelhos físicos. Nenhuma seção adicional foi criada.

## Produtos em destaque

A terceira seção é uma vitrine de cinco produtos fictícios, com preços demonstrativos. O scroll vertical da página permanece normal: sem sticky adicional, scroll movie ou autoplay. O carrossel usa overflow-x e scroll-snap nativos, com setas, trackpad, swipe e um aprimoramento pequeno para arrastar com mouse. Arrastos de mouse não abrem os links acidentalmente. Setas do teclado, Home, End e Tab continuam disponíveis.

Desktop: aproximadamente quatro cards e uma parte do quinto. Tablet abaixo de 1024px: cards de 310px. Mobile até 600px: cards de 82vw, gap de 12px e indicação do próximo produto. O contador acompanha o card com maior área visível, favorecendo o primeiro em caso de empate. Setas e CTAs têm pelo menos 44px de área interativa. Preços não quebram em linhas inesperadas.

`public/images/products-environment.webp` é uma cópia otimizada do background fornecido (12_47_48.png), com enquadramento central em desktop e posição horizontal de 38% no mobile. O original foi preservado. Um fade na parte superior liga o concreto claro ao ambiente escuro, sem alterar a seção anterior. O overlay preserva textura e iluminação. Os produtos ficam em `public/images/product-*.webp`, com largura de 640px e lazy loading. São imagens genéricas geradas com a ferramenta integrada imagegen; os prompts completos estão em `public/images/products-prompts.json`.

IntersectionObserver revela kicker, título, texto e cards com diferenças de 70ms. A animação ocorre uma vez; foco de teclado revela o conteúdo imediatamente. prefers-reduced-motion remove a animação e a rolagem suave.

Links da Home atendidos pela página de catálogo e seus detalhes:

- `/catalogo`
- `/catalogo?produto=cimento-cp2`
- `/catalogo?produto=tinta-premium-18l`
- `/catalogo?produto=furadeira-impacto-650w`
- `/catalogo?produto=kit-conexoes`
- `/catalogo?produto=porcelanato-acetinado`

Melhorias futuras: substituir produtos fictícios por fotografias e informações da loja e verificar swipe/carregamento em celulares físicos. Sem dependências adicionais.

## Catálogo independente

Disponível em `/catalogo` e `/catalogo/`. A Home e seus assets aprovados permanecem intactos. `vite.config.js` configura o build de duas páginas e resolve a URL sem barra no desenvolvimento e no preview. O build gera `dist/index.html` e `dist/catalogo/index.html`. Na hospedagem, habilite directory index ou mapeie `/catalogo` para `/catalogo/index.html`, preservando as queries; não reescreva todas as rotas para a Home.

Arquivos novos:

- `catalogo/index.html`: navbar consistente com a Home, hero compacto, área funcional clara e dialogs.
- `src/catalog/catalog.js`: estado, renderização, controles e sincronização com URL.
- `src/catalog/products.js`: 18 produtos fictícios, categorias e repositório de dados assíncrono.
- `src/catalog/filters.js`: filtros combinados, ordenação e leitura/escrita do estado na URL.
- `src/catalog/view.js`: cards e formatos monetários; strings escapadas na renderização.
- `src/catalog/product-modal.js`: detalhes, dialogs, foco e compartilhamento.
- `src/catalog/config.js`: contato centralizado e montagem da mensagem WhatsApp.
- `src/catalog/catalog.css`: layout e breakpoints exclusivos do catálogo.
- `public/images/catalog-environment.webp`: versão otimizada do novo background fornecido.

Os dados incluem id, slug, aliases opcionais, name, category, categoryLabel, brand, price, priceType, unit, oldPrice, image, imageAlt, availability, featured, promotion, badge, keywords, description e specifications. Produtos variantes reutilizam imagens ilustrativas da mesma família. O fluxo central é estado → applyFilters → sortProducts → render → contador → URL.

Busca em tempo real por nome, categoria, linha e palavras-chave, ignorando acentos e caixa. Categorias múltiplas, linhas múltiplas, disponibilidade, ofertas e preço mínimo/máximo funcionam em conjunto. Valores desconhecidos ficam no fim das ordenações por preço e não são incluídos em uma faixa numérica. Ordenação por relevância, menor/maior preço, nome em português ou ofertas. Sem resultados há orientação e botão para limpar.

URL: `categoria` aceita um slug ou slugs separados por vírgula; `produto` abre detalhes, incluindo os cinco slugs da Home e o alias `cimento-cp2-50kg`. Fechar remove apenas produto. Busca, linha, disponibilidade, ofertas, mínimo, máximo e ordem também são serializados. Alterações categóricas usam pushState; digitação usa replaceState. Voltar/avançar restaura controles, resultados e detalhes.

Desktop: quatro colunas a partir de 1280px, três em 1024px, sidebar à esquerda e conteúdo limitado a 1600px. Tablet abaixo de 1024px usa drawer de filtros e três colunas; abaixo de 768px usa duas colunas. Até 389px usa uma coluna, com foto e informação lado a lado para preservar a leitura. Hero de 430px em desktop e 360px em mobile. Chips têm scroll nativo, a busca ocupa uma linha própria no mobile e filtro/ordenação ficam abaixo.

Filtros no mobile ocupam 90svh com formulário rolável e botão de resultados no fundo. Os mesmos campos são movidos entre sidebar e drawer, evitando duplicação de estado. Dialogs bloqueiam o scroll do body, fecham por X, backdrop e ESC, mantêm Tab dentro deles e restauram foco. Produto mostra foto, preço, estoque, descrição e especificações. No mobile fica em painel quase completo com ação WhatsApp sticky. Compartilhamento usa navigator.share e, quando indisponível, copia o link; falhas exibem um campo copiável.

WhatsApp: substitua apenas `STORE_CONFIG.whatsapp` em `src/catalog/config.js`, com código do país, DDD e número, somente dígitos. Enquanto vazio, a mensagem codificada com encodeURIComponent abre sem destinatário predefinido, com aviso visível. Nenhum número de loja foi inventado. Não há envio automático.

API futura: substitua o retorno de `loadProducts()` em `products.js` por um fetch que retorne a mesma estrutura. O catálogo já aguarda essa função, sem acoplar os filtros à origem dos dados. Backend, login, pagamentos, carrinho e painel não foram criados.

Validação: build de duas páginas e preview; acesso direto com/sem barra, categorias, produto por query, histórico, busca normalizada, combinações de filtros, linhas, faixas, estoque/consulta, ofertas, cinco ordenações, estados monetários, sem resultados, dialogs, backdrop, ESC, ciclo de Tab, restauração de foco, compartilhamento com cópia e links WhatsApp. Responsividade em 360, 375, 390, 430, 768, 1024, 1280, 1440 e 1920px, sem overflow da página. Regressões de dados podem ser repetidas com `node --test .verification/catalog-regression.mjs` na pasta de trabalho.

Próximos refinamentos: imagens específicas para cada variante, validação em celulares físicos e integração com os dados e o contato reais da loja.

## Marcas e diferenciais da Home

Nova seção depois da vitrine: composição clara editorial, marcas ilustrativas, três diferenciais e faixa de obra. Arquivos: `src/trust-section.js`, `src/trust-section.css` e `public/images/trust-construction.webp`. Integração limitada ao HTML e import do novo módulo em main.js. O favicon SVG foi adicionado à Home para eliminar a requisição ausente no console.

Desktop: título, texto e marcas à esquerda; entrega, atendimento e variedade à direita, com ícones outline e divisórias finas. A linha de provas usa apenas afirmações neutras, sem números inventados. Até 850px, ordem: título/texto, diferenciais, marcas, provas, faixa de imagem e CTA. Até 600px, ajustes de tipografia e espaçamento próprios para mobile.

As seis identidades fictícias estão em `TRUST_BRANDS`, no módulo. Para substituir, edite name e defina logo com um caminho de asset local. Não são parcerias reais declaradas. No desktop ficam alinhadas; mobile usa overflow nativo com scroll-snap proximity e parte da próxima marca visível. Não há carrossel automático.

A imagem de obra fornecida (12_22_08.png) foi otimizada para WebP, preservando o original. Faixa desktop entre 330 e 440px, object-position center 44%. Mobile: 350px, object-position 32% center, preservando o trabalhador; texto com gradiente inferior e CTA abaixo da foto. Lazy loading, decoding async e dimensões explícitas evitam carga inicial e mudanças de layout.

WhatsApp reutiliza diretamente whatsappLink e STORE_CONFIG de `src/catalog/config.js`. Não há número duplicado. IntersectionObserver revela os blocos uma vez, sem sticky, parallax, vídeo ou controle do scroll. Foco revela o conteúdo; prefers-reduced-motion exibe tudo sem animação.

Responsividade conferida em 360, 375, 390, 430, 768, 1024, 1440 e 1920px, sem overflow da página. Refinamentos futuros: trocar placeholders por logos autorizados, validar a região de entrega e definir o contato real. Nenhuma seção de fechamento ou footer foi criada.

Próximos refinamentos: substituir a identidade temporária, conectar contatos reais e calibrar compressão/enquadramento após testar em celulares físicos, sobretudo Safari/iOS e conexões lentas. O filme horizontal exige corte lateral em telas verticais; o centro da casa foi preservado.

## FAQ

Perguntas e respostas ficam no HTML da Home, após Marcas e Diferenciais. `src/faq-section.js` controla sete botões: todos começam fechados, abrir outro fecha o anterior, e clicar novamente fecha o atual. `src/faq-section.css` isola o layout e anima a expansão com grid em 320ms, opacidade e deslocamento discreto. Botões nativos suportam Tab, Enter e Espaço; aria-expanded, aria-controls e regiões identificadas acompanham o estado. Painéis fechados usam aria-hidden e inert. Foco visível e prefers-reduced-motion são respeitados.

`public/images/faq-environment.webp` é a imagem fornecida otimizada (~120KB), com lazy loading e dimensões explícitas. Desktop tem duas colunas e fundo centralizado; até 850px usa uma coluna, enquadramento 18% center e overlay reforçado. A altura acompanha o conteúdo. O CTA reutiliza o endereço gerado por whatsappLink, com a mensagem do FAQ codificada por encodeURIComponent; o número continua centralizado em STORE_CONFIG.

Verificado de 360 a 1920px, com todas as perguntas abertas individualmente, exclusividade, teclado, movimento reduzido e ausência de overflow. Build aprovado. Refinamentos futuros: validar contato e respostas comerciais reais e conferir o enquadramento em aparelhos físicos.

## Encerramento da Home

Após o FAQ, a Home mostra a casa concluída no CTA final e o footer institucional. A imagem limpa fornecida foi otimizada em `public/images/final-house.webp` (~301 KB), com carregamento lazy; títulos, botões e benefícios permanecem em HTML. O gradiente preserva a casa no lado direito do desktop e reforça a leitura no mobile. O CTA do WhatsApp reutiliza a configuração central de `src/catalog/config.js` e codifica sua mensagem com `encodeURIComponent`; o número da loja ainda precisa ser definido nessa configuração. O botão de catálogo vai para `/catalogo`.

O footer usa a identidade Alicerce existente, links para as seções reais, contato por WhatsApp, ano automático e a palavra final “CONSTRUA.”. Não foram inseridos telefone, endereço, horários ou redes sociais fictícios. Estilos isolados em `src/final-section.css`; comportamento do link e ano em `src/final-section.js`. Ajustes futuros: configurar o contato comercial real e conferir o enquadramento em dispositivos físicos.

## Largura do conteúdo da Home

O conteúdo tem largura máxima de 1456px e margens laterais fluidas; em telas menores permanecem os respiros já existentes. Vídeo, fotos e cores de fundo continuam em largura total. As áreas visíveis dos carrosséis de categorias e destaques seguem o mesmo alinhamento, com rolagem interna para alcançar os demais cartões. O catálogo mantém seu layout próprio.
