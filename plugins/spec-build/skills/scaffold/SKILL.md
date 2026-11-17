---
name: scaffold
description: Cria o esqueleto do repositório de um produto com spec aprovada, no padrão do método - monorepo pnpm com apps/api (Fastify) e apps/web (Next BFF), config validada, Docker multi-stage, CI com os gates (typecheck, test, build, audit, gitleaks, greps anti-drift), tokens gerados da spec e CLAUDE.md do projeto. É a primeira parte da fatia S-01. Aciona-se com "cria o repo do produto", "faz o scaffold", "monta o esqueleto", "prepara o projeto para o build".
---

# scaffold: o esqueleto andando

Pré-condição: `spec/APROVACAO.md` aprovado (igual ao Passo 0 da skill `build`). Stack: a de
`spec/tecnica/stack.md`; os templates abaixo assumem o default do método (Node 24, pnpm, Fastify,
Next, Postgres, Vitest). ADR que diverge: adapte o template e diga o que mudou.

## Passo 1 — Repositório

1. Pasta do projeto já tem `spec/`. Se não é repo git: `git init -b main`.
2. Copie os templates de `templates/` para a raiz, trocando `<slug>` e `<Produto>`:

| Template | Destino |
|---|---|
| `package.json` | `package.json` |
| `pnpm-workspace.yaml` | `pnpm-workspace.yaml` |
| `tsconfig.base.json` | `tsconfig.base.json` |
| `gitignore` | `.gitignore` |
| `dockerignore` | `.dockerignore` |
| `env.example` | `.env.example` |
| `Dockerfile.api` | `apps/api/Dockerfile` |
| `env.ts` | `apps/api/src/config/env.ts` (parser puro) |
| `config-index.ts` | `apps/api/src/config/index.ts` (o único que lê `process.env`) |
| `errors.ts` | `apps/api/src/errors.ts` |
| `errors.test.ts` | `apps/api/test/errors.test.ts` |
| `api-package.json` | `apps/api/package.json` (base: acrescente as dependências) |
| `shared-package.json` | `packages/shared/package.json` |
| `gen-tokens.mjs` | `scripts/gen-tokens.mjs` |
| `ci.yml` | `.github/workflows/ci.yml` |
| `dependabot.yml` | `.github/dependabot.yml` |
| `CLAUDE.md` | `CLAUDE.md` |

3. **Versões:** fixe o **major** que o `stack.md` decidiu e deixe o npm escolher o minor atual:
   `pnpm add fastify@5 zod@4 next@15 react@19 react-dom@19`, `pnpm add -D typescript@5 vitest@4
   tsx @types/node@24`. Nunca `@latest` (o major pode ter mudado desde o ADR). Troque o
   `<node-exact>` do Dockerfile pela tag exata atual do Node 24 alpine.
4. Crie `apps/api`:
   - `app.ts` com `buildApp(deps)` (sem `listen`), `setErrorHandler(errorHandler)`, `@fastify/helmet`
     e `@fastify/rate-limit` registrados (`SEC-07`/`SEC-08`), rotas `/health` e `/ready` (checa o banco);
   - `server.ts` que importa `config/index.js`, chama `buildApp` e escuta, com shutdown gracioso;
   - `tsconfig.json` estendendo a base, `outDir: dist`, testes fora do `include`.
5. Crie `apps/web` (Next 15 App Router): `src/server/config.ts` (único leitor de `process.env` na
   web, com `server-only`), `src/styles/tokens.css` gerado, layout com as fontes do `tokens.json`,
   headers de segurança no `next.config` (CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
   `frame-ancestors 'none'`).
6. `packages/shared` com `tsconfig` próprio emitindo `dist/` (com `declaration`) e `src/index.ts`. Ele
   é consumido pelo `dist` (`exports` do template): o Node não carrega `.ts` de `node_modules`. Os
   `build` e `typecheck` da raiz rodam o `shared` primeiro (`pnpm -r` respeita a ordem do grafo).
7. Fixe as actions do CI por SHA, resolvendo cada tag:
   ```bash
   gh api repos/actions/checkout/commits/v4 --jq .sha
   ```
   e troque `@v4` pelo SHA com a tag em comentário (`@<sha> # v4`).

## Passo 2 — Ver andar (G2 da S-01a)

```bash
corepack enable && pnpm install && pnpm tokens && pnpm typecheck && pnpm test && pnpm build
pnpm audit --prod --audit-level high
```

- `pnpm audit` acusou vulnerabilidade alta em dependência transitiva: ponha em `pnpm.overrides`
  do `package.json` da raiz a versão corrigida que o próprio audit indica ("Patched versions"),
  rode de novo e registre como ADR curto. O CI não pode nascer vermelho.
- Depois `cp .env.example .env` **pela pessoa** (o guard bloqueia o agente) e `pnpm dev`: confira
  `/health`, `/ready` e a tela inicial.
- Com Docker disponível: `docker build -f apps/api/Dockerfile .` e suba a imagem para ver o
  `/ready`. Sem Docker, registre no `progresso.md` que a imagem não foi testada.

Registre o resultado no `spec/tecnica/progresso.md` na linha da `S-01a`.

## Passo 3 — Entregar

1. Mostre a árvore criada e o resultado dos comandos.
2. Proponha o commit `chore: esqueleto do <slug> com CI e gates (S-01a)`. Commit e criação de repo
   remoto só com pedido explícito.
3. A `S-01a` (esqueleto) fecha aqui. A `S-01b` (login e a primeira tela real) segue pela skill
   `build`, com plano, gates e aceite como qualquer fatia.

## Não faça

- Não crie recurso de nuvem, repo remoto, secret ou pipeline de deploy agora. O deploy entra numa
  fatia própria e só quando o dono pedir.
- Não copie `.env` de outro projeto nem ponha valor real no `.env.example`.
