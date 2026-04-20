# Explorador Temporal de Imagens de Satélite

**Projeto de Engenharia Informática 2025/26 · Universidade Aberta**
Krassimire Iankov Djimov · 2301201
Orientador: Pedro Pestana

---

## Estado actual

🟡 **Amarelo** — Planeamento, desenho e núcleo estrutural concluídos. Credenciais Copernicus obtidas. Integração funcional e testes formais em curso.

**Feito (até semana 8):**
- ✅ Proposta v2.1 com MVP, MoSCoW e calendário detalhado
- ✅ Arquitectura C4 nível 1 e 2 em PNG (draw.io)
- ✅ Modelo de dados em PNG (draw.io)
- ✅ 4 ADRs com contexto/decisão/consequências
- ✅ Tipos TypeScript do domínio (`src/types/index.ts`)
- ✅ Validadores com 19 casos de teste escritos em Vitest (execução formal pendente — semana 11)
- ✅ Sistema i18n PT/EN completo
- ✅ Serviço Copernicus STAC + OAuth2 (credenciais locais em `.env.local`)
- ✅ Serviço Nominatim para geocodificação por topónimo
- ✅ Rotas internas `/api/search`, `/api/geocode` e `/api/preview` (stub)
- ✅ Componentes MapSelector, ImageStrip e ComparePanel (com dados mock)
- ✅ Página principal com fluxo guiado em 4 passos
- ✅ Wireframes em PDF (`docs/design/wireframes.pdf`)
- ✅ Relatório intercalar submetido

**Por fazer:**
- 🔲 Integração funcional do mapa com tiles reais (semanas 9-10)
- 🔲 Primeira chamada real à API Copernicus (semanas 9-10)
- 🔲 Timeline com imagens reais (semanas 10-11)
- 🔲 Comparação temporal com imagens reais (semana 11)
- 🔲 Execução formal dos testes unitários + novos testes para serviços (semana 11)
- 🔲 Testes de integração das rotas de API com mocks (semana 10-11)
- 🔲 Testes manuais dos critérios de aceitação T01-T12 (semanas 12-13)
- 🔲 Capítulos 4 (Testes) e 5 (Conclusões) do relatório final (semana 14)

---

## Como instalar e correr

```bash
git clone https://github.com/Djimov/Krassimire.git
cd Krassimire
npm install
cp .env.example .env.local
# Editar .env.local com as credenciais Copernicus (ver .env.example)
npm run dev
# Abrir http://localhost:3000
```

**Testes:**
```bash
npm test              # todos os testes unitários (Vitest)
npm run test:ui       # interface visual do Vitest
npm run test:coverage # relatório de cobertura
```

Nota: à data da entrega intercalar, os testes existem no repositório mas ainda não
foram executados como bateria formal com recolha de resultados. Ver
`docs/tests/test-plan.md` e `docs/tests/test-results.md` para o plano e calendário.

---

## Stack tecnológica

| Camada | Tecnologia | Justificação |
|---|---|---|
| Aplicação web | Next.js 14 + TypeScript | Interface e API no mesmo projecto (ADR-001) |
| Mapa interactivo | Leaflet + react-leaflet | Suficiente para MVP; boa documentação |
| Geocodificação | Nominatim (OpenStreetMap) | Gratuito, mediado por `/api/geocode` (ADR-002) |
| Fonte de dados | Copernicus SentinelHub (STAC + WMS) | Acesso nativo a Sentinel-2 com OAuth2 |
| Testes | Vitest | Mais leve que Jest em TypeScript |
| Controlo de versões | Git + GitHub | Conventional Commits desde a semana 1 |

---

## Estrutura do repositório

```
docs/
  scope/        proposta, requisitos, changelog semanal, riscos
  architecture/ diagramas C4 PNG, modelo de dados PNG, ADRs, descrições
  design/       wireframes (md + pdf), user-flows
  tests/        plano e resultados de testes
  report/       estrutura do relatório intercalar e final
src/
  app/          páginas Next.js e rotas de API internas
  components/   MapSelector (Leaflet + topónimo)
  features/     ImageStrip (timeline), ComparePanel (comparação)
  services/     copernicus.ts (STAC + OAuth2), geocoding.ts (Nominatim)
  lib/          validators.ts, i18n.ts
  types/        tipos TypeScript do domínio (index.ts)
  tests/        validators.test.ts (19 casos escritos)
```

---

## Decisões arquitecturais principais

| Decisão | Alternativa descartada | Razão |
|---|---|---|
| Next.js unificado | React + Express separados | Reduzir complexidade (ADR-001) |
| `/api/*` como proxy | Chamadas directas do cliente | Segurança: credenciais no servidor (ADR-002) |
| Sem base de dados | PostgreSQL / MongoDB | Não necessário no MVP (ADR-003) |
| C4 + ADRs + comentários PT | Apenas README | Defensável em júri externo (ADR-004) |

Todos os ADRs em `docs/architecture/decisions/`.

---

## Utilização de IA generativa

O Claude (Anthropic) foi usado como ferramenta de apoio ao longo do projecto: geração
de código boilerplate, revisão de código, documentação técnica, prototipagem de
interface e apoio à redacção do relatório. Todas as decisões de arquitectura, âmbito,
requisitos e stack foram tomadas pelo estudante. Ver `docs/scope/proposta.md` secção 7.

---

*Última actualização: 20 Abril 2026 · Semana 8*
*Próximo marco: Relatório intercalar (6 Maio)*
