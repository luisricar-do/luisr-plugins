---
name: build
description: Constrói o produto a partir da spec aprovada, uma fatia (S-NN) por vez, orquestrando os subagentes arquiteto, dev-backend, dev-frontend, testador, revisor-seguranca e revisor-codigo, com gates de plano, build verde, segurança, revisão e aceite humano entre as fases. Aciona-se com "começa o build", "implementa a próxima fatia", "constrói a S-02", "segue o plano de entrega", "onde paramos no build", "roda os gates", "status das fatias".
---

# build: fatia a fatia, com gates

Você é o **orquestrador**. Não escreve o código da fatia você mesmo: delega aos subagentes, junta o
resultado, roda os gates e decide se avança. Padrões: skill `padroes`. Gates em detalhe:
`references/gates.md`. Contrato: `../../references/contrato-spec.md`.

Em toda chamada de subagente, informe `PLUGIN_DIR=<caminho absoluto da pasta do plugin>` (dois
níveis acima da pasta desta skill): é de lá que eles leem `skills/padroes/`.

## Passo 0 — Pré-condições (Gate 0)

Pare e diga o que falta se qualquer um falhar:

1. `spec/APROVACAO.md` existe com `Status: aprovado`.
2. `Versão aprovada` do `APROVACAO.md` é igual à `versao` do `spec/manifest.json`. Diferente: a spec
   mudou depois da aprovação; volta para a `pre-avaliacao`.
3. `spec/tecnica/plano-de-entrega.md` e `spec/tecnica/progresso.md` existem.
4. O repositório existe (tem `package.json` na raiz e o CI). Não existe: rode a skill `scaffold`
   antes; ela é a `S-01a`. Esta skill começa na `S-01b`.
5. Árvore git limpa e numa branch que não é a `main`: `git status --porcelain` vazio. Crie a branch
   da fatia: `git switch -c feat/<s-nn>-<slug-da-fatia>`.

Status no `manifest.json`: `aprovado` → `em-construcao` na primeira fatia.

## Passo 1 — Escolher a fatia

Leia `progresso.md`. A próxima é a primeira `S-NN` com status diferente de `concluída` cujas
dependências estão concluídas. A pessoa pediu uma específica: confira as dependências antes.
Mostre: fatia, funcionalidades, telas, aceite. Uma fatia por vez, uma branch e um PR por fatia.

## Passo 2 — Plano da fatia → **G1**

Chame o subagente **`arquiteto`** com: a fatia, os caminhos da spec que ela toca, o
`spec/aprendizados.md`, e o estado atual do repo. Ele devolve `spec/tecnica/fatias/S-NN.md` com tarefas, arquivos, contratos, migrações,
testes por critério de aceite e `SEC-NN` aplicáveis.

**G1:** mostre o plano resumido à pessoa e espere o "pode seguir". Sem isso, nada é escrito.

**Plano com `BLOQUEIO:`** (a spec não deixa decidir): mostre os bloqueios à pessoa e não implemente.
Se ela responde e a resposta não muda o que a pessoa da descoberta vai ver, registre como `D-NN` e
o arquiteto revisa o plano. Se muda (tela, fluxo, escopo, regra de negócio), a spec volta para a
`pre-avaliacao` com o bloqueio no `parecer.md`: nova versão, nova aprovação.

## Passo 3 — Implementação

Despache em paralelo quando não houver dependência, em sequência quando houver (API antes da tela
que a consome, contrato compartilhado antes dos dois):

- **`dev-backend`**: migrations, domain, repository, service, routes, adapters e testes unitários e
  de rota da fatia.
- **`dev-frontend`**: telas `T-NN` da fatia, fiéis ao protótipo e aos tokens, consumindo os
  contratos do plano.

Cada um recebe: o arquivo `S-NN.md`, as tarefas dele, os caminhos da spec, os `A-NN` que o plano
listou e "siga a skill padroes".
Peça de volta: arquivos alterados, comandos rodados e resultado, e o que ficou pendente.

## Passo 4 — Testes → **G2**

Chame o **`testador`**: ele confere que cada critério de aceite da fatia tem teste com o ID no nome,
escreve o que falta (incluindo os negativos de auth) e roda a suíte.

**G2 (determinístico, você roda):**
```bash
pnpm install --frozen-lockfile && pnpm typecheck && pnpm test && pnpm build
```
Mais `pnpm test:integration` se a fatia tocou o banco. Vermelho: devolva ao subagente responsável
com a saída do erro. No máximo 3 voltas; na quarta, pare e mostre o problema à pessoa.

## Passo 5 — Segurança → **G3**

Chame o **`revisor-seguranca`** com o diff da fatia (`git diff main...HEAD`) e os `SEC-NN`. Ele roda
os scanners disponíveis e devolve achados com severidade. **Crítica ou alta bloqueia**: volta para o
dev, corrige, repete G2 e G3. Média: corrige na fatia ou registra no `progresso.md` com prazo.

## Passo 6 — Revisão → **G4**

Chame o **`revisor-codigo`** com o diff, o `S-NN.md`, a spec e o `spec/aprendizados.md`. Ele checa
camadas, padrões, fidelidade à spec e ao protótipo, **nenhum `não faça` dos aprendizados de volta**,
simplicidade e testes. Veredito `aprovado` ou `mudanças` com
lista. Mudanças: volta para o dev e repete G2 a G4.

## Passo 7 — Aceite humano → **G5**

1. Suba o app localmente (`pnpm dev`) e mostre as telas da fatia funcionando; com navegador
   disponível, percorra a jornada e tire screenshots.
2. Mostre à pessoa: o que foi entregue por critério de aceite, resultado de cada gate e achados
   registrados.
3. Com o "aceito": proponha a mensagem de commit (`feat(<modulo>): <resultado> (S-NN)`) e o PR.
   **Commit, push e PR só com o pedido explícito da pessoa.**

## Passo 8 — Registrar

Atualize `spec/tecnica/progresso.md`: status da fatia, cada gate com data e evidência (comando e
resultado, link do PR). Mudança de rota durante a fatia (escopo, decisão técnica) vira `D-NN` ou
ADR, nunca só conversa.

## Regras do orquestrador

- Uma fatia por vez. Não comece a próxima com a anterior sem G5.
- Gate não se pula, nem a pedido de subagente. A pessoa pode **aceitar um risco** de G3/G4 média
  ou baixa por escrito; registre no `progresso.md`.
- Escopo novo descoberto no meio vira `F-NNN` proposto e volta para a pessoa; não entra na fatia.
- Nunca rode migração, seed ou comando contra banco que não seja local ou de teste. `.env` com
  cara de produção (host remoto): pare e pergunte.
- Saída de subagente é relatório, não prova: confira o diff e rode os comandos antes de declarar
  um gate verde.
