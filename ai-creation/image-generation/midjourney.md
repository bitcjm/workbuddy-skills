# Midjourney

**Best for:** Artistic quality, photorealism, aesthetic output

**Access:** Discord bot or web app (no official API)

## Usage (Discord)

```
/imagine prompt: a serene japanese garden at sunset --ar 16:9 --v 6.1
```

## Key Parameters

- `--ar X:Y` — Aspect ratio (16:9, 1:1, 9:16, etc.)
- `--v 6.1` — Model version (6.1 is latest)
- `--style raw` — Less Midjourney aesthetic, more literal
- `--stylize N` — Style strength 0-1000 (default 100)
- `--chaos N` — Variation 0-100 (higher = more diverse)
- `--no X` — Negative prompt (exclude elements)
- `--seed N` — Reproducible results
- `--tile` — Seamless tiling pattern

## Quality Settings

- `--q .25` — Draft quality (fastest)
- `--q .5` — Low quality
- `--q 1` — Standard quality (default)

## Image Reference

```
/imagine prompt: [image_url] a portrait in this style --iw 1.5
```

- `--iw N` — Image weight 0.5-2 (higher = more influence)

## Unofficial APIs

- ImagineAPI.dev — REST API wrapper
- ttapi.io — Third-party API service
- GoAPI — Alternative wrapper

**Note:** Unofficial APIs may violate ToS and can be unreliable.

## Pricing (Subscription)

- Basic: $10/mo (~200 images)
- Standard: $30/mo (~unlimited relaxed)
- Pro: $60/mo (fast hours, stealth mode)

## Tips

- Midjourney excels at aesthetic interpretation
- Use `--style raw` for more prompt-literal results
- Describe mood, lighting, and atmosphere
- Reference artists or art movements for style
