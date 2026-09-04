/* ============================================================
   FILME CONTROLADO PELO SCROLL
   ------------------------------------------------------------
   Desenha uma sequência de quadros num <canvas> conforme a
   pessoa rola a página. Não usa <video>, porque arrastar o
   tempo de um vídeo trava no Safari do iPhone.

   Regra de robustez: a seção começa VISÍVEL na versão estática.
   Só vira filme depois que o primeiro quadro chegou de verdade.
   Se nada chegar, ninguém vê buraco preto.
   ============================================================ */

(function (global) {
  'use strict';

  const reduzirMovimento =
    global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function caminhoQuadro(pasta, i) {
    return pasta + '/f-' + String(i).padStart(4, '0') + '.webp';
  }

  class FilmeScroll {
    constructor(opcoes) {
      this.secao = opcoes.secao;
      this.canvas = opcoes.canvas;
      this.pasta = opcoes.pasta;
      this.total = opcoes.total;
      this.largura = opcoes.largura || 1280;
      this.altura = opcoes.altura || 720;
      this.aoProgredir = opcoes.aoProgredir || null;

      this.imagens = new Array(this.total);
      this.carregando = new Set();
      this.quadroAtual = -1;
      this.progresso = 0;
      this.pronto = false;
      this.agendado = false;
    }

    /* Confirma que o primeiro quadro existe antes de mudar o layout. */
    iniciar() {
      if (!this.canvas || !this.secao) return;
      if (!this.total || this.total < 2) return;

      const primeiro = new Image();
      primeiro.decoding = 'async';
      primeiro.onload = () => {
        this.imagens[0] = primeiro;
        this.ligar();
      };
      primeiro.onerror = () => {
        /* Quadros não existem ainda. Fica na versão estática. */
        this.secao.dataset.filme = 'indisponivel';
      };
      primeiro.src = caminhoQuadro(this.pasta, 1);
    }

    ligar() {
      this.ctx = this.canvas.getContext('2d', { alpha: false });
      this.canvas.width = this.largura;
      this.canvas.height = this.altura;

      this.pronto = true;
      this.secao.dataset.filme = 'ativo';

      this.desenhar(0);
      this.carregarVizinhos(0);

      this.onScroll = () => this.agendar();
      global.addEventListener('scroll', this.onScroll, { passive: true });
      global.addEventListener('resize', this.onScroll, { passive: true });
      this.agendar();

    }

    agendar() {
      if (this.agendado) return;
      this.agendado = true;
      global.requestAnimationFrame(() => {
        this.agendado = false;
        this.atualizar();
      });
    }

    atualizar() {
      const caixa = this.secao.getBoundingClientRect();
      const percurso = caixa.height - global.innerHeight;
      if (percurso <= 0) return;

      let p = -caixa.top / percurso;
      p = Math.min(1, Math.max(0, p));
      this.progresso = p;

      const alvo = Math.min(this.total - 1, Math.round(p * (this.total - 1)));
      this.irPara(alvo);

      if (this.aoProgredir) this.aoProgredir(p);
    }

    irPara(indice) {
      if (indice === this.quadroAtual) return;
      this.quadroAtual = indice;
      this.carregarVizinhos(indice);
      this.desenhar(indice);
    }

    /* Desenha o quadro pedido; se ainda não chegou, mantém o
       último desenhado em vez de piscar preto. */
    desenhar(indice) {
      const img = this.imagens[indice] || this.maisProximoCarregado(indice);
      if (!img) return;
      this.ctx.drawImage(img, 0, 0, this.largura, this.altura);
    }

    maisProximoCarregado(indice) {
      for (let d = 1; d < this.total; d++) {
        if (this.imagens[indice - d]) return this.imagens[indice - d];
        if (this.imagens[indice + d]) return this.imagens[indice + d];
      }
      return null;
    }

    /* Só busca quadros perto de onde a pessoa está.
       Nada de disparar 300 requisições de uma vez. */
    carregarVizinhos(indice) {
      /* Janela grande: uma volta de rodinha do mouse pula dezenas
         de quadros. Se o buffer for curto, a imagem trava. */
      const inicio = Math.max(0, indice - 12);
      const fim = Math.min(this.total - 1, indice + 96);
      for (let i = inicio; i <= fim; i++) this.carregar(i);
    }

    carregar(i) {
      if (this.imagens[i] || this.carregando.has(i)) return;
      this.carregando.add(i);
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        this.imagens[i] = img;
        this.carregando.delete(i);
        if (i === this.quadroAtual) this.desenhar(i);
      };
      img.onerror = () => this.carregando.delete(i);
      img.src = caminhoQuadro(this.pasta, i + 1);
    }
  }

  global.FilmeScroll = FilmeScroll;
  global.movimentoReduzido = reduzirMovimento;
})(window);
