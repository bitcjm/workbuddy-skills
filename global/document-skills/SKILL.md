---
name: document-skills
description: Write or update a skill (SKILL.md and supporting files) to match host structure and best practices. Use when user says create skill, write skill, update SKILL.md, /document-skills.
disable-model-invocation: true
argument-hint: "[skill-path] [source]"
context: fork
agent: general-purpose
---

# Document Skills

Write or update a skill to fit the host's expected structure. Use the structure and checklist below.

## Inputs

1. **Target skill** – Path to the skill folder (e.g. the project skills directory `skills/example/`) or the skill name.
2. **Source** – Draft, user instructions, or notes to turn into the skill or merge in.

**If you don't give either:** Use the current or given context (e.g. the skill or path already under discussion).

## Output

SKILL.md updated (and supporting files if needed).

## Process

### 1. Skill layout

- One folder per skill. The main file is always `SKILL.md` (exact name, case-sensitive).
- **Folder name:** Must be **kebab-case** (lowercase, hyphens; no spaces, underscores, or capitals). The frontmatter `name` must match the folder name.
- **Where skills live:** In a project, typically a dedicated skills directory (e.g. `skills/<name>/`). The host discovers skills from this location even when it's nested (e.g. inside a package).
- **Optional subfolders only:** Use **scripts/** (executable code), **references/** (documentation loaded as needed), and **assets/** (templates, icons, etc.). Do not put README.md inside the skill folder; all documentation goes in SKILL.md or references/. Long reference material goes in `references/` and is linked from SKILL.md (progressive disclosure).
- **Length:** Keep SKILL.md under ~5,000 words. Long reference in `references/`, linked from SKILL.md.
- **Progressive disclosure:** Skills use three levels — (1) YAML frontmatter is always loaded so the assistant knows when to use the skill; (2) SKILL.md body is loaded when the skill is relevant; (3) files in references/ or assets/ are opened only as needed. This keeps token use down while keeping expertise available.
- **Composability:** Skills can load together. Write the skill so it works alongside others; don't assume it's the only one active.

### 2. SKILL.md format

#### Frontmatter (the YAML block between the first `---` lines)

Frontmatter configures when and how the skill runs. The table below follows the [official skills reference](https://code.claude.com/docs/en/skills.md#frontmatter-reference).

**name** and **description** are required. **name** must match the folder name (kebab-case). **description** should follow: **`[What it does] + [When to use it] + [Key capabilities]`** — under 1024 characters; no XML angle brackets (`<` `>`). Avoid vague lines like "Helps with projects"; include specific trigger phrases and, if relevant, file types (e.g. ".fig files", "PDF contract review").

| Field                      | Required    | Description                                                                                                                                           |
| :------------------------- | :---------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                     | Yes         | kebab-case only; must match skill folder name. Lowercase letters, numbers, and hyphens (max 64 characters).                                           |
| `description`              | Yes         | **`[What it does] + [When to use it] + [Key capabilities]`**. Include trigger phrases (e.g. "Use when user says save, /save"). Mention file types if relevant. Under 1024 characters. No `<` or `>`.        |
| `argument-hint`            | No          | Hint shown during autocomplete to indicate expected arguments. Example: `[issue-number]` or `[filename] [format]`.                                    |
| `disable-model-invocation` | No          | Set to `true` to disable automatic loading; use for workflows you want to trigger manually with `/name`. Default: `false`. |
| `user-invocable`           | No          | Set to `false` to hide from the `/` menu. Use for background knowledge users shouldn't invoke directly. Default: `true`.                              |
| `allowed-tools`            | No          | Tools the assistant can use without asking permission when this skill is active.                                                                             |
| `model`                    | No          | Model to use when this skill is active.                                                                                                               |
| `context`                  | No          | Set to `fork` to run in a forked subagent context.                                                                                                    |
| `agent`                    | No          | Which subagent type to use when `context: fork` is set.                                                                                               |
| `hooks`                    | No          | Hooks scoped to this skill's lifecycle. See [Hooks in skills and agents](/en/hooks#hooks-in-skills-and-agents) for configuration format.              |

**Optional:** `license` (e.g. MIT for open source), `compatibility` (1–500 chars: product, system deps, network), `metadata` (e.g. author, version, mcp-server). See [complete skills guide](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf).

**Security:** No XML angle brackets in frontmatter. Avoid reserved names in the skill name (e.g. host or vendor names).

**YAML gotcha:** Avoid colons inside a value. They can be read as a new key. Use something like "Scope is" instead of "Scope:" in the text.

#### Content type

- **Reference content** – Conventions, patterns, style. The assistant applies it inline to your current work. No invocation control needed.
- **Task content** – Step-by-step instructions for a specific action (deploy, commit, code generation). Often invoked directly with `/skill-name`. Use `disable-model-invocation: true` so the skill is not auto-loaded.

#### Body sections (same order for every skill)

Use the same section order so skills are easy to scan:

1. **# Title** – Skill name as H1, then one short intro (what it does).
2. **## Inputs** – What the skill needs (user input, paths, options). Number the items. Use "None" or "Optional" when nothing is required.
3. **## Output** – What you get (a file, a behavior, a handoff). One short block.
4. **## Process** – How to do it. Numbered steps or subsections (e.g. "### 1. Step name"). Put all how-to and rules here. Be specific and actionable (e.g. "Run `python scripts/validate.py --input {filename}`" not "Validate the data"). Include error handling for common failures; reference bundled files (e.g. "Before queries, consult `references/api-patterns.md`") when relevant.
5. **## Examples** – Optional but recommended. Common scenarios: "User says X → Actions → Result."
6. **## Troubleshooting** – Optional but recommended. Error or symptom → Cause → Solution.
7. **## Reference** – Optional. Links to related skills or docs.

Skip a section only if it really doesn't apply. When unsure, include Inputs, Output, Process, and Reference; add Examples and Troubleshooting where they help. Match the layout of other skills in the repo.

#### Substitutions (in the body text)

From the [official docs](https://code.claude.com/docs/en/skills.md#available-string-substitutions):

- `$ARGUMENTS` – All arguments passed when invoking the skill. If not present in the content, arguments are appended as `ARGUMENTS: `.
- `$ARGUMENTS[N]` or `$N` – The Nth argument (0-based index).
- `${CLAUDE_SESSION_ID}` – The current session ID (host-defined).
- `${CLAUDE_SKILL_DIR}` – The directory containing the skill's `SKILL.md` file (host-defined).

For injecting shell output before the skill runs, see [Inject dynamic context](https://code.claude.com/docs/en/skills.md#inject-dynamic-context).

### 3. Checklist when writing or updating

1. **Frontmatter:** `description` follows **`[What it does] + [When to use it] + [Key capabilities]`** and is specific (include phrases users might say, e.g. "Use when user says save, /save"). `name` matches the skill. Task or side-effect skills: `disable-model-invocation: true` per official docs.
2. **Sections:** Inputs, Output, Process, then optionally Examples and Troubleshooting, then Reference. Same order as other skills.
3. **Length:** Under 500 lines; long reference in other files, linked from SKILL.md.
4. **Supporting files:** If used, say so in SKILL.md and when to load them. Keep SKILL.md focused; put long or detailed docs in `references/` and link (progressive disclosure).
5. **Arguments:** Use `$ARGUMENTS` or `$N` and optionally `argument-hint` if the skill takes input.
6. **Invocation:** Use `disable-model-invocation` and/or `user-invocable` so the skill runs when intended (see [Control who invokes a skill](https://code.claude.com/docs/en/skills.md#control-who-invokes-a-skill)).

### 4. Steps to run

1. Read the target skill path and any source.
2. Apply the checklist and structure above. Don't change behavior unless the user asked.
3. Write or update SKILL.md (and supporting files if needed). Only document what the skill does; don't add capabilities that aren't there.

## Examples

**User says:** "Create a skill for validating CSV uploads."

**Actions:** Create folder `skills/validate-csv/` (or the project's skill path; kebab-case). Add SKILL.md with required frontmatter (`name: validate-csv`, description using **`[What it does] + [When to use it] + [Key capabilities]`**, e.g. "Validate CSV uploads. Use when user says validate CSV, check upload, /validate-csv. Key capabilities: schema check, encoding detection."). Add Inputs, Output, Process, optional Reference. If the skill runs a script, add `scripts/validate.sh` and reference it in Process.

**Result:** New skill that triggers on the stated phrases; coordinator and flows updated if it is part of a flow.

**User says:** "Update the save skill to mention update-gitignore."

**Actions:** Open the save skill's SKILL.md (e.g. `skills/save/SKILL.md`). Add the new step or reference in Process. Update description if trigger phrases change. Sync coordinator and [references/coordinator-flows.md](../../agents/references/coordinator-flows.md) if the Save flow changes.

## Troubleshooting

**Invalid frontmatter / upload error.**  
Cause: YAML formatting (missing `---` delimiters, unclosed quotes, or colons in a value read as a new key).  
Solution: Ensure frontmatter is between two `---` lines. Avoid colons in description text; use "Use when" not "When:". No `<` or `>` in frontmatter.

**Skill doesn't trigger.**  
Cause: Description too vague or missing the full formula (what it does, when to use it, key capabilities) or trigger phrases.  
Solution: Use **`[What it does] + [When to use it] + [Key capabilities]`** and add specific "Use when user says X, Y, /skill-name". Same phrases should appear in coordinator flow table if the skill is part of a flow. **Debug:** Ask the assistant "When would you use the [skill name] skill?" and adjust the description from what’s missing.

**Skill triggers too often.**  
Cause: Description too broad or overlapping with other skills.  
Solution: Add negative triggers (e.g. "Do NOT use for simple data exploration; use data-viz skill instead"). Narrow scope (e.g. "PDF legal documents for contract review" instead of "Processes documents"). Clarify when not to use (e.g. "Use specifically for online payment workflows, not general financial queries").

**Wrong folder name.**  
Cause: Folder has spaces, underscores, or capitals.  
Solution: Rename to kebab-case. Update `name` in SKILL.md to match. Update all references (coordinator, agents, README, package.json, checklist script, [agents/references/](../../agents/references/)).

## After writing

- **Coordinator sync:** If you changed the description (e.g. "when to use" or key capabilities that match user requests), update the coordinator agent and the flow steps in [references/coordinator-flows.md](../../agents/references/coordinator-flows.md) if the skill is part of a flow, so the flow table and agent descriptions stay in sync.
- **Rename/move:** If a skill was **renamed or moved** (e.g. generate-figma → designer-figma), update all references: coordinator, agents, README, package.json, other skills that link to it, [verify-task checklist script](verify-task/scripts/checklist.ts), [agents/references/](../../agents/references/) (e.g. coordinator-flows.md if the skill appears in a flow), and .gitignore.

## Reference

[Official skills reference](https://code.claude.com/docs/en/skills.md) – frontmatter, control who invokes a skill, run in subagent, substitutions. [Coordinator](../../agents/coordinator.md) – Flow table and agent descriptions should follow **`[What it does] + [When to use it] + [Key capabilities]`** and match the phrases users say.

[Complete guide to building skills](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf) – progressive disclosure, description formula, good/bad examples, optional frontmatter, triggering and troubleshooting, instructions best practices.
