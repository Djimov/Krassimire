/**
 * Serviço de geocodificação por topónimo (Nominatim / OpenStreetMap)
 * Explorador Temporal de Imagens de Satélite
 *
 * Autor: Krassimire Iankov Djimov — 2301201
 * Universidade Aberta — Projeto de Engenharia Informática 2025/26
 *
 * Implementa RF1 Must Have (promovido v2.1): pesquisa por topónimo.
 * Consistente com ADR-002: chamadas ao Nominatim feitas apenas
 * através da rota interna /api/geocode, nunca directamente do cliente.
 *
 * Documentação: https://nominatim.org/release-docs/develop/api/Search/
 */

import type { GeocodingResult } from '@/types'

const NOMINATIM_URL = process.env.NOMINATIM_URL ?? 'https://nominatim.openstreetmap.org'
const USER_AGENT = process.env.NOMINATIM_USER_AGENT ?? 'ExploradoTemporalSatelite/0.1 (2301201@estudante.uab.pt)'

// Estrutura da resposta do Nominatim (tipo interno — não exportado)
interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
  boundingbox: [string, string, string, string] // [minLat, maxLat, minLng, maxLng]
  address?: {
    country?: string
    city?: string
    town?: string
    village?: string
  }
}

/** Extrai o nome principal do lugar da resposta do Nominatim */
function extractPlaceName(r: NominatimResult): string {
  return r.address?.city ?? r.address?.town ?? r.address?.village ?? r.display_name.split(',')[0].trim()
}

/** Converte resultado Nominatim para o tipo interno GeocodingResult */
function nominatimToResult(r: NominatimResult): GeocodingResult {
  const [bbMinLat, bbMaxLat, bbMinLng, bbMaxLng] = r.boundingbox.map(parseFloat)
  return {
    name: extractPlaceName(r),
    country: r.address?.country ?? '',
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
    boundingBox: { minLat: bbMinLat, maxLat: bbMaxLat, minLng: bbMinLng, maxLng: bbMaxLng },
  }
}

/**
 * Pesquisa lugares por nome usando o Nominatim (OpenStreetMap).
 *
 * ATENÇÃO: Chamar APENAS a partir da rota /api/geocode (ADR-002).
 * Nunca chamar directamente do cliente.
 *
 * @param query - Nome do lugar (ex: "Sintra", "Berlin")
 * @param limit - Máximo de resultados (default: 5)
 */
export async function geocodePlace(query: string, limit = 5): Promise<GeocodingResult[]> {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: String(limit),
    addressdetails: '1',
    'accept-language': 'pt,en',
  })

  const response = await fetch(`${NOMINATIM_URL}/search?${params.toString()}`, {
    headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/json' },
    next: { revalidate: 3600 }, // cache de 1 hora
  })

  if (!response.ok) {
    throw new Error(`Nominatim respondeu com erro ${response.status}.`)
  }

  const results: NominatimResult[] = await response.json()
  return results.map(nominatimToResult)
}
