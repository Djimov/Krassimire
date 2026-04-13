# Explorador Temporal de Imagens de Satélite

> Projecto de Engenharia Informática · Universidade Aberta · 2025/26

**Estudante:** Krassimire Djimov · 2301201  
**Orientador:** Pedro Pestana  
**UC:** Projecto de Engenharia Informática · Universidade Aberta · 2025/26  
**Repositório:** https://github.com/Djimov/Krassimire

---

## Estado actual

🟡 **Amarelo** — proposta inicial consolidada, repositório estruturado e documentação-base preparada; implementação funcional do MVP ainda em fase inicial.

---

## O que está implementado

- [x] Proposta inicial do projecto revista e expandida
- [x] Definição do MVP e critérios de aceitação observáveis
- [x] Levantamento de requisitos com priorização MoSCoW
- [x] Arquitectura inicial documentada com C4 nível 1 e 2
- [x] Modelo de dados preliminar
- [x] Estrutura do repositório alinhada com o guia da UC
- [x] ADRs iniciais registadas
- [x] Plano de testes inicial
- [x] Secção de IA utilizada e referências técnicas

## O que está pendente

- [ ] Configuração efectiva da aplicação Next.js
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

## Como instalar e correr

### Pré-requisitos

- Node.js 20+
- npm 10+ (ou pnpm/yarn)
- Conta no Copernicus Data Space Ecosystem
- OAuth Client criado no Dashboard do Copernicus para obter `client_id` e `client_secret`

### Instalação

```bash
git clone https://github.com/Djimov/Krassimire
cd Krassimire
npm install
cp .env.example .env.local
```

### Variáveis de ambiente

Preencher o ficheiro `.env.local` com os valores do OAuth client do Copernicus. O scaffold já traz os endpoints oficiais pré-configurados em `.env.example`.

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
  design/         wireframes e fluxos
  tests/          plano e resultados
  report/         versões do relatório intercalar e final
src/
  app/            páginas e rotas Next.js
  components/     componentes reutilizáveis
  features/       funcionalidades por domínio
  services/       integração com o Copernicus
  lib/            utilitários e validações
  types/          tipos TypeScript do domínio
  tests/          testes unitários e de integração
```

---

## Decisões de arquitectura principais

| Decisão | Alternativa considerada | Razão da escolha |
|---|---|---|
| **Next.js + TypeScript** | React + Node.js + Express em projectos separados | Reduz a complexidade de integração, centraliza frontend e rotas de API no mesmo projecto e é mais adequada ao calendário disponível. |
| **Leaflet** | MapLibre GL JS | Biblioteca mais simples para um MVP académico com selecção de `bounding box` e menor esforço inicial de implementação. |
| **STAC + Process API do Copernicus** | Apenas OData | A STAC API é mais natural para descoberta temporal e geoespacial; a Process API permite gerar pré-visualizações/renderizações úteis para o MVP. |
| **Sem base de dados persistente na fase inicial** | PostgreSQL logo desde o início | O problema principal nesta fase é descoberta e visualização de imagens, não persistência. A decisão reduz complexidade e protege o MVP. |
| **Vitest** | Jest | Configuração moderna e simples para testes unitários e de integração em ambiente TypeScript. |

---

## Documentação principal

- [`docs/scope/proposta.md`](docs/scope/proposta.md)
- [`docs/scope/requirements.md`](docs/scope/requirements.md)
- [`docs/architecture/context.md`](docs/architecture/context.md)
- [`docs/architecture/containers.md`](docs/architecture/containers.md)
- [`docs/architecture/data-model.md`](docs/architecture/data-model.md)
- [`docs/tests/test-plan.md`](docs/tests/test-plan.md)

---

## Referências técnicas

- Copernicus Data Space Ecosystem Documentation
- STAC Product Catalogue / STAC API
- Sentinel Hub Process API
- Next.js Documentation
- Leaflet Documentation
- Vitest Documentation

---

## Ferramentas de IA utilizadas

| Ferramenta | Para que foi usada |
|---|---|
| ChatGPT | Apoio à clarificação do âmbito, definição do MVP, análise e mudança de stack, estruturação do repositório e produção inicial da documentação académica. |
| ProjAlde | Apoio comparativo na discussão de alternativas tecnológicas e organização preliminar de tópicos da proposta. |

> A utilização de IA foi instrumental de apoio. A selecção final do tema, das decisões arquitecturais e da organização do projecto foi validada e adaptada manualmente para este contexto específico.

---

## Última actualização

*Última actualização: 13/04/2026 · Sem. 5*
