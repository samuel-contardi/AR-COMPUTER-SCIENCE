// src/bancada/ui/painel.ts
// ---------------------------------------------------------------------------
// O painel diegético do custo de quadro.
//
// Até o Módulo 02 o relatório saía na página comum, e a razão era que ainda
// não havia mundo onde pendurá-lo. Agora há. O painel é um objeto DENTRO da
// cena, preso ao poste do suporte — e não um retângulo desenhado por cima da
// imagem —, porque o enunciado pede o indicador "visível dentro da cena", e
// não numa barra de HTML flutuando sobre o canvas.
//
// Versão deliberadamente simples: só o regime em janela existe neste ponto do
// percurso (nenhum headset entra em jogo ainda), então não há aqui giro para
// encarar quem observa nem medida de legibilidade em minutos de arco — isso é
// assunto de quando o regime imersivo existir de fato. O que se resolve agora
// é só o que o Módulo 03 pede: um número, legível, dentro da cena.
//
// Ele redesenha algumas vezes por segundo, não a cada quadro: enviar textura
// para a placa de vídeo é uma das operações mais caras do quadro, e um painel
// que estourasse o próprio orçamento enquanto informa o orçamento seria uma
// piada de mau gosto.
// ---------------------------------------------------------------------------

import { CanvasTexture, LinearFilter, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';

const LARGURA_M: number = 0.5;
const ALTURA_M: number = 0.28;
const LARGURA_PX: number = 500;
const ALTURA_PX: number = 280;
const INTERVALO_DE_REDESENHO: number = 0.25;
const CORPO_PX: number = 22;
const ENTRELINHA_PX: number = 30;
const MARGEM_PX: number = 18;

export interface Painel {
  readonly no: Mesh;
  /** Entrega o texto do painel. O redesenho só acontece quando vale a pena. */
  atualizar(linhas: readonly string[], decorrido: number): void;
}

export function montarPainel(titulo: string): Painel {
  const tela: HTMLCanvasElement = document.createElement('canvas');
  tela.width = LARGURA_PX;
  tela.height = ALTURA_PX;

  const contexto: CanvasRenderingContext2D | null = tela.getContext('2d');
  if (contexto === null) {
    throw new Error('Este navegador não fornece contexto de desenho para o painel.');
  }
  const pincel: CanvasRenderingContext2D = contexto;

  const textura: CanvasTexture = new CanvasTexture(tela);
  textura.minFilter = LinearFilter;
  textura.generateMipmaps = false;

  const no: Mesh = new Mesh(
    new PlaneGeometry(LARGURA_M, ALTURA_M),
    // Material sem iluminação de propósito: painel que escurece quando a luz
    // muda de lugar deixa de ser instrumento de leitura.
    new MeshBasicMaterial({ map: textura }),
  );
  no.name = 'painel';
  no.position.y = ALTURA_M / 2;

  let ultimoDesenho: number = Number.NEGATIVE_INFINITY;
  let ultimoTexto: string = '';

  function desenhar(linhas: readonly string[]): void {
    pincel.fillStyle = '#11131a';
    pincel.fillRect(0, 0, LARGURA_PX, ALTURA_PX);
    pincel.fillStyle = '#f2f4fa';
    pincel.font = `bold ${CORPO_PX + 4}px system-ui, sans-serif`;
    pincel.fillText(titulo, MARGEM_PX, 42);

    pincel.font = `${CORPO_PX}px system-ui, sans-serif`;
    let linhaY: number = 82;
    for (const linha of linhas) {
      if (linhaY > ALTURA_PX - MARGEM_PX) {
        break;
      }
      pincel.fillText(linha, MARGEM_PX, linhaY);
      linhaY += ENTRELINHA_PX;
    }
    textura.needsUpdate = true;
  }

  desenhar([]);

  function atualizar(linhas: readonly string[], decorrido: number): void {
    const texto: string = linhas.join('\n');
    if (decorrido - ultimoDesenho < INTERVALO_DE_REDESENHO || texto === ultimoTexto) {
      return;
    }
    ultimoDesenho = decorrido;
    ultimoTexto = texto;
    desenhar(linhas);
  }

  return { no, atualizar };
}
