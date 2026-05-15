---
name: AI Image Generation
slug: image-generation
version: 1.0.3
homepage: https://clawic.com/skills/image-generation
description: Create AI images with GPT Image, Gemini Nano Banana, FLUX, Imagen, and top providers using prompt engineering, style control, and smart editing.
changelog: Updated for 2026 with benchmark-backed model selection and clearer guidance for modern image generation stacks.
metadata: {"clawdbot":{"emoji":"🎨","requires":{"bins":[],"env.optional":["OPENAI_API_KEY","GEMINI_API_KEY","BFL_API_KEY","GOOGLE_CLOUD_PROJECT","REPLICATE_API_TOKEN","LEONARDO_API_KEY","IDEOGRAM_API_KEY"],"config":["~/image-generation/"]},"os":["linux","darwin","win32"]}}
---

## Setup

On first use, read `setup.md`.

## When to Use

User needs AI-generated visuals, edits, or consistent image sets.
Use this skill to pick the right model, write stronger prompts, and avoid outdated model choices.

## Architecture

User preferences persist in `~/image-generation/`. See `memory-template.md` for setup.

```
~/image-generation/
├── memory.md      # Preferred providers, project context, winning recipes
└── history.md     # Optional generation log
```

## Quick Reference

| Topic | File |
|-------|------|
| Initial setup | `setup.md` |
| Memory template | `memory-template.md` |
| Migration guide | `migration.md` |
| Benchmark snapshots | `benchmarks-2026.md` |
| Prompt techniques | `prompting.md` |
| API handling | `api-patterns.md` |
| GPT Image (OpenAI) | `gpt-image.md` |
| Gemini and Imagen (Google) | `gemini.md` |
| FLUX (Black Forest Labs) | `flux.md` |
| Midjourney | `midjourney.md` |
| Leonardo | `leonardo.md` |
| Ideogram | `ideogram.md` |
| Replicate | `replicate.md` |
| Stable Diffusion | `stable-diffusion.md` |

## Core Rules

### 1. Resolve aliases to official model IDs first

Community names shift quickly. Before calling an API, map the nickname to the provider model ID.

| Community label | Official model ID to try first | Notes |
|-----------------|--------------------------------|-------|
| Nano Banana | `gemini-2.5-flash-image-preview` | Common nickname, not an official Google model ID |
| Nano Banana 2 / Pro | Verify provider docs | Usually a provider preset over Gemini image models |
| GPT Image 1.5 | `gpt-image-1.5` | Current OpenAI high-tier image model |
| GPT Image mini / iMini | `gpt-image-1-mini` | Budget/faster OpenAI variant |
| FLUX 2 Pro / Max | `flux-pro` / `flux-ultra` | Many platforms rename these SKUs |

### 2. Pick models by task, not by hype

| Task | First choice | Backup |
|------|--------------|--------|
| Exact text in image | `gpt-image-1.5` | Ideogram |
| Multi-turn edits | `gemini-2.5-flash-image-preview` | `flux-kontext-pro` |
| Photoreal hero shots | `imagen-4.0-ultra-generate-001` | `flux-ultra` |
| Fast low-cost drafts | `gpt-image-1-mini` | `imagen-4.0-fast-generate-001` |
| Character/product consistency | `flux-kontext-max` | `gpt-image-1.5` with references |
| Local no-API workflows | `flux-schnell` | SDXL |

### 3. Use benchmark tables as dated snapshots

Benchmarks drift weekly. Use `benchmarks-2026.md` as a starting point, then recheck current rankings when quality is critical.

### 4. Draft cheap, finish expensive

Start with 1-4 low-cost drafts, pick one, then upscale or rerender only the winner.

### 5. Keep a fallback chain

If the preferred model is unavailable, fallback by tier:
1) same provider lower tier, 2) cross-provider equivalent, 3) local/open model.

### 6. Treat DALL-E as legacy

OpenAI lists DALL-E 2/3 as legacy. Do not use them as default for new projects.

## Common Traps

- Using vendor nicknames as model IDs -> API errors and wasted retries
- Assuming "Nano Banana Pro" or "FLUX 2" are universal IDs -> provider mismatch
- Copying old DALL-E prompt habits -> weaker output vs modern GPT/Gemini image models
- Comparing text-to-image and image-editing scores as if they were the same benchmark
- Optimizing every draft at max quality -> cost spikes without quality gain

## Security & Privacy

**Data that leaves your machine:**
- Prompt text
- Reference images when editing or style matching

**Data that stays local:**
- Provider preferences in `~/image-generation/memory.md`
- Optional local history file

**This skill does NOT:**
- Store API keys
- Upload files outside chosen provider requests
- Persist generated images unless user asks to save them

## External Endpoints

| Provider | Endpoint | Data Sent | Purpose |
|----------|----------|-----------|---------|
| OpenAI | `api.openai.com` | Prompt text, optional input images | GPT Image generation/editing |
| Google Gemini API | `generativelanguage.googleapis.com` | Prompt text, optional input images | Gemini image generation/editing |
| Google Vertex AI | `aiplatform.googleapis.com` | Prompt text, optional input images | Imagen 4 generation |
| Black Forest Labs | `api.bfl.ai` | Prompt text, optional input images | FLUX generation/editing |
| Replicate | `api.replicate.com` | Prompt text, optional input images | Hosted third-party image models |
| Midjourney | `discord.com` | Prompt text | Midjourney generation via Discord workflows |
| Leonardo | `cloud.leonardo.ai` | Prompt text, optional input images | Leonardo generation/editing |
| Ideogram | `api.ideogram.ai` | Prompt text | Typography-focused image generation |

No other data is sent externally.

## Migration

If upgrading from a previous version, read `migration.md` before updating local memory structure.

## Trust

This skill may send prompts and reference images to third-party AI providers.
Only install if you trust those providers with your content.

## Related Skills
Install with `clawhub install <slug>` if user confirms:
- `image-edit` - Specialized inpainting, outpainting, and mask workflows
- `video-generation` - Convert image concepts into video pipelines
- `colors` - Build palettes for visual consistency across assets
- `ffmpeg` - Post-process image sequences and exports

## Feedback

- If useful: `clawhub star image-generation`
- Stay updated: `clawhub sync`
