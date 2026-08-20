#!/usr/bin/env node
// Validates the agent documentation system. Zero dependencies.
// Run: npm run docs:check
//
// Checks:
//   1. Every folder holding files is covered by an AGENTS.md (its own, or the
//      nearest ancestor's — nested folders may be documented by their parent
//      using a relative path in the table). Inside src/pages the file is named
//      _AGENTS.md, because Astro publishes any .md under src/pages as a page and
//      the underscore is its documented "not a route" marker.
//   2. A covering AGENTS.md table lists exactly the files it covers.
//   3. Every repo path referenced in INDEX.md resolves on disk.
//   4. PROGRESS.md has every required section heading.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative, dirname, sep } from 'node:path';

const ROOT = process.cwd();
const SCAN_ROOTS = ['src', 'scripts', 'public', '.github'];
const IGNORED = new Set(['node_modules', 'dist', '.astro', '.git', '.vscode']);
// Everything inside public/ is copied verbatim to the site root, so an AGENTS.md
// there would be published. Its documentation lives in the root AGENTS.md instead.
const DOC_OWNER_OVERRIDES = { public: '.' };

// Owned by other repositories; their contents are none of our business.
const SUBMODULE_MOUNTS = new Set(['src/content/blog', 'src/content/projects']);
// `_AGENTS.md` is the src/pages spelling; see the note at the top of this file.
const DOC_NAMES = ['AGENTS.md', '_AGENTS.md'];
const REQUIRED_PROGRESS_SECTIONS = [
  'Status',
  'Done',
  'Next',
  'Decisions',
  'Open questions',
  'Known issues',
];

const failures = [];
const fail = (path, message) => failures.push(`${path} — ${message}`);
const toPosix = (p) => p.split(sep).join('/');

/** The folder's own documentation file, if it has one. */
function docFile(relDir) {
  return DOC_NAMES.find((name) => existsSync(join(ROOT, relDir, name)));
}

/** Every directory under SCAN_ROOTS, with its direct file children. */
function walk(dir, out = new Map()) {
  const rel = toPosix(relative(ROOT, dir));
  if (SUBMODULE_MOUNTS.has(rel)) return out;
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && !DOC_NAMES.includes(e.name) && e.name !== '.DS_Store')
    .map((e) => e.name)
    .sort();
  out.set(rel, files);
  for (const entry of entries) {
    if (entry.isDirectory() && !IGNORED.has(entry.name)) walk(join(dir, entry.name), out);
  }
  return out;
}

const dirs = new Map();
for (const root of SCAN_ROOTS) {
  const abs = join(ROOT, root);
  if (existsSync(abs)) walk(abs, dirs);
}

/** Nearest ancestor directory (inclusive) that has an AGENTS.md. */
function findOwner(relDir) {
  let current = DOC_OWNER_OVERRIDES[relDir] ?? relDir;
  for (;;) {
    if (docFile(current)) return current;
    if (current === '.') return null;
    const parent = toPosix(dirname(current));
    if (parent === current || parent === '/') return null;
    if (parent === '.') return existsSync(join(ROOT, 'AGENTS.md')) ? '.' : null;
    current = parent;
  }
}

/** File names in backticks in the first column of a markdown table. */
function listedFiles(agentsPath) {
  const listed = new Set();
  for (const line of readFileSync(agentsPath, 'utf8').split('\n')) {
    if (!line.trimStart().startsWith('|')) continue;
    const firstCell = line.split('|')[1] ?? '';
    const match = firstCell.match(/`([^`]+)`/);
    if (match) listed.add(match[1].replace(/\/$/, ''));
  }
  return listed;
}

// --- 1 + 2: coverage and table accuracy -------------------------------------
const expectedByOwner = new Map();
for (const [relDir, files] of dirs) {
  if (files.length === 0) continue;
  const owner = findOwner(relDir);
  if (!owner) {
    fail(`${relDir}/`, 'holds files but no AGENTS.md covers it (add one here or in a parent)');
    continue;
  }
  const prefix = owner === relDir ? '' : `${relative(owner, relDir).split(sep).join('/')}/`;
  const set = expectedByOwner.get(owner) ?? new Set();
  for (const file of files) set.add(prefix + file);
  expectedByOwner.set(owner, set);
}

for (const [owner, expected] of expectedByOwner) {
  const name = docFile(owner);
  const label = owner === '.' ? name : `${owner}/${name}`;
  const listed = listedFiles(join(ROOT, owner, name));
  for (const file of [...expected].sort()) {
    if (!listed.has(file)) fail(label, `table is missing \`${file}\``);
  }
  for (const file of [...listed].sort()) {
    if (!expected.has(file)) fail(label, `table lists \`${file}\`, which does not exist`);
  }
}

// --- 3: INDEX.md paths resolve ----------------------------------------------
const INDEX = join(ROOT, 'INDEX.md');
if (!existsSync(INDEX)) {
  fail('INDEX.md', 'is missing');
} else {
  const KNOWN_EXT = /\.(md|ts|mjs|js|astro|css|json|yml|yaml|svg|ico|example|gitmodules)$/;
  const SAFE_CHARS = /^[A-Za-z0-9._@/[\]-]+$/;
  const seen = new Set();
  for (const [, span] of readFileSync(INDEX, 'utf8').matchAll(/`([^`]+)`/g)) {
    const candidate = span.replace(/\/$/, '');
    if (!SAFE_CHARS.test(candidate)) continue;
    if (!candidate.includes('/') && !KNOWN_EXT.test(candidate)) continue;
    if (seen.has(candidate)) continue;
    seen.add(candidate);
    if (!existsSync(join(ROOT, candidate)))
      fail('INDEX.md', `references \`${candidate}\`, which does not exist`);
  }
}

// --- 4: PROGRESS.md sections ------------------------------------------------
const PROGRESS = join(ROOT, 'PROGRESS.md');
if (!existsSync(PROGRESS)) {
  fail('PROGRESS.md', 'is missing');
} else {
  const headings = [...readFileSync(PROGRESS, 'utf8').matchAll(/^##\s+(.+?)\s*$/gm)].map((m) =>
    m[1].toLowerCase(),
  );
  for (const section of REQUIRED_PROGRESS_SECTIONS) {
    if (!headings.some((h) => h.startsWith(section.toLowerCase()))) {
      fail('PROGRESS.md', `is missing the "## ${section}" section`);
    }
  }
}

// --- report -----------------------------------------------------------------
if (failures.length > 0) {
  console.error(
    `docs:check failed (${failures.length} problem${failures.length === 1 ? '' : 's'}):\n`,
  );
  for (const line of failures.sort()) console.error(`  ${line}`);
  console.error('');
  process.exit(1);
}
console.log('docs:check passed — every folder is documented and INDEX.md resolves.');
