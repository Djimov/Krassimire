# Modelo C4 — Nível 1 (Contexto)

Explorador Temporal de Imagens de Satélite
Krassimire Iankov Djimov · 2301201 · Universidade Aberta

---

O diagrama C4 de nível 1 representa a fronteira do sistema e as suas relações
com actores externos. O ficheiro visual c4-context.png será criado com draw.io
antes do intercalar.

## Sistema principal

**Explorador Temporal de Imagens de Satélite** — aplicação web que permite
pesquisar, visualizar e comparar imagens Sentinel-2 de qualquer região.

## Actor externo

**Utilizador Final** — cidadão sem formação técnica em SIG. Acede via browser.
Objectivo: perceber como uma região mudou ao longo do tempo.

## Sistemas externos

| Sistema | Tipo | Papel |
|---|---|---|
| Copernicus Data Space Ecosystem | API externa | Metadados e recursos de imagem Sentinel-2 via STAC API + OAuth2 |
| Nominatim / OpenStreetMap | API externa | Geocodificação — converte nomes de lugares em coordenadas |
| GitHub | Sistema de suporte | Código, documentação, changelog e rastreabilidade |

## Fluxos

1. Utilizador → Sistema: define região, período, filtros; navega pelos resultados
2. Sistema → Copernicus: pesquisa imagens via STAC API (autenticado com OAuth2)
3. Sistema → Nominatim: converte topónimos em coordenadas (User-Agent obrigatório)
4. Sistema → GitHub: commits, ADRs, changelog semanal

## Nota de segurança (ADR-002)

Toda a comunicação com Copernicus e Nominatim é feita pelo servidor Next.js.
O browser nunca chama serviços externos directamente.

*Diagrama visual: docs/architecture/c4-context.png*
