export const maxDuration = 60

/**
 * Rota interna de pesquisa de imagens: POST /api/search
 * Explorador Temporal de Imagens de Satélite
 *
 * Autor: Krassimire Iankov Djimov — 2301201
 * Universidade Aberta — Projeto de Engenharia Informática 2025/26
 *
 * RASTREABILIDADE:
 * - RF5: consultar fonte externa de imagens Sentinel-2
 * - RF4: validar parâmetros antes de chamar a API externa
 * - RF13: devolver mensagens de erro claras em caso de falha
 * - ADR-002: toda a comunicação com o Copernicus é mediada aqui
 */

import { NextRequest, NextResponse } from 'next/server'
import { searchSentinelImages } from '@/services/copernicus'
import { validateSearchParams } from '@/lib/validators'
import type { SearchParams } from '@/types'

export async function POST(request: NextRequest) {
  // 1. Ler e fazer parse do corpo do pedido
  let params: SearchParams
  try {
    params = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Corpo do pedido inválido. Esperado JSON com SearchParams.' },
      { status: 400 }
    )
  }

  // 2. Validar parâmetros (RF4, RF13)
  const validationErrors = validateSearchParams(params)
  if (validationErrors.length > 0) {
    return NextResponse.json(
      { error: 'Parâmetros inválidos.', details: validationErrors },
      { status: 400 }
    )
  }

  // 3. Chamar o serviço Copernicus com os parâmetros decompostos
  try {
    const results = await searchSentinelImages(
      params.region,
      params.startDate,
      params.endDate,
      params.maxCloudCoverage
    )

    return NextResponse.json(
      { results, total: results.length },
      { status: 200, headers: { 'Cache-Control': 'private, max-age=300' } }
    )
  } catch (error) {
    console.error('[/api/search] Erro ao consultar o Copernicus:', error)
    return NextResponse.json(
      { error: 'Serviço Copernicus temporariamente indisponível. Tenta novamente mais tarde.', results: [], total: 0 },
      { status: 503 }
    )
  }
}
