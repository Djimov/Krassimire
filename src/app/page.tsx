/**
 * Página principal — Explorador Temporal de Imagens de Satélite
 * Autor: Krassimire Iankov Djimov — 2301201
 * Universidade Aberta — Projeto de Engenharia Informática 2025/26
 * Fluxo guiado em 4 passos: Lugar → Período → Nuvens → Resultados
 */

'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { Region, SearchParams, SatelliteImageResult, BandMode, Locale } from '@/types'
import { getTranslations } from '@/lib/i18n'

const MapSelector = dynamic(() => import('@/components/map/MapSelector'), { ssr: false })

type Step = 1 | 2 | 3 | 4

interface PageState {
  locale: Locale
  currentStep: Step
  region: Region | null
  placeName: string
  startDate: string
  endDate: string
  maxCloud: number
  results: SatelliteImageResult[]
  activeIndex: number
  activeBand: BandMode
  isSearching: boolean
  error: string | null
  isComparing: boolean
  compareLeftIndex: number
  compareRightIndex: number
  compareLeftCandidates: number[]
  compareLeftCandPos: number
  compareRightCandidates: number[]
  compareRightCandPos: number
}

const today = new Date().toISOString().split('T')[0]

const INITIAL_STATE: PageState = {
  locale: 'pt',
  currentStep: 1,
  region: null,
  placeName: '',
  startDate: '2022-01-01',
  endDate: today,
  maxCloud: 30,
  results: [],
  activeIndex: 0,
  activeBand: 'TCI',
  isSearching: false,
  error: null,
  isComparing: false,
  compareLeftIndex: 0,
  compareRightIndex: 1,
  compareLeftCandidates: [],
  compareLeftCandPos: 0,
  compareRightCandidates: [],
  compareRightCandPos: 0,
}

const CLOUD_OPTIONS = [
  { value: 10, label: 'Quase sem nuvens', labelEn: 'Almost no clouds', icon: '☀️', desc: '≤10%' },
  { value: 30, label: 'Algumas nuvens OK', labelEn: 'Some clouds OK', icon: '⛅', desc: '≤30%' },
  { value: 100, label: 'Mostrar tudo', labelEn: 'Show all', icon: '☁️', desc: '100%' },
]

const BANDS: { mode: BandMode; label: string; labelEn: string; icon: string }[] = [
  { mode: 'TCI', label: 'Natural', labelEn: 'Natural', icon: '🌍' },
  { mode: 'NDVI', label: 'Vegetação', labelEn: 'Vegetation', icon: '🌿' },
  { mode: 'SWIR', label: 'Humidade', labelEn: 'Moisture', icon: '💧' },
]

const VERDE = '#4A9E7F'
const VERDE_ESC = '#2B7A5B'

const card: React.CSSProperties = {
  background: '#fff', borderRadius: 16, padding: '20px 24px',
  marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f0efe8',
}
const cardCollapsed: React.CSSProperties = { ...card, opacity: 0.5, padding: '16px 24px' }
const btnPrimary: React.CSSProperties = {
  background: VERDE, color: '#fff', border: 'none', borderRadius: 12,
  padding: '14px 0', width: '100%', fontSize: 15, fontWeight: 600,
  cursor: 'pointer', fontFamily: 'inherit',
}
const pill: React.CSSProperties = {
  padding: '8px 16px', borderRadius: 20,
  borderWidth: 1, borderStyle: 'solid', borderColor: '#e0ddd5',
  background: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
  transition: 'all 0.15s',
}
const pillActive: React.CSSProperties = { ...pill, background: VERDE, color: '#fff', borderColor: VERDE }

export default function HomePage() {
  const [state, setState] = useState<PageState>(INITIAL_STATE)
  const isPt = state.locale === 'pt'
  const t = getTranslations(state.locale)

  const handleRegionConfirmed = useCallback((region: Region, placeName: string) => {
    setState(prev => ({ ...prev, region, placeName, currentStep: 2 }))
  }, [])

  const handleCloudSelected = useCallback((maxCloud: number) => {
    setState(prev => ({ ...prev, maxCloud, currentStep: 4 }))
  }, [])

  const handleNewSearch = useCallback(() => {
    setState(INITIAL_STATE)
  }, [])

  const layerName = state.activeBand === 'TCI' ? 'TRUE-COLOR-S2L2A'
    : state.activeBand === 'NDVI' ? 'NDVI' : 'SWIR'

  const handleSearch = useCallback(async () => {
    if (!state.region) return

    setState(prev => ({ ...prev, isSearching: true, error: null, results: [] }))

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region: state.region,
          startDate: state.startDate,
          endDate: state.endDate,
          maxCloudCoverage: state.maxCloud,
          selectedBandMode: state.activeBand,
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        setState(prev => ({
          ...prev, isSearching: false,
          error: data?.details ? data.details.join('. ') : (data?.error || (isPt
            ? 'Erro na pesquisa. Verifica os parâmetros e tenta novamente.'
            : 'Search error. Check parameters and try again.')),
        }))
        return
      }

      if (data.results.length === 0) {
        setState(prev => ({
          ...prev, isSearching: false,
          error: isPt
            ? 'Sem resultados. Tenta aumentar o filtro de nuvens ou alargar o período.'
            : 'No results. Try increasing the cloud filter or widening the time range.',
        }))
      } else {
        setState(prev => ({
          ...prev, results: data.results, isSearching: false,
          activeIndex: 0, isComparing: false,
        }))
      }
    } catch (err: any) {
      setState(prev => ({
        ...prev, isSearching: false,
        error: err.message || (isPt
          ? 'Serviço temporariamente indisponível.'
          : 'Service temporarily unavailable.'),
      }))
    }
  }, [state.region, state.startDate, state.endDate, state.maxCloud, state.activeBand, isPt])

  // Encontrar as N imagens mais próximas de uma data, ordenadas por proximidade + nuvens
  const findClosestImages = useCallback((targetDate: string, count: number = 5): number[] => {
    if (state.results.length === 0) return [0]
    const target = new Date(targetDate).getTime()
    const scored = state.results.map((r, i) => ({
      idx: i,
      dist: Math.abs(new Date(r.acquisitionDate).getTime() - target),
      cloud: r.cloudCoverage,
    }))
    // Ordenar por distância temporal, depois por cobertura de nuvens
    scored.sort((a, b) => a.dist - b.dist || a.cloud - b.cloud)
    return scored.slice(0, count).map(s => s.idx)
  }, [state.results])

  return (
    <div style={{ background: '#fafaf8', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Header */}
      <div style={{ ...card, marginBottom: 0, borderRadius: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ cursor: 'pointer' }} onClick={handleNewSearch}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>
            Explorador <span style={{ color: VERDE }}>Temporal</span> · Sentinel-2
          </span>
          <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>Krassimire Djimov · 2301201 · Universidade Aberta</div>
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {state.results.length > 0 && (
            <button onClick={handleNewSearch}
              style={{ ...pill, fontSize: 11, marginRight: 8, color: '#999' }}>
              ↺ {isPt ? 'Nova pesquisa' : 'New search'}
            </button>
          )}
          {(['pt', 'en'] as Locale[]).map(l => (
            <button key={l} onClick={() => setState(prev => ({ ...prev, locale: l }))}
              style={{ ...(state.locale === l ? pillActive : pill), padding: '6px 14px', fontSize: 13, fontWeight: 600 }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '16px 16px' }}>

        {/* ═══ PASSO 1: LUGAR ═══ */}
        <div style={state.currentStep >= 1 ? card : cardCollapsed}>
          <StepHeader num={1} title={isPt ? 'Escolhe um lugar na Terra' : 'Choose a place on Earth'}
            subtitle={state.currentStep > 1 ? state.placeName : (isPt ? 'Seleciona um lugar popular ou pesquisa pelo nome' : 'Select a popular place or search by name')}
            active={state.currentStep === 1} done={state.currentStep > 1}
            onEdit={state.currentStep > 1 ? () => setState(prev => ({ ...prev, currentStep: 1, results: [], error: null })) : undefined} />
          {state.currentStep === 1 && (
            <div style={{ marginTop: 12 }}>
              <MapSelector locale={state.locale} onConfirm={handleRegionConfirmed} />
            </div>
          )}
        </div>

        {/* ═══ PASSO 2: PERÍODO ═══ */}
        <div style={state.currentStep >= 2 ? card : cardCollapsed}>
          <StepHeader num={2} title={isPt ? 'Escolhe um período de tempo' : 'Choose a time period'}
            subtitle={state.currentStep > 2 ? `${state.startDate} → ${state.endDate}` : (isPt ? 'Quando queres explorar?' : 'When do you want to explore?')}
            active={state.currentStep === 2} done={state.currentStep > 2}
            onEdit={state.currentStep > 2 ? () => setState(prev => ({ ...prev, currentStep: 2, results: [], error: null })) : undefined} />
          {state.currentStep === 2 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                  <label style={{ fontSize: 12, color: '#777', display: 'block', marginBottom: 4 }}>{isPt ? 'De:' : 'From:'}</label>
                  <input type="date" value={state.startDate} min="2015-06-23" max={state.endDate}
                    onChange={e => setState(prev => ({ ...prev, startDate: e.target.value }))}
                    style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #ddd', fontSize: 14, fontFamily: 'inherit' }} />
                </div>
                <div style={{ fontSize: 20, color: '#ccc', paddingTop: 20 }}>→</div>
                <div>
                  <label style={{ fontSize: 12, color: '#777', display: 'block', marginBottom: 4 }}>{isPt ? 'Até:' : 'To:'}</label>
                  <input type="date" value={state.endDate} min={state.startDate} max={today}
                    onChange={e => setState(prev => ({ ...prev, endDate: e.target.value }))}
                    style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #ddd', fontSize: 14, fontFamily: 'inherit' }} />
                </div>
              </div>
              <p style={{ fontSize: 11, color: '#aaa', marginTop: 8 }}>
                ℹ️ {isPt ? 'Dados Sentinel-2 disponíveis desde 23 de Junho de 2015. Máximo recomendado: 2 anos por pesquisa.' : 'Sentinel-2 data available since June 23, 2015. Recommended max: 2 years per search.'}
              </p>
              <button onClick={() => setState(prev => ({ ...prev, currentStep: 3 }))}
                style={{ ...btnPrimary, marginTop: 12, maxWidth: 300 }}>
                {isPt ? 'Confirmar período' : 'Confirm period'} →
              </button>
            </div>
          )}
        </div>

        {/* ═══ PASSO 3: NUVENS ═══ */}
        <div style={state.currentStep >= 3 ? card : cardCollapsed}>
          <StepHeader num={3} title={isPt ? 'Quão claras devem ser as imagens?' : 'How clear should the images be?'}
            subtitle={state.currentStep > 3 ? `≤${state.maxCloud}% ${isPt ? 'nuvens' : 'clouds'}` : (isPt ? 'As nuvens podem bloquear a vista' : 'Clouds can block the view')}
            active={state.currentStep === 3} done={state.currentStep > 3}
            onEdit={state.currentStep > 3 ? () => setState(prev => ({ ...prev, currentStep: 3, results: [], error: null })) : undefined} />
          {state.currentStep === 3 && (
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {CLOUD_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => handleCloudSelected(opt.value)}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
                    border: `1.5px solid ${state.maxCloud === opt.value ? VERDE : '#e8e6de'}`,
                    borderRadius: 12, background: state.maxCloud === opt.value ? '#f0f9f5' : '#fff',
                    cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                  <span style={{ fontSize: 26 }}>{opt.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: state.maxCloud === opt.value ? VERDE_ESC : '#333' }}>
                      {isPt ? opt.label : opt.labelEn}
                    </div>
                    <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{opt.desc}</div>
                  </div>
                </button>
              ))}
              <p style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>
                ℹ️ {isPt
                  ? 'O Sentinel-2 é óptico — só captura de dia com luz solar. Não existem imagens nocturnas.'
                  : 'Sentinel-2 is optical — daytime only. No nighttime images exist.'}
              </p>
            </div>
          )}
        </div>

        {/* ═══ PASSO 4: RESULTADOS ═══ */}
        <div style={state.currentStep >= 4 ? card : cardCollapsed}>
          <StepHeader num={4} title={isPt ? 'Explora as imagens' : 'Explore the images'}
            subtitle={isPt ? 'Vê e compara as imagens de satélite' : 'View and compare satellite images'}
            active={state.currentStep === 4} done={false} />
          {state.currentStep === 4 && (
            <div style={{ marginTop: 12 }}>
              {/* Resumo */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <span style={{ ...pill, fontSize: 12, cursor: 'default' }}>{state.placeName}</span>
                <span style={{ ...pill, fontSize: 12, cursor: 'default' }}>{state.startDate} → {state.endDate}</span>
                <span style={{ ...pill, fontSize: 12, cursor: 'default' }}>≤{state.maxCloud}% {isPt ? 'nuvens' : 'clouds'}</span>
              </div>

              <button onClick={handleSearch} disabled={state.isSearching}
                style={{ ...btnPrimary, opacity: state.isSearching ? 0.6 : 1 }}>
                {state.isSearching ? (isPt ? 'A pesquisar...' : 'Searching...') : (isPt ? 'Ver imagens de satélite' : 'View satellite images')}
              </button>

              {/* Erro */}
              {state.error && (
                <div style={{ marginTop: 12, padding: '14px 18px', background: '#fef3f0', borderRadius: 12, border: '1px solid #f5d0c5' }}>
                  <p style={{ fontSize: 13, color: '#c0392b', margin: 0 }}>{state.error}</p>
                </div>
              )}

              {/* === RESULTADOS — VISTA INDIVIDUAL === */}
              {state.results.length > 0 && !state.isComparing && (
                <div style={{ marginTop: 16 }}>
                  <p style={{ fontSize: 13, color: '#777', marginBottom: 8 }}>
                    {isPt ? `${state.results.length} imagens encontradas. Desliza para ver todas.` : `${state.results.length} images found. Scroll to see all.`}
                  </p>

                  {/* Timeline */}
                  <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {state.results.map((r, i) => {
                        const src = r.thumbnailUrl ? r.thumbnailUrl.replace('layer=TRUE-COLOR-S2L2A', `layer=${layerName}`).replace('width=256', 'width=350').replace('height=256', 'height=350') : ''
                        return (
                          <div key={r.imageId + i} onClick={() => setState(prev => ({ ...prev, activeIndex: i }))}
                            style={{ flexShrink: 0, width: 180, cursor: 'pointer', borderRadius: 10,
                              border: `2px solid ${i === state.activeIndex ? VERDE : 'transparent'}`,
                              overflow: 'hidden', background: '#1a2e1a', transition: 'all 0.15s' }}>
                            {src && <img src={src} alt={r.acquisitionDate} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} loading="lazy" />}
                            <div style={{ padding: '6px 8px' }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>
                                {new Date(r.acquisitionDate).toLocaleDateString(isPt ? 'pt-PT' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </div>
                              <div style={{ fontSize: 10, color: '#aaa' }}>{r.cloudCoverage.toFixed(1)}% {isPt ? 'nuvens' : 'clouds'}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Imagem principal GRANDE */}
                  {state.results[state.activeIndex] && (() => {
                    const active = state.results[state.activeIndex]
                    const bigSrc = active.thumbnailUrl ? active.thumbnailUrl.replace('layer=TRUE-COLOR-S2L2A', `layer=${layerName}`).replace('width=256', 'width=1200').replace('height=256', 'height=900') : ''
                    return (
                      <div style={{ marginTop: 12, borderRadius: 12, overflow: 'hidden', background: '#111', position: 'relative' }}>
                        {bigSrc && <img src={bigSrc} alt="Satellite" style={{ width: '100%', height: 'auto', minHeight: 400, display: 'block', objectFit: 'contain' }} />}
                        <div style={{ position: 'absolute', top: 10, left: 12, padding: '6px 12px', background: 'rgba(0,0,0,0.6)', borderRadius: 8, color: '#fff', fontSize: 12 }}>
                          {new Date(active.acquisitionDate).toLocaleDateString(isPt ? 'pt-PT' : 'en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                          {' · '}{active.cloudCoverage.toFixed(1)}% {isPt ? 'nuvens' : 'clouds'}
                          {' · '}{state.activeBand === 'TCI' ? (isPt ? 'Cor natural' : 'Natural') : state.activeBand}
                        </div>
                      </div>
                    )
                  })()}

                  {/* Bandas */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <span style={{ fontSize: 13, color: '#777', alignSelf: 'center' }}>{isPt ? 'Banda:' : 'Band:'}</span>
                    {BANDS.map(b => (
                      <button key={b.mode} onClick={() => setState(prev => ({ ...prev, activeBand: b.mode }))}
                        style={{ ...(state.activeBand === b.mode ? pillActive : pill), fontSize: 13 }}>
                        {b.icon} {isPt ? b.label : b.labelEn}
                      </button>
                    ))}
                  </div>

                  {/* Legenda de cores para NDVI e SWIR */}
                  <BandLegend band={state.activeBand} isPt={isPt} />

                  {/* Acções */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, flexWrap: 'wrap', gap: 8 }}>
                    <button onClick={handleNewSearch} style={{ ...pill, fontSize: 12, color: '#999' }}>
                      ↺ {isPt ? 'Nova pesquisa' : 'New search'}
                    </button>
                    <button onClick={() => setState(prev => ({
                      ...prev, isComparing: true,
                      compareLeftIndex: 0,
                      compareRightIndex: Math.min(prev.results.length - 1, Math.floor(prev.results.length / 2)),
                    }))}
                      style={{ ...pill, borderColor: VERDE, color: VERDE, fontWeight: 600, fontSize: 13 }}>
                      🔀 {isPt ? 'Comparar duas datas' : 'Compare two dates'}
                    </button>
                  </div>
                </div>
              )}

              {/* === RESULTADOS — MODO COMPARAÇÃO === */}
              {state.results.length > 0 && state.isComparing && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    {/* ANTES */}
                    <CompareColumn
                      label={isPt ? 'ANTES' : 'BEFORE'}
                      results={state.results}
                      selectedIndex={state.compareLeftIndex}
                      layerName={layerName}
                      isPt={isPt}
                      candidates={state.compareLeftCandidates}
                      candidatePos={state.compareLeftCandPos}
                      onSelectDate={(dateStr) => {
                        const candidates = findClosestImages(dateStr)
                        setState(prev => ({ ...prev, compareLeftIndex: candidates[0], compareLeftCandidates: candidates, compareLeftCandPos: 0 }))
                      }}
                      onNextCandidate={() => {
                        const cands = state.compareLeftCandidates
                        if (cands.length === 0) return
                        const next = (state.compareLeftCandPos + 1) % cands.length
                        setState(prev => ({ ...prev, compareLeftIndex: cands[next], compareLeftCandPos: next }))
                      }}
                      onPrevCandidate={() => {
                        const cands = state.compareLeftCandidates
                        if (cands.length === 0) return
                        const prev2 = (state.compareLeftCandPos - 1 + cands.length) % cands.length
                        setState(prev => ({ ...prev, compareLeftIndex: cands[prev2], compareLeftCandPos: prev2 }))
                      }}
                    />
                    {/* DEPOIS */}
                    <CompareColumn
                      label={isPt ? 'DEPOIS' : 'AFTER'}
                      results={state.results}
                      selectedIndex={state.compareRightIndex}
                      layerName={layerName}
                      isPt={isPt}
                      candidates={state.compareRightCandidates}
                      candidatePos={state.compareRightCandPos}
                      onSelectDate={(dateStr) => {
                        const candidates = findClosestImages(dateStr)
                        setState(prev => ({ ...prev, compareRightIndex: candidates[0], compareRightCandidates: candidates, compareRightCandPos: 0 }))
                      }}
                      onNextCandidate={() => {
                        const cands = state.compareRightCandidates
                        if (cands.length === 0) return
                        const next = (state.compareRightCandPos + 1) % cands.length
                        setState(prev => ({ ...prev, compareRightIndex: cands[next], compareRightCandPos: next }))
                      }}
                      onPrevCandidate={() => {
                        const cands = state.compareRightCandidates
                        if (cands.length === 0) return
                        const prev2 = (state.compareRightCandPos - 1 + cands.length) % cands.length
                        setState(prev => ({ ...prev, compareRightIndex: cands[prev2], compareRightCandPos: prev2 }))
                      }}
                    />
                  </div>

                  {/* Bandas na comparação */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'center' }}>
                    {BANDS.map(b => (
                      <button key={b.mode} onClick={() => setState(prev => ({ ...prev, activeBand: b.mode }))}
                        style={{ ...(state.activeBand === b.mode ? pillActive : pill), fontSize: 12 }}>
                        {b.icon} {isPt ? b.label : b.labelEn}
                      </button>
                    ))}
                  </div>

                  {/* Legenda de cores para NDVI e SWIR */}
                  <BandLegend band={state.activeBand} isPt={isPt} />

                  <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 12 }}>
                    <button onClick={() => setState(prev => ({ ...prev, isComparing: false }))}
                      style={{ ...pill, fontSize: 12, color: '#777' }}>
                      ← {isPt ? 'Voltar à vista individual' : 'Back to single view'}
                    </button>
                    <button onClick={handleNewSearch} style={{ ...pill, fontSize: 12, color: '#999' }}>
                      ↺ {isPt ? 'Nova pesquisa' : 'New search'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


// =============================================================
// COMPONENTE: Legenda de cores para bandas NDVI e SWIR
// =============================================================

function BandLegend({ band, isPt }: { band: BandMode; isPt: boolean }) {
  if (band === 'TCI') return null

  const legends: Record<string, { colors: string[]; labels: string[]; labelsEn: string[]; title: string; titleEn: string }> = {
    NDVI: {
      title: 'Índice de Vegetação (NDVI)',
      titleEn: 'Vegetation Index (NDVI)',
      colors: ['#801A1A', '#E6CC66', '#B3E64D', '#4DCC33', '#1A801A'],
      labels: ['Sem vegetação / solo nu / água', 'Vegetação escassa / seco', 'Vegetação moderada', 'Vegetação densa / saudável', 'Vegetação muito densa / floresta'],
      labelsEn: ['No vegetation / bare soil / water', 'Sparse vegetation / dry', 'Moderate vegetation', 'Dense / healthy vegetation', 'Very dense vegetation / forest'],
    },
    SWIR: {
      title: 'Infravermelho de Onda Curta (SWIR)',
      titleEn: 'Short-Wave Infrared (SWIR)',
      colors: ['#1A3366', '#3366CC', '#66CC66', '#CC9933', '#CC3333'],
      labels: ['Água / zonas húmidas', 'Solo húmido', 'Vegetação com humidade', 'Solo seco / urbano', 'Solo muito seco / rocha'],
      labelsEn: ['Water / wetlands', 'Moist soil', 'Vegetation with moisture', 'Dry soil / urban', 'Very dry soil / rock'],
    },
  }

  const leg = legends[band]
  if (!leg) return null

  return (
    <div style={{ marginTop: 12, padding: '14px 18px', background: '#f8f8f6', borderRadius: 12, border: '1px solid #eee' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 10 }}>
        🎨 {isPt ? leg.title : leg.titleEn}
      </div>
      {/* Barra de gradiente */}
      <div style={{ display: 'flex', height: 16, borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
        {leg.colors.map((c, i) => (
          <div key={i} style={{ flex: 1, background: c }} />
        ))}
      </div>
      {/* Labels */}
      <div style={{ display: 'flex', gap: 4 }}>
        {leg.colors.map((c, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: c, border: '1px solid rgba(0,0,0,0.1)', marginBottom: 4 }} />
            <span style={{ fontSize: 9, color: '#777', textAlign: 'center', lineHeight: 1.2 }}>
              {isPt ? leg.labels[i] : leg.labelsEn[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// =============================================================
// COMPONENTE: Coluna de comparação com date picker
// =============================================================

function CompareColumn({ label, results, selectedIndex, layerName, isPt, onSelectDate, candidates, candidatePos, onNextCandidate, onPrevCandidate }: {
  label: string
  results: SatelliteImageResult[]
  selectedIndex: number
  layerName: string
  isPt: boolean
  onSelectDate: (dateStr: string) => void
  candidates?: number[]
  candidatePos?: number
  onNextCandidate?: () => void
  onPrevCandidate?: () => void
}) {
  const r = results[selectedIndex]
  const src = r?.thumbnailUrl
    ? r.thumbnailUrl.replace('layer=TRUE-COLOR-S2L2A', `layer=${layerName}`).replace('width=256', 'width=900').replace('height=256', 'height=700')
    : ''

  // Datas min/max: usar todo o intervalo Sentinel-2 para permitir escolha livre
  const minDate = '2015-06-23'
  const maxDate = new Date().toISOString().split('T')[0]
  const selectedDate = r ? r.acquisitionDate.split('T')[0] : ''

  return (
    <div style={{ flex: 1, minWidth: 300 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#4A9E7F', marginBottom: 8, textAlign: 'center', letterSpacing: '0.08em' }}>
        {label}
      </div>

      {/* Date picker */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
        <label style={{ fontSize: 12, color: '#777' }}>{isPt ? 'Data:' : 'Date:'}</label>
        <input type="date"
          value={selectedDate}
          min={minDate}
          max={maxDate}
          onChange={e => onSelectDate(e.target.value)}
          style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13, fontFamily: 'inherit' }}
        />
      </div>

      {/* Info da imagem seleccionada + navegação entre candidatos */}
      {r && (
        <div>
          <div style={{ fontSize: 11, color: '#777', marginBottom: 4, textAlign: 'center' }}>
            {new Date(r.acquisitionDate).toLocaleDateString(isPt ? 'pt-PT' : 'en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
            {' · '}{r.cloudCoverage.toFixed(1)}% {isPt ? 'nuvens' : 'clouds'}
          </div>
          {candidates && candidates.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <button onClick={onPrevCandidate}
                style={{ padding: '4px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12 }}>
                ← {isPt ? 'anterior' : 'prev'}
              </button>
              <span style={{ fontSize: 10, color: '#999' }}>
                {(candidatePos ?? 0) + 1} / {candidates.length} {isPt ? 'candidatos' : 'candidates'}
              </span>
              <button onClick={onNextCandidate}
                style={{ padding: '4px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12 }}>
                {isPt ? 'seguinte' : 'next'} →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Imagem grande */}
      {src && (
        <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #eee' }}>
          <img src={src} alt={label} style={{ width: '100%', display: 'block' }} />
        </div>
      )}
    </div>
  )
}

// =============================================================
// COMPONENTE: Cabeçalho de passo (com botão editar)
// =============================================================

function StepHeader({ num, title, subtitle, active, done, onEdit }: {
  num: number; title: string; subtitle: string; active: boolean; done: boolean; onEdit?: () => void
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: done ? '#4A9E7F' : active ? '#4A9E7F' : '#e8e6de',
        color: done || active ? '#fff' : '#999',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 700, flexShrink: 0,
      }}>
        {done ? '✓' : num}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: active ? '#222' : '#999' }}>{title}</div>
        <div style={{ fontSize: 13, color: '#aaa', marginTop: 1 }}>{subtitle}</div>
      </div>
      {onEdit && (
        <button onClick={onEdit}
          style={{ padding: '4px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fff',
            fontSize: 11, color: '#999', cursor: 'pointer', fontFamily: 'inherit' }}>
          ✏️
        </button>
      )}
    </div>
  )
}
