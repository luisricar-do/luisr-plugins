// Validates the marketplace: manifests agree, every skill/agent has frontmatter with name + description,
// claude.ai limits are respected, and every copy of the spec contract matches docs/contrato-spec.md.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const errors = [];
const err = (m) => errors.push(m);

const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

function frontmatter(file) {
  const m = readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z-]+):\s*(.*)$/);
    if (kv) out[kv[1]] = kv[2];
  }
  return out;
}

// Contrast pairs from the contract (docs/contrato-spec.md, design/tokens.json).
const PAIRS = [
  ['texto', 'fundo', 4.5], ['texto', 'superficie', 4.5],
  ['texto-suave', 'fundo', 4.5], ['texto-suave', 'superficie', 4.5],
  ['primaria-contraste', 'primaria', 4.5],
  ['primaria-texto', 'fundo', 4.5], ['primaria-texto', 'superficie', 4.5],
  ...['sucesso', 'alerta', 'erro'].flatMap((c) => [[c, 'fundo', 4.5], [c, 'superficie', 4.5]]),
  ['borda-campo', 'fundo', 3],
];
const lum = (hex) => {
  const c = hex.replace('#', '').match(/../g).map((h) => { const v = parseInt(h, 16) / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
function checkTokens(tokens, where) {
  for (const group of ['cor', 'cor-escuro']) {
    const cores = tokens[group];
    if (!cores) { err(`${where}: falta o grupo ${group}`); continue; }
    for (const [a, b, min] of PAIRS) {
      if (!/^#[0-9A-Fa-f]{6}$/.test(cores[a] ?? '') || !/^#[0-9A-Fa-f]{6}$/.test(cores[b] ?? '')) { err(`${where}: ${group}.${a} ou ${group}.${b} ausente ou fora de #RRGGBB`); continue; }
      const r = ratio(cores[a], cores[b]);
      if (r < min) err(`${where}: ${group} ${a}/${b} = ${r.toFixed(2)} (mínimo ${min})`);
    }
  }
}

const market = JSON.parse(readFileSync(join(ROOT, '.claude-plugin/marketplace.json'), 'utf8'));
const contract = readFileSync(join(ROOT, 'docs/contrato-spec.md'), 'utf8');
const tokensBlock = contract.match(/## design\/tokens\.json[\s\S]*?```json\n([\s\S]*?)```/);
if (!tokensBlock) err('docs/contrato-spec.md: exemplo de tokens.json não encontrado');
else checkTokens(JSON.parse(tokensBlock[1]), 'contrato (exemplo de tokens)');
const sameName = new Map(); // files that must be identical copies (e.g. iteracoes.md in two skills)

for (const p of market.plugins) {
  const dir = join(ROOT, p.source);
  const manifestPath = join(dir, '.claude-plugin/plugin.json');
  if (!existsSync(manifestPath)) { err(`${p.name}: sem plugin.json`); continue; }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.name !== p.name) err(`${p.name}: name difere do plugin.json (${manifest.name})`);
  if (manifest.version !== p.version) err(`${p.name}: version difere (${manifest.version} x ${p.version})`);
  const extras = readdirSync(join(dir, '.claude-plugin')).filter((f) => f !== 'plugin.json');
  if (extras.length) err(`${p.name}: .claude-plugin/ só pode ter plugin.json (${extras.join(', ')})`);

  for (const file of walk(dir)) {
    const rel = relative(ROOT, file);
    if (file.endsWith('/SKILL.md') || (file.includes('/agents/') && file.endsWith('.md'))) {
      const fm = frontmatter(file);
      if (!fm) { err(`${rel}: sem frontmatter`); continue; }
      if (!fm.name || !/^[a-z0-9-]{1,64}$/.test(fm.name)) err(`${rel}: name ausente ou fora de kebab-case (≤64)`);
      if (!fm.description) err(`${rel}: description ausente`);
      else if (fm.description.length > 1024) err(`${rel}: description com ${fm.description.length} caracteres (limite 1024)`);
      if (/[<>]/.test(fm.description ?? '')) err(`${rel}: description não pode ter < ou >`);
    }
    if (file.endsWith('contrato-spec.md') && readFileSync(file, 'utf8') !== contract) {
      err(`${rel}: cópia do contrato diferente de docs/contrato-spec.md (rode: cp docs/contrato-spec.md ${rel})`);
    }
    for (const shared of ['/references/iteracoes.md', '/scripts/contraste.mjs']) {
      if (!file.endsWith(shared)) continue;
      const prev = sameName.get(shared);
      if (prev && prev.text !== readFileSync(file, 'utf8')) err(`${rel}: diferente de ${prev.rel} (as cópias têm de ser iguais)`);
      sameName.set(shared, { rel, text: readFileSync(file, 'utf8') });
    }
    if (file.endsWith('prototipo-base.html')) {
      const m = readFileSync(file, 'utf8').match(/<script id="tokens" type="application\/json">([\s\S]*?)<\/script>/);
      if (!m) err(`${rel}: bloco de tokens não encontrado`);
      else checkTokens(JSON.parse(m[1]), rel);
    }
    if (file.endsWith('.json')) {
      try { JSON.parse(readFileSync(file, 'utf8')); } catch (e) { err(`${rel}: JSON inválido (${e.message})`); }
    }
  }
}

if (errors.length) {
  console.error(`✖ ${errors.length} problema(s):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`✔ ${market.plugins.length} plugins válidos`);
