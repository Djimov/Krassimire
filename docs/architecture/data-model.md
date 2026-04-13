# Modelo de dados preliminar

## 1. Objectivo

Embora o projecto não dependa, numa fase inicial, de uma base de dados relacional persistente, é essencial definir um modelo de dados preliminar para estruturar o domínio. Este modelo serve para orientar a implementação em TypeScript, clarificar o significado dos dados manipulados pela aplicação e apoiar o desenho de testes e documentação.

---

## 2. Entidades principais do domínio

## 2.1 Região de Interesse

Representa a área geográfica seleccionada pelo utilizador no mapa e usada como base espacial para a pesquisa.

### Atributos principais

- `minLat`
- `minLng`
- `maxLat`
- `maxLng`
- `createdAt` (opcional, se se optar por guardar estado de sessão)

### Observações

A região de interesse é conceptualmente simples, mas central. Ela funciona como a âncora espacial de toda a pesquisa.

---

## 2.2 Parâmetros de Pesquisa

Representam o conjunto de inputs definidos pelo utilizador para procurar produtos satélite.

### Atributos principais

- `region`
- `startDate`
- `endDate`
- `maxCloudCoverage`
- `selectedBandMode` (opcional)

### Observações

Os parâmetros de pesquisa constituem uma entidade lógica importante porque:

- podem ser validados de forma independente;
- são enviados às rotas de API internas;
- podem ser usados em testes e rastreabilidade de cenários.

---

## 2.3 Resultado de Imagem Satélite

Representa cada item devolvido pela pesquisa de produtos Sentinel-2.

### Atributos principais

- `imageId`
- `acquisitionDate`
- `cloudCoverage`
- `thumbnailUrl` (opcional)
- `previewUrl` (opcional)
- `source`
- `bandsAvailable`
- `metadataRaw` (opcional)

### Observações

Esta entidade será apresentada na timeline e servirá de base quer para a visualização individual, quer para a comparação temporal.

---

## 2.4 Estado de Visualização da Imagem

Representa a forma concreta como uma imagem está a ser apresentada na interface num dado momento.

### Atributos principais

- `imageId`
- `bandMode`
- `renderUrl`
- `isLoaded`
- `errorState` (opcional)

### Observações

Esta entidade não representa um produto satélite em si, mas sim o estado de apresentação desse produto no interface do utilizador.

---

## 2.5 Estado de Comparação Temporal

Representa a selecção de duas imagens para a vista comparativa.

### Atributos principais

- `leftImageId`
- `rightImageId`
- `leftBandMode`
- `rightBandMode`
- `comparisonMode`

### Observações

A comparação temporal é uma das funcionalidades distintivas do sistema. Esta entidade ajuda a separar claramente o estado de comparação do estado de pesquisa e do estado de visualização individual.

---

## 3. Relações principais entre entidades

- Uma **Região de Interesse** pode ser usada em vários **Parâmetros de Pesquisa**.
- Um conjunto de **Parâmetros de Pesquisa** pode originar vários **Resultados de Imagem Satélite**.
- Um **Resultado de Imagem Satélite** pode ser apresentado em um ou mais **Estados de Visualização**.
- O **Estado de Comparação Temporal** referencia exactamente dois **Resultados de Imagem Satélite**.

---

## 4. Representação simplificada do domínio

```ts
export type Region = {
  minLat: number
  minLng: number
  maxLat: number
  maxLng: number
}

export type SearchParams = {
  region: Region
  startDate: string
  endDate: string
  maxCloudCoverage: number
  selectedBandMode?: string
}

export type SatelliteImageResult = {
  imageId: string
  acquisitionDate: string
  cloudCoverage: number
  thumbnailUrl?: string
  previewUrl?: string
  source: string
  bandsAvailable: string[]
  metadataRaw?: unknown
}

export type ImageViewState = {
  imageId: string
  bandMode: string
  renderUrl?: string
  isLoaded: boolean
  errorState?: string
}

export type ComparisonState = {
  leftImageId: string
  rightImageId: string
  leftBandMode: string
  rightBandMode: string
  comparisonMode?: string
}
```

---

## 5. Justificação do modelo de dados

A definição deste modelo preliminar é útil mesmo sem base de dados persistente, porque:

- clarifica o domínio do problema;
- reduz ambiguidade na implementação;
- facilita a tipagem em TypeScript;
- organiza melhor os testes;
- prepara o sistema para futuras extensões.

Além disso, o modelo ajuda a demonstrar maturidade de planeamento, ligando directamente requisitos, arquitectura e implementação.
