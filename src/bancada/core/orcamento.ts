// src/bancada/core/orcamento.ts
// ---------------------------------------------------------------------------
// O orçamento por quadro.
//
// Declarado agora, antes de a cena ter conteúdo pesado — hoje são quatro
// peças de bateria em geometria crua e nada mais —, e essa ordem é a decisão
// de projeto deste arquivo. Teto declarado depois que o ambiente já está
// montado não é orçamento: é laudo do que já foi gasto.
//
// O que se mede são duas grandezas diferentes, e confundi-las produz
// diagnóstico errado. O CUSTO é o tempo que o NOSSO trabalho de quadro
// consome na CPU — montar a árvore, mover o batedor, redesenhar o painel — e é
// o que dá para cortar. O INTERVALO é o tempo real entre duas imagens
// entregues — o que o olho de quem usa percebe, e nele entra também a placa
// de vídeo e o compositor do sistema, que não escrevemos. Custo baixo com
// intervalo alto aponta para fora do nosso código.
// ---------------------------------------------------------------------------

/** Teto do desktop do laboratório, em milissegundos: sessenta imagens por segundo. */
export const TETO_DESKTOP_MS: number = 16.7;

/** Teto do visor, em milissegundos: noventa imagens por segundo. */
export const TETO_VISOR_MS: number = 11.1;

export interface LeituraDoOrcamento {
  readonly tetoMs: number;
  readonly quadrosMedidos: number;
  readonly custoMedioMs: number;
  readonly intervaloMedioMs: number;
  /** O pior intervalo da janela observada. É ele que produz o engasgo sentido. */
  readonly piorIntervaloMs: number;
  readonly quadrosAcimaDoTeto: number;
  readonly chamadasDeDesenho: number;
  readonly triangulos: number;
}

/** Quantos quadros a janela de observação guarda. */
const JANELA_PADRAO: number = 120;

export class Orcamento {
  private readonly tetoMs: number;
  private readonly custos: Float64Array;
  private readonly intervalos: Float64Array;
  private proximo: number = 0;
  private preenchidos: number = 0;
  private chamadasDeDesenho: number = 0;
  private triangulos: number = 0;

  constructor(tetoMs: number, janela: number = JANELA_PADRAO) {
    this.tetoMs = tetoMs;
    this.custos = new Float64Array(janela);
    this.intervalos = new Float64Array(janela);
  }

  /**
   * Registra o quadro recém-terminado. O buffer é circular e de tamanho fixo
   * porque a alternativa — acumular tudo e tirar a média do percurso inteiro —
   * esconde exatamente o que interessa: a média do ensaio inteiro dilui o
   * engasgo de um segundo atrás até ele desaparecer do número.
   */
  registrar(custoMs: number, intervaloMs: number, chamadas: number, triangulos: number): void {
    this.custos[this.proximo] = custoMs;
    this.intervalos[this.proximo] = intervaloMs;
    this.proximo = (this.proximo + 1) % this.custos.length;
    if (this.preenchidos < this.custos.length) {
      this.preenchidos += 1;
    }
    this.chamadasDeDesenho = chamadas;
    this.triangulos = triangulos;
  }

  ler(): LeituraDoOrcamento {
    if (this.preenchidos === 0) {
      return {
        tetoMs: this.tetoMs,
        quadrosMedidos: 0,
        custoMedioMs: 0,
        intervaloMedioMs: 0,
        piorIntervaloMs: 0,
        quadrosAcimaDoTeto: 0,
        chamadasDeDesenho: 0,
        triangulos: 0,
      };
    }

    let somaDeCustos: number = 0;
    let somaDeIntervalos: number = 0;
    let pior: number = 0;
    let acima: number = 0;

    for (let i: number = 0; i < this.preenchidos; i += 1) {
      const custo: number = this.custos[i] ?? 0;
      const intervalo: number = this.intervalos[i] ?? 0;
      somaDeCustos += custo;
      somaDeIntervalos += intervalo;
      if (intervalo > pior) {
        pior = intervalo;
      }
      if (intervalo > this.tetoMs) {
        acima += 1;
      }
    }

    return {
      tetoMs: this.tetoMs,
      quadrosMedidos: this.preenchidos,
      custoMedioMs: somaDeCustos / this.preenchidos,
      intervaloMedioMs: somaDeIntervalos / this.preenchidos,
      piorIntervaloMs: pior,
      quadrosAcimaDoTeto: acima,
      chamadasDeDesenho: this.chamadasDeDesenho,
      triangulos: this.triangulos,
    };
  }
}

/**
 * As linhas que o painel exibe dentro da cena. Ficam aqui, e não no painel,
 * porque quem sabe o que cada número significa é quem o mediu.
 */
export function linhasDoOrcamento(leitura: LeituraDoOrcamento): string[] {
  if (leitura.quadrosMedidos === 0) {
    return ['Orcamento: ainda sem quadros medidos.'];
  }
  const proporcaoAcima: number = (leitura.quadrosAcimaDoTeto / leitura.quadrosMedidos) * 100;
  return [
    `Teto do quadro: ${leitura.tetoMs.toFixed(1)} ms`,
    `Intervalo medio: ${leitura.intervaloMedioMs.toFixed(1)} ms  ·  pior: ${leitura.piorIntervaloMs.toFixed(1)} ms`,
    `Custo do nosso trabalho: ${leitura.custoMedioMs.toFixed(2)} ms`,
    `Acima do teto: ${proporcaoAcima.toFixed(0)}% dos ${leitura.quadrosMedidos} quadros`,
    `Chamadas de desenho: ${leitura.chamadasDeDesenho}  ·  triangulos: ${leitura.triangulos}`,
  ];
}
