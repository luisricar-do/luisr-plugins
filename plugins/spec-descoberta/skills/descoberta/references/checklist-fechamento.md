# Checklist de fechamento do pacote

Roda depois da compactação dos aprendizados. Os itens ⚙️ são conferidos por
`node scripts/checar-pacote.mjs <pasta spec>` (na pasta desta skill); sem execução de código,
confira lendo. Os demais pedem julgamento. Falhou: pergunte à pessoa ou registre `Q-NN`. Não
preencha sozinho para passar.

## Visão e pessoas
- [ ] `00-visao.md` tem problema, público, situação atual e 1 a 3 sinais de sucesso mensuráveis.
- [ ] ⚙️ Toda persona citada em jornada existe em `01-personas.md`.

## Jornadas e funcionalidades
- [ ] ⚙️ Cada `J-NN` tem passos numerados, um "Se der errado" e o resultado.
- [ ] ⚙️ Cada `F-NNN` tem prioridade (MVP / depois / fora) e aceite no formato "Quando…, … consegue…".
- [ ] ⚙️ Toda `F-NNN` do MVP aparece em ao menos uma jornada.
- [ ] ⚙️ O MVP tem no máximo 12 funcionalidades, ou existe `D-NN` com a confirmação da pessoa.
- [ ] ⚙️ Todo item `(a confirmar)` tem uma `Q-NN` ligada.

## Dados, regras e restrições
- [ ] ⚙️ Cada "coisa guardada" em `04-dados-e-integracoes.md` tem "Quem cria" e "Quem vê".
- [ ] ⚙️ Toda integração tem a coluna "No MVP?" preenchida (sim / não).
- [ ] A tabela "quem pode o quê" cobre todas as personas.
- [ ] ⚙️ A seção "Dados pessoais" existe, mesmo que diga "nenhum".
- [ ] Prazo e faixa de orçamento estão preenchidos ou viraram `Q-NN`.

## Design
- [ ] ⚙️ `design/tokens.json` segue o contrato e passa em todos os pares de contraste (os dois temas).
- [ ] ⚙️ Toda `T-NN` de `design/telas.md` tem section no protótipo, **e** toda section do protótipo é
  uma `T-NN` ou `T-NN-<estado>` listada em `telas.md`.
- [ ] ⚙️ Todo `href="#T-…"` do protótipo aponta para uma section que existe.
- [ ] ⚙️ Toda `F-NNN` do MVP com interface tem pelo menos uma `T-NN`.
- [ ] Cada tela lista os estados que se aplicam (vazio, carregando, erro, sucesso).
- [ ] ⚙️ Existe `D-NN` com o "chegou" da pessoa e a data.

## Iterações e aprendizados
- [ ] ⚙️ `iteracoes.md` tem ao menos a `I-01` (leitura de volta) e uma iteração de protótipo.
- [ ] ⚙️ Toda versão citada como foto em `iteracoes.md` existe em `historico/` (só no Claude Code).
- [ ] ⚙️ Todo `A-NN` tem evidência (`I-NN` ou `D-NN`) que existe.
- [ ] A pessoa confirmou os aprendizados; nenhum `inferida` sem confirmação ficou.

## Pacote
- [ ] `decisoes.md` lista todas as `Q-NN` em aberto e diz se bloqueiam o MVP.
- [ ] Nenhum dado pessoal real: nomes, telefones, CPFs e e-mails dos exemplos são fictícios
  (telefone `(11) 90000-0000`, e-mail `@exemplo.com`).
- [ ] ⚙️ `manifest.json` com contagens corretas, `autor`, `ambiente_de_origem` e `versao` atualizada.
