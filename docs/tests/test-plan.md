# Plano de testes

Explorador Temporal de Imagens de Satélite
Krassimire Iankov Djimov · 2301201 · Universidade Aberta
Última actualização: 2026-04-18

---

## Estratégia

- **Testes unitários** (Vitest): validadores, transformações de dados, i18n
- **Testes de integração** (Vitest): rotas internas com mocks dos serviços externos
- **Testes manuais**: critérios de aceitação do MVP verificados em browser

---

## Testes unitários implementados

| Ficheiro | Suite | Casos | Estado |
|---|---|---|---|
| validators.test.ts | validateDate | 5 | ✅ |
| validators.test.ts | validateDateRange | 5 | ✅ |
| validators.test.ts | validateRegion | 6 | ✅ |
| validators.test.ts | validateSearchParams | 3 | ✅ |

## Testes unitários planeados (semana 9)

| Ficheiro | Função |
|---|---|
| i18n.test.ts | getTranslations PT e EN |
| copernicus.test.ts | stacFeatureToResult com mock |
| geocoding.test.ts | nominatimToGeocodingResult |

---

## Critérios de aceitação do MVP — testes manuais (semanas 11–13)

| # | Cenário | Critério | Estado |
|---|---|---|---|
| T01 | Abrir a aplicação | Carrega sem erros em localhost:3000 | Pendente |
| T02 | Seleccionar lugar popular | Lugar registado, passo 2 desbloqueado | Pendente |
| T03 | Desenhar região no mapa | Bounding box com coordenadas correctas | Pendente |
| T04 | Pesquisa por topónimo | Sugestões aparecem; mapa navega | Pendente |
| T05 | Datas inválidas | Mensagem clara, API não chamada | Pendente |
| T06 | Pesquisa com resultados | Imagens na faixa, ordem cronológica | Pendente |
| T07 | Pesquisa sem resultados | Mensagem sugere aumentar o filtro | Pendente |
| T08 | Seleccionar imagem | Visualização principal actualiza | Pendente |
| T09 | Alternar banda | TCI / NDVI / SWIR muda a imagem | Pendente |
| T10 | Comparar duas datas | Painel Antes/Depois funcional | Pendente |
| T11 | Toggle PT/EN | Interface muda sem recarregar | Pendente |
| T12 | API indisponível | Mensagem amigável, nova tentativa | Pendente |

---

## Executar testes

```bash
npm test            # todos os testes
npm run test:ui     # interface visual
npm run test:coverage  # relatório de cobertura
```
