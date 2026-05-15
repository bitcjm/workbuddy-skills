# Leonardo AI

**Best for:** Game assets, character design, consistent styles

**API:** https://docs.leonardo.ai/

## Setup

1. Create account: https://leonardo.ai/
2. Get API key from dashboard
3. $5 free credit to start

```bash
export LEONARDO_API_KEY="your-key"
```

## Quick Start

```python
import requests

response = requests.post(
    "https://cloud.leonardo.ai/api/rest/v1/generations",
    headers={
        "Authorization": f"Bearer {LEONARDO_API_KEY}",
        "Content-Type": "application/json"
    },
    json={
        "prompt": "A fantasy warrior character",
        "modelId": "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3",  # Leonardo Creative
        "width": 1024,
        "height": 1024,
        "num_images": 4
    }
)
generation_id = response.json()["sdGenerationJob"]["generationId"]
```

## Poll for Results

```python
import time

while True:
    result = requests.get(
        f"https://cloud.leonardo.ai/api/rest/v1/generations/{generation_id}",
        headers={"Authorization": f"Bearer {LEONARDO_API_KEY}"}
    ).json()
    
    if result["generations_by_pk"]["status"] == "COMPLETE":
        images = result["generations_by_pk"]["generated_images"]
        break
    time.sleep(2)
```

## Models

- **Leonardo Creative** — General purpose
- **Leonardo Diffusion XL** — Photorealistic
- **Leonardo Vision XL** — Photography
- **PhotoReal** — Hyper-realistic photos
- **DreamShaper** — Artistic/fantasy

## Features

- **Alchemy** — Enhanced quality pipeline
- **Phoenix** — Latest model with best prompt adherence
- **Elements** — Style modifiers
- **Motion** — Video from images

## Pricing

- Free: 150 tokens/day
- API: Pay-as-you-go (~$0.02-0.10/image depending on settings)

## Tips

- Use Alchemy for best quality (costs more tokens)
- Leonardo excels at consistent character generation
- Great for game assets and concept art
