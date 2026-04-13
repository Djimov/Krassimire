# Levantamento de requisitos e priorização MoSCoW

## 1. Introdução

Este documento apresenta o levantamento preliminar de requisitos do projecto **Explorador Temporal de Imagens de Satélite**. O objectivo é transformar a ideia geral do sistema num conjunto de necessidades explícitas, observáveis e úteis para orientar arquitectura, implementação, testes e gestão do âmbito.

A técnica de priorização adoptada é **MoSCoW**, porque permite distinguir entre aquilo que é estritamente indispensável ao MVP e aquilo que, embora desejável, pode ser concluído numa fase posterior sem comprometer a identidade do projecto.

---

## 2. Requisitos funcionais

### RF1 — Selecção de região
O sistema deve permitir seleccionar uma área geográfica num mapa interactivo.

### RF2 — Edição da região seleccionada
O sistema deve permitir redefinir ou ajustar a área geográfica seleccionada antes de iniciar a pesquisa.

### RF3 — Definição de intervalo temporal
O sistema deve permitir introduzir uma data inicial e uma data final para a pesquisa.

### RF4 — Validação temporal
O sistema deve validar o intervalo temporal e rejeitar datas incoerentes.

### RF5 — Pesquisa de produtos Sentinel-2
O sistema deve consultar uma fonte externa e obter resultados compatíveis com a região e intervalo temporal seleccionados.

### RF6 — Filtro por cobertura de nuvens
O sistema deve permitir definir um valor máximo de cobertura de nuvens para refinar os resultados.

### RF7 — Apresentação cronológica dos resultados
O sistema deve apresentar os resultados por ordem temporal, permitindo a sua navegação.

### RF8 — Selecção de imagem individual
O sistema deve permitir seleccionar um resultado da timeline para visualização individual.

### RF9 — Visualização da imagem
O sistema deve apresentar a imagem correspondente ao resultado seleccionado.

### RF10 — Composições de bandas
O sistema deve permitir alternar entre pelo menos duas formas de visualização da imagem, por exemplo cor natural e falso infravermelho.

### RF11 — Selecção para comparação
O sistema deve permitir escolher duas imagens de datas distintas.

### RF12 — Comparação lado a lado
O sistema deve apresentar as duas imagens seleccionadas numa vista comparativa simultânea.

### RF13 — Tratamento de erros
O sistema deve apresentar mensagens compreensíveis perante ausência de resultados, falhas da API externa ou parâmetros inválidos.

---

## 3. Requisitos não funcionais

### RNF1 — Usabilidade
A aplicação deve ser suficientemente clara para utilizadores não especialistas.

### RNF2 — Modularidade
O código deve estar organizado de forma modular e manutenível.

### RNF3 — Documentação arquitectural
A arquitectura do sistema deve estar explicitamente documentada.

### RNF4 — Robustez perante falhas externas
A aplicação deve responder de forma controlada a falhas ou indisponibilidade da API externa.

### RNF5 — Rastreabilidade no GitHub
O desenvolvimento deve manter histórico regular, changelog e documentação organizada em repositório público.

### RNF6 — Testabilidade
As funcionalidades nucleares devem poder ser validadas com testes adequados.

### RNF7 — Desempenho adequado ao contexto académico
O tempo de resposta deve ser aceitável para demonstração e defesa.

### RNF8 — Coerência entre documentação e implementação
A documentação deve acompanhar a evolução real do projecto e não ser produzida apenas no final.

---

## 4. Priorização MoSCoW

## Must Have

Os requisitos **Must Have** são indispensáveis. Sem eles, o sistema deixa de responder ao problema formulado na sinopse e deixa de cumprir o núcleo mínimo do projecto.

- Selecção de região no mapa;
- Definição de intervalo temporal;
- Pesquisa de imagens Sentinel-2;
- Filtro por cobertura de nuvens;
- Timeline cronológica de resultados;
- Visualização de imagem;
- Comparação temporal lado a lado;
- Tratamento de erros e estados vazios.

### Justificação
Estes requisitos correspondem ao núcleo que torna a aplicação reconhecível como um explorador temporal de imagens de satélite. A sua ausência comprometeria directamente a demonstração do valor do sistema.

---

## Should Have

Os requisitos **Should Have** são importantes e acrescentam valor claro ao sistema, mas a sua ausência não invalida o MVP.

- Alternância entre diferentes composições de bandas;
- Melhoria progressiva da usabilidade da timeline;
- Melhor feedback visual durante carregamentos;
- Caching simples de respostas recentes.

### Justificação
Estes requisitos melhoram significativamente a experiência de utilização e tornam a demonstração mais convincente. No entanto, podem ser concluídos após estabilização do fluxo principal.

---

## Could Have

Os requisitos **Could Have** são desejáveis, mas opcionais no contexto do semestre.

- Pesquisa por topónimo ou localidade;
- Slider interactivo de comparação temporal;
- Exportação simples de metadados;
- Histórico local da sessão.

### Justificação
Estas funcionalidades aumentam o valor percebido do sistema, mas exigem esforço adicional que pode colocar em risco a conclusão do núcleo obrigatório.

---

## Won't Have (nesta fase)

Os requisitos **Won't Have** são explicitamente excluídos da versão a entregar.

- Machine learning e classificação automática;
- Análise geoespacial avançada;
- Processamento intensivo de imagem no servidor;
- Autenticação e gestão de utilizadores;
- Aplicação móvel nativa;
- Suporte alargado a múltiplas missões satélite.

### Justificação
A exclusão destes pontos protege o âmbito do projecto e reduz o risco de sobredimensionamento. O objectivo desta fase é construir um sistema funcional, coerente e defensável, não uma plataforma geoespacial completa.

---

## 5. Relação entre requisitos e MVP

Os requisitos Must Have correspondem directamente ao núcleo do MVP. Os requisitos Should Have serão desenvolvidos apenas depois de estabilizado o fluxo principal. Os Could Have ficam dependentes do progresso real obtido após implementação e testes do sistema base.

Esta relação entre requisitos e MVP será usada como referência para:

- planeamento semanal;
- produção do relatório intercalar;
- validação do sistema antes da defesa;
- argumentação sobre controlo do âmbito do projecto.
