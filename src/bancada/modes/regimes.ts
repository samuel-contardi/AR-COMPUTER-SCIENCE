// src/bancada/modes/regimes.ts
// ---------------------------------------------------------------------------
// Declaração dos três regimes da Bancada.
//
// Este arquivo é a Tarefa 2 do Projeto Integrador. Ele não abre sessão, não
// renderiza e não detecta nada: declara, regime a regime, o espaço de referência
// pretendido, o que será rastreado e contra o que a cena será registrada.
//
// Escrever isso antes do código tem uma consequência barata e boa: mais adiante,
// quando os regimes existirem de fato, a declaração pode ser confrontada com o
// comportamento observado. Declaração que ninguém guarda não se confronta com
// coisa alguma, e o projeto perde o único registro de qual era a intenção.
// ---------------------------------------------------------------------------

/**
 * Os três regimes do ambiente. Os dois primeiros nomes coincidem com os modos de
 * sessão da API XR do navegador de propósito — é o que permite perguntar ao
 * aparelho, sem tradução no meio, se ele suporta o que declaramos.
 */
export type RegimeId = 'inline' | 'immersive-vr' | 'immersive-ar';

/**
 * O que o regime faz com o ambiente de quem observa — a distinção que separa os
 * três antes de qualquer detalhe técnico.
 */
export type TratamentoDoMundo =
  | 'substitui'   // o ambiente sintético toma o lugar do ambiente real
  | 'preserva'    // o ambiente real permanece visível e recebe o sintético sobre si
  | 'exibe';      // o ambiente sintético é mostrado por uma janela, sem tocar o real

/**
 * Modo de composição do fundo, tal como a API XR o nomeia. É o ponto em que o
 * contínuo entre o real e o sintético deixa de ser desenho de livro e vira um
 * valor que a sessão informa: fundo opaco esconde o mundo, os outros dois o
 * deixam passar. Só é legível com uma sessão ativa, e por isso aqui ele é o
 * valor ESPERADO — a leitura do valor real chega quando houver sessão.
 */
export type ModoDeComposicao = 'opaque' | 'additive' | 'alpha-blend';

export interface Regime {
  readonly id: RegimeId;
  readonly nome: string;
  readonly tratamentoDoMundo: TratamentoDoMundo;
  /** Espaço de referência pretendido, no vocabulário da API XR. */
  readonly espacoDeReferencia: 'viewer' | 'local' | 'local-floor' | 'unbounded';
  /** O que o sistema rastreia neste regime, em uma frase. */
  readonly rastreia: string;
  /** Contra o que a cena é registrada — a origem do mundo virtual. */
  readonly registroContra: string;
  readonly composicaoEsperada: ModoDeComposicao;
  /** Por que este regime existe no projeto, e não como enfeite comparativo. */
  readonly papel: string;
}

export const REGIMES: readonly Regime[] = [
  {
    id: 'inline',
    nome: 'Realidade virtual não imersiva',
    tratamentoDoMundo: 'exibe',
    espacoDeReferencia: 'viewer',
    rastreia: 'nada do corpo; a câmera obedece ao mouse',
    registroContra: 'a origem arbitrária da própria cena, fixada por quem a modelou',
    composicaoEsperada: 'opaque',
    papel:
      'É o caso base e o destino de quem não tem headset: a bancada inteira precisa ' +
      'ser montável aqui.',
  },
  {
    id: 'immersive-vr',
    nome: 'Realidade virtual imersiva',
    tratamentoDoMundo: 'substitui',
    espacoDeReferencia: 'local-floor',
    rastreia: 'a pose da cabeça e a das duas mãos, com seis graus de liberdade',
    registroContra:
      'o chão do espaço físico onde a pessoa está, o que faz a bancada nascer na ' +
      'altura certa em vez de flutuar',
    composicaoEsperada: 'opaque',
    papel:
      'É onde escala corporal e alcance de braço passam a existir — e nenhum dos ' +
      'dois tem equivalente na janela do desktop.',
  },
  {
    id: 'immersive-ar',
    nome: 'Realidade aumentada',
    tratamentoDoMundo: 'preserva',
    espacoDeReferencia: 'local-floor',
    rastreia:
      'a pose da cabeça, a das mãos e as superfícies que o aparelho encontra no ' +
      'ambiente',
    registroContra:
      'uma superfície real escolhida no ambiente, à qual a bancada permanece presa ' +
      'enquanto a pessoa caminha em volta',
    composicaoEsperada: 'alpha-blend',
    papel:
      'É o único regime em que errar o registro é visível a olho nu: a bancada ' +
      'desliza sobre a mesa, e ninguém precisa de instrumento para notar.',
  },
];

export function regimePorId(id: RegimeId): Regime {
  const encontrado: Regime | undefined = REGIMES.find((regime) => regime.id === id);
  if (encontrado === undefined) {
    // Inalcançável enquanto REGIMES cobrir RegimeId, e é o compilador que garante
    // isso ao construir a lista. O lançamento existe para o caso de alguém
    // acrescentar um id ao tipo e esquecer a entrada correspondente.
    throw new Error(`Regime não declarado: ${id}`);
  }
  return encontrado;
}
// src/bancada/modes/verificacao.ts
// ---------------------------------------------------------------------------
// Confronto entre o que declaramos e o que o aparelho oferece.
//
// A Tarefa 2 termina numa declaração de intenção, e intenção envelhece bem
// demais: continua parecendo certa muito depois de ter deixado de ser. Este
// arquivo faz a pergunta correspondente ao navegador em que a página está aberta
// e devolve as duas colunas lado a lado.
//
// O que ele NÃO faz, e a distinção importa: não abre sessão, não mede graus de
// liberdade, não enumera fontes de entrada nem lista capacidades opcionais. Isso
// é a sonda de capacidades, que pertence ao módulo de dispositivos. Aqui a
// pergunta é a mais grossa possível — "este aparelho entra neste regime?" —, que
// é exatamente a que o conceito deste módulo suporta.
// ---------------------------------------------------------------------------

import { REGIMES, type Regime, type RegimeId } from './regimes';

/**
 * `desconhecido` não é sinônimo de `nao`. O navegador sem a API XR não está
 * dizendo que o aparelho não serve — está dizendo que não sabe responder, e
 * tratar as duas coisas como a mesma é o erro que faz um relatório honesto
 * virar um relatório confiante e errado.
 */
export type Suporte = 'sim' | 'nao' | 'desconhecido';

export interface LinhaDoRelatorio {
  readonly regime: Regime;
  readonly suporte: Suporte;
  readonly observacao: string;
}

/** A API XR do navegador, quando existe. */
function sistemaXr(): XRSystem | undefined {
  return navigator.xr;
}

async function suporteDe(id: RegimeId): Promise<Suporte> {
  const xr: XRSystem | undefined = sistemaXr();
  if (xr === undefined) {
    return 'desconhecido';
  }
  try {
    const suportado: boolean = await xr.isSessionSupported(id);
    return suportado ? 'sim' : 'nao';
  } catch {
    // Alguns navegadores rejeitam a promessa em vez de devolver `false` — para
    // um modo de sessão que não reconhecem, ou fora de contexto seguro. Nos dois
    // casos o que se sabe é que não houve resposta utilizável.
    return 'desconhecido';
  }
}

function observacaoDe(regime: Regime, suporte: Suporte): string {
  if (suporte === 'sim') {
    return `Declarado com registro contra ${regime.registroContra}. Falta confrontar em sessão.`;
  }
  if (suporte === 'nao') {
    return 'Este aparelho não entra neste regime. É informação sobre o aparelho, não defeito do código.';
  }
  return 'Sem API XR neste navegador, ou página fora de contexto seguro (HTTPS).';
}

export async function levantarRelatorio(): Promise<LinhaDoRelatorio[]> {
  const linhas: LinhaDoRelatorio[] = [];
  for (const regime of REGIMES) {
    const suporte: Suporte = await suporteDe(regime.id);
    linhas.push({ regime, suporte, observacao: observacaoDe(regime, suporte) });
  }
  return linhas;
}