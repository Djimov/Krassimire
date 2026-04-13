# Requisitos do sistema

## Requisitos funcionais

| ID | Requisito |
|---|---|
| RF1 | O sistema deve permitir seleccionar uma área geográfica num mapa interactivo. |
| RF2 | O sistema deve permitir editar ou redefinir a região seleccionada. |
| RF3 | O sistema deve permitir introduzir um intervalo temporal de pesquisa. |
| RF4 | O sistema deve validar os parâmetros temporais introduzidos. |
| RF5 | O sistema deve consultar uma fonte externa de imagens Sentinel-2. |
| RF6 | O sistema deve permitir filtrar resultados por cobertura de nuvens. |
| RF7 | O sistema deve apresentar resultados ordenados cronologicamente. |
| RF8 | O sistema deve permitir seleccionar um resultado da timeline. |
| RF9 | O sistema deve apresentar uma imagem correspondente ao resultado seleccionado. |
| RF10 | O sistema deve disponibilizar pelo menos duas composições de bandas. |
| RF11 | O sistema deve permitir seleccionar duas imagens para comparação. |
| RF12 | O sistema deve apresentar as duas imagens em vista lado a lado. |
| RF13 | O sistema deve apresentar mensagens claras em caso de erro, ausência de resultados ou parâmetros inválidos. |

## Requisitos não funcionais

| ID | Requisito |
|---|---|
| RNF1 | A aplicação deve ser intuitiva para utilizadores não especialistas. |
| RNF2 | O código deve estar organizado de forma modular e manutenível. |
| RNF3 | A arquitectura deve estar explicitamente documentada. |
| RNF4 | O sistema deve tratar falhas da API externa de forma robusta. |
| RNF5 | O repositório GitHub deve reflectir a evolução do projecto. |
| RNF6 | O sistema deve incluir testes adequados às funcionalidades centrais. |
| RNF7 | A documentação deve acompanhar o desenvolvimento. |
| RNF8 | O tempo de resposta deve ser aceitável para demonstração académica. |

## Priorização MoSCoW

### Must Have
- selecção de região no mapa;
- intervalo temporal;
- pesquisa de imagens Sentinel-2;
- filtro por cobertura de nuvens;
- timeline cronológica;
- visualização de imagem;
- comparação lado a lado;
- tratamento de erros.

### Should Have
- alternância entre diferentes composições de bandas;
- feedback visual de carregamento;
- melhoria progressiva da usabilidade;
- isolamento da integração com o Copernicus num serviço dedicado.

### Could Have
- pesquisa por topónimo;
- slider de comparação;
- exportação simples de metadados;
- histórico de sessões.

### Won't Have (nesta fase)
- autenticação de utilizadores;
- base de dados persistente;
- aprendizagem automática;
- análise geoespacial avançada;
- suporte multi-satélite alargado.
