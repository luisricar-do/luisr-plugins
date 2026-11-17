// Generates CSS variables from spec/design/tokens.json with the same rule as the prototype:
// cor.primaria -> --cor-primaria ; every "<group>-escuro" overrides "<group>" under prefers-color-scheme and [data-tema="escuro"].
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const [src, out] = process.argv.slice(2);
if (!src || !out) throw new Error('usage: gen-tokens.mjs <tokens.json> <out.css>');
const tokens = JSON.parse(readFileSync(src, 'utf8'));
const vars = (group, prefix) => Object.entries(group ?? {}).map(([k, v]) => `  --${prefix}-${k}: ${v};`).join('\n');

const SUFFIX = '-escuro';
const base = Object.entries(tokens).filter(([g]) => !g.endsWith(SUFFIX)).map(([g, v]) => vars(v, g)).join('\n');
const dark = Object.entries(tokens).filter(([g]) => g.endsWith(SUFFIX)).map(([g, v]) => vars(v, g.slice(0, -SUFFIX.length))).join('\n');
let css = `/* GENERATED from ${src}. Do not edit. Run: pnpm tokens */\n:root {\n${base}\n}\n`;
if (dark) {
  css += `@media (prefers-color-scheme: dark) {\n  :root:not([data-tema="claro"]) {\n${dark.replace(/^/gm, '  ')}\n  }\n}\n`;
  css += `:root[data-tema="escuro"] {\n${dark}\n}\n`;
}
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, css);
console.log(`tokens: ${out}`);
