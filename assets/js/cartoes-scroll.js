/* ============================================================
   CARTÕES QUE ENTRAM COM O SCROLL
   ------------------------------------------------------------
   Os cartões de produto chegam tortos, vindos de fora e de longe,
   e vão endireitando conforme a pessoa rola até assentarem no
   lugar deles na grade.

   Quem move é o CSS: aqui só se escreve a variável --p (0 a 1) de
   cada cartão. Isso mantém a conta de transform num lugar só e
   deixa o navegador compor sem passar pelo layout.

   Regra de robustez: o estado natural do cartão é ASSENTADO. A
   animação é enfeite que se liga por cima. Sem JavaScript, com
   erro, ou com movimento reduzido, a grade aparece inteira e
   parada — nunca some produto da tela.
   ============================================================ */

(function (global) {
  'use strict';

  const doc = global.document;

  /* Consultado na hora de montar, e não uma vez no carregamento: quem
     liga "reduzir movimento" no meio da visita tem a animação desligada
     na próxima troca de categoria, sem precisar recarregar. */
  function pediuMenosMovimento() {
    return !!(
      global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  /* Deslocamento inicial de cada cartão. O lado alterna e a
     distância varia em três degraus, senão a fileira inteira entra
     igual e o efeito vira cortina em vez de bagunça organizada. */
  function partidaDoCartao(indice) {
    const lado = indice % 2 === 0 ? -1 : 1;
    const degrau = indice % 3;
    return {
      x: lado * (150 + degrau * 70),
      y: 70 + degrau * 18,
      z: -(220 + degrau * 90),
      rx: 26 + degrau * 6,
      rz: lado * (3 + degrau),
    };
  }

  /* Desacelera no fim: o cartão chega rápido e assenta devagar. */
  function suavizar(p) {
    return 1 - Math.pow(1 - p, 3);
  }

  function CartoesScroll(grade) {
    this.grade = grade;
    this.ativos = new Set();
    this.agendado = false;
    this.observador = null;
  }

  CartoesScroll.prototype.montar = function () {
    this.desmontar();

    if (!this.grade || pediuMenosMovimento()) {
      this.limpar();
      return;
    }

    const cartoes = Array.from(this.grade.children);
    if (!cartoes.length) return;

    cartoes.forEach((cartao, i) => {
      const de = partidaDoCartao(i);
      cartao.style.setProperty('--dx', de.x + 'px');
      cartao.style.setProperty('--dy', de.y + 'px');
      cartao.style.setProperty('--dz', de.z + 'px');
      cartao.style.setProperty('--rx', de.rx + 'deg');
      cartao.style.setProperty('--rz', de.rz + 'deg');
      cartao.style.setProperty('--p', '0');
      cartao.dataset.voa = '';
    });

    /* Só os cartões perto da tela entram na conta por quadro. Com 25
       produtos, atualizar todos a cada scroll é trabalho jogado fora. */
    this.observador = new global.IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            this.ativos.add(entrada.target);
          } else {
            this.ativos.delete(entrada.target);
            /* Quem já passou por cima fica assentado; quem ainda não
               chegou volta ao ponto de partida. */
            const acabouDePassar = entrada.boundingClientRect.top < 0;
            entrada.target.style.setProperty('--p', acabouDePassar ? '1' : '0');
          }
        });
        this.agendar();
      },
      { rootMargin: '20% 0px 20% 0px' }
    );

    cartoes.forEach((cartao) => this.observador.observe(cartao));

    this.aoRolar = () => this.agendar();
    global.addEventListener('scroll', this.aoRolar, { passive: true });
    global.addEventListener('resize', this.aoRolar, { passive: true });

    this.agendar();
  };

  CartoesScroll.prototype.desmontar = function () {
    if (this.observador) {
      this.observador.disconnect();
      this.observador = null;
    }
    if (this.aoRolar) {
      global.removeEventListener('scroll', this.aoRolar);
      global.removeEventListener('resize', this.aoRolar);
      this.aoRolar = null;
    }
    this.ativos.clear();
  };

  /* Devolve os cartões ao estado assentado, apagando o que a animação
     tinha escrito neles. */
  CartoesScroll.prototype.limpar = function () {
    if (!this.grade) return;
    Array.from(this.grade.children).forEach((cartao) => {
      delete cartao.dataset.voa;
      ['--dx', '--dy', '--dz', '--rx', '--rz', '--p'].forEach((nome) =>
        cartao.style.removeProperty(nome)
      );
    });
  };

  CartoesScroll.prototype.agendar = function () {
    if (this.agendado) return;
    this.agendado = true;
    global.requestAnimationFrame(() => {
      this.agendado = false;
      this.atualizar();
    });
  };

  CartoesScroll.prototype.atualizar = function () {
    const altura = global.innerHeight;
    /* O voo acontece com o cartão já dentro da tela: começa com o topo
       dele a 95% da altura e termina assentado a 35%. Se começasse na
       borda de baixo, quase toda a animação rodaria fora da vista e a
       pessoa só veria o cartão já parado. */
    const inicio = altura * 0.95;
    const percurso = altura * 0.6;

    this.ativos.forEach((cartao) => {
      const topo = cartao.getBoundingClientRect().top;
      let p = (inicio - topo) / percurso;
      p = Math.min(1, Math.max(0, p));
      cartao.style.setProperty('--p', suavizar(p).toFixed(4));
    });
  };

  global.CartoesScroll = CartoesScroll;

  /* Se o navegador não tem IntersectionObserver, nada acontece e a
     grade fica parada — que já é o estado correto. */
  if (!global.IntersectionObserver || !doc) global.CartoesScroll = null;
})(window);
