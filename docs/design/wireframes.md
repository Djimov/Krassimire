# Wireframes e protótipo de navegação

Explorador Temporal de Imagens de Satélite
Krassimire Iankov Djimov · 2301201 · Universidade Aberta

---

## Nota sobre este ficheiro

Os wireframes foram desenvolvidos como protótipo interactivo HTML/JS durante as
semanas 5–6. O ficheiro wireframes.pdf será exportado e adicionado a esta pasta
antes do intercalar, conforme exigido pelo guia da UC (secção 5).

---

## Princípios de design (RNF1)

1. **Fluxo guiado em 4 passos** — cada passo só fica disponível após o anterior.
2. **Linguagem simples** — sem jargão técnico. "Quase sem nuvens" em vez de "cobertura 10%".
3. **Comparação explícita** — botão "Comparar duas datas" sempre visível após pesquisa.

---

## Passo 1 — Escolha do lugar

**Modo "Lugares populares":** grelha de 6 cartões (Lisboa, Amazónia, Mar de Aral, Alpes Suíços, Delta do Nilo, Dubai). Um clique avança.

**Modo "Desenhar no mapa":**
- Campo de pesquisa por topónimo com debounce 400ms e dropdown de sugestões (RF1b)
- Mapa Leaflet com tiles OpenStreetMap
- Clique e arrasto para desenhar bounding box (rectângulo verde #1D9E75)
- Painel de coordenadas (SW, NE, área aproximada)
- Botões "Desenhar novamente" e "Confirmar esta região"

## Passo 2 — Período temporal

Pílulas seleccionáveis: 2019–2020, 2020–2021, 2021–2022, 2022–2023, 2023–2024, 2024–2025.

## Passo 3 — Cobertura de nuvens

Três opções: "Quase sem nuvens" (10%) · "Algumas nuvens OK" (30%) · "Mostrar tudo" (100%).
Texto explicativo dinâmico abaixo das opções.

## Passo 4 — Resultados e comparação

- Faixa horizontal de miniaturas com data e % nuvens
- Visualização principal da imagem seleccionada
- Toggle de bandas espectrais: Natural · Vegetação · Humidade
- Botão "Comparar duas datas" → painel Antes/Depois com duas colunas
- Comparação lado a lado com etiquetas coloridas e dica contextual

## Cabeçalho

Título + subtítulo com nome e número do estudante. Toggle PT/EN no canto superior direito.

## Estados de erro (RF13)

Mensagens amigáveis em PT/EN para: sem resultados, API indisponível, região inválida.
