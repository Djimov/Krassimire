# Requisitos do sistema

Explorador Temporal de Imagens de Satélite
Krassimire Iankov Djimov · 2301201 · Universidade Aberta
Última actualização: 2026-04-18 (v2.1)

---

## Requisitos funcionais — MoSCoW

### Must Have

| ID | Descrição | Critério de aceitação | Componente |
|---|---|---|---|
| RF1 | Selecção interactiva de região geográfica | O utilizador desenha uma bounding box; coordenadas registadas | MapSelector.tsx |
| RF1b | Pesquisa por topónimo (promovido v2.1) | O utilizador escreve um nome; mapa navega em menos de 2s | MapSelector.tsx + /api/geocode |
| RF2 | Editar ou redefinir a região | "Desenhar novamente" limpa e permite nova selecção | MapSelector.tsx |
| RF3 | Introduzir intervalo temporal | Aceita 1 a 24 meses; rejeita datas inconsistentes com mensagem | page.tsx |
| RF4 | Validar parâmetros temporais | Datas inválidas mostram mensagem clara sem chamar a API | validators.ts |
| RF5 | Consultar imagens Sentinel-2 | Devolve resultados ou informa ausência explicitamente | copernicus.ts |
| RF6 | Filtrar por cobertura de nuvens | Resultados têm cloudCoverage igual ou inferior ao valor definido | copernicus.ts |
| RF7 | Resultados em ordem cronológica | Timeline da imagem mais antiga para a mais recente | ImageStrip.tsx |
| RF8 | Seleccionar resultado da timeline | Clique na miniatura apresenta a imagem na vista principal | ImageStrip.tsx |
| RF9 | Apresentar imagem com metadados | Imagem visível com data e percentagem de nuvens | ImageStrip.tsx |
| RF10 | Pelo menos duas composições de bandas | Toggle TCI / NDVI / SWIR altera a imagem apresentada | ImageStrip.tsx |
| RF11 | Seleccionar duas imagens para comparação | Painel Antes/Depois permite selecção independente em cada coluna | ComparePanel.tsx |
| RF12 | Vista comparativa lado a lado | As duas imagens aparecem em simultâneo com etiquetas | ComparePanel.tsx |
| RF13 | Mensagens claras de erro | Todos os estados de erro têm mensagem em PT ou EN | validators.ts + i18n.ts |

### Should Have
RF14 Melhorias de usabilidade na timeline · RF15 Caching de respostas · RF16 Feedback visual de carregamento

### Could Have
RF17 Slider de comparação · RF18 Exportação CSV · RF19 Favoritos locais

### Won't Have (nesta fase)
Machine learning · Análise geoespacial avançada · Autenticação · Múltiplas missões · App móvel

---

## Requisitos não funcionais

| ID | Descrição | Prioridade | Estado |
|---|---|---|---|
| RNF1 | Interface intuitiva para não especialistas | Must Have | Em progresso |
| RNF2 | Código modular e manutenível | Must Have | Em progresso |
| RNF3 | Arquitectura documentada com C4 e ADRs | Must Have | Em progresso |
| RNF4 | Tratamento robusto de falhas externas | Must Have | Em progresso |
| RNF5 | Histórico GitHub com Conventional Commits | Must Have | Activo |
| RNF6 | Testes com Vitest | Must Have | Em progresso |
| RNF7 | Documentação contínua com changelog semanal | Must Have | Activo |
| RNF8 | Tempo de resposta menor que 5 segundos para demo | Should Have | Pendente |

---

## Rastreabilidade requisitos para implementação e testes

| Requisito | Implementação | Teste |
|---|---|---|
| RF1, RF2 | src/components/map/MapSelector.tsx | Testes manuais |
| RF1b | src/services/geocoding.ts e src/app/api/geocode/route.ts | Testes manuais |
| RF4 | src/lib/validators.ts | src/tests/validators.test.ts |
| RF5, RF6 | src/services/copernicus.ts e src/app/api/search/route.ts | Testes manuais |
| RF7 ao RF10 | src/features/timeline/ImageStrip.tsx | Testes manuais |
| RF11, RF12 | src/features/compare/ComparePanel.tsx | Testes manuais |
| RF13 | src/lib/validators.ts e src/lib/i18n.ts | src/tests/validators.test.ts |
