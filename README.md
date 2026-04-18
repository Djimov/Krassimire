# Explorador Temporal de Imagens de Satélite

**Projeto de Engenharia Informática 2025/26 · Universidade Aberta**
Krassimire Iankov Djimov · 2301201
Orientador: Pedro Pestana

---

## Estado actual

🟡 **Amarelo** — Fase de planeamento e prototipagem concluída. Implementação do núcleo em curso.

**O que está feito:**
- ✅ Proposta v2.1 com MVP, requisitos MoSCoW e calendário detalhado
- ✅ Arquitectura C4 nível 1 e 2 documentada
- ✅ Modelo de dados preliminar com 5 entidades TypeScript
- ✅ ADRs das 4 decisões arquitecturais principais
- ✅ Tipos TypeScript do domínio (src/types/index.ts)
- ✅ Validadores de parâmetros com 19 testes unitários a passar (Vitest)
- ✅ Sistema i18n PT/EN completo
- ✅ Serviço de geocodificação Nominatim (src/services/geocoding.ts)
- ✅ Serviço de integração Copernicus STAC + OAuth2 (src/services/copernicus.ts)
- ✅ Rotas internas /api/search e /api/geocode
- ✅ Componente MapSelector com Leaflet e pesquisa por topónimo
- ✅ Componente ImageStrip para timeline cronológica
- ✅ Componente ComparePanel para comparação temporal Antes/Depois
- ✅ Protótipo interactivo completo da interface (4 passos guiados)

**O que está pendente:**
- 🔲 Implementação funcional do mapa com tiles reais
- 🔲 Integração real com a API Copernicus (autenticação OAuth2)
- 🔲 Pesquisa temporal funcional com resultados reais
- 🔲 Visualização de imagens reais (TCI, NDVI, SWIR)
- 🔲 Comparação temporal com imagens reais
- 🔲 Testes de integração e testes manuais do MVP
- 🔲 Diagramas C4 em PNG (draw.io) e wireframes em PDF
- 🔲 Relatório intercalar e final

---

## Como instalar e correr

**Pré-requisitos:** Node.js 20+, npm 10+, conta no Copernicus Data Space Ecosystem

```bash
git clone https://github.com/Djimov/Krassimire.git
cd Krassimire
npm install
cp .env.example .env.local
# Editar .env.local com as credenciais do Copernicus
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
| Fonte de dados | Copernicus STAC API | Acesso nativo a imagens Sentinel-2 |
| Testes | Vitest | Mais leve que Jest em ambiente TypeScript |
| Controlo de versões | Git + GitHub | Commits semanais com Conventional Commits |

---

## Estrutura do repositório

```
docs/
  scope/        proposta, requisitos, changelog, riscos
  architecture/ C4, modelo de dados, ADRs
  design/       wireframes, fluxos de utilização
  tests/        plano e resultados de testes
  report/       relatório intercalar e final
src/
  app/          páginas e rotas Next.js
  components/   componentes reutilizáveis (MapSelector)
  features/     funcionalidades por domínio (timeline, compare)
  services/     integração com APIs externas (Copernicus, Nominatim)
  lib/          validadores, i18n, utilitários
  types/        tipos TypeScript do domínio
  tests/        testes unitários e de integração
```

---

## Decisões arquitecturais principais

| Decisão | Alternativa | Razão |
|---|---|---|
| Next.js unificado | React + Express separados | Reduz complexidade para projecto individual (ADR-001) |
| Leaflet | MapLibre GL JS | Suficiente para o MVP; mais simples |
| STAC API Copernicus | OData | Mais natural para descoberta temporal e espacial |
| Sem base de dados | PostgreSQL | Sem necessidade no MVP; estado em React state (ADR-003) |
| Nominatim mediado | Chamada directa do cliente | Segurança: credenciais no servidor (ADR-002) |

Ver todos os ADRs em docs/architecture/decisions/

---

## Utilização de IA generativa

O Claude (Anthropic) foi utilizado como ferramenta de apoio ao desenvolvimento:
geração de código boilerplate, revisão de código, documentação técnica e prototipagem
de interface. Todas as decisões de arquitectura, requisitos e stack foram tomadas
pelo estudante. Ver docs/scope/proposta.md secção 7 para detalhes.

---

*Última actualização: 18 Abril 2026 · Semana 6*
*Próximo marco: Demo interna ao orientador (semana 7, 28 Abr–2 Mai)*
