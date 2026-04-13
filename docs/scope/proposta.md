# Proposta do projecto — versão operacional 2.0

## 1. Enquadramento

O projecto **Explorador Temporal de Imagens de Satélite** insere-se na Opção A da unidade curricular e visa o desenvolvimento de uma aplicação web para pesquisa, visualização e comparação temporal de imagens Sentinel-2. A ideia central é disponibilizar uma interface simples e académicamente defensável para um problema que, na prática, continua pouco acessível a utilizadores não especialistas: observar como uma determinada região geográfica mudou ao longo do tempo.

Apesar da abundância de dados públicos de observação da Terra, as plataformas existentes tendem a ser orientadas para utilizadores com conhecimentos em SIG, sensores remotos e processamento geoespacial. O projecto propõe uma abordagem distinta: em vez de expor a complexidade técnica do domínio, cria uma camada de simplificação com foco no fluxo principal de uso.

## 2. Problema

O utilizador comum enfrenta três dificuldades principais quando tenta explorar imagens de satélite:

1. interfaces demasiado técnicas;
2. fraca orientação à comparação temporal simples;
3. excesso de complexidade em tarefas que, do ponto de vista do utilizador, deveriam ser directas.

O sistema proposto procura responder a esse problema através de um fluxo de utilização centrado em quatro acções essenciais: seleccionar uma região, definir um intervalo temporal, visualizar resultados e comparar dois momentos distintos.

## 3. Objectivo geral

Desenvolver uma aplicação web que permita explorar e comparar temporalmente imagens Sentinel-2 de uma região escolhida pelo utilizador, de forma intuitiva, robusta e adequada a utilizadores não especialistas.

## 4. Objectivos específicos

- permitir a selecção de uma região geográfica num mapa interactivo;
- permitir a definição de um intervalo temporal válido;
- integrar uma fonte pública de dados Sentinel-2;
- permitir filtrar resultados por cobertura de nuvens;
- apresentar os resultados de forma cronológica;
- permitir visualizar uma imagem seleccionada;
- permitir alternar entre diferentes composições de bandas;
- permitir comparação lado a lado entre duas imagens;
- tratar erros e estados vazios de forma explícita e compreensível.

## 5. MVP

O MVP corresponde ao núcleo funcional mínimo que deverá estar operacional na entrega final. Não se trata de uma versão superficial do projecto, mas sim do conjunto de funcionalidades que define o contrato prático entre a proposta, a implementação e a demonstração final.

### Funcionalidades do MVP

- selecção de região no mapa;
- introdução de intervalo temporal;
- pesquisa de imagens Sentinel-2;
- filtro por cobertura máxima de nuvens;
- timeline cronológica de resultados;
- visualização de uma imagem;
- alternância entre pelo menos duas composições de bandas;
- comparação temporal lado a lado;
- tratamento de erros e ausência de resultados.

### Critérios de aceitação

| Funcionalidade | Critério de aceitação observável |
|---|---|
| Selecção de região | O utilizador consegue definir visualmente uma área no mapa e o sistema regista essa área para uso na pesquisa |
| Intervalo temporal | O sistema aceita datas válidas e rejeita datas inconsistentes com mensagens claras |
| Pesquisa de imagens | Após introdução da região e datas, o sistema devolve resultados compatíveis ou indica explicitamente que não existem |
| Filtro por nuvens | O sistema aplica efectivamente o valor máximo de cobertura de nuvens definido pelo utilizador |
| Timeline | Os resultados são apresentados cronologicamente e podem ser percorridos pelo utilizador |
| Visualização | Ao seleccionar um resultado, a imagem correspondente é apresentada de forma legível |
| Composições | O utilizador consegue alternar entre pelo menos duas visualizações da mesma imagem |
| Comparação | O sistema apresenta duas imagens em vista lado a lado |
| Tratamento de erros | A aplicação responde de forma controlada a erros, ausência de resultados e parâmetros inválidos |

## 6. Mudança de stack e justificação

A análise inicial considerava uma arquitectura clássica com **React + TypeScript** no frontend e **Node.js + Express** no backend. Após reflexão técnica e metodológica, essa opção foi revista.

A mudança para **Next.js + TypeScript** decorre de três factores principais:

1. **redução da complexidade estrutural** — deixa de ser necessário manter dois projectos separados;
2. **melhor adequação ao calendário académico** — reduz-se o esforço de integração entre camadas;
3. **preservação da qualidade técnica** — é possível manter fronteiras claras entre interface, serviços e rotas de API sem inflacionar o esforço de implementação.

A stack actual passa, assim, a ser:

- **Next.js + TypeScript**
- **Leaflet**
- **Copernicus Data Space Ecosystem**
- **Vitest**
- **Git + GitHub**

## 7. Âmbito

### Incluído

- aplicação web acessível via navegador;
- mapa interactivo com selecção de região;
- pesquisa temporal de produtos Sentinel-2;
- filtro por nuvens;
- timeline cronológica;
- visualização de imagem;
- comparação lado a lado;
- documentação e testes do núcleo do sistema.

### Excluído nesta fase

- machine learning;
- autenticação de utilizadores;
- aplicação móvel nativa;
- análise geoespacial avançada;
- persistência complexa de dados;
- suporte profundo a múltiplas missões satélite.

## 8. Resultado esperado

O resultado esperado é um protótipo funcional, tecnicamente credível e defensável em contexto académico, acompanhado de documentação coerente com a implementação real. O sucesso do projecto dependerá não apenas do funcionamento do sistema, mas também da capacidade de justificar as decisões tomadas em termos de requisitos, arquitectura, modelo de dados, testes e gestão do trabalho.
