# Especificação — Bateria (Grupo 7 · ZolpiBeat)

Estado do documento: fim do Módulo 03. Versionada junto do código.

**Legenda de estado** usada nas tabelas:
- **FEITO** — existe no repositório e roda no estado etiquetado `modulo-03`.
- **PREVISTO** — decidido, mas será construído em módulo adiante.
- **PROPOSTA** — valor sugerido, ainda sem confirmação do grupo. Toda proposta está listada na Seção 14 como decisão em aberto.

O que mudou desde o Módulo 01 está no **Apêndice A**, com o motivo de cada mudança.

---

# Bloco 1 — A cena

## 1. Identificação

| Campo | Valor |
|---|---|
| Grupo | 7 — ZolpiBeat |
| Integrantes | Samuel Ferreira Contardi, Willington Gabriel de Andrade, Nadine Gomes Gallego, Vinicius dos Santos Souza, Murilo Silva Régo |
| Cena | Bateria acústica desmontada em ambiente de ensaio |
| Pilha | TypeScript 6, three.js 0.185, Vite 8, API WebXR do navegador |
| Repositório | https://github.com/samuel-contardi/ar-computer-science |
| Etiqueta | `modulo-03` |

**Por que esta cena, em termos de custo.** A cena endurece a *estrutura de encaixe*: o suporte de ferro precisa existir como árvore, com um nó por haste, para que a operação de encaixe dos módulos seguintes tenha em que se apoiar. A armadilha que veio junto: se a árvore não tivesse um nó por encaixe agora, o módulo de manipulação teria de criar esses pontos depois, refazendo o que já devia estar pronto. Trocar de cena depois do Módulo 03 custaria a árvore inteira, as escalas e a sonda.

**Tarefa (uma frase).** Montar a bateria pegando cada peça do chão e encaixando-a no suporte de ferro correspondente.

**Estado que conclui a tarefa.** As quatro peças estão encaixadas nos sockets compatíveis do suporte, e a bateria montada se mantém de pé sem apoio das mãos. Fonte: `src/bancada/dominio/dominio.ts`.

## 2. Experiência

- Quem usa entra num ambiente de ensaio e vê no chão as quatro peças soltas: bumbo, caixa e dois pratos.
- No centro há um suporte de ferro com encaixes. Quem usa pega cada peça e a leva ao encaixe correspondente; se estiver dentro da tolerância (Seção 7), a peça encaixa.
- **Com as mãos**, e não com botão: pegar, transportar e soltar (regime imersivo, PREVISTO).
- **O que muda no visor:** a pessoa anda ao redor da bateria em escala 1:1, e o alcance do braço passa a contar.
- **O que precisa provar contra uma mesa de verdade** (regime de câmera): que o suporte se mantém preso à superfície real enquanto a pessoa caminha em volta.

**Hoje, no Módulo 03 (FEITO):** a cena abre na janela do navegador com câmera fixa; o poste balança sozinho; um botão prende o prato de ataque à haste e o painel dentro da cena mostra o custo do quadro. Não há ainda pegar/soltar.

## 3. Inventário de objetos

Todas as geometrias são primitivas criadas em código (`cena.ts`). Nada é importado nem texturizado.

**Peças manipuláveis** (nascem soltas, filhas de `chao`):

| Objeto | Qtd | Geometria | Dimensões | Posição inicial no chão (x, y, z) em m | Socket que o aceita | Move? |
|---|---|---|---|---|---|---|
| `bumbo` | 1 | cilindro deitado (girado 90° em X) | ⌀ 0,60 m × profundidade 0,35 m | (−0,75; 0,30; 0,55) | `apoio-do-bumbo` | Sim |
| `caixa` | 1 | cilindro de pé | ⌀ 0,35 m × altura 0,15 m | (0,60; 0,075; 0,60) | `suporte-da-caixa` | Sim |
| `prato-chimbal` | 1 | cilindro achatado | ⌀ 0,40 m × espessura 6 mm | (0,70; 0,003; −0,35) | `haste-do-chimbal` | Sim |
| `prato-ataque` | 1 | cilindro achatado | ⌀ 0,40 m × espessura 6 mm | (−0,65; 0,003; −0,50) | `haste-do-ataque` | Sim |

**Estrutura de ferro** (fixa, filha de `sala`):

| Nó | Tipo | Pai | Posição local (m) |
|---|---|---|---|
| `suporte` | Group | `sala` | (0; 0; −0,30) |
| `base-do-suporte` | Group (placa 0,40 × 0,02 × 0,40 m) | `suporte` | origem |
| `poste` | Mesh, cilindro ⌀ 0,04 m × 1,20 m | `base-do-suporte` | (0; 0,62; 0) |
| `suporte-da-caixa` | Object3D | `poste` | (0,16; −0,18; 0,10) |
| `haste-do-chimbal` | Object3D | `poste` | (0; 0,35; 0,06) |
| `haste-do-ataque` | Object3D | `poste` | (−0,22; 0,50; 0,02) |
| `suporte-do-painel` | Object3D | `poste` | (0; 0,28; 0,05) |

**Ambiente:** `chao` (grade 4 m × 4 m, 16 divisões), duas luzes (hemisférica e direcional), câmera perspectiva de 55° em (0; 1,5; 1,7) olhando para (0; 0,45; 0).

**Por que estes parentescos** (razão de projeto, e não de criação): o `poste` é filho da base porque está apoiado nela; as hastes e o painel são filhos do `poste` porque, na oficina real, encostar no poste leva tudo que está preso a ele. As peças nascem filhas do `chao` porque estão largadas no ambiente, e não no suporte: nascer no destino apagaria a operação de trocar de pai (`reparentar`).

**Lacuna conhecida:** `apoio-do-bumbo` está declarado como socket em `dominio.ts`, mas ainda não há nó correspondente na árvore de `cena.ts`. Ver Seção 14.

## 4. Escalas em metros

- **1 unidade da cena = 1 metro.** Fixado em `cena.ts`. Corrigir a escala depois obrigaria a refazer cada medida da cena.
- No visor (imersivo), a cena é vista em 1:1.
- Na câmera (AR), a escala em que a bateria aparece sobre a mesa (a versão inicial previa 1:5) é **decisão em aberto**, porque só pode ser validada em aparelho real.
- Alcance máximo de agarrar (imersivo): 2,0 m da mão até a peça (PREVISTO; valor herdado da versão inicial e ainda não testado).

---

# Bloco 2 — As regras

## 5. Ações

| Ação | O que a pessoa faz | O que o sistema faz | Se não puder | Estado |
|---|---|---|---|---|
| Olhar | Mira no objeto | Destaca o objeto mirado | Nada acontece | PREVISTO |
| Pegar | Aperta e segura (gatilho no visor; toque na câmera; clique na janela) | A peça passa a acompanhar a mão/cursor | Peça fora do alcance de 2,0 m não é pega | PREVISTO |
| Soltar | Solta o gatilho/clique | Se estiver dentro da tolerância do socket, encaixa (troca de pai); senão volta ao chão | Peça volta ao repouso inicial | PREVISTO |
| Prender / soltar prato de ataque (botão) | Clica no botão da página | `reparentar()` troca o pai do prato entre `chao` e `haste-do-ataque` e mostra a posição antes/depois | — | FEITO |

O encaixe é a operação `reparentar(filho, novoPai)` de `src/bancada/core/hierarquia.ts`: a posição de mundo é preservada por `M_local = M_pai⁻¹ · M_mundo`, e a função devolve o desvio em metros.

## 6. Tarefa e validação

- **Estado inicial:** 4 peças soltas no chão, nas posições da Seção 3.
- **Estado final:** 4 peças encaixadas nos sockets compatíveis.
- **Validação:** a ordem não importa. O sistema conta as peças cujo pai é o socket declarado para elas; a tarefa está concluída quando a contagem é 4.
- **Consistência do domínio (FEITO):** `inconsistenciasDoDominio()` recusa peça sem socket, socket citado e não declarado, e socket que não recebe peça.

## 7. Tolerâncias de encaixe

| Grandeza | Valor | Estado |
|---|---|---|
| Distância máxima entre a peça e o ponto do socket para encaixar | **3 cm** | PROPOSTA |
| Diferença máxima de ângulo entre o eixo da peça e o do socket | **15°** | PROPOSTA |
| Desvio máximo aceito na troca de pai (`reparentar`) | **1 × 10⁻⁹ m** | PROPOSTA (o valor esperado é ~10⁻¹⁵ m; ver `hierarquia.ts`) |

Os dois primeiros valores só podem ser confirmados no módulo de manipulação, com alguém segurando a peça. Enquanto isso, valem como ponto de partida testável: um encaixe a 3,5 cm ou a 16° é recusado.

## 8. Retorno ao usuário

| Evento | Retorno | Estado |
|---|---|---|
| Custo do quadro | Painel dentro da cena, preso ao poste, com teto, intervalo médio/pior, custo do nosso trabalho, % de quadros acima do teto, chamadas de desenho e triângulos | FEITO |
| Prender/soltar prato | Linha no diário com posição antes, posição depois e desvio em metros | FEITO |
| Falha de sonda | Texto legível na página (não só no console) | FEITO |
| Objeto mirado | Fica amarelo | PREVISTO |
| Objeto pego | Fica semitransparente | PREVISTO |
| Encaixe aceito / recusado | Pisca verde / pisca vermelho e a peça volta ao chão | PREVISTO |
| Tarefa concluída | A bateria brilha | PREVISTO |

---

# Bloco 3 — A máquina

## 9. Os três regimes, lado a lado

*(Esta seção reproduz a declaração de `src/bancada/modes/regimes.ts`, sem reescrita.)*

| | Janela | Visor | Câmera |
|---|---|---|---|
| Nome no código | Realidade virtual não imersiva | Realidade virtual imersiva | Realidade aumentada |
| Modo de sessão XR | `inline` | `immersive-vr` | `immersive-ar` |
| O que faz com o mundo de quem observa | **Exibe**: mostra a cena por uma janela, sem tocá-lo | **Substitui** o mundo por inteiro | **Preserva** o mundo e deposita a cena sobre ele |
| Espaço de referência | `viewer` | `local-floor` | `local-floor` |
| O que rastreia | Nada do corpo; a câmera obedece ao mouse | Pose da cabeça e das duas mãos, com seis graus de liberdade | Pose da cabeça, das mãos e as superfícies que o aparelho encontra |
| Contra o que registra | A origem arbitrária da própria cena, fixada por quem a modelou | O chão do espaço físico, para a bancada nascer na altura certa | Uma superfície real do ambiente, à qual a bancada permanece presa enquanto a pessoa caminha |
| Composição de fundo esperada | `opaque` | `opaque` | `alpha-blend` |
| Papel no projeto | Caso base: a bancada inteira precisa ser montável aqui | Onde escala corporal e alcance de braço passam a existir | Único regime em que errar o registro é visível a olho nu |
| O que terá de provar adiante | A lógica de hierarquia e laço em qualquer máquina | O encaixe bimanual com seis graus de liberdade | A estabilidade do suporte sobre piso real |
| Estado hoje | **FEITO** (roda sem equipamento) | Declarado; sonda pronta; **não validado em aparelho real** | Declarado; sonda pronta; **não validado em aparelho real** |

**Como o ambiente pergunta ao aparelho (Módulo 02, FEITO):**
- `sondarSemSessao()` pergunta o que se responde sem abrir sessão; `sondarEmSessao(modo)` abre a sessão por gesto do usuário (botão) e lê recursos concedidos, espaços de referência entregues, fontes de entrada e modo de composição.
- Cada recurso opcional tem **três estados**: `concedido`, `negado` (a sessão reportou a lista e o nome não está nela) e `indeterminado` (a sessão não reportou lista; não é recusa).
- O suporte a um regime tem três respostas: `sim`, `nao` e `desconhecido` (navegador sem API XR não diz "não serve": diz que não sabe).
- Graus de liberdade são **inferidos**, porque a API não os expõe: espaço de chão concedido → seis; só `viewer` → três; qualquer outro caso → `indeterminado`.
- A classe do aparelho é deduzida do que foi concedido, e não do nome do navegador: `sem-api`, `somente-janela`, `visor-sem-posicao`, `visor-com-posicao` ou `aparelho-de-mao-com-camera`.
- O relatório aparece na própria página (não só no console), para ser lido no aparelho de quem testa.

## 10. Orçamento e ordem de degradação

**Tetos declarados** (`src/bancada/core/orcamento.ts`), antes de haver conteúdo pesado:

| Regime | Teto por quadro |
|---|---|
| Janela / desktop | 16,7 ms (60 quadros por segundo) |
| Visor | 11,1 ms (90 quadros por segundo) |

**Como se mede.** Duas grandezas distintas, que não podem ser confundidas:
- **Custo do nosso trabalho:** tempo de CPU gasto em montar o quadro (atualizar a cena, redesenhar o painel, chamar o desenho).
- **Intervalo:** tempo real entre duas imagens entregues; inclui placa de vídeo e compositor do sistema. Custo baixo com intervalo alto aponta para fora do nosso código.

A janela de observação guarda os últimos 120 quadros, para que um engasgo recente não seja diluído pela média do ensaio inteiro.

**Como o laço avança.** Pelo tempo transcorrido, e não pela contagem de quadros (`relogio.ts`). O salto por quadro é limitado a 0,1 s: se a aba perder o foco e voltar depois de vários segundos, a cena avança 0,1 s e não os segundos inteiros. O poste balança com amplitude de 0,025 rad (≈ 1,4°) e período de ≈ 5,2 s, o mesmo em qualquer máquina.

**Limites de carga da cena hoje:** 4 peças + suporte em geometria crua, 2 luzes, densidade de pixels limitada a 2 por pixel de layout (`palco.ts`).

**Medição do grupo** (slide 7): custo médio de **1,82 ms** por quadro; pico de **4,10 ms**; máquina: desktop, Google Chrome, Intel i7, GPU dedicada, 60 Hz. O pico é o pior *custo* medido. Se o painel rotular o valor como "intervalo", corrigir o rótulo: em 60 Hz o intervalo real não fica abaixo de ≈ 16 ms.

**Ordem de degradação** (PROPOSTA, nenhum item implementado ainda):
1. Reduzir o teto de densidade de pixels de 2 para 1.
2. Reduzir os segmentos radiais dos cilindros (24 e 32 hoje).
3. Desligar a luz direcional e manter só a hemisférica.

A versão inicial previa "tirar sombra, depois textura"; a cena atual não tem nem sombra nem textura (ver Apêndice A).

## 11. Comportamento quando dá errado

| Situação | O que o ambiente faz hoje | Estado |
|---|---|---|
| Navegador sem API XR | Regime marcado `desconhecido`; a cena em janela continua funcionando | FEITO |
| Página fora de contexto seguro (sem HTTPS) | Alerta no diário: a API XR não é exposta e o botão responderia como se o aparelho não tivesse suporte | FEITO |
| Aparelho recusa o modo de sessão | Mensagem legível: "O aparelho recusou a sessão neste modo" | FEITO |
| Sessão pedida sem gesto do usuário | Mensagem legível: falta de gesto ou contexto inseguro | FEITO |
| Já existe sessão aberta | Mensagem legível pedindo para encerrar a anterior | FEITO |
| Pose não chega em quadros da sessão | `ContadorDeEstabilidade` conta quadros sem pose e a maior lacuna, separando perda de rastreamento de sessão fora de foco | FEITO (sem validação em aparelho real) |
| Aba perde foco e volta | Teto de salto de 0,1 s no relógio | FEITO |
| Domínio inconsistente | Alerta no diário ao carregar | FEITO |
| Permissão de câmera negada (AR) | Mostrar "Ligue a câmera" e parar | PREVISTO |
| Perda de rastreamento no AR | Peça congela e fica transparente até reencontrar o chão | PREVISTO |
| Peça além de 2,0 m da mão | Solta da mão e volta ao chão | PREVISTO |

---

# Bloco 4 — O trabalho

## 12. Origem e licença de cada ativo

Nenhum ativo externo é usado neste módulo: todas as formas são geradas em código.

| Item | Origem | Licença |
|---|---|---|
| Geometrias e materiais das peças e do suporte | Criados em código (`cena.ts`) | Autoria do grupo |
| three.js | npm | MIT |
| Vite e `@vitejs/plugin-basic-ssl` | npm | MIT |
| TypeScript | npm | Apache-2.0 |
| `src/assets/*`, `public/*.svg` | Modelo inicial do Vite | Herdados; não usados pela cena e candidatos à remoção |

Modelos de bateria (o `bateria.fbx` cogitado na versão inicial) só entram nos módulos de modelagem e de ativos externos; cada um receberá aqui origem, licença e URL.

## 13. Plano de construção por blocos

| Bloco | Conteúdo | Estado |
|---|---|---|
| Módulo 01 | Cena, domínio, três regimes, especificação | FEITO |
| Módulo 02 | Sonda de capacidades e relatório visível | FEITO |
| Módulo 03 | Cena como árvore, troca de pai, laço por tempo com orçamento | FEITO |
| Módulo 04 | Modelagem das peças (substitui a geometria crua) | PREVISTO |
| Módulo 05 | Ativos de autoria externa | PREVISTO |
| Módulos seguintes | Manipulação (mirar, pegar, encaixar com tolerância, retorno), áudio, validação nos regimes de visor e câmera | PREVISTO |

Ordem obrigatória dentro do Módulo 03: a troca de pai (passo 8) pressupõe a árvore (passo 7); a árvore se confere contra o domínio (passo 2).

## 14. Riscos e decisões em aberto

**Riscos**

| Risco | Mitigação |
|---|---|
| O socket `apoio-do-bumbo` não tem nó na árvore; o bumbo é a única peça sem destino | Criar o nó e defini-lo antes do módulo de manipulação |
| Tolerâncias de encaixe (Seção 7) são propostas e nunca foram testadas com uma mão | Ajustar no módulo de manipulação com peça real em mãos |
| Regimes de visor e câmera nunca foram abertos em aparelho real | Registrar cada aparelho testado, e o que não abriu, na tabela de aparelhos (`docs/aparelhos.md`) |
| Custo medido em uma única máquina, com GPU dedicada | Medir também em máquina modesta antes de crescer a cena |
| Peça atravessar o chão ao ser movida rápido (a versão inicial cogitava colisão contínua da Unity) | A pilha é three.js, sem motor de física; decidir no módulo de manipulação se haverá colisão ou apenas um limite de altura |
| O escopo pode crescer com o som | Áudio fica para depois da manipulação e só entra se o orçamento permitir |

**Decisões em aberto**
1. Confirmar ou trocar as tolerâncias da Seção 7 (3 cm, 15°, 10⁻⁹ m).
2. Escala da bateria na câmera (a inicial previa 1:5).
3. Ordem de degradação da Seção 10.
4. Áudio simples ou espacial (som fixo ou que muda conforme a pessoa anda).
5. Se `src/ar.ts`, `src/controllers.ts`, `src/scene.ts` e os assets do Vite continuam no repositório ou saem.

**Declaração de uso de IA.** A versão inicial deste documento usou o ChatGPT apenas para formatar Markdown e a tabela; o grupo revisou os números. Esta versão foi redigida com apoio do Claude (Anthropic) a partir do código do repositório. **[Grupo: confirmar que revisou cada número e registrar o uso no diário de atividades.]**

---

# Apêndice A — O que mudou desde o Módulo 01, e por quê

| # | Era | Passou a ser | Motivo |
|---|---|---|---|
| 1 | Motor: Unity (colisão contínua, `bateria.fbx`) | three.js sobre WebXR, em TypeScript | A pilha do projeto é a do navegador, e a mesma página abre em janela, visor e câmera sem instalar nada |
| 2 | Objetos "baixados" de fora | Geometria crua criada em código | Modelagem é assunto do Módulo 04 e ativos externos, do 05; antecipar esconderia a estrutura atrás de peças bonitas |
| 3 | Meta de 24 quadros por segundo | Tetos por tempo de quadro e por regime: 16,7 ms (janela), 11,1 ms (visor) | 24 quadros por segundo não corresponde a nenhum aparelho-alvo; um teto em ms permite compará-lo diretamente ao custo medido |
| 4 | Ordem de degradação: sombra, depois textura | Proposta da Seção 10 (densidade de pixels, segmentos, luz) | A cena não tem sombra nem textura; a ordem antiga não cortava nada |
| 5 | Ações e retornos descritos como se existissem | Tabelas com coluna de estado (FEITO/PREVISTO) | Só o botão de prender e o painel de custo existem; o restante depende do módulo de manipulação |
| 6 | Tolerâncias "a decidir" | Valores propostos (3 cm, 15°, 10⁻⁹ m) | Seção sem número é intenção com formatação melhor; os valores são ponto de partida testável |
| 7 | Regimes com três respostas de recurso implícitas | Recurso `concedido/negado/indeterminado`, suporte `sim/nao/desconhecido` | Ausência de resposta não é recusa; tratar como recusa gera relatório confiante e errado |
| 8 | Sem tabela de dimensões da caixa | Caixa ⌀ 0,35 m × 0,15 m | Necessário para a árvore em escala em metros |

**Tentado e abandonado**
- Anexar as hastes à base em vez de ao poste: descartado porque, ao balançar, o poste deixaria as hastes para trás, contrariando a estrutura de ferro que se quer simular.
- Consultar `depth-sensing` na sonda: descartado porque um pedido malformado derruba a sessão inteira, em vez de só negar o recurso (ver `recursos.ts`).
