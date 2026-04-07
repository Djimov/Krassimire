# Krassimire
Projeto de Engenharia Informatica

Titulo: Explorador Temporal de Imagens de Satélite

Descricao:

As interfaces existentes para acesso a imagens de satélite de arquivo público (Sentinel, Landsat) são orientadas para especialistas em SIG, com curvas de aprendizagem elevadas e sem foco na comparação temporal. Um utilizador geral que queira simplesmente observar como uma região mudou ao longo dos anos não tem uma ferramenta adequada.

O projeto propõe o desenvolvimento de uma aplicação web onde o utilizador define uma região num mapa interativo, seleciona um intervalo de datas, e navega numa timeline de imagens disponíveis — com possibilidade de comparar dois momentos lado a lado. Os dados serão obtidos gratuitamente via API do Copernicus Data Space Ecosystem (Sentinel-2), utilizando Cloud Optimized GeoTIFFs para streaming eficiente sem download de ficheiros completos.

A lista de especificações será construída em conjunto com o estudante, e incluirá seleção de região por bounding box, filtragem por cobertura de nuvens, visualização em diferentes composições de bandas (cor natural, infravermelho), e comparação temporal com slider. O foco do projeto é a experiência de utilização — tornar dados científicos públicos acessíveis a qualquer pessoa curiosa sobre o território.
