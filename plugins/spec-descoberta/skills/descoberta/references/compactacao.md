# Compactação: das iterações aos aprendizados

Roda uma vez, no fechamento, depois do "chegou" da pessoa. Transforma o histórico bruto
(`iteracoes.md`, `decisoes.md`, as fotos em `historico/`) num `aprendizados.md` curto que o build
consegue seguir. O histórico fica no pacote para auditoria; o build lê só os aprendizados.

## 1. Extrair

Leia `iteracoes.md` inteiro e liste, sem filtrar ainda:

- todo 👎 com o porquê;
- todo 🔁 (de quê para quê);
- todo 👍 dito explicitamente ("adorei", "isso aqui está ótimo");
- toda `D-NN` que reverteu outra;
- todo item que mudou de prioridade.

## 2. Agrupar e generalizar

Junte o que fala da mesma coisa e escreva **uma regra** por grupo, aplicável a telas que ainda não
existem. Ruim: "o botão da T-03 é preto". Bom: "botão primário é preto com texto dourado; dourado
nunca como fundo".

Para cada regra: categoria (`visual`, `fluxo`, `conteudo`, `escopo`, `regra`), tipo (`faça` /
`não faça`), evidência (as `I-NN` e `D-NN`) e confiança:

- `dita`: a pessoa falou.
- `inferida`: padrão em 2 ou mais iterações sem a pessoa ter dito. Exemplo: rejeitou três telas
  densas → "prefere telas com pouca informação por vez".

## 3. Descartar

Saem: ajuste pontual que não generaliza (um texto trocado numa tela), e o que já está explícito nos
arquivos da spec (não repita a `F-NNN`; o aprendizado é o que a spec **não** diz).

Meta: 5 a 15 aprendizados. Mais que 20 é sinal de que não foi generalizado.

## 4. Perfil de gosto e reviravoltas

- **Perfil de gosto**: 3 a 5 linhas com o que a pessoa valoriza e o que a incomoda, usando as
  palavras dela.
- **Decisões que mudaram de lado**: tema, caminho (`MVP (I-01) → depois (I-02)`) e estado final.
  Serve para o build não "consertar" de volta algo que já foi decidido.

## 5. Confirmar com a pessoa

Mostre o `aprendizados.md` em linguagem simples ("aprendi que você não gosta de X porque Y; está
certo?"). Esta conversa é uma iteração: registre-a como `I-NN` (tipo "aprendizados") em
`iteracoes.md`, e ela serve de evidência para o que nascer ou mudar aqui.

- Inferida **confirmada** vira `dita`, com a `I-NN` do fechamento somada à evidência.
- Inferida não confirmada sai.
- Correção ou aprendizado novo que a pessoa trouxer entra como `dita`, com a `I-NN` do fechamento.

## 6. Gravar

- `aprendizados.md` no formato do contrato.
- `manifest.json`: `contagens.iteracoes` e `contagens.aprendizados`.
- Não apague nem resuma `iteracoes.md` e `historico/`: o aprendizado aponta para eles como
  evidência.
