# ADR-004: Documentação com modelo C4 e ADRs no repositório

**Estado:** Aceite
**Data:** 2026-03-18
**Autor:** Krassimire Iankov Djimov — 2301201

## Contexto

O projecto académico requer documentação técnica coerente com o código e defensável perante um júri externo independente. O orientador e o júri devem conseguir compreender as decisões arquitecturais sem ler cada linha de código. O guia da UC exige explicitamente C4 níveis 1 e 2, ADRs e modelo de dados.

## Decisão

Documentar a arquitectura com o modelo C4 (níveis 1 e 2) e registar todas as decisões técnicas significativas com ADRs armazenados em docs/architecture/decisions/. O código deve ter comentários extensivos em Português para facilitar revisão e defesa.

## Alternativas consideradas

- **Documentação apenas no README**: insuficiente para a profundidade exigida pelo guia da UC.
- **UML (diagramas de classe e sequência)**: válido mas mais verboso e menos adequado para comunicar arquitectura de alto nível a um júri não técnico. Pode ser usado em complemento nos ADRs.
- **Arc42**: framework mais completo mas com overhead excessivo para um projecto individual semestral.
- **Comentários em Inglês**: comum na indústria mas desfavorável para revisão académica por um orientador e júri portugueses.

## Justificação

O modelo C4 é amplamente reconhecido na indústria, tem documentação excelente em c4model.com, e foi explicitamente recomendado no guia da UC (secção 9). Os ADRs criam rastreabilidade explícita entre contexto, decisão e consequências — exactamente o que um júri externo precisa para avaliar se as decisões foram tomadas conscientemente e não por acidente. Os comentários em Português facilitam a leitura do código na defesa e eliminam a barreira linguística para o orientador.

## Consequências

- Cada decisão arquitectural significativa tem um ADR correspondente em docs/architecture/decisions/
- Os diagramas C4 são mantidos actualizados em docs/architecture/ (ficheiros .png)
- O Capítulo 2 do relatório final seguirá a mesma estrutura da documentação do repositório, evitando trabalho duplicado
- O orientador pode acompanhar a evolução das decisões de forma assíncrona via GitHub
- O código é comentado em Português desde o início do desenvolvimento
