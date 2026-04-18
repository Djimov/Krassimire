# Changelog semanal

Explorador Temporal de Imagens de Satélite
Krassimire Iankov Djimov · 2301201 · Universidade Aberta
Orientador: Pedro Pestana

Formato por entrada: **O que foi feito** / **O que bloqueou** / **O que está planeado**
Actualizado todas as semanas até domingo conforme exigido pelo guia da UC.

---

## Semana 1–2 · 17–28 Mar 2026

**Feito:**
Kick-off síncrono com o orientador. Definição da sinopse do projecto e delimitação do problema central (distância entre dados públicos de satélite e utilizadores não especialistas). Definição do MVP com critérios de aceitação observáveis. Escolha preliminar da stack (Next.js + TypeScript + Leaflet + Copernicus). Criação do repositório GitHub público com estrutura base. Submissão da proposta inicial até 25 de março.

**Bloqueou:**
Dúvida inicial sobre se usar React + Express separados ou Next.js unificado. Resolvida após análise do calendário e do esforço real de um projecto individual.

**Planeado:**
Levantamento de requisitos com MoSCoW. C4 nível 1 e 2. Modelo de dados preliminar. Configuração estrutural do repositório.

---

## Semana 3–4 · 31 Mar–11 Abr 2026

**Feito:**
Levantamento de requisitos funcionais (RF1–RF13) e não funcionais (RNF1–RNF8). Priorização com técnica MoSCoW. Modelo C4 nível 1 (contexto) e nível 2 (contentores) documentados em texto e preparados para diagrama. Modelo de dados preliminar com cinco entidades: Region, SearchParams, SatelliteImageResult, ImageViewState, ComparisonState. Estrutura académica do repositório alinhada com o guia da UC. ADRs iniciais registados (ADR-001 stack, ADR-002 integração API, ADR-003 sem base de dados, ADR-004 documentação). Proposta expandida para versão operacional 2.1 com rastreabilidade de requisitos.

**Bloqueou:**
Semana 4 incluiu Páscoa — ritmo de trabalho reduzido a meio. Compensado com sessão intensiva no fim-de-semana de 11 de abril.

**Planeado:**
Wireframes e protótipo de navegação. Início de implementação do núcleo. Configuração funcional do Next.js.

---

## Semana 5–6 · 14–25 Abr 2026

**Feito:**
Protótipo interactivo completo da interface desenvolvido em 4 passos guiados (escolha de lugar, período temporal, cobertura de nuvens, resultados). Redesign da interface para fluxo casual orientado a utilizadores não especialistas (RNF1). Decisão de promover pesquisa por topónimo de Could Have para Must Have — justificada pelo facto de utilizadores casuais não conhecerem coordenadas geográficas. Integração do toggle PT/EN de internacionalização no cabeçalho. Sistema i18n completo com dicionário PT/EN estruturado para extensão futura. Tipos TypeScript completos do domínio criados (src/types/index.ts). Validadores de parâmetros implementados com mensagens em PT (src/lib/validators.ts). Testes unitários dos validadores escritos com Vitest (src/tests/validators.test.ts). Serviço de geocodificação via Nominatim implementado (src/services/geocoding.ts). Rota interna /api/geocode criada conforme ADR-002 (src/app/api/geocode/route.ts). Componente MapSelector com Leaflet e pesquisa por topónimo (src/components/map/MapSelector.tsx). Componente ImageStrip para timeline cronológica (src/features/timeline/ImageStrip.tsx). Componente ComparePanel para comparação temporal Antes/Depois (src/features/compare/ComparePanel.tsx). Todo o código comentado extensivamente em Português. Repositório actualizado com 9 commits seguindo Conventional Commits.

**Bloqueou:**
Conflito de SHA em dois ficheiros durante commits via API GitHub (vitest.config.ts e validators.test.ts na primeira tentativa). Resolvido obtendo o SHA actual antes de cada escrita.

**Planeado:**
Demo interna com o orientador (semana 7). Consolidação do changelog. Actualização do README. Início de implementação funcional do mapa com tiles reais. Integração com API Copernicus.

---

## Semana 7 · 28 Abr–2 Mai 2026

**Feito:** *(a preencher após a semana decorrer)*

**Bloqueou:** *(a preencher)*

**Planeado:**
Demo interna ao orientador. Validação do âmbito para o intercalar. Implementação do mapa Leaflet com tiles reais. Primeira chamada real à API Copernicus STAC. Actualização do README com estado actual.

---

## Semana 8 · 5–6 Mai 2026 — Intercalar

**Feito:** *(a preencher)*

**Bloqueou:** *(a preencher)*

**Planeado:**
Submissão do relatório intercalar (Capítulos 1 e 2 completos, estado de implementação no Cap. 3).

---

*Entradas das semanas 9–16 serão adicionadas conforme o trabalho avança.*
