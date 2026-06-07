export const maxDuration = 60

/**
 * Rota interna de proxy de imagens: GET /api/preview
 * Explorador Temporal de Imagens de Satélite
 *
 * Autor: Krassimire Iankov Djimov — 2301201
 * Universidade Aberta — Projeto de Engenharia Informática 2025/26
 *
 * PROPÓSITO:
 * Serve como proxy autenticado para imagens Sentinel-2 do SentinelHub.
 * Usa o Process API (não o WMS) porque não requer instance ID.
 *
 * RASTREABILIDADE:
 * - RF9: visualizar imagem seleccionada
 * - RF10: composições de bandas (evalscript)
 * - ADR-002: comunicação com o Copernicus mediada por rotas internas
 */

import { NextRequest, NextResponse } from 'next/server'

const PROCESS_URL = 'https://sh.dataspace.copernicus.eu/api/v1/process'

const TOKEN_URL =
  process.env.COPERNICUS_TOKEN_URL ??
  'https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token'

// Evalscripts para cada composição de bandas
const EVALSCRIPTS: Record<string, string> = {
  'TRUE-COLOR-S2L2A': `//VERSION=3
function setup() {
  return { input: ["B04", "B03", "B02"], output: { bands: 3 } };
}
function evaluatePixel(s) {
  return [2.5 * s.B04, 2.5 * s.B03, 2.5 * s.B02];
}`,
  'NDVI': `//VERSION=3
function setup() {
  return { input: ["B04", "B08"], output: { bands: 3 } };
}
function evaluatePixel(s) {
  let ndvi = (s.B08 - s.B04) / (s.B08 + s.B04);
  if (ndvi < 0) return [0.8, 0.2, 0.2];
  if (ndvi < 0.2) return [0.9, 0.8, 0.4];
  if (ndvi < 0.4) return [0.7, 0.9, 0.3];
  if (ndvi < 0.6) return [0.3, 0.8, 0.2];
  return [0.1, 0.5, 0.1];
}`,
  'SWIR': `//VERSION=3
function setup() {
  return { input: ["B12", "B8A", "B04"], output: { bands: 3 } };
}
function evaluatePixel(s) {
  return [2.5 * s.B12, 2.5 * s.B8A, 2.5 * s.B04];
}`,
}

async function getToken(): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.COPERNICUS_CLIENT_ID!,
      client_secret: process.env.COPERNICUS_CLIENT_SECRET!,
    }),
  })
  const data = await res.json()
  return data.access_token
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const bboxStr = searchParams.get('bbox') || '-9.25,38.65,-9.05,38.80'
  const datetime = searchParams.get('datetime') || '2024-01-01'
  const layer = searchParams.get('layer') || 'TRUE-COLOR-S2L2A'
  const width = parseInt(searchParams.get('width') || '256')
  const height = parseInt(searchParams.get('height') || '256')

  const bbox = bboxStr.split(',').map(Number)
  if (bbox.length !== 4 || bbox.some(isNaN)) {
    return NextResponse.json({ error: 'BBOX inválido' }, { status: 400 })
  }

  const timeStr = datetime.split('T')[0]
  const evalscript = EVALSCRIPTS[layer] || EVALSCRIPTS['TRUE-COLOR-S2L2A']

  try {
    const token = await getToken()

    const body = {
      input: {
        bounds: {
          bbox: bbox,
          properties: { crs: 'http://www.opengis.net/def/crs/EPSG/0/4326' },
        },
        data: [{
          type: 'sentinel-2-l2a',
          dataFilter: {
            timeRange: {
              from: `${timeStr}T00:00:00Z`,
              to: `${timeStr}T23:59:59Z`,
            },
          },
        }],
      },
      output: { width, height },
      evalscript,
    }

    const imageRes = await fetch(PROCESS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'image/png',
      },
      body: JSON.stringify(body),
    })

    if (!imageRes.ok) {
      const errText = await imageRes.text().catch(() => '')
      console.error('[/api/preview] Process API error:', imageRes.status, errText.slice(0, 200))
      return NextResponse.json(
        { error: `Process API respondeu com ${imageRes.status}` },
        { status: imageRes.status }
      )
    }

    const imageBuffer = await imageRes.arrayBuffer()

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (error) {
    console.error('[/api/preview] Erro:', error)
    return NextResponse.json({ error: 'Erro ao obter imagem' }, { status: 503 })
  }
}
