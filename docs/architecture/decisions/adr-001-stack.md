# ADR-001 — Adopção de Next.js + TypeScript como stack principal

## Estado
Aceite

## Contexto
A proposta inicial considerava uma separação clássica entre frontend e backend, com React no cliente e Node.js + Express no servidor. Essa abordagem é tecnicamente válida, mas introduz um custo estrutural adicional num projecto individual com calendário académico limitado.

## Decisão
Adoptar **Next.js + TypeScript** como base da aplicação, mantendo a integração com Leaflet, Copernicus Data Space Ecosystem e Vitest no mesmo repositório e no mesmo projecto aplicacional.

## Consequências positivas
- menor complexidade de integração;
- menor esforço de configuração inicial;
- melhor adequação ao calendário do semestre;
- preservação de fronteiras internas claras entre interface, serviços e tipos.

## Consequências negativas
- menor separação física entre frontend e backend;
- necessidade de disciplina adicional na organização interna do código.

## Alternativas consideradas
- React + Node.js + Express em projectos separados;
- React com consumo directo da API externa sem mediação interna.
