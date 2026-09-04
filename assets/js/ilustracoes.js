/* ============================================================
   ILUSTRAÇÕES
   ------------------------------------------------------------
   Desenhos em SVG no estilo da marca (azul + dourado).
   Servem para duas coisas:
   1. os ícones das categorias e dos destaques;
   2. assumir o lugar de qualquer foto que faltar — nada de
      quadrado cinza no meio do site.
   ============================================================ */

(function (global) {
  'use strict';

  const AZUL = '#343A9B';
  const OURO = '#D9B75C';

  function svg(conteudo, vb) {
    return (
      '<svg viewBox="' + (vb || '0 0 64 64') + '" fill="none" ' +
      'xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      conteudo +
      '</svg>'
    );
  }

  /* ---------------- ÍCONES DE CATEGORIA E DESTAQUE ------------- */
  const ICONES = {
    colchao: svg(
      '<rect x="6" y="24" width="52" height="22" rx="6" stroke="currentColor" stroke-width="3"/>' +
      '<path d="M6 33h52" stroke="currentColor" stroke-width="2" opacity=".45"/>' +
      '<path d="M16 28v-4M32 28v-4M48 28v-4" stroke="' + OURO + '" stroke-width="2.5" stroke-linecap="round"/>'
    ),
    base: svg(
      '<rect x="6" y="26" width="52" height="16" rx="4" stroke="currentColor" stroke-width="3"/>' +
      '<path d="M12 42v6M52 42v6" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M6 34h52" stroke="' + OURO + '" stroke-width="2" opacity=".7"/>'
    ),
    cabeceira: svg(
      '<rect x="10" y="12" width="44" height="34" rx="5" stroke="currentColor" stroke-width="3"/>' +
      '<path d="M22 24l10-6 10 6-10 6-10-6z" stroke="' + OURO + '" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M16 46v6M48 46v6" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'
    ),
    travesseiro: svg(
      '<rect x="8" y="20" width="44" height="26" rx="10" stroke="currentColor" stroke-width="3"/>' +
      '<path d="M18 30c6 4 22 4 28 0" stroke="' + OURO + '" stroke-width="2.5" stroke-linecap="round"/>'
    ),
    edredom: svg(
      '<path d="M8 22h48v24a4 4 0 01-4 4H12a4 4 0 01-4-4V22z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M8 22l8-8h32l8 8" stroke="' + OURO + '" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M24 22v28M40 22v28" stroke="currentColor" stroke-width="2" opacity=".4"/>'
    ),
    sofa: svg(
      '<path d="M10 32v-6a5 5 0 015-5h34a5 5 0 015 5v6" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
      '<rect x="6" y="30" width="52" height="16" rx="5" stroke="currentColor" stroke-width="3"/>' +
      '<path d="M14 46v5M50 46v5" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M32 30v16" stroke="' + OURO + '" stroke-width="2" opacity=".7"/>'
    ),
    fabrica: svg(
      '<path d="M8 50V28l14 8V28l14 8V18l14 6v26H8z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M20 50v-8h8v8" stroke="' + OURO + '" stroke-width="2.5" stroke-linejoin="round"/>'
    ),
    entrega: svg(
      '<path d="M4 20h30v22H4zM34 27h11l7 8v7H34z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>' +
      '<circle cx="15" cy="46" r="4" stroke="' + OURO + '" stroke-width="2.5"/>' +
      '<circle cx="43" cy="46" r="4" stroke="' + OURO + '" stroke-width="2.5"/>'
    ),
    medida: svg(
      '<rect x="6" y="24" width="52" height="18" rx="4" stroke="currentColor" stroke-width="3"/>' +
      '<path d="M16 24v7M26 24v5M36 24v7M46 24v5" stroke="' + OURO + '" stroke-width="2.5" stroke-linecap="round"/>'
    ),
    atendente: svg(
      '<circle cx="32" cy="22" r="9" stroke="currentColor" stroke-width="3"/>' +
      '<path d="M14 52c0-9 8-14 18-14s18 5 18 14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M26 40l6 8 6-8" stroke="' + OURO + '" stroke-width="2.5" stroke-linejoin="round"/>'
    ),
    whatsapp: svg(
      '<path d="M32 6C17.6 6 6 17.6 6 32c0 4.6 1.2 9 3.4 12.9L6 58l13.5-3.3A25.9 25.9 0 0032 58c14.4 0 26-11.6 26-26S46.4 6 32 6z" fill="currentColor"/>' +
      '<path d="M24 20c-1 0-2 .4-2.6 1.4-.9 1.3-2 3-2 6s2.2 6 2.5 6.4c.3.4 4.3 7 10.7 9.5 5.3 2.1 6.4 1.7 7.6 1.6 1.2-.1 3.8-1.5 4.3-3s.6-2.8.4-3c-.2-.3-.6-.4-1.2-.7l-4.4-2.2c-.6-.3-1-.4-1.5.3l-2 2.6c-.4.5-.8.5-1.4.2-3.5-1.5-6-3.6-7.9-6.9-.4-.7 0-1 .3-1.4l1.1-1.4c.3-.5.2-.9 0-1.3l-2-4.9c-.5-1.2-1-1.2-1.5-1.2H24z" fill="#0b1020"/>',
      '0 0 64 64'
    ),
    instagram: svg(
      '<rect x="10" y="10" width="44" height="44" rx="13" stroke="currentColor" stroke-width="3.5"/>' +
      '<circle cx="32" cy="32" r="10" stroke="currentColor" stroke-width="3.5"/>' +
      '<circle cx="45" cy="19" r="2.6" fill="currentColor"/>'
    ),
    relogio: svg(
      '<circle cx="32" cy="32" r="24" stroke="currentColor" stroke-width="3"/>' +
      '<path d="M32 18v14l9 6" stroke="' + OURO + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
    ),
    pino: svg(
      '<path d="M32 58s18-16 18-28a18 18 0 10-36 0c0 12 18 28 18 28z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>' +
      '<circle cx="32" cy="29" r="7" stroke="' + OURO + '" stroke-width="3"/>'
    ),
    seta: svg('<path d="M20 12l20 20-20 20" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'),
  };

  function icone(nome) {
    return ICONES[nome] || ICONES.colchao;
  }

  /* ---------------- SUBSTITUTO DE FOTO ------------------------- */
  /* Desenho de produto no estilo da marca, com variação por
     categoria, para quando não há fotografia disponível.        */
  const CENAS = {
    colchoes:
      '<rect x="40" y="150" width="320" height="70" rx="18" fill="url(#g1)"/>' +
      '<rect x="40" y="150" width="320" height="26" rx="13" fill="#fff" opacity=".9"/>' +
      '<path d="M70 163h260" stroke="' + AZUL + '" stroke-width="2" opacity=".25" stroke-dasharray="6 8"/>' +
      '<rect x="66" y="220" width="18" height="26" rx="6" fill="' + AZUL + '"/>' +
      '<rect x="316" y="220" width="18" height="26" rx="6" fill="' + AZUL + '"/>',
    bases:
      '<rect x="40" y="160" width="320" height="60" rx="10" fill="url(#g1)"/>' +
      '<path d="M40 190h320" stroke="' + OURO + '" stroke-width="3" opacity=".8"/>' +
      '<rect x="60" y="220" width="16" height="28" rx="5" fill="' + AZUL + '"/>' +
      '<rect x="324" y="220" width="16" height="28" rx="5" fill="' + AZUL + '"/>',
    cabeceiras:
      '<rect x="80" y="70" width="240" height="150" rx="16" fill="url(#g1)"/>' +
      '<path d="M140 120l30-18 30 18-30 18-30-18zM230 120l30-18 30 18-30 18-30-18z" stroke="' + OURO + '" stroke-width="3" fill="none"/>' +
      '<rect x="100" y="220" width="14" height="26" rx="5" fill="' + AZUL + '"/>' +
      '<rect x="286" y="220" width="14" height="26" rx="5" fill="' + AZUL + '"/>',
    travesseiros:
      '<rect x="80" y="120" width="240" height="110" rx="46" fill="url(#g1)"/>' +
      '<path d="M130 175c40 22 110 22 150 0" stroke="' + OURO + '" stroke-width="4" stroke-linecap="round" fill="none"/>',
    enxoval:
      '<path d="M60 130h280v100a16 16 0 01-16 16H76a16 16 0 01-16-16V130z" fill="url(#g1)"/>' +
      '<path d="M60 130l34-34h212l34 34" fill="none" stroke="' + OURO + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M154 130v116M246 130v116" stroke="' + AZUL + '" stroke-width="2" opacity=".3"/>',
    moveis:
      '<path d="M70 170v-26a22 22 0 0122-22h216a22 22 0 0122 22v26" fill="url(#g1)"/>' +
      '<rect x="48" y="164" width="304" height="70" rx="20" fill="url(#g1)"/>' +
      '<path d="M200 164v70" stroke="' + OURO + '" stroke-width="3" opacity=".8"/>' +
      '<rect x="76" y="234" width="16" height="24" rx="5" fill="' + AZUL + '"/>' +
      '<rect x="308" y="234" width="16" height="24" rx="5" fill="' + AZUL + '"/>',
  };

  function substitutoFoto(categoria, rotulo) {
    const cena = CENAS[categoria] || CENAS.colchoes;
    return (
      '<svg class="ilustracao" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" ' +
      'role="img" aria-label="Ilustração de ' + (rotulo || 'produto') + '">' +
      '<defs>' +
      '<linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#e8ecff"/>' +
      '<stop offset="1" stop-color="#c3cbf0"/>' +
      '</linearGradient>' +
      '<radialGradient id="gf" cx="50%" cy="45%" r="60%">' +
      '<stop offset="0" stop-color="#f4f6ff"/>' +
      '<stop offset="1" stop-color="#e2e7f8"/>' +
      '</radialGradient>' +
      '</defs>' +
      '<rect width="400" height="300" fill="url(#gf)"/>' +
      '<ellipse cx="200" cy="252" rx="150" ry="14" fill="' + AZUL + '" opacity=".08"/>' +
      cena +
      '</svg>'
    );
  }

  global.Ilustracoes = { icone, substitutoFoto };
})(window);
