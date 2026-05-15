# Manus Context Engineering Principles

Core principles from Manus (acquired by Meta for $2B, December 2025) for building production AI agents.

## The 6 Principles

### 1. Design Around KV-Cache

> "KV-cache hit rate is THE single most important metric for production AI agents."

- Cached tokens: $0.30/MTok vs Uncached: $3/MTok (10x difference)
- Keep prompt prefixes STABLE (single-token change invalidates cache)
- NO timestamps in system prompts
- Make context APPEND-ONLY with deterministic serialization

### 2. Mask, Don't Remove

Don't dynamically remove tools (breaks KV-cache). Use logit masking instead.

Use consistent action prefixes (e.g., `browser_`, `shell_`, `file_`) for easier masking.

### 3. Filesystem as External Memory

> "Markdown is my 'working memory' on disk."

```
Context Window = RAM (volatile, limited)
Filesystem = Disk (persistent, unlimited)
```

Compression must be restorable:
- Keep URLs even if web content is dropped
- Keep file paths when dropping document contents
- Never lose the pointer to full data

### 4. Manipulate Attention Through Recitation

> "Creates and updates todo.md throughout tasks to push global plan into model's recent attention span."

**Problem:** After ~50 tool calls, models forget original goals ("lost in the middle" effect).

**Solution:** Re-read `task_plan.md` before each decision. Goals appear in the attention window.

### 5. Keep the Wrong Stuff In

> "Leave the wrong turns in the context."

- Failed actions with stack traces let model implicitly update beliefs
- Reduces mistake repetition
- Error recovery is "one of the clearest signals of TRUE agentic behavior"

### 6. Don't Get Few-Shotted

> "Uniformity breeds fragility."

**Problem:** Repetitive action-observation pairs cause drift and hallucination.

**Solution:** Introduce controlled variation — vary phrasings, don't copy-paste patterns.

## The 3 Strategies

### Strategy 1: Context Reduction

**Compaction:**
- FULL: Raw tool content (stored in filesystem)
- COMPACT: Reference/file path only
- Apply compaction to STALE (older) results
- Keep RECENT results FULL (to guide next decision)

**Summarization:**
- Applied when compaction reaches diminishing returns
- Generated using full tool results

### Strategy 2: Context Isolation

Multi-agent architecture:
- PLANNER AGENT assigns tasks to sub-agents
- KNOWLEDGE MANAGER reviews conversations, determines what to store
- EXECUTOR SUB-AGENTS perform assigned tasks with own context windows

### Strategy 3: Context Offloading

- Use <20 atomic functions total
- Store full results in filesystem, not context
- Use `glob` and `grep` for searching
- Progressive disclosure: load information only as needed

## Critical Constraints

- **Single-Action Execution:** ONE tool call per turn (no parallel execution)
- **Plan is Required:** Agent must ALWAYS know: goal, current phase, remaining phases
- **Files are Memory:** Context = volatile, Filesystem = persistent
- **Never Repeat Failures:** If action failed, next action MUST be different

## Key Quote

> "if action_failed: next_action != same_action. Track what you tried. Mutate the approach."

## Source

Based on Manus's official context engineering documentation:
https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus
