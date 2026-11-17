# CI e deploy

## CI (`.github/workflows/ci.yml`) — roda em todo PR e push na main
1. `actions/checkout` (por SHA) · `corepack enable` · `pnpm install --frozen-lockfile`
2. `pnpm typecheck` · `pnpm test` · `pnpm build`
3. `pnpm test:integration` com `services: postgres`
4. `pnpm audit --prod --audit-level high`
5. Gitleaks (`gitleaks/gitleaks-action` por SHA, ou `docker run zricethezav/gitleaks`)
6. Greps anti-drift do produto (um passo por invariante), ex.:
   - nenhum `process.env` fora de `apps/api/src/config/` e de `apps/web/src/server/config.ts`
   - `tokens.css` igual ao gerado de `spec/design/tokens.json` (`git diff --exit-code` depois de `pnpm tokens`)
   - nenhum `NEXT_PUBLIC_` em `apps/web`
   - todo arquivo em `apps/web/src/server/` começa com `import 'server-only'`

O template está na skill `scaffold` (`templates/ci.yml`).

## Docker
Multi-stage: `deps` (pnpm fetch) → `build` → `runtime` (só `dist` + deps de produção, `USER node`,
`NODE_ENV=production`, `HEALTHCHECK` em `/ready`). Node em versão exata. Template em `scaffold`.

## Deploy (só quando o dono pedir)
- Merge na main → build da imagem → Trivy → push no registry (ex.: GHCR) `:<sha>` → nova revisão no
  runtime de containers escolhido no ADR, identificada pelo sha → smoke `/ready` → promove `:latest`.
- Login no cloud por OIDC (federated credential do provedor), `environment: Production`.
- Bloco de rollback no topo do workflow: o comando para voltar à revisão anterior.
- Infra como código (Terraform ou OpenTofu) num repo/pasta própria, `fmt -check` + `validate` + `plan` antes de `apply`
  manual.
