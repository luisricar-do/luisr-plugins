# Checklist da pré-avaliação

Cada item: ✅ ok · ⚠️ ok com risco (vai para o parecer) · ❌ lacuna (pergunta para a pessoa).

## Completude (contrato)
- [ ] Todos os arquivos do contrato existem e o `manifest.json` bate com o conteúdo (contagens).
- [ ] O checklist de fechamento da descoberta foi cumprido (aceites, estados de tela, aprovação do protótipo como `D-NN`).
- [ ] `Q-NN` em aberto: nenhuma bloqueia o MVP, ou a que bloqueia está sinalizada.

## Consistência
- [ ] Toda `F-NNN` do MVP tem aceite testável (dá para escrever um teste que passa ou falha).
- [ ] Toda `F-NNN` do MVP com interface tem `T-NN`; toda `T-NN` cita `F-NNN`.
- [ ] A `T-NN` **permite cumprir** o aceite da `F-NNN` que cita: as ações do aceite (criar, editar,
  desativar...) existem na tela. Tela que só lista não cumpre aceite de edição.
- [ ] Toda "coisa guardada" é criada por alguém e lida por alguém (sem dado órfão).
- [ ] A tabela "quem pode o quê" cobre toda ação de escrita do MVP.
- [ ] Regras `R-NN` não se contradizem.

## Viabilidade
- [ ] Integrações do MVP: existe API documentada? custo? sandbox? (cada desconhecido é risco)
- [ ] Volume e picos cabem num monólito modular com Postgres (default). Se não, por quê?
- [ ] Requisito offline, tempo real ou mobile nativo está explícito (muda a arquitetura).
- [ ] Prazo e orçamento são compatíveis com o número de fatias estimado.

## Segurança e LGPD
- [ ] Todo dado pessoal tem titular e finalidade.
- [ ] Dado sensível (saúde, biometria, religião, criança) ou financeiro identificado: risco alto, exige `SEC-NN` específicos.
- [ ] Existe papel de administrador e está claro o que ele vê.
- [ ] Setor regulado (financeiro, saúde, seguro) identificado e citado no parecer.

## Iterações e aprendizados
- [ ] `aprendizados.md` existe, cada `A-NN` tem evidência (`I-NN`/`D-NN`) e confiança.
- [ ] Nenhum `A-NN` contradiz a spec final (ex.: "não faça X" e uma `T-NN` que faz X). Contradição é
  lacuna: a pessoa decide qual vale.
- [ ] "Decisões que mudaram de lado": o estado final bate com `03-funcionalidades.md` e `decisoes.md`.
- [ ] Muitas iterações no mesmo tema sem convergir (ver `iteracoes.md`) é risco de escopo: citar no parecer.

## Design
- [ ] `tokens.json` válido no contrato (com `primaria-texto` e `borda-campo`) e com todos os pares de contraste.
- [ ] O protótipo abre sozinho e navega por todas as `T-NN`.
- [ ] Componentes do `design-system.md` cobrem o que as telas usam.
