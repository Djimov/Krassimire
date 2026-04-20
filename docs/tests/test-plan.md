# Plano de testes

Explorador Temporal de Imagens de Satélite
Krassimire Iankov Djimov · 2301201 · Universidade Aberta
Última actualização: 2026-04-20

---

## Estado actual (semana 8)

A fase de testes formais do projecto ainda não foi iniciada. Este documento descreve
a estratégia planeada e os testes a realizar nas semanas 9 a 13 do semestre.

O ficheiro `src/tests/validators.test.ts` contém 19 casos de teste escritos durante
o desenvolvimento dos validadores (semana 5-6). Estes testes estão escritos mas **ainda
não foram executados formalmente como parte de uma bateria de validação**. A execução
sistemática com recolha de resultados está planeada para a semana 11, após a integração
funcional com a API do Copernicus estar completa.

---

## Estratégia de testes planeada

- **Testes unitários** (Vitest): validadores de parâmetros, transformações de dados,
  funções de i18n, conversão de respostas STAC para o modelo interno.
- **Testes de integração** (Vitest com mocks): rotas internas `/api/search`, `/api/geocode`
  e `/api/preview` com mocks dos serviços externos Copernicus e Nominatim.
- **Testes manuais guiados**: critérios de aceitação do MVP verificados em browser
  contra a checklist T01–T12.

---

## Testes unitários — a executar na semana 11

| Ficheiro | Suite | Casos previstos | Estado |
|---|---|---|---|
| validators.test.ts | validateDate | 5 | Escrito · por executar |
| validators.test.ts | validateDateRange | 5 | Escrito · por executar |
| validators.test.ts | validateRegion | 6 | Escrito · por executar |
| validators.test.ts | validateSearchParams | 3 | Escrito · por executar |

## Testes unitários — a escrever na semana 9

| Ficheiro | Função a testar |
|---|---|
| i18n.test.ts | getTranslations PT e EN — todas as chaves presentes |
| copernicus.test.ts | stacFeatureToResult com resposta mock da API |
| geocoding.test.ts | nominatimToGeocodingResult com resposta mock |

## Testes de integração — a escrever na semana 10

| Ficheiro | Rota | Cenários |
|---|---|---|
| api-search.test.ts | /api/search | sucesso, sem resultados, API indisponível, params inválidos |
| api-geocode.test.ts | /api/geocode | sucesso, topónimo não encontrado, debounce |
| api-preview.test.ts | /api/preview | sucesso, banda inválida, erro WMS |

---

## Critérios de aceitação do MVP — testes manuais (semana 12-13)

| # | Cenário | Critério observável | Estado |
|---|---|---|---|
| T01 | Abrir a aplicação | Carrega sem erros em localhost:3000 em menos de 3s | Pendente |
| T02 | Seleccionar lugar popular | Lugar registado, passo 2 desbloqueado automaticamente | Pendente |
| T03 | Desenhar região no mapa | Bounding box com coordenadas correctas na UI | Pendente |
| T04 | Pesquisa por topónimo | Sugestões aparecem em menos de 2s; mapa navega | Pendente |
| T05 | Datas inválidas | Mensagem clara em PT/EN; API não é chamada | Pendente |
| T06 | Pesquisa com resultados | Imagens na timeline em ordem cronológica | Pendente |
| T07 | Pesquisa sem resultados | Mensagem sugere aumentar filtro de nuvens | Pendente |
| T08 | Seleccionar imagem | Visualização principal actualiza imediatamente | Pendente |
| T09 | Alternar banda | TCI / NDVI / SWIR muda a imagem visível | Pendente |
| T10 | Comparar duas datas | Painel Antes/Depois funcional com selecção independente | Pendente |
| T11 | Toggle PT/EN | Interface muda de idioma sem recarregar a página | Pendente |
| T12 | API Copernicus indisponível | Mensagem amigável; sem crash | Pendente |

---

## Testes de desempenho (semana 13)

Para o contexto académico, não estão previstos testes de carga formais. A verificação
de desempenho limita-se a:

- Tempo de primeira resposta da pesquisa inferior a 5s (RNF8)
- Tempo de navegação entre imagens na timeline inferior a 1s
- Tempo de resposta do toggle de bandas inferior a 2s

---

## Cobertura de testes

O objectivo para o relatório final é atingir cobertura de ≥70% nos ficheiros de
`src/lib/` (validadores) e `src/services/` (integração Copernicus e Nominatim).
A cobertura será gerada com `npm run test:coverage` (Vitest + c8).
