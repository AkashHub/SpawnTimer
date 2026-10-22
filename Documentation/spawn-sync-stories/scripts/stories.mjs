#!/usr/bin/env node
// Story tooling. Zero dependencies. Usage:
//   node scripts/stories.mjs list [--status S] [--epic E] [--json]
//   node scripts/stories.mjs next [--json]
//   node scripts/stories.mjs validate
//   node scripts/stories.mjs set <ID> <status>
//   node scripts/stories.mjs show <ID>
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const storiesDir = join(root, 'stories');
const STATUSES = ['ready', 'in-progress', 'testing', 'done', 'blocked'];
const PRIORITIES = ['must', 'should', 'could'];
const REQUIRED = ['id', 'title', 'epic', 'priority', 'verification', 'size', 'status', 'depends_on', 'branch'];

function parseFrontMatter(text, file) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) throw new Error(`${file}: missing front matter`);
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const mm = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!mm) continue;
    let v = mm[2].trim();
    if (v.startsWith('[')) v = v.slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean);
    fm[mm[1]] = v;
  }
  return fm;
}

function loadStories() {
  const out = [];
  if (!existsSync(storiesDir)) return out;
  for (const dir of readdirSync(storiesDir)) {
    const d = join(storiesDir, dir);
    if (!statSync(d).isDirectory()) continue;
    for (const f of readdirSync(d)) {
      if (!f.endsWith('.md')) continue;
      const path = join(d, f);
      out.push({ ...parseFrontMatter(readFileSync(path, 'utf8'), path), path, file: f, dir });
    }
  }
  return out.sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));
}

function waves(stories) {
  const byId = new Map(stories.map((s) => [s.id, s]));
  const memo = new Map();
  const visiting = new Set();
  const depth = (id) => {
    if (memo.has(id)) return memo.get(id);
    if (visiting.has(id)) return 0;
    visiting.add(id);
    const s = byId.get(id);
    let d = 0;
    for (const dep of s?.depends_on ?? []) if (byId.has(dep)) d = Math.max(d, 1 + depth(dep));
    visiting.delete(id);
    memo.set(id, d);
    return d;
  };
  for (const s of stories) s.wave = depth(s.id);
}

function validate(stories) {
  const errors = [];
  const ids = new Set();
  for (const s of stories) {
    for (const k of REQUIRED) if (s[k] === undefined) errors.push(`${s.path}: missing field '${k}'`);
    if (ids.has(s.id)) errors.push(`${s.id}: duplicate id`);
    ids.add(s.id);
    const prefix = String(s.id).split('-')[0];
    if (s.epic !== prefix) errors.push(`${s.id}: epic '${s.epic}' does not match id prefix`);
    if (s.dir !== prefix) errors.push(`${s.id}: file is in folder '${s.dir}', expected '${prefix}'`);
    if (!s.file.startsWith(`${s.id}-`)) errors.push(`${s.id}: file name '${s.file}' must start with the id`);
    if (!STATUSES.includes(s.status)) errors.push(`${s.id}: invalid status '${s.status}'`);
    if (!PRIORITIES.includes(s.priority)) errors.push(`${s.id}: invalid priority '${s.priority}'`);
    if (s.epic === 'H') {
      if (s.branch !== 'none') errors.push(`${s.id}: human stories must have branch: none`);
    } else if (!String(s.branch).startsWith(`story/${s.id}-`)) {
      errors.push(`${s.id}: branch must start with 'story/${s.id}-'`);
    }
  }
  for (const s of stories)
    for (const dep of s.depends_on ?? []) if (!ids.has(dep)) errors.push(`${s.id}: unknown dependency '${dep}'`);
  // cycle detection (DFS)
  const byId = new Map(stories.map((s) => [s.id, s]));
  const state = new Map();
  const visit = (id, trail) => {
    if (state.get(id) === 2) return;
    if (state.get(id) === 1) { errors.push(`dependency cycle: ${[...trail, id].join(' -> ')}`); return; }
    state.set(id, 1);
    for (const dep of byId.get(id)?.depends_on ?? []) if (byId.has(dep)) visit(dep, [...trail, id]);
    state.set(id, 2);
  };
  for (const s of stories) visit(s.id, []);
  return errors;
}

const fmt = (s) => `${s.id.padEnd(8)} w${String(s.wave).padEnd(2)} [${s.priority.padEnd(6)}] [${s.verification.padEnd(5)}] ${s.title}`;

const [cmd, ...args] = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const json = args.includes('--json');
const stories = loadStories();
waves(stories);

switch (cmd) {
  case 'list': {
    const st = flag('--status'), ep = flag('--epic');
    const rows = stories.filter((s) => (!st || s.status === st) && (!ep || s.epic === ep));
    if (json) console.log(JSON.stringify(rows, null, 2));
    else for (const s of rows) console.log(`${fmt(s)}  (${s.status})`);
    break;
  }
  case 'next': {
    const done = new Set(stories.filter((s) => s.status === 'done').map((s) => s.id));
    const ready = stories
      .filter((s) => s.status === 'ready' && (s.depends_on ?? []).every((d) => done.has(d)))
      .sort((a, b) => a.wave - b.wave || a.id.localeCompare(b.id, 'en', { numeric: true }));
    const agent = ready.filter((s) => s.epic !== 'H');
    const human = ready.filter((s) => s.epic === 'H');
    if (json) console.log(JSON.stringify({ agent, human }, null, 2));
    else {
      console.log(`Ready for agents (${agent.length}):`);
      for (const s of agent) console.log('  ' + fmt(s) + `\n           ${relative(root, s.path)}`);
      console.log(`\nReady for a human (${human.length}):`);
      for (const s of human) console.log('  ' + fmt(s));
    }
    break;
  }
  case 'validate': {
    const errors = validate(stories);
    if (errors.length) { for (const e of errors) console.error('ERROR ' + e); process.exit(1); }
    console.log(`OK: ${stories.length} stories valid`);
    break;
  }
  case 'set': {
    const [id, status] = args;
    if (!STATUSES.includes(status)) { console.error(`status must be one of ${STATUSES.join(', ')}`); process.exit(2); }
    const s = stories.find((x) => x.id === id);
    if (!s) { console.error(`unknown story ${id}`); process.exit(2); }
    const text = readFileSync(s.path, 'utf8');
    const end = text.indexOf('\n---', 3);
    const head = text.slice(0, end).replace(/^status:.*$/m, `status: ${status}`);
    writeFileSync(s.path, head + text.slice(end));
    console.log(`${id} -> ${status}`);
    break;
  }
  case 'show': {
    const s = stories.find((x) => x.id === args[0]);
    if (!s) { console.error(`unknown story ${args[0]}`); process.exit(2); }
    console.log(relative(root, s.path));
    break;
  }
  default:
    console.log('usage: node scripts/stories.mjs <list|next|validate|set|show> [...]');
    process.exit(cmd ? 2 : 0);
}
