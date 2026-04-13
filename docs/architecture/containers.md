# C4 nível 2 — Contentores

## Contentor 1 — Web App (Next.js)

Responsabilidades:
- interface principal da aplicação;
- formulários de pesquisa;
- timeline de resultados;
- vista individual e comparativa;
- rotas internas de API.

Tecnologias:
- Next.js
- TypeScript
- React

## Contentor 2 — Módulo cartográfico (Leaflet)

Responsabilidades:
- apresentação do mapa;
- selecção da bounding box;
- apoio visual à região de interesse.

Tecnologias:
- Leaflet

## Contentor 3 — Serviço de integração Copernicus

Responsabilidades:
- encapsular a lógica de acesso às APIs externas;
- construir pedidos para STAC Search;
- gerir autenticação OAuth2 quando necessária;
- preparar pedidos ao Process API para renderização.

Tecnologias:
- fetch / rotas de API do Next.js
- TypeScript

## Contentor 4 — Copernicus Data Space Ecosystem (externo)

Responsabilidades:
- catálogo STAC;
- catálogo OData;
- autenticação OAuth2;
- processamento e renderização de imagens.

## Relações

- Web App usa Leaflet para interacção cartográfica.
- Web App usa o Serviço de integração Copernicus através de rotas internas.
- Serviço de integração comunica com STAC/OData/Process API.
