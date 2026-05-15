# Replicate (Multi-Provider)

**Best for:** Quick testing, model variety, pay-per-use

**API:** https://replicate.com/

## Setup

```bash
pip install replicate
export REPLICATE_API_TOKEN="r8_xxx"
```

## Quick Start

```python
import replicate

output = replicate.run(
    "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
    input={
        "prompt": "A majestic eagle soaring over mountains",
        "negative_prompt": "blurry, low quality",
        "width": 1024,
        "height": 1024
    }
)
# output is a list of URLs
print(output[0])
```

## Popular Models

| Model | Use Case | Cost |
|-------|----------|------|
| `stability-ai/sdxl` | General purpose | ~$0.01 |
| `black-forest-labs/flux-schnell` | Fast iteration | ~$0.003 |
| `black-forest-labs/flux-dev` | High quality | ~$0.03 |
| `lucataco/flux-dev-lora` | LoRA support | ~$0.03 |
| `bytedance/sdxl-lightning-4step` | Ultra fast | ~$0.005 |

## Async Pattern

```python
# Start generation
prediction = replicate.predictions.create(
    model="stability-ai/sdxl",
    input={"prompt": "A sunset over the ocean"}
)

# Poll for completion
while prediction.status not in ["succeeded", "failed"]:
    prediction.reload()
    time.sleep(1)

# Get result
if prediction.status == "succeeded":
    image_url = prediction.output[0]
```

## Webhook Support

```python
prediction = replicate.predictions.create(
    model="stability-ai/sdxl",
    input={"prompt": "..."},
    webhook="https://your-server.com/webhook",
    webhook_events_filter=["completed"]
)
```

## Pricing

- Pay per second of compute
- Most image models: $0.003-0.05 per image
- No monthly commitment
- Check model page for exact pricing

## Tips

- Great for testing different models quickly
- Use webhooks for production instead of polling
- Replicate hosts most popular open-source models
- Easy to switch between models
