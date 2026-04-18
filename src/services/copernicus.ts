/**
 * Serviço de integração com o Copernicus Data Space Ecosystem
 * Explorador Temporal de Imagens de Satélite
 *
 * Autor: Krassimire Iankov Djimov — 2301201
 * Universidade Aberta — Projeto de Engenharia Informática 2025/26
 *
 * PROPÓSITO:
 * Este ficheiro encapsula toda a lógica de comunicação com a API STAC
 * do Copernicus. É o único ponto do sistema que "conhece" os detalhes
 * do protocolo Copernicus — todos os outros módulos trabalham com os
 * tipos internos do domínio (SatelliteImageResult, etc.).
 *
 * RASTREABILIDADE:
 * - RF5: consultar fonte externa de imagens Sentinel-2
 * - RF6: filtrar por cobertura de nuvens (enviado como parâmetro STAC)
 * - RF7: resultados ordenados cronologicamente (sortby na query STAC)
 * - RF9: URL de pré-visualização da imagem (buildImageUrl)
 * - RF10: composições de bandas (mapeamento BandMode → layer OGC)
 * - ADR-002: chamado APENAS pela rota /api/search, nunca pelo cliente
 *
 * AUTENTICAÇÃO:
 * O Copernicus usa OAuth2 client credentials. As credenciais são lidas
 * das variáveis de ambiente (ver .env.example). O token OAuth é obtido
 * antes de cada pedido — numa versão futura pode ser cacheado.
 *
 * DOCUMENTAÇÃO DA API:
 * https://documentation.dataspace.copernicus.eu/APIs/STAC.html
 * https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/OGC.html
 */

import type { SearchParams, SatelliteImageResult, BandMode } from '@/types'

// =============================================================
// CONFIGURAÇÃO
// Lida das variáveis de ambiente — nunca hardcoded aqui.
// Ver .env.example para os valores necessários.
// =============================================================

/** URL base da API STAC do Copernicus para descoberta de imagens */
const STAC_URL =
  process.env.COPERNICUS_STAC_URL ??
  'https://catalogue.dataspace.copernicus.eu/stac'

/** URL base do serviço OGC WMS para renderização de tiles de imagem */
const OGC_URL =
  process.env.COPERNICUS_OGC_URL ??
  'https://sh.dataspace.copernicus.eu/ogc/wms'

/** URL do endpoint OAuth2 para obtenção do token de acesso */
const TOKEN_URL =
  process.env.COPERNICUS_TOKEN_URL ??
  'https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token'

// =============================================================
// TIPOS INTERNOS
// Reflectem a estrutura real da resposta da API STAC do Copernicus.
// Não são exportados — são detalhes de implementação deste serviço.
// =============================================================

/**
 * Feature GeoJSON devolvida pela API STAC do Copernicus.
 * Cada feature representa uma imagem Sentinel-2 disponível.
 */
interface StacFeature {
  /** ID único da imagem no catálogo Copernicus (ex: S2A_MSIL2A_20230615T...) */
  id: string
  properties: {
    /** Data e hora de aquisição da imagem (ISO 8601) */
    datetime: string
    /** Percentagem de cobertura de nuvens (0–100) */
    'eo:cloud_cover': number
    /** Nível de processamento (L2A = correcção atmosférica aplicada) */
    's2:processing_baseline'?: string
  }
  assets: {
    /** Miniatura da imagem para apresentação na timeline */
    thumbnail?: { href: string }
    /** Imagem de pré-visualização em maior resolução */
    visual?: { href: string }
    /** Banda B04 (vermelho) — necessária para NDVI */
    B04?: { href: string }
    /** Banda B08 (infravermelho próximo) — necessária para NDVI */
    B08?: { href: string }
  }
}

/**
 * Resposta completa de uma pesquisa STAC.
 * O campo context indica quantos resultados foram encontrados no total.
 */
interface StacSearchResponse {
  type: 'FeatureCollection'
  features: StacFeature[]
  context?: {
    returned: number
    limit: number
    matched: number
  }
}

// =============================================================
// AUTENTICAÇÃO OAUTH2
// =============================================================

/**
 * Obtém um token de acesso OAuth2 do Copernicus.
 *
 * O Copernicus usa o fluxo "client credentials" — adequado para
 * comunicação servidor-a-servidor sem interacção do utilizador.
 *
 * NOTA: Numa versão de produção, o token deve ser cacheado até
 * expirar (tipicamente 10 minutos) para evitar um pedido extra
 * em cada pesquisa.
 *
 * @returns Token de acesso para incluir nos cabeçalhos Authorization
 * @throws Error se as credenciais não estiverem configuradas ou forem inválidas
 */
async function getAccessToken(): Promise<string> {
  const clientId = process.env.COPERNICUS_CLIENT_ID
  const clientSecret = process.env.COPERNICUS_CLIENT_SECRET

  // Verifica que as credenciais estão configuradas no .env.local
  if (!clientId || !clientSecret) {
    throw new Error(
      'Credenciais do Copernicus não configuradas. ' +
      'Copia .env.example para .env.local e preenche COPERNICUS_CLIENT_ID e COPERNICUS_CLIENT_SECRET.'
    )
  }

  // Pedido OAuth2 com grant_type=client_credentials
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
// CONVERSÃO DE TIPOS (API → domínio interno)
// =============================================================

/**
 * Determina as bandas disponíveis para uma imagem Sentinel-2.
 *
 * TCI está sempre disponível. NDVI requer B04 + B08 explicitamente
 * presentes nos assets. SWIR é assumido disponível em imagens L2A.
 *
 * @param feature - Feature STAC da imagem
 * @returns Lista de BandMode disponíveis para esta imagem
 */
function extractAvailableBands(feature: StacFeature): BandMode[] {
  const bands: BandMode[] = ['TCI'] // TCI (cor natural) está sempre disponível

  // NDVI requer as bandas vermelho (B04) e infravermelho próximo (B08)
  if (feature.assets.B04 && feature.assets.B08) {
    bands.push('NDVI')
  }

  // SWIR (humidade do solo) está disponível na maioria das imagens L2A
  bands.push('SWIR')

  return bands
}

/**
 * Converte um feature STAC do Copernicus para o tipo interno SatelliteImageResult.
 *
 * Esta função isola a aplicação dos detalhes do protocolo STAC.
 * Se a API Copernicus mudar, só esta função precisa de ser actualizada.
 *
 * @param feature - Feature STAC devolvido pela API
 * @returns Resultado normalizado para uso nos componentes da aplicação
 */
function stacFeatureToResult(feature: StacFeature): SatelliteImageResult {
  return {
    imageId: feature.id,
    acquisitionDate: feature.properties.datetime,
    // Math.round garante que não aparecem decimais na interface
    cloudCoverage: Math.round(feature.properties['eo:cloud_cover'] ?? 0),
    thumbnailUrl: feature.assets.thumbnail?.href,
    previewUrl: feature.assets.visual?.href,
    source: 'Copernicus',
    bandsAvailable: extractAvailableBands(feature),
  }
}

// =============================================================
// FUNÇÃO PRINCIPAL DE PESQUISA
// =============================================================

/**
 * Pesquisa imagens Sentinel-2 no Copernicus Data Space Ecosystem.
 *
 * ATENÇÃO: Esta função deve ser chamada APENAS pela rota /api/search.
 * Nunca chamar directamente do cliente (ADR-002).
 *
 * Processo:
 * 1. Obtém token OAuth2
 * 2. Constrói a query STAC com os parâmetros fornecidos
 * 3. Envia pedido POST ao catálogo STAC
 * 4. Normaliza a resposta para o formato interno
 *
 * @param params - Parâmetros de pesquisa já validados por validateSearchParams
 * @returns Array de resultados ordenados cronologicamente (RF7)
 * @throws Error se a API estiver indisponível ou devolver erro HTTP
 */
export async function searchSentinelImages(
  params: SearchParams
): Promise<SatelliteImageResult[]> {
  const { region, startDate, endDate, maxCloudCoverage } = params

  // Obtém token de autenticação antes de cada pedido
  const token = await getAccessToken()

  // Constrói a bounding box no formato [west, south, east, north] exigido pelo STAC
  const bbox = [region.minLng, region.minLat, region.maxLng, region.maxLat]

  // Corpo do pedido STAC conforme especificação OGC STAC API
  const requestBody = {
    collections: ['SENTINEL-2'],
    bbox,
    // Intervalo temporal no formato ISO 8601 interval
    datetime: `${startDate}T00:00:00Z/${endDate}T23:59:59Z`,
    // Máximo de 50 resultados por pedido para manter a interface responsiva
    limit: 50,
    query: {
      // Filtro por cobertura máxima de nuvens (RF6)
      'eo:cloud_cover': { lte: maxCloudCoverage },
      // Apenas imagens com correcção atmosférica aplicada (L2A)
      'processingLevel': { eq: 'S2MSI2A' },
    },
    // Ordenação cronológica ascendente (RF7)
    sortby: [{ field: 'datetime', direction: 'asc' }],
  }

  const response = await fetch(`${STAC_URL}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Token OAuth2 obtido acima
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  })

  // Tratamento robusto de erros da API externa (RNF4)
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Erro desconhecido')
    throw new Error(
      `Copernicus STAC API respondeu com HTTP ${response.status}: ${errorText}`
    )
  }

  const data: StacSearchResponse = await response.json()

  // Normaliza cada feature STAC para o tipo interno da aplicação
  return data.features.map(stacFeatureToResult)
}

// =============================================================
// CONSTRUÇÃO DE URL DE PRÉ-VISUALIZAÇÃO
// =============================================================

/**
 * Gera o URL de pré-visualização de uma imagem com a banda espetral pedida.
 *
 * Usa o serviço OGC WMS do Copernicus para renderizar a imagem
 * na composição de bandas escolhida pelo utilizador (RF9, RF10).
 *
 * @param imageId - ID da imagem Sentinel-2 (ex: S2A_MSIL2A_20230615T...)
 * @param bandMode - Composição de bandas ('TCI', 'NDVI', ou 'SWIR')
 * @param region - Região geográfica para recorte da imagem
 * @returns URL completo do WMS para incluir numa tag <img>
 */
export function buildImageUrl(
  imageId: string,
  bandMode: BandMode,
  region: { minLat: number; minLng: number; maxLat: number; maxLng: number }
): string {
  // Mapeamento de bandas do domínio interno para identificadores do serviço OGC
  const layerMap: Record<BandMode, string> = {
    TCI:  'TRUE_COLOR', // Cor natural: combinação R=B04, G=B03, B=B02
    NDVI: 'NDVI',       // Índice de vegetação: (B08-B04)/(B08+B04)
    SWIR: 'SWIR',       // Infravermelho de onda curta: R=B12, G=B8A, B=B04
  }

  const params = new URLSearchParams({
    SERVICE: 'WMS',
    REQUEST: 'GetMap',
    LAYERS: layerMap[bandMode],
    // BBOX no formato: west,south,east,north
    BBOX: `${region.minLng},${region.minLat},${region.maxLng},${region.maxLat}`,
    WIDTH: '800',
    HEIGHT: '600',
    FORMAT: 'image/jpeg',
    CRS: 'EPSG:4326',
    // Extrai a data do ID da imagem (formato: S2A_MSIL2A_YYYYMMDDTHHMMSS_...)
    TIME: imageId.split('_')[2]?.slice(0, 8).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') ?? '',
  })

  return `${OGC_URL}?${params.toString()}`
}
