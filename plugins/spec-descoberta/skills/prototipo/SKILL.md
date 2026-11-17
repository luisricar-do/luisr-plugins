---
name: prototipo
description: Cria e itera o visual de um produto em especificação, antes do código - propõe direções visuais, fecha os design tokens (cores, fontes, espaçamento, claro e escuro), escreve o design system e o inventário de telas, e monta um protótipo navegável em artifact (ou HTML local) que evolui em versões com a pessoa, registrando cada rodada (o que manteve, rejeitou e ajustou) até ela dizer que chegou. Aciona-se pela skill descoberta no passo visual, ou quando a pessoa disser "mostra como vai ficar", "quero ver as telas", "muda a cor principal", "deixa mais moderno", "faz a versão escura", "ajusta a tela de cadastro", "gera o protótipo", "mais uma rodada", "chegou, está bom assim".
---

# prototipo: ver para validar

O protótipo existe para a pessoa **clicar e reagir** antes de qualquer código. Ele é a fonte da
verdade visual do pacote: o build vai reproduzir tokens, componentes e telas daqui. Siga o
contrato em `references/contrato-spec.md`.

## Onde as coisas aparecem

| | Com ferramenta de Artifact (claude.ai, app do Claude) | Sem Artifact (Claude Code no terminal) |
|---|---|---|
| Direções visuais | um artifact de comparação | `direcoes.html` na raiz do projeto (fora de `spec/`), aberto com `open` |
| Protótipo | um artifact, republicado no mesmo link a cada rodada | `spec/design/prototipo/index.html`, aberto com `open` |
| Checagem de contraste | função JS dentro do artifact | `node` com a função de `references/direcao-visual.md` |

No Claude Code, mesmo publicando artifact, o arquivo final fica em `spec/design/prototipo/index.html`.

## Passo 1 — Direções visuais (iteração)

Com os insumos do bloco G (marca, referências, 3 palavras, claro/escuro, densidade), proponha
**3 direções** contrastantes lado a lado. Cada direção mostra: paleta com hex, par de fontes, botão
primário e secundário, link, card, campo de formulário com foco, selos de sucesso/alerta/erro e um
trecho de lista, no claro e no escuro se a pessoa quiser os dois. Como montar e checar contraste:
`references/direcao-visual.md`.

Peça para escolher uma ou misturar. A escolha é `D-NN`; a reação às três é uma `I-NN`
(`references/iteracoes.md`): o que ela rejeitou nas outras duas é aprendizado.

## Passo 2 — Tokens e design system

1. Grave `design/tokens.json` no formato do contrato, com **todos** os pares de contraste passando.
   Marca clara demais para texto (dourado, amarelo, verde-limão): `primaria-texto` é uma variação
   mais escura (claro) ou mais clara (escuro) da marca. Diga à pessoa o que mudou e por quê.
2. Grave `design/design-system.md`: princípios (3 frases a partir das 3 palavras), tom (bloco H),
   componentes com quando usar e quando não usar, estados (hover, foco visível, desabilitado,
   erro), grid e breakpoints (mobile < 640px, tablet < 1024px, desktop).

## Passo 3 — Inventário de telas

Derive as telas das jornadas: cada passo que mostra algo vira uma `T-NN` ou um estado
`T-NN-<estado>`. Grave `design/telas.md` com uma seção por `T-NN`: objetivo, persona, jornada e
passo, `F-NNN` atendidas, conteúdo (campos e dados de exemplo fictícios), ações e para onde levam,
e a lista de estados com o id de cada um. Mostre a lista para a pessoa antes de desenhar.

## Passo 4 — Protótipo navegável

Parta de `assets/prototipo-base.html`. Ele já traz: tokens embutidos virando variáveis CSS,
componentes básicos, navegação por `#T-01`, barra do protótipo (lista de telas, alternar claro e
escuro, versão), menu inferior no celular e layout responsivo.

1. Cole o `tokens.json` aprovado no bloco `<script id="tokens">`.
2. Troque o `<title>`, o nome em `.marca` e os links do menu (`.app-topo nav` e `.app-abas`) pelos
   do produto. Cada link do menu tem `data-secao` com a primeira tela da seção.
3. **Uma casca por persona** quando as personas usam o produto de jeitos diferentes (ex.: cliente no
   celular e dono no painel): use `data-casca="cliente"` ou `data-casca="painel"` na section; a base
   esconde o menu do painel nas telas do cliente.
4. Uma `<section class="tela" id="T-NN" data-nome="...">` por tela e uma por estado
   (`id="T-NN-vazio"`), com dados fictícios realistas no contexto do negócio.
5. Ações levam à próxima tela da jornada (`href="#T-NN"`). Formulários não enviam nada: o botão
   leva à tela ou ao estado de sucesso.
6. Um arquivo só, sem build, sem chamada de rede além das fontes do Google Fonts.
7. Acessível: rótulo em todo campo, foco visível, contraste AA, alvo de toque ≥ 44px no mobile.
8. A versão do pacote vai na barra do protótipo (`.proto-barra .versao`).

## Passo 5 — Rodadas até chegar

Cada rodada segue `references/iteracoes.md`: mostrar, classificar a reação (👍 manteve, 👎 rejeitou,
🔁 ajustou), registrar a `I-NN` com as palavras da pessoa, aplicar, subir a versão e guardar a foto
da versão anterior em `historico/`.

- Mudança de cor, fonte ou espaço muda **o token**, nunca o valor solto numa tela.
- Escopo novo ("precisa de um relatório") vira `F-NNN` em `03-funcionalidades.md` com prioridade
  perguntada, antes de desenhar.
- Ao fim de cada rodada: "chegamos num resultado legal ou quer mais uma rodada?". Os critérios de
  sugerir parar e de destravar vai-e-volta estão na referência.
- O "chegou" vira `D-NN` com a data (é a aprovação do protótipo) e devolve o controle para a skill
  `descoberta`, que compila os aprendizados e fecha o pacote.

## Não faça

- Não use biblioteca de componentes, framework CSS ou ícones externos além de SVG inline: o
  protótipo é referência visual, não base de código.
- Não ponha logo ou marca de terceiros sem a pessoa ter fornecido.
- Não use dado pessoal real.
- Não sobrescreva uma versão sem guardar a foto dela em `historico/` (Claude Code).
