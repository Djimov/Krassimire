/**
 * Rota interna de geocodificação: GET /api/geocode?q=...
 * Explorador Temporal de Imagens de Satélite
 *
 * Autor: Krassimire Iankov Djimov — 2301201
 * Universidade Aberta — Projeto de Engenharia Informática 2025/26
 *
 * Implementa ADR-002: medeia a comunicação com o Nominatim.
 * O cliente nunca chama o Nominatim directamente.
 *
 * Uso: GET /api/geocode?q=Sintra
 * Resposta: { results: GeocodingResult[] }
 */

import { NextRequest, NextResponse } from 'next/server'
import { geocodePlace } from '@/services/geocoding'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  // Validação do parâmetro — RF13: mensagens claras de erro
  if (!query || query.trim().length < 2) {
    return NextResponse.json(
      { error: 'O parâmetro "q" deve ter pelo menos 2 caracteres.' },
      { status: 400 }
    )
  }

  if (query.length > 200) {
    return NextResponse.json({ error: 'A pesquisa é demasiado longa.' }, { status: 400 })
  }

  try {
    const results = await geocodePlace(query.trim(), 5)
    return NextResponse.json({ results }, {
      status: 200,
      headers: {
        // Cache de 1 hora no browser para reduzir pedidos ao Nominatim
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('[/api/geocode] Erro ao chamar o Nominatim:', error)
    return NextResponse.json(
      { error: 'Serviço de geocodificação temporariamente indisponível.', results: [] },
      { status: 503 }
    )
  }
}
