/**
 * Sistema de internacionalização (i18n) — PT / EN
 * Explorador Temporal de Imagens de Satélite
 *
 * Autor: Krassimire Iankov Djimov — 2301201
 * Universidade Aberta — Projeto de Engenharia Informática 2025/26
 *
 * Toggle PT/EN visível no canto superior direito do cabeçalho.
 * Para adicionar um novo idioma: criar novo bloco com as mesmas chaves.
 */

import type { Locale } from '@/types'

const translations = {
  pt: {
    appTitle: 'Explorador Temporal · Sentinel-2',
    appSubtitle: 'Krassimire Djimov · 2301201 · Universidade Aberta',
    step1Title: 'Escolhe um lugar na Terra',
    step1Hint: 'Seleciona um lugar popular ou pesquisa pelo nome e desenha a tua região no mapa',
    step2Title: 'Escolhe um período de tempo',
    step2Hint: 'Quando queres explorar?',
    step3Title: 'Quão claras devem ser as imagens?',
    step3Hint: 'As nuvens podem bloquear a vista',
    step4Title: 'Explora as imagens',
    step4Hint: 'Vê e compara as imagens de satélite',
    modeQuickLabel: 'Lugares populares',
    modeMapLabel: 'Desenhar no mapa',
    searchPlaceholder: 'Ex: Sintra, Berlim, Rio de Janeiro...',
    searchButtonLabel: 'Procurar',
    mapDrawHint: 'Pesquisa um lugar acima ou clica e arrasta para desenhar a tua região',
    coordSW: 'Sudoeste', coordNE: 'Nordeste', coordArea: 'Área aprox.',
    drawAgain: 'Desenhar novamente',
    confirmRegion: 'Confirmar esta região',
    regionConfirmed: 'Região confirmada',
    p1Name: 'Lisboa',       p1Desc: 'Portugal · litoral',
    p2Name: 'Amazónia',     p2Desc: 'Brasil · desflorestação',
    p3Name: 'Mar de Aral',  p3Desc: 'Ásia Central · diminuição',
    p4Name: 'Alpes Suíços', p4Desc: 'Europa · glaciares',
    p5Name: 'Delta do Nilo',p5Desc: 'Egito · agricultura',
    p6Name: 'Dubai',        p6Desc: 'EAU · crescimento urbano',
    cloudOptionNone: 'Quase sem nuvens',
    cloudOptionSome: 'Algumas nuvens OK',
    cloudOptionAll: 'Mostrar tudo',
    cloudExplainNone: 'Verás menos imagens mas cada uma será cristalina. Ideal para comparar alterações.',
    cloudExplainSome: 'Um bom equilíbrio — mais resultados mantendo as imagens maioritariamente limpas.',
    cloudExplainAll: 'Verás todas as imagens disponíveis, mesmo que as nuvens tapem parte da vista.',
    searchButton: 'Ver imagens de satélite',
    loadingMessage: 'A consultar o arquivo Copernicus...',
    noResults: (place: string, cloud: number) => `Sem imagens com ≤${cloud}% de nuvens para ${place}. Tenta aumentar o filtro.`,
    foundMessage: (n: number, place: string) => `${n} imagens encontradas para ${place} — clica em qualquer uma para ver.`,
    scrollMessage: (n: number) => `Desliza para ver todas as ${n} imagens`,
    cloudLabel: (n: number) => `${n}% nuvens`,
    yearSelected: (y: string) => `Período selecionado: ${y}. Continua para o passo seguinte!`,
    placeSelected: (name: string) => `Lugar selecionado: ${name}. Avança para o passo seguinte!`,
    navigatingTo: (name: string) => `A navegar para ${name}... Clica e arrasta para desenhar a tua região.`,
    noGeoResults: 'Nenhum lugar encontrado. Tenta outro nome.',
    regionOk: (sw: string, ne: string) => `Região confirmada! ${sw} → ${ne}. Avança para o passo seguinte.`,
    bandNatural: 'Natural', bandVegetation: 'Vegetação', bandMoisture: 'Humidade',
    compareDatesButton: 'Comparar duas datas',
    compareTitle: 'Escolhe um "Antes" e um "Depois"',
    compareSubtitle: 'Seleciona uma imagem em cada coluna para as comparar lado a lado.',
    beforeLabel: 'Antes', afterLabel: 'Depois',
    notChosenYet: 'ainda não escolhido',
    spotDifference: (a: string, b: string) => `A comparar ${a} → ${b}. Notas alguma diferença na vegetação ou uso do solo?`,
    chooseTip: 'Escolhe uma imagem "Antes" e uma "Depois" para as ver lado a lado.',
    fullCompareButton: 'Ver comparação completa',
    closeLabel: 'Fechar',
    errorApiUnavailable: 'O serviço Copernicus está temporariamente indisponível. Tenta novamente mais tarde.',
    errorInvalidParams: 'Parâmetros inválidos. Verifica a região e o intervalo temporal.',
    errorNoImages: 'Nenhuma imagem encontrada para os critérios seleccionados.',
    errorImageLoad: 'Não foi possível carregar esta imagem. Tenta seleccionar outra.',
  },
  en: {
    appTitle: 'Temporal Explorer · Sentinel-2',
    appSubtitle: 'Krassimire Djimov · 2301201 · Universidade Aberta',
    step1Title: 'Pick a place on Earth',
    step1Hint: 'Choose a popular location or search by name and draw your region on the map',
    step2Title: 'Choose a time period',
    step2Hint: 'When do you want to explore?',
    step3Title: 'How clear should the images be?',
    step3Hint: 'Clouds can block the view',
    step4Title: 'Explore the images',
    step4Hint: 'View and compare satellite images',
    modeQuickLabel: 'Popular places',
    modeMapLabel: 'Draw on map',
    searchPlaceholder: 'E.g. Sintra, Berlin, Rio de Janeiro...',
    searchButtonLabel: 'Search',
    mapDrawHint: 'Search for a place above, or click and drag to draw your region',
    coordSW: 'South-West', coordNE: 'North-East', coordArea: 'Approx. area',
    drawAgain: 'Draw again',
    confirmRegion: 'Confirm this region',
    regionConfirmed: 'Region confirmed',
    p1Name: 'Lisbon',       p1Desc: 'Portugal · coastline',
    p2Name: 'Amazon',       p2Desc: 'Brazil · deforestation',
    p3Name: 'Aral Sea',     p3Desc: 'Central Asia · shrinking',
    p4Name: 'Swiss Alps',   p4Desc: 'Europe · glaciers',
    p5Name: 'Nile Delta',   p5Desc: 'Egypt · agriculture',
    p6Name: 'Dubai',        p6Desc: 'UAE · urban growth',
    cloudOptionNone: 'Almost no clouds',
    cloudOptionSome: 'A few clouds OK',
    cloudOptionAll: 'Show everything',
    cloudExplainNone: "You'll see fewer images but each one will be crystal clear. Best for comparing changes.",
    cloudExplainSome: 'A nice balance — more results while keeping images mostly clear.',
    cloudExplainAll: "You'll see every available image, even if clouds partially block the view.",
    searchButton: 'Show satellite images',
    loadingMessage: 'Querying the Copernicus archive...',
    noResults: (place: string, cloud: number) => `No images with ≤${cloud}% cloud cover for ${place}. Try increasing the cloud filter.`,
    foundMessage: (n: number, place: string) => `${n} images found for ${place} — click any to view it.`,
    scrollMessage: (n: number) => `Scroll to browse all ${n} images`,
    cloudLabel: (n: number) => `${n}% cloud`,
    yearSelected: (y: string) => `Period selected: ${y}. Continue to the next step!`,
    placeSelected: (name: string) => `Place selected: ${name}. Continue to the next step!`,
    navigatingTo: (name: string) => `Navigating to ${name}... Click and drag to draw your region.`,
    noGeoResults: 'No place found. Try a different name.',
    regionOk: (sw: string, ne: string) => `Region confirmed! ${sw} → ${ne}. Continue to the next step.`,
    bandNatural: 'Natural', bandVegetation: 'Vegetation', bandMoisture: 'Moisture',
    compareDatesButton: 'Compare two dates',
    compareTitle: 'Pick a "Before" and an "After"',
    compareSubtitle: 'Select one image in each column to compare them side by side.',
    beforeLabel: 'Before', afterLabel: 'After',
    notChosenYet: 'not chosen yet',
    spotDifference: (a: string, b: string) => `Comparing ${a} → ${b}. Can you spot any differences in vegetation or land use?`,
    chooseTip: 'Choose a "Before" and "After" image to see them side by side.',
    fullCompareButton: 'See full comparison view',
    closeLabel: 'Close',
    errorApiUnavailable: 'The Copernicus service is temporarily unavailable. Please try again later.',
    errorInvalidParams: 'Invalid parameters. Please check the region and time range.',
    errorNoImages: 'No images found for the selected criteria.',
    errorImageLoad: 'Could not load this image. Try selecting another one.',
  },
} as const

export type Translations = typeof translations.pt

/**
 * Devolve o dicionário de traduções para o idioma pedido.
 * Fallback para Português se o idioma não for reconhecido.
 */
export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? translations.pt
}

export { translations }
