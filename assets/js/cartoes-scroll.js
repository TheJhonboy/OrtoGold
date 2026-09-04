/* ============================================================
   VITRINE — OS PRODUTOS PASSAM COM O SCROLL
   ------------------------------------------------------------
   A seção trava na tela e os cartões descem na diagonal: entram
   pelo canto de cima à direita deitados, endireitam ao cruzar o
   meio colados na câmera, e saem pelo canto de baixo à esquerda
   deitados para o outro lado. Dois ficam legíveis por vez — um
   em cima, outro embaixo — e a cada trecho de rolagem desce o
   próximo.

   Cada cartão tem uma posição no trilho, o `u`:

       u = +1   entrando, em cima à direita, deitado
       u =  0   no meio da tela, reto, colado na câmera
       u = -1   saindo, embaixo à esquerda, deitado

   Quem move é o CSS. Aqui só se escreve `u` e a opacidade de cada
   cartão, uma vez por quadro.

   Regra de robustez: o estado natural continua sendo a grade
   parada. O trilho só liga depois que a altura foi calculada. Sem
   JavaScript, com movimento reduzido ou em tela baixa demais, a
   pessoa vê a grade inteira de sempre.
   ============================================================ */

(function (global) {
  'use strict';

  /* Quanto de `u` separa um cartão do seguinte. Menor que 1 mantém
     sempre dois na tela ao mesmo tempo, que é o efeito pedido. */
  const ESPACAMENTO = 0.85;

  /* Em que ponto do trilho o primeiro cartão nasce. Não é 1 — na ponta
     ele estaria quase transparente, e quem troca de categoria abriria a
     seção olhando para um palco vazio. Em 0.75 ele já aparece inteiro,
     torto, entrando. */
  const NASCE_EM = 0.75;

  /* Rolagem gasta por cartão. Menos que isto e o trilho vira um
     borrão; mais e a pessoa fica presa rolando sem ver mudança. */
  const TELAS_POR_CARTAO = 0.75;

  /* O quanto da distância que falta o trilho vence a cada quadro de
     60 Hz. Isto é o que tira o travado: em vez de colar na rolagem, o
     trilho persegue ela com atraso. A roda do mouse anda em degraus de
     uns 100px, e quem gruda nesses degraus salta; quem persegue desliza.
     Perto de 1 volta a grudar, perto de 0 fica mole demais. */
  const PERSEGUICAO = 0.085;

  /* Abaixo desta diferença o olho não vê mais e a perseguição para, para
     não deixar um requestAnimationFrame girando à toa. */
  const PARADA = 0.0002;

  /* Abaixo desta altura o palco fixo engole a tela inteira e a
     pessoa perde a noção de onde está na página. */
  const ALTURA_MINIMA = 520;

  function pediuMenosMovimento() {
    return !!(
      global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function limitar(v, minimo, maximo) {
    return Math.min(maximo, Math.max(minimo, v));
  }

  function Vitrine(secao, palco, grade) {
    this.secao = secao;
    this.palco = palco;
    this.grade = grade;
    this.cartoes = [];
    this.rodando = false;
    this.progresso = 0;
  }

  /* `recomecar` chega ligado quando a pessoa troca de categoria: aí o
     trilho tem que rodar de novo desde o primeiro produto, em vez de
     continuar de onde a categoria anterior parou. */
  Vitrine.prototype.montar = function (recomecar) {
    this.desmontar();

    if (!this.secao || !this.palco || !this.grade) return;
    if (pediuMenosMovimento() || global.innerHeight < ALTURA_MINIMA) return;

    this.cartoes = Array.from(this.grade.children);
    if (this.cartoes.length < 2) return;

    /* O percurso total em unidades de `u`: o primeiro cartão nasce em
       NASCE_EM e o último morre em -1, com os outros escalonados no
       meio. */
    this.percurso = (this.cartoes.length - 1) * ESPACAMENTO + NASCE_EM + 1;

    this.cartoes.forEach((cartao) => {
      cartao.dataset.palco = '';
    });

    this.secao.dataset.palco = 'ativo';
    this.medir();

    this.aoRolar = () => this.agendar();
    global.addEventListener('scroll', this.aoRolar, { passive: true });

    this.aoRedimensionar = () => {
      /* Girar o telefone pode cruzar o limite de altura mínima nos dois
         sentidos, então remonta em vez de só remedir. */
      this.montar();
    };
    global.addEventListener('resize', this.aoRedimensionar, { passive: true });

    /* A altura da seção acabou de mudar junto com o número de produtos
       da categoria, então rolar só faz sentido depois de medir. */
    if (recomecar) this.voltarAoInicio();

    // Sem perseguição no primeiro quadro: o trilho já nasce no lugar.
    this.atualizar();
  };

  /* Leva a página ao ponto onde o percurso começa. As abas e o título
     estão presos na tela, então nada pisca de lugar: só os produtos é
     que voltam para o começo da fila. */
  Vitrine.prototype.voltarAoInicio = function () {
    const inicio = Math.round(this.secao.getBoundingClientRect().top + global.scrollY);
    if (Math.abs(global.scrollY - inicio) < 2) return;

    this.progresso = 0;
    global.scrollTo({
      top: inicio,
      /* Salto seco. Com rolagem suave a página ainda estaria a caminho
         enquanto o trilho já perseguia o destino, e os produtos novos
         passariam correndo antes de a pessoa chegar lá. */
      behavior: 'instant',
    });
  };

  Vitrine.prototype.desmontar = function () {
    if (this.aoRolar) {
      global.removeEventListener('scroll', this.aoRolar);
      this.aoRolar = null;
    }
    if (this.aoRedimensionar) {
      global.removeEventListener('resize', this.aoRedimensionar);
      this.aoRedimensionar = null;
    }
    if (this.secao) {
      delete this.secao.dataset.palco;
      this.secao.style.removeProperty('height');
    }
    if (this.grade) {
      Array.from(this.grade.children).forEach((cartao) => {
        delete cartao.dataset.palco;
        ['--u', '--o', 'z-index'].forEach((nome) => cartao.style.removeProperty(nome));
      });
    }
    this.cartoes = [];
  };

  /* A altura da seção é o que dá o curso de rolagem: uma tela para o
     palco ficar parado mais um tanto por cartão. */
  Vitrine.prototype.medir = function () {
    const tela = global.innerHeight;
    const curso = this.cartoes.length * TELAS_POR_CARTAO * tela;
    this.secao.style.height = Math.round(tela + curso) + 'px';

    /* O topo do site é sticky e fica por cima de tudo: o bloco preso
       precisa começar embaixo dele, senão o título some atrás. */
    const topo = document.getElementById('topo');
    const alturaTopo = topo ? Math.round(topo.getBoundingClientRect().height) : 0;
    this.secao.style.setProperty('--altura-topo', alturaTopo + 'px');

    /* O trilho mora só na sobra abaixo das abas, então o alcance sai da
       altura do palco — não da tela inteira, senão o cartão atravessaria
       o recorte antes de chegar ao meio. */
    const alturaPalco = this.palco.clientHeight || tela;
    this.palco.style.setProperty('--alcance', Math.round(alturaPalco * 0.62) + 'px');

    /* Quanto o cartão anda para o lado no mesmo percurso. Sem isso a
       descida vira elevador; a diagonal é o que dá o movimento. */
    const desvio = Math.min(300, Math.round(this.palco.clientWidth * 0.24));
    this.palco.style.setProperty('--desvio', desvio + 'px');
  };

  /* Onde a rolagem está agora. Devolve null quando não há percurso. */
  Vitrine.prototype.alvo = function () {
    const caixa = this.secao.getBoundingClientRect();
    const curso = caixa.height - global.innerHeight;
    if (curso <= 0) return null;
    return limitar(-caixa.top / curso, 0, 1);
  };

  /* Mantém um laço rodando enquanto o trilho ainda não alcançou a
     rolagem. Um quadro só não basta: a graça está justamente nos
     quadros que vêm depois que a pessoa parou de rolar. */
  Vitrine.prototype.agendar = function () {
    if (this.rodando) return;
    this.rodando = true;
    this.quadroAnterior = 0;

    const passo = (agora) => {
      /* Teto de 64ms: se a aba ficou escondida ou o navegador engasgou,
         um salto enorme faria o trilho teleportar. */
      const dt = this.quadroAnterior ? Math.min(64, agora - this.quadroAnterior) : 16.7;
      this.quadroAnterior = agora;

      if (this.perseguir(dt)) {
        global.requestAnimationFrame(passo);
      } else {
        this.rodando = false;
        this.quadroAnterior = 0;
      }
    };

    global.requestAnimationFrame(passo);
  };

  /* Anda um quadro na direção da rolagem. Devolve se ainda falta chão.
     A conta do fator deixa a suavização igual em 60, 120 ou 144 Hz —
     sem ela, monitor rápido persegue rápido e o efeito muda de máquina
     para máquina. */
  Vitrine.prototype.perseguir = function (dt) {
    const alvo = this.alvo();
    if (alvo === null) return false;

    const fator = 1 - Math.pow(1 - PERSEGUICAO, dt / 16.6667);
    this.progresso += (alvo - this.progresso) * fator;

    const chegou = Math.abs(alvo - this.progresso) < PARADA;
    if (chegou) this.progresso = alvo;

    this.pintar(this.progresso);
    return !chegou;
  };

  /* Pula a perseguição e vai direto para onde a rolagem está. Usado ao
     montar, senão o trilho abriria correndo até a posição certa. */
  Vitrine.prototype.atualizar = function () {
    const alvo = this.alvo();
    if (alvo === null) return;
    this.progresso = alvo;
    this.pintar(alvo);
  };

  Vitrine.prototype.pintar = function (p) {
    if (!this.cartoes.length) return;

    this.cartoes.forEach((cartao, i) => {
      const u = NASCE_EM + i * ESPACAMENTO - p * this.percurso;
      const preso = limitar(u, -1.35, 1.35);

      /* Some antes de chegar à borda: cartão sumindo no meio do nada é
         mais limpo do que cartão cortado pela beirada da tela. */
      const opacidade = limitar(1 - (Math.abs(preso) - 0.72) / 0.5, 0, 1);

      cartao.style.setProperty('--u', preso.toFixed(4));
      cartao.style.setProperty('--o', opacidade.toFixed(3));
      /* Quem está mais perto do meio passa na frente. */
      cartao.style.zIndex = String(Math.round(100 - Math.abs(preso) * 50));
    });
  };

  global.Vitrine = Vitrine;
})(window);
