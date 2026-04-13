# C4 nível 1 — Contexto do sistema

## Sistema

**Explorador Temporal de Imagens de Satélite**

Aplicação web que permite a um utilizador seleccionar uma área geográfica, definir um intervalo temporal e explorar imagens Sentinel-2 em perspectiva temporal.

## Actores e sistemas externos

### Utilizador final
Pessoa que utiliza a aplicação através do navegador para:
- seleccionar a região de interesse;
- definir datas e filtro de nuvens;
- consultar resultados;
- visualizar e comparar imagens.

### Copernicus Data Space Ecosystem
Sistema externo do qual a aplicação obtém:
- metadados de imagens e itens de catálogo;
- informação temporal;
- cobertura de nuvens;
- renderizações e pré-visualizações geradas via APIs do ecossistema.

### GitHub
Sistema de suporte ao desenvolvimento e documentação. Não participa na execução da aplicação, mas suporta:
- código-fonte;
- rastreabilidade;
- changelog;
- documentação técnica;
- versões do relatório.

## Relações principais

1. O utilizador interage com a aplicação web.
2. A aplicação consulta o Copernicus para descoberta de dados e renderização.
3. O desenvolvimento da aplicação é mantido no GitHub.
