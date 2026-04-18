# Fluxos de utilização

Explorador Temporal de Imagens de Satélite
Krassimire Iankov Djimov · 2301201 · Universidade Aberta

---

## Fluxo principal — Exploração temporal básica

Este é o fluxo mínimo que o utilizador percorre para atingir o objectivo principal
da aplicação: ver imagens de satélite de um lugar ao longo do tempo.

```
Abrir a aplicação
    │
    ▼
[Passo 1] Escolher lugar
    ├── Opção A: Clicar num lugar popular → confirmado imediatamente
    └── Opção B: Mudar para "Desenhar no mapa"
            ├── Escrever nome do lugar → seleccionar sugestão → mapa navega
            └── Clicar e arrastar no mapa → confirmar região
    │
    ▼
[Passo 2] Escolher período
    └── Clicar numa pílula de período (ex: 2023–2024)
    │
    ▼
[Passo 3] Escolher clareza das imagens
    └── Clicar numa opção (ex: "Quase sem nuvens")
    │
    ▼
[Passo 4] Clicar "Ver imagens de satélite"
    │
    ├── [Sucesso] Faixa de miniaturas aparece
    │       └── Clicar numa miniatura → imagem principal actualiza
    │               └── Toggle de banda → imagem muda (TCI / NDVI / SWIR)
    │
    └── [Sem resultados] Mensagem sugere aumentar o filtro de nuvens
```

---

## Fluxo secundário — Comparação temporal

Continua a partir do passo 4 com resultados disponíveis.

```
[Resultados visíveis]
    │
    ▼
Clicar "Comparar duas datas"
    │
    ▼
Painel de comparação abre
    │
    ├── Coluna "Antes": clicar numa imagem → marcada com "A" (verde)
    └── Coluna "Depois": clicar noutra imagem → marcada com "B" (azul)
    │
    ▼
Comparação lado a lado aparece automaticamente
    └── Dica contextual: "Notas alguma diferença na vegetação?"
```

---

## Fluxo de erro — API Copernicus indisponível

```
[Passo 4] Clicar "Ver imagens de satélite"
    │
    ▼
Pedido à API falha (timeout ou erro HTTP)
    │
    ▼
Mensagem amigável: "Serviço temporariamente indisponível. Tenta novamente."
    └── Botão de pesquisa reactivado para nova tentativa
```

---

## Fluxo de internacionalização

```
[Qualquer ecrã]
    │
    ▼
Clicar toggle "EN" no cabeçalho
    │
    ▼
Toda a interface muda para Inglês sem recarregar a página
    └── Clicar "PT" restaura o Português
```

---

## Critérios de demonstração do MVP

Para a defesa, o fluxo de demonstração mínimo a percorrer é:

1. Abrir a aplicação em localhost:3000
2. Seleccionar "Lisboa" nos lugares populares
3. Escolher o período 2023–2024
4. Escolher "Quase sem nuvens"
5. Clicar "Ver imagens de satélite" e obter resultados
6. Clicar numa imagem e ver a visualização principal
7. Alternar entre TCI, NDVI e SWIR
8. Abrir o painel de comparação e seleccionar duas datas
9. Mostrar a comparação lado a lado
10. Demonstrar uma mensagem de erro (ex: região inválida ou sem resultados)
