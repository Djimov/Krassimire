# Requisitos do sistema

Explorador Temporal de Imagens de Satélite
Krassimire Iankov Djimov · 2301201 · Universidade Aberta
Última actualização: 2026-04-18 (v2.1)

---

## Requisitos funcionais — MoSCoW

### Must Have

| ID | Descrição | Critério de aceitação | Componente |
|---|---|---|---|
| RF1 | Selecção interactiva de região geográfica | O utilizador desenha uma bounding box; o sistema regista as coordenadas | MapSelector.tsx |
| RF1b | Pesquisa por topónimo (Must Have — promovido v2.1) | O utilizador escreve um nome; o mapa navega para o local em menos de 2s | MapSelector.tsx + /api/geocode |
| RF2 | Editar ou redefinir a região seleccionada | "Desenhar novamente" limpa a região e permite nova selecção | MapSelector.tsx |
| RF3 | Introduzir intervalo temporal de pesquisa | O sistema aceita períodos de 1 a 24 meses; rejeita datas inconsistentes | page.tsx |
| RF4 | Validar parâmetros temporais | Datas inválidas mostram mensagem clara sem chamar a API | validators.ts |
| RF5 | Consultar imagens Sentinel-2 no Copernicus | Devolve resultados reais ou informa explicitamente a ausência | copernicus.ts |
| RF6 | Filtrar por cobertura de nuvens | Resultados apresentados têm cloudCoverage igual ou inferior ao limite definido | copernicus.ts |
| RF7 | Resultados em ordem cronológica | Timeline da imagem mais antiga para a mais recente | ImageStrip.tsx |
| RF8 | Seleccionar resultado da timeline | Clique na miniatura apresenta a imagem na visualização principal | ImageStrip.tsx |
| RF9 | Apresentar imagem com metadados | Imagem visível com data de aquisição e percentagem de nuvens | ImageStrip.tsx |
| RF10 | Pelo menos duas composições de bandas | Toggle TCI / NDVI / SWIR altera a imagem apresentada | ImageStrip.tsx |
| RF11 | Seleccionar duas imagens para comparação | Painel Antes/Depois permite selecção independente em cada coluna | ComparePanel.tsx |
| RF12 | Vista comparativa lado a lado | As duas imagens aparecem em simultâneo com etiquetas Antes e Depois | ComparePanel.tsx |
| RF13 | Mensagens claras de erro e estados vazios | Todos os estados de erro têm mensagem em PT ou EN conforme o idioma activo | validators.ts + i18n.ts |

### Should Have

| ID | Descrição | Estado |
|---|---|---|
| RF14 | Melhorias de usabilidade na timeline (scroll, indicador de posição) | Pendente |
| RF15 | Caching simples de respostas recentes da API Copernicus | Pendente |
| RF16 | Melhor feedback visual durante carregamentos (skeleton, spinner) | Pendente |

### Could Have

| ID | Descrição | Estado |
|---|---|---|
| RF17 | Slider interactivo para comparação temporal (split view) | Pendente |
| RF18 | Exportação de metadados em CSV | Pendente |
| RF19 | Favoritos ou histórico local da sessão | Pendente |

### Won't Have (nesta fase)

- Machine learning e detecção automática de alterações
- Análise geoespacial avançada no servidor
- Sistema de autenticação e gestão de utilizadores
- Suporte alargado a múltiplas missões satélite (Landsat, etc.)
- Aplicação móvel nativa

---

## Requisitos não funcionais

| ID | Descrição | Prioridade | Estado |
|---|---|---|---|
| RNF1 | Interface intuitiva para utilizadores não especialistas | Must Have | Em progresso |
| RNF2 | Código modular e manutenível com tipos explícitos | Must Have | Em progresso |
| RNF3 | Arquitectura documentada com C4, ADRs e comentários PT | Must Have | Em progresso |
| RNF4 | Tratamento robusto de falhas de APIs externas | Must Have | Em progresso |
| RNF5 | Histórico GitHub com Conventional Commits semanais | Must Have | Activo |
| RNF6 | Testes unitários das funcionalidades centrais com Vitest | Must Have | Em progresso |
| RNF7 | Documentação contínua com changelog semanal obrigatório | Must Have | Activo |
| RNF8 | Tempo de resposta aceitável para demonstração (menos de 5s) | Should Have | Pendente |

---

## Rastreabilidade requisitos para implementação e testes

| Requisito | Ficheiro de implementação | Teste |
|---|---|---|
| RF1, RF2 | src/components/map/MapSelector.tsx | Testes manuais com critérios de aceitação |
| RF1b | src/services/geocoding.ts e src/app/api/geocode/route.ts | Testes manuais |
| RF4 | src/lib/validators.ts | src/tests/validators.test.ts |
| RF5, RF6 | src/services/copernicus.ts e src/app/api/search/route.ts | Testes manuais |
| RF7, RF8, RF9, RF10 | src/features/timeline/ImageStrip.tsx | Testes manuais |
| RF11, RF12 | src/features/compare/ComparePanel.tsx | Testes manuais |
| RF13 | src/lib/validators.ts e src/lib/i18n.ts | src/tests/validators.test.ts |
