# ADR-001 — Escolha da stack principal

## Contexto
A proposta inicial considerava React no frontend e Node.js + Express no backend em projectos separados.

## Decisão
Adoptar **Next.js + TypeScript** como base principal da aplicação.

## Razão
- menor complexidade estrutural;
- frontend e rotas de API no mesmo projecto;
- configuração mais simples;
- melhor adequação ao prazo disponível;
- continua a permitir documentação arquitectural clara.

## Consequências
- menor esforço inicial de integração;
- arquitectura mais coesa;
- necessidade de manter organização disciplinada dentro de um único projecto.
