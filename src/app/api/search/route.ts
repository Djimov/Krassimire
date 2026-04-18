/**
 * Rota interna de pesquisa de imagens: POST /api/search
 * Explorador Temporal de Imagens de Satélite
 *
 * Autor: Krassimire Iankov Djimov — 2301201
 * Universidade Aberta — Projeto de Engenharia Informática 2025/26
 *
 * PROPÓSITO:
 * Esta rota é o ponto de entrada para todas as pesquisas de imagens Sentinel-2.
 * Recebe os parâmetros do cliente, valida-os, e delega ao serviço Copernicus.
 *
 * RASTREABILIDADE:
 * - RF5: consultar fonte externa de imagens Sentinel-2
 * - RF4: validar parâmetros antes de chamar a API externa
 * - RF13: devolver mensagens de erro claras em caso de falha
 * - ADR-002: toda a comunicação com o Copernicus é mediada aqui,
 *            nunca feita directamente pelo cliente (browser)
 *
 * USO:
 * POST /api/search
 * Body: SearchParams (JSON)
 * Resposta sucesso: { results: SatelliteImageResult[], total: number }
 * Resposta erro:    { error: string, details?: string[] }
 *
 * SEGURANÇA:
 * As credenciais do Copernicus (client_id, client_secret) ficam apenas
 * no servidor — nunca são expostas ao browser. Ver .env.example.
 */

import { NextRequest, NextResponse } from 'next/server'
import { searchSentinelImages } from '@/services/copernicus'
import { validateSearchParams } from '@/lib/validators'
import type { SearchParams } from '@/types'

/**
 * Handler POST — recebe parâmetros de pesquisa e devolve imagens Sentinel-2.
 *
 * Fluxo:
 * 1. Lê e faz parse do corpo JSON do pedido
 * 2. Valida todos os parâmetros com validateSearchParams
 * 3. Se válido, chama o serviço Copernicus
 * 4. Devolve os resultados normalizados ou uma mensagem de erro clara
 *
 * @param request - Pedido HTTP Next.js com corpo SearchParams
 * @returns JSON com resultados ou mensagem de erro
 */
export async function POST(request: NextRequest) {
  // Passo 1: Ler e fazer parse do corpo do pedido
  // Protege contra pedidos com JSON malformado
  let params: SearchParams
  try {
    params = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Corpo do pedido inválido. Esperado JSON com SearchParams.' },
      { status: 400 }
    )
  }

  // Passo 2: Validar todos os parâmetros antes de chamar a API externa
  // Isto evita pedidos desnecessários ao Copernicus e devolve erros claros (RF4, RF13)
  const validationErrors = validateSearchParams(params)
  if (validationErrors.length > 0) {
    return NextResponse.json(
      {
        error: 'Parâmetros inválidos. Corrige os erros abaixo antes de pesquisar.',
        details: validationErrors,
      },
      { status: 400 }
    )
  }

  // Passo 3: Chamar o serviço Copernicus
  // O serviço trata da autenticação OAuth2 e da construção do pedido STAC
  try {
    const results = await searchSentinelImages(params)

    // Passo 4: Devolver resultados com cache curto
    // Cache de 5 minutos — dados suficientemente frescos para a maioria dos casos
    return NextResponse.json(
      { results, total: results.length },
      {
        status: 200,
        headers: {
          'Cache-Control': 'private, max-age=300',
        },
      }
    )
  } catch (error) {
    // Tratamento robusto de falhas da API externa (RNF4, RF13)
    // O utilizador vê uma mensagem amigável; o erro técnico fica no log do servidor
    console.error('[/api/search] Erro ao consultar o Copernicus:', error)

    return NextResponse.json(
      {
        error: 'Serviço Copernicus temporariamente indisponível. Tenta novamente mais tarde.',
        results: [],
        total: 0,
      },
      { status: 503 }
    )
  }
}
