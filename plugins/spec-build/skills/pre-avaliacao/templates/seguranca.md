# Segurança e LGPD

## Ameaças (STRIDE nos pontos de entrada)
| Ponto | Ameaça | Controle | Requisito |
|---|---|---|---|
| Login | Spoofing | OIDC, algoritmo fixado, sessão httpOnly | SEC-01 |

## Requisitos verificáveis
- **SEC-01** — Toda rota exige sessão válida, exceto as listadas em `api.md` como públicas.
- **SEC-02** — Autorização checada no service, por papel e por dono do recurso (sem IDOR).
- **SEC-03** — Toda entrada externa validada por schema antes do service.
- **SEC-04** — Nenhum segredo no código, na imagem ou no log; config só por env validado no boot.
- **SEC-05** — Log e auditoria registram chaves e IDs, nunca dado pessoal ou token.
- **SEC-06** — Dependências sem vulnerabilidade alta (`pnpm audit --prod --audit-level high`).
- **SEC-07** — Headers de segurança na web (CSP, HSTS, X-Content-Type-Options, frame-ancestors).
- **SEC-08** — Rate limit nas rotas de login e escrita pública.

## LGPD
| Dado pessoal | Titular | Finalidade | Base legal sugerida | Retenção | Direitos (acesso, correção, exclusão) |
|---|---|---|---|---|---|
