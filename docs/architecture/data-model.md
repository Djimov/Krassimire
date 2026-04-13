# Modelo de dados preliminar

## Entidades principais

### Region
Representa a área geográfica seleccionada.

```ts
type Region = {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
};
```

### SearchParams
Representa os critérios de pesquisa.

```ts
type SearchParams = {
  region: Region;
  startDate: string;
  endDate: string;
  maxCloudCoverage: number;
  collection: string;
};
```

### SatelliteImageResult
Representa um item devolvido pela pesquisa.

```ts
type SatelliteImageResult = {
  id: string;
  collection: string;
  acquisitionDate: string;
  cloudCoverage?: number;
  bbox?: number[];
  previewUrl?: string;
  quicklookUrl?: string;
  assets?: Record<string, unknown>;
};
```

### ImageViewState
Representa o estado de visualização de uma imagem.

```ts
type ImageViewState = {
  imageId: string;
  bandMode: "true-color" | "false-color";
  renderUrl?: string;
  isLoaded: boolean;
  error?: string;
};
```

### ComparisonState
Representa a selecção de duas imagens para comparação.

```ts
type ComparisonState = {
  leftImageId?: string;
  rightImageId?: string;
  leftBandMode: "true-color" | "false-color";
  rightBandMode: "true-color" | "false-color";
};
```

## Relações
- uma `Region` pode ser usada em várias pesquisas;
- um `SearchParams` devolve zero ou vários `SatelliteImageResult`;
- cada `SatelliteImageResult` pode originar uma ou mais visualizações;
- `ComparisonState` referencia dois resultados.
