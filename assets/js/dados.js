/* ============================================================
   DADOS DO SITE — ORTOGOLD
   ------------------------------------------------------------
   ESTE É O ÚNICO ARQUIVO QUE VOCÊ PRECISA MEXER.
   Aqui ficam: contato, endereço, horário, produtos e depoimentos.
   Mexeu aqui, o site inteiro muda sozinho.
   ============================================================ */

const LOJA = {
  nome: 'OrtoGold',
  descricao: 'Fábrica de colchões e móveis para quarto em Goiânia',

  /* --- CONTATO -------------------------------------------------
     O número vai no formato internacional, só dígitos:
     55 (Brasil) + 62 (DDD) + o número.
     Trocou o número? Troca só aqui.                              */
  consultor: 'Gilson',
  cargo: 'Consultor de vendas',
  whatsapp: '5562984228825',
  whatsappVisivel: '(62) 98422-8825',

  /* --- ENDEREÇO ------------------------------------------------ */
  endereco: {
    rua: 'R. França, 384',
    bairro: 'Setor Grajaú',
    cidade: 'Goiânia',
    estado: 'GO',
    cep: '74354-292',
    plusCode: '6JQQ+6C Goiânia',
  },

  /* --- HORÁRIO -------------------------------------------------
     dia: 0 = domingo, 1 = segunda ... 6 = sábado
     abre / fecha em horas (17.5 = 17h30). null = fechado.        */
  horario: [
    { dia: 0, rotulo: 'Domingo',           abre: null, fecha: null },
    { dia: 1, rotulo: 'Segunda-feira',     abre: 8,    fecha: 18 },
    { dia: 2, rotulo: 'Terça-feira',       abre: 8,    fecha: 18 },
    { dia: 3, rotulo: 'Quarta-feira',      abre: 8,    fecha: 18 },
    { dia: 4, rotulo: 'Quinta-feira',      abre: 8,    fecha: 18 },
    { dia: 5, rotulo: 'Sexta-feira',       abre: 8,    fecha: 18 },
    { dia: 6, rotulo: 'Sábado',            abre: 8,    fecha: 17 },
  ],

  /* --- REDES ---------------------------------------------------- */
  instagram: 'orto.gold',
  instagramUrl: 'https://www.instagram.com/orto.gold/',

  /* --- ENDEREÇO DO SITE NO AR ----------------------------------
     Troque depois de publicar. Serve para a prévia do WhatsApp.  */
  site: 'https://loja-de-estofados.vercel.app',
};

/* ============================================================
   FAIXA DE DESTAQUE (logo abaixo do topo)
   ------------------------------------------------------------
   Cada um vira um cartão com foto. A foto fica em assets/img/.
   Sem 'foto', o cartão continua funcionando: mostra só o ícone
   sobre o fundo escuro da marca, sem buraco na tela.
   ============================================================ */
const DESTAQUES = [
  { icone: 'fabrica',   titulo: 'Fábrica própria',    texto: 'Direto de quem produz',
    foto: 'destaque-fabrica.webp', alt: 'Estrutura de uma base sendo montada na fábrica' },

  { icone: 'entrega',   titulo: 'Entrega em Goiânia', texto: 'Combine com o consultor',
    foto: 'destaque-entrega.webp', alt: 'Cama box montada e arrumada no quarto do cliente' },

  { icone: 'medida',    titulo: 'Sob medida',         texto: 'Seu colchão do seu jeito',
    foto: 'destaque-medida.webp',  alt: 'Cabeceira estofada feita na medida da cama' },

  { icone: 'atendente', titulo: 'Atendimento direto', texto: 'Fale com o Gilson',
    foto: 'gilson-v2.webp',        alt: 'Gilson, consultor de vendas da OrtoGold' },
];

/* ============================================================
   COMO O COLCHÃO É FEITO
   Cada etapa acende conforme a pessoa rola a página.
   'em' = em que ponto do vídeo a etapa acende (0 = início, 1 = fim)
   ============================================================ */
const ETAPAS_FABRICA = [
  { em: 0.05, titulo: 'Estrutura',   texto: 'Molas ensacadas ou bloco de espuma de alta densidade, montados na medida certa.' },
  { em: 0.28, titulo: 'Camadas',     texto: 'Espumas de conforto sobrepostas — cada camada define a firmeza que você sente.' },
  { em: 0.52, titulo: 'Acabamento',  texto: 'Tecido matelassado costurado ponto a ponto, com bordas reforçadas.' },
  { em: 0.75, titulo: 'Conferência', texto: 'Medida, firmeza e costura conferidas peça por peça antes de sair.' },
  { em: 0.93, titulo: 'Sua casa',    texto: 'Sai da fábrica e vai direto para o seu quarto. Sem intermediário.' },
];

/* ============================================================
   FRASES QUE ENTRAM E SAEM COM O FILME
   ------------------------------------------------------------
   O site tem trechos em que o vídeo roda conforme a pessoa
   desliza o dedo ou o mouse. Enquanto o vídeo roda, estas
   frases vão trocando por cima dele.

   "em" é o ponto do trecho onde a frase entra: 0 é o começo do
   trecho e 1 é o fim. Cada frase fica na tela até a próxima
   entrar. Precisa estar em ordem crescente.

   Quem tem "botao" ganha o botão do WhatsApp embaixo — use isso
   só na última frase, que é onde a pessoa já foi convencida.

   Se o vídeo não carregar, estas frases viram uma lista normal,
   uma embaixo da outra. Nada some da tela por causa disso.
   ============================================================ */
const CENAS = {
  /* Topo. As frases entram depois que o título do site sai de
     cena, para as duas coisas não brigarem na mesma tela. */
  hero: [
    { em: 0.42,
      titulo: 'Um terço da sua vida acontece aqui.',
      texto: 'São oito horas por noite, todas as noites. A cama não devia ser a última coisa da lista.' },

    { em: 0.72,
      titulo: 'Fábrica própria, sem atravessador.',
      texto: 'O colchão é montado na nossa linha de produção e vai direto para o seu quarto.' },
  ],

  /* Trecho do quarto pronto: é aqui que a proposta é feita. */
  quarto: [
    { em: 0,
      titulo: 'Acordar inteiro.',
      texto: 'Colchão com a sustentação certa segura a coluna a noite toda. A diferença aparece logo na primeira manhã.' },

    { em: 0.24,
      titulo: 'Dormir sem sentir o outro virar.',
      texto: 'Nas molas ensacadas cada mola trabalha sozinha. Do lado de lá pode virar a noite inteira — do lado de cá o sono continua.' },

    { em: 0.48,
      titulo: 'A firmeza é você quem escolhe.',
      texto: 'Macio, médio ou extra firme. Deitar antes de comprar muda tudo, e na fábrica você deita em todos.' },

    { em: 0.70,
      titulo: 'O quarto inteiro combinando.',
      texto: 'Colchão, base, cabeceira, travesseiro e enxoval saem da mesma fábrica: mesma medida, mesma entrega, um orçamento só.' },

    { em: 0.88,
      titulo: 'Conta pro Gilson como você dorme.',
      texto: 'Ele pergunta seu peso, como você deita e o tamanho do quarto — e monta o conjunto certo para você.',
      botao: 'Montar meu quarto com o Gilson' },
  ],
};

/* ============================================================
   CATÁLOGO
   ------------------------------------------------------------
   ATENÇÃO: os itens abaixo são um ESQUELETO para você preencher.
   Troque o 'nome' e a 'descricao' pelos produtos que a OrtoGold
   realmente vende, e coloque a foto em assets/img/.

   NÃO existe preço aqui de propósito — o site inteiro leva a
   pessoa para conversar com o Gilson no WhatsApp.

   foto: nome do arquivo dentro de assets/img/
         deixe null se ainda não tiver foto — o site desenha
         uma ilustração no lugar, não fica quadrado cinza.
   ============================================================ */
const CATEGORIAS = [
  { id: 'colchoes',    nome: 'Colchões',    icone: 'colchao' },
  { id: 'bases',       nome: 'Bases',       icone: 'base' },
  { id: 'cabeceiras',  nome: 'Cabeceiras',  icone: 'cabeceira' },
  { id: 'travesseiros',nome: 'Travesseiros',icone: 'travesseiro' },
  { id: 'enxoval',     nome: 'Enxoval',     icone: 'edredom' },
  { id: 'moveis',      nome: 'Móveis',      icone: 'sofa' },
];

const PRODUTOS = [
  /* ---------------------- COLCHÕES ----------------------
     Os nomes aqui são os que o pessoal de loja de colchão usa
     mesmo: densidade da espuma (D20, D33, D45), tipo de mola,
     pillow. As medidas em centímetros vão nas tags porque quem
     compra colchão pergunta o tamanho antes de qualquer coisa. */
  { id: 'c1', cat: 'colchoes', nome: 'Colchão de Molas Ensacadas',
    descricao: 'Molas embaladas uma a uma. Quem dorme do lado vira e você não sente. Tecido em malha com pillow no topo.',
    tags: ['Solteiro 88×188', 'Casal 138×188', 'Queen 158×198', 'King 193×203'], foto: 'colchao-premium.webp' },

  { id: 'c2', cat: 'colchoes', nome: 'Colchão Espuma D33',
    descricao: 'Densidade 33, firmeza média. É o mais vendido da fábrica: aguenta o dia a dia sem afundar no meio.',
    tags: ['Solteiro 88×188', 'Casal 138×188', 'Queen 158×198'], foto: 'prod-04.webp' },

  { id: 'c3', cat: 'colchoes', nome: 'Colchão Pillow Top',
    descricao: 'Pillow costurado no topo. Recebe o corpo macio e sustenta firme embaixo. Altura de 30 cm a 35 cm.',
    tags: ['Casal 138×188', 'Queen 158×198', 'King 193×203'], foto: 'prod-02.webp' },

  { id: 'c4', cat: 'colchoes', nome: 'Colchão Ortopédico D45',
    descricao: 'Densidade 45, extra firme. Indicado para quem tem dor na coluna ou pesa mais.',
    tags: ['Solteiro 88×188', 'Casal 138×188', 'Queen 158×198', 'King 193×203'], foto: 'colchao-d45.webp' },

  { id: 'c5', cat: 'colchoes', nome: 'Colchão Espuma D20',
    descricao: 'Linha de entrada, espuma D20 certificada. Boa para quarto de hóspede e casa de praia.',
    tags: ['Solteiro 78×188', 'Solteiro 88×188', 'Casal 138×188'], foto: 'colchao-d20.webp' },

  { id: 'c6', cat: 'colchoes', nome: 'Colchão Sob Medida',
    descricao: 'Beliche, treliche, barco, motorhome, cama antiga que ninguém mais fabrica. Manda a medida no WhatsApp.',
    tags: ['Medida livre', 'Feito na fábrica'], foto: 'colchao-sob-medida.webp' },

  /* ------------------------ BASES ------------------------
     Vocabulário de loja: box conjugada é base mais colchão no
     mesmo conjunto, baú abre por cima e bipartido vem em duas
     partes para passar em porta estreita e elevador. */
  { id: 'b1', cat: 'bases', nome: 'Cama Box Conjugada',
    descricao: 'Base e colchão no mesmo conjunto, altura boa para sentar e levantar. Pés de madeira ou de plástico.',
    tags: ['Solteiro 88×188', 'Casal 138×188', 'Queen 158×198', 'King 193×203'], foto: 'base-conjugada.webp' },

  { id: 'b2', cat: 'bases', nome: 'Cama Box Baú',
    descricao: 'Levanta por cima com pistão a gás e vira armário. Guarda edredom, mala e o que não cabe no guarda-roupa.',
    tags: ['Solteiro 88×188', 'Casal 138×188', 'Queen 158×198'], foto: 'base-bau.webp' },

  { id: 'b3', cat: 'bases', nome: 'Cama Box Baú Bipartido',
    descricao: 'O baú vem em duas partes: passa em porta estreita, corredor e elevador. De casal para cima.',
    tags: ['Casal 138×188', 'Queen 158×198', 'King 193×203'], foto: 'base-bau-bipartido.webp' },

  { id: 'b4', cat: 'bases', nome: 'Cama Box Bicama',
    descricao: 'Uma cama auxiliar guardada embaixo da outra, com rodízio. Resolve quarto pequeno e visita que dorme.',
    tags: ['Solteiro 78×188', 'Solteiro 88×188'], foto: 'prod-05.webp' },

  { id: 'b5', cat: 'bases', nome: 'Box Base Simples',
    descricao: 'Só a base, sem baú e sem colchão. Para quem já tem colchão bom e quer trocar só a cama.',
    tags: ['Solteiro 88×188', 'Casal 138×188', 'Queen 158×198', 'King 193×203'], foto: 'base-simples.webp' },

  /* --------------------- CABECEIRAS ----------------------
     Cabeceira se mede pela largura da cama: casal 1,40 m,
     queen 1,60 m e king 1,95 m. */
  { id: 'h1', cat: 'cabeceiras', nome: 'Cabeceira Estofada Lisa',
    descricao: 'Painel inteiro estofado, acabamento limpo. Suede, linho ou corino, você escolhe a cor.',
    tags: ['Casal 1,40 m', 'Queen 1,60 m', 'King 1,95 m'], foto: 'cabeceira-lisa.webp' },

  { id: 'h2', cat: 'cabeceiras', nome: 'Cabeceira Capitonê',
    descricao: 'Botões em losango, o modelo mais pedido da fábrica. Dá cara de quarto de revista.',
    tags: ['Casal 1,40 m', 'Queen 1,60 m', 'King 1,95 m'], foto: 'cabeceira-capitone.webp' },

  { id: 'h3', cat: 'cabeceiras', nome: 'Cabeceira Ripada',
    descricao: 'Gomos verticais estofados, visual moderno e mais alto. Fica bem em parede de cor escura.',
    tags: ['Queen 1,60 m', 'King 1,95 m', 'Sob medida'], foto: 'cabeceira-ripada.webp' },

  /* -------------------- TRAVESSEIROS ---------------------
     Medida de travesseiro no Brasil: 50×70 é o padrão e 50×90
     é o king, que pede fronha maior. */
  { id: 't1', cat: 'travesseiros', nome: 'Travesseiro Viscoelástico',
    descricao: 'Espuma viscoelástica: molda no formato do pescoço e volta ao normal. Para quem acorda com dor.',
    tags: ['50×70 padrão', '50×90 king'], foto: 'travesseiro-visco.webp' },

  { id: 't2', cat: 'travesseiros', nome: 'Travesseiro de Látex',
    descricao: 'Firme e arejado, não achata com o tempo. Dura mais que os outros.',
    tags: ['50×70 padrão'], foto: 'travesseiro-latex.webp' },

  { id: 't3', cat: 'travesseiros', nome: 'Travesseiro de Fibra Siliconada',
    descricao: 'Macio e leve, o mais fácil de lavar. Bom para quem dorme de bruços.',
    tags: ['50×70 padrão', '50×90 king'], foto: 'travesseiro-fibra.webp' },

  /* ----------------------- ENXOVAL ----------------------- */
  { id: 'e1', cat: 'enxoval', nome: 'Jogo de Cama',
    descricao: 'Lençol com elástico, lençol de cima e fronhas. Vários padrões e contagens de fio.',
    tags: ['Solteiro', 'Casal', 'Queen', 'King'], foto: 'enxoval-jogo-cama.webp' },

  { id: 'e2', cat: 'enxoval', nome: 'Edredom',
    descricao: 'Enchimento em fibra siliconada, quente sem pesar em cima do corpo.',
    tags: ['Solteiro', 'Casal', 'Queen', 'King'], foto: 'enxoval-edredom.webp' },

  { id: 'e3', cat: 'enxoval', nome: 'Protetor de Colchão Impermeável',
    descricao: 'Com elástico nos cantos. Segura líquido, protege o colchão e sai na máquina de lavar.',
    tags: ['Solteiro', 'Casal', 'Queen', 'King'], foto: 'enxoval-protetor.webp' },

  /* ------------------------ MÓVEIS ----------------------- */
  { id: 'm1', cat: 'moveis', nome: 'Sofá-Cama',
    descricao: 'Sofá de dia, cama de noite. Para sala de apartamento e escritório que vira quarto.',
    tags: ['2 lugares', '3 lugares', 'Abre solteiro', 'Abre casal'], foto: null },

  { id: 'm2', cat: 'moveis', nome: 'Recamier',
    descricao: 'Banco estofado no pé da cama. Fecha o visual do quarto e ainda serve de apoio.',
    tags: ['Casal 1,40 m', 'Queen 1,60 m', 'King 1,95 m'], foto: null },

  { id: 'm3', cat: 'moveis', nome: 'Poltrona',
    descricao: 'Estofada, para o canto de leitura ou para amamentar no quarto do bebê.',
    tags: ['1 lugar', 'Com puff'], foto: 'poltrona.webp' },

  { id: 'm4', cat: 'moveis', nome: 'Buffet e Aparador',
    descricao: 'Peça de apoio para sala e quarto, em laca com pés de madeira.',
    tags: ['Sob medida'], foto: 'prod-01.webp' },
];

/* ============================================================
   DEPOIMENTOS
   ------------------------------------------------------------
   DEIXE VAZIO ATÉ TER DEPOIMENTO DE VERDADE.
   Enquanto a lista estiver vazia, a seção some do site sozinha.
   Nunca invente cliente — copie o texto real e o nome real.

   Para adicionar, siga o modelo:
   { nome: 'Maria Silva', texto: 'Comprei e adorei...', origem: 'WhatsApp' },
   ============================================================ */
const DEPOIMENTOS = [
  // vazio de propósito — preencha com elogios reais
];

/* ============================================================
   IMAGENS DO CONSULTOR
   ------------------------------------------------------------
   As duas fotos do Gilson já estão em assets/img/. Se um dia
   trocar a foto, é só mudar o nome do arquivo aqui. Voltando
   para null, o site desenha um avatar no estilo da marca.

   O site NÃO fica testando se o arquivo existe — cada tentativa
   perdida custa carregamento no 4G. Ele só usa o que está
   declarado aqui.
   ============================================================ */
const IMAGENS = {
  gilsonCorpo: 'gilson-v2.webp',        // busto 3x4, para o cartão do consultor
  gilsonRosto: 'gilson-rosto-v2.webp',  // só o rosto, para o botão redondo
};

/* ============================================================
   FOTOS DO INSTAGRAM QUE APARECEM NA SEÇÃO "NAS REDES"
   ------------------------------------------------------------
   Coloque a imagem em assets/img/ e escreva o nome do arquivo
   aqui. Enquanto a lista estiver vazia, o site desenha
   ilustrações no lugar — nunca fica buraco.

   Só liste arquivo que EXISTE. O site não fica adivinhando se
   a foto está lá: cada tentativa perdida custa carregamento.

   Modelo:
   { arquivo: 'ig-01.jpg', alt: 'Cama box casal com cabeceira capitonê' },
   ============================================================ */
const FOTOS_INSTAGRAM = [
  { arquivo: 'prod-02.webp', alt: 'Cama box com cabeceira branca e colchão pillow top' },
  { arquivo: 'prod-07.webp', alt: 'Quarto com cabeceira capitonê bege' },
  { arquivo: 'prod-08.webp', alt: 'Quarto com cabeceira estofada cinza' },
  { arquivo: 'prod-06.webp', alt: 'Cama box baú aberta, cheia de roupa de cama' },
  { arquivo: 'prod-04.webp', alt: 'Base bicama com os dois colchões' },
  { arquivo: 'prod-01.webp', alt: 'Buffet aparador de madeira e laca' },
];

/* ============================================================
   VÍDEOS QUE ROLAM COM O SCROLL
   ------------------------------------------------------------
   O site não toca vídeo: ele desenha quadro a quadro conforme
   você rola, como um filme que você controla com o dedo.

   Para ligar cada um:
   1. coloque o MP4 na pasta  assets/video/
   2. rode:  npm run frames
   3. o script recorta os quadros e preenche o 'quadros' abaixo

   Enquanto 'quadros' for 0, a seção mostra a versão estática —
   o site nunca fica com buraco preto.
   ============================================================ */
const FILMES = {
  hero:    { pasta: 'assets/video/hero',    quadros: 960, largura: 1280, altura: 720 },
  fabrica: { pasta: 'assets/video/fabrica', quadros: 192, largura: 1280, altura: 720 },
  quarto:  { pasta: 'assets/video/quarto',  quadros: 192, largura: 1280, altura: 720 },
};

/* ============================================================
   PONTO DE ENCAIXE — PAGAMENTO / ORÇAMENTO ONLINE
   ------------------------------------------------------------
   Hoje todo pedido vai para o WhatsApp do Gilson.
   Se um dia quiser orçamento automático ou pagamento no site,
   é aqui que entra. Não está construído: falta decidir a
   ferramenta e cadastrar os dados da empresa.
   ============================================================ */
