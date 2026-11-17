# <Produto>

Produto construído pelo método spec → pré-avaliação → build (plugins `spec-descoberta` e `spec-build`).

## Fonte da verdade
- O que construir: `spec/` (contrato em `spec/README.md`). Decisões técnicas: `spec/tecnica/`.
- Andamento e gates: `spec/tecnica/progresso.md`.
- Padrões de código: skill `padroes` do plugin `spec-build`. ADR em `spec/tecnica/stack.md` vence o padrão.

## Regras
- Uma fatia `S-NN` por branch e por PR (`feat/s-nn-<slug>`). Nada direto na `main`.
- Antes de concluir qualquer coisa: `pnpm typecheck && pnpm test && pnpm build` verdes.
- Escopo novo vira `F-NNN` proposto em `spec/03-funcionalidades.md`, nunca entra calado.
- Nunca rodar migração, seed ou script contra banco que não seja local/teste.
- Commit, push, PR, deploy e criação de recurso de nuvem só com pedido explícito.
- Prosa em pt-BR; identificadores, comentários e logs em inglês.
