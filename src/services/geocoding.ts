/**
 * Serviço de geocodificação por topónimo (Nominatim / OpenStreetMap)
 * Explorador Temporal de Imagens de Satélite
 *
 * Autor: Krassimire Iankov Djimov — 2301201
 * Universidade Aberta — Projeto de Engenharia Informática 2025/26
 *
 * PROPÓSITO:
 * Converte nomes de lugares (topónimos) em coordenadas geográficas
 * usando a API pública do Nominatim. Implementa RF1b (Must Have v2.1):
 * pesquisa por topónimo para utilizadores não especialistas que não
 * conhecem coordenadas geográficas.
 *
 * RASTREABILIDADE:
 * - RF1b: pesquisa por nome de lugar (promovido de Could Have para Must Have)
 * - ADR-002: esta função é chamada APENAS pela rota /api/geocode,
 *            nunca directamente pelo browser (encapsula comunicação externa)
 *
 * POLÍTICA DE USO DO NOMINATIM:
 * O Nominatim é gratuito mas tem regras de utilização obrigatórias:
 * 1. User-Agent identificativo em todos os pedidos
 * 2. Máximo de 1 pedido por segundo (respeitado pelo debounce do cliente)
 * 3. Não usar para geocodificação em massa
 * Ver: https://operations.osmfoundation.org/policies/nominatim/
 *
 * Documentação da API: https://nominatim.org/release-docs/develop/api/Search/
 */

import type { GeocodingResult } from '@/types'

// =============================================================
// CONFIGURAÇÃO
// =============================================================

/**
 * URL base do Nominatim. Em desenvolvimento usa a instância pública.
 * Para produção com volume elevado, considerar instância própria.
 */
const NOMINATIM_URL =
  process.env.NOMINATIM_URL ?? 'https://nominatim.openstreetmap.org'

/**
 * User-Agent obrigatório pela política do Nominatim.
 * Identifica a aplicação e o contacto do responsável.
 * Sem este cabeçalho, os pedidos são rejeitados com HTTP 403.
 */
const USER_AGENT =
  process.env.NOMINATIM_USER_AGENT ??
  'ExploradoTemporalSatelite/1.0 (krassimire.djimov@estudante.uab.pt; 2301201)'

// =============================================================
// TIPOS INTERNOS
// Reflectem a estrutura da resposta do Nominatim.
// Não são exportados — são detalhes de implementação deste serviço.
// =============================================================

/**
 * Resultado individual devolvido pela API de pesquisa do Nominatim.
 * O Nominatim devolve um array de resultados ordenados por relevância.
 */
interface NominatimResult {
  /** Identificador único do lugar no OpenStreetMap */
  place_id: number
  /** Nome legível completo: "Lisboa, Portugal" */
  display_name: string
  /** Latitude do centro do lugar (como string — converter para number) */
  lat: string
  /** Longitude do centro do lugar (como string — converter para number) */
  lon: string
  /**
   * Caixa delimitadora do lugar no formato [minLat, maxLat, minLon, maxLon].
   * Útil para centrar o mapa e definir o zoom adequado.
   */
  boundingbox: [string, string, string, string]
  /** Código ISO do país (ex: "pt" para Portugal) */
  country_code?: string
  /** Nome do país em inglês */
  address?: { country?: string; country_code?: string }
}

// =============================================================
// CONVERSÃO DE TIPOS (Nominatim → domínio interno)
// =============================================================

/**
 * Converte um resultado Nominatim para o tipo GeocodingResult do domínio.
 *
 * Esta função isola a aplicação dos detalhes da API Nominatim.
 * Se a API mudar, só esta função precisa de ser actualizada.
 *
 * @param result - Resultado da API Nominatim
 * @returns Resultado normalizado para uso nos componentes
 */
function nominatimToGeocodingResult(result: NominatimResult): GeocodingResult {
  const [minLat, maxLat, minLng, maxLng] = result.boundingbox.map(Number)
  return {
    name: result.display_name.split(',')[0].trim(), // Só o nome principal
    country: result.address?.country ?? result.display_name.split(',').pop()?.trim() ?? '',
    lat: parseFloat(result.lat),
    lng: parseFloat(result.lon),
    boundingBox: {
      minLat, maxLat, minLng, maxLng,
    },
  }
}

// =============================================================
// FUNÇÃO PRINCIPAL DE PESQUISA
// =============================================================

/**
 * Pesquisa lugares por nome usando o Nominatim / OpenStreetMap.
 *
 * ATENÇÃO: Esta função deve ser chamada APENAS pela rota /api/geocode.
 * Nunca chamar directamente do cliente (ADR-002).
 *
 * Parâmetros notáveis da query Nominatim:
 * - format=json: resposta em JSON
 * - limit: número máximo de resultados (5 é suficiente para dropdown)
 * - addressdetails: inclui informação de país para mostrar na UI
 * - featuretype=settlement: prioriza cidades e localidades
 *
 * @param query - Nome do lugar pesquisado pelo utilizador (ex: "Lisboa")
 * @param limit - Número máximo de sugestões a devolver (padrão: 5)
 * @returns Lista de resultados ordenados por relevância do Nominatim
 * @throws Error se o Nominatim estiver indisponível ou devolver erro HTTP
 */
export async function searchByToponym(
  query: string,
  limit = 5
): Promise<GeocodingResult[]> {
  // Construir parâmetros da query STAC conforme documentação do Nominatim
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: String(limit),
    addressdetails: '1',        // Inclui detalhes de endereço (país, etc.)
    'accept-language': 'pt,en', // Preferência por nomes em Português
  })

  const response = await fetch(`${NOMINATIM_URL}/search?${params.toString()}`, {
    headers: {
      // User-Agent obrigatório pela política de uso do Nominatim
      'User-Agent': USER_AGENT,
      // Referer recomendado para identificação adicional
      'Referer': 'https://github.com/Djimov/Krassimire',
    },
  })

  // Tratamento robusto de erros da API externa (RNF4)
  if (!response.ok) {
    throw new Error(
      `Nominatim respondeu com HTTP ${response.status}. ` +
      'Serviço de pesquisa de lugares temporariamente indisponível.'
    )
  }

  const results: NominatimResult[] = await response.json()

  // Normalizar cada resultado para o tipo interno GeocodingResult
  return results.map(nominatimToGeocodingResult)
}
