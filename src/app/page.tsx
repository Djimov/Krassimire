/**
 * Página principal da aplicação — fluxo guiado em 4 passos
 * Explorador Temporal de Imagens de Satélite
 *
 * Autor: Krassimire Iankov Djimov — 2301201
 * Universidade Aberta — Projeto de Engenharia Informática 2025/26
 *
 * ARQUITECTURA DESTA PÁGINA:
 * Esta página implementa o fluxo principal da aplicação em 4 passos sequenciais:
 *   1. Selecção do lugar (MapSelector — componente Leaflet + topónimo)
 *   2. Escolha do período temporal (pílulas de anos)
 *   3. Nível de cobertura de nuvens (3 opções em linguagem simples)
 *   4. Resultados, visualização e comparação temporal
 *
 * PADRÃO DE ESTADO:
 * O estado global da página é gerido com useState do React.
 * Não é usada nenhuma biblioteca de gestão de estado externa (ex: Redux, Zustand)
 * porque o âmbito do MVP não justifica essa complexidade (ADR-003).
 *
 * COMPONENTES EXTERNOS:
 * O MapSelector é importado com dynamic() e ssr:false porque o Leaflet
 * assume a existência do objecto window e não pode ser renderizado no servidor.
 * Os outros componentes (ImageStrip, ComparePanel) são importados normalmente.
 *
 * CHAMADAS À API:
 * A pesquisa de imagens chama /api/search (rota interna Next.js).
 * A geocodificação chama /api/geocode (rota interna Next.js).
 * Nenhum serviço externo é chamado directamente desta página (ADR-002).
 */

'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { Region, SearchParams, SatelliteImageResult, BandMode, Locale } from '@/types'
import { getTranslations } from '@/lib/i18n'
import ImageStrip from '@/features/timeline/ImageStrip'
import ComparePanel from '@/features/compare/ComparePanel'

/*
 * Importação dinâmica do MapSelector com SSR desactivado.
 * O Leaflet usa window, document e navigator — objectos que não existem
 * no servidor Node.js durante o Server-Side Rendering do Next.js.
 * Com ssr: false, o componente só é carregado no browser do utilizador.
 */
const MapSelector = dynamic(
  () => import('@/components/map/MapSelector'),
  {
    ssr: false,
    loading: () => (
      <div style={{ height: '350px', background: '#f0f0f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#888', fontSize: '13px' }}>A carregar o mapa...</span>
      </div>
    )
  }
)

// =============================================================
// TIPOS DE ESTADO DA PÁGINA
// =============================================================

/** Qual dos 4 passos está activo no fluxo guiado */
type Step = 1 | 2 | 3 | 4

/** Estado completo da página principal */
interface PageState {
  locale: Locale           // idioma activo: 'pt' ou 'en'
  currentStep: Step        // passo activo no fluxo
  region: Region | null    // bounding box seleccionada no mapa
  placeName: string        // nome do lugar (para resumos e mensagens)
  year: string | null      // período temporal (ex: '2023–2024')
  maxCloud: number         // cobertura máxima de nuvens (0–100)
  results: SatelliteImageResult[]  // imagens devolvidas pela API
  activeIndex: number      // índice da imagem seleccionada na timeline
  activeBand: BandMode     // composição de bandas activa
  isSearching: boolean     // true enquanto a pesquisa está em curso
  error: string | null     // mensagem de erro, se existir
}

/** Estado inicial — aplicação recém aberta, nenhuma escolha feita */
const INITIAL_STATE: PageState = {
  locale: 'pt',
  currentStep: 1,
  region: null,
  placeName: '',
  year: null,
  maxCloud: 10,
  results: [],
  activeIndex: 0,
  activeBand: 'TCI',
  isSearching: false,
  error: null,
}

// =============================================================
// COMPONENTE PRINCIPAL
// =============================================================

export default function HomePage() {
  const [state, setState] = useState<PageState>(INITIAL_STATE)

  // Obtém as traduções para o idioma activo
  const t = getTranslations(state.locale)

  // --- Handlers de navegação entre passos ---

  /** Alterna entre Português e Inglês */
  const setLocale = useCallback((locale: Locale) => {
    setState(prev => ({ ...prev, locale }))
  }, [])

  /**
   * Chamado pelo MapSelector quando o utilizador confirma a região.
   * Guarda as coordenadas e o nome do lugar, e avança para o passo 2.
   */
  const handleRegionConfirmed = useCallback((region: Region, placeName: string) => {
    setState(prev => ({ ...prev, region, placeName, currentStep: 2 }))
  }, [])

  /**
   * Chamado quando o utilizador selecciona um período temporal.
   * Avança para o passo 3.
   */
  const handleYearSelected = useCallback((year: string) => {
    setState(prev => ({ ...prev, year, currentStep: 3 }))
  }, [])

  /**
   * Chamado quando o utilizador escolhe o nível de nuvens.
   * Avança para o passo 4.
   */
  const handleCloudSelected = useCallback((maxCloud: number) => {
    setState(prev => ({ ...prev, maxCloud, currentStep: 4 }))
  }, [])

  /**
   * Lança a pesquisa de imagens via rota interna /api/search.
   *
   * Constrói os SearchParams a partir do estado actual e envia
   * um pedido POST. Nunca chama o Copernicus directamente (ADR-002).
   */
  const handleSearch = useCallback(async () => {
    if (!state.region || !state.year) return

    // Converte o período "YYYY–YYYY" em datas de início e fim
    const startYear = parseInt(state.year.split('–')[0])
    const params: SearchParams = {
      region: state.region,
      startDate: `${startYear}-01-01`,
      endDate: `${startYear + 1}-12-31`,
      maxCloudCoverage: state.maxCloud,
      selectedBandMode: state.activeBand,
    }

    // Activa o indicador de carregamento e limpa erros anteriores
    setState(prev => ({ ...prev, isSearching: true, error: null, results: [] }))

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? t.errorApiUnavailable)
      }

      setState(prev => ({
        ...prev,
        results: data.results,
        activeIndex: 0,
        isSearching: false,
      }))
    } catch (err) {
      // Tratamento robusto de erros — RF13, RNF4
      setState(prev => ({
        ...prev,
        isSearching: false,
        error: err instanceof Error ? err.message : t.errorApiUnavailable,
      }))
    }
  }, [state.region, state.year, state.maxCloud, state.activeBand, t])

  // Períodos temporais disponíveis
  const YEARS = ['2019–2020', '2020–2021', '2021–2022', '2022–2023', '2023–2024', '2024–2025']

  // Opções de cobertura de nuvens com valores e chaves de tradução
  const CLOUD_OPTIONS = [
    { label: t.cloudOptionNone, value: 10  },
    { label: t.cloudOptionSome, value: 30  },
    { label: t.cloudOptionAll,  value: 100 },
  ]

  // =============================================================
  // RENDERIZAÇÃO
  // =============================================================

  return (
    <div className="app-container">

      {/* --- Cabeçalho com toggle PT/EN --- */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 1.25rem', background: '#fff', borderRadius: '12px',
        border: '1px solid #e8e8e8', marginBottom: '12px',
      }}>
        <div>
          <h1 style={{ fontSize: '15px', fontWeight: 500 }}>
            Explorador <span style={{ color: '#1D9E75' }}>Temporal</span> · Sentinel-2
          </h1>
          <p style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
            {t.appSubtitle}
          </p>
        </div>

        {/* Toggle de internacionalização — sempre visível no cabeçalho */}
        <div style={{ display: 'flex', border: '1px solid #e8e8e8', borderRadius: '99px', overflow: 'hidden' }}>
          {(['pt', 'en'] as Locale[]).map(loc => (
            <button
              key={loc}
              onClick={() => setLocale(loc)}
              style={{
                padding: '4px 12px', fontSize: '12px', fontWeight: 500,
                border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                background: state.locale === loc ? '#1D9E75' : 'transparent',
                color: state.locale === loc ? '#fff' : '#888',
              }}
            >
              {loc.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {/* --- Passo 1: Selecção do lugar --- */}
      <StepShell number={1} title={t.step1Title}
        hint={state.region ? state.placeName : t.step1Hint}
        isDone={!!state.region} isLocked={false}
        isOpen={state.currentStep === 1}
        onToggle={() => setState(prev => ({ ...prev, currentStep: 1 }))}>

        {/* MapSelector carregado dinamicamente com ssr:false */}
        <MapSelector
          onConfirm={handleRegionConfirmed}
          locale={state.locale}
        />
      </StepShell>

      {/* --- Passo 2: Período temporal --- */}
      <StepShell number={2} title={t.step2Title}
        hint={state.year ?? t.step2Hint}
        isDone={!!state.year} isLocked={!state.region}
        isOpen={state.currentStep === 2}
        onToggle={() => state.region && setState(prev => ({ ...prev, currentStep: 2 }))}>

        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '8px' }}>
          {YEARS.map(y => (
            <button key={y} onClick={() => handleYearSelected(y)} style={{
              padding: '6px 13px', borderRadius: '99px', fontSize: '12px', cursor: 'pointer',
              border: '1px solid', transition: 'all 0.15s',
              borderColor: state.year === y ? '#1D9E75' : '#e8e8e8',
              background: state.year === y ? '#1D9E75' : '#fff',
              color: state.year === y ? '#fff' : '#888',
            }}>
              {y}
            </button>
          ))}
        </div>
        <p style={{ fontSize: '11px', color: '#888' }}>
          {state.locale === 'pt' ? 'Dados disponíveis desde Junho de 2015.' : 'Data available from June 2015.'}
        </p>
      </StepShell>

      {/* --- Passo 3: Cobertura de nuvens --- */}
      <StepShell number={3} title={t.step3Title}
        hint={t.step3Hint} isDone={state.currentStep > 3}
        isLocked={!state.year} isOpen={state.currentStep === 3}
        onToggle={() => state.year && setState(prev => ({ ...prev, currentStep: 3 }))}>

        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '8px' }}>
          {CLOUD_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => handleCloudSelected(opt.value)} style={{
              padding: '6px 13px', borderRadius: '99px', fontSize: '12px', cursor: 'pointer',
              border: '1px solid', transition: 'all 0.15s',
              borderColor: state.maxCloud === opt.value ? '#1D9E75' : '#e8e8e8',
              background: state.maxCloud === opt.value ? '#1D9E75' : '#fff',
              color: state.maxCloud === opt.value ? '#fff' : '#888',
            }}>
              {opt.label}
            </button>
          ))}
        </div>
      </StepShell>

      {/* --- Passo 4: Resultados, visualização e comparação --- */}
      <StepShell number={4} title={t.step4Title}
        hint={t.step4Hint} isDone={false}
        isLocked={state.currentStep < 4} isOpen={state.currentStep === 4}
        onToggle={() => {}}>

        {/* Resumo das escolhas feitas nos passos anteriores */}
        {state.region && (
          <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {[state.placeName, state.year, `≤${state.maxCloud}% nuvens`].filter(Boolean).map(label => (
              <span key={label} style={{
                fontSize: '11px', padding: '3px 10px', borderRadius: '99px',
                background: '#f5f5f5', border: '1px solid #e8e8e8', color: '#888',
              }}>{label}</span>
            ))}
          </div>
        )}

        {/* Botão de pesquisa */}
        <button
          onClick={handleSearch}
          disabled={state.isSearching || !state.region || !state.year}
          style={{
            width: '100%', padding: '11px', fontSize: '13px', fontWeight: 500,
            background: state.isSearching ? '#9FE1CB' : '#1D9E75',
            color: '#fff', border: 'none', borderRadius: '8px',
            cursor: state.isSearching ? 'default' : 'pointer',
            marginBottom: '12px', transition: 'background 0.15s',
          }}
        >
          {state.isSearching ? (state.locale === 'pt' ? 'A pesquisar...' : 'Searching...') : t.searchButton}
        </button>

        {/* Mensagem de erro — RF13 */}
        {state.error && (
          <div style={{
            fontSize: '12px', color: '#993C1D', background: '#FAECE7',
            padding: '8px 12px', borderRadius: '8px', marginBottom: '12px',
          }}>
            {state.error}
          </div>
        )}

        {/* Resultados — timeline e comparação */}
        {state.results.length > 0 && (
          <>
            {/* Faixa de miniaturas e selector de bandas (RF7-RF10) */}
            <ImageStrip
              results={state.results}
              activeIndex={state.activeIndex}
              onSelect={i => setState(prev => ({ ...prev, activeIndex: i }))}
              activeBand={state.activeBand}
              onBandChange={band => setState(prev => ({ ...prev, activeBand: band }))}
              locale={state.locale}
            />

            {/* Painel de comparação temporal (RF11-RF12) */}
            <ComparePanel
              results={state.results}
              activeBand={state.activeBand}
              locale={state.locale}
            />
          </>
        )}

        {/* Estado sem resultados — RF13 */}
        {!state.isSearching && state.results.length === 0 && !state.error && state.currentStep === 4 && (
          <p style={{ fontSize: '12px', color: '#888', textAlign: 'center', padding: '16px 0' }}>
            {state.locale === 'pt'
              ? 'Clica "Ver imagens de satélite" para pesquisar.'
              : 'Click "Show satellite images" to search.'}
          </p>
        )}
      </StepShell>

    </div>
  )
}

// =============================================================
// COMPONENTE AUXILIAR: StepShell
// Envolve cada passo do fluxo guiado com o cabeçalho numerado.
// Passos bloqueados (isLocked) têm opacidade reduzida e não respondem a cliques.
// =============================================================

interface StepShellProps {
  number: number
  title: string
  hint: string
  isDone: boolean
  isLocked: boolean
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

function StepShell({ number, title, hint, isDone, isLocked, isOpen, onToggle, children }: StepShellProps) {
  return (
    <div style={{
      border: '1px solid #e8e8e8', borderRadius: '12px',
      background: '#fff', marginBottom: '10px', overflow: 'hidden',
      // Passos bloqueados ficam visualmente inactivos
      opacity: isLocked ? 0.45 : 1,
      transition: 'opacity 0.2s',
    }}>
      {/* Cabeçalho do passo — clicável para expandir/recolher */}
      <div
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          padding: '14px 18px',
          cursor: isLocked ? 'default' : 'pointer',
        }}
      >
        {/* Círculo numerado: verde se aberto ou concluído, cinzento se bloqueado */}
        <div style={{
          width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
          fontSize: '12px', fontWeight: 500,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isDone || isOpen ? '#1D9E75' : '#E1F5EE',
          color: isDone || isOpen ? '#fff' : '#085041',
          outline: isOpen && !isDone ? '3px solid #9FE1CB' : 'none',
        }}>
          {isDone ? '✓' : number}
        </div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 500 }}>{title}</div>
          <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{hint}</div>
        </div>
      </div>

      {/* Corpo do passo — visível apenas quando está aberto e não bloqueado */}
      {isOpen && !isLocked && (
        <div style={{ padding: '0 18px 18px' }}>
          {children}
        </div>
      )}
    </div>
  )
}
