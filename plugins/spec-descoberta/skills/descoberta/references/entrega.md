# Entrega do pacote

O ZIP leva tudo de `spec/`, inclusive `iteracoes.md`, `aprendizados.md` e `historico/`, e nunca
`tecnica/` nem `APROVACAO.md` (são da pré-avaliação).

## No Claude Code (tem sistema de arquivos)

O pacote já está em `./spec/`. No fechamento:

1. Confira o protótipo sem interface gráfica: o JSON de tokens embutido é válido e todo
   `href="#T-…"` tem section (o checklist tem esses itens). Com interface, abra também:
   `open spec/design/prototipo/index.html` (macOS) ou `xdg-open` (Linux).
2. Gere o ZIP **na pasta que contém `spec/`** (a raiz do projeto), ao lado dela:

   ```bash
   zip -r "spec-<slug>-v<versao>.zip" spec -x "spec/tecnica/*" "spec/APROVACAO.md" "*.DS_Store"
   ```

   Se a pasta for um repositório git, o ZIP não vai para o git: confira que `*.zip` está no
   `.gitignore` ou avise a pessoa.
3. Se a pasta for um repositório git, **não faça commit sem a pessoa pedir**. Sugira a mensagem:
   `docs(spec): pacote de descoberta v<versao> pronto para avaliação`.
4. Diga o caminho completo do ZIP e que é ele que vai para a pré-avaliação.

## No claude.ai (sem pasta de projeto)

O estado está no artifact "Spec — <produto>". No fechamento, gere os arquivos do pacote seguindo o
contrato e entregue um ZIP. Use o primeiro caminho que estiver disponível:

1. **Execução de código / criação de arquivos habilitada:** escreva cada arquivo em `spec/` no
   ambiente, rode o mesmo `zip` acima e ofereça o arquivo para download.
2. **Só artifacts:** publique um artifact HTML "Pacote — <produto>" que contém o conteúdo de cada
   arquivo num objeto JS e um botão **Baixar ZIP** que monta o arquivo com JSZip
   (`https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js`) e dispara o download.
   Mostre também a lista dos arquivos com um botão de copiar cada um, para o caso de o download
   estar bloqueado.

No claude.ai o `historico/` pode ficar vazio (as versões estão no artifact); `iteracoes.md` registra
o número da versão do artifact em cada rodada.

## Depois da entrega

A pessoa envia o ZIP para quem faz a pré-avaliação técnica. Se o pacote voltar com status
`devolvido`, a pessoa reabre esta skill com o ZIP devolvido anexado ("retomar a descoberta"): o
Passo 0 começa pelas perguntas do `tecnica/parecer.md`, e cada resposta é uma nova iteração.
