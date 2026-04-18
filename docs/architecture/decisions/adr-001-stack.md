# ADR-001: Adopção de Next.js em vez de frontend e backend separados

**Estado:** Aceite
**Data:** 2026-03-18
**Autor:** Krassimire Iankov Djimov — 2301201

## Contexto

A proposta inicial considerava uma arquitectura clássica com frontend em
React + TypeScript e backend separado em Node.js + Express. Esta é uma
arquitectura comum na indústria, modular e tecnicamente válida.

Ao analisar o projecto de forma mais concreta — um projecto individual, com
calendário académico de 16 semanas, um único desenvolvedor e foco num MVP
bem definido — tornou-se evidente que a separação frontend/backend introduziria
complexidade estrutural superior à necessária.

## Decisão

Adoptar Next.js 14 + TypeScript como base única da aplicação, integrando
interface, páginas, componentes React e rotas de API internas no mesmo projecto.

## Alternativas consideradas

1. **React + Node.js/Express separados**: arquitectura clássica, mais familiar
   para equipas. Descartada por complexidade de configuração desnecessária
   para um projecto individual.

2. **React + Next.js API Routes + Express em microserviço**: híbrido sem
   vantagens claras para este caso. Descartado.

3. **Next.js com App Router (escolhido)**: integra SSR, rotas de API, e
   importações dinâmicas (necessárias para o Leaflet) de forma nativa.

## Justificação

- **Simplicidade estrutural**: um único package.json, uma única configuração
  de TypeScript, um único processo em desenvolvimento
- **Rotas de API internas**: /api/search e /api/geocode substituem o servidor
  Express com muito menos configuração
- **Importação dinâmica**: next/dynamic com ssr:false resolve o problema do
  Leaflet em SSR sem bibliotecas adicionais
- **Coerência com ADR-002**: as rotas internas são o ponto natural para
  mediar a comunicação com serviços externos

## Consequências

- Frontend, páginas, componentes e rotas de API coexistem no mesmo projecto
- A arquitectura continua a ter fronteiras de responsabilidade claras:
  src/app/ (páginas), src/components/ (UI), src/services/ (APIs externas),
  src/lib/ (utilitários), src/types/ (domínio)
- Se o sistema crescer e justificar separação, as rotas /api/* podem ser
  migradas para um serviço independente sem alterar o frontend
- Leaflet importado com dynamic() e ssr:false em MapSelector.tsx

## Referências

- Next.js App Router: https://nextjs.org/docs/app
- next/dynamic: https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading
