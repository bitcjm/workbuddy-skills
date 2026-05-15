# Image Prompting Guide (2026)

Use this format to get reliable outputs across GPT Image, Gemini image models, Imagen 4, and FLUX.

## Prompt Structure

```
[Objective]
[Subject and constraints]
[Style and camera language]
[Exact text requirements]
[What must stay unchanged]
```

## Objective-First Template

```text
Goal: Create a launch poster for a coffee brand.
Subject: Single cup on wooden table, early morning light.
Style: Editorial product photography, clean composition.
Exact text: "MORNING BREW" at top, "Now in store" subtitle.
Keep unchanged: Cup shape and logo alignment.
```

## Model-Specific Prompting

### GPT Image

- Works best with explicit structure and exact text strings
- Add constraints in order of importance
- For edits, write what to preserve and what to modify

### Gemini Image (Nano Banana alias)

- Best for iterative edits in conversation
- Split changes step-by-step instead of one giant prompt
- Re-anchor key invariants every turn: "keep subject identity and framing"

### Imagen 4

- Use concise descriptive prompts for fast batches
- Keep style tokens stable across batch requests
- Use Ultra for final pass, Fast for ideation

### FLUX / FLUX Kontext

- Be explicit about scene geometry and material details
- For Kontext edits, include preservation constraints first
- Keep one dominant style direction to avoid drift

## Style and Camera Keyword Bank

- Lighting: golden hour, studio softbox, rim light, overcast daylight
- Photography: macro shot, cinematic still, portrait photography, product hero shot
- Composition: close-up, wide angle, top-down, rule of thirds
- Texture: matte finish, glossy reflections, brushed metal, film grain

## Text-in-Image Pattern

```text
Exact text: "SUMMER DROP"
Typography: bold geometric sans serif, all caps
Placement: centered top third
Legibility constraints: high contrast, no decorative distortion
```

## Editing Pattern

```text
Edit request:
- Change: Replace background with modern office interior
- Keep: Person identity, face, clothing, camera angle
- Avoid: Extra objects, text overlays, heavy color shift
```

## Iteration Loop

1. Generate 2-4 low-cost drafts
2. Score each draft against one goal only
3. Keep best draft and run one focused edit
4. Final render at higher tier

## Negative Constraint Pattern

Use explicit exclusion constraints when models drift:

```text
Avoid: watermark, extra text, duplicated limbs, oversaturated colors, logo distortions
```

Support varies by provider, so validate per model.

## Consistency Controls

- Reuse aspect ratio and framing terms across revisions
- Keep seed fixed when the provider supports seeds
- Preserve one canonical prompt scaffold for a project

## Common Failures

- Too many artistic styles in one prompt
- Missing preservation constraints in edits
- No exact text specification for typography tasks
- Requesting final quality before validating composition
