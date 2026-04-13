# ADR-002 — Estratégia de integração com o Copernicus

## Contexto
O projecto necessita de procurar imagens Sentinel-2 e gerar visualizações úteis para o MVP.

## Decisão
Usar:
1. **STAC API** para descoberta e filtragem temporal/espacial;
2. **Process API** para gerar previews e renderizações;
3. **OData** apenas como apoio complementar quando necessário.

## Razão
- STAC ajusta-se naturalmente à pesquisa espacial e temporal;
- Process API suporta geração de imagens em composições específicas;
- evita acoplamento excessivo a uma única interface.

## Consequências
- necessidade de lidar com OAuth2 para o Process API;
- separação clara entre descoberta de itens e renderização.
