/**
 * Serviço de integração com o Copernicus Data Space Ecosystem
 * Explorador Temporal de Imagens de Satélite
 * Autor: Krassimire Iankov Djimov — 2301201
 */

import type { SatelliteImageResult, Region, BandMode } from '@/types'

const STAC_URL =
  process.env.COPERNICUS_STAC_URL ??
  'https://sh.dataspace.copernicus.eu/api/v1/catalog/1.0.0'

const TOKEN_URL =
  process.env.COPERNICUS_TOKEN_URL ??
  'https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token'

const BAND_TO_LAYER: Record<string, string> = {
  TCI: 'TRUE-COLOR-S2L2A',
  NDVI: 'NDVI',
  SWIR: 'SWIR',
}

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
      'Falha na autenticação com o Copernicus (HTTP ' + response.status + '). ' +
      'Verifica as credenciais em .env.local.'
    )
  }

  const data = await response.json()
  return data.access_token as string
}

function stacFeatureToResult(feature: any): SatelliteImageResult {
  const props = feature.properties || {}
  const bbox = feature.bbox || []
  const datetime = props.datetime || props.created || ''
  const bboxStr = bbox.join(',')
  const timeStr = datetime.split('T')[0]

  const thumbnailUrl = bbox.length === 4
    ? '/api/preview?bbox=' + bboxStr + '&datetime=' + timeStr + '&layer=TRUE-COLOR-S2L2A&width=256&height=256'
    : ''
  const previewUrl = bbox.length === 4
    ? '/api/preview?bbox=' + bboxStr + '&datetime=' + timeStr + '&layer=TRUE-COLOR-S2L2A&width=512&height=512'
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

export async function searchSentinelImages(
  region: Region,
  startDate: string,
  endDate: string,
  maxCloudCoverage = 30
): Promise<SatelliteImageResult[]> {
  const token = await getAccessToken()
  const bbox = [region.minLng, region.minLat, region.maxLng, region.maxLat]

  // Dividir o período em chunks de 6 meses para cobrir todo o intervalo.
  // A API SentinelHub devolve os mais recentes primeiro com limit,
  // portanto sem dividir só veríamos os últimos meses.
  const start = new Date(startDate)
  const end = new Date(endDate)
  const chunks: { from: string; to: string }[] = []
  const cursor = new Date(start)
  while (cursor < end) {
    const chunkEnd = new Date(cursor)
    chunkEnd.setMonth(chunkEnd.getMonth() + 6)
    if (chunkEnd > end) chunkEnd.setTime(end.getTime())
    chunks.push({
      from: cursor.toISOString().split('T')[0],
      to: chunkEnd.toISOString().split('T')[0],
    })
    cursor.setMonth(cursor.getMonth() + 6)
  }

  // Fazer um pedido por chunk com timeout independente de 8s
  const allFeatures: any[] = []
  for (const chunk of chunks) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 8000)
      const dtRange = chunk.from + 'T00:00:00Z/' + chunk.to + 'T23:59:59Z'
      const response = await fetch(STAC_URL + '/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          collections: ['sentinel-2-l2a'],
          bbox,
          datetime: dtRange,
          limit: 10,
        }),
        signal: controller.signal,
      })
      clearTimeout(timeout)
      if (response.ok) {
        const data = await response.json()
        allFeatures.push(...(data.features || []))
      }
    } catch {
      // Chunk timeout ou erro — continuar com os próximos
    }
  }

  return allFeatures
    .map(stacFeatureToResult)
    .filter((r: SatelliteImageResult) => r.cloudCoverage <= maxCloudCoverage)
    .sort((a: SatelliteImageResult, b: SatelliteImageResult) =>
      new Date(a.acquisitionDate).getTime() - new Date(b.acquisitionDate).getTime()
    )
    .slice(0, 50)
}

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
  return '/api/preview?bbox=' + bboxStr + '&datetime=' + timeStr + '&layer=' + layer + '&width=' + width + '&height=' + height
}
