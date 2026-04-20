# Changelog semanal

Explorador Temporal de Imagens de Satélite
Krassimire Iankov Djimov · 2301201 · Universidade Aberta
Orientador: Pedro Pestana

Formato por entrada: **Feito** / **Bloqueou** / **Planeado**
Actualizado todas as semanas até domingo conforme exigido pelo guia da UC.

---

## Semana 1–2 · 17–28 Mar 2026

**Feito:**
Kick-off síncrono com o orientador. Definição da sinopse e delimitação do problema central (distância entre dados públicos de satélite e utilizadores não especialistas). Definição do MVP com critérios de aceitação observáveis. Escolha da stack (Next.js + TypeScript + Leaflet + Copernicus). Criação do repositório GitHub público com estrutura base. Submissão da proposta inicial até 25 de março.

**Bloqueou:**
Dúvida inicial sobre usar React + Express separados ou Next.js unificado. Resolvida após análise do calendário e do esforço real de um projecto individual — Next.js reduz complexidade sem sacrificar separação de responsabilidades (ADR-001).

**Planeado:**
Levantamento de requisitos com MoSCoW. C4 nível 1 e 2. Modelo de dados. Configuração estrutural do repositório.

---

## Semana 3–4 · 31 Mar–11 Abr 2026

**Feito:**
Levantamento de requisitos funcionais (RF1–RF13) e não funcionais (RNF1–RNF8) com técnica MoSCoW. Modelo C4 nível 1 e 2 documentados em texto. Modelo de dados preliminar com 5 entidades: Region, SearchParams, SatelliteImageResult, ImageViewState, ComparisonState. Estrutura académica do repositório alinhada com o guia. ADRs 001 a 004 escritos com contexto/decisão/consequências. Proposta expandida para versão 2.1 com rastreabilidade de requisitos e promoção de RF1b (topónimo) para Must Have.

**Bloqueou:**
Semana 4 incluiu Páscoa — ritmo reduzido a meio. Compensado com sessão intensiva no fim-de-semana de 11 de abril.

**Planeado:**
Wireframes e protótipo de navegação. Início de implementação do núcleo. Configuração funcional do Next.js.

---

## Semana 5–6 · 14–25 Abr 2026

**Feito:**
Protótipo interactivo completo da interface em 4 passos guiados (lugar, período, nuvens, resultados). Redesign para fluxo casual orientado a utilizadores não especialistas (RNF1). Sistema i18n PT/EN completo. Tipos TypeScript do domínio (src/types/index.ts). Validadores de parâmetros com mensagens PT e 19 casos de teste escritos em Vitest. Serviços de geocodificação Nominatim e integração Copernicus STAC + OAuth2. Rotas internas /api/search e /api/geocode. Componentes MapSelector, ImageStrip e ComparePanel com comentários PT extensivos. Diagramas C4 nível 1, nível 2 e modelo de dados criados em draw.io e publicados como PNG no repositório.

**Bloqueou:**
Conflitos de SHA em alguns commits via API GitHub (ficheiros actualizados em paralelo). Resolvido com obtenção do SHA actual antes de cada escrita.

**Planeado:**
Demo interna com o orientador (semana 7). Consolidação do changelog. README actualizado. Início da implementação funcional com tiles Leaflet reais e primeira chamada real à API Copernicus.

---

## Semana 7 · 28 Abr–2 Mai 2026

**Feito:**
Credenciais OAuth2 do Copernicus SentinelHub obtidas e configuradas em .env.local. Variáveis de ambiente documentadas no .env.example com instruções de configuração. Geocoding.ts enriquecido com comentários extensivos PT e política de uso do Nominatim. Auditoria do repositório. Preparação da demo interna ao orientador: fluxo MVP documentado em docs/design/user-flows.md, critérios de aceitação T01–T12 definidos no test-plan.md. README actualizado com estado actual da implementação. Wireframes exportados para PDF (docs/design/wireframes.pdf).

**Bloqueou:**
Dúvida sobre quando iniciar os testes formais. Decisão: testes executados formalmente na semana 11, após a integração funcional com a API estar completa, para evitar retrabalho caso a interface dos serviços mude.

**Planeado:**
Submissão do relatório intercalar. Implementação funcional do mapa com tiles reais. Primeira chamada real à API Copernicus.

---

## Semana 8 · 5–6 Mai 2026 — Intercalar

**Feito:**
Limpeza do repositório — remoção de duplicados (c4-*.drawio.png) e de ficheiros órfãos/stubs (src/types/domain.ts, src/tests/copernicus.spec.ts). Actualização honesta do plano e resultados de testes para reflectir que a execução formal dos testes ainda não ocorreu. Finalização do relatório intercalar seguindo o modelo oficial da UAb: Capítulos 1 (Introdução) e 2 (Desenho) completos; Capítulo 3 (Implementação) com estado de cada tarefa; bibliografia APA.

**Bloqueou:**
Reconhecimento de que o plano de testes no repositório anterior sobre-vendia o estado real ("19 testes a passar" quando eles estão escritos mas nunca foram executados como bateria). Corrigido com actualização do test-plan.md e test-results.md com o estado real.

**Planeado:**
Submissão do relatório intercalar a 6 de Maio. Arranque das semanas 9-10: integração funcional com tiles reais e primeira chamada real à API Copernicus.

---

## Semana 9 · 7–9 Mai 2026 (planeada)

**Planeado:**
Integração do Leaflet com tiles reais. Primeira chamada real à API Copernicus usando as credenciais OAuth2. Escrita dos testes unitários adicionais (i18n, copernicus, geocoding) em preparação para a execução formal na semana 11.

---

*Entradas das semanas 10–16 serão adicionadas conforme o trabalho avança.*
