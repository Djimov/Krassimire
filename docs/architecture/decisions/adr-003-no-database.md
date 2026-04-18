# ADR-003: Sem base de dados persistente na primeira iteração

**Estado:** Aceite
**Data:** 2026-03-18
**Autor:** Krassimire Iankov Djimov — 2301201

## Contexto

O MVP não inclui autenticação, histórico de pesquisas entre sessões, nem dados que precisem de persistir além da sessão do utilizador. A informação trabalhada pela aplicação é sempre derivada da API Copernicus em tempo real.

## Decisão

Não introduzir base de dados persistente na primeira versão. O estado da aplicação é gerido em memória (React state) e os dados de imagem derivam sempre da API Copernicus.

## Alternativas consideradas

- **PostgreSQL desde o início**: permitiria guardar histórico de pesquisas e regiões favoritas, mas adicionaria schema, migrações, ORM e configuração de deploy sem acrescentar valor ao MVP.
- **SQLite local**: mais leve, mas ainda assim introduziria complexidade desnecessária para o âmbito actual.

## Justificação

Uma base de dados adicionaria complexidade de configuração, schema, migrações e testes sem acrescentar valor demonstrável ao MVP. Se surgir necessidade real (ex: favoritos, histórico de sessões), pode ser adicionada numa iteração posterior sem quebrar a arquitectura existente — o isolamento da lógica de estado em React Context facilita essa migração.

## Consequências

- Estado da sessão perdido ao fechar o browser (comportamento esperado e documentado no MVP)
- Sem necessidade de ORM, migrações ou serviços de base de dados no deploy
- Simplifica drasticamente a configuração do ambiente de desenvolvimento
- Decisão reversível — ver ADR-001 para contexto sobre o princípio de simplicidade estrutural
