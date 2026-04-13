# Fluxos de utilização

## Fluxo principal do MVP

1. o utilizador abre a aplicação;
2. selecciona uma região no mapa;
3. define data inicial e final;
4. define o limite de cobertura de nuvens;
5. inicia a pesquisa;
6. consulta os resultados apresentados cronologicamente;
7. selecciona uma imagem para visualização;
8. alterna entre composições de bandas;
9. escolhe duas imagens para comparação;
10. abre a vista comparativa lado a lado.

## Fluxos alternativos relevantes

### Sem resultados
- o utilizador efectua a pesquisa;
- o sistema não encontra produtos compatíveis;
- é apresentada uma mensagem explícita de ausência de resultados.

### Erro externo
- o utilizador inicia a pesquisa;
- a API externa falha ou não responde;
- a aplicação apresenta erro controlado sem bloquear a interface.
