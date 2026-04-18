# Proposta de Projecto — Versão 2.1

**Título:** Explorador Temporal de Imagens de Satélite
**Opção:** A
**Orientador:** Pedro Pestana
**Estudante:** Krassimire Iankov Djimov · 2301201
**UC:** Projecto de Engenharia Informática 2025/26 · Universidade Aberta
**Repositório:** https://github.com/Djimov/Krassimire
**Data:** 10 Abril 2026

---

## 1. Sinopse

O acesso a imagens de satélite de arquivo público tornou-se relevante em áreas como educação, análise territorial, monitorização ambiental e acompanhamento de alterações urbanas. Plataformas associadas a missões como Sentinel e Landsat disponibilizam hoje um volume significativo de dados — mas a disponibilidade desses dados não se traduz automaticamente em acessibilidade prática para o utilizador comum. A maioria das ferramentas existentes foi desenhada para perfis com conhecimentos em SIG, sensores remotos e processamento geoespacial, tornando-as inacessíveis para quem quer apenas observar como uma região mudou ao longo do tempo.

O projecto desenvolve uma aplicação web orientada à exploração temporal simples e intuitiva de imagens Sentinel-2. O foco está numa experiência de utilização clara para utilizadores não especialistas: pesquisar um lugar por nome ou desenhá-lo num mapa, escolher um intervalo temporal, filtrar por cobertura de nuvens, visualizar imagens e comparar dois momentos distintos de forma rápida e compreensível. A solução distingue-se das plataformas existentes pela sua interface guiada em quatro passos, pela pesquisa por topónimo integrada e pelo suporte a dois idiomas (PT/EN).

O resultado esperado é um protótipo funcional, tecnicamente credível e academicamente defensável, capaz de demonstrar um ciclo completo de utilização — da selecção da região à comparação temporal de duas imagens. O projecto será considerado bem-sucedido se o MVP definido nesta proposta for implementado de forma robusta, se os critérios de aceitação forem verificáveis e se existir coerência entre planeamento, arquitectura, código, testes, documentação e demonstração final.

---

## 2. MVP — Funcionalidades e critérios de aceitação

| Funcionalidade | Critério de aceitação observável |
| --- | --- |
| **Selecção de região no mapa** | O utilizador consegue desenhar uma bounding box num mapa interactivo ou pesquisar um lugar por nome; o sistema regista as coordenadas e navega para o local. |
| **Pesquisa por topónimo** | O utilizador escreve o nome de uma cidade ou local; o sistema devolve sugestões via Nominatim e centra o mapa no lugar seleccionado em menos de 2 segundos. |
| **Intervalo temporal** | O sistema aceita períodos de 1 a 24 meses e rejeita datas inconsistentes com mensagem clara. |
| **Pesquisa de imagens** | Após região e período definidos, o sistema devolve resultados Sentinel-2 ou informa explicitamente que não existem resultados. |
| **Filtro por nuvens** | O utilizador define o limite máximo de nuvens e o sistema aplica o filtro; os resultados apresentados têm cobertura ≤ ao valor definido. |
| **Timeline cronológica** | Os resultados são apresentados por ordem temporal e podem ser percorridos e seleccionados de forma clara. |
| **Visualização de imagem** | Ao seleccionar um resultado, a imagem correspondente é apresentada na interface de forma legível. |
| **Composições de bandas** | O utilizador consegue alternar entre pelo menos duas visualizações (TCI cor natural, NDVI vegetação, SWIR humidade). |
| **Comparação temporal** | O sistema permite seleccionar duas imagens via painel Antes/Depois e apresentá-las simultaneamente lado a lado. |
| **Tratamento de erros** | Em caso de erro externo, parâmetros inválidos ou ausência de resultados, a aplicação responde de forma controlada com mensagem em PT ou EN conforme o idioma activo. |
| **Internacionalização PT/EN** | O toggle de idioma no cabeçalho alterna toda a interface entre Português e Inglês sem recarregar a página. |

---

## 3. Stack tecnológica

| Camada | Tecnologia | Justificação |
| --- | --- | --- |
| Aplicação web | Next.js 14 + TypeScript | Integra interface e rotas API no mesmo projecto, reduzindo complexidade sem sacrificar separação de responsabilidades (ADR-001). |
| Mapa interactivo | Leaflet + react-leaflet | Biblioteca madura, bem documentada, suficiente para o MVP. Alternativa MapLibre GL considerada e descartada por complexidade desnecessária. |
| Geocodificação | Nominatim (OpenStreetMap) | Gratuito, sem chave API, mediado por rota interna conforme ADR-002. |
| Fonte de dados | Copernicus Data Space Ecosystem (STAC API) | Fornece acesso a metadados e recursos Sentinel-2 com filtragem temporal e espacial nativa. |
| Testes | Vitest | Configuração mais leve e moderna em ambiente TypeScript face ao Jest. |
| Controlo de versões | Git + GitHub | Histórico de evolução, documentação e acompanhamento assíncrono com o orientador. |

---

## 4. Arquitectura inicial — C4 nível 1

O sistema principal é o **Explorador Temporal de Imagens de Satélite**. O actor externo é o **Utilizador Final**, que acede via browser. O sistema comunica com o **Copernicus Data Space Ecosystem** (imagens Sentinel-2) e com o **Nominatim/OpenStreetMap** (geocodificação por topónimo). O **GitHub** funciona como sistema de suporte ao desenvolvimento e documentação.

Toda a comunicação com serviços externos é mediada por rotas internas Next.js (/api/search, /api/geocode) — nunca directamente do cliente (ADR-002).

*Diagrama C4 nível 1 em docs/architecture/c4-context.png*
*Diagrama C4 nível 2 em docs/architecture/c4-containers.png*

---

## 5. Calendário detalhado

| Semanas | Datas | Trabalho planeado | Marco |
| --- | --- | --- | --- |
| 1–2 | 17–28 Mar | Kick-off. Sinopse, MVP, stack, calendário. Criação do repositório. | **Proposta** |
| 3–4 | 31 Mar–11 Abr | Requisitos MoSCoW. C4 nível 1 e 2. Modelo de dados. Configuração do repositório. | |
| 5–6 | 14–25 Abr | Wireframes e protótipo de navegação. ADRs. Início de implementação do núcleo. | |
| 7 | 28 Abr–2 Mai | Demo interna ao orientador. Changelog consolidado. README actualizado. | **Demo interna** |
| 8 | 5–6 Mai | Relatório intercalar (Cap. 1 e 2 completos, estado do Cap. 3). | **Intercalar** |
| 9–10 | 7–16 Mai | Implementação de funcionalidades secundárias. Testes unitários e de integração. | |
| 11–12 | 19–30 Mai | MVP completo. Testes de funcionalidade e desempenho. Capturas de ecrã. | |
| 13 | 2–6 Jun | Revisão geral. Polimento de interface. Validação dos critérios de aceitação. | |
| 14 | 9–13 Jun | Cap. 4 (Testes) e Cap. 5 (Conclusões). Revisão bibliográfica. Anexos. | |
| 15 | 16–20 Jun | Reunião de preparação para defesa. Ensaio de perguntas de júri. | **Prep. defesa** |
| 16 | 24 Jun | Submissão final. | **Final** |

---

## 6. Riscos principais

| Risco | Impacto | Mitigação |
| --- | --- | --- |
| Integração difícil com a API Copernicus | Atraso no núcleo | Prova de conceito na semana 7; isolamento em serviços próprios |
| Sobredimensionamento do âmbito | MVP incompleto | Disciplina MoSCoW; proteger Must Have |
| Dependência de serviço externo | Falhas não controláveis | Mensagens de erro robustas; modo de demonstração com dados mock |
| Tempo insuficiente para documentação | Incoerência produto/relatório | Actualização semanal do changelog e documentação contínua |

---

## 7. Utilização de ferramentas de IA

No decurso deste projecto foram utilizadas ferramentas de IA generativa como instrumento de apoio ao desenvolvimento e à documentação. Especificamente, o Claude (Anthropic) foi utilizado para:

- Apoio à definição e refinamento da arquitectura do sistema (C4, ADRs)
- Geração de código boilerplate para componentes React/TypeScript e configuração Next.js
- Revisão e melhoria de código escrito pelo estudante
- Geração de documentação técnica a partir de decisões tomadas pelo estudante
- Prototipagem interactiva da interface de utilizador
- Verificação de alinhamento entre a proposta, o guia da UC e a implementação

Em todos os casos, as decisões de arquitectura, a definição de requisitos, a escolha da stack e a validação de conteúdo foram tomadas pelo estudante. A IA funcionou como ferramenta de produtividade e de verificação, não como substituto do raciocínio técnico. O estudante é capaz de explicar e defender todas as decisões presentes neste repositório.

Esta referência será incluída na secção de Referências do relatório final, conforme exigido pelo guia da UC (secção 8).
