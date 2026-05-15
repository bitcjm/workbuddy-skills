#!/usr/bin/env node
// Code Review — Analyze code via LogicArt API
import { readFileSync } from 'fs';
import { argv } from 'process';
import { extname } from 'path';

const API = 'https://logic.art/api/agent/analyze';

const EXT_LANG = { '.js': 'javascript', '.mjs': 'javascript', '.ts': 'typescript', '.py': 'python', '.rb': 'ruby', '.go': 'go', '.rs': 'rust', '.java': 'java', '.c': 'c', '.cpp': 'cpp' };

function parseArgs() {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--code' && argv[i + 1]) args.code = argv[++i];
    else if (argv[i] === '--file' && argv[i + 1]) args.file = argv[++i];
    else if (argv[i] === '--language' && argv[i + 1]) args.language = argv[++i];
  }
  return args;
}

async function main() {
  const args = parseArgs();
  let code = args.code;
  let language = args.language;

  if (args.file) {
    code = readFileSync(args.file, 'utf8');
    if (!language) language = EXT_LANG[extname(args.file)] || 'unknown';
  }

  if (!code) {
    console.error('Usage: analyze.mjs --code <code> | --file <path> [--language <lang>]');
    process.exit(1);
  }

  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language: language || 'unknown' }),
  });

  const data = await res.json().catch(() => ({ status: res.status, body: res.statusText }));
  console.log(JSON.stringify(data, null, 2));
}

main().catch(e => { console.error(e.message); process.exit(1); });
