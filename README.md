# Explorador Temporal de Imagens de Satélite

> Projecto de Engenharia Informática · Universidade Aberta · 2025/26

**Estudante:** Krassimire Djimov · 2301201  
**Orientador:** Pedro Pestana  
**UC:** Projecto de Engenharia Informática · Universidade Aberta · 2025/26  
**Repositório:** https://github.com/Djimov/Krassimire

---

## Visão geral do projecto

O projecto consiste no desenvolvimento de uma aplicação web para exploração temporal de imagens Sentinel-2, orientada para utilizadores não especialistas. O sistema permitirá seleccionar uma região geográfica num mapa interactivo, definir um intervalo temporal, consultar resultados organizados cronologicamente e comparar visualmente duas imagens de datas distintas.

A motivação principal decorre da distância existente entre a disponibilidade de dados públicos de observação da Terra e a sua utilização por públicos generalistas. Embora existam plataformas e catálogos robustos, a maioria das ferramentas actualmente disponíveis continua orientada para utilizadores com conhecimentos técnicos em SIG, sensores remotos e processamento geoespacial. Este projecto procura, assim, transformar dados científicos públicos num fluxo de utilização simples, visual e academicamente demonstrável.

---

## Estado actual

🟡 **Amarelo** — a fase de planeamento técnico e documental encontra-se consolidada. A proposta inicial foi expandida para uma versão operacional 2.0/2.1, já com definição de MVP, levantamento de requisitos, arquitectura inicial, modelo de dados preliminar e organização do repositório. A implementação funcional do MVP encontra-se ainda em fase inicial.

### O que já está feito nesta fase

- [x] Definição da sinopse do projecto e delimitação do problema
- [x] Definição do MVP com critérios de aceitação observáveis
- [x] Levantamento de requisitos funcionais e não funcionais
- [x] Priorização de requisitos com técnica MoSCoW
- [x] Arquitectura inicial documentada com C4 nível 1 e 2
- [x] Modelo de dados preliminar do domínio
- [x] Justificação da mudança de stack tecnológica
- [x] Registo de decisões arquitecturais iniciais (ADRs)
- [x] Estrutura académica do repositório alinhada com a guia da UC
- [x] Plano de testes inicial
- [x] Registo de riscos e changelog

### O que continua pendente

- [ ] Configuração funcional da aplicação Next.js
- [ ] Implementação do mapa interactivo com Leaflet
- [ ] Integração funcional com a STAC API do Copernicus
- [ ] Implementação da pesquisa temporal e filtro por nuvens
- [ ] Construção da timeline cronológica
- [ ] Visualização de imagem em cor natural e falso infravermelho
- [ ] Vista comparativa lado a lado
- [ ] Testes ao fluxo principal do MVP
- [ ] Produção dos diagramas finais em draw.io
- [ ] Consolidação do relatório intercalar

---

## Problema e objectivo

O problema central do projecto é a dificuldade que um utilizador comum encontra quando tenta perceber como uma determinada região mudou ao longo do tempo através de imagens de satélite. O objectivo não é competir com plataformas profissionais de análise geoespacial, mas antes criar uma camada de simplificação sobre dados públicos, com foco na pesquisa temporal, visualização clara e comparação directa entre momentos distintos.

O resultado esperado é um protótipo funcional e defendível que permita demonstrar o seguinte fluxo principal:

1. seleccionar uma região no mapa;
2. definir um intervalo temporal;
3. aplicar um filtro de cobertura de nuvens;
4. obter resultados Sentinel-2;
5. navegar por esses resultados numa timeline;
6. visualizar uma imagem em pelo menos duas composições;
7. comparar duas imagens lado a lado.

---

## Stack tecnológica adoptada

| Camada | Tecnologia | Papel no projecto |
|---|---|---|
| Aplicação web | **Next.js + TypeScript** | Base da aplicação, integrando interface, páginas e rotas de API internas no mesmo projecto |
| Mapa interactivo | **Leaflet** | Selecção e visualização da região geográfica |
| Fonte de dados externa | **Copernicus Data Space Ecosystem** | Pesquisa de produtos Sentinel-2 e acesso a recursos de visualização |
| Testes | **Vitest** | Testes unitários e de integração do núcleo funcional |
| Gestão e rastreabilidade | **Git + GitHub** | Histórico de evolução, documentação e acompanhamento assíncrono |

### Justificação da mudança de stack

A proposta inicial considerava uma separação clássica entre frontend e backend, com React no cliente e Node.js + Express no servidor. Após análise mais cuidada do calendário, do escopo do MVP e do esforço realista para um projecto individual, optou-se por adoptar **Next.js + TypeScript** como base única da aplicação. Esta mudança reduz a complexidade estrutural, evita a manutenção de dois projectos separados e simplifica a integração entre interface e rotas de API internas.

A decisão não representa uma redução da qualidade técnica do projecto. Pelo contrário, preserva fronteiras arquitecturais claras, melhora a produtividade e aumenta a probabilidade de concluir o MVP com robustez dentro do calendário académico disponível.

---

## Como instalar e correr

### Pré-requisitos

- Node.js 20+
- npm 10+ (ou pnpm/yarn)
- Conta no Copernicus Data Space Ecosystem
- OAuth Client criado no dashboard do Copernicus Data Space Ecosystem

### Instalação

```bash
 git clone https://github.com/Djimov/Krassimire.git
 cd Krassimire
 npm install
 cp .env.example .env.local
```

### Variáveis de ambiente

O ficheiro `.env.example` já contém os endpoints oficiais actuais do Copernicus. Para executar a integração real, é necessário preencher em `.env.local` os valores do `client_id` e `client_secret` do OAuth Client.

### Arranque local

```bash
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

---

## Estrutura do repositório

```text
docs/
  scope/          proposta, requisitos, changelog, riscos
  architecture/   C4, modelo de dados, ADRs
  design/         wireframes e fluxos de utilização
  tests/          plano e resultados de testes
  report/         versões de trabalho do relatório
src/
  app/            páginas e rotas Next.js
  components/     componentes reutilizáveis
  features/       funcionalidades por domínio
  services/       integração com a API externa
  lib/            utilitários e validações
  types/          tipos TypeScript do domínio
  tests/          testes unitários e de integração
```

---

## Decisões de arquitectura principais

| Decisão | Alternativa considerada | Razão da escolha |
|---|---|---|
| **Next.js + TypeScript** | React + Node.js + Express em projectos separados | Reduz complexidade, centraliza aplicação e rotas de API e protege o MVP dentro do calendário disponível |
| **Leaflet** | MapLibre GL JS | Biblioteca mais simples e suficiente para um MVP académico focado em selecção de região |
| **STAC + Process API do Copernicus** | Apenas OData | A STAC API é mais natural para descoberta temporal e espacial; a Process API é adequada para pré-visualizações e renderizações úteis para o MVP |
| **Sem base de dados persistente na fase inicial** | PostgreSQL desde o início | O problema principal nesta fase é descoberta e visualização de imagens, não persistência de utilizadores ou sessões |
| **Vitest** | Jest | Configuração mais leve e moderna em ambiente TypeScript |

---

## Documentação principal

### Âmbito e planeamento
- [`docs/scope/proposta.md`](docs/scope/proposta.md)
- [`docs/scope/requirements.md`](docs/scope/requirements.md)
- [`docs/scope/changelog.md`](docs/scope/changelog.md)
- [`docs/scope/risks.md`](docs/scope/risks.md)

### Arquitectura
- [`docs/architecture/context.md`](docs/architecture/context.md)
- [`docs/architecture/containers.md`](docs/architecture/containers.md)
- [`docs/architecture/data-model.md`](docs/architecture/data-model.md)
- [`docs/architecture/decisions/adr-001-stack.md`](docs/architecture/decisions/adr-001-stack.md)
- [`docs/architecture/decisions/adr-002-copernicus-integration.md`](docs/architecture/decisions/adr-002-copernicus-integration.md)

### Desenho e testes
- [`docs/design/wireframes.md`](docs/design/wireframes.md)
- [`docs/design/user-flows.md`](docs/design/user-flows.md)
- [`docs/tests/test-plan.md`](docs/tests/test-plan.md)
- [`docs/tests/test-results.md`](docs/tests/test-results.md)

---

## Ferramentas de IA utilizadas

| Ferramenta | Utilização principal |
|---|---|
| ChatGPT | Apoio à clarificação do problema, definição do MVP, análise comparativa da stack, estruturação do repositório e redacção inicial da documentação |
| ProjAlde | Apoio exploratório complementar na organização de ideias e tópicos iniciais do projecto |

> A utilização de IA teve natureza instrumental e de apoio. A definição do problema, a selecção final da stack, a adaptação ao contexto da UC e a validação dos conteúdos foram efectuadas manualmente pelo estudante.

---

## Referências técnicas principais

- Copernicus Data Space Ecosystem Documentation
- STAC Product Catalogue / STAC API Documentation
- Sentinel Hub Process API Documentation
- Next.js Documentation
- Leaflet Documentation
- Vitest Documentation

---

## Última actualização

**Última actualização:** 13/04/2026 · Sem. 5  
**Próximo marco:** consolidação do repositório no GitHub e início da implementação do mapa interactivo e da pesquisa temporal.
