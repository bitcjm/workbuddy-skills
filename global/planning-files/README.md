# Planning with Files

File-based planning for complex tasks. Use persistent markdown files as working memory to survive context resets. Creates task_plan.md, findings.md, and progress.md. Based on context engineering principles from Manus.

## What's Inside

- Core pattern (filesystem as persistent memory)
- Three planning files: task_plan.md, findings.md, progress.md
- Four-phase workflow (create planning files → execute with discipline → handle errors → verify completion)
- The 2-Action Rule for saving findings
- The 3-Strike Protocol for error handling
- 5-Question Reboot Test for context verification
- Session recovery patterns
- Templates and helper scripts
- Anti-patterns

## When to Use

- Multi-step tasks (3+ steps)
- Research tasks requiring web search
- Building/creating projects from scratch
- Tasks spanning more than 5 tool calls
- Anything requiring organization across multiple files
- Tasks where losing context would cause rework

## Installation

```bash
npx add https://github.com/wpank/ai/tree/main/skills/meta/planning-with-files
```

### OpenClaw / Moltbot / Clawbot

```bash
npx clawhub@latest install planning-files
```

### Manual Installation

#### Cursor (per-project)

From your project root:

```bash
mkdir -p .cursor/skills
cp -r ~/.ai-skills/skills/meta/planning-with-files .cursor/skills/planning-with-files
```

#### Cursor (global)

```bash
mkdir -p ~/.cursor/skills
cp -r ~/.ai-skills/skills/meta/planning-with-files ~/.cursor/skills/planning-with-files
```

#### Claude Code (per-project)

From your project root:

```bash
mkdir -p .claude/skills
cp -r ~/.ai-skills/skills/meta/planning-with-files .claude/skills/planning-with-files
```

#### Claude Code (global)

```bash
mkdir -p ~/.claude/skills
cp -r ~/.ai-skills/skills/meta/planning-with-files ~/.claude/skills/planning-with-files
```

---

Part of the [Meta](..) skill category.
