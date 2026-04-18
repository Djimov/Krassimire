# Modelo C4 — Nível 2 (Contentores)

Explorador Temporal de Imagens de Satélite
Krassimire Iankov Djimov · 2301201 · Universidade Aberta

---

## Contentores

| ID | Contentor | Tecnologia | Responsabilidade |
|---|---|---|---|
| C1 | Aplicação Web | Next.js 14 + TypeScript | Interface React, páginas e rotas internas de API |
| C2 | Componente de Mapa | Leaflet + react-leaflet | Mapa interactivo e selecção de região |
| C3 | Serviço Copernicus | STAC API + OAuth2 | Imagens e metadados Sentinel-2 |
| C4 | Serviço Nominatim | REST API | Geocodificação por topónimo |
| C5 | Repositório GitHub | Git | Código, documentação e rastreabilidade |

## Relações

| De | Para | Protocolo | Descrição |
|---|---|---|---|
| Utilizador | C1 | HTTPS/Browser | Interface da aplicação |
| C1 | C2 | Import JS (ssr:false) | Componente Leaflet carregado dinamicamente |
| C1 /api/search | C3 | HTTPS/STAC | Pesquisa de imagens com OAuth2 |
| C1 /api/geocode | C4 | HTTPS/REST | Geocodificação com User-Agent |
| Desenvolvimento | C5 | Git push | Commits semanais |

## ADRs relevantes

- ADR-001: Next.js unificado (C1) em vez de React + Express separados
- ADR-002: Rotas internas /api/* como proxy para C3 e C4
- ADR-003: Sem base de dados — estado em React state

*Diagrama visual: docs/architecture/c4-containers.png*
