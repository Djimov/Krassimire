/**
 * Tipos TypeScript do domínio
 * Explorador Temporal de Imagens de Satélite
 *
 * Autor: Krassimire Iankov Djimov — 2301201
 * Universidade Aberta — Projeto de Engenharia Informática 2025/26
 *
 * Corresponde ao modelo de dados preliminar da secção 14 da proposta (v2.1).
 */

// =============================================================
// REGIÃO DE INTERESSE
// Bounding box seleccionada pelo utilizador no mapa (RF1, RF2).
// Persistência: memória de sessão.
// =============================================================

export type Region = {
  minLat: number
  minLng: number
  maxLat: number
  maxLng: number
  createdAt: string
}

// =============================================================
// COMPOSIÇÕES DE BANDAS ESPECTRAIS (RF10)
// TCI = cor natural | NDVI = vegetação | SWIR = humidade
// =============================================================

export type BandMode = 'TCI' | 'NDVI' | 'SWIR'

// =============================================================
// PARÂMETROS DE PESQUISA
// Estruturam o pedido enviado ao Copernicus (RF3, RF4, RF6).
// Persistência: memória de sessão.
// =============================================================

export type SearchParams = {
  region: Region
  startDate: string       // formato ISO 8601: YYYY-MM-DD
  endDate: string         // formato ISO 8601: YYYY-MM-DD
  maxCloudCoverage: number // 0–100 (percentagem)
  selectedBandMode?: BandMode
}

// =============================================================
// RESULTADO DE IMAGEM SENTINEL-2
// Representa cada item devolvido pela pesquisa (RF7, RF8, RF9).
// Persistência: derivado da API — não persiste entre sessões.
// =============================================================

export type SatelliteImageResult = {
  imageId: string
  acquisitionDate: string  // ISO 8601
  cloudCoverage: number    // 0–100
  thumbnailUrl?: string
  previewUrl?: string
  source: string           // sempre 'Copernicus' nesta versão
  bandsAvailable: BandMode[]
}

// =============================================================
// ESTADO DE VISUALIZAÇÃO DE IMAGEM (RF9, RF10)
// Controla como uma imagem é apresentada na interface.
// Persistência: estado de UI.
// =============================================================

export type ImageViewState = {
  imageId: string
  bandMode: BandMode
  renderUrl?: string
  isLoaded: boolean
  errorState?: string
}

// =============================================================
// ESTADO DE COMPARAÇÃO TEMPORAL (RF11, RF12)
// Suporta a vista comparativa lado a lado.
// Persistência: estado de UI.
// =============================================================

export type ComparisonState = {
  leftImageId: string
  rightImageId: string
  leftBandMode: BandMode
  rightBandMode: BandMode
  comparisonMode?: 'side-by-side'
}

// =============================================================
// RESULTADO DE GEOCODIFICAÇÃO (RF1 Must Have — topónimo)
// Sugestão devolvida pelo Nominatim via /api/geocode.
// =============================================================

export type GeocodingResult = {
  name: string
  country: string
  lat: number
  lng: number
  boundingBox?: {
    minLat: number
    minLng: number
    maxLat: number
    maxLng: number
  }
}

// =============================================================
// INTERNACIONALIZAÇÃO
// Toggle PT/EN visível no cabeçalho da aplicação.
// =============================================================

export type Locale = 'pt' | 'en'

// =============================================================
// ESTADO GLOBAL DA APLICAÇÃO
// =============================================================

export type AppState = {
  locale: Locale
  lastSearch: SearchParams | null
  results: SatelliteImageResult[]
  activeView: ImageViewState | null
  comparison: ComparisonState | null
}
