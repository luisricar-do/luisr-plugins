# Contrato do pacote de spec (v1.1)

Este é o formato da pasta `spec/` que passa do plugin **spec-descoberta** (o sonho da pessoa) para
a **pré-avaliação** e daí para o plugin **spec-build** (o código). Os três lados leem e escrevem
exatamente esta estrutura. Mudou aqui, muda nos dois plugins (o `npm run validate` confere que as
cópias em `plugins/**/references/contrato-spec.md` são idênticas a este arquivo).

## Estrutura

```
spec/
  manifest.json              # identidade e estado do pacote (abaixo)
  README.md                  # resumo para validação + mapa dos arquivos
  00-visao.md                # o sonho: problema, para quem, como se resolve hoje, como é o sucesso
  01-personas.md             # quem usa, contexto de uso, dispositivo, frequência
  02-jornadas.md             # passo a passo das jornadas principais (J-01, J-02...)
  03-funcionalidades.md      # F-001... com prioridade (MVP / depois / fora) e aceite em linguagem simples
  04-dados-e-integracoes.md  # o que o sistema guarda (no vocabulário do negócio), de onde vem, com quem conversa
  05-regras-e-restricoes.md  # regras de negócio (R-01...), prazo, orçamento, dados pessoais, acesso, idioma
  06-glossario.md            # termos do negócio
  decisoes.md                # log de decisões (D-01...) e perguntas em aberto (Q-01...)
  iteracoes.md               # uma entrada por rodada com a pessoa (I-01...): o que viu, o que disse, o que mudou
  aprendizados.md            # compilado no fechamento (A-01...): o que fazer e o que NÃO fazer no build
  historico/
    v0.2.0/                  # foto de cada versão em que o protótipo mudou
      prototipo.html
      tokens.json
      telas.md
  design/
    tokens.json              # cores, tipografia, espaçamento, raio, sombra; claro e escuro
    design-system.md         # tom visual, componentes, regras de uso, o que evitar
    telas.md                 # inventário de telas (T-01...): objetivo, conteúdo, ações, estados
    prototipo/index.html     # protótipo navegável, um arquivo, sem build
  tecnica/                   # SÓ a pré-avaliação escreve aqui (plugin spec-build)
    parecer.md
    arquitetura.md
    stack.md
    dados.md
    api.md
    seguranca.md
    plano-de-entrega.md
    progresso.md             # o build atualiza a cada gate
    fatias/S-NN.md           # o plano de cada fatia (subagente arquiteto)
  APROVACAO.md               # SÓ a pré-avaliação escreve
```

`historico/` é auditoria: vai no ZIP, mas o build não lê. O que o build precisa saber do caminho
percorrido está compactado em `aprendizados.md`.

## IDs

Todo item rastreável tem ID estável. Não renumere: item removido fica marcado como `~~removido~~`.

| Prefixo | O quê | Onde nasce |
|---|---|---|
| `J-NN` | jornada | `02-jornadas.md` |
| `F-NNN` | funcionalidade | `03-funcionalidades.md` |
| `R-NN` | regra de negócio | `05-regras-e-restricoes.md` |
| `T-NN` | tela | `design/telas.md` |
| `T-NN-<estado>` | estado de uma tela (`vazio`, `erro`, `carregando`, `sucesso`...) | seção da `T-NN` em `telas.md`; section própria no protótipo |
| `D-NN` | decisão | `decisoes.md` |
| `Q-NN` | pergunta em aberto | `decisoes.md` |
| `I-NN` | iteração (rodada com a pessoa) | `iteracoes.md` |
| `A-NN` | aprendizado | `aprendizados.md` |
| `S-NN` | fatia de entrega | `tecnica/plano-de-entrega.md` |
| `ADR-NN` | decisão técnica | `tecnica/stack.md` |
| `SEC-NN` | requisito de segurança | `tecnica/seguranca.md` |

Referências cruzadas usam o ID entre crases: "a `T-03` atende a `F-012` dentro da `J-02`".

Item deduzido e ainda não confirmado pela pessoa leva `(a confirmar)` no nome e uma `Q-NN` ligada.
A prioridade continua sendo uma das três (MVP / depois / fora): a dúvida mora na `Q-NN`.

## manifest.json

```json
{
  "contrato": "1.1",
  "produto": "Nome provisório",
  "slug": "nome-provisorio",
  "versao": "0.3.0",
  "status": "rascunho",
  "atualizado_em": "2026-11-17",
  "autor": "Nome de quem sonhou",
  "ambiente_de_origem": "claude-code",
  "contagens": {
    "jornadas": 3, "funcionalidades": 18, "mvp": 9, "telas": 7,
    "perguntas_abertas": 2, "iteracoes": 5, "aprendizados": 8
  }
}
```

- `ambiente_de_origem`: `claude-code` ou `claude-ai`.
- `contagens.telas` conta só `T-NN` (sem os estados `T-NN-<estado>`).

`status` anda para a frente, com duas voltas permitidas para `rascunho`: a pessoa reabre um pacote
`pronto-para-avaliacao` antes da avaliação, ou retoma um `devolvido`. Na volta, a `D-NN` do "chegou"
fica riscada (`~~D-07~~ superada por I-08`) e as rodadas novas seguem a numeração. Cada passo tem dono:

| Status | Quem põe | Significa |
|---|---|---|
| `rascunho` | descoberta | entrevista ou protótipo em andamento |
| `pronto-para-avaliacao` | descoberta | a pessoa disse que chegou, os aprendizados foram compilados e o pacote fechou |
| `em-avaliacao` | pré-avaliação | a avaliação técnica começou |
| `devolvido` | pré-avaliação | voltou para a descoberta com perguntas (ver `tecnica/parecer.md`) |
| `aprovado` | pré-avaliação | a spec técnica existe e o build pode começar |
| `em-construcao` | build | a primeira fatia começou |

`versao` segue semver: minor a cada iteração que muda o pacote, major quando o escopo do MVP muda
depois de aprovado (o que exige nova aprovação).

## iteracoes.md

Uma entrada por rodada em que a pessoa reagiu a algo mostrado (leitura de volta, direções visuais,
protótipo, pacote):

```markdown
## I-03 — v0.4.0 — 2026-11-17 — protótipo
**Mostrado:** T-01 a T-07, tema escuro.
**Reação (palavras da pessoa):** "o dourado no botão ficou brega, parece cassino"; "agendar está fácil".
- 👍 manteve: fluxo de agendamento em 3 passos (T-01→T-03)
- 👎 rejeitou: dourado como fundo de botão → dourado só em detalhe (D-09)
- 🔁 ajustou: botão primário preto com texto dourado
**Por quê:** associa dourado chapado a "coisa barata".
**Foto:** historico/v0.4.0/
```

## aprendizados.md

Compilado no fechamento a partir de `iteracoes.md` e `decisoes.md`. É o que o build lê para não
repetir erro já cometido com a pessoa.

```markdown
## Perfil de gosto
<3 a 5 linhas: o que a pessoa valoriza e o que a incomoda, com as palavras dela>

## Aprendizados
| ID | Categoria | Regra | Tipo | Evidência | Confiança |
|---|---|---|---|---|---|
| A-01 | visual | Dourado só em detalhe (ícone, borda, texto); nunca como fundo de botão | não faça | I-03, D-09 | dita |
| A-02 | fluxo | Agendamento em no máximo 3 passos até o horário | faça | I-02, I-03 | dita |

## Decisões que mudaram de lado
| Tema | Caminho | Estado final |
|---|---|---|
| Sinal via Pix | MVP (I-01) → depois (I-02) | depois, Q-01 aberta |
```

- **Categoria:** `visual`, `fluxo`, `conteudo`, `escopo`, `regra`.
- **Tipo:** `faça` ou `não faça`.
- **Confiança:** `dita` (a pessoa falou) ou `inferida` (padrão visto em 2 ou mais iterações, sem a
  pessoa dizer). No fechamento a pessoa confirma: inferida confirmada vira `dita` (com a `I-NN` do
  fechamento na evidência) e a não confirmada sai. `inferida` só aparece no arquivo se a pessoa
  pediu para manter como hipótese, e aí o build trata como sugestão, não como regra.

## design/tokens.json

Formato plano, um nível por grupo, valores CSS válidos, cores em hex de 6 dígitos (`#RRGGBB`). O
protótipo transforma cada chave em variável CSS (`cor.primaria` → `--cor-primaria`). Todo grupo
com sufixo `-escuro` (`cor-escuro`, `sombra-escuro`) substitui o grupo de mesmo nome no tema escuro.

```json
{
  "cor": {
    "primaria": "#2F5BEA", "primaria-contraste": "#FFFFFF", "primaria-texto": "#2F5BEA",
    "fundo": "#FFFFFF", "superficie": "#F5F7FB", "borda": "#E2E6EF", "borda-campo": "#7B8599",
    "texto": "#141A2A", "texto-suave": "#5B6478",
    "sucesso": "#15803D", "alerta": "#B45309", "erro": "#DC2626"
  },
  "cor-escuro": {
    "primaria": "#7C9BFF", "primaria-contraste": "#0B1020", "primaria-texto": "#7C9BFF",
    "fundo": "#0B1020", "superficie": "#141B2E", "borda": "#26304A", "borda-campo": "#62709A",
    "texto": "#E8ECF6", "texto-suave": "#9AA4BC",
    "sucesso": "#4ADE80", "alerta": "#FBBF24", "erro": "#F87171"
  },
  "fonte": { "titulo": "'Inter', system-ui, sans-serif", "corpo": "'Inter', system-ui, sans-serif", "mono": "ui-monospace, monospace" },
  "tamanho": { "xs": "12px", "sm": "14px", "md": "16px", "lg": "20px", "xl": "28px", "2xl": "40px" },
  "espaco": { "1": "4px", "2": "8px", "3": "12px", "4": "16px", "6": "24px", "8": "32px", "12": "48px" },
  "raio": { "sm": "6px", "md": "10px", "lg": "16px", "pill": "999px" },
  "sombra": { "sm": "0 1px 2px rgb(0 0 0 / .06)", "md": "0 4px 16px rgb(0 0 0 / .08)" },
  "sombra-escuro": { "sm": "0 1px 2px rgb(0 0 0 / .4)", "md": "0 4px 16px rgb(0 0 0 / .5)" }
}
```

Para que serve cada cor que não é óbvia:

- `primaria`: fundo do botão principal. `primaria-contraste`: texto sobre ele.
- `primaria-texto`: a cor da marca usada **como texto** (link) e no anel de foco. Igual à
  `primaria` quando ela já passa no contraste; mais escura ou mais clara quando não passa (marca
  clara como dourado ou amarelo).
- `borda`: divisórias e contorno de card (decorativo). `borda-campo`: contorno de input e select,
  que precisa ser visível.

Contraste mínimo (WCAG AA), nos dois temas:

| Par | Mínimo |
|---|---|
| `texto` sobre `fundo` e sobre `superficie` | 4.5 |
| `texto-suave` sobre `fundo` e sobre `superficie` | 4.5 |
| `primaria-contraste` sobre `primaria` | 4.5 |
| `primaria-texto` sobre `fundo` e sobre `superficie` | 4.5 |
| `sucesso`, `alerta`, `erro` sobre `fundo` e sobre `superficie` | 4.5 |
| `borda-campo` sobre `fundo` | 3 |

## Migrar um pacote do contrato 1.0 para o 1.1

1. `manifest.json`: `"contrato": "1.1"`; acrescente `contagens.iteracoes` e `contagens.aprendizados`.
2. `design/tokens.json`: acrescente `primaria-texto` e `borda-campo` em `cor` e `cor-escuro`
   (opcional: `sombra-escuro`) e rode a checagem de contraste com os pares novos.
3. Protótipo: o script do bloco de tokens tem de tratar **todo** grupo `*-escuro` (copie o script de
   `assets/prototipo-base.html` da skill `prototipo`); links e foco passam a usar
   `--cor-primaria-texto` e campos `--cor-borda-campo`.
4. `iteracoes.md`: reconstrua a partir de `decisoes.md` e da conversa (se houver); a `I-01` é a
   leitura de volta. Sem foto das versões antigas: `Foto: —`.
5. Compile `aprendizados.md` (skill `descoberta`, `references/compactacao.md`) e confirme com a pessoa.
6. Suba a versão minor.

## APROVACAO.md

```markdown
# Aprovação da spec

- Produto: <nome> (`<slug>`)
- Versão aprovada: 0.4.0
- Status: aprovado | devolvido
- Avaliado por: <nome>
- Data: AAAA-MM-DD
- Escopo aprovado: S-01 a S-05 (MVP); F-0xx fora do MVP listados em tecnica/plano-de-entrega.md
- Condições: <o que tem de ser verdade para seguir, ou "nenhuma">
```

O build não começa sem `APROVACAO.md` com `Status: aprovado` e com a `versao` do `manifest.json`
igual à `Versão aprovada`.
