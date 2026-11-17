---
name: padroes
description: Padrões de engenharia do método para código novo em TypeScript/Node - stack, estrutura de pastas e camadas (routes, services, domain, repositories, adapters), config, erros, logging, segurança, testes, Docker, CI com gates e deploy. Use sempre que for escrever, revisar ou estruturar código num projeto do spec-build (tem spec/APROVACAO.md), e quando pedirem "segue meus padrões", "do jeito que eu faço", "estrutura esse serviço", "como organizo as camadas", "monta o CI", "revisa se está no padrão".
---

# padroes: como o código é escrito aqui

Estes são os defaults do método. Quando a spec técnica (`spec/tecnica/stack.md`) tiver ADR que
diverge, **o ADR vence**: ele é decisão explícita para aquele produto. Provedor de nuvem, de
identidade e de registry não são fixos aqui: cada produto escolhe no ADR.

## Regras (sempre)

1. **Stack:** Node 24, ESM (`"type": "module"`), TypeScript strict com `NodeNext`, `ES2022`,
   `noUncheckedIndexedAccess`, `verbatimModuleSyntax`. pnpm via corepack com `packageManager` fixado.
2. Import relativo termina em `.js`. Use `import.meta.url`, nunca `__dirname`. Arquivos em kebab-case.
3. **Config:** o parser é puro (`src/config/env.ts`, exporta `parseEnv`, não lê nada no import) e
   tem teste; o único módulo que lê `process.env` é `src/config/index.ts`, que valida no boot e falha
   com a lista do que falta. Na web, `src/server/config.ts`. `.env.example` comentado sempre atualizado.
4. Atalho de dev (auth fake, TLS desligado, seed) é **proibido** com `NODE_ENV=production`, e o boot
   recusa subir se estiver ligado.
5. **Camadas:** rota fina → service (caso de uso) → domain (regra pura, sem I/O) · repository (SQL) ·
   adapter (sistema externo). Dependência só aponta para dentro. Detalhe e exemplo:
   `references/camadas.md`.
6. Monte a app numa fábrica (`buildApp(deps)`) sem `listen`, para testar com `inject()`. Injeção de
   dependência manual, por parâmetro. `server.ts` só chama a fábrica e escuta.
7. **Erros:** classes nomeadas (`NotFoundError`, `ForbiddenError`, `ValidationError`,
   `ConflictError`) com `name` definido; um único mapeador na borda HTTP. Mensagem de driver ou stack
   nunca chega ao cliente.
8. 401 é autenticação, 403 é autorização, 500 é infra. **Nunca** responda 401 para falha de infra.
9. JWT com algoritmo fixado (`RS256`), sem identidade default; autorização checada no service, por
   papel **e** por dono do recurso.
10. Valide toda entrada externa por schema na borda (zod; Ajv se o contrato já é JSON Schema).
11. **Log estruturado** (pino) com `requestId`. Registre chaves e IDs; **nunca** valor de argumento,
    token, segredo ou dado pessoal. Auditoria é best-effort: falhar ao auditar não derruba a operação.
12. **Testes:** toda lógica pura nova tem teste unitário (Vitest, em `test/`). Rota testada com
    `inject()`. Integração contra Postgres real no CI. Dados de teste sempre fictícios.
13. Antes de dizer "pronto": `pnpm typecheck`, `pnpm test` e `pnpm build` verdes. Sem exceção.
14. **Docker:** multi-stage, Node em versão exata (de preferência por digest), `USER node`, só deps
    de produção no runtime, `.dockerignore` excluindo `.env*`.
15. **CI:** `pnpm install --frozen-lockfile`, typecheck, test, build, `pnpm audit --prod
    --audit-level high`, gitleaks, e um grep anti-drift para cada invariante crítica do projeto.
    Actions fixadas por SHA.
16. **Deploy:** imagem num registry de containers com tag imutável `:sha`, login no cloud por OIDC
    (sem secret de longa duração), `environment: Production`, smoke test em `/ready`, rollback
    escrito no topo do workflow.
17. Segredo só no cofre de segredos do provedor ou no secret do ambiente; nada em código, arquivo de
    variáveis de IaC, imagem ou log.
18. **Comentário explica o porquê**, não o quê. Regra que nasceu de incidente cita o incidente.
19. **Idioma:** identificadores, comentários e logs em inglês; README, docs, commits e PR em pt-BR;
    texto para o usuário final na língua do produto. Isso inclui **rotas, tabelas e colunas**
    (`/appointments`, `appointments.starts_at`), mesmo com a spec em pt-BR: o termo do negócio é
    mapeado para o identificador na seção "Mapa de nomes" de `spec/tecnica/dados.md`.
20. **Commits:** Conventional Commits em pt-BR, `tipo(escopo): resultado concreto`. PR pequeno, uma
    fatia por PR.
21. Nunca rode contra produção, suba infra ou faça deploy sem pedido explícito do dono do projeto.

## Quando ler o quê

| Situação | Leia |
|---|---|
| Criar ou mexer em rota, service, domínio, repositório, adapter | `references/camadas.md` |
| Auth, input, segredo, log, LGPD, headers | `references/seguranca.md` |
| Escrever testes | `references/testes.md` |
| CI, Docker, deploy | `references/ci-e-deploy.md` |
| Frontend (Next, tokens, componentes) | `references/frontend.md` |
