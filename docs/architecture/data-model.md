# Modelo de dados preliminar

Explorador Temporal de Imagens de Satélite
Krassimire Iankov Djimov · 2301201 · Universidade Aberta
Última actualização: 2026-04-18

---

## Nota de persistência (ADR-003)

O sistema não usa base de dados persistente. Todas as entidades vivem em
memória de sessão (React state). Os dados de imagem são sempre derivados
da API Copernicus em tempo real.

---

## Entidades do domínio

### Region — bounding box seleccionada no mapa
| Campo | Tipo | Descrição |
|---|---|---|
| minLat, maxLat | number | Latitudes sul/norte |
| minLng, maxLng | number | Longitudes oeste/leste |
| createdAt | string ISO | Timestamp |

### SearchParams — parâmetros de um pedido ao Copernicus
| Campo | Tipo | Descrição |
|---|---|---|
| region | Region | Área de pesquisa |
| startDate, endDate | string ISO | Intervalo temporal |
| maxCloudCoverage | number | Limite de nuvens (0–100) |
| selectedBandMode | BandMode? | Banda opcional |

### SatelliteImageResult — resultado de pesquisa
| Campo | Tipo | Descrição |
|---|---|---|
| imageId | string | ID no catálogo Copernicus |
| acquisitionDate | string ISO | Data de aquisição |
| cloudCoverage | number | % de nuvens |
| thumbnailUrl, previewUrl | string? | URLs das imagens |
| source | string | Sempre "Copernicus" |
| bandsAvailable | BandMode[] | Composições disponíveis |

### ImageViewState — estado da visualização activa
| Campo | Tipo | Descrição |
|---|---|---|
| imageId | string | Imagem em visualização |
| bandMode | BandMode | Composição activa |
| renderUrl | string? | URL de renderização |
| isLoaded | boolean | Se terminou de carregar |
| errorState | string? | Mensagem de erro |

### ComparisonState — comparação temporal lado a lado
| Campo | Tipo | Descrição |
|---|---|---|
| leftImageId, rightImageId | string | IDs de Antes e Depois |
| leftBandMode, rightBandMode | BandMode | Bandas de cada lado |
| comparisonMode | string? | "side-by-side" |

### GeocodingResult — sugestão do Nominatim
| Campo | Tipo | Descrição |
|---|---|---|
| name | string | Nome do lugar |
| country | string | País |
| lat, lng | number | Coordenadas do centro |
| boundingBox | object? | Bounding box sugerida |

---

## Relações
- Region → SearchParams (1 para muitos na sessão)
- SearchParams → SatelliteImageResult (1 para muitos)
- SatelliteImageResult → ImageViewState (1 para 1 activa)
- ComparisonState → SatelliteImageResult (1 para exactamente 2)

## Tipos TypeScript
Ver src/types/index.ts

*Diagrama visual: docs/architecture/data-model.png*
