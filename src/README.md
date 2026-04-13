# Código-fonte

Organizar o código segundo a arquitectura documentada em `docs/architecture/`.

## Estrutura sugerida

```text
src/
  app/
  components/
  features/
  services/
  lib/
  types/
  tests/
```

## Notas

- manter a integração com o Copernicus isolada em `src/services/`;
- manter tipos do domínio em `src/types/`;
- não colocar credenciais reais no repositório.
