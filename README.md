# Smart Harpia
 
Sistema IoT de monitoramento de fluxo de pessoas em espaços públicos, desenvolvido na Incubadora do Instituto Federal do Paraná (IFPR), Campus Paranaguá.
 
O projeto detecta a presença de pessoas em um ambiente a partir dos sinais Wi-Fi emitidos por seus dispositivos móveis, sem câmeras e sem interação do usuário. Os dados são transmitidos em tempo real para uma API e visualizados em uma interface web com mapa, histórico e relatórios de movimentação.
 
Os resultados foram publicados na revista científica **ALBA – ISFIC Research and Science Journal** (ISSN 3006-2470), v. 1, n. 2, nov/2023, p. 3–12.
📄 [Ler o artigo](https://alba.ac.mz/index.php/alba/article/view/182)
 
---
 
## O problema
 
Gestores públicos precisam saber quantas pessoas circulam por um determinado espaço, em que horários e por quanto tempo permanecem. Essa informação orienta desde a alocação de recursos até o manejo de unidades de conservação. Na prática, porém, essa contagem costuma ser manual, cara e imprecisa.
 
O Smart Harpia propõe uma alternativa de baixo custo: um sensor autônomo que estima a presença de pessoas a partir dos dispositivos móveis que carregam.
 
---
 
## Como funciona
 
O sistema é dividido em três camadas independentes:
 
```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│      MDev       │      │       API       │      │       Web       │
│   ESP32 · C/C++ │─────▶│ AdonisJS · TS   │◀────▶│    Next.js      │
│                 │ HTTP │                 │      │                 │
│ Captura MACs em │      │ REST · Auth por │      │ Mapa, tempo real│
│ modo promíscuo  │      │ token · MySQL   │      │ e relatórios    │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```
 
### MDev — módulo de hardware
 
Duas placas ESP32 operando em papéis distintos:
 
- **Listener**: opera a interface Wi-Fi em modo promíscuo, monitorando os pacotes do ar e extraindo os endereços MAC dos dispositivos ao alcance.
- **Receiver**: mantém a conexão com a internet, gerencia uma tabela local dos MACs vistos e comunica a API. Cada MAC carrega um *time-to-live*; quando expira sem novas detecções, o dispositivo é considerado como tendo saído do ambiente e a API é notificada.
A separação em duas placas resolve uma limitação prática: o modo promíscuo e a conexão Wi-Fi comum não convivem bem no mesmo rádio.
 
### API
 
REST em AdonisJS e TypeScript. Responsável por autenticação, persistência dos registros de entrada e saída, agregação dos dados e geração de relatórios. Modelo relacional com 9 tabelas cobrindo instituições, locais, dispositivos de hardware, dispositivos detectados, logs e tokens.
 
Deploy em Google Cloud. Documentação das rotas gerada e publicada.
 
### Web
 
Interface em Next.js com autenticação, visualização em mapa dos sensores e seu raio de alcance, listagem em tempo real dos dispositivos presentes, histórico de permanência e relatórios com recortes diário, semanal e mensal.
 
---
 
## Decisões técnicas relevantes
 
**Distinguir pessoas de equipamentos.** Nem todo dispositivo com Wi-Fi ativo é um celular no bolso de alguém — impressoras, lâmpadas inteligentes e roteadores também aparecem. A primeira abordagem foi filtrar os MACs pelo prefixo de fabricante (OUI).
 
**Contornar o MAC randomization.** Smartphones Android e iOS modernos mascaram o endereço MAC ao sondar redes, justamente para impedir esse tipo de rastreamento. Isso quebra a filtragem por fabricante. A solução foi inverter a lógica: um MAC *sem* fabricante identificável é, com alta probabilidade, um smartphone aplicando randomização — e portanto uma pessoa. Os equipamentos fixos, que não randomizam, seguem identificáveis pelo OUI.
 
**Privacidade por design.** O sistema não coleta conteúdo de tráfego, apenas identificadores de presença. Além disso, expõe uma página pública onde qualquer pessoa pode informar um endereço MAC e removê-lo da base, sem precisar de conta.
 
---
 
## Validação em ambiente real
 
O sistema foi submetido a teste de estresse durante o **Anime IFPR 2023**, evento aberto realizado no campus. Durante toda a duração do evento a solução operou sem interrupções, registrando um pico de **709 dispositivos únicos em uma única hora**.
 
Além do teste de carga, foram conduzidos testes de usuário ao longo do desenvolvimento para avaliar corretude e facilidade de uso.
 
---
 
## Stack
 
| Camada   | Tecnologias                          |
| -------- | ------------------------------------ |
| Firmware | C, C++, ESP32, PlatformIO            |
| Backend  | AdonisJS, TypeScript, MySQL          |
| Frontend | Next.js, React                       |
| Infra    | Google Cloud                         |
| Design   | Figma                                |
 
---
 
## Repositórios
 
- **API** — [smart-harpia-api](https://github.com/angelonetho/smart-harpia-api)
- **Web** — [smart-harpia-web](https://github.com/angelonetho/smart-harpia-web)
- **Firmware** — [MDev-Receiver](https://github.com/angelonetho/MDev-Receiver)
---
 
## Processo
 
O desenvolvimento seguiu três fases: levantamento de requisitos, modelagem e implementação.
 
O levantamento foi conduzido com um cliente real — docente pesquisador da área de gestão ambiental — resultando em 10 regras de negócio e a especificação de requisitos funcionais e não-funcionais. A modelagem produziu diagramas de caso de uso, dicionário de dados, diagrama de classes, fluxogramas de API e firmware, modelo de banco e protótipos de tela.
 
🎨 [Protótipos e guideline de estilo no Figma](https://www.figma.com/file/TvTWUWCfLfaUPMQAnBo6em/)
 
---
 
## Autoria
 
Desenvolvido por **Angelo Andrioli Netho**, sob orientação dos professores Gil Eduardo de Andrade e Leandro Angelo Pereira (IFPR Campus Paranaguá).
 
**Como citar:**
 
> NETHO, A. A.; ANDRADE, G. E. de; PEREIRA, L. A. A Internet das Coisas (IoT) na gestão ambiental de cidades inteligentes: apresentação do projeto Smart Harpia como estudo de caso. *ALBA – ISFIC Research and Science Journal*, v. 1, n. 2, p. 3–12, 2023.
