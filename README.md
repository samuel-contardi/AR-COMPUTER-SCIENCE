<img width="720" height="720" alt="Gemini_Generated_Image_gbqk90gbqk90gbqk" src="https://github.com/user-attachments/assets/d9ea42c1-9c42-4c09-b230-66437ba9d2a9" />


### Seção 1
* **Grupo e Integrantes:** Grupo 7 — ZolpiBeat


Samuel Ferreira Contardi  
Willington Gabriel de Andrade  
Nadine Gomes Gallego  
Vinicius dos Santos Souza  
Murilo Silva Régo  


* **Cena:** Bateria acústica desmontada em ambiente de ensaio.
* **Descricao da Cena:** Peças de bateria no chão que você pega e bota no ferro até montar tudo.
* **Por que esta cena:** Desenvolvendo conseitos de colisão aceitando o desafio para modelar encaixes com regras e não ter coordenadas fixas dos objetos da bateria
* **B.o:** Escopo pode crescer de acordo com o som


### Seção 2
Você entra, vê o bumbo e os pratos no chão. Pega a peça com a mão, leva até a haste de ferro e bota. Se tiver perto, ela gruda.


* **Mãos:** Pega a peça e solta.
* **Visor:** Você anda em volta da bateria de verdade.


### Seção 3


| Objeto | Quantos | Origem | Move? | Observação |
| :--- | :--- | :--- | :--- | :--- |
| Bumbo | 1 | Baixado | Sim | Peça grande |
| Caixa | 1 | Baixado | Sim | Tambor pequeno |
| Prato | 2 | Baixado | Sim | Disco de metal |


### Seção 4
* **Tamanho do ambiente:** Aonde vc estiver.
* **Tamanho dos objetos:** Bumbo de 60 centímetros, Prato de 40 centímetros.
* **Local de apoio:** No chão virtual.
* **Escalas:** Tamanho real no visor (1:1), tamanho pequeno de brinquedo na câmera do celular (1:5).


### Seção 5


| Ação | O que a pessoa faz | O que o sistema faz | Se não puder |
| :--- | :--- | :--- | :--- |
| Olhar | Mira no objeto | Pinta de amarelo | Nada |
| Pegar | Clica e segura | Peça gruda no cursor | Apita som grave |
| Soltar | Solta o clique | Peça cai ou gruda no ferro | Peça volta pro chão |




### Seção 6
* **Estado inicial:** 4 peças jogadas no chão.
* **Estado final:** 4 peças grudadas nos ferros.
* **Validação:** Tanto faz a ordem. O sistema vê se a contagem de peças encaixadas é igual a 4.


### Seção 7
* **Folga de posição:** A decidir.
* **Folga de ângulo:** A decidir.




### Seção 8
* **Objeto mirado:** Fica amarelo.
* **Objeto apanhado:** Fica meio transparente.
* **Encaixe aceito:** Pisca verde.
* **Encaixe recusado:** Pisca vermelho e cai no chão.
* **Tarefa concluída:** Brilha.


### Seção 9
(A decidir, nada confirmado)
| Aspecto | Na tela | No visor | Pela câmera |
| :--- | :--- | :--- | :--- |
| **Como se olha** | Arrasta o mouse | Mexe a cabeça | Aponta o celular |
| **Como se aponta e age** | Clica e arrasta | Aperta o gatilho da mão | Toca no vidro do celular |
| **Escala da cena** | Tela cheia | Tamanho real | Pequeno na mesa |
| **O que a cena faz de diferente** | Botão 2D | Anda 360 graus | Gruda na mesa |
| **O que não existe neste regime** | Rastreamento de cabeça | Botões de mouse | Andar pra trás |


### Seção 10
* **Total de objetos:** 4 objetos no total.
* **Meta de fluidez:** 24 quadros por segundo.
* **Repetição:** Suporte da bateria e pratos.
* **Ordem de degradação:** 1º Tira sombra, 2º Tira textura


### Seção 11
* **Aparelho não suporta o regime:** Mostra mensagem "Não roda" e abre no modo tela normal.
* **Permissão de câmera negada:** Mostra mensagem "Ligue a câmera" e para.
* **Perda de rastreamento:** O objeto trava no ar e fica transparente até a câmera achar o chão de novo.
* **Fora do alcance:** O objeto solta da mão e cai se ir além de 2 metros.


### Seção 12
(a definir os modelos)
| Arquivo | Origem | Licença | Endereço (URL) |
| :--- | :--- | :--- | :--- |
| `bateria.fbx` | procurar |  |  |


### Seção 13
* A trabalhar no plano de ação


---


### Seção 14
* **Riscos:** A peça atravessar o chão se mexer rápido. Mitigação: Ativar colisão contínua na Unity.
* **Decisões em aberto:** Áudio simples ou 3D: Definir se o som toca direto ou se muda de lado conforme você anda.
* **Declaração de IA:** Usamos o ChatGPT para formatar este texto em Markdown e fazer a tabela rápida. O grupo revisou os números.
