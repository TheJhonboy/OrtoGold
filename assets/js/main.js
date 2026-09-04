/* ============================================================
   ORTOGOLD — interface
   Monta o site inteiro a partir do arquivo dados.js.
   ============================================================ */

(function () {
  'use strict';

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ---------------------------------------------------------
     WHATSAPP
     --------------------------------------------------------- */
  const MENSAGENS = {
    topo:       'Olá! Vim pelo site da OrtoGold e gostaria de falar com o Gilson.',
    menu:       'Olá! Vim pelo site da OrtoGold e gostaria de falar com o Gilson.',
    hero:       'Olá! Vim pelo site da OrtoGold. Quero saber mais sobre os produtos de vocês.',
    cena:       'Olá, Gilson! Vim pelo site da OrtoGold. Quero montar meu quarto completo — colchão, base e cabeceira. Por onde começamos?',
    consultor:  'Olá, Gilson! Vim pelo site da OrtoGold e queria um orçamento.',
    casa:       'Olá! Vim pelo site da OrtoGold.',
    final:      'Olá, Gilson! Vim pelo site da OrtoGold e quero saber as condições.',
    flutuante:  'Olá, Gilson! Vim pelo site da OrtoGold.',
    barra:      'Olá, Gilson! Vim pelo site da OrtoGold.',
    rodape:     'Olá! Vim pelo site da OrtoGold.',
  };

  function linkZap(mensagem) {
    return 'https://wa.me/' + LOJA.whatsapp + '?text=' + encodeURIComponent(mensagem);
  }

  function ligarZaps() {
    $$('[data-zap]').forEach((el) => {
      const chave = el.dataset.zap;
      el.href = linkZap(MENSAGENS[chave] || MENSAGENS.flutuante);
      el.target = '_blank';
      el.rel = 'noopener';
    });
  }

  /* ---------------------------------------------------------
     ÍCONES
     --------------------------------------------------------- */
  function ligarIcones(raiz) {
    $$('[data-icone]', raiz).forEach((el) => {
      if (el.dataset.iconePronto) return;
      el.innerHTML = Ilustracoes.icone(el.dataset.icone);
      el.dataset.iconePronto = '1';
    });
  }

  /* ---------------------------------------------------------
     HORÁRIO — aberto ou fechado agora
     --------------------------------------------------------- */
  function faixaDeHoje() {
    const agora = new Date();
    return LOJA.horario.find((h) => h.dia === agora.getDay());
  }

  function estaAberto() {
    const faixa = faixaDeHoje();
    if (!faixa || faixa.abre === null) return false;
    const agora = new Date();
    const h = agora.getHours() + agora.getMinutes() / 60;
    return h >= faixa.abre && h < faixa.fecha;
  }

  function formatarHora(v) {
    if (v === null) return 'Fechado';
    const h = Math.floor(v);
    const m = Math.round((v - h) * 60);
    return m ? h + 'h' + String(m).padStart(2, '0') : h + 'h';
  }

  function montarSeloAberto() {
    const selo = $('#selo-aberto');
    const faixa = faixaDeHoje();
    if (!selo || !faixa) return;

    const aberto = estaAberto();
    const proxima = LOJA.horario
      .concat(LOJA.horario)
      .slice(new Date().getDay() + 1)
      .find((h) => h.abre !== null);

    selo.innerHTML =
      '<span class="selo__ponto' + (aberto ? '' : ' selo__ponto--off') + '"></span>' +
      (aberto
        ? 'Aberto agora · até ' + formatarHora(faixa.fecha)
        : 'Fechado agora · abre ' +
          (faixa.abre !== null && new Date().getHours() < faixa.abre
            ? 'hoje às ' + formatarHora(faixa.abre)
            : proxima ? proxima.rotulo.toLowerCase() + ' às ' + formatarHora(proxima.abre) : 'em breve'));
    selo.hidden = false;

    const barra = $('#barra-status');
    if (barra) barra.textContent = aberto ? 'Online agora' : 'Deixe sua mensagem';

    const linha = $('#consultor-horario');
    if (linha) {
      linha.textContent = aberto
        ? 'O Gilson está atendendo agora.'
        : 'Fora do horário ele responde assim que abrir — pode mandar mesmo assim.';
    }
  }

  function montarHorario() {
    const lista = $('#casa-horario');
    if (!lista) return;
    const hoje = new Date().getDay();
    /* Começa na segunda-feira, que é como as pessoas leem. */
    const ordem = LOJA.horario.slice(1).concat(LOJA.horario.slice(0, 1));
    lista.innerHTML = ordem
      .map(
        (h) =>
          '<li' + (h.dia === hoje ? ' data-hoje="sim"' : '') + '>' +
          '<span>' + h.rotulo + '</span>' +
          '<span>' + (h.abre === null ? 'Fechado' : formatarHora(h.abre) + ' às ' + formatarHora(h.fecha)) + '</span>' +
          '</li>'
      )
      .join('');
  }

  /* ---------------------------------------------------------
     DESTAQUES
     --------------------------------------------------------- */
  function montarDestaques() {
    const alvo = $('#destaques-grade');
    if (!alvo) return;
    alvo.innerHTML = DESTAQUES.map(
      (d) =>
        '<div class="destaque">' +
        '<span class="destaque__ico" data-icone="' + d.icone + '"></span>' +
        '<div><strong>' + d.titulo + '</strong><span>' + d.texto + '</span></div>' +
        '</div>'
    ).join('');
    ligarIcones(alvo);
  }

  /* ---------------------------------------------------------
     CATÁLOGO
     --------------------------------------------------------- */
  function cartaoProduto(p) {
    const midia = p.foto
      ? '<img src="assets/img/' + p.foto + '" alt="' + p.nome + '" loading="lazy" decoding="async" width="400" height="300">'
      : Ilustracoes.substitutoFoto(p.cat, p.nome);

    const tags = (p.tags || [])
      .map((t) => '<span class="produto__tag">' + t + '</span>')
      .join('');

    const msg =
      'Olá, Gilson! Vim pelo site da OrtoGold e tenho interesse em: ' +
      p.nome + '. Pode me passar mais informações?';

    return (
      '<article class="produto">' +
      '<div class="produto__midia" data-cat="' + p.cat + '">' + midia + '</div>' +
      '<div class="produto__corpo">' +
      '<h3 class="produto__nome">' + p.nome + '</h3>' +
      '<p class="produto__desc">' + p.descricao + '</p>' +
      (tags ? '<div class="produto__tags">' + tags + '</div>' : '') +
      '<a class="botao botao--zap" href="' + linkZap(msg) + '" target="_blank" rel="noopener">' +
      '<span class="botao__ico" data-icone="whatsapp"></span><span>Perguntar ao Gilson</span></a>' +
      '</div></article>'
    );
  }

  function montarCatalogo() {
    const abas = $('#abas');
    const grade = $('#produtos');
    if (!abas || !grade) return;

    abas.innerHTML = CATEGORIAS.map(
      (c, i) =>
        '<button class="aba" type="button" role="tab" id="aba-' + c.id + '" ' +
        'aria-selected="' + (i === 0 ? 'true' : 'false') + '" data-cat="' + c.id + '">' +
        '<span class="aba__ico" data-icone="' + c.icone + '"></span>' + c.nome + '</button>'
    ).join('');
    ligarIcones(abas);

    function mostrar(cat) {
      const itens = PRODUTOS.filter((p) => p.cat === cat);
      grade.innerHTML = itens.length
        ? itens.map(cartaoProduto).join('')
        : '<p class="secao__texto">Em breve. Fale com o Gilson que ele te conta o que temos disponível.</p>';
      ligarIcones(grade);
      grade.setAttribute('aria-labelledby', 'aba-' + cat);
    }

    abas.addEventListener('click', (ev) => {
      const botao = ev.target.closest('.aba');
      if (!botao) return;
      $$('.aba', abas).forEach((b) => b.setAttribute('aria-selected', String(b === botao)));
      mostrar(botao.dataset.cat);
    });

    mostrar(CATEGORIAS[0].id);
  }

  /* ---------------------------------------------------------
     ETAPAS DA FÁBRICA
     --------------------------------------------------------- */
  function montarEtapas() {
    const lista = $('#etapas');
    if (!lista) return;
    lista.innerHTML = ETAPAS_FABRICA.map(
      (e, i) =>
        '<li class="etapa" data-em="' + e.em + '">' +
        '<span class="etapa__num">' + (i + 1) + '</span>' +
        '<div><strong>' + e.titulo + '</strong><p>' + e.texto + '</p></div>' +
        '</li>'
    ).join('');
  }

  function atualizarEtapas(p) {
    const itens = $$('.etapa');
    if (!itens.length) return;
    let atual = -1;
    itens.forEach((el, i) => {
      if (p >= parseFloat(el.dataset.em)) atual = i;
    });
    itens.forEach((el, i) => {
      el.classList.toggle('etapa--passou', i < atual);
      el.classList.toggle('etapa--atual', i === atual);
    });
    const barra = $('#etapas-progresso');
    if (barra) barra.style.width = (p * 100).toFixed(1) + '%';
  }

  /* ---------------------------------------------------------
     FRASES QUE TROCAM ENQUANTO O FILME ROLA
     A primeira frase de cada trecho vira o <h2> da seção: a
     seção precisa de um título de verdade para o Google e para
     o leitor de tela, e é essa a frase que abre o assunto.
     --------------------------------------------------------- */
  function montarCenas(alvo, lista) {
    const caixa = $(alvo);
    if (!caixa || !lista || !lista.length) return;

    caixa.innerHTML = lista
      .map((c, i) => {
        const marca = i === 0 ? 'h2' : 'p';
        const acao = c.botao
          ? '<div class="cena__acao">' +
            '<a class="botao botao--zap botao--grande" data-zap="cena" href="#">' +
            '<span class="botao__ico" data-icone="whatsapp"></span>' +
            '<span>' + c.botao + '</span>' +
            '</a></div>'
          : '';
        return (
          '<div class="cena" data-em="' + c.em + '" data-ativa="nao">' +
          '<' + marca + ' class="titulo titulo--claro cena__titulo">' + c.titulo + '</' + marca + '>' +
          '<p class="secao__texto secao__texto--claro cena__texto">' + c.texto + '</p>' +
          acao +
          '</div>'
        );
      })
      .join('');
  }

  /* Acende a última frase cujo ponto de entrada já passou. Antes
     da primeira, nenhuma acende — no topo isso deixa o título do
     site sozinho na tela antes das frases começarem. */
  function atualizarCenas(alvo, p) {
    const itens = $$(alvo + ' .cena');
    if (!itens.length) return;
    let atual = -1;
    itens.forEach((el, i) => {
      if (p >= parseFloat(el.dataset.em)) atual = i;
    });
    itens.forEach((el, i) => {
      el.dataset.ativa = i === atual ? 'sim' : 'nao';
    });
  }

  /* O topo se apaga aos poucos enquanto o filme roda. O CSS faz
     a conta a partir de --saida; aqui só entregamos o número. */
  function progressoHero(p) {
    const hero = $('#hero');
    if (!hero) return;
    hero.style.setProperty('--saida', p.toFixed(3));
    hero.dataset.saiu = p > 0.34 ? 'sim' : 'nao';
    atualizarCenas('#cenas-hero', p);
  }


  /* ---------------------------------------------------------
     FILMES CONTROLADOS PELO SCROLL
     --------------------------------------------------------- */
  /* Mede o quanto já se rolou dentro de uma seção alta e avisa
     quem precisa saber. Vale de 0 (a seção acabou de encostar no
     topo da tela) a 1 (chegou no fim dela).

     O texto NUNCA depende do filme para acender: se um quadro
     não chegasse, a frase ficaria apagada na tela para sempre.
     Os dois leem a mesma medida, então andam juntos.

     `parado` é o valor usado quando a seção não é alta o
     bastante para rolar por dentro — sem filme, por exemplo.
     Cada seção pede um: no topo é 0, para o título continuar
     inteiro; na fábrica é 0.5, para uma etapa ficar acesa. */
  function acompanharSecao(alvoSecao, parado, aoProgredir) {
    const secao = $(alvoSecao);
    if (!secao) return;

    let agendado = false;
    const medir = () => {
      agendado = false;
      const caixa = secao.getBoundingClientRect();
      const percurso = caixa.height - window.innerHeight;
      if (percurso <= 0) { aoProgredir(parado); return; }
      aoProgredir(Math.min(1, Math.max(0, -caixa.top / percurso)));
    };
    /* Uma medida por quadro de tela. Sem isso o scroll do celular
       dispara a conta dezenas de vezes seguidas e engasga. */
    const agendar = () => {
      if (agendado) return;
      agendado = true;
      window.requestAnimationFrame(medir);
    };

    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', agendar, { passive: true });

    /* A seção só fica alta depois que o primeiro quadro do filme
       chega — e isso acontece sozinho, sem scroll nenhum. Sem
       reparar nessa mudança de altura, a conta continuaria com a
       medida antiga até a pessoa rolar de novo. */
    if (window.ResizeObserver) new window.ResizeObserver(agendar).observe(secao);

    medir();
  }

  function ligarFilmes() {
    const mapa = [
      { chave: 'hero',    secao: '#hero',    video: '#hero-video',    parado: 0,   texto: progressoHero },
      { chave: 'fabrica', secao: '#fabrica', video: '#fabrica-video', parado: 0.5, texto: atualizarEtapas },
    ];

    mapa.forEach((cfg) => {
      const dados = FILMES[cfg.chave];
      const secao = $(cfg.secao);

      /* O topo roda um vídeo de verdade: mais nítido e mais leve
         que a mesma coisa fatiada em 1920 imagens. As outras
         seções continuam em quadros, que já servem bem. */
      const video = cfg.video ? $(cfg.video) : null;
      if (video && secao && typeof window.FilmeVideo === 'function') {
        new window.FilmeVideo({ secao: secao, video: video }).iniciar();
        acompanharSecao(cfg.secao, cfg.parado, cfg.texto);
        return;
      }

      const canvas = cfg.canvas ? $(cfg.canvas) : null;

      if (dados && dados.quadros && secao && canvas) {
        new FilmeScroll({
          secao: secao,
          canvas: canvas,
          pasta: dados.pasta,
          total: dados.quadros,
          largura: dados.largura,
          altura: dados.altura,
        }).iniciar();
      }

      acompanharSecao(cfg.secao, cfg.parado, cfg.texto);
    });
  }

  /* ---------------------------------------------------------
     DEPOIMENTOS
     --------------------------------------------------------- */
  function montarDepoimentos() {
    const secao = $('#depoimentos');
    const grade = $('#depoimentos-grade');
    if (!secao || !grade) return;

    if (!DEPOIMENTOS.length) { secao.hidden = true; return; }

    grade.innerHTML = DEPOIMENTOS.map((d) => {
      const iniciais = d.nome.split(/\s+/).slice(0, 2).map((n) => n[0]).join('').toUpperCase();
      return (
        '<figure class="depoimento">' +
        '<blockquote class="depoimento__texto">“' + d.texto + '”</blockquote>' +
        '<figcaption class="depoimento__pe">' +
        '<span class="depoimento__iniciais" aria-hidden="true">' + iniciais + '</span>' +
        '<span><strong>' + d.nome + '</strong><small>' + (d.origem || 'Cliente OrtoGold') + '</small></span>' +
        '</figcaption></figure>'
      );
    }).join('');
    secao.hidden = false;
  }

  /* ---------------------------------------------------------
     REDES
     --------------------------------------------------------- */
  function montarRedes() {
    const grade = $('#grade-instagram');
    const link = $('#link-instagram');
    if (link) link.href = LOJA.instagramUrl;
    $('#arroba-instagram') && ($('#arroba-instagram').textContent = '@' + LOJA.instagram);
    const rodapeIg = $('#rodape-instagram');
    if (rodapeIg) { rodapeIg.href = LOJA.instagramUrl; rodapeIg.textContent = '@' + LOJA.instagram; }

    if (!grade) return;
    const fotos = (typeof FOTOS_INSTAGRAM !== 'undefined' ? FOTOS_INSTAGRAM : []).slice(0, 6);
    const vazios = ['colchoes', 'cabeceiras', 'bases', 'moveis', 'travesseiros', 'enxoval'];

    grade.innerHTML = Array.from({ length: 6 }, (_, i) => {
      const f = fotos[i];
      const dentro = f
        ? '<img src="assets/img/' + f.arquivo + '" alt="' + (f.alt || 'Produto OrtoGold') +
          '" loading="lazy" decoding="async" width="300" height="300">'
        : Ilustracoes.substitutoFoto(vazios[i], 'produto OrtoGold');
      return '<a class="redes__foto" href="' + LOJA.instagramUrl + '" target="_blank" rel="noopener" data-cat="' + vazios[i] + '">' + dentro + '</a>';
    }).join('');
  }

  /* ---------------------------------------------------------
     ONDE ESTAMOS
     --------------------------------------------------------- */
  function enderecoCompleto() {
    const e = LOJA.endereco;
    return e.rua + ' — ' + e.bairro + ', ' + e.cidade + ' - ' + e.estado + ', ' + e.cep;
  }

  function montarCasa() {
    const busca = encodeURIComponent(enderecoCompleto());

    const end = $('#casa-endereco');
    if (end) end.textContent = enderecoCompleto();

    const rota = $('#casa-rota');
    if (rota) rota.href = 'https://www.google.com/maps/dir/?api=1&destination=' + busca;

    const zapCasa = $('#casa-zap');
    if (zapCasa) zapCasa.textContent = LOJA.whatsappVisivel;

    const zapRodape = $('#rodape-zap');
    if (zapRodape) zapRodape.textContent = LOJA.whatsappVisivel;

    const numero = $('#consultor-numero');
    if (numero) numero.textContent = LOJA.whatsappVisivel;

    const endRodape = $('#rodape-endereco');
    if (endRodape) endRodape.textContent = LOJA.endereco.rua + ', ' + LOJA.endereco.bairro;

    const cats = $('#rodape-categorias');
    if (cats) {
      cats.innerHTML = CATEGORIAS.map(
        (c) => '<li><a href="#catalogo" data-cat="' + c.id + '">' + c.nome + '</a></li>'
      ).join('');
      cats.addEventListener('click', (ev) => {
        const a = ev.target.closest('[data-cat]');
        if (!a) return;
        const aba = $('#aba-' + a.dataset.cat);
        if (aba) setTimeout(() => aba.click(), 400);
      });
    }

    /* O mapa só desce quando a pessoa pede — sozinho ele pesa
       mais que o site inteiro. */
    const botao = $('#abrir-mapa');
    if (botao) {
      botao.addEventListener('click', () => {
        const frame = document.createElement('iframe');
        frame.src = 'https://www.google.com/maps?q=' + busca + '&output=embed';
        frame.loading = 'lazy';
        frame.title = 'Mapa da fábrica OrtoGold';
        frame.referrerPolicy = 'no-referrer-when-downgrade';
        frame.allowFullscreen = true;
        botao.replaceWith(frame);
      });
    }
  }

  /* ---------------------------------------------------------
     MENU DO CELULAR
     --------------------------------------------------------- */
  function ligarMenu() {
    const botao = $('.menu__abrir');
    const painel = $('#menu-celular');
    if (!botao || !painel) return;

    botao.addEventListener('click', () => {
      const aberto = botao.getAttribute('aria-expanded') === 'true';
      botao.setAttribute('aria-expanded', String(!aberto));
      painel.hidden = aberto;
    });

    painel.addEventListener('click', (ev) => {
      if (!ev.target.closest('a')) return;
      botao.setAttribute('aria-expanded', 'false');
      painel.hidden = true;
    });

    document.addEventListener('keydown', (ev) => {
      if (ev.key !== 'Escape' || painel.hidden) return;
      botao.setAttribute('aria-expanded', 'false');
      painel.hidden = true;
      botao.focus();
    });
  }

  /* ---------------------------------------------------------
     FOTO QUE NÃO CARREGA VIRA ILUSTRAÇÃO
     O evento 'error' de imagem não sobe pela árvore:
     é preciso escutar na fase de captura.
     --------------------------------------------------------- */
  function avatarConsultor() {
    return (
      '<svg viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg" role="img" ' +
      'aria-label="Ilustração do consultor Gilson" style="width:100%;height:100%">' +
      '<rect width="72" height="72" fill="#343A9B"/>' +
      '<circle cx="36" cy="28" r="12" fill="#F0D489"/>' +
      '<path d="M12 72c0-14 11-22 24-22s24 8 24 22H12z" fill="#0A0E1F"/>' +
      '<path d="M30 50l6 10 6-10 6 3-4 19H28l-4-19 6-3z" fill="#fff"/>' +
      '<path d="M33 50l3 6 3-6-3-2-3 2z" fill="#D9B75C"/>' +
      '</svg>'
    );
  }

  /* Só usa a foto do consultor se ela estiver declarada em
     dados.js. Sem declaração, entra o avatar desenhado — nunca
     gastamos uma requisição para descobrir se o arquivo existe. */
  function montarConsultor() {
    const corpo = $('#gilson-corpo');
    if (corpo) {
      corpo.innerHTML = IMAGENS.gilsonCorpo
        ? '<img src="assets/img/' + IMAGENS.gilsonCorpo + '" alt="Foto do consultor ' +
          LOJA.consultor + '" width="600" height="750" loading="lazy" decoding="async">'
        : avatarConsultor();
    }
    const rosto = $('#gilson-rosto');
    if (rosto) {
      rosto.innerHTML = IMAGENS.gilsonRosto
        ? '<img src="assets/img/' + IMAGENS.gilsonRosto + '" alt="" width="72" height="72" loading="lazy" decoding="async">'
        : avatarConsultor();
    }
  }

  function ligarFallbackDeFoto() {
    document.addEventListener(
      'error',
      (ev) => {
        const img = ev.target;
        if (!img || img.tagName !== 'IMG') return;
        if (img.dataset.trocada) return;
        img.dataset.trocada = '1';

        const dono = img.parentElement;
        if (!dono) return;

        if (dono.closest('.consultor__foto') || dono.closest('.flutuante__avatar')) {
          dono.innerHTML = avatarConsultor();
          return;
        }
        const caixa = img.closest('[data-cat]');
        dono.innerHTML = Ilustracoes.substitutoFoto(
          caixa ? caixa.dataset.cat : 'colchoes',
          img.alt || 'produto'
        );
      },
      true
    );
  }

  /* ---------------------------------------------------------
     CABEÇALHO AO ROLAR
     --------------------------------------------------------- */
  function ligarTopo() {
    const topo = $('.topo');
    if (!topo) return;
    const conferir = () => topo.classList.toggle('topo--rolado', window.scrollY > 40);
    window.addEventListener('scroll', conferir, { passive: true });
    conferir();
  }

  /* ---------------------------------------------------------
     PARTIDA
     --------------------------------------------------------- */
  function iniciar() {
    ligarFallbackDeFoto();
    /* As frases dos filmes nascem antes dos ícones e dos links do
       WhatsApp: o botão da última frase precisa ser ligado junto
       com os outros. */
    montarCenas('#cenas-hero', CENAS.hero);
    ligarIcones(document);
    ligarZaps();
    montarDestaques();
    montarCatalogo();
    montarConsultor();
    montarEtapas();
    montarDepoimentos();
    montarRedes();
    montarCasa();
    montarHorario();
    montarSeloAberto();
    ligarMenu();
    ligarTopo();
    ligarFilmes();

    const ano = $('#ano');
    if (ano) ano.textContent = new Date().getFullYear();

    /* O selo de aberto/fechado se corrige sozinho a cada minuto,
       para quem deixa a aba aberta na virada do horário. */
    setInterval(montarSeloAberto, 60000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
