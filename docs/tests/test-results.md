# Resultados de testes

Explorador Temporal de Imagens de Satélite
Krassimire Iankov Djimov · 2301201 · Universidade Aberta
Última actualização: 2026-05-19 (semana 9)

---

## Estado actual (semana 9)

A integração funcional com o Copernicus está completa. Os testes podem agora
ser executados com dados reais. Este documento será preenchido à medida que
os testes forem executados nas semanas 10–13.

Os 19 casos de teste em validators.test.ts estão prontos a executar com `npm test`.

---

## Resultados dos testes unitários

### validators.test.ts (a executar na semana 10)

| Suite | Casos | Passaram | Falharam | Notas |
|---|---|---|---|---|
| validateDate | 5 | — | — | |
| validateDateRange | 5 | — | — | Limite alterado para 3650 dias |
| validateRegion | 6 | — | — | |
| validateSearchParams | 3 | — | — | |

### Novos testes (a escrever e executar na semana 10–11)

| Ficheiro | Casos | Passaram | Falharam | Notas |
|---|---|---|---|---|
| i18n.test.ts | — | — | — | |
| copernicus.test.ts | — | — | — | |
| geocoding.test.ts | — | — | — | |
| api-search.test.ts | — | — | — | |
| api-geocode.test.ts | — | — | — | |
| api-preview.test.ts | — | — | — | |

---

## Resultados dos testes manuais do MVP (a executar na semana 12)

| # | Cenário | Resultado | Data | Notas |
|---|---|---|---|---|
| T01 | Abrir a aplicação | — | — | |
| T02 | Seleccionar lugar popular | — | — | |
| T03 | Pesquisa por topónimo | — | — | |
| T04 | Período com calendário | — | — | |
| T05 | Nível de nuvens | — | — | |
| T06 | Pesquisa com resultados | — | — | |
| T07 | Pesquisa sem resultados | — | — | |
| T08 | Seleccionar imagem | — | — | |
| T09 | Banda NDVI + legenda | — | — | |
| T10 | Banda SWIR + legenda | — | — | |
| T11 | Comparar duas datas | — | — | |
| T12 | Date picker na comparação | — | — | |
| T13 | Toggle PT/EN | — | — | |
| T14 | Nova pesquisa | — | — | |
| T15 | Editar passo anterior | — | — | |

---

## Resultados dos testes de erro (a executar na semana 12)

| # | Cenário | Resultado | Data | Notas |
|---|---|---|---|---|
| E01 | Rede cortada | — | — | |
| E02 | Datas inválidas | — | — | |
| E03 | Região pequena | — | — | |
| E04 | Intervalo >10 anos | — | — | |
| E05 | Credenciais inválidas | — | — | |

---

## Cobertura de código

| Módulo | Cobertura | Objectivo |
|---|---|---|
| src/lib/ | — | ≥70% |
| src/services/ | — | ≥60% |
| Total | — | — |

*Será preenchido após execução de `npm run test:coverage` na semana 11.*
