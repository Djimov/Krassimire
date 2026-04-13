# Proposta inicial do projecto

## Identificação

- **Projecto:** Explorador Temporal de Imagens de Satélite
- **Estudante:** Krassimire Djimov
- **Número:** 2301201
- **Orientador:** Pedro Pestana

## Síntese do problema

O projecto responde a um problema simples mas real: apesar de existir um grande volume de imagens de satélite públicas, a sua exploração continua pouco acessível a utilizadores não especialistas. As ferramentas existentes tendem a ser orientadas para utilizadores com conhecimentos em SIG e observação da Terra, e não para um utilizador que deseje apenas observar a evolução temporal de uma região de forma clara e visual.

## Solução proposta

Desenvolver uma aplicação web que permita:
1. seleccionar uma região num mapa interactivo;
2. definir um intervalo temporal;
3. pesquisar imagens Sentinel-2;
4. filtrar resultados por cobertura de nuvens;
5. organizar os resultados numa timeline;
6. visualizar imagens em pelo menos duas composições;
7. comparar dois momentos temporais lado a lado.

## Justificação da mudança de stack

A proposta inicial considerava uma arquitectura com React no frontend e Node.js + Express no backend. Após análise mais cuidada do âmbito, do calendário e do risco de implementação, a stack foi revista para **Next.js + TypeScript + Leaflet + Copernicus + Vitest + Git/GitHub**.

A mudança foi decidida pelas seguintes razões:

- elimina a necessidade de manter dois projectos separados para frontend e backend;
- permite concentrar a lógica de UI e as rotas de API no mesmo repositório e na mesma aplicação;
- reduz a complexidade de configuração e de integração entre camadas;
- mantém uma arquitectura suficientemente clara para documentação com C4;
- é mais adequada a um projecto individual com prazo académico limitado.

## MVP

O MVP corresponde ao núcleo funcional mínimo:
- selecção de região;
- definição de intervalo temporal;
- pesquisa de imagens Sentinel-2;
- filtro por cobertura de nuvens;
- timeline cronológica;
- visualização individual;
- comparação lado a lado;
- tratamento de erros e estados vazios.

## Estado até à data

Até esta data, o trabalho realizado concentra-se em:
- consolidação da proposta;
- definição do MVP;
- levantamento de requisitos com MoSCoW;
- arquitectura inicial (C4 nível 1 e 2);
- modelo de dados preliminar;
- preparação do repositório GitHub;
- planeamento de testes e riscos.

A implementação funcional do sistema começa na fase seguinte.
