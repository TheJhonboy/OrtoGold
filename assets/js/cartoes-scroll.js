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

  /* Rolagem gasta por cartão. Menos que isto e o trilho vira um
     borrão; mais e a pessoa fica presa rolando sem ver mudança. */
  const TELAS_POR_CARTAO = 0.62;

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
    this.agendado = false;
  }

  Vitrine.prototype.montar = function () {
    this.desmontar();

    if (!this.secao || !this.palco || !this.grade) return;
    if (pediuMenosMovimento() || global.innerHeight < ALTURA_MINIMA) return;

    this.cartoes = Array.from(this.grade.children);
    if (this.cartoes.length < 2) return;

    /* O percurso total em unidades de `u`: o primeiro cartão nasce em
       +1 e o último morre em -1, com os outros escalonados no meio. */
    this.percurso = (this.cartoes.length - 1) * ESPACAMENTO + 2;

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

    this.agendar();
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

  Vitrine.prototype.agendar = function () {
    if (this.agendado) return;
    this.agendado = true;
    global.requestAnimationFrame(() => {
      this.agendado = false;
      this.atualizar();
    });
  };

  Vitrine.prototype.atualizar = function () {
    if (!this.cartoes.length) return;

    const caixa = this.secao.getBoundingClientRect();
    const curso = caixa.height - global.innerHeight;
    if (curso <= 0) return;

    const p = limitar(-caixa.top / curso, 0, 1);

    this.cartoes.forEach((cartao, i) => {
      const u = 1 + i * ESPACAMENTO - p * this.percurso;
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

  global.Vitrine = global.IntersectionObserver ? Vitrine : null;
})(window);
