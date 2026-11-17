# Frontend

## Stack
Next 15 (App Router) + React 19 como **BFF**: o navegador fala só com o Next; o Next fala com a API
com a sessão do servidor. Sem framework de UI pesado: CSS com variáveis vindas dos tokens.

```
apps/web/src/
  app/                      # rotas (uma pasta por T-NN agrupada por jornada)
  server/                   # chamadas à API, sessão, auth — todo arquivo com import 'server-only'
  components/ui/            # botão, campo, card, tabela, selo, aviso, vazio (do design-system.md)
  components/<dominio>/     # composição por domínio
  styles/tokens.css         # GERADO de spec/design/tokens.json (não editar à mão)
  lib/
```

## Tokens
- `pnpm tokens` gera `styles/tokens.css` a partir de `spec/design/tokens.json` com a mesma regra do
  protótipo (`cor.primaria` → `--cor-primaria`; todo grupo `<nome>-escuro` substitui `<nome>` em
  `prefers-color-scheme` e `[data-tema="escuro"]`).
- Link e anel de foco usam `--cor-primaria-texto`; contorno de campo usa `--cor-borda-campo`. Nunca
  `--cor-primaria` como cor de texto.
- Componente nunca usa cor, tamanho ou raio literal; só `var(--...)`.

## Aprendizados da descoberta
- `spec/aprendizados.md` traz o que a pessoa já viu e rejeitou (`não faça`) e o que ela quer
  (`faça`). Os `A-NN` de categoria `visual`, `fluxo` e `conteudo` valem para toda tela, inclusive as
  que não estavam no protótipo. Divergir de um `A-NN` exige `D-NN` com o motivo.
- `historico/` e `iteracoes.md` não são referência de implementação: é o caminho, não o destino.

## Fidelidade ao protótipo
- `spec/design/prototipo/index.html` é a referência visual de cada `T-NN`: estrutura, textos,
  estados (vazio, carregando, erro, sucesso). Divergência intencional vira `D-NN` em `spec/decisoes.md`.
- Microtexto (botões, erros, vazios) segue a seção Tom do `design-system.md`.

## Acessibilidade (piso)
- Todo campo com `<label>`; erro ligado por `aria-describedby`; foco visível; navegação por teclado.
- Contraste AA (já garantido nos tokens, não quebre com opacidade).
- Alvo de toque ≥ 44px; layout funciona em 360px de largura.
- `lang` correto no `<html>`; imagens com `alt` ou `alt=""` se decorativas.

## Dados
- Server Components buscam no servidor; Client Component só onde há interação.
- Mutação por Server Action ou rota do BFF, sempre revalidando a sessão e a origem.
