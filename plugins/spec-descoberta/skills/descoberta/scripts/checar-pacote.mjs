// Runs the ⚙️ items of the closing checklist against a spec/ folder (contract 1.1).
// Usage: node checar-pacote.mjs <spec dir>     Exit 1 if any check fails.
// It reads only; it never fixes. Judgment items (taste, real personal data) stay with the person.
import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = process.argv[2];
if (!dir) { console.error('uso: node checar-pacote.mjs <pasta spec>'); process.exit(2); }
const here = dirname(fileURLToPath(import.meta.url));
const read = (f) => (existsSync(join(dir, f)) ? readFileSync(join(dir, f), 'utf8') : null);
const ids = (text, re) => [...new Set([...(text ?? '').matchAll(re)].map((m) => m[1] ?? m[0]))];

const results = [];
const check = (label, ok, detail = '') => results.push({ label, ok, detail });

// --- files of the contract
const required = ['manifest.json', 'README.md', '00-visao.md', '01-personas.md', '02-jornadas.md', '03-funcionalidades.md',
  '04-dados-e-integracoes.md', '05-regras-e-restricoes.md', '06-glossario.md', 'decisoes.md', 'iteracoes.md', 'aprendizados.md',
  'design/tokens.json', 'design/design-system.md', 'design/telas.md', 'design/prototipo/index.html'];
const missing = required.filter((f) => !existsSync(join(dir, f)));
check('Todos os arquivos do contrato existem', missing.length === 0, missing.join(', '));

const jornadas = read('02-jornadas.md') ?? '';
const funcs = read('03-funcionalidades.md') ?? '';
const dados = read('04-dados-e-integracoes.md') ?? '';
const regras = read('05-regras-e-restricoes.md') ?? '';
const decisoes = read('decisoes.md') ?? '';
const iteracoes = read('iteracoes.md') ?? '';
const aprendizados = read('aprendizados.md') ?? '';
const telasMd = read('design/telas.md') ?? '';
const proto = read('design/prototipo/index.html') ?? '';

// --- journeys
const jBlocks = jornadas.split(/^## (?=J-\d{2})/m).slice(1);
const jSemErro = jBlocks.filter((b) => !/se der errado/i.test(b) || !/^\s*1\./m.test(b) || !/resultado/i.test(b)).map((b) => b.slice(0, 4));
check('Cada J-NN tem passos numerados, "Se der errado" e resultado', jBlocks.length > 0 && jSemErro.length === 0, jSemErro.join(', '));

// --- features
const fRows = [...funcs.matchAll(/^\|\s*(F-\d{3})\s*\|(.*)$/gm)].map((m) => ({ id: m[1], cells: m[2].split('|').map((c) => c.trim()) }));
const prio = (r) => r.cells.find((c) => /^(mvp|depois|fora)$/i.test(c))?.toLowerCase();
const semPrio = fRows.filter((r) => !prio(r)).map((r) => r.id);
check('Cada F-NNN tem prioridade (MVP / depois / fora)', fRows.length > 0 && semPrio.length === 0, semPrio.join(', '));
const fBlocks = Object.fromEntries(funcs.split(/^## (?=F-\d{3})/m).slice(1).map((b) => [b.slice(0, 5), b]));
const semAceite = fRows.filter((r) => prio(r) !== 'fora' && !/quando\b/i.test(fBlocks[r.id] ?? '')).map((r) => r.id);
check('Cada F-NNN (não "fora") tem aceite "Quando…, … consegue…"', semAceite.length === 0, semAceite.join(', '));
const mvp = fRows.filter((r) => prio(r) === 'mvp').map((r) => r.id);
const mvpSemJornada = mvp.filter((id) => !jornadas.includes(id));
check('Toda F-NNN do MVP aparece em uma jornada', mvpSemJornada.length === 0, mvpSemJornada.join(', '));
check('MVP ≤ 12, ou D-NN confirmando', mvp.length <= 12 || /mvp[^\n]*(1[3-9]|[2-9]\d)|confirm[^\n]*mvp/i.test(decisoes), `MVP = ${mvp.length}`);
const aConfirmar = funcs.split('\n').filter((l) => /\(a confirmar\)/i.test(l) && !/Q-\d{2}/.test(l)).map((l) => l.slice(0, 50));
check('Todo "(a confirmar)" tem Q-NN na mesma linha', aConfirmar.length === 0, aConfirmar.join(' | '));

// --- data and rules
const coisas = dados.split(/^### /m).slice(1);
const semDono = coisas.filter((b) => !/quem cria/i.test(b) || !/quem v[êe]/i.test(b)).map((b) => b.split('\n')[0]);
check('Cada coisa guardada tem "Quem cria" e "Quem vê"', semDono.length === 0, semDono.join(', '));
const integ = dados.split(/^## Integra/m)[1]?.split(/^## /m)[0] ?? '';
const integSemMvp = [...integ.matchAll(/^\|(?!\s*-)(?!\s*Com\s*\|)(.*)\|\s*$/gm)].filter((m) => !/\b(sim|não|nao)\b/i.test(m[1])).map((m) => m[1].split('|')[0].trim());
check('Toda integração tem "No MVP?" preenchido', integSemMvp.length === 0, integSemMvp.join(', '));
check('Seção "Dados pessoais" existe', /^##\s*Dados pessoais/im.test(regras));

// --- design: contrast
try {
  execFileSync(process.execPath, [join(here, 'contraste.mjs'), join(dir, 'design/tokens.json')], { stdio: 'pipe' });
  check('tokens.json passa em todos os pares de contraste', true);
} catch (e) {
  const out = String(e.stdout ?? '').split('\n').filter((l) => l.includes('✖')).map((l) => l.trim());
  check('tokens.json passa em todos os pares de contraste', false, out.join(' | '));
}

// --- design: prototype
const tokBlock = proto.match(/<script id="tokens" type="application\/json">([\s\S]*?)<\/script>/);
let tokOk = false;
try { tokOk = !!tokBlock && JSON.stringify(JSON.parse(tokBlock[1])) === JSON.stringify(JSON.parse(read('design/tokens.json'))); } catch { /* invalid */ }
check('Tokens embutidos no protótipo são válidos e iguais ao tokens.json', tokOk);
check('Script do protótipo trata todo grupo *-escuro', /endsWith\(['"]-escuro['"]\)/.test(proto));
const sections = [...proto.matchAll(/<section\b([^>]*)>/g)].map((m) => m[1]).filter((a) => /class="[^"]*\btela\b/.test(a)).map((a) => a.match(/\bid="([^"]+)"/)?.[1]).filter(Boolean);
const telas = ids(telasMd, /^##+\s*(T-\d{2})\b/gm);
const telaSemSection = telas.filter((t) => !sections.includes(t));
check('Toda T-NN de telas.md tem section no protótipo', telas.length > 0 && telaSemSection.length === 0, telaSemSection.join(', '));
const sectionSemTela = sections.filter((s) => !telas.includes(s.match(/^T-\d{2}/)?.[0] ?? '') || (s !== s.match(/^T-\d{2}/)?.[0] && !telasMd.includes(s)));
check('Toda section do protótipo é T-NN ou T-NN-<estado> listada em telas.md', sectionSemTela.length === 0, sectionSemTela.join(', '));
const hrefs = ids(proto, /href="#(T-[\w-]+)"/g).concat(ids(proto, /location\.hash\s*=\s*['"]#(T-[\w-]+)['"]/g));
const hrefQuebrado = hrefs.filter((h) => !sections.includes(h));
check('Todo href="#T-…" aponta para section existente', hrefQuebrado.length === 0, hrefQuebrado.join(', '));
const mvpSemTela = mvp.filter((id) => !telasMd.includes(id));
check('Toda F-NNN do MVP aparece em alguma T-NN (ou não tem interface)', mvpSemTela.length === 0, `sem tela: ${mvpSemTela.join(', ')} (ok se não tem interface)`);
check('Existe D-NN com o "chegou" da pessoa', /^\|\s*D-\d{2}[^\n]*(chegou|aprov)/im.test(decisoes) && !/~~D-\d{2}~~[^\n]*(chegou|aprov)/i.test(decisoes));

// --- iterations and learnings
const iters = ids(iteracoes, /^##\s*(I-\d{2})\b/gm);
check('iteracoes.md tem I-01 e ao menos 2 iterações', iters.includes('I-01') && iters.length >= 2, `${iters.length} iterações`);
const fotos = ids(iteracoes, /\*\*Foto:\*\*\s*(historico\/[^\s]+?)\/?\s*$/gm);
const fotoFaltando = fotos.filter((f) => !existsSync(join(dir, f)));
check('Toda foto citada existe em historico/', fotoFaltando.length === 0, fotoFaltando.join(', '));
const aRows = [...aprendizados.matchAll(/^\|\s*(A-\d{2})\s*\|(.*)$/gm)];
const todosIds = new Set([...ids(iteracoes, /\b(I-\d{2})\b/g), ...ids(decisoes, /\b(D-\d{2})\b/g)]);
const aSemEvid = aRows.filter((m) => { const ev = ids(m[2], /\b([ID]-\d{2})\b/g); return ev.length === 0 || ev.some((e) => !todosIds.has(e)); }).map((m) => m[1]);
check('Todo A-NN tem evidência (I-NN/D-NN) que existe', aRows.length > 0 && aSemEvid.length === 0, aSemEvid.join(', '));

// --- manifest
let man = {};
try { man = JSON.parse(read('manifest.json')); } catch { /* reported below */ }
const qAbertas = ids(decisoes.split(/^##\s*Perguntas em aberto/im)[1] ?? '', /^\|\s*(Q-\d{2})\b/gm);
const esperado = {
  jornadas: jBlocks.length, funcionalidades: fRows.length, mvp: mvp.length, telas: telas.length,
  perguntas_abertas: qAbertas.length, iteracoes: iters.length, aprendizados: aRows.length,
};
const difs = Object.entries(esperado).filter(([k, v]) => man.contagens?.[k] !== v).map(([k, v]) => `${k}: manifest ${man.contagens?.[k]} x real ${v}`);
check('manifest.json: contagens batem com o pacote', difs.length === 0, difs.join('; '));
check('manifest.json: contrato 1.1, autor e ambiente_de_origem', man.contrato === '1.1' && !!man.autor && ['claude-code', 'claude-ai'].includes(man.ambiente_de_origem),
  `contrato=${man.contrato} autor=${man.autor || '—'} ambiente=${man.ambiente_de_origem || '—'}`);

// --- report
let falhas = 0;
for (const r of results) {
  if (!r.ok) falhas++;
  console.log(`${r.ok ? '✔' : '✖'} ${r.label}${!r.ok && r.detail ? `\n    ${r.detail}` : ''}`);
}
console.log(falhas ? `\n${falhas} de ${results.length} itens falharam` : `\nTodos os ${results.length} itens ⚙️ passaram`);
process.exit(falhas ? 1 : 0);
