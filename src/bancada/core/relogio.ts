// src/bancada/core/relogio.ts
// ---------------------------------------------------------------------------
// O relógio do ambiente.
//
// A partir do Módulo 03 a cena avança pelo tempo transcorrido, e não pelo
// número de quadros desenhados. A diferença não aparece na máquina de quem
// escreve o código — aparece no aparelho de outra pessoa, que desenha em outra
// cadência e rodaria o mesmo mecanismo em outra velocidade se o laço contasse
// quadros.
//
// O relógio faz uma coisa a mais que um simples "tempo desde o último quadro":
// ele limita o salto. Quando a aba perde o foco, o laço para de ser chamado; ao
// voltar, o intervalo real pode ser de vários segundos, e entregar esse número
// à cena faria o batedor do bumbo balançar de um lado a outro várias vezes de
// uma só vez, num pulo que não corresponde a nada que aconteceu de verdade.
// ---------------------------------------------------------------------------

/** O que o relógio entrega a cada quadro. Tudo em segundos. */
export interface Amostra {
  /** Tempo desde o quadro anterior, já limitado pelo teto de salto. */
  readonly delta: number;
  /** Tempo acumulado desde o primeiro quadro, somando os deltas limitados. */
  readonly decorrido: number;
  /** Intervalo real medido, antes do limite. Serve à medição, não à animação. */
  readonly intervaloReal: number;
  /** Verdadeiro quando o intervalo real excedeu o teto e foi cortado. */
  readonly saltoDescartado: boolean;
}

/** Teto de salto, em segundos. Acima disto a suspensão é tratada como pausa. */
const TETO_DE_SALTO_PADRAO: number = 0.1;

export class Relogio {
  private readonly tetoDeSalto: number;
  private ultimoInstanteMs: number | undefined = undefined;
  private decorrido: number = 0;

  constructor(tetoDeSalto: number = TETO_DE_SALTO_PADRAO) {
    this.tetoDeSalto = tetoDeSalto;
  }

  /**
   * Recebe o instante que o laço de animação informa, em milissegundos, e
   * devolve a amostra do quadro.
   *
   * O primeiro quadro tem delta zero de propósito: não existe intervalo
   * anterior a medir, e inventar um valor plausível aqui é a origem de um
   * solavanco na primeira imagem que o ambiente mostra.
   */
  avancar(instanteMs: number): Amostra {
    const anterior: number | undefined = this.ultimoInstanteMs;
    this.ultimoInstanteMs = instanteMs;

    if (anterior === undefined) {
      return { delta: 0, decorrido: 0, intervaloReal: 0, saltoDescartado: false };
    }

    const intervaloReal: number = (instanteMs - anterior) / 1000;
    const saltoDescartado: boolean = intervaloReal > this.tetoDeSalto;
    const delta: number = saltoDescartado ? this.tetoDeSalto : intervaloReal;
    this.decorrido += delta;

    return { delta, decorrido: this.decorrido, intervaloReal, saltoDescartado };
  }

  /** Zera a contagem sem destruir o relógio. Usado ao trocar de regime. */
  reiniciar(): void {
    this.ultimoInstanteMs = undefined;
    this.decorrido = 0;
  }
}
