# Explorador Temporal de Imagens de Satélite

**Projeto de Engenharia Informática 2025/26 · Universidade Aberta**
Krassimire Iankov Djimov · 2301201
Orientador: Pedro Pestana

---

## Estado actual

🟡 **Amarelo** — Planeamento e prototipagem concluídos. Credenciais Copernicus obtidas. Implementação funcional em curso.

**Feito (até semana 7):**
- ✅ Proposta v2.1 com MVP, MoSCoW e calendário detalhado
- ✅ Arquitectura C4 nível 1 e 2 em PNG (draw.io)
- ✅ Modelo de dados em PNG (draw.io)
- ✅ 4 ADRs com contexto/decisão/consequências
- ✅ Tipos TypeScript do domínio completos
- ✅ Validadores com 19 testes unitários a passar (Vitest)
- ✅ Sistema i18n PT/EN
- ✅ Serviço Copernicus STAC + OAuth2 (credenciais configuradas localmente)
- ✅ Serviço Nominatim para geocodificação por topónimo
- ✅ Rotas internas /api/search e /api/geocode
- ✅ Componentes MapSelector, ImageStrip e ComparePanel
- ✅ Página principal com fluxo guiado em 4 passos
- ✅ Protótipo interactivo da interface completo
- ✅ Changelog semanal actualizado (semanas 1–7)
- ✅ 42/43 ficheiros do guia da UC presentes

**Pendente:**
- 🔲 Implementação funcional do mapa com tiles reais (semana 7–8)
- 🔲 Integração real com API Copernicus (semanas 7–9)
- 🔲 Visualização de imagens Sentinel-2 reais (semana 9–11)
- 🔲 Comparação temporal com imagens reais (semana 11)
- 🔲 wireframes.pdf exportado (antes do intercalar)
- 🔲 Relatório intercalar (Cap. 1 + 2 + início Cap. 3) — entrega 6 Mai

---

## Como instalar e correr

```bash
git clone https://github.com/Djimov/Krassimire.git
cd Krassimire
npm install
cp .env.example .env.local
# Editar .env.local com as credenciais do Copernicus SentinelHub
npm run dev
# Abrir http://localhost:3000
```

**Testes:**
```bash
npm test              # todos os testes unitários
npm run test:ui       # interface visual Vitest
npm run test:coverage # relatório de cobertura
```

---

## Stack tecnológica

| Camada | Tecnologia | Justificação |
|---|---|---|
| Aplicação web | Next.js 14 + TypeScript | Interface e API no mesmo projecto — reduz complexidade (ADR-001) |
| Mapa interactivo | Leaflet + react-leaflet | Suficiente para o MVP; boa documentação |
| Geocodificação | Nominatim (OpenStreetMap) | Gratuito, sem chave API, mediado por rota interna (ADR-002) |
| Fonte de dados | Copernicus SentinelHub STAC API | Acesso nativo a imagens Sentinel-2 com OAuth2 |
| Testes | Vitest | Mais leve que Jest em TypeScript |
| Controlo de versões | Git + GitHub | Commits semanais com Conventional Commits |

---

## Estrutura do repositório

```
docs/
  scope/        proposta, requisitos, changelog (semanas 1-7), riscos
  architecture/ diagramas C4 PNG, modelo de dados PNG, ADRs, descrições texto
  design/       wireframes, fluxos de utilização
  tests/        plano e resultados de testes
  report/       estrutura do relatório intercalar e final
src/
  app/          páginas Next.js e rotas de API internas
  components/   MapSelector (Leaflet + topónimo)
  features/     ImageStrip (timeline), ComparePanel (comparação)
  services/     copernicus.ts (STAC + OAuth2), geocoding.ts (Nominatim)
  lib/          validators.ts, i18n.ts
  types/        tipos TypeScript do domínio
  tests/        validators.test.ts (19 testes)
```

---

## Decisões arquitecturais principais

| Decisão | Alternativa descartada | Razão |
|---|---|---|
| Next.js unificado | React + Express separados | Reduz complexidade para projecto individual (ADR-001) |
| /api/* como proxy | Chamadas directas do cliente | Segurança: credenciais OAuth2 ficam no servidor (ADR-002) |
| Sem base de dados | PostgreSQL | Sem necessidade no MVP; estado em React state (ADR-003) |
| C4 + ADRs + comentários PT | Apenas README | Defensável em júri externo; exigido pelo guia (ADR-004) |

Ver todos os ADRs em `docs/architecture/decisions/`

---

## Utilização de IA generativa

O Claude (Anthropic) foi utilizado como ferramenta de apoio: geração de código boilerplate, revisão de código, documentação técnica e prototipagem de interface. Todas as decisões de arquitectura, requisitos e stack foram tomadas pelo estudante. Ver `docs/scope/proposta.md` secção 7.

---

*Última actualização: 19 Abril 2026 · Semana 7*
*Próximo marco: Demo interna ao orientador (28 Abr–2 Mai) · Intercalar (6 Mai)*
