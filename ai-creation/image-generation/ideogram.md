# Ideogram

**Best for:** Text rendering in images, typography, logos

**API:** https://ideogram.ai/api

## Why Ideogram

Ideogram is specifically trained for accurate text rendering — it handles:
- Signs and posters
- Logos with text
- Book covers
- T-shirt designs
- Any image requiring readable text

## Setup

1. Create account: https://ideogram.ai/
2. Get API key from settings

```bash
export IDEOGRAM_API_KEY="your-key"
```

## Quick Start

```python
import requests

response = requests.post(
    "https://api.ideogram.ai/generate",
    headers={
        "Api-Key": IDEOGRAM_API_KEY,
        "Content-Type": "application/json"
    },
    json={
        "image_request": {
            "prompt": "A coffee shop sign that says 'Morning Brew'",
            "model": "V_2",
            "magic_prompt_option": "AUTO",
            "aspect_ratio": "ASPECT_1_1"
        }
    }
)
```

## Models

- `V_2` — Latest, best text rendering
- `V_1_TURBO` — Faster, slightly lower quality
- `V_1` — Original model

## Aspect Ratios

- `ASPECT_1_1` — Square
- `ASPECT_16_9` — Landscape
- `ASPECT_9_16` — Portrait
- `ASPECT_4_3`, `ASPECT_3_4` — Standard photo

## Magic Prompt

- `AUTO` — AI enhances prompt (recommended)
- `ON` — Always enhance
- `OFF` — Use exact prompt

## Pricing

- Free tier: 25 images/day
- Basic: $7/mo (400 images)
- Plus: $16/mo (1000 images)
- Pro: $48/mo (3000 images)
- API: Pay per image

## Tips

- Put text in quotes: `A sign that says "Hello World"`
- Ideogram is the go-to for any text-in-image needs
- Use for logos, signage, typography-heavy designs
- Combine with other models: generate with Ideogram, upscale elsewhere
