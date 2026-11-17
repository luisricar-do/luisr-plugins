# Segurança

Base: OWASP ASVS nível 1 como piso, mais os `SEC-NN` de `spec/tecnica/seguranca.md` do produto.

## Autenticação e sessão
- OIDC, com o provedor que o ADR escolheu (ex.: Keycloak, Auth0, Entra ID, Google, ou o do cliente). Na web, o Next é BFF: o token fica no servidor, sessão em
  cookie `httpOnly`, `Secure`, `SameSite=Lax`, cifrada (iron-session ou equivalente).
- Verificação de JWT com JWKS e **algoritmo fixado** (`algorithms: ['RS256']`), `iss` e `aud` checados.
- Sem identidade default: requisição sem credencial válida é 401, ponto.
- Falha ao buscar JWKS ou falar com o IdP é 500/503, nunca 401.

## Autorização
- No service, não na rota: papel **e** posse do recurso (evita IDOR).
- Lista de permissões explícita por ação; ausência de regra é negar.
- Admin enxerga o que a spec diz, não "tudo".

## Entrada
- Schema na borda para body, params, query e headers usados. Rejeite campo desconhecido em escrita.
- Upload: tipo por conteúdo (magic bytes), tamanho máximo, nome gerado pelo servidor, fora do webroot.
- Nunca monte SQL, shell, caminho de arquivo ou HTML com string do usuário.

## Segredos e config
- Só por env validado no boot; em produção vêm do cofre de segredos do provedor ou do secret do ambiente.
- `.env` no `.gitignore` e no `.dockerignore`; `.env.example` sem valor real.
- No Next, nada de `NEXT_PUBLIC_*` com segredo; módulos de servidor começam com `import 'server-only'`.

## Log, auditoria e LGPD
- Log registra chaves, IDs e códigos; nunca valor de campo pessoal, token, senha ou corpo de resposta externa.
- Auditoria de escrita relevante (quem, o quê, quando, recurso) em tabela própria, best-effort.
- Dado pessoal: só o que a finalidade da spec pede; retenção da `tecnica/dados.md`; exclusão real
  quando o titular pede (ou anonimização documentada).

## Web
- Headers: CSP restritiva (sem `unsafe-inline` em script), HSTS, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `frame-ancestors 'none'`.
- CSRF: `SameSite` + verificação de origem nas mutações do BFF.
- Rate limit em login, cadastro e qualquer escrita pública.

## Dependências e supply chain
- `pnpm audit --prod --audit-level high` no CI bloqueia.
- Lockfile sempre commitado; `--frozen-lockfile` no CI.
- Actions do GitHub fixadas por SHA; scanner de imagem (Trivy) antes de publicar.
- Gitleaks no CI e no pre-commit.

## Achados: severidade
| Severidade | Exemplos | Gate G3 |
|---|---|---|
| Crítica | segredo no código, SQL injection, auth bypass, IDOR em dado pessoal | bloqueia |
| Alta | sem autorização numa rota de escrita, dado pessoal em log, dependência com CVE alta | bloqueia |
| Média | header faltando, rate limit ausente, erro vazando detalhe interno | corrigir na fatia ou registrar com prazo |
| Baixa | melhoria de robustez | registrar |
