// src/bancada/core/cena.ts
// ---------------------------------------------------------------------------
// A cena mínima da Bateria, montada como árvore (Módulo 03, Tarefa 1).
//
// A hierarquia daqui não veio da ordem em que os objetos foram criados: veio
// das relações do domínio declarado em dominio.ts. A sala contém o chão e o
// suporte de ferro; o suporte carrega a base e, sobre ela, o poste; o poste
// carrega as hastes (chimbal, ataque, caixa) e o painel. Girar o poste tem de
// levar hastes e painel junto, porque na oficina real é isso que aconteceria
// se alguém encostasse nele — e essa é a razão de projeto de cada parentesco
// abaixo, não só "porque foram criados no mesmo lugar".
//
// As quatro peças (bumbo, caixa, prato-chimbal, prato-ataque) nascem SOLTAS,
// filhas do chão, e não já encaixadas nas hastes: nascer no destino apagaria
// justamente a operação de reparentagem que este módulo existe para ensinar
// (Tarefa 2, em hierarquia.ts).
//
// A geometria é paramétrica e propositalmente crua: cilindros e caixas, sem
// malha importada, sem textura. Modelar de verdade é assunto dos módulos de
// modelagem e de ativos (04 e 05); antecipar isso aqui esconderia o conteúdo
// deste módulo — a estrutura — atrás de peças bonitas.
//
// A escala é a única coisa que já precisa estar certa: uma unidade é um
// metro. O bumbo tem 0,60 m de diâmetro e o prato 0,40 m, como a Seção 4/9 da
// nossa especificação registra — e essa medida vai ser cobrada de verdade no
// regime imersivo, quando quem usa estiver de pé diante do kit em escala
// real.
// ---------------------------------------------------------------------------

import {
  BoxGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  GridHelper,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Scene,
} from 'three';

import { BATERIA, type PecaId } from '../dominio/dominio';

export interface CenaDaBateria {
  readonly sala: Scene;
  readonly chao: Group;
  readonly suporte: Group;
  readonly base: Group;
  /** O poste do suporte: é ele que balança de leve, e o que estiver preso balança junto. */
  readonly poste: Object3D;
  /** Onde o prato de ataque se prende. Filho do poste, e não do chão. */
  readonly hasteDoAtaque: Object3D;
  /** Onde o painel diegético se prende. Preso ao poste, e não à câmera. */
  readonly suporteDoPainel: Object3D;
  /** Cada peça declarada no domínio, com o nó que a representa na cena. */
  readonly pecas: ReadonlyMap<PecaId, Object3D>;
}

function materialFosco(cor: number): MeshStandardMaterial {
  return new MeshStandardMaterial({ color: cor, roughness: 0.7, metalness: 0.1 });
}

/** A forma provisória de cada peça, escolhida só para que ela seja reconhecível. */
function formaDaPeca(id: PecaId): Mesh {
  switch (id) {
    case 'bumbo': {
      // Deitado de lado, como uma bateria desmontada no chão: raio 0,30 m
      // (diâmetro de 0,60 m), profundidade 0,35 m. O cilindro nasce de pé;
      // giramos 90° em X para deitá-lo.
      const malha: Mesh = new Mesh(
        new CylinderGeometry(0.3, 0.3, 0.35, 24),
        materialFosco(0x8d5a3b),
      );
      malha.rotation.x = Math.PI / 2;
      return malha;
    }
    case 'caixa':
      // De pé, como se apoiada na própria borda: raio 0,175 m (diâmetro de
      // 0,35 m), altura 0,15 m.
      return new Mesh(new CylinderGeometry(0.175, 0.175, 0.15, 24), materialFosco(0xc9cbd6));
    case 'prato-chimbal':
      // Deitado, plano, no chão: raio 0,20 m (diâmetro de 0,40 m), 6 mm de
      // espessura.
      return new Mesh(new CylinderGeometry(0.2, 0.2, 0.006, 32), materialFosco(0xd4b45a));
    case 'prato-ataque':
      return new Mesh(new CylinderGeometry(0.2, 0.2, 0.006, 32), materialFosco(0xe0c368));
  }
}

/** Onde cada peça repousa no chão, antes de qualquer montagem. */
function repousoDaPeca(id: PecaId): [number, number, number] {
  switch (id) {
    case 'bumbo':
      return [-0.75, 0.3, 0.55];
    case 'caixa':
      return [0.6, 0.075, 0.6];
    case 'prato-chimbal':
      return [0.7, 0.003, -0.35];
    case 'prato-ataque':
      return [-0.65, 0.003, -0.5];
  }
}

export function montarCena(): CenaDaBateria {
  const sala: Scene = new Scene();
  sala.name = 'sala';
  sala.background = new Color(0x1b1d24);

  // Duas luzes, e nenhuma a mais. Cada luz custa em todo material que a
  // recebe, e o orçamento deste módulo não é formalidade: é o teto que a
  // máquina mais modesta da turma impõe.
  const ambiente: HemisphereLight = new HemisphereLight(0xdfe6f5, 0x2a2c33, 1.1);
  ambiente.name = 'luz-ambiente';
  sala.add(ambiente);

  const direcional: DirectionalLight = new DirectionalLight(0xffffff, 1.4);
  direcional.name = 'luz-direcional';
  direcional.position.set(1.2, 2.4, 1.5);
  sala.add(direcional);

  // recorte:inicio cena-chao
  // O chão é filho da sala, e as peças soltas nascem filhas DO CHÃO: estão
  // largadas no ambiente de ensaio, não sobre o suporte.
  const chao: Group = new Group();
  chao.name = 'chao';
  sala.add(chao);

  const piso: GridHelper = new GridHelper(4, 16, 0x4f7cff, 0x2a2a35);
  piso.name = 'piso';
  chao.add(piso);
  // recorte:fim cena-chao

  // recorte:inicio cena-suporte-e-poste
  // O suporte é filho da sala, não do chão: é uma estrutura de ferro fixa,
  // não uma peça que alguém carrega. A base é filha do suporte, e o poste é
  // filho da base — ele está apoiado nela, e girar a base tem de levar o
  // poste junto sem que ninguém escreva uma linha para isso acontecer.
  const suporte: Group = new Group();
  suporte.name = 'suporte';
  suporte.position.set(0, 0, -0.3);
  sala.add(suporte);

  const base: Group = new Group();
  base.name = 'base-do-suporte';
  suporte.add(base);

  const placaDaBase: Mesh = new Mesh(new BoxGeometry(0.4, 0.02, 0.4), materialFosco(0x2f333d));
  placaDaBase.position.y = 0.01;
  base.add(placaDaBase);

  const poste: Mesh = new Mesh(new CylinderGeometry(0.02, 0.02, 1.2, 12), materialFosco(0x555a66));
  poste.name = 'poste';
  poste.position.y = 0.62;
  base.add(poste);
  // recorte:fim cena-suporte-e-poste

  // recorte:inicio cena-hastes-filhas-do-poste
  // As três hastes e o suporte do painel são filhos do POSTE, não da base: é
  // o poste que balança de leve (ver oficina.ts), e tudo que está preso a
  // ele — as hastes e o painel — precisa balançar junto. Se fossem filhas da
  // base, o balanço do poste as deixaria para trás, o que contradiria a
  // própria estrutura de ferro que estamos simulando.
  const suporteDaCaixa: Object3D = new Object3D();
  suporteDaCaixa.name = 'suporte-da-caixa';
  suporteDaCaixa.position.set(0.16, -0.18, 0.1);
  poste.add(suporteDaCaixa);

  const hasteDoChimbal: Object3D = new Object3D();
  hasteDoChimbal.name = 'haste-do-chimbal';
  hasteDoChimbal.position.set(0, 0.35, 0.06);
  poste.add(hasteDoChimbal);

  const hasteDoAtaque: Object3D = new Object3D();
  hasteDoAtaque.name = 'haste-do-ataque';
  hasteDoAtaque.position.set(-0.22, 0.5, 0.02);
  poste.add(hasteDoAtaque);
  // recorte:fim cena-hastes-filhas-do-poste

  // recorte:inicio cena-pecas-nascem-soltas
  const pecas: Map<PecaId, Object3D> = new Map<PecaId, Object3D>();
  for (const peca of BATERIA.pecas) {
    const no: Mesh = formaDaPeca(peca.id);
    no.name = peca.id;
    const [x, y, z] = repousoDaPeca(peca.id);
    no.position.set(x, y, z);
    // As peças nascem soltas sobre o chão, e não já encaixadas na haste. É a
    // reparentagem (Tarefa 2) que vai movê-las de um pai para o outro.
    chao.add(no);
    pecas.set(peca.id, no);
  }
  // recorte:fim cena-pecas-nascem-soltas

  const suporteDoPainel: Object3D = new Object3D();
  suporteDoPainel.name = 'suporte-do-painel';
  // Preso ao poste, virado para quem monta a bateria. Painel preso à câmera
  // acompanharia a cabeça e deixaria de ser objeto do mundo.
  suporteDoPainel.position.set(0, 0.28, 0.05);
  poste.add(suporteDoPainel);

  return { sala, chao, suporte, base, poste, hasteDoAtaque, suporteDoPainel, pecas };
}
