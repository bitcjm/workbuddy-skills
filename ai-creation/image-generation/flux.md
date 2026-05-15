# FLUX (Black Forest Labs)

## Official BFL Model IDs

Use the model catalog from `docs.bfl.ai` and `api.bfl.ai`.
Current first-party IDs include:

| Model ID | Best For |
|----------|----------|
| `flux-pro` | Strong general text-to-image quality |
| `flux-ultra` | Higher-tier fidelity and detail |
| `flux-kontext-pro` | Image editing with context consistency |
| `flux-kontext-max` | Highest quality Kontext editing |
| `flux-kontext-dev` | Dev/testing for Kontext workflows |
| `flux-1.1-pro` | Stable prior-gen production path |
| `flux-1.1-pro-ultra` | Higher-fidelity 1.1 tier |
| `flux-dev` | Open/dev workflows |
| `flux-schnell` | Fast local/open baseline |

## About "FLUX 2"

Many third-party providers market FLUX tiers as "FLUX 2 Pro/Max".
Treat this as an alias and resolve to BFL IDs before API calls.

Typical mapping:
- "FLUX 2 Pro" -> `flux-pro`
- "FLUX 2 Max" -> `flux-ultra` or `flux-kontext-max` depending whether it is generation or editing

## API Examples

### Text-to-Image

```bash
curl -X POST "https://api.bfl.ai/v1/flux-pro" \
  -H "Authorization: Bearer $BFL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Product hero photo of matte black headphones on a marble table",
    "width": 1024,
    "height": 1024
  }'
```

### Kontext Edit

```bash
curl -X POST "https://api.bfl.ai/v1/flux-kontext-pro" \
  -H "Authorization: Bearer $BFL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Keep the product unchanged, replace background with warm studio lighting"
  }'
```

## Capability Notes

- FLUX families are strong for photoreal output and material detail
- Kontext tiers are useful when edits must preserve identity and structure
- FLUX is often used for consistent campaign assets across many scenes

## Local/Open Route

For local usage without paid APIs:
- `flux-schnell` for fast iteration
- `flux-dev` for deeper experimentation

Keep this route for budget workflows and private/offline development.

### Local Quick Start (Diffusers)

```python
import torch
from diffusers import FluxPipeline

pipe = FluxPipeline.from_pretrained(
    "black-forest-labs/FLUX.1-schnell",
    torch_dtype=torch.bfloat16,
)
pipe.enable_model_cpu_offload()

image = pipe(
    prompt="Editorial product photo of a watch on dark slate",
    width=1024,
    height=1024,
    num_inference_steps=4,
    guidance_scale=0,
).images[0]
```

## Model Selection Rules

- High quality generation: `flux-ultra`
- Balanced production generation: `flux-pro`
- Editing with source preservation: `flux-kontext-pro`
- Highest edit quality: `flux-kontext-max`
- Free/local drafts: `flux-schnell`

## Operational Tips

- For consistency jobs, lock prompt structure and aspect ratio across batches
- Use draft tiers for ideation, premium tiers for final delivery
- Keep alias-to-ID mapping explicit when switching providers

## Common Mistakes

- Calling `flux-2-pro` directly on BFL API (not an official endpoint)
- Using generation model IDs for edit endpoints without checking docs
- Assuming all provider aliases share identical parameters and response formats
