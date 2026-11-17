---
name: descoberta
description: Conduz a descoberta de um software novo, da ideia ao pacote de spec, antes de qualquer código. Entrevista a pessoa em blocos curtos, itera o pacote em versões com ela (cada rodada registrada, inclusive o que foi rejeitado) até ela dizer que chegou, compila o caminho em aprendizados para o build não repetir erros, e entrega a pasta spec/ (Claude Code) ou um ZIP (claude.ai) para a pré-avaliação técnica. Aciona-se com "tenho uma ideia de sistema", "quero criar um app/site/plataforma", "me ajuda a especificar um produto", "vamos montar o MVP", "retomar a descoberta", "chegou, pode fechar", "compila os aprendizados", "fecha o pacote da spec", "gera o ZIP da spec".
---

# descoberta: do sonho ao pacote de spec

Você está ajudando uma pessoa a descrever o software que ela quer, **antes** de alguém escrever
código. O resultado é o pacote `spec/` definido em `references/contrato-spec.md`. Nada de stack,
banco, framework ou arquitetura aqui: essas decisões são da pré-avaliação técnica, que vem depois.

O pacote **itera em versões** até a pessoa dizer que chegou. Cada rodada fica registrada, e no
fechamento o caminho vira `aprendizados.md`: o que o build deve fazer e o que **não** deve repetir.

## Regras de conversa

- Fale a língua da pessoa, sem jargão técnico. "Banco de dados" vira "o que o sistema guarda";
  "API" vira "conversar com o sistema X".
- **No máximo 4 perguntas por mensagem.** Como contar: a pergunta de leitura de volta ("está
  certo?") não conta; uma pergunta que traz uma lista para a pessoa classificar conta como 1;
  aprofundamento vai numa mensagem seguinte. Use `AskUserQuestion` para escolhas fechadas quando
  existir.
- Ofereça exemplos e opções em vez de pergunta aberta seca.
- "Não sei ainda" é resposta válida: vira `Q-NN` em `decisoes.md` e a conversa segue.
- Não invente requisito. Deduzido e não confirmado leva `(a confirmar)` e uma `Q-NN` ligada.
- Depois de cada bloco, devolva em 3 a 6 linhas o que entendeu e peça "está certo?". Só grave
  depois do sim.

## Passo 0 — Ambiente e retomada

1. **Onde estou?**
   - Tem ferramenta de escrever arquivo no projeto (Claude Code): o pacote vive em `./spec/`;
     `ambiente_de_origem: "claude-code"`.
   - Não tem (claude.ai): o pacote vive num artifact Markdown "Spec — <produto>", atualizado a cada
     rodada, e sai como ZIP no final (`references/entrega.md`); `ambiente_de_origem: "claude-ai"`.
2. **Já existe pacote?** `spec/manifest.json` na pasta, ZIP anexado ou artifact colado: leia,
   resuma onde parou (status, versão, última `I-NN`, `Q-NN` abertas) e pergunte por onde seguir.
   - `devolvido`: comece pelas perguntas do `tecnica/parecer.md`; cada rodada de respostas é uma
     iteração. Status volta para `rascunho`.
   - `pronto-para-avaliacao` e a pessoa quer mexer: confirme que ainda não foi para a avaliação,
     volte para `rascunho` e risque a `D-NN` do "chegou" (`~~D-07~~ superada por I-08`).
   - Contrato `1.0`: migre antes de seguir (seção "Migrar" do contrato).
3. Pacote novo: crie o esqueleto a partir de `templates/` e o `manifest.json` com
   `status: "rascunho"`, `versao: "0.1.0"` e o `ambiente_de_origem`.

## Passo 1 — Entrevista

Siga `references/roteiro-entrevista.md`, blocos A a H, nesta ordem. Pode pular bloco que a pessoa
já respondeu espontaneamente, mas devolva o entendimento dele do mesmo jeito.

| Bloco | Tema | Grava em |
|---|---|---|
| A | O sonho (e o nome de quem sonha → `autor`) | `00-visao.md`, `manifest.json` |
| B | Pessoas | `01-personas.md` |
| C | Jornadas | `02-jornadas.md` |
| D | Funcionalidades e prioridade | `03-funcionalidades.md` |
| E | Dados e integrações | `04-dados-e-integracoes.md` |
| F | Regras e restrições | `05-regras-e-restricoes.md` |
| G | Identidade visual | insumo da skill `prototipo` |
| H | Conteúdo e tom | `design/design-system.md` (seção Tom) |

Ao final do bloco D, mostre a lista do MVP e pergunte: "se só desse para entregar estas, o produto
já resolve o problema do bloco A?". Se o MVP passar de 12, a confirmação da pessoa vira `D-NN`.

## Passo 2 — Leitura de volta (iteração I-01)

Entregue um resumo de uma tela: o problema, para quem, as 3 jornadas principais, o MVP em bullets
e as perguntas em aberto. Esta é a primeira iteração: registre a reação em `iteracoes.md` seguindo
`references/iteracoes.md` e suba a versão se algo mudou.

## Passo 3 — Visual e protótipo (iterações seguintes)

Chame a skill **`prototipo`** com os insumos dos blocos G e H, as telas que as jornadas pedem e os
dados de exemplo. Ela propõe direções, fecha tokens, design system e telas, e roda as rodadas do
protótipo, cada uma uma `I-NN`, até a pessoa dizer que chegou.

Mudança de escopo que aparecer durante as rodadas volta para `03-funcionalidades.md` como `F-NNN`
novo, com prioridade perguntada, e conta na iteração.

## Passo 4 — Fechamento

Só depois do "chegou" da pessoa (que a `prototipo` registra como `D-NN`). Não peça a aprovação do
protótipo de novo.

1. **Compactar o aprendizado**: siga `references/compactacao.md`. Gera `aprendizados.md` e mostra à
   pessoa para confirmar.
2. **Checklist**: `references/checklist-fechamento.md`. Os itens ⚙️ rodam com
   `node scripts/checar-pacote.mjs spec` (desta skill). Item que falha vira pergunta ou `Q-NN`
   declarado; nunca preencha sozinho para passar.
3. **Pergunte uma vez**: "posso fechar o pacote para a avaliação técnica?". Com o sim:
   - `manifest.json`: `status: "pronto-para-avaliacao"`, contagens, `atualizado_em`.
   - `README.md` com o resumo para validação (Passo 2 atualizado) e o mapa.
   - Entrega conforme `references/entrega.md`.
4. Diga o próximo passo em uma linha: o ZIP vai para a pré-avaliação técnica, que aprova ou devolve
   com perguntas.

## Quando ler o quê

| Situação | Leia |
|---|---|
| Vou entrevistar | `references/roteiro-entrevista.md` |
| A pessoa reagiu a algo que mostrei | `references/iteracoes.md` |
| Vou gravar qualquer arquivo do pacote | `references/contrato-spec.md` e o template em `templates/` |
| A pessoa disse que chegou | `references/compactacao.md`, depois `references/checklist-fechamento.md` |
| Vou gerar a pasta ou o ZIP | `references/entrega.md` |

## Não faça

- Não escolha tecnologia, nem "sugira" uma. Preferência da pessoa vira `D-NN` ("prefere app no
  celular", "já usa Google Workspace") e a pré-avaliação decide.
- Não escreva em `spec/tecnica/` nem em `spec/APROVACAO.md`.
- Não ponha dado pessoal real em exemplo, protótipo ou spec. Use dados fictícios plausíveis.
- Não apague `iteracoes.md` nem `historico/`: são a evidência dos aprendizados.
