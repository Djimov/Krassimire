# ADR-002: Mediação de APIs externas por rotas internas Next.js

**Estado:** Aceite
**Data:** 2026-03-18
**Autor:** Krassimire Iankov Djimov — 2301201

## Contexto

A aplicação comunica com dois serviços externos:
- **Copernicus Data Space Ecosystem**: imagens Sentinel-2 via STAC API com autenticação OAuth2
- **Nominatim / OpenStreetMap**: geocodificação por topónimo (REST, sem autenticação)

A questão de arquitectura é: as chamadas a estes serviços devem ser feitas
directamente pelo browser do utilizador, ou mediadas pelo servidor da aplicação?

## Decisão

Toda a comunicação com serviços externos é mediada por rotas internas da
aplicação Next.js. O cliente (browser) nunca chama o Copernicus ou o
Nominatim directamente.

Rotas implementadas:
- `POST /api/search` → src/app/api/search/route.ts → src/services/copernicus.ts
- `GET /api/geocode?q=...` → src/app/api/geocode/route.ts → src/services/geocoding.ts

## Alternativas consideradas

1. **Chamadas directas do browser**: mais simples de implementar inicialmente,
   mas expõe credenciais OAuth2 do Copernicus ao utilizador e cria dependência
   directa do formato da API externa no código cliente.

2. **Proxy Next.js rewrites**: configuração em next.config.js para reencaminhar
   pedidos. Não permite validação, transformação de dados nem tratamento de erros.

3. **Serviço separado (Express/FastAPI)**: mais flexível, mas contradiz ADR-001
   sem acrescentar valor para este âmbito.

## Justificação

**Segurança:**
As credenciais OAuth2 do Copernicus (client_id, client_secret) ficam apenas
no servidor — nunca são expostas ao browser ou ao código JavaScript do cliente.
São lidas de variáveis de ambiente (ver .env.example).

**Consistência:**
Validação (validateSearchParams), normalização de respostas (stacFeatureToResult)
e tratamento de erros (try/catch com mensagens amigáveis) ficam num único ponto.
Se o Copernicus ou o Nominatim mudarem a sua API, só os ficheiros em src/services/
precisam de ser actualizados.

**Testabilidade:**
As rotas internas podem ser testadas com mocks dos serviços externos sem
necessidade de chamadas reais à API durante os testes automatizados.

**Rate limiting:**
O Nominatim exige um User-Agent identificativo e tem limites de pedidos.
A rota /api/geocode pode implementar caching (Cache-Control: max-age=3600)
e controlo de frequência sem alterar o componente cliente.

## Consequências

- Todos os pedidos a serviços externos passam por src/services/
- O browser só comunica com /api/* — nunca com copernicus.eu ou nominatim.org
- Latência ligeiramente superior (pedido extra servidor→API), mas negligenciável
- A rota /api/geocode implementa cache de 1 hora no browser (Cache-Control)

## Referências

- Copernicus STAC API: https://documentation.dataspace.copernicus.eu/APIs/STAC.html
- Nominatim Usage Policy: https://operations.osmfoundation.org/policies/nominatim/
- Next.js Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
