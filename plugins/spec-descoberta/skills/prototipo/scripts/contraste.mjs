// Checks every contrast pair of the spec contract in both themes.
// Usage: node contraste.mjs <tokens.json>      Exit 1 if any pair fails.
import { readFileSync } from 'node:fs';

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

const file = process.argv[2];
if (!file) { console.error('uso: node contraste.mjs <tokens.json>'); process.exit(2); }
const tokens = JSON.parse(readFileSync(file, 'utf8'));
let falhas = 0;
for (const tema of ['cor', 'cor-escuro']) {
  const cores = tokens[tema];
  if (!cores) { if (tema === 'cor') { console.log(`✖ falta o grupo "${tema}"`); falhas++; } continue; }
  console.log(`\n${tema === 'cor' ? 'Tema claro' : 'Tema escuro'}`);
  for (const [a, b, min] of PAIRS) {
    const [ca, cb] = [cores[a], cores[b]];
    if (!/^#[0-9A-Fa-f]{6}$/.test(ca ?? '') || !/^#[0-9A-Fa-f]{6}$/.test(cb ?? '')) {
      console.log(`  ✖ ${a} / ${b}: ausente ou fora de #RRGGBB (${ca ?? '—'}, ${cb ?? '—'})`); falhas++; continue;
    }
    const r = ratio(ca, cb);
    const ok = r >= min;
    if (!ok) falhas++;
    console.log(`  ${ok ? '✔' : '✖'} ${a} ${ca} sobre ${b} ${cb}: ${r.toFixed(2)} (mín. ${min})`);
  }
}
console.log(falhas ? `\n${falhas} par(es) reprovado(s)` : '\nTodos os pares passam');
process.exit(falhas ? 1 : 0);
