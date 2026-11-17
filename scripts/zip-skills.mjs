// Builds one ZIP per skill of spec-descoberta for upload in claude.ai (Settings → Capabilities → Skills).
// Output: dist/claude-ai/<skill>.zip
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const skillsDir = join(ROOT, 'plugins/spec-descoberta/skills');
const out = join(ROOT, 'dist/claude-ai');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const skill of readdirSync(skillsDir)) {
  execFileSync('zip', ['-rq', join(out, `${skill}.zip`), skill, '-x', '*.DS_Store'], { cwd: skillsDir });
  console.log(`dist/claude-ai/${skill}.zip`);
}
