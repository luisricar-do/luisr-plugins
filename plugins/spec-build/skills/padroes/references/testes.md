# Testes

| Nível | O quê | Onde | Roda |
|---|---|---|---|
| Unitário | `domain`, parsers de config, mappers, services com fakes | `apps/*/test/*.test.ts` | `pnpm test` (local e CI) |
| Rota | `buildApp(fakes)` + `app.inject()`: status, contrato de saída, 401/403/400 | `apps/api/test/routes/` | `pnpm test` |
| Integração | repository contra Postgres real (service container no CI) | `apps/api/test/integration/` | `pnpm test:integration` |
| E2E | jornada `J-NN` principal no navegador (Playwright) | `e2e/` | local e antes do aceite G5 |

## Regras
- Cada critério de aceite da fatia vira pelo menos um teste com o ID no nome:
  `it('F-012: gerente cancela pedido pendente', ...)`.
- Toda rota protegida tem os três testes negativos: sem sessão (401), papel errado (403), recurso
  de outro dono (403/404).
- Rota que devolve dado pessoal tem teste de que campo não pedido **não** volta.
- Dados fictícios; nada de base de produção copiada.
- Teste não depende de ordem nem de relógio real (injete `now()`).
- Sem meta de cobertura numérica: a meta é aceite coberto + caminhos de erro do domínio cobertos.
