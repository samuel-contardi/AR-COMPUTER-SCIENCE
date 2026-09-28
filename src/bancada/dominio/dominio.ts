// src/bancada/dominio/dominio.ts
// ---------------------------------------------------------------------------
// Delimitação do domínio da Bancada — Grupo 7 (ZolpiBeat).
//
// Cena: uma bateria acústica desmontada num ambiente de ensaio. As peças estão
// jogadas no chão; quem usa o ambiente pega cada uma e encaixa no suporte de
// ferro até a bateria ficar de pé, pronta para tocar.
//
// Este arquivo é a Tarefa 1 e 2 do Projeto Integrador escritas como dado, e não
// como texto solto num documento à parte. O motivo é operacional: a
// delimitação precisa ser confrontável com o que o ambiente faz mais adiante,
// e texto em documento não se confronta com nada. Aqui ela é tipada, e o
// compilador passa a cobrar o que antes dependia de alguém reler a ata da
// reunião.
//
// Nada nesta etapa desenha, carrega malha ou abre sessão. A cena chega quando
// houver grafo de cena (Módulo 03); o encaixe, quando houver interação
// (módulos de manipulação). O que existe agora é a descrição do que aquele
// ambiente terá de suportar.
// ---------------------------------------------------------------------------

/** Identificador de uma peça manipulável da bateria. */
export type PecaId = 'bumbo' | 'caixa' | 'prato-chimbal' | 'prato-ataque';

/** Identificador de um encaixe do suporte de ferro. */
export type SocketId =
  | 'apoio-do-bumbo'
  | 'suporte-da-caixa'
  | 'haste-do-chimbal'
  | 'haste-do-ataque';

/**
 * Uma peça da bateria. `sockets` lista os encaixes que a aceitam — uma peça
 * que não serve em lugar nenhum é um objeto decorativo, e a delimitação
 * existe justamente para não deixar objeto decorativo entrar como se fosse
 * conteúdo.
 */
export interface Peca {
  readonly id: PecaId;
  readonly nome: string;
  readonly sockets: readonly SocketId[];
}

/**
 * A tarefa que o ambiente suporta, enunciada em uma frase, mais o estado que a
 * caracteriza concluída. Os dois campos andam juntos de propósito: tarefa sem
 * estado final é intenção, e é o que produz a cena bonita e vazia.
 */
export interface TarefaDoAmbiente {
  readonly enunciado: string;
  readonly estadoFinal: string;
}

export interface Dominio {
  readonly nome: string;
  readonly descricao: string;
  readonly tarefa: TarefaDoAmbiente;
  readonly pecas: readonly Peca[];
  readonly sockets: readonly SocketId[];
}

export const BATERIA: Dominio = {
  nome: 'Bateria',
  descricao:
    'Um ambiente de ensaio: no chão estão as peças de uma bateria acústica ' +
    'desmontada e, ao centro, um suporte de ferro com encaixes para cada uma. ' +
    'Quem usa o ambiente pega cada peça e a encaixa até a bateria ficar de pé.',
  tarefa: {
    enunciado:
      'Montar a bateria pegando cada peça do chão e encaixando-a no suporte de ' +
      'ferro correspondente.',
    estadoFinal:
      'As quatro peças estão encaixadas nos sockets compatíveis do suporte, e a ' +
      'bateria montada se mantém de pé sem apoio das mãos.',
  },
  pecas: [
    { id: 'bumbo', nome: 'Bumbo', sockets: ['apoio-do-bumbo'] },
    { id: 'caixa', nome: 'Caixa', sockets: ['suporte-da-caixa'] },
    { id: 'prato-chimbal', nome: 'Prato de chimbal', sockets: ['haste-do-chimbal'] },
    { id: 'prato-ataque', nome: 'Prato de ataque', sockets: ['haste-do-ataque'] },
  ],
  sockets: ['apoio-do-bumbo', 'suporte-da-caixa', 'haste-do-chimbal', 'haste-do-ataque'],
};

/**
 * Confere que todo socket citado por alguma peça existe no suporte e que todo
 * socket do suporte recebe alguma peça. Devolve a lista de inconsistências,
 * que é vazia quando o domínio fecha.
 *
 * O porquê de isto ser código, e não conferência a olho: a delimitação vai ser
 * editada muitas vezes ao longo do percurso (quatro peças hoje, seis se o
 * grupo acrescentar pedal e segundo pé de caixa mais adiante), e um socket
 * órfão sobrevive a qualquer releitura distraída — some só quando alguém
 * tenta encaixar, muitos módulos adiante, quando trocar de domínio já custa
 * caro.
 */
export function inconsistenciasDoDominio(dominio: Dominio): string[] {
  const declarados: ReadonlySet<SocketId> = new Set(dominio.sockets);
  const usados: Set<SocketId> = new Set();
  const problemas: string[] = [];

  for (const peca of dominio.pecas) {
    if (peca.sockets.length === 0) {
      problemas.push(`A peça "${peca.nome}" não encaixa em socket nenhum.`);
    }
    for (const socket of peca.sockets) {
      if (!declarados.has(socket)) {
        problemas.push(
          `A peça "${peca.nome}" cita o socket "${socket}", que o suporte não declara.`,
        );
      }
      usados.add(socket);
    }
  }

  for (const socket of dominio.sockets) {
    if (!usados.has(socket)) {
      problemas.push(`O socket "${socket}" não recebe peça alguma.`);
    }
  }

  return problemas;
}
