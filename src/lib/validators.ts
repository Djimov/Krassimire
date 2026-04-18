/**
 * Validadores de parâmetros de pesquisa
 * Explorador Temporal de Imagens de Satélite
 *
 * Autor: Krassimire Iankov Djimov — 2301201
 * Universidade Aberta — Projeto de Engenharia Informática 2025/26
 *
 * Implementa RF4: validação de parâmetros temporais.
 * Implementa RF13: mensagens claras em caso de parâmetros inválidos.
 * Funções testáveis de forma isolada (ver src/tests/validators.test.ts).
 */

import type { Region, SearchParams } from '@/types'

// Resultado de validação: sucesso ou falha com mensagem descritiva
export type ValidationResult =
  | { valid: true }
  | { valid: false; error: string }

// =============================================================
// VALIDAÇÃO DE DATAS
// =============================================================

/**
 * Valida se uma string é uma data válida no formato YYYY-MM-DD.
 * Rejeita datas anteriores ao início do Sentinel-2 (Junho 2015).
 */
export function validateDate(dateStr: string): ValidationResult {
  const isoPattern = /^\d{4}-\d{2}-\d{2}$/
  if (!isoPattern.test(dateStr)) {
    return { valid: false, error: `Data inválida: "${dateStr}". Use o formato AAAA-MM-DD.` }
  }
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    return { valid: false, error: `Data inválida: "${dateStr}" não é uma data real.` }
  }
  const SENTINEL_START = new Date('2015-06-23')
  if (date < SENTINEL_START) {
    return { valid: false, error: `Data demasiado antiga. O Sentinel-2 tem dados a partir de ${SENTINEL_START.toLocaleDateString('pt-PT')}.` }
  }
  return { valid: true }
}

/**
 * Valida um intervalo temporal completo.
 * A data de início deve ser anterior à data de fim.
 * O intervalo não pode exceder 730 dias (2 anos).
 */
export function validateDateRange(startDate: string, endDate: string): ValidationResult {
  const startResult = validateDate(startDate)
  if (!startResult.valid) return startResult
  const endResult = validateDate(endDate)
  if (!endResult.valid) return endResult

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (start >= end) {
    return { valid: false, error: 'A data de início deve ser anterior à data de fim.' }
  }
  const MAX_DAYS = 730
  const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays > MAX_DAYS) {
    return { valid: false, error: `O intervalo não pode exceder ${MAX_DAYS} dias. O intervalo actual é de ${diffDays} dias.` }
  }
  return { valid: true }
}

// =============================================================
// VALIDAÇÃO DA REGIÃO GEOGRÁFICA
// =============================================================

/**
 * Valida uma bounding box geográfica.
 * Verifica limites válidos, coerência e dimensões mínimas/máximas.
 */
export function validateRegion(region: Region): ValidationResult {
  const { minLat, minLng, maxLat, maxLng } = region
  if (minLat < -90 || maxLat > 90) return { valid: false, error: 'Latitude deve estar entre -90° e 90°.' }
  if (minLng < -180 || maxLng > 180) return { valid: false, error: 'Longitude deve estar entre -180° e 180°.' }
  if (minLat >= maxLat) return { valid: false, error: 'A latitude mínima deve ser inferior à máxima.' }
  if (minLng >= maxLng) return { valid: false, error: 'A longitude mínima deve ser inferior à máxima.' }
  if (maxLat - minLat < 0.01 || maxLng - minLng < 0.01) {
    return { valid: false, error: 'A região seleccionada é demasiado pequena. Desenha uma área maior.' }
  }
  if (maxLat - minLat > 10 || maxLng - minLng > 10) {
    return { valid: false, error: 'A região seleccionada é demasiado grande. Reduz a área para obter melhores resultados.' }
  }
  return { valid: true }
}

// =============================================================
// VALIDAÇÃO COMPLETA DOS PARÂMETROS DE PESQUISA
// =============================================================

/**
 * Valida o conjunto completo de parâmetros de pesquisa.
 * Devolve um array de erros (vazio se tudo válido).
 */
export function validateSearchParams(params: SearchParams): string[] {
  const errors: string[] = []
  const regionResult = validateRegion(params.region)
  if (!regionResult.valid) errors.push(regionResult.error)
  const dateResult = validateDateRange(params.startDate, params.endDate)
  if (!dateResult.valid) errors.push(dateResult.error)
  if (params.maxCloudCoverage < 0 || params.maxCloudCoverage > 100) {
    errors.push('A cobertura máxima de nuvens deve estar entre 0% e 100%.')
  }
  return errors
}
