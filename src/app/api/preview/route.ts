/**
 * Rota interna de pré-visualização de imagem: POST /api/preview
 * Explorador Temporal de Imagens de Satélite
 *
 * Autor: Krassimire Iankov Djimov — 2301201
 * Universidade Aberta — Projeto de Engenharia Informática 2025/26
 *
 * ESTADO: Stub — funcionalidade planeada para as semanas 9-11
 *
 * PROPÓSITO PREVISTO:
 * Esta rota irá receber um imageId e uma BandMode e devolver o URL
 * de pré-visualização da imagem Sentinel-2 via o serviço OGC WMS
 * do Copernicus (ADR-002 — toda a comunicação com sistemas externos
 * é mediada por rotas internas, nunca feita directamente do cliente).
 *
 * RASTREABILIDADE:
 * - RF9: apresentar imagem correspondente ao resultado seleccionado
 * - RF10: pelo menos duas composições de bandas (TCI, NDVI, SWIR)
 * - ADR-002: isolamento da comunicação com o Copernicus no servidor
 *
 * IMPLEMENTAÇÃO PREVISTA:
 * 1. Receber { imageId, bandMode, region } no corpo do pedido
 * 2. Validar os parâmetros
 * 3. Chamar buildImageUrl() de src/services/copernicus.ts
 * 4. Devolver o URL de renderização OGC WMS
 *
 * NOTA PARA O INTERCALAR:
 * Esta rota está declarada como stub para demonstrar que a arquitectura
 * de mediação (ADR-002) foi pensada desde o início. A implementação
 * funcional será completada nas semanas 9–11 conforme o calendário.
 */

import { NextRequest, NextResponse } from 'next/server'

/**
 * Handler POST — devolve stub informativo enquanto a implementação
 * funcional não está completa.
 *
 * @param request - Pedido HTTP com { imageId, bandMode, region }
 * @returns JSON com mensagem de estado ou URL de pré-visualização (futuro)
 */
export async function POST(request: NextRequest) {
  // Ler os parâmetros do pedido para validação futura
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Corpo do pedido inválido. Esperado JSON com imageId e bandMode.' },
      { status: 400 }
    )
  }

  // Stub: devolver resposta informativa enquanto a implementação está em curso
  // TODO (semanas 9-11): substituir por chamada real a buildImageUrl() do copernicus.ts
  return NextResponse.json(
    {
      ok: false,
      message: 'Rota /api/preview em implementação (semanas 9–11). Ver ADR-002 e src/services/copernicus.ts buildImageUrl().',
      received: { imageId: body?.imageId, bandMode: body?.bandMode },
    },
    { status: 501 }
  )
}
