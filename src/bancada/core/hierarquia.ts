// src/bancada/core/hierarquia.ts
// ---------------------------------------------------------------------------
// Reparentagem: trocar de pai preservando o lugar no mundo.
//
// Prender uma peça da bateria à haste do suporte tem duas soluções. A
// primeira é recalcular a posição da peça a cada quadro, copiando a da haste.
// A segunda é mudar de quem ela é filha, uma vez, e nunca mais pensar no
// assunto.
//
// As duas produzem a mesma imagem hoje, e é por isso que a primeira sobrevive
// em código de gente apressada: nada no resultado denuncia a escolha. Ela
// cobra depois — no módulo de encaixe, quando a haste também puder girar (o
// pé de caixa se ajusta em altura, o braço do prato de ataque gira para a
// posição de quem toca) e a cópia manual passar a chegar um quadro atrasada.
//
// A operação está aqui em poucas linhas de álgebra porque essas linhas SÃO o
// conteúdo do módulo: a matriz local que preserva o mundo é a matriz do mundo
// vista de dentro do novo pai, M_local = M_pai⁻¹ · M_mundo. A biblioteca
// (three.js) oferece a mesma operação pronta (attach); o que a versão daqui
// acrescenta é a medida do desvio, que transforma "confio que preservou" em
// número conferível — e é esse número que aparece no diário e no slide 6.
// ---------------------------------------------------------------------------

import { Matrix4, Object3D, Vector3 } from 'three';

/** Reaproveitados entre chamadas: alocar vetor por quadro é lixo que o coletor cobra. */
const matrizLocal: Matrix4 = new Matrix4();
const posicaoAntes: Vector3 = new Vector3();
const posicaoDepois: Vector3 = new Vector3();

/**
 * Torna `filho` filho de `novoPai` sem que ele saia do lugar em que estava no
 * mundo. Devolve o desvio residual em metros: o erro de arredondamento da
 * conta, esperado entre zero e algo como 1e-15 m — no limite do ponto
 * flutuante.
 *
 * Desvio grande não é falha desta função: é sinal de que alguma matriz do
 * caminho até a raiz estava desatualizada quando a conta foi feita.
 */
export function reparentar(filho: Object3D, novoPai: Object3D): number {
  // Sem esta atualização a conta usa a matriz do quadro anterior, e a peça
  // pula para onde ela estava, não para onde está.
  filho.updateWorldMatrix(true, false);
  novoPai.updateWorldMatrix(true, false);

  posicaoAntes.setFromMatrixPosition(filho.matrixWorld);

  matrizLocal.copy(novoPai.matrixWorld).invert().multiply(filho.matrixWorld);

  novoPai.add(filho);
  matrizLocal.decompose(filho.position, filho.quaternion, filho.scale);

  filho.updateWorldMatrix(true, false);
  posicaoDepois.setFromMatrixPosition(filho.matrixWorld);

  return posicaoAntes.distanceTo(posicaoDepois);
}

/**
 * Desenha a árvore em texto, um nível por recuo. Serve à conferência a olho e
 * ao painel: hierarquia montada por acaso — objeto que virou filho de outro
 * porque foi criado ali, e não por razão de projeto — aparece na indentação
 * antes de aparecer no comportamento.
 */
export function descreverArvore(raiz: Object3D, profundidadeMaxima: number = 4): string[] {
  const linhas: string[] = [];

  function percorrer(no: Object3D, nivel: number): void {
    if (nivel > profundidadeMaxima) {
      return;
    }
    const nome: string = no.name === '' ? `<sem nome: ${no.type}>` : no.name;
    linhas.push(`${'  '.repeat(nivel)}${nome}`);
    for (const filho of no.children) {
      percorrer(filho, nivel + 1);
    }
  }

  percorrer(raiz, 0);
  return linhas;
}
