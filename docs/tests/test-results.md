# Resultados de testes

Explorador Temporal de Imagens de Satélite
Krassimire Iankov Djimov · 2301201 · Universidade Aberta
Última actualização: 2026-04-20

---

## Estado actual (semana 8)

**Nenhuma bateria de testes formal foi ainda executada.**

Os testes estão escritos no ficheiro `src/tests/validators.test.ts` mas a execução
sistemática com recolha de resultados está planeada para a semana 11, conforme o
calendário definido em `docs/tests/test-plan.md`.

Este documento será preenchido em duas fases:

1. **Semana 11** — Resultados dos testes unitários e de integração (Vitest)
2. **Semana 12-13** — Resultados dos testes manuais dos critérios de aceitação do MVP

---

## Estrutura prevista dos resultados

### Testes unitários (semana 11)

| Suite | Casos | Passaram | Falharam | Cobertura |
|---|---|---|---|---|
| validateDate | 5 | — | — | — |
| validateDateRange | 5 | — | — | — |
| validateRegion | 6 | — | — | — |
| validateSearchParams | 3 | — | — | — |
| i18n | a escrever | — | — | — |
| copernicus | a escrever | — | — | — |
| geocoding | a escrever | — | — | — |

### Testes manuais do MVP (semana 12-13)

| # | Cenário | Resultado | Observações |
|---|---|---|---|
| T01–T12 | Ver test-plan.md | Pendente | Execução após integração funcional completa |

---

## Notas

Esta documentação honesta do estado dos testes é deliberada. O guia da UC valoriza
explicitamente a honestidade sobre o estado do trabalho ("limitações conhecidas e
bem explicadas são mais valorizadas do que ausência de limitações não reconhecidas").
