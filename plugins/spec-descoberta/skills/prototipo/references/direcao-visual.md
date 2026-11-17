# Direção visual

## Como montar as 3 direções

As três devem ser **diferentes de verdade**, não três tons de azul. Varie em três eixos:

| Eixo | Exemplos de polos |
|---|---|
| Temperatura da paleta | fria (azuis, cinzas) · quente (terracota, âmbar) · neutra com acento forte |
| Tipografia | geométrica sem serifa (Inter, Manrope) · humanista (Source Sans 3, Nunito Sans) · serifa nos títulos (Fraunces, Lora) |
| Densidade e forma | arejado com raio grande · compacto com raio pequeno · intermediário |

Se a pessoa tem marca, as três respeitam a cor da marca como `primaria` e variam o resto. Duas cores
de marca: a `primaria` é a que vai no botão principal (pergunte se não souber). Sem hex: proponha o
tom, registre como provisório numa `Q-NN` ("hex do dourado da marca") e siga. Se citou referências,
uma das direções é a "mais parecida com a referência" e diga qual.

Nomeie cada direção com 2 palavras que remetam às 3 palavras do bloco G ("Sereno e confiável",
"Vibrante e próximo").

## Fontes

Só Google Fonts, no máximo 2 famílias, pesos 400/600/700. Sempre com fallback `system-ui`.

## Paleta mínima

Os campos de `cor` e `cor-escuro` do contrato, todos obrigatórios (incluindo `primaria-texto` e
`borda-campo`). Derive o escuro, não inverta: fundo escuro levemente azulado ou aquecido conforme a
direção, `primaria` mais clara para manter contraste, superfícies separadas por luminosidade e
sombras mais fortes e discretas em `sombra-escuro`.

## Checagem de contraste (WCAG AA)

Os pares obrigatórios e os mínimos estão na tabela do contrato (`references/contrato-spec.md`,
seção `design/tokens.json`). Cores sempre em hex de 6 dígitos (`#RRGGBB`): a função abaixo não lê
`#RGB`, `rgb()` nem nomes.

Com execução de código: `node scripts/contraste.mjs design/tokens.json` (na pasta desta skill)
confere todos os pares nos dois temas. Sem ela, use a função dentro do artifact de comparação e
mostre o resultado ao lado de cada par:

```js
function lum(hex){const c=hex.replace('#','').match(/../g).map(h=>{let v=parseInt(h,16)/255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]}
function contraste(a,b){const [x,y]=[lum(a),lum(b)].sort((m,n)=>n-m);return (x+.05)/(y+.05)}
```

Par reprovado: ajuste a luminosidade do token até passar, e diga à pessoa o que mudou. Marca que
não passa como texto: mantenha a `primaria` (botão) e ajuste só a `primaria-texto`.
