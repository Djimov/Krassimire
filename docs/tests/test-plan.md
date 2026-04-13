# Plano de testes inicial

## 1. Objectivo
Este documento identifica as áreas críticas do sistema que deverão ser validadas ao longo do desenvolvimento do MVP.

## 2. Áreas prioritárias de teste

### Validação de parâmetros
- datas inválidas;
- intervalo temporal invertido;
- valor de cobertura de nuvens fora do intervalo esperado;
- ausência de região seleccionada.

### Integração com serviços
- formatação correcta dos pedidos para a API externa;
- transformação dos resultados recebidos;
- comportamento perante falhas de autenticação ou indisponibilidade.

### Lógica de domínio
- ordenação cronológica dos resultados;
- selecção de imagem para visualização;
- selecção de duas imagens para comparação;
- preservação coerente do estado da comparação.

### Interface e fluxo principal
- apresentação da timeline;
- renderização de estados vazios;
- apresentação de mensagens de erro;
- alternância entre composições de bandas.

## 3. Estratégia de teste

- testes unitários com Vitest para validações e funções utilitárias;
- testes de integração para o fluxo principal de pesquisa e transformação de resultados;
- testes manuais guiados pelos critérios de aceitação do MVP.

## 4. Critério mínimo de cobertura académica

O objectivo não é maximizar cobertura numérica de forma artificial, mas sim garantir que as funcionalidades centrais do MVP tenham evidência clara de validação.
