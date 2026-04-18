/**
 * Componente MapSelector — Mapa interactivo com pesquisa por topónimo
 * Explorador Temporal de Imagens de Satélite
 *
 * Autor: Krassimire Iankov Djimov — 2301201
 * Universidade Aberta — Projeto de Engenharia Informática 2025/26
 *
 * Implementa RF1: selecção de região no mapa (bounding box).
 * Implementa RF2: redefinir a região seleccionada.
 * Implementa RF1 Must Have (v2.1): pesquisa por topónimo via Nominatim.
 *
 * IMPORTANTE — importar com dynamic() e ssr:false porque o Leaflet
 * usa window e não funciona em SSR:
 *
 *   const MapSelector = dynamic(
 *     () => import('@/components/map/MapSelector'),
 *     { ssr: false }
 *   )
 */

'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { Region, GeocodingResult, Locale } from '@/types'
import { getTranslations } from '@/lib/i18n'

interface MapSelectorProps {
  onConfirm: (region: Region, placeName: string) => void
  locale: Locale
}

// Lugares populares pré-definidos com bounding boxes verificadas
const PRESETS = [
  { i: 1, lat: 38.72, lng: -9.14,  bbox: { minLat: 38.65, minLng: -9.25, maxLat: 38.80, maxLng: -9.05 } },
  { i: 2, lat: -3.47, lng: -62.21, bbox: { minLat: -4.00, minLng: -63.00, maxLat: -3.00, maxLng: -61.50 } },
  { i: 3, lat: 45.00, lng: 59.50,  bbox: { minLat: 43.50, minLng: 58.00, maxLat: 46.50, maxLng: 61.00 } },
  { i: 4, lat: 46.50, lng: 8.50,   bbox: { minLat: 46.00, minLng: 7.50,  maxLat: 47.00, maxLng: 9.50  } },
  { i: 5, lat: 31.00, lng: 31.00,  bbox: { minLat: 30.50, minLng: 30.00, maxLat: 31.50, maxLng: 32.00 } },
  { i: 6, lat: 25.20, lng: 55.27,  bbox: { minLat: 25.00, minLng: 55.00, maxLat: 25.40, maxLng: 55.50 } },
]
const PRESET_ICONS = ['🏙', '🌳', '🏜', '🏔', '🌾', '✨']

export default function MapSelector({ onConfirm, locale }: MapSelectorProps) {
  const t = getTranslations(locale)
  const [mode, setMode] = useState<'quick' | 'map'>('quick')
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [drawnRegion, setDrawnRegion] = useState<Region | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [placeName, setPlaceName] = useState('')
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Inicializa o mapa Leaflet quando o painel do mapa é aberto
  useEffect(() => {
    if (mode !== 'map' || !mapContainerRef.current || mapInstanceRef.current) return
    import('leaflet').then((L) => {
      // Correcção dos ícones do Leaflet com Next.js/Webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      })
      if (!mapContainerRef.current) return
      const map = L.map(mapContainerRef.current, { center: [20, 10], zoom: 2 })
      // Tile layer OpenStreetMap (gratuito, sem chave API)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map)
      mapInstanceRef.current = map

      // Desenho manual da bounding box com clique e arrasto
      let startLatLng: L.LatLng | null = null
      let currentRect: L.Rectangle | null = null
      map.on('mousedown', (e: L.LeafletMouseEvent) => {
        map.dragging.disable()
        startLatLng = e.latlng
      })
      map.on('mousemove', (e: L.LeafletMouseEvent) => {
        if (!startLatLng) return
        if (currentRect) map.removeLayer(currentRect)
        currentRect = L.rectangle([startLatLng, e.latlng], { color: '#1D9E75', weight: 2, fillOpacity: 0.12 }).addTo(map)
      })
      map.on('mouseup', (e: L.LeafletMouseEvent) => {
        map.dragging.enable()
        if (!startLatLng) return
        const bounds = L.latLngBounds(startLatLng, e.latlng)
        // Rejeita regiões demasiado pequenas (< ~1km)
        if (Math.abs(bounds.getNorth() - bounds.getSouth()) < 0.01 || Math.abs(bounds.getEast() - bounds.getWest()) < 0.01) {
          startLatLng = null
          return
        }
        setDrawnRegion({
          minLat: bounds.getSouth(), minLng: bounds.getWest(),
          maxLat: bounds.getNorth(), maxLng: bounds.getEast(),
          createdAt: new Date().toISOString(),
        })
        setConfirmed(false)
        startLatLng = null
      })
    })
    return () => {
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(mapInstanceRef.current as any).remove()
        mapInstanceRef.current = null
      }
    }
  }, [mode])

  // Pesquisa por topónimo com debounce de 400ms
  const handleQueryChange = useCallback((value: string) => {
    setQuery(value)
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    if (value.length < 2) { setSuggestions([]); setShowSuggestions(false); return }
    setIsSearching(true); setShowSuggestions(true)
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        // Chama a rota interna — nunca o Nominatim directamente (ADR-002)
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(value)}`)
        const data = await res.json()
        setSuggestions(res.ok ? (data.results ?? []) : [])
      } catch { setSuggestions([]) }
      finally { setIsSearching(false) }
    }, 400)
  }, [])

  // Voa para o lugar seleccionado no mapa
  const handleSuggestionSelect = useCallback(async (result: GeocodingResult) => {
    setQuery(result.name)
    setShowSuggestions(false)
    setPlaceName(`${result.name}${result.country ? ', ' + result.country : ''}`)
    const L = await import('leaflet')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map = mapInstanceRef.current as any
    if (map) map.flyTo([result.lat, result.lng], 8, { duration: 1.2 })
    if (result.boundingBox) {
      setDrawnRegion({ ...result.boundingBox, createdAt: new Date().toISOString() })
    }
  }, [])

  const handleConfirm = useCallback(() => {
    if (!drawnRegion) return
    setConfirmed(true)
    onConfirm(drawnRegion, placeName || 'Região personalizada')
  }, [drawnRegion, placeName, onConfirm])

  const handleReset = useCallback(() => {
    setDrawnRegion(null); setConfirmed(false); setPlaceName('')
  }, [])

  const handlePreset = useCallback((preset: typeof PRESETS[0]) => {
    const region: Region = { ...preset.bbox, createdAt: new Date().toISOString() }
    const name = String(t[`p${preset.i}Name` as keyof typeof t] ?? '')
    onConfirm(region, name)
  }, [t, onConfirm])

  return (
    <div>
      {/* Toggle Lugares populares / Desenhar no mapa */}
      <div style={{ display: 'flex', border: '1px solid #e8e8e8', borderRadius: '8px', overflow: 'hidden', marginBottom: '14px' }}>
        {(['quick', 'map'] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} style={{
            flex: 1, padding: '7px 0', fontSize: '12px', textAlign: 'center', cursor: 'pointer',
            border: 'none', background: mode === m ? '#fff' : '#f5f5f5',
            color: mode === m ? '#1a1a1a' : '#888', fontWeight: mode === m ? 500 : 400,
            borderRight: m === 'quick' ? '1px solid #e8e8e8' : 'none', transition: 'all 0.15s',
          }}>
            {m === 'quick' ? t.modeQuickLabel : t.modeMapLabel}
          </button>
        ))}
      </div>

      {/* Painel de lugares populares */}
      {mode === 'quick' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {PRESETS.map((preset, idx) => (
            <button key={preset.i} onClick={() => handlePreset(preset)} style={{
              border: '1px solid #e8e8e8', borderRadius: '8px', padding: '10px',
              cursor: 'pointer', background: '#fff', textAlign: 'left', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = '#1D9E75'; b.style.background = '#E1F5EE' }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = '#e8e8e8'; b.style.background = '#fff' }}>
              <div style={{ fontSize: '17px', marginBottom: '5px' }}>{PRESET_ICONS[idx]}</div>
              <div style={{ fontSize: '12px', fontWeight: 500 }}>{String(t[`p${preset.i}Name` as keyof typeof t])}</div>
              <div style={{ fontSize: '10px', color: '#888', marginTop: '1px' }}>{String(t[`p${preset.i}Desc` as keyof typeof t])}</div>
            </button>
          ))}
        </div>
      )}

      {/* Painel do mapa com pesquisa por topónimo */}
      {mode === 'map' && (
        <div>
          {/* Barra de pesquisa por topónimo (RF1 Must Have) */}
          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" value={query} onChange={e => handleQueryChange(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleQueryChange(query)}
                placeholder={t.searchPlaceholder}
                style={{ flex: 1, padding: '8px 12px', fontSize: '13px', border: '1px solid #e8e8e8', borderRadius: '8px', outline: 'none' }} />
              <button onClick={() => handleQueryChange(query)} style={{
                padding: '8px 14px', fontSize: '12px', fontWeight: 500,
                background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer',
              }}>{t.searchButtonLabel}</button>
            </div>
            {/* Dropdown de sugestões */}
            {showSuggestions && (
              <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', border: '1px solid #e8e8e8', borderRadius: '8px', zIndex: 1000, overflow: 'hidden' }}>
                {isSearching && <div style={{ padding: '10px 12px', fontSize: '12px', color: '#888' }}>A procurar...</div>}
                {!isSearching && suggestions.length === 0 && <div style={{ padding: '10px 12px', fontSize: '12px', color: '#888' }}>{t.noGeoResults}</div>}
                {suggestions.map((s, i) => (
                  <div key={i} onClick={() => handleSuggestionSelect(s)} style={{ display: 'flex', flexDirection: 'column', padding: '9px 12px', cursor: 'pointer', borderBottom: i < suggestions.length - 1 ? '1px solid #f0f0f0' : 'none' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#E1F5EE'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = '#fff'}>
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{s.name}</span>
                    <span style={{ fontSize: '11px', color: '#888' }}>{s.country}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Container do mapa Leaflet */}
          <div ref={mapContainerRef} style={{ width: '100%', height: '350px', borderRadius: '8px', border: '1px solid #e8e8e8', cursor: 'crosshair' }} />

          {!drawnRegion && <div style={{ fontSize: '11px', color: '#888', marginTop: '8px', textAlign: 'center' }}>{t.mapDrawHint}</div>}

          {/* Coordenadas e confirmação */}
          {drawnRegion && (
            <div style={{ marginTop: '10px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                {[
                  { label: t.coordSW, value: `${drawnRegion.minLat.toFixed(2)}°, ${drawnRegion.minLng.toFixed(2)}°` },
                  { label: t.coordNE, value: `${drawnRegion.maxLat.toFixed(2)}°, ${drawnRegion.maxLng.toFixed(2)}°` },
                  { label: t.coordArea, value: `~${Math.round(Math.abs(drawnRegion.maxLat - drawnRegion.minLat) * 111)} × ${Math.round(Math.abs(drawnRegion.maxLng - drawnRegion.minLng) * 85)} km` },
                ].map(({ label, value }) => (
                  <div key={label} style={{ flex: 1, background: '#f5f5f5', borderRadius: '8px', padding: '6px 10px' }}>
                    <div style={{ fontSize: '10px', color: '#888' }}>{label}</div>
                    <div style={{ fontSize: '11px', fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button onClick={handleReset} style={{ fontSize: '11px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>{t.drawAgain}</button>
                <button onClick={handleConfirm} style={{ flex: 1, padding: '9px', fontSize: '13px', fontWeight: 500, background: confirmed ? '#085041' : '#1D9E75', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  {confirmed ? `${t.regionConfirmed} ✓` : t.confirmRegion}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
