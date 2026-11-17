# luisr-pluguins

Marketplace pessoal de plugins de Claude Code. Hoje tem dois plugins para construir software com
**spec antes do código**:

```
 pessoa com a ideia                avaliador técnico                 time / agentes
┌──────────────────┐   ZIP    ┌──────────────────────┐        ┌─────────────────────────┐
│ spec-descoberta  │ ───────▶ │ spec-build:          │ ─────▶ │ spec-build:             │
│ entrevista       │          │ pre-avaliacao (G0)   │        │ scaffold → build        │
│ protótipo        │ ◀─────── │ spec técnica         │        │ fatia a fatia, G1…G5    │
│ pacote spec/     │ devolvido│ aprova ou devolve    │        │ 6 subagentes            │
└──────────────────┘          └──────────────────────┘        └─────────────────────────┘
```

| Plugin | Para quem | Skills | Agentes |
|---|---|---|---|
| [`spec-descoberta`](plugins/spec-descoberta) | quem tem a ideia (não técnico) | `descoberta`, `prototipo` | — |
| [`spec-build`](plugins/spec-build) | avaliador e quem constrói | `pre-avaliacao`, `scaffold`, `build`, `padroes` | `arquiteto`, `dev-backend`, `dev-frontend`, `testador`, `revisor-seguranca`, `revisor-codigo` |

O que passa de um para o outro é a pasta `spec/`, definida em [`docs/contrato-spec.md`](docs/contrato-spec.md).

## Instalar (Claude Code)

```bash
claude plugin marketplace add luisricar-do/luisr-pluguins
```

```bash
claude plugin install spec-descoberta@luisr-pluguins
```

```bash
claude plugin install spec-build@luisr-pluguins
```

O repo é privado: a máquina precisa do `gh` logado na conta `luisricar-do`. Para desenvolver os
plugins localmente, use o caminho da pasta no lugar de `luisricar-do/luisr-pluguins`.

## Usar no claude.ai (só o Plugin 1)

```bash
npm run zip:claude-ai
```

Gera `dist/claude-ai/descoberta.zip` e `dist/claude-ai/prototipo.zip`. No claude.ai: Configurações →
Capacidades → Skills → enviar cada ZIP. A pessoa conversa normalmente ("tenho uma ideia de
sistema") e no fim baixa o `spec-<slug>-v<versao>.zip`.

## Fluxo

1. **Descoberta** (`/spec-descoberta:descoberta`): entrevista em 8 blocos, leitura de volta,
   3 direções visuais, tokens, telas e protótipo. O pacote itera em versões (`I-NN`, com foto em
   `historico/`) até a pessoa dizer que chegou; no fechamento, as iterações são compactadas em
   `aprendizados.md` (faça / não faça) que o build segue. Sai o pacote `spec/` com status
   `pronto-para-avaliacao`.
2. **Pré-avaliação** (`/spec-build:pre-avaliacao`): o avaliador recebe o ZIP, roda o checklist,
   toma as decisões técnicas (default do método, divergência com ADR) e gera `spec/tecnica/`.
   Aprova (`APROVACAO.md`) ou devolve com perguntas em linguagem simples.
3. **Scaffold** (`/spec-build:scaffold`): monorepo pnpm, API Fastify, web Next BFF, config
   validada, Docker, CI com os gates.
4. **Build** (`/spec-build:build`): uma fatia `S-NN` por vez — plano (G1), implementação pelos
   subagentes, build verde (G2), segurança (G3), revisão com os aprendizados (G4), aceite humano (G5).

## Guardas

O `spec-build` instala um hook `PreToolUse` que, **só em pastas com `spec/manifest.json`**, bloqueia:
escrita em `.env` (por ferramenta ou pelo shell), segredo literal em arquivo ou comando (chaves,
tokens, URL de banco não local com senha), `git push` na main (inclusive `git push` sem argumentos
estando na main), force push (`--force`, `-f`, `+ref`) e `git commit --no-verify`/`-n`.

## Manutenção

```bash
npm run validate
```

Confere manifests, frontmatter (limites do claude.ai), o contraste do exemplo de tokens do contrato e
do protótipo base, e se as cópias compartilhadas são idênticas (`docs/contrato-spec.md` nas três
`references/`, `iteracoes.md` e `contraste.mjs` nas duas skills do Plugin 1). Mudou o contrato:
copie para as três cópias e suba a versão dos dois plugins.

Para conferir um pacote de spec gerado:

```bash
node plugins/spec-descoberta/skills/descoberta/scripts/checar-pacote.mjs <pasta>/spec
```
