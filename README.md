# Explorador Temporal de Imagens de Satélite

**Projeto de Engenharia Informática 2025/26 · Universidade Aberta**
Krassimire Iankov Djimov · 2301201
Orientador: Pedro Pestana

---

## Estado actual

🟢 **Verde** — Integração funcional com o Copernicus concluída. A aplicação mostra imagens de satélite reais.

**Feito (até semana 9):**
- ✅ Proposta v2.1 com MVP, MoSCoW e calendário detalhado
- ✅ Arquitectura C4 nível 1 e 2 em PNG (draw.io)
- ✅ Modelo de dados em PNG (draw.io)
- ✅ 4 ADRs com contexto/decisão/consequências
- ✅ Tipos TypeScript do domínio (src/types/index.ts)
- ✅ Validadores (src/lib/validators.ts) com 19 casos de teste escritos
- ✅ Sistema i18n PT/EN completo (src/lib/i18n.ts)
- ✅ Integração funcional com Copernicus SentinelHub (Process API + Catalog API)
- ✅ Proxy autenticado /api/preview com evalscripts para TCI, NDVI e SWIR
- ✅ Pesquisa por topónimo funcional via Nominatim (/api/geocode)
- ✅ Componentes MapSelector, ImageStrip e ComparePanel com dados reais
- ✅ Página principal com fluxo guiado em 4 passos e date pickers
- ✅ Comparação temporal Antes/Depois com selecção inteligente de imagens
- ✅ Legenda de cores para NDVI (vegetação) e SWIR (humidade)
- ✅ Botão "Nova pesquisa" e edição de passos anteriores sem refresh

**Por fazer:**
- 🔲 Melhorar o MapSelector (drag/zoom mais intuitivo)
- 🔲 Execução formal dos testes unitários (semana 11)
- 🔲 Testes de integração com mocks (semana 11)
- 🔲 Testes manuais dos critérios de aceitação T01-T12 (semana 12)
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

**Nota sobre credenciais:** As credenciais OAuth2 do SentinelHub devem ser obtidas
em https://shapps.dataspace.copernicus.eu/dashboard/#/account/settings e colocadas
no ficheiro .env.local (nunca commitado ao repositório).

**Testes:**
```bash
npm test              # testes unitários (Vitest)
npm run test:coverage # relatório de cobertura
```

---

## Stack tecnológica

| Camada | Tecnologia | Justificação |
|---|---|---|
| Aplicação web | Next.js 14 + TypeScript | Interface e API no mesmo projecto (ADR-001) |
| Mapa interactivo | Leaflet + react-leaflet | Suficiente para MVP |
| Geocodificação | Nominatim (OpenStreetMap) | Gratuito, mediado por /api/geocode (ADR-002) |
| Fonte de dados | Copernicus SentinelHub (Catalog API + Process API) | Imagens Sentinel-2 com OAuth2 |
| Testes | Vitest | Mais leve que Jest em TypeScript |
| Controlo de versões | Git + GitHub | Conventional Commits |

## Arquitectura de integração com o Copernicus

A comunicação com o Copernicus usa três serviços distintos:

1. **Catalog API** (sh.dataspace.copernicus.eu/api/v1/catalog/1.0.0) — descoberta de
   imagens Sentinel-2 L2A via protocolo STAC. Usado pela rota /api/search.
2. **Process API** (sh.dataspace.copernicus.eu/api/v1/process) — renderização de imagens
   com evalscripts customizados para cada composição de bandas (TCI, NDVI, SWIR).
   Usado pela rota /api/preview como proxy autenticado.
3. **Identity API** (identity.dataspace.copernicus.eu) — autenticação OAuth2 com
   client credentials. O token é obtido pelo servidor a cada pedido.

O browser nunca contacta directamente estes serviços — toda a comunicação é mediada
pelas rotas internas /api/* (ADR-002).

---

## Utilização de IA generativa

O Claude (Anthropic) foi usado como ferramenta de apoio ao longo do projecto: geração
de código, revisão, documentação, prototipagem e apoio na integração com o Copernicus.
Todas as decisões de arquitectura, âmbito e requisitos foram tomadas pelo estudante.
Ver docs/scope/proposta.md secção 7.

---

*Última actualização: 19 Maio 2026 · Semana 9*
