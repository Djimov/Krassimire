export const maxDuration = 30

/**
 * Rota interna de geocodificação: GET /api/geocode?q=...
 * Explorador Temporal de Imagens de Satélite
 *
 * Autor: Krassimire Iankov Djimov — 2301201
 * Universidade Aberta — Projeto de Engenharia Informática 2025/26
 *
 * Implementa ADR-002: medeia a comunicação com o Nominatim.
 */

import { NextRequest, NextResponse } from 'next/server'
import { searchByToponym } from '@/services/geocoding'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')

  if (!query || query.trim().length < 2) {
    return NextResponse.json(
      { error: 'O parâmetro "q" deve ter pelo menos 2 caracteres.' },
      { status: 400 }
    )
  }

  try {
    const results = await searchByToponym(query.trim(), 5)
    return NextResponse.json({ results })
  } catch (error) {
    console.error('[/api/geocode] Erro:', error)
    return NextResponse.json(
      { error: 'Serviço de geocodificação indisponível.' },
      { status: 503 }
    )
  }
}
