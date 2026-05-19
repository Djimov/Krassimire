/**
 * Serviço de integração com o Copernicus Data Space Ecosystem
 * Explorador Temporal de Imagens de Satélite
 *
 * Autor: Krassimire Iankov Djimov — 2301201
 * Universidade Aberta — Projeto de Engenharia Informática 2025/26
 *
 * ENDPOINT: SentinelHub Catalog API
 * https://sh.dataspace.copernicus.eu/api/v1/catalog/1.0.0
 * Colecção: sentinel-2-l2a
 *
 * NOTA: Os thumbnailUrl e previewUrl são URLs locais (/api/preview)
 * que funcionam como proxy autenticado para o WMS do SentinelHub.
 * O browser não consegue carregar directamente do SentinelHub porque
 * o endpoint requer autenticação OAuth2 Bearer token.
 */

import type { SatelliteImageResult, Region, BandMode } from '@/types'

// =============================================================
// CONFIGURAÇÃO
// =============================================================

const STAC_URL =
  process.env.COPERNICUS_STAC_URL ??
  'https://sh.dataspace.copernicus.eu/api/v1/catalog/1.0.0'

const OGC_URL =
  process.env.COPERNICUS_OGC_URL ??
  'https://sh.dataspace.copernicus.eu/ogc/wms'

const TOKEN_URL =
  process.env.COPERNICUS_TOKEN_URL ??
  'https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token'

// =============================================================
// MAPEAMENTO DE BANDAS
// =============================================================

const BAND_TO_LAYER: Record<string, string> = {
  TCI: 'TRUE-COLOR-S2L2A',
  NDVI: 'NDVI',
  SWIR: 'SWIR',
}

// =============================================================
// AUTENTICAÇÃO OAUTH2
// =============================================================

async function getAccessToken(): Promise<string> {
  const clientId = process.env.COPERNICUS_CLIENT_ID
  const clientSecret = process.env.COPERNICUS_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error(
      'Credenciais do Copernicus não configuradas. ' +
      'Copia .env.example para .env.local e preenche COPERNICUS_CLIENT_ID e COPERNICUS_CLIENT_SECRET.'
    )
  }

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })

  if (!response.ok) {
    throw new Error(
      `Falha na autenticação com o Copernicus (HTTP ${response.status}). ` +
      'Verifica as credenciais em .env.local.'
    )
  }

  const data = await response.json()
  return data.access_token as string
}

// =============================================================
// CONVERSÃO STAC → DOMÍNIO INTERNO
// =============================================================

function stacFeatureToResult(feature: any): SatelliteImageResult {
  const props = feature.properties || {}
  const bbox = feature.bbox || []
  const datetime = props.datetime || props.created || ''
  const bboxStr = bbox.join(',')
  const timeStr = datetime.split('T')[0]

  // URLs locais via /api/preview (proxy autenticado — ADR-002)
  const thumbnailUrl = bbox.length === 4
    ? `/api/preview?bbox=${bboxStr}&datetime=${timeStr}&layer=TRUE-COLOR-S2L2A&width=256&height=256`
    : ''
  const previewUrl = bbox.length === 4
    ? `/api/preview?bbox=${bboxStr}&datetime=${timeStr}&layer=TRUE-COLOR-S2L2A&width=512&height=512`
    : ''

  return {
    imageId: feature.id || 'unknown',
    acquisitionDate: datetime,
    cloudCoverage: props['eo:cloud_cover'] ?? 0,
    thumbnailUrl,
    previewUrl,
    source: 'Copernicus Sentinel-2 L2A',
    bandsAvailable: ['TCI', 'NDVI', 'SWIR'],
  }
}

// =============================================================
// FUNÇÃO PRINCIPAL DE PESQUISA
// =============================================================

export async function searchSentinelImages(
  region: Region,
  startDate: string,
  endDate: string,
  maxCloudCoverage = 30
): Promise<SatelliteImageResult[]> {
  const token = await getAccessToken()
  const bbox = [region.minLng, region.minLat, region.maxLng, region.maxLat]

  const requestBody: any = {
    collections: ['sentinel-2-l2a'],
    bbox,
    datetime: `${startDate}T00:00:00Z/${endDate}T23:59:59Z`,
    limit: 50,
  }

  if (maxCloudCoverage < 100) {
    requestBody.filter = {
      op: 'lt',
      args: [{ property: 'eo:cloud_cover' }, maxCloudCoverage]
    }
    requestBody['filter-lang'] = 'cql2-json'
  }

  const response = await fetch(`${STAC_URL}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'sem detalhes')
    throw new Error(
      `Copernicus respondeu com HTTP ${response.status}. Detalhes: ${errorText.slice(0, 200)}`
    )
  }

  const data = await response.json()
  const features = data.features || []

  return features
    .map(stacFeatureToResult)
    .sort((a: SatelliteImageResult, b: SatelliteImageResult) =>
      new Date(a.acquisitionDate).getTime() - new Date(b.acquisitionDate).getTime()
    )
}

// =============================================================
// CONSTRUÇÃO DE URLs DE IMAGEM PÚBLICA
// =============================================================

export function buildImageUrl(
  imageId: string,
  bandMode: BandMode | string = 'TCI',
  bbox: number[] = [-9.25, 38.65, -9.05, 38.80],
  datetime: string = '2024-01-01',
  width = 512,
  height = 512
): string {
  const layer = BAND_TO_LAYER[bandMode] || 'TRUE-COLOR-S2L2A'
  const bboxStr = bbox.join(',')
  const timeStr = datetime.split('T')[0]
  return `/api/preview?bbox=${bboxStr}&datetime=${timeStr}&layer=${layer}&width=${width}&height=${height}`
}
