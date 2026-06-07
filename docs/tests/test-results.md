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

Nota: A cobertura de i18n, copernicus e geocoding é 0% em statements porque estes
módulos são testados indirectamente pelas rotas de API, não por testes unitários
dedicados. Os testes unitários dedicados estão planeados mas a cobertura funcional
é verificada pelos testes manuais T01–T15.

---

## Testes manuais do MVP (T01–T15)

Data de execução: 7 de Junho de 2026
Browser: Chrome no macOS

| # | Cenário | Resultado | Notas |
|---|---|---|---|
| T01 | Abrir a aplicação | Passou | Carrega em <2s |
| T02 | Seleccionar lugar popular | Passou | Lisboa seleccionada, passo 2 aparece |
| T03 | Pesquisa por topónimo | Passou | "Sofia" e "Teheran" devolvem resultados |
| T04 | Período com calendário | Passou | Date pickers funcionam correctamente |
| T05 | Nível de nuvens | Passou | Passo 4 desbloqueado com resumo correcto |
| T06 | Pesquisa com resultados | Passou | Timeline mostra imagens reais com datas |
| T07 | Pesquisa sem resultados | Passou* | *A Antártida tem cobertura Sentinel-2. Testado com intervalo de 1 dia e ≤10% nuvens para obter 0 resultados |
| T08 | Seleccionar imagem | Passou | Imagem principal actualiza correctamente |
| T09 | Banda NDVI + legenda | Passou | Legenda de vegetação aparece |
| T10 | Banda SWIR + legenda | Passou | Legenda de humidade aparece |
| T11 | Comparar duas datas | Passou | Painel Antes/Depois funcional |
| T12 | Date picker na comparação | Passou* | *Limitação conhecida: a selecção automática pode escolher imagens parciais (tiles que não cobrem toda a região). Melhoria futura: mostrar candidatos e deixar o utilizador escolher |
| T13 | Toggle PT/EN | Passou | Interface muda sem recarregar |
| T14 | Nova pesquisa | Passou | Volta ao passo 1, dados limpos |
| T15 | Editar passo anterior | Passou | Botão lápis funciona correctamente |

**Resultado: 15/15 passaram** (2 com observações documentadas)

---

## Testes de erro (E01–E05)

| # | Cenário | Resultado | Notas |
|---|---|---|---|
| E01 | Rede cortada | A testar | |
| E02 | Datas inválidas | A testar | Date pickers previnem selecção inválida (min/max) |
| E03 | Região pequena | A testar | |
| E04 | Intervalo >10 anos | A testar | |
| E05 | Credenciais erradas | A testar | |

---

## Limitações conhecidas

1. **Imagens parciais na comparação** — O Sentinel-2 usa tiles fixos de 110×110 km. Quando
   a região seleccionada intersecta a fronteira entre tiles, a selecção automática pode
   escolher uma imagem que só cobre parte da região. Solução futura: apresentar vários
   candidatos para a data escolhida.

2. **Cobertura de testes unitários** — Os módulos copernicus.ts, geocoding.ts e i18n.ts
   não têm testes unitários dedicados (0% stmts). A funcionalidade é verificada pelos
   testes manuais mas testes com mocks devem ser escritos para o relatório final.
