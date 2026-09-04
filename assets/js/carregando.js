/* ============================================================
   TELA DE CARREGAMENTO

   O topo do site é um vídeo de vinte e poucos megabytes. Quem
   entra pela busca do celular via a página montada e o vídeo
   ainda chegando — o topo aparecia sem imagem por um instante.

   Esta tela cobre esse instante. A barra não é enfeite: ela
   anda em cima de marcos reais (HTML pronto, página carregada,
   primeiro quadro do vídeo na mão). O passinho automático só
   existe para a barra não parecer travada entre um marco e
   outro, e nunca passa de 92% sozinho.

   Regra que não se quebra: a tela SEMPRE sai. Se a rede cair,
   se o vídeo não vier, se um marco nunca chegar — em 9 segundos
   ela sai do mesmo jeito. Ninguém fica preso olhando barrinha.
   ============================================================ */

(function () {
  'use strict';

  const tela = document.getElementById('carregando');
  const barra = document.getElementById('carregando-progresso');
  if (!tela || !barra) return;

  const TETO_SOZINHA = 92;
  const PACIENCIA = 9000;

  let porcento = 0;
  let acabou = false;

  function mostrar(v) {
    v = Math.min(100, Math.max(porcento, v));
    if (v === porcento) return;
    porcento = v;
    barra.style.width = v + '%';
  }

  /* ---------- marcos reais ---------- */
  const MARCOS = ['dom', 'pagina', 'video'];
  const feitos = Object.create(null);

  function marcar(nome) {
    if (feitos[nome] || acabou) return;
    feitos[nome] = true;
    const n = Object.keys(feitos).length;
    mostrar(12 + (n / MARCOS.length) * 88);
    if (n >= MARCOS.length) terminar();
  }

  /* ---------- saída ---------- */
  function terminar() {
    if (acabou) return;
    acabou = true;
    clearInterval(passinho);
    mostrar(100);

    /* Um respiro curto para a barra chegar ao fim à vista de
       quem olha, senão o 100% nunca é desenhado. */
    setTimeout(function () {
      tela.classList.add('carregando--fim');
      document.body.classList.remove('carregando-ativo');
      setTimeout(function () {
        if (tela.parentNode) tela.parentNode.removeChild(tela);
        /* A rolagem ficou travada enquanto a tela cobria tudo;
           quem chegou por link com âncora precisa ir ao lugar. */
        window.dispatchEvent(new Event('resize'));
      }, 500);
    }, 220);
  }

  const passinho = setInterval(function () {
    if (porcento < TETO_SOZINHA) mostrar(porcento + 1);
  }, 220);

  setTimeout(terminar, PACIENCIA);

  /* ---------- ligando os marcos ---------- */
  document.body.classList.add('carregando-ativo');

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { marcar('dom'); });
  } else {
    marcar('dom');
  }

  if (document.readyState === 'complete') marcar('pagina');
  else window.addEventListener('load', function () { marcar('pagina'); });

  /* O vídeo do topo conta como pronto no primeiro quadro. Esperar
     o arquivo inteiro seria esperar 20 MB — e não é preciso: o
     que a pessoa vê ao chegar é o primeiro quadro. */
  const filme = document.getElementById('hero-video');
  if (!filme) {
    marcar('video');
  } else if (filme.readyState >= 2) {
    marcar('video');
  } else {
    const pronto = function () { marcar('video'); };
    filme.addEventListener('loadeddata', pronto);
    filme.addEventListener('canplay', pronto);
    filme.addEventListener('error', pronto);
  }
})();
