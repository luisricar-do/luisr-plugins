// PreToolUse guard for spec-build projects (a folder with spec/manifest.json at or above the cwd).
// Exit 2 blocks the tool call and shows stderr to Claude. Anything else lets it through.
// Outside a spec-build project it does nothing, so installing the plugin does not change other repos.
// If the hook input is not valid JSON it lets the call through (exit 0): a broken hook must not
// freeze the session, and the CI gates (gitleaks, audit) still catch what slips here.
import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, basename, resolve } from 'node:path';

function findProjectRoot(start) {
  let dir = resolve(start);
  for (;;) {
    if (existsSync(join(dir, 'spec', 'manifest.json'))) return dir;
    const up = dirname(dir);
    if (up === dir) return null;
    dir = up;
  }
}

const LOCAL_DB_HOSTS = ['localhost', '127.0.0.1', '[::1]', 'host.docker.internal', 'postgres', 'db'];

const SECRET_PATTERNS = [
  [/-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/, 'private key'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'AWS access key'],
  [/\bgh[pousr]_[A-Za-z0-9]{36,}\b/, 'GitHub token'],
  [/\bgithub_pat_[A-Za-z0-9_]{60,}\b/, 'GitHub fine-grained token'],
  [/\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{32,}\b/, 'API secret key'],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}\b/, 'Slack token'],
  [/AccountKey=[A-Za-z0-9+/=]{40,}/, 'Azure storage key'],
];

// postgres://user:password@host[:port]/... with a password and a host that is not local.
function remoteDbUrlWithPassword(text) {
  const re = /postgres(?:ql)?:\/\/[^:\s/@]+:([^@\s]+)@([^:/\s'"?]+)/g;
  for (const m of text.matchAll(re)) {
    const [, password, host] = m;
    if (password.length >= 8 && !LOCAL_DB_HOSTS.includes(host.toLowerCase())) return true;
  }
  return false;
}

function findSecret(text) {
  for (const [re, label] of SECRET_PATTERNS) if (re.test(text)) return label;
  if (remoteDbUrlWithPassword(text)) return 'database URL with a password for a non-local host';
  return null;
}

// .env, .env.local, .env.production... are real config. Anything ending in .example is a template.
const isRealEnvFile = (name) => /^\.env(\..+)?$/.test(name) && !name.endsWith('.example');

function block(msg) {
  process.stderr.write(`[spec-build guard] ${msg}\n`);
  process.exit(2);
}

let input;
try {
  input = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0);
}

const cwd = input.cwd ?? process.cwd();
const root = findProjectRoot(cwd);
if (!root) process.exit(0);

const tool = input.tool_name;
const ti = input.tool_input ?? {};

if (tool === 'Write' || tool === 'Edit' || tool === 'MultiEdit') {
  const name = basename(String(ti.file_path ?? ''));
  if (isRealEnvFile(name)) {
    block(`writing ${name} is blocked: real configuration is created by the person, never by the agent. Update .env.example instead.`);
  }
  const content = [ti.content, ti.new_string, ...(Array.isArray(ti.edits) ? ti.edits.map((e) => e.new_string) : [])]
    .filter((s) => typeof s === 'string')
    .join('\n');
  const secret = findSecret(content);
  if (secret) block(`${secret} detected in ${name}. Secrets go to the vault or the environment, never into files.`);
}

if (tool === 'Bash') {
  const cmd = String(ti.command ?? '');

  // Writing a real .env through the shell: redirection, tee, cp/mv onto it.
  const envTarget = /(?:>>?|\btee(?:\s+-a)?|\b(?:cp|mv)\s+\S+)\s+["']?([^\s"';|&]*\.env(?:\.[\w.-]+)?)["']?(?=[\s;|&]|$)/g;
  for (const m of cmd.matchAll(envTarget)) {
    if (isRealEnvFile(basename(m[1]))) block(`writing ${basename(m[1])} from the shell is blocked: the person creates real configuration.`);
  }

  const secret = findSecret(cmd);
  if (secret) block(`${secret} in a shell command. Read it from the environment instead of typing it.`);

  for (const part of cmd.split(/&&|\|\||;|\|/)) {
    const words = part.trim().split(/\s+/);
    const g = words.indexOf('git');
    if (g === -1) continue;
    const sub = words[g + 1];
    const args = words.slice(g + 2);

    if (sub === 'commit' && args.some((a) => a === '--no-verify' || /^-[a-zA-Z]*n[a-zA-Z]*$/.test(a))) {
      block('git commit --no-verify / -n is blocked: hooks are part of the gates.');
    }

    if (sub === 'push') {
      if (args.some((a) => a === '--force' || a === '-f' || /^-[a-zA-Z]*f[a-zA-Z]*$/.test(a))) {
        block('git push --force is blocked. Use --force-with-lease on your own branch, and only if the person asked.');
      }
      const refs = args.filter((a) => !a.startsWith('-'));
      if (refs.some((r) => r.startsWith('+'))) block('force push with a "+" refspec is blocked.');
      const targetsMain = refs.slice(1).some((r) => /^(?:\+?(?:[^:]*:)?(?:refs\/heads\/)?)(main|master)$/.test(r));
      if (targetsMain) block('pushing to main is blocked: every slice goes through a branch and a PR.');
      if (refs.length <= 1) {
        // "git push" or "git push origin": pushes the current branch.
        let branch = '';
        try {
          branch = execFileSync('git', ['-C', cwd, 'branch', '--show-current'], { encoding: 'utf8' }).trim();
        } catch { /* not a repo: nothing to protect */ }
        if (branch === 'main' || branch === 'master') block(`you are on ${branch}: pushing it is blocked. Create the slice branch first.`);
      }
    }
  }
}

process.exit(0);
