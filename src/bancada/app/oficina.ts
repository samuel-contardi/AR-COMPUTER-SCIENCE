// src/bancada/app/oficina.ts
// ---------------------------------------------------------------------------
// Composição do Módulo 03: a Bateria passa a desenhar.
//
// Sobre o que já existia — domínio (Módulo 01) e sonda de capacidades
// (Módulo 02) — entra a cena como árvore de nós, o laço andando contra o
// relógio, e o painel de custo de quadro preso à própria estrutura de ferro.
//
// Este arquivo é o único que "apresenta" os outros uns aos outros: o relógio
// não sabe o que é uma bateria, a cena não sabe medir tempo, e o painel não
// sabe de onde vêm os números que exibe. É por isso que ele muda quando a
// composição muda, e os outros não.
//
// A demonstração ao vivo (slide 5, 6 e 7) sai inteira daqui:
//   1. a cena abre com bumbo, caixa e os dois pratos soltos no chão;
//   2. o poste do suporte balança de leve, e as hastes + o painel — que são
//      filhos dele — balançam junto, sem que nenhuma linha copie a rotação;
//   3. o botão reparenta o prato de ataque na haste, sem que ele saia do
//      lugar em que estava no mundo — o desvio medido prova isso em número;
//   4. o painel, dentro da cena, mostra o custo do quadro o tempo todo.
// ---------------------------------------------------------------------------

import { Object3D } from 'three';

import { montarPalco, type Palco } from '../core/palco';
import { montarCena, type CenaDaBateria } from '../core/cena';
import { Relogio, type Amostra } from '../core/relogio';
import { Orcamento, TETO_DESKTOP_MS, linhasDoOrcamento } from '../core/orcamento';
import { descreverArvore, reparentar } from '../core/hierarquia';
import { montarPainel, type Painel } from '../ui/painel';

/**
 * O que fica visível fora deste módulo: o suficiente para a página comum
 * (main.ts) montar a estrutura na tela e para o botão de prender/soltar
 * funcionar, e nada da maquinaria interna do laço.
 */
export interface Oficina {
  /** A árvore da cena, em texto, um nível por recuo. */
  estrutura(): string[];
  /** Posição de mundo do prato de ataque, em metros, para o diário. */
  posicaoDoPratoDeAtaque(): string;
  /** Verdadeiro quando o prato de ataque está preso à haste. */
  presa(): boolean;
  /** Prende o prato de ataque à haste. Devolve o desvio medido, em metros. */
  prender(): number;
  /** Devolve o prato de ataque ao chão. Devolve o desvio medido, em metros. */
  soltar(): number;
}

/** As frases que explicam por que a ordem dos passos do Módulo 03 não é livre. */
export function frasesSobreAOrdem(): string[] {
  return [
    'A árvore é percorrida do nó raiz até as folhas, e cada nó carrega a transformação do pai — ' +
      'por isso o poste balançar move as hastes e o painel junto, sem nenhuma linha extra.',
    'Prender o prato de ataque na haste não o move: troca o pai dele, e a posição de mundo é ' +
      'recalculada a partir do novo pai (haste-do-ataque), preservando onde ele estava.',
    'O laço avança pelo tempo transcorrido (relógio), não pela contagem de quadros — o balanço do ' +
      'poste e o custo do quadro no painel são os dois a prova disso.',
  ];
}

export function iniciarOficina(canvas: HTMLCanvasElement): Oficina {
  const palco: Palco = montarPalco(canvas);
  const cena: CenaDaBateria = montarCena();
  const relogio: Relogio = new Relogio();
  const orcamento: Orcamento = new Orcamento(TETO_DESKTOP_MS);

  // O painel é diegético: um objeto dentro da cena, preso ao poste, e não um
  // retângulo sobreposto à imagem.
  const painel: Painel = montarPainel('Custo do quadro');
  cena.suporteDoPainel.add(painel.no);

  const pratoDeAtaque: Object3D | undefined = cena.pecas.get('prato-ataque');
  if (pratoDeAtaque === undefined) {
    throw new Error('O domínio não declara o prato de ataque, e a demonstração não roda sem ele.');
  }

  let presoNaHaste: boolean = false;

  function quadro(instanteMs: number): void {
    const inicio: number = performance.now();

    palco.ajustar();
    const amostra: Amostra = relogio.avancar(instanteMs);

    // recorte:inicio poste-balanca-contra-o-relogio
    // O poste balança de leve, contra o tempo transcorrido — e não contra a
    // contagem de quadros, ou o balanço giraria mais rápido numa máquina
    // rápida e mais devagar numa lenta. As três hastes e o painel são filhos
    // dele: giram junto sem que esta função saiba que eles existem.
    cena.poste.rotation.z = Math.sin(amostra.decorrido * 1.2) * 0.025;
    // recorte:fim poste-balanca-contra-o-relogio

    painel.atualizar(linhasDoOrcamento(orcamento.ler()), amostra.decorrido);
    palco.desenhar(cena.sala);

    const custoMs: number = performance.now() - inicio;
    orcamento.registrar(
      custoMs,
      amostra.intervaloReal * 1000,
      palco.renderer.info.render.calls,
      palco.renderer.info.render.triangles,
    );
  }

  palco.renderer.setAnimationLoop(quadro);

  return {
    estrutura(): string[] {
      return descreverArvore(cena.sala);
    },
    posicaoDoPratoDeAtaque(): string {
      const p = pratoDeAtaque.getWorldPosition(pratoDeAtaque.position.clone());
      return `(${p.x.toFixed(3)}, ${p.y.toFixed(3)}, ${p.z.toFixed(3)})`;
    },
    presa(): boolean {
      return presoNaHaste;
    },
    prender(): number {
      const desvio: number = reparentar(pratoDeAtaque, cena.hasteDoAtaque);
      presoNaHaste = true;
      return desvio;
    },
    soltar(): number {
      const desvio: number = reparentar(pratoDeAtaque, cena.chao);
      presoNaHaste = false;
      return desvio;
    },
  };
}
