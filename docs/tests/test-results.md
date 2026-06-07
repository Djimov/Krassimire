# Resultados de testes

Explorador Temporal de Imagens de Satélite
Krassimire Iankov Djimov · 2301201 · Universidade Aberta
Data de execução: 7 de Junho de 2026

---

## Testes unitários (npm test)

**19/19 testes passaram.** Execução em 971ms.

| Suite | Casos | Passaram | Falharam | Notas |
|---|---|---|---|---|
| validateDate | 5 | 5 | 0 | Inclui verificação de datas inexistentes (30 Fev) |
| validateDateRange | 5 | 5 | 0 | Limite actualizado para 3650 dias |
| validateRegion | 6 | 6 | 0 | |
| validateSearchParams | 3 | 3 | 0 | |

## Cobertura de código (npm run test:coverage)

| Módulo | % Stmts | % Branch | % Funcs | % Lines |
|---|---|---|---|---|
| validators.ts | 96.66 | 88.57 | 100 | 96.66 |
| i18n.ts | 0 | 100 | 100 | 0 |
| copernicus.ts | 0 | 100 | 100 | 0 |
| geocoding.ts | 0 | 100 | 100 | 0 |
| **lib/ (total)** | **32.04** | **88.88** | **100** | **32.04** |

---

## Testes manuais do MVP (T01–T15)

Browser: Chrome no macOS

| # | Cenário | Resultado | Notas |
|---|---|---|---|
| T01 | Abrir a aplicação | Passou | Carrega em <2s |
| T02 | Seleccionar lugar popular | Passou | |
| T03 | Pesquisa por topónimo | Passou | Sofia e Teheran devolvem resultados |
| T04 | Período com calendário | Passou | |
| T05 | Nível de nuvens | Passou | |
| T06 | Pesquisa com resultados | Passou | Timeline mostra imagens reais |
| T07 | Pesquisa sem resultados | Passou | Antártida tem cobertura Sentinel-2; testado com período curto e nuvens baixas |
| T08 | Seleccionar imagem | Passou | |
| T09 | Banda NDVI + legenda | Passou | |
| T10 | Banda SWIR + legenda | Passou | |
| T11 | Comparar duas datas | Passou | |
| T12 | Date picker na comparação | Passou | Navegação entre candidatos funciona (anterior/seguinte) |
| T13 | Toggle PT/EN | Passou | |
| T14 | Nova pesquisa | Passou | |
| T15 | Editar passo anterior | Passou | |

**Resultado: 15/15 passaram**

---

## Testes de erro (E01–E05)

| # | Cenário | Resultado | Notas |
|---|---|---|---|
| E01 | Rede cortada | Passou | Mensagem amigável sem crash |
| E02 | Datas inválidas | Passou | Date pickers previnem selecção inválida |
| E03 | Região pequena | Passou | Mensagem de validação clara |
| E04 | Intervalo >10 anos | Passou | Funciona mas pode ser lento |
| E05 | Credenciais erradas | Passou | Mensagem de autenticação clara |

**Resultado: 5/5 passaram**

---

## Resumo final

| Tipo | Total | Passaram | Falharam |
|---|---|---|---|
| Testes unitários | 19 | 19 | 0 |
| Testes manuais MVP | 15 | 15 | 0 |
| Testes de erro | 5 | 5 | 0 |
| **Total** | **39** | **39** | **0** |

## Limitações conhecidas

1. **Imagens parciais na comparação** — O Sentinel-2 usa tiles fixos de 110x110 km.
   Mitigado com navegação entre candidatos (anterior/seguinte) implementada na semana 9.

2. **Cobertura de testes unitários** — Os módulos copernicus.ts, geocoding.ts e i18n.ts
   têm 0% de cobertura em statements. A funcionalidade é verificada pelos testes manuais.
