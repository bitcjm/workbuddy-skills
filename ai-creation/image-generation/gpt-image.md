# GPT Image (OpenAI)

## Source of Truth

- OpenAI model catalog: `gpt-image-1.5`, `gpt-image-1`, `gpt-image-1-mini`
- OpenAI marks `dall-e-3` and `dall-e-2` as legacy
- API usage guide: [images.generate] and [images.edit] with GPT Image models

Use official model IDs from the account's allowed models list.

## Model Status (as of 2026-03-02)

| Model ID | Status | Use It For |
|----------|--------|------------|
| `gpt-image-1.5` | Current | Best quality and instruction following |
| `gpt-image-1` | Current | Reliable default when 1.5 is unavailable |
| `gpt-image-1-mini` | Current | Fast and lower-cost drafts |
| `dall-e-3` | Legacy | Backward compatibility only |
| `dall-e-2` | Legacy | Backward compatibility only |

## API Baseline

```python
from openai import OpenAI

client = OpenAI()  # Reads OPENAI_API_KEY

MODEL_PRIMARY = "gpt-image-1.5"
MODEL_FALLBACK = "gpt-image-1"
```

## Text-to-Image

```python
response = client.images.generate(
    model=MODEL_PRIMARY,
    prompt="Minimalist coffee brand poster. Exact text: MORNING BREW.",
    size="1024x1024",
    quality="high",
    n=1,
)
```

## Image Edit

```python
with open("input.png", "rb") as image_file:
    response = client.images.edit(
        model=MODEL_PRIMARY,
        image=image_file,
        prompt="Replace the background with a warm studio setup and keep product shape unchanged.",
    )
```

## Quality and Resolution Strategy

Use quality tiers to control cost and speed:
- `low`: fastest drafts
- `medium`: iteration
- `high`: final render
- `auto`: provider decides

Typical practical flow:
1. Draft at standard resolution.
2. Select one winner.
3. Re-render at higher quality.

## Practical Selection Rules

- Need exact text or layout fidelity: start with `gpt-image-1.5`
- Need cheap iteration: use `gpt-image-1-mini`
- Need compatibility with old pipelines: use `gpt-image-1`
- Avoid defaulting to DALL-E in new workflows

## Prompting Patterns That Work Better on GPT Image

- Include exact copy in quotes: `Exact text: "SUMMER DROP"`
- Constrain what must stay unchanged in edits
- Ask for composition explicitly: foreground, midground, background
- For brand work, provide short style anchors instead of long adjective lists

## Common Use Cases

- Brand assets with strict copy
- Product photography variants
- Social media creative with consistent style
- Multi-step image edits with preservation constraints

## Common Mistakes

- Calling a community alias (`image-1.5-pro`) instead of model ID
- Treating legacy DALL-E results as the quality baseline
- Asking for too many simultaneous constraints without priority order

## Migration Notes from DALL-E

1. Prefer GPT Image models for all new image generation calls
2. Revalidate old prompt templates because model behavior differs
3. Keep a fallback path for accounts without `gpt-image-1.5` access
