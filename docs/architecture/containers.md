# Arquitectura — C4 nível 2 (Contentores)

## 1. Objectivo do nível 2

O C4 nível 2 descreve os principais contentores do sistema, isto é, os blocos executáveis ou logicamente distinguíveis que compõem a solução. No contexto deste projecto, o objectivo não é introduzir uma arquitectura excessivamente complexa, mas sim tornar explícitas as principais fronteiras de responsabilidade dentro da stack escolhida.

---

## 2. Contentor principal — Aplicação Web Next.js

O contentor central do sistema é a **Aplicação Web Next.js**, que integra:

- páginas e interface React;
- componentes reutilizáveis;
- lógica do lado do cliente;
- rotas internas de API executadas no ambiente Next.js;
- serviços de integração com o Copernicus encapsulados no projecto.

Este contentor existe porque a stack foi simplificada para um único projecto aplicacional. Mesmo assim, há separação interna entre interface, serviços, tipos de domínio e utilitários.

### Responsabilidades principais

- apresentar o mapa interactivo;
- recolher os parâmetros de pesquisa;
- validar inputs do utilizador;
- invocar rotas de API internas;
- apresentar resultados de pesquisa;
- coordenar visualização e comparação temporal.

---

## 3. Contentor técnico interno — Componente cartográfica Leaflet

Embora não seja um sistema autónomo separado, o uso de **Leaflet** representa um contentor técnico relevante dentro do frontend, uma vez que materializa uma parte central da interacção do utilizador com o domínio espacial.

### Responsabilidades principais

- apresentar o mapa base;
- permitir selecção ou ajuste da região geográfica;
- suportar a visualização da bounding box seleccionada;
- servir de ponto de partida para a pesquisa temporal.

---

## 4. Sistema externo — Copernicus Data Space Ecosystem

O **Copernicus Data Space Ecosystem** constitui o principal contentor externo do ponto de vista da execução. A aplicação comunicará com este serviço para:

- autenticação via OAuth2;
- pesquisa de produtos Sentinel-2 através da STAC API ou serviços equivalentes;
- obtenção de metadados relevantes, como datas e cobertura de nuvens;
- apoio à obtenção de recursos de pré-visualização/renderização.

### Justificação da mediação por rotas internas

A aplicação não deverá expor toda a complexidade do Copernicus directamente ao frontend. Por isso, a integração será mediada por serviços internos e rotas de API da aplicação. Esta decisão melhora:

- encapsulamento;
- clareza do código;
- tratamento de erros;
- possibilidade de futura evolução da integração sem alterar toda a interface.

---

## 5. Contentor de suporte ao desenvolvimento — GitHub

O **GitHub** funciona como contentor de suporte ao processo de desenvolvimento. Não participa no runtime da aplicação, mas suporta:

- código-fonte;
- documentação de requisitos e arquitectura;
- changelog;
- riscos;
- ADRs;
- versões do relatório;
- plano e resultados de testes.

---

## 6. Relações entre contentores

- O **Utilizador Final** interage com a **Aplicação Web Next.js**.
- A **Aplicação Web Next.js** utiliza **Leaflet** para a componente cartográfica.
- A **Aplicação Web Next.js** comunica com o **Copernicus Data Space Ecosystem** para pesquisa e acesso a dados satélite.
- O desenvolvimento da **Aplicação Web Next.js** e da documentação associada é mantido no **GitHub**.

---

## 7. Leitura arquitectural

Apesar da adopção de uma stack mais integrada, continuam a existir fronteiras arquitecturais claras:

- **interface e experiência de utilização**;
- **componente cartográfica**;
- **serviços e rotas internas de integração**;
- **sistema externo de dados**;
- **camada documental e de rastreabilidade**.

Esta descrição é suficiente para sustentar o relatório intercalar e a defesa, mantendo o projecto numa escala realista e adequada ao calendário.

---

## 8. Resumo textual do diagrama

**Browser / Utilizador** → usa → **Aplicação Web Next.js**  
**Aplicação Web Next.js** → usa → **Leaflet**  
**Aplicação Web Next.js** → consulta → **Copernicus Data Space Ecosystem**  
**Código e documentação** → mantidos em → **GitHub**
