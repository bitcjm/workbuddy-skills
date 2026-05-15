# Setup - AI Image Generation

## First Activation Check

Detect existing memory:

```bash
test -f ~/image-generation/memory.md
```

If it exists, continue normally.

## If Memory Is Missing

Create a lightweight workspace:

```bash
mkdir -p ~/image-generation
```

Copy `memory-template.md` into `~/image-generation/memory.md`.

## Operating Behavior

- Answer the user request first, then improve setup details in follow-up turns
- Keep setup optional and non-blocking
- Learn provider preference from repeated use patterns
- Ask clarifying questions only when provider choice changes output quality significantly

## Provider Selection Shortcut

If provider preference is unclear, ask one concise choice question:

- GPT Image (OpenAI): strong instruction following and text rendering
- Gemini (Nano Banana nickname): iterative conversational editing
- Imagen: fast and scalable batch generation tiers
- FLUX: strong photorealism and consistency workflows
- Local (FLUX Schnell / SDXL): privacy-first and no paid API by default

## Provider Verification (without exposing secrets)

Check only whether env vars are present:

```bash
test -n "$OPENAI_API_KEY" && echo "OpenAI configured"
test -n "$GEMINI_API_KEY" && echo "Gemini configured"
test -n "$GOOGLE_CLOUD_PROJECT" && echo "Vertex project configured"
test -n "$BFL_API_KEY" && echo "BFL configured"
```

Never ask users to paste secret values into chat.

## Memory Updates

After meaningful sessions, update memory with:
- Model families that worked (`gpt-image-1.5`, `imagen-4.0-generate-001`, etc.)
- Prompt patterns that consistently succeeded
- Ongoing project style constraints
