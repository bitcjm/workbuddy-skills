# Migration Guide - AI Image Generation

Read this guide when upgrading from older published versions.

## Breaking Changes in v1.0.3

### 1) Provider file naming was normalized

**Before:** some installs referenced `openai.md`

**Now:** OpenAI guidance is in `gpt-image.md`

**Migration steps:**
1. If your local notes reference `openai.md`, map those references to `gpt-image.md`.
2. Keep old notes as backup until workflows are verified.
3. Remove old references only after confirming prompts still work.

### 2) Memory template structure was modernized

**Before:** free-form sections (`Provider`, `Projects`, `Preferences`)

**Now:** structured blocks (`Status`, `Context`, `Active Projects`, `Working Recipes`, `Notes`)

**Migration steps:**
1. Create backup:
   ```bash
   cp ~/image-generation/memory.md ~/image-generation/memory.md.bak
   ```
2. Add the new sections from `memory-template.md`.
3. Copy old content into the closest new section:
   - old `Provider` -> `Context`
   - old `Projects` -> `Active Projects`
   - old `Preferences` -> `Working Recipes`
4. Keep legacy notes until the new format is confirmed.

### 3) Architecture now explicitly supports optional `history.md`

**Before:** history handling was implicit

**Now:** `history.md` is optional and documented

**Migration steps:**
1. If `history.md` does not exist and the user wants logs, create it.
2. If user does not need logs, keep using only `memory.md`.

## Post-Migration Verification

- [ ] `~/image-generation/memory.md` exists and keeps prior preferences
- [ ] Any old `openai.md` references now point to `gpt-image.md`
- [ ] No data was deleted without explicit user confirmation
- [ ] Generation workflows still run with current model IDs

## Cleanup Policy

- Never delete backups without explicit user confirmation.
- Prefer copy-first migration, then optional cleanup.
