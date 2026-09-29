<img width="720" height="720" alt="ZolpiBeat" src="https://github.com/user-attachments/assets/9be6b8c6-161e-4091-9fd5-b290a2263c35" />

# Bateria — ZolpiBeat (Grupo 7)

Ambiente de realidade estendida no navegador em que uma **bateria acústica desmontada** está espalhada no chão de uma sala de ensaio, e a tarefa é **montá-la**: pegar cada peça e encaixá-la no suporte de ferro correspondente.

Estado atual: **Módulo 03** (etiqueta `modulo-03`). A cena já é desenhada como árvore de objetos, o laço avança contra o relógio e o custo do quadro aparece dentro da própria cena. Pegar e encaixar com as mãos ainda não existe: é assunto dos módulos de manipulação.

## Integrantes

Samuel Ferreira Contardi · Willington Gabriel de Andrade · Nadine Gomes Gallego · Vinicius dos Santos Souza · Murilo Silva Régo

## O que é o ambiente

| | |
|---|---|
| **Cena** | Bateria acústica desmontada em ambiente de ensaio |
| **Tarefa** | Montar a bateria pegando cada peça do chão e encaixando-a no suporte de ferro correspondente |
| **Peças** | Bumbo (⌀ 0,60 m), caixa (⌀ 0,35 m), prato de chimbal e prato de ataque (⌀ 0,40 m cada) |
| **Escala** | 1 unidade = 1 metro |
| **Tecnologia** | TypeScript, three.js, Vite, API WebXR do navegador |

A especificação completa, com as decisões que mudaram desde o Módulo 01 e o motivo, está em [`docs/especificacao.md`](docs/especificacao.md).

## Como rodar

**Requisitos:** [Node.js](https://nodejs.org) em versão recente (20.19 ou superior, ou 22.12 ou superior, exigência do Vite) e um navegador com WebGL (Chrome, Edge ou Firefox atuais).

```bash
git clone https://github.com/samuel-contardi/ar-computer-science.git
cd ar-computer-science
git checkout modulo-03
npm install
npm run dev
```

O Vite mostra dois endereços no terminal:

- **Local:** `https://localhost:5173`, para abrir no próprio computador.
- **Network:** `https://<IP-do-computador>:5173`, para abrir em outro aparelho na mesma rede Wi-Fi.

A página é servida em **HTTPS com certificado autoassinado**, porque a API WebXR só existe em contexto seguro. Na primeira vez o navegador avisa que a conexão não é privada: escolha *Avançado → Continuar*. Sem HTTPS a página abre, mas o botão de sondagem responde como se o aparelho não tivesse suporte, e a página avisa isso no diário.

Outros comandos:

| Comando | O que faz |
|---|---|
| `npm run typecheck` | Confere os tipos sem gerar arquivos |
| `npm run build` | Confere os tipos e gera a versão de produção em `dist/` |
| `npm run preview` | Serve a versão de produção |

## O que se vê ao abrir

O regime em **janela** não pede equipamento algum e abre sozinho. Passo a passo da demonstração:

1. **A cena abre com os objetos prometidos:** bumbo, caixa e os dois pratos soltos no chão, e o suporte de ferro ao centro.
2. **Um objeto se move junto com outro:** o poste do suporte balança de leve, e as hastes e o painel, que são filhos dele, balançam juntos sem que nenhuma linha copie a rotação.
3. **Um objeto troca de pai e continua onde estava:** o botão *Prender o prato de ataque na haste* faz o prato de ataque deixar de ser filho do chão e passar a ser filho de `haste-do-ataque`. O diário da página registra a posição de mundo antes, a posição depois e o desvio medido em metros.
4. **O indicador de custo do quadro está dentro da cena:** o painel preso ao poste mostra o teto do quadro, o intervalo médio e o pior, o custo do nosso trabalho, a porcentagem de quadros acima do teto, as chamadas de desenho e os triângulos.

Abaixo da cena a página mostra a **estrutura da cena** em árvore, o **relatório do que o aparelho responde sem sessão** e o **diário de atividades**. O botão *Sondar capacidades do aparelho* abre uma sessão XR de teste (exige toque do usuário e um aparelho compatível) e mostra na própria página o que o aparelho concedeu, negou ou não soube dizer.

## Os três regimes

| Regime | O que faz com o mundo de quem observa | Estado |
|---|---|---|
| **Janela** (`inline`) | Mostra a cena por uma janela, sem tocá-lo | Funcionando |
| **Visor** (`immersive-vr`) | Substitui o mundo por inteiro | Declarado e sondado; ainda não validado em aparelho real |
| **Câmera** (`immersive-ar`) | Mantém o mundo e deposita a cena sobre ele | Declarado e sondado; ainda não validado em aparelho real |

## Aparelhos em que já foi visto funcionando

> **Pendente:** o registro dos aparelhos testados (aparelho, regime que abriu, o que não abriu) ainda não foi escrito. Ele será mantido em `docs/aparelhos.md` e deve ser preenchido depois que alguém de fora do grupo abrir o ambiente a partir da etiqueta `modulo-03`, em outra máquina, seguindo só este arquivo.

Medição de custo do quadro feita pelo grupo (desktop, Google Chrome, Intel i7, GPU dedicada, 60 Hz): custo médio de 1,82 ms, pico de 4,10 ms, contra o teto declarado de 16,7 ms. Detalhes na Seção 10 da especificação.

## Como o código está organizado

```
src/bancada/
├── main.ts              # monta a página: cena, relatório, sonda, diário e botões
├── dominio/dominio.ts   # tarefa, peças e sockets, escritos como dado tipado
├── modes/               # os três regimes (regimes.ts), verificação e limites da janela
├── devices/             # sonda de capacidades: recursos, graus de liberdade, estabilidade
├── core/
│   ├── cena.ts          # a cena como árvore, em geometria crua e em metros
│   ├── hierarquia.ts    # reparentar(): troca de pai preservando a posição no mundo
│   ├── relogio.ts       # avanço pelo tempo transcorrido, com teto de salto
│   ├── orcamento.ts     # tetos por quadro e medição de custo e intervalo
│   └── palco.ts         # canvas, câmera e ajuste de tamanho
├── app/oficina.ts       # compõe tudo: laço, balanço do poste, painel, prender/soltar
├── relatorio/           # relatório visível na página e diário de atividades
└── ui/painel.ts         # o painel de custo desenhado dentro da cena
```

## Decisões de arquitetura

- **Árvore, e não lista de coordenadas.** Cada nó tem transformação própria em relação ao pai; o poste balançar leva as hastes e o painel sem cálculo manual.
- **Trocar de pai, e não recalcular a posição a cada quadro.** `reparentar()` faz a conta uma vez (`M_local = M_pai⁻¹ · M_mundo`) e devolve o desvio em metros.
- **Tempo transcorrido, e não contagem de quadros.** O ambiente se comporta igual em máquinas de velocidades diferentes.
- **Perguntar ao aparelho antes de assumir.** Recurso ausente, negado e indeterminado são tratados como situações distintas.
- **Orçamento declarado antes de haver conteúdo pesado:** 16,7 ms na janela e 11,1 ms no visor.
