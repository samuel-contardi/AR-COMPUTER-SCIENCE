// src/bancada/core/palco.ts
// ---------------------------------------------------------------------------
// O palco: superfície de desenho, câmera e o ajuste ao tamanho disponível.
//
// Duas decisões daqui têm consequência direta no orçamento do módulo.
//
// A primeira é o teto da densidade de pixels: acima de 2 pixels físicos por
// pixel de layout o ganho visual não paga o custo, e dobrar a densidade
// quadruplica o trabalho de desenho. Como a máquina mais fraca da turma é um
// notebook de vídeo integrado, é aqui que o orçamento estoura primeiro se
// ninguém cortar.
//
// A segunda é conferir o tamanho do canvas A CADA QUADRO, em vez de escutar o
// evento de redimensionamento da janela. O evento cobre um caso; o ambiente
// tem pelo menos três: janela redimensionada, celular girado, e a saída de
// uma sessão imersiva — que devolve o desenho ao canvas com outra medida e
// sem disparar evento de janela nenhum.
// ---------------------------------------------------------------------------

import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

/** Teto da densidade de pixels. Acima disto o ganho visual não paga o custo. */
const DENSIDADE_MAXIMA: number = 2;

export interface Palco {
  readonly renderer: WebGLRenderer;
  readonly camera: PerspectiveCamera;
  /** Ajusta o alvo de desenho ao canvas. Devolve `true` quando algo mudou. */
  ajustar(): boolean;
  desenhar(cena: Scene): void;
}

export function montarPalco(canvas: HTMLCanvasElement): Palco {
  const renderer: WebGLRenderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, DENSIDADE_MAXIMA));

  // A câmera olha o suporte de ferro de quem chega para montar a bateria: um
  // pouco acima e à frente, olhando para o centro do kit, mais baixo que a
  // altura dos olhos porque a bateria fica perto do chão. Fixa de propósito:
  // o que este módulo demonstra é a hierarquia se movendo, e câmera que se
  // move junto confundiria os dois movimentos.
  const camera: PerspectiveCamera = new PerspectiveCamera(55, 1, 0.05, 50);
  camera.position.set(0, 1.5, 1.7);
  camera.lookAt(0, 0.45, 0);

  function ajustar(): boolean {
    const densidade: number = Math.min(window.devicePixelRatio, DENSIDADE_MAXIMA);
    const largura: number = Math.max(1, Math.floor(canvas.clientWidth * densidade));
    const altura: number = Math.max(1, Math.floor(canvas.clientHeight * densidade));

    if (canvas.width === largura && canvas.height === altura) {
      return false;
    }

    // O terceiro argumento em falso impede a biblioteca de escrever largura e
    // altura no estilo do elemento. Quem manda no tamanho em tela é a folha
    // de estilo; aqui só se acerta o tamanho do buffer de desenho.
    renderer.setSize(largura, altura, false);
    camera.aspect = largura / altura;
    camera.updateProjectionMatrix();
    return true;
  }

  function desenhar(cena: Scene): void {
    renderer.render(cena, camera);
  }

  return { renderer, camera, ajustar, desenhar };
}
