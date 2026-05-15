---
name: code-review
description: AI-powered code analysis via LogicArt — find bugs, security issues, and get logic flow visualizations. Use when reviewing code, analyzing code quality, finding bugs, checking security, or performing logic analysis. Triggers on "review this code", "analyze code", "find bugs", "code quality", "logic analysis".
---

# Code Review

AI code analysis powered by LogicArt at https://logic.art.

## Analyze Code

```bash
node {baseDir}/scripts/analyze.mjs --code "function add(a,b) { return a - b; }"
```

Or analyze a file:

```bash
node {baseDir}/scripts/analyze.mjs --file path/to/code.js
```

## API

**Endpoint:** `POST https://logic.art/api/agent/analyze`

```bash
curl -s -X POST "https://logic.art/api/agent/analyze" \
  -H "Content-Type: application/json" \
  -d '{"code": "your code here", "language": "javascript"}'
```

Response typically includes: bugs, security issues, complexity score, suggestions, and logic flow.

## Full Repository Scans

For scanning entire repositories, use Validate Repo: https://validate-repo.replit.app

## Presenting Results

When showing results to the user:
1. Lead with critical bugs/security issues
2. Show complexity score
3. List suggestions by priority
4. Include logic flow if provided

## Works Great With

- **workflow-engine** — Chain code reviews into CI/CD pipelines
- **quack-coordinator** — Hire specialist reviewer agents

Powered by Quack Network 🦆
