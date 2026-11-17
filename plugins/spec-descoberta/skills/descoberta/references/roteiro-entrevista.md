# Roteiro da entrevista

Oito blocos. Em cada um: faça as perguntas-núcleo (no máximo 4 por mensagem), use as de
aprofundamento só se a resposta vier rasa, devolva o entendimento e grave depois do "sim".

## A — O sonho → `00-visao.md`

Núcleo:
1. Em uma frase, que problema esse sistema resolve? Para quem?
2. Como essa pessoa resolve isso hoje (planilha, WhatsApp, papel, outro sistema)? O que dói nisso?
3. Daqui a 6 meses com o sistema no ar, o que mudou? Como você saberia que deu certo?
4. O sistema tem um nome, mesmo provisório? E como você se chama (vai como autora/autor do pacote)?

Aprofundamento: quem paga por isso (se for produto vendido)? Existe algo parecido no mercado que
você usa de referência, para copiar ou para fugir?

Grave: problema, público, situação atual, resultado esperado com 1 a 3 sinais de sucesso
mensuráveis ("fechar o caixa em 10 minutos em vez de 1 hora"), nome provisório e slug. O nome da
pessoa vai em `manifest.json` → `autor`.

## B — Pessoas → `01-personas.md`

Núcleo:
1. Quem usa o sistema? Liste os tipos de pessoa (ex.: cliente, atendente, gerente, administrador).
2. Para cada tipo: o que ela quer resolver, com que frequência entra, e de onde (celular na rua,
   computador no escritório, tablet no balcão)?
3. Quantas pessoas de cada tipo, mais ou menos, no começo?
4. Alguém só olha (relatório, aprovação) sem operar?

Grave uma persona por tipo: nome fictício, papel, objetivo, frequência, dispositivo, contexto,
nível de familiaridade com tecnologia, o que a irrita.

## C — Jornadas → `02-jornadas.md`

Núcleo:
1. Quais são as 3 coisas mais importantes que as pessoas fazem no sistema?
2. Para a primeira: me conte o passo a passo, do momento em que a pessoa abre até terminar.
3. O que pode dar errado no meio (dado faltando, pagamento recusado, sem internet)?
4. Alguém precisa ser avisado no fim (e-mail, WhatsApp, notificação)?

Repita 2 e 3 para as outras jornadas. Grave `J-01..J-NN` com: persona, gatilho, passos numerados,
caminhos de erro, resultado e aviso. Cada passo que mostra algo na tela será uma `T-NN` depois.

## D — Funcionalidades e prioridade → `03-funcionalidades.md`

Monte a lista a partir das jornadas e pergunte o que falta. Depois classifique **com a pessoa**,
mandando a lista inteira numa pergunta só (conta como 1) com as três opções:

- **MVP**: sem isso o produto não resolve o problema do bloco A.
- **Depois**: melhora muito, mas dá para lançar sem.
- **Fora**: não vamos fazer (registrar evita a pergunta voltar).

Para cada `F-NNN`: nome, descrição em uma linha, persona, jornada, prioridade e **aceite em
linguagem simples** no formato "Quando <situação>, <pessoa> consegue <resultado>".

Teste de corte: se o MVP tem mais de 12 funcionalidades, pergunte quais 3 sairiam primeiro se o
prazo caísse pela metade.

## E — Dados e integrações → `04-dados-e-integracoes.md`

Núcleo:
1. Que informações o sistema precisa guardar? (ex.: clientes, pedidos, produtos, agendamentos)
2. Essas informações já existem em algum lugar? Precisa importar planilha ou base antiga?
3. O sistema precisa conversar com algo de fora? (pagamento, nota fiscal, WhatsApp, e-mail,
   Google, login com Google/Microsoft, ERP, mapa)
4. Precisa de relatório ou exportação? Qual pergunta o relatório responde?

Grave cada "coisa guardada" no vocabulário da pessoa, com os campos que ela citou, quem cria,
quem vê e volume aproximado. Integrações: o quê, para quê, se é obrigatório no MVP.

## F — Regras e restrições → `05-regras-e-restricoes.md`

Núcleo:
1. Tem regra de negócio que o sistema precisa obedecer? (ex.: "desconto acima de 10% precisa de
   aprovação do gerente", "agendamento com 24h de antecedência")
2. Quem pode ver e fazer o quê? Alguém não pode ver algo?
3. O sistema guarda dado pessoal (CPF, telefone, endereço, saúde, financeiro)? De quem?
4. Prazo desejado, faixa de orçamento, idioma(s), precisa funcionar sem internet?

Aprofundamento: acessibilidade (público idoso, deficiência visual), horário de uso, picos (ex.:
Black Friday), exigência legal do setor.

Grave `R-NN` para regras; uma tabela "quem pode o quê" (persona × ação); a seção de dados pessoais
listando tipo de dado e titular (insumo da LGPD na pré-avaliação); restrições.

## G — Identidade visual → insumo da skill `prototipo`

Núcleo:
1. Já tem marca? Logo, cores, fonte, manual? (peça o arquivo ou a cor em hex se tiver)
2. Cite 2 ou 3 sites ou apps que você acha bonitos ou fáceis de usar. O que gosta em cada um?
3. Escolha 3 palavras para a sensação: ex. sério, acolhedor, moderno, divertido, premium, simples,
   técnico, jovem.
4. Claro, escuro ou os dois? Telas mais "arejadas" ou mais "cheias de informação"?

Aprofundamento: algo que você **não** quer (cor, estilo, "cara de sistema antigo")? É mais site de
apresentação, painel de gestão ou app de uso diário?

Sem hex da marca: não trave. A skill `prototipo` propõe o tom, marca como provisório numa `Q-NN` e
segue. Duas cores de marca (ex.: preto e dourado): pergunte qual vai no botão principal; essa é a
`primaria`.

Não grave arquivo: passe tudo para a skill `prototipo`.

## H — Conteúdo e tom → `design/design-system.md` (Tom)

Núcleo:
1. O sistema fala com a pessoa como? "Você" ou "o senhor"? Formal ou descontraído?
2. Quem escreve os textos e quem fornece as imagens (fotos de produto, ilustrações)?
3. Tem alguma mensagem que precisa aparecer sempre (aviso legal, termo de uso)?

Grave a seção Tom com 3 exemplos de microtexto (botão, mensagem de erro, estado vazio).
