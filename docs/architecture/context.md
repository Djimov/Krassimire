# Arquitectura — C4 nível 1 (Contexto)

## 1. Objectivo do diagrama de contexto

O modelo C4 nível 1 descreve o sistema no seu contexto mais amplo, identificando os principais actores externos e os sistemas com os quais interage. No caso do **Explorador Temporal de Imagens de Satélite**, o objectivo deste nível é deixar claro quem usa o sistema, qual é a fronteira da solução desenvolvida e de que dependências externas o projecto necessita para funcionar.

---

## 2. Sistema em foco

O sistema em desenvolvimento é uma aplicação web para pesquisa, visualização e comparação temporal de imagens Sentinel-2. A sua responsabilidade principal é transformar dados públicos de observação da Terra num fluxo de utilização simples e visual, adequado a utilizadores não especialistas.

O sistema não produz autonomamente dados satélite. O seu valor está na mediação entre o utilizador e os serviços externos de dados, oferecendo uma interface mais clara, orientada ao problema de exploração temporal de uma região geográfica.

---

## 3. Actores e sistemas externos

### 3.1 Utilizador Final

O actor principal do sistema é o **Utilizador Final**, que acede à aplicação através de um navegador web. Este utilizador pretende:

- seleccionar uma região geográfica num mapa;
- definir um intervalo temporal;
- filtrar resultados por cobertura de nuvens;
- visualizar resultados de pesquisa;
- comparar duas imagens de datas diferentes.

O utilizador não necessita de conhecimentos aprofundados de SIG ou de observação da Terra. A aplicação deverá, por isso, reduzir a complexidade técnica exposta.

### 3.2 Copernicus Data Space Ecosystem

O **Copernicus Data Space Ecosystem** é o sistema externo mais relevante. Fornece:

- mecanismos de autenticação;
- catálogos e metadados de produtos Sentinel-2;
- endpoints para descoberta de produtos;
- serviços adequados para obtenção de recursos de visualização.

Trata-se de uma dependência essencial, pois o projecto não mantém um catálogo satélite próprio.

### 3.3 GitHub

O **GitHub** não participa na execução da aplicação, mas é um sistema externo fundamental para o desenvolvimento. Serve como:

- repositório público do projecto;
- base de documentação;
- instrumento de rastreabilidade;
- mecanismo de acompanhamento assíncrono do trabalho.

---

## 4. Relações principais

- O **Utilizador Final** interage com o **Explorador Temporal de Imagens de Satélite** através de um navegador.
- O **Explorador Temporal de Imagens de Satélite** consulta o **Copernicus Data Space Ecosystem** para obter produtos e recursos associados a imagens Sentinel-2.
- O desenvolvimento, a documentação e o histórico do **Explorador Temporal de Imagens de Satélite** são mantidos no **GitHub**.

---

## 5. Interpretação arquitectural

Este nível do modelo C4 mostra que o sistema tem uma fronteira claramente definida:

- o utilizador interage apenas com a aplicação web;
- o acesso a dados satélite é mediado por serviços externos especializados;
- o desenvolvimento e a documentação existem fora do runtime da aplicação, mas são essenciais ao processo académico do projecto.

A representação contextual é importante para a defesa técnica, porque ajuda a demonstrar que o valor do sistema não reside na geração dos dados, mas na forma como organiza, simplifica e apresenta esses dados de modo útil ao utilizador.

---

## 6. Resumo textual do diagrama

**Utilizador Final** → usa → **Explorador Temporal de Imagens de Satélite**  
**Explorador Temporal de Imagens de Satélite** → consulta → **Copernicus Data Space Ecosystem**  
**Projecto/Documentação** → mantido em → **GitHub**
