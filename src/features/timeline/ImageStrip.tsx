/**
 * Componente ImageStrip — Timeline cronológica de imagens
 * Explorador Temporal de Imagens de Satélite
 *
 * Autor: Krassimire Iankov Djimov — 2301201
 * Universidade Aberta — Projeto de Engenharia Informática 2025/26
 *
 * Implementa RF7: resultados ordenados cronologicamente.
 * Implementa RF8: seleccionar resultado da timeline.
 * Implementa RF9: apresentar imagem correspondente.
 * Implementa RF10: alternância entre composições de bandas.
 */

'use client'

import { useCallback } from 'react'
import type { SatelliteImageResult, BandMode, Locale } from '@/types'
import { getTranslations } from '@/lib/i18n'

interface ImageStripProps {
  results: SatelliteImageResult[]
  activeIndex: number
  onSelect: (index: number) => void
  activeBand: BandMode
  onBandChange: (band: BandMode) => void
  locale: Locale
}

export default function ImageStrip({ results, activeIndex, onSelect, activeBand, onBandChange, locale }: ImageStripProps) {
  const t = getTranslations(locale)

  /** Formata a data de aquisição para apresentação na timeline */
  const formatDate = useCallback((isoDate: string): string => {
    try {
      return new Date(isoDate).toLocaleDateString(locale === 'pt' ? 'pt-PT' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    } catch { return isoDate.slice(0, 10) }
  }, [locale])

  const bands: { key: BandMode; label: string }[] = [
    { key: 'TCI',  label: t.bandNatural    },
    { key: 'NDVI', label: t.bandVegetation },
    { key: 'SWIR', label: t.bandMoisture   },
  ]

  return (
    <div>
      <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
        {t.scrollMessage(results.length)}
      </p>

      {/* Faixa horizontal de miniaturas (scroll) */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '12px' }}>
        {results.map((result, i) => (
          <div key={result.imageId} onClick={() => onSelect(i)} style={{
            flexShrink: 0, width: '110px', cursor: 'pointer', borderRadius: '8px', overflow: 'hidden',
            border: i === activeIndex ? '2px solid #1D9E75' : '1px solid #e8e8e8', transition: 'border-color 0.15s',
          }}>
            {result.thumbnailUrl ? (
              <img src={result.thumbnailUrl} alt={formatDate(result.acquisitionDate)}
                style={{ width: '110px', height: '74px', objectFit: 'cover', display: 'block' }} loading="lazy" />
            ) : (
              <div style={{ width: '110px', height: '74px', background: '#1a3a2a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '20px' }}>🛰</span>
              </div>
            )}
            <div style={{ padding: '5px 7px 2px', fontSize: '11px', fontWeight: 500 }}>{formatDate(result.acquisitionDate)}</div>
            <div style={{ padding: '0 7px 6px', fontSize: '10px', color: '#888' }}>{t.cloudLabel(result.cloudCoverage)}</div>
          </div>
        ))}
      </div>

      {/* Selector de banda espetral (RF10) */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: '#888', marginRight: '4px' }}>
          {locale === 'pt' ? 'Banda:' : 'Band:'}
        </span>
        {bands.map(({ key, label }) => (
          <button key={key} onClick={() => onBandChange(key)} style={{
            fontSize: '11px', padding: '3px 10px', borderRadius: '99px', cursor: 'pointer', transition: 'all 0.15s',
            border: '1px solid', borderColor: activeBand === key ? '#1D9E75' : '#e8e8e8',
            background: activeBand === key ? '#1D9E75' : '#fff',
            color: activeBand === key ? '#fff' : '#888',
          }}>{label}</button>
        ))}
      </div>
    </div>
  )
}
