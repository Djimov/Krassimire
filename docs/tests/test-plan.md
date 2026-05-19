# Plano de testes

Explorador Temporal de Imagens de Satélite
Krassimire Iankov Djimov · 2301201 · Universidade Aberta
Última actualização: 2026-05-19 (semana 9)

---

## Estado actual (semana 9)

A integração funcional com o Copernicus foi concluída na semana 9. A aplicação
mostra imagens de satélite reais, permite pesquisa por topónimo, selecção de
período com calendário, filtragem por nuvens, visualização em 3 bandas (TCI,
NDVI, SWIR) com legenda de cores, e comparação temporal Antes/Depois.

O ficheiro `src/tests/validators.test.ts` contém 19 casos de teste escritos
durante o desenvolvimento dos validadores. Agora que a integração funcional
está completa, estes testes podem ser executados formalmente e novos testes
devem ser escritos para cobrir os serviços e as rotas de API.

---

## Estratégia de testes

A estratégia organiza-se em três camadas:

1. **Testes unitários** (Vitest): validadores, transformações de dados, i18n,
   conversão de respostas STAC para o modelo interno.
2. **Testes de integração** (Vitest com mocks): rotas internas /api/search,
   /api/geocode e /api/preview com mocks dos serviços externos.
3. **Testes manuais guiados**: critérios de aceitação do MVP verificados em
   browser contra a checklist T01–T15.

---

## Testes unitários existentes (escritos, a executar formalmente)

| Ficheiro | Suite | Casos | O que testa |
|---|---|---|---|
| validators.test.ts | validateDate | 5 | Formato ISO, datas futuras, datas inválidas |
| validators.test.ts | validateDateRange | 5 | Datas inconsistentes, intervalo máximo |
| validators.test.ts | validateRegion | 6 | Coordenadas válidas, bounding box mínima |
| validators.test.ts | validateSearchParams | 3 | Integração de todos os parâmetros |

**Como executar:** `npm test`

---

## Testes unitários a escrever (semana 10)

| Ficheiro | Função a testar | Cenários |
|---|---|---|
| i18n.test.ts | getTranslations('pt') e getTranslations('en') | Todas as chaves presentes em ambos os idiomas |
| copernicus.test.ts | stacFeatureToResult | Conversão de feature STAC mock para SatelliteImageResult; campos thumbnailUrl e previewUrl construídos como /api/preview?... |
| copernicus.test.ts | searchSentinelImages (com mock fetch) | Pesquisa com sucesso; API indisponível; token expirado; 0 resultados |
| geocoding.test.ts | nominatimToGeocodingResult | Conversão de resposta Nominatim mock; nome e bounding box correctos |
| geocoding.test.ts | searchByToponym (com mock fetch) | Pesquisa com sucesso; topónimo não encontrado; Nominatim indisponível |

---

## Testes de integração a escrever (semana 10–11)

| Ficheiro | Rota | Cenários |
|---|---|---|
| api-search.test.ts | POST /api/search | Pesquisa com sucesso (região Lisboa, 2024); parâmetros inválidos (400); intervalo demasiado grande; API indisponível (503) |
| api-geocode.test.ts | GET /api/geocode?q=... | Sucesso com "Lisboa"; query demasiado curta (400); Nominatim indisponível (503) |
| api-preview.test.ts | GET /api/preview?bbox=...&datetime=...&layer=... | Imagem devolvida com Content-Type image/png; banda NDVI; bbox inválido (400); token expirado |

---

## Critérios de aceitação do MVP — testes manuais (semana 11–12)

Estes testes são executados manualmente em browser contra a aplicação a correr
em localhost:3000. Cada cenário corresponde a uma funcionalidade do MVP.

| # | Cenário | Passos | Critério de sucesso |
|---|---|---|---|
| T01 | Abrir a aplicação | Navegar para localhost:3000 | Carrega sem erros em <3s; mostra passo 1 |
| T02 | Seleccionar lugar popular | Clicar em "Lisboa" | Lugar registado; passo 2 desbloqueado |
| T03 | Pesquisa por topónimo | Escrever "Sofia" na pesquisa | Sugestões aparecem em <2s; clicar selecciona |
| T04 | Seleccionar período com calendário | Escolher 01/01/2023 até 31/12/2024 | Date pickers funcionam; botão "Confirmar" avança |
| T05 | Seleccionar nível de nuvens | Clicar "Quase sem nuvens" | Passo 4 desbloqueado; resumo mostra ≤10% |
| T06 | Pesquisa com resultados | Clicar "Ver imagens de satélite" | Timeline mostra imagens reais com datas e % nuvens |
| T07 | Pesquisa sem resultados | Usar região remota com ≤10% nuvens e período curto | Mensagem amigável sugere alargar filtros |
| T08 | Seleccionar imagem na timeline | Clicar numa miniatura | Imagem principal actualiza; borda verde na miniatura |
| T09 | Alternar banda para NDVI | Clicar "Vegetação" | Imagem muda para tons de verde; legenda NDVI aparece |
| T10 | Alternar banda para SWIR | Clicar "Humidade" | Imagem muda para tons azul/castanho; legenda SWIR aparece |
| T11 | Comparar duas datas | Clicar "Comparar duas datas" | Painel Antes/Depois abre com date pickers |
| T12 | Escolher data na comparação | Mudar data no date picker do "Antes" | Imagem actualiza para a mais próxima com menos nuvens |
| T13 | Toggle PT/EN | Clicar "EN" no header | Toda a interface muda para inglês sem recarregar |
| T14 | Nova pesquisa | Clicar "Nova pesquisa" | Volta ao passo 1; dados anteriores limpos |
| T15 | Editar passo anterior | Clicar no lápis do passo 1 | Volta ao passo 1 mantendo possibilidade de refazer |

---

## Testes de erro e robustez (semana 12)

| # | Cenário | Critério |
|---|---|---|
| E01 | Cortar rede durante pesquisa | Mensagem "Serviço indisponível" em vez de crash |
| E02 | Data de início posterior à data de fim | Mensagem de validação clara antes de chamar API |
| E03 | Região demasiado pequena | Mensagem de validação clara |
| E04 | Intervalo superior a 10 anos | Validação aceita (limite 3650 dias) mas API pode devolver muitos resultados — verificar comportamento |
| E05 | Credenciais OAuth2 inválidas | Mensagem "Verifica as credenciais" no servidor; utilizador vê mensagem amigável |

---

## Cobertura de testes

O objectivo para o relatório final é:
- **≥70% cobertura** em src/lib/ (validadores, i18n)
- **≥60% cobertura** em src/services/ (copernicus, geocoding)
- **100% dos critérios T01–T15** verificados manualmente com resultado documentado

Comando: `npm run test:coverage` (Vitest + c8)

---

## Calendário de execução

| Semana | Actividade |
|---|---|
| 10 | Escrita dos testes unitários novos (i18n, copernicus, geocoding) |
| 11 | Execução formal de todos os testes unitários + escrita dos testes de integração |
| 12 | Testes manuais T01–T15 e testes de erro E01–E05 com registo em test-results.md |
| 13 | Correcção de defeitos; re-execução dos testes que falharam |
