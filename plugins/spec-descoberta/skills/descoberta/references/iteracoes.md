# Iterações versionadas

O pacote evolui em rodadas. Cada rodada é uma iteração `I-NN`: a pessoa vê algo, reage, você
ajusta. O caminho vira aprendizado no fechamento (skill `descoberta`, `references/compactacao.md`),
então **registre a reação como ela foi dita**, inclusive o que foi rejeitado.

## O que conta como iteração

Toda vez que a pessoa reage a algo mostrado: a leitura de volta da entrevista, as direções visuais,
o inventário de telas, cada versão do protótipo, os aprendizados no fechamento e as respostas a um
pacote devolvido. Pergunta e resposta da entrevista **não** são iteração (já estão nos arquivos da
spec). Em `iteracoes.md`, a mais recente fica em cima.

## Uma rodada, passo a passo

1. **Mostre** a versão atual (artifact ou HTML) e diga em 2 a 4 bullets o que mudou desde a anterior.
2. **Ouça e classifique** cada reação:
   - 👍 **manteve**: a pessoa gostou ou aprovou explicitamente.
   - 👎 **rejeitou**: a pessoa não quer. Pergunte "o que te incomodou?" se o porquê não veio.
   - 🔁 **ajustou**: quer diferente; anote de quê para quê.
3. **Grave a entrada** em `iteracoes.md` no formato do contrato, com as palavras da pessoa entre
   aspas. A versão do cabeçalho é a **mostrada** nesta rodada. Rejeição sem porquê é o aprendizado
   mais fraco: insista uma vez no porquê.
4. **Aplique** as mudanças (token, nunca valor solto; escopo novo vira `F-NNN` perguntado).
5. **Suba a versão** minor no `manifest.json` e na barra do protótipo.
6. **Foto:** se a rodada mostrou protótipo ou tokens, copie a versão **mostrada** para
   `historico/v<versao-mostrada>/` (`prototipo.html`, `tokens.json`, `telas.md`) **antes** de
   aplicar as mudanças, e cite a pasta no campo Foto. Rodada sem protótipo: `Foto: —`. No
   fechamento, a versão aprovada também ganha a sua pasta. No claude.ai, o artifact guarda as
   versões; registre o número da versão do artifact no lugar da pasta.

## Quando parar

**Quem decide que chegou é a pessoa.** Pergunte ao fim de cada rodada: "chegamos num resultado
legal ou quer mais uma rodada?". Só "chegou", "está bom assim", "é isso" ou equivalente fecham.

Sinal de convergência: duas rodadas seguidas só com ajuste cosmético (cor, texto, espaçamento) e
nenhum 👎 de fluxo ou escopo. Quando aparecer, **sugira** fechar ("as últimas duas rodadas só
mexeram em detalhe; quer fechar aqui e deixar o resto para o build?"), mas não feche sem o sim.

Sinal de que não converge: o mesmo item 🔁 em três rodadas (vai e volta). Pare e pergunte o
critério ("o que faria você bater o martelo nisso?"), registre como `D-NN` e siga.

O "chegou" vira `D-NN` com a data: **é a aprovação do protótipo**. Não pergunte de novo no
fechamento; o fechamento só pergunta se pode compilar e gerar o pacote.
