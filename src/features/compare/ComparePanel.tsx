/**
 * Componente ComparePanel — Comparação temporal Antes/Depois
 * Explorador Temporal de Imagens de Satélite
 *
 * Autor: Krassimire Iankov Djimov — 2301201
 * Universidade Aberta — Projeto de Engenharia Informática 2025/26
 *
 * Implementa RF11: seleccionar duas imagens para comparação.
 * Implementa RF12: vista comparativa lado a lado.
 */

'use client'

import { useState, useCallback } from 'react'
import type { SatelliteImageResult, BandMode, Locale } from '@/types'
import { getTranslations } from '@/lib/i18n'

interface ComparePanelProps {
  results: SatelliteImageResult[]
  activeBand: BandMode
  locale: Locale
}

export default function ComparePanel({ results, activeBand, locale }: ComparePanelProps) {
  const t = getTranslations(locale)
  const [isOpen, setIsOpen] = useState(false)
  const [selA, setSelA] = useState<number | null>(null)
  const [selB, setSelB] = useState<number | null>(null)

  const formatDate = useCallback((isoDate: string) => {
    try { return new Date(isoDate).toLocaleDateString(locale === 'pt' ? 'pt-PT' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }
    catch { return isoDate.slice(0, 10) }
  }, [locale])

  const imageA = selA !== null ? results[selA] : null
  const imageB = selB !== null ? results[selB] : null

  return (
    <div style={{ marginTop: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => setIsOpen(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '12px', fontWeight: 500, background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="3" width="6" height="10" rx="1"/><rect x="9" y="3" width="6" height="10" rx="1"/>
          </svg>
          {t.compareDatesButton}
        </button>
      </div>

      {isOpen && (
        <div style={{ marginTop: '12px', border: '1px solid #e8e8e8', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>{t.compareTitle}</div>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{t.compareSubtitle}</div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ fontSize: '11px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>{t.closeLabel}</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#f0f0f0' }}>
            {(['a', 'b'] as const).map(side => {
              const sel = side === 'a' ? selA : selB
              const label = side === 'a' ? t.beforeLabel : t.afterLabel
              const badgeBg = side === 'a' ? '#E1F5EE' : '#E6F1FB'
              const badgeColor = side === 'a' ? '#085041' : '#0C447C'
              const dotColor = side === 'a' ? '#1D9E75' : '#378ADD'
              const selResult = sel !== null ? results[sel] : null
              return (
                <div key={side} style={{ background: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 10px', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ fontSize: '10px', fontWeight: 500, padding: '2px 8px', borderRadius: '99px', background: badgeBg, color: badgeColor }}>{label}</span>
                    <span style={{ fontSize: '11px', color: selResult ? '#1a1a1a' : '#bbb' }}>{selResult ? formatDate(selResult.acquisitionDate) : t.notChosenYet}</span>
                  </div>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {results.map((r, i) => (
                      <div key={r.imageId} onClick={() => side === 'a' ? setSelA(i) : setSelB(i)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', cursor: 'pointer', borderBottom: '1px solid #f8f8f8', background: sel === i ? (side === 'a' ? '#E1F5EE' : '#E6F1FB') : '#fff' }}>
                        {r.thumbnailUrl
                          ? <img src={r.thumbnailUrl} alt="" style={{ width: '42px', height: '28px', objectFit: 'cover', borderRadius: '3px', flexShrink: 0 }} />
                          : <div style={{ width: '42px', height: '28px', background: '#1a3a2a', borderRadius: '3px', flexShrink: 0 }} />}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '11px', fontWeight: 500 }}>{formatDate(r.acquisitionDate)}</div>
                          <div style={{ fontSize: '10px', color: '#888' }}>{r.cloudCoverage}%</div>
                        </div>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: sel === i ? dotColor : 'transparent', border: sel === i ? 'none' : '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#fff', fontWeight: 500 }}>
                          {sel === i ? side.toUpperCase() : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {imageA && imageB ? (
            <div style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: '11px', color: '#085041', background: '#E1F5EE', padding: '7px 11px', borderRadius: '8px', marginBottom: '12px' }}>
                {t.spotDifference(formatDate(imageA.acquisitionDate), formatDate(imageB.acquisitionDate))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[{ img: imageA, label: t.beforeLabel, color: '#1D9E75' }, { img: imageB, label: t.afterLabel, color: '#378ADD' }].map(({ img, label, color }) => (
                  <div key={label} style={{ border: '1px solid #e8e8e8', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                    {img.previewUrl
                      ? <img src={img.previewUrl} alt={label} style={{ width: '100%', height: '130px', objectFit: 'cover', display: 'block' }} />
                      : <div style={{ width: '100%', height: '130px', background: '#0a1a10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '28px' }}>🛰</span></div>}
                    <div style={{ position: 'absolute', top: '7px', left: '7px', fontSize: '9px', fontWeight: 500, padding: '2px 7px', borderRadius: '99px', background: color, color: '#fff' }}>{label}</div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px 8px', background: 'rgba(0,0,0,0.5)', fontSize: '10px', color: 'rgba(255,255,255,0.9)' }}>
                      {formatDate(img.acquisitionDate)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ padding: '12px 16px' }}>
              <div style={{ fontSize: '11px', color: '#085041', background: '#E1F5EE', padding: '7px 11px', borderRadius: '8px' }}>{t.chooseTip}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
