# ADR-002 — Integração com Copernicus via serviços internos e rotas de API

## Estado
Aceite

## Contexto
A aplicação depende do Copernicus Data Space Ecosystem para autenticação, descoberta de produtos Sentinel-2 e obtenção de recursos de visualização. Expor toda essa complexidade directamente ao frontend aumentaria o acoplamento e dificultaria o tratamento uniforme de erros.

## Decisão
Encapsular a integração com o Copernicus em **serviços internos** e **rotas de API** da aplicação Next.js.

## Consequências positivas
- isolamento da lógica de integração;
- maior clareza do frontend;
- tratamento centralizado de erros;
- maior facilidade de adaptação futura a mudanças dos endpoints.

## Consequências negativas
- necessidade de desenhar uma camada intermédia adicional;
- possibilidade de alguma duplicação de transformação de dados caso não haja cuidado de implementação.

## Alternativas consideradas
- consumo directo da STAC API no frontend;
- uso exclusivo de um único endpoint, sem separação entre descoberta e visualização.
