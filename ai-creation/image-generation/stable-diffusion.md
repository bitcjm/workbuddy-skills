# Stable Diffusion (Local)

**Best for:** Full control, privacy, fine-tuning, no API costs

## Models

- **SDXL 1.0** — Best quality, 1024x1024 native
- **SD 1.5** — Faster, huge ecosystem of fine-tunes
- **SDXL Turbo** — 1-4 steps, real-time generation
- **SD 3.5** — Latest, improved text rendering

## Requirements

- GPU: 8GB+ VRAM (12GB+ recommended for SDXL)
- CUDA 11.8+ or ROCm for AMD
- Python 3.10+

## Setup (Diffusers)

```bash
pip install diffusers transformers accelerate torch
```

## Quick Start

```python
import torch
from diffusers import StableDiffusionXLPipeline

pipe = StableDiffusionXLPipeline.from_pretrained(
    "stabilityai/stable-diffusion-xl-base-1.0",
    torch_dtype=torch.float16
)
pipe.to("cuda")

image = pipe(
    prompt="A majestic lion in a field of flowers",
    negative_prompt="blurry, low quality, distorted",
    num_inference_steps=30,
    guidance_scale=7.5,
    width=1024,
    height=1024
).images[0]

image.save("lion.png")
```

## Key Parameters

- `num_inference_steps` — Quality vs speed (20-50)
- `guidance_scale` — Prompt adherence (5-15, default 7.5)
- `negative_prompt` — What to avoid
- `seed` — Reproducibility via `generator=torch.Generator().manual_seed(N)`

## img2img (Image Editing)

```python
from diffusers import StableDiffusionXLImg2ImgPipeline

pipe = StableDiffusionXLImg2ImgPipeline.from_pretrained(...)
image = pipe(
    prompt="A painting in impressionist style",
    image=init_image,
    strength=0.5,  # 0=no change, 1=full regeneration
).images[0]
```

## Inpainting

```python
from diffusers import StableDiffusionXLInpaintPipeline

pipe = StableDiffusionXLInpaintPipeline.from_pretrained(...)
image = pipe(
    prompt="A cat sitting on the couch",
    image=init_image,
    mask_image=mask,  # White = inpaint, black = keep
).images[0]
```

## Web UIs

- **ComfyUI** — Node-based, powerful workflows
- **Automatic1111** — Feature-rich, extensions
- **Fooocus** — Simple, Midjourney-like experience

## Tips

- Use LoRAs for specific styles/characters
- VAE affects color saturation
- Higher steps ≠ always better (diminishing returns after 30-40)
