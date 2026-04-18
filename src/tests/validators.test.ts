/**
 * Testes unitários — Validadores de parâmetros de pesquisa
 * Explorador Temporal de Imagens de Satélite
 *
 * Autor: Krassimire Iankov Djimov — 2301201
 * Universidade Aberta — Projeto de Engenharia Informática 2025/26
 *
 * Cobre RF4 (validação de datas) e RF1 (validação de região).
 * Rastreabilidade directa com os critérios de aceitação do MVP (secção 7 da proposta).
 * Executar com: npm test
 */

import { describe, it, expect } from 'vitest'
import { validateDate, validateDateRange, validateRegion, validateSearchParams } from '@/lib/validators'
import type { Region, SearchParams } from '@/types'

// Região válida de Lisboa — reutilizada em múltiplos testes
const VALID_REGION: Region = {
  minLat: 38.65, minLng: -9.25, maxLat: 38.80, maxLng: -9.05,
  createdAt: '2024-01-01T00:00:00.000Z',
}

describe('validateDate', () => {
  it('aceita data válida no formato ISO YYYY-MM-DD', () => {
    expect(validateDate('2023-06-15').valid).toBe(true)
  })
  it('rejeita formato inválido DD/MM/YYYY', () => {
    const r = validateDate('15/06/2023')
    expect(r.valid).toBe(false)
    expect(r).toHaveProperty('error')
  })
  it('rejeita data inexistente (30 de Fevereiro)', () => {
    expect(validateDate('2023-02-30').valid).toBe(false)
  })
  it('rejeita datas anteriores ao Sentinel-2 (antes de Junho 2015)', () => {
    const r = validateDate('2010-01-01')
    expect(r.valid).toBe(false)
    if (!r.valid) expect(r.error).toContain('2015')
  })
  it('aceita exactamente a data de início do Sentinel-2', () => {
    expect(validateDate('2015-06-23').valid).toBe(true)
  })
})

describe('validateDateRange', () => {
  it('aceita intervalo temporal válido de 12 meses', () => {
    expect(validateDateRange('2023-01-01', '2023-12-31').valid).toBe(true)
  })
  it('rejeita quando início igual ao fim', () => {
    expect(validateDateRange('2023-06-01', '2023-06-01').valid).toBe(false)
  })
  it('rejeita quando início posterior ao fim', () => {
    expect(validateDateRange('2023-12-31', '2023-01-01').valid).toBe(false)
  })
  it('rejeita intervalos superiores a 730 dias (protecção da API)', () => {
    const r = validateDateRange('2020-01-01', '2023-01-01')
    expect(r.valid).toBe(false)
    if (!r.valid) expect(r.error).toContain('730')
  })
  it('aceita exactamente 730 dias de intervalo (caso-limite)', () => {
    expect(validateDateRange('2022-01-01', '2024-01-01').valid).toBe(true)
  })
})

describe('validateRegion', () => {
  it('aceita região válida (Lisboa)', () => {
    expect(validateRegion(VALID_REGION).valid).toBe(true)
  })
  it('rejeita latitude fora dos limites absolutos', () => {
    expect(validateRegion({ ...VALID_REGION, maxLat: 91 }).valid).toBe(false)
  })
  it('rejeita longitude fora dos limites absolutos', () => {
    expect(validateRegion({ ...VALID_REGION, maxLng: 181 }).valid).toBe(false)
  })
  it('rejeita região demasiado pequena (utilizador desenhou um ponto)', () => {
    expect(validateRegion({ ...VALID_REGION, minLat: 38.700, maxLat: 38.701 }).valid).toBe(false)
  })
  it('rejeita região demasiado grande (pedido excessivo à API)', () => {
    expect(validateRegion({ minLat: 30, maxLat: 45, minLng: -10, maxLng: 5, createdAt: '' }).valid).toBe(false)
  })
  it('rejeita coordenadas invertidas (utilizador arrastou de baixo para cima)', () => {
    expect(validateRegion({ ...VALID_REGION, minLat: 38.80, maxLat: 38.65 }).valid).toBe(false)
  })
})

describe('validateSearchParams', () => {
  const VALID_PARAMS: SearchParams = {
    region: VALID_REGION, startDate: '2023-01-01', endDate: '2023-12-31', maxCloudCoverage: 30,
  }
  it('devolve array vazio para parâmetros válidos', () => {
    expect(validateSearchParams(VALID_PARAMS)).toHaveLength(0)
  })
  it('devolve erro para cobertura de nuvens inválida (> 100)', () => {
    expect(validateSearchParams({ ...VALID_PARAMS, maxCloudCoverage: 150 }).length).toBeGreaterThan(0)
  })
  it('acumula múltiplos erros em simultâneo (RF13)', () => {
    const params: SearchParams = {
      region: { ...VALID_REGION, maxLat: 91 },
      startDate: '2023-12-31', endDate: '2023-01-01',
      maxCloudCoverage: 30,
    }
    expect(validateSearchParams(params).length).toBeGreaterThanOrEqual(2)
  })
})
