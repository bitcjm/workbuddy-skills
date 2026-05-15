# API Patterns (2026)

Use provider-agnostic patterns to keep image workflows robust under model churn.

## 1) Alias Resolution Before API Call

Always normalize user/provider labels to official model IDs.

```python
MODEL_ALIASES = {
    "nano banana": "gemini-2.5-flash-image-preview",
    "nano banana pro": "gemini-2.5-flash-image-preview",
    "gpt image mini": "gpt-image-1-mini",
    "flux 2 pro": "flux-pro",
    "flux 2 max": "flux-ultra",
}
```

## 2) Tiered Fallbacks

```python
FALLBACKS = {
    "gpt-image-1.5": ["gpt-image-1", "gpt-image-1-mini"],
    "gemini-2.5-flash-image-preview": ["imagen-4.0-generate-001"],
    "flux-ultra": ["flux-pro", "flux-1.1-pro-ultra"],
}
```

If primary fails with `model_not_found` or permission errors, retry with the next tier.

## 3) Async Polling for Job APIs

```python
import time
import requests


def wait_for_job(url, headers, timeout_s=180, sleep_s=2):
    started = time.time()
    while time.time() - started < timeout_s:
        r = requests.get(url, headers=headers, timeout=30)
        data = r.json()
        status = data.get("status", "")
        if status in {"succeeded", "completed"}:
            return data
        if status in {"failed", "error", "cancelled"}:
            raise RuntimeError(data)
        time.sleep(sleep_s)
    raise TimeoutError("image job timed out")
```

## 4) Deterministic Request Logs

Store metadata for each generation:
- Provider
- Official model ID
- Prompt hash
- Seed (if supported)
- Cost tier
- Result URL/path

This makes quality and cost comparisons reproducible.

## 5) Cost Control Pattern

- First pass: draft tier (`mini`, `fast`, or local)
- Second pass: one focused edit on the winner
- Final pass: high-tier render only once

## 6) Webhook Pattern (When You Own the Receiver)

Some providers support webhooks for async completion.
Use webhooks only when you control the callback endpoint and audit logs.
Default to polling for simpler and safer setups.

## 7) Batch Concurrency Pattern

```python
import asyncio


async def generate_batch(prompts, max_concurrent=5):
    semaphore = asyncio.Semaphore(max_concurrent)

    async def _one(prompt):
        async with semaphore:
            return await async_generate(prompt)

    return await asyncio.gather(*[_one(p) for p in prompts])
```

## 8) Temporary URL Handling

Many providers return expiring URLs.
If output must persist, download immediately and store with request metadata.

## 9) Error Handling Baseline

```python
try:
    result = generate_image(prompt, model=model_id)
except RateLimitError:
    sleep_and_retry()
except PermissionError:
    model_id = fallback_model(model_id)
    result = generate_image(prompt, model=model_id)
except TimeoutError:
    simplify_prompt_and_retry()
```

## Provider Snapshot

| Provider | Typical Pattern | Notes |
|----------|------------------|-------|
| OpenAI GPT Image | Sync generate/edit | Model access varies by account tier |
| Gemini API | Conversational generate/edit | Preview model IDs can evolve |
| Vertex Imagen | Tiered generate models | Distinct IDs for fast/general/ultra |
| BFL FLUX | Model-specific endpoints | Alias names differ by host platform |
