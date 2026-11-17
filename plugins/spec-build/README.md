# spec-build

Do pacote de spec ao código, com os padrões do método e gates.

| Skill | Faz |
|---|---|
| `pre-avaliacao` | Gate 0: checklist do pacote, decisões técnicas com ADR, spec técnica (`spec/tecnica/`), aprova ou devolve |
| `scaffold` | esqueleto do repo: pnpm monorepo, Fastify, Next BFF, config validada, Docker, CI com gates |
| `build` | orquestra uma fatia por vez pelos gates G1 a G5 |
| `padroes` | as regras de código (camadas, erros, config, segurança, testes, CI, frontend) |

| Agente | Papel | Escreve código? |
|---|---|---|
| `arquiteto` | plano da fatia (`spec/tecnica/fatias/S-NN.md`) | só o plano |
| `dev-backend` | migrations, domain, repository, service, routes, adapters | sim |
| `dev-frontend` | telas fiéis ao protótipo e aos tokens | sim |
| `testador` | um teste por critério de aceite + negativos de auth | testes |
| `revisor-seguranca` | SEC-NN, ASVS L1, scanners | não |
| `revisor-codigo` | camadas, padrões, spec, simplicidade | não |

Gates: G0 spec aprovada · G1 plano · G2 build verde · G3 segurança · G4 revisão · G5 aceite humano.
Detalhe em `skills/build/references/gates.md`.

Hook de guarda (`hooks/guard.mjs`): só age em pastas com `spec/manifest.json`.
