/**
 * Layout raiz da aplicação Next.js (App Router)
 * Explorador Temporal de Imagens de Satélite
 *
 * Autor: Krassimire Iankov Djimov — 2301201
 * Universidade Aberta — Projeto de Engenharia Informática 2025/26
 *
 * Este ficheiro define o layout base que envolve todas as páginas.
 * É renderizado uma vez e partilhado entre todas as rotas.
 *
 * Metadados SEO: título e descrição são usados pelo Next.js para
 * gerar as metatags HTML e melhorar a indexação da aplicação.
 */

import type { Metadata } from 'next'
import './globals.css'

/**
 * Metadados da aplicação.
 * Usados pelo Next.js para gerar <title> e <meta name="description">.
 */
export const metadata: Metadata = {
  title: 'Explorador Temporal de Imagens de Satélite',
  description:
    'Pesquisa, visualiza e compara imagens Sentinel-2 de qualquer região do mundo. ' +
    'Projeto de Engenharia Informática 2025/26 — Krassimire Iankov Djimov, 2301201, Universidade Aberta.',
  authors: [{ name: 'Krassimire Iankov Djimov' }],
  keywords: ['satélite', 'Sentinel-2', 'Copernicus', 'imagens', 'temporal', 'explorador', 'mapa'],
}

/**
 * Layout raiz — envolve todas as páginas da aplicação.
 *
 * O atributo lang="pt" indica ao browser e aos motores de busca
 * que o idioma principal da página é o Português.
 * O toggle PT/EN na interface altera os textos mas não este atributo
 * (actualização dinâmica do lang seria feita via useEffect no futuro).
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  )
}
