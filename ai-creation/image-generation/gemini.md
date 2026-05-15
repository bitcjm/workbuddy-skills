# Google Image Models (Gemini + Imagen)

## Naming Reality Check

In public API docs, Google exposes official IDs like:
- `gemini-2.5-flash-image-preview` (Gemini API)
- `imagen-4.0-generate-001`, `imagen-4.0-ultra-generate-001`, `imagen-4.0-fast-generate-001` (Vertex AI)

"Nano Banana" is a community nickname, not an official Google model ID.

## Gemini (Conversation-First Image Generation)

Google announced Gemini 2.5 Flash image generation in July 2025.
This path is best when you want conversational iteration and edits in one flow.

### Primary Model

| Model ID | Channel | Best For |
|----------|---------|----------|
| `gemini-2.5-flash-image-preview` | Gemini API / AI Studio | Multi-turn generation and edits |

### Basic REST Example

```bash
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=$GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{"text": "Create a cozy bookstore scene with warm lighting"}]
    }]
  }'
```

### When Gemini Is the Better First Pick

- You expect 2-5 iterative edits in one thread
- You need instruction-heavy edits (change X, keep Y)
- You need text + image responses in the same generation flow
- You want to refine one image in multiple turns without restarting

## Imagen 4 (Vertex AI)

Imagen 4 is the dedicated image family in Vertex AI.
Use it when you need stable high-volume generation and clear model tiers.

### Imagen 4 IDs (as of 2026-03-02)

| Model ID | Stage | Typical Use |
|----------|-------|-------------|
| `imagen-4.0-generate-001` | GA | General production generation |
| `imagen-4.0-ultra-generate-001` | GA | Higher quality output |
| `imagen-4.0-fast-generate-001` | Preview | Low-latency drafts |

### Selection Rule

- Highest quality render: `imagen-4.0-ultra-generate-001`
- Balanced production default: `imagen-4.0-generate-001`
- Fast prototype pass: `imagen-4.0-fast-generate-001`

### Practical Production Tips

- Start with lower-cost drafts, then rerender the winner in `ultra`
- Keep aspect ratio fixed across batch requests for consistent outputs
- For text-heavy visuals, test Gemini and Imagen on the same prompt before scaling

## Gemini vs Imagen Decision

| Need | Start With | Why |
|------|------------|-----|
| Conversational editing | `gemini-2.5-flash-image-preview` | Native iterative workflow |
| Bulk generation at fixed tier | Imagen 4 IDs | Predictable model tiers |
| Fast ideation | `imagen-4.0-fast-generate-001` | Lower latency path |
| Model nickname from user | Ask for intended provider first | Same nickname can map to different backends |

## Common Capability Notes

- Gemini is typically stronger for conversational edit loops
- Imagen tiers are usually easier to scale for fixed batch generation
- Both can produce strong text-in-image results, but behavior varies by prompt layout

## Common Mistakes

- Passing "nano-banana-pro" as a real model ID
- Mixing Gemini API model IDs with Vertex Imagen model IDs
- Assuming preview and GA models have identical behavior
