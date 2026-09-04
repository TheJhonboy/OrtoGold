/* ============================================================
   FILME-VIDEO — vídeo de verdade, controlado pela rolagem.

   Por que vídeo e não sequência de imagens: para o topo ficar
   nítido a 60 quadros por segundo seriam 1920 arquivos WebP,
   mais de 100 MB. O mesmo material em H.264 cabe em ~20 MB com
   muito mais definição.

   O preço é o "seek": mudar o tempo do vídeo a cada rolagem. Por
   isso o arquivo é gerado com quadro-chave a cada 0,5 s. Sem
   isso o navegador precisa decodificar meio vídeo para achar a
   posição pedida e a imagem trava.

   Regra de ouro daqui: a seção só vira 'ativo' — e só então
   fica alta e grudada — depois que o vídeo garante que sabe a
   própria duração. Se o arquivo não vier, a seção continua
   estática e ninguém vê buraco preto.
   ============================================================ */

(function (global) {
  'use strict';

  class FilmeVideo {
    constructor(opcoes) {
      this.secao = opcoes.secao;
      this.video = opcoes.video;
      this.aoProgredir = opcoes.aoProgredir || null;

      this.pronto = false;
      this.duracao = 0;
      this.alvo = 0;
      this.buscando = false;
      this.agendado = false;
      this.progresso = 0;
    }

    iniciar() {
      const v = this.video;
      if (!v || !this.secao) return this;

      /* Atributos por código também: um HTML editado à mão sem
         'muted' faz o navegador bloquear o vídeo inteiro. */
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      v.setAttribute('muted', '');
      v.setAttribute('playsinline', '');
      v.setAttribute('webkit-playsinline', '');
      v.preload = 'auto';
      v.pause();

      /* Celular ganha um arquivo menor. Trocar a fonte tem de
         acontecer antes do load(), senão o aparelho já começou a
         baixar a versão grande e o corte não adianta nada. */
      const leve = v.dataset.movel;
      if (leve && global.matchMedia('(max-width: 860px)').matches) {
        while (v.firstElementChild) v.removeChild(v.firstElementChild);
        v.src = leve;
      }

      const conferir = () => this.despertar();
      v.addEventListener('loadedmetadata', conferir);
      v.addEventListener('loadeddata', conferir);
      v.addEventListener('canplay', conferir);

      v.addEventListener('error', () => {
        this.secao.dataset.filme = 'indisponivel';
      });

      /* Quem chega ao fim de uma busca já pega a próxima na fila,
         em vez de acumular pedidos que o navegador descarta. */
      v.addEventListener('seeked', () => {
        this.buscando = false;
        if (Math.abs(v.currentTime - this.alvo) > 0.02) this.buscar();
      });

      if (v.readyState >= 1) this.despertar();
      else v.load();

      this.acordarNoCelular();

      return this;
    }

    /* ----------------------------------------------------------
       No celular 'preload="auto"' é só um pedido: iOS e Android
       ignoram e não baixam nada até alguém mandar tocar. Sem
       dado baixado o vídeo nunca sabe a própria duração, a seção
       nunca vira 'ativo' e o topo fica parado no cartaz — que é
       exatamente o que acontecia.

       Então: manda tocar sem som, e no primeiro quadro pausa. O
       decodificador acorda, o arquivo entra em buffer e a
       rolagem passa a comandar. Se o aparelho recusar sem toque
       na tela, espera o primeiro toque e tenta de novo.
       ---------------------------------------------------------- */
    acordarNoCelular() {
      const v = this.video;
      let armado = false;

      const pausarNoPrimeiroQuadro = () => {
        try { v.pause(); } catch (e) {}
        v.removeEventListener('playing', pausarNoPrimeiroQuadro);
      };

      const tentar = () => {
        v.addEventListener('playing', pausarNoPrimeiroQuadro);
        let p;
        try { p = v.play(); } catch (e) { p = null; }
        if (p && p.catch) p.catch(() => armarToque());
      };

      const armarToque = () => {
        if (armado) return;
        armado = true;
        const umaVez = () => {
          global.removeEventListener('touchstart', umaVez);
          global.removeEventListener('click', umaVez);
          tentar();
        };
        global.addEventListener('touchstart', umaVez, { passive: true, once: true });
        global.addEventListener('click', umaVez, { once: true });
      };

      tentar();

      /* Rede ruim: se em 8 s nada chegou, desiste do filme e
         deixa a seção estática com o cartaz. Melhor um topo
         parado e bonito do que uma seção alta e vazia. */
      global.setTimeout(() => {
        if (!this.pronto) this.secao.dataset.filme = 'estatico';
      }, 8000);
    }

    despertar() {
      if (this.pronto) return;
      const d = this.video.duration;
      if (!d || !isFinite(d)) return;

      this.duracao = d;
      this.pronto = true;
      this.secao.dataset.filme = 'ativo';
      this.ligar();
    }

    ligar() {
      this.onScroll = () => this.agendar();
      global.addEventListener('scroll', this.onScroll, { passive: true });
      global.addEventListener('resize', this.onScroll, { passive: true });
      this.atualizar();
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

      /* Para 0,05 s antes do fim: pedir exatamente a duração faz
         alguns navegadores devolverem o último quadro em preto. */
      this.alvo = Math.min(this.duracao - 0.05, p * this.duracao);
      this.buscar();

      if (this.aoProgredir) this.aoProgredir(p);
    }

    buscar() {
      if (!this.pronto || this.buscando) return;
      const v = this.video;
      if (Math.abs(v.currentTime - this.alvo) < 0.02) return;
      /* Nada de fastSeek: ele pula para o quadro-chave mais
         próximo, o que reduziria o filme inteiro a 64 posições. */
      this.buscando = true;
      try {
        v.currentTime = this.alvo;
      } catch (e) {
        this.buscando = false;
        return;
      }

      /* Trava de segurança: se o 'seeked' não vier (acontece em
         aba escondida), a busca destravaria só no próximo scroll. */
      global.clearTimeout(this.destravar);
      this.destravar = global.setTimeout(() => {
        if (!this.buscando) return;
        this.buscando = false;
        this.buscar();
      }, 400);
    }
  }

  global.FilmeVideo = FilmeVideo;
})(window);
