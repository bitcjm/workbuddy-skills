# Benchmark Snapshot (2025-2026)

Use this file as a dated reference, not a permanent truth.

## Scope

- Source: LMArena Text-to-Image leaderboard (updated 2026-02-25)
- Source: LMArena Image Editing leaderboard (updated 2026-02-26)
- This reflects human preference votes, not absolute quality guarantees for every task

## Text-to-Image Snapshot (LMArena, 2026-02-25)

Top models shown on the board:
- #1 `GPT-image-1.5 High` (score 1162)
- #2 `Recraft V3` (1161)
- #3 `Imagen 4` (1157)
- #4 `GPT-image-1.5 Medium` (1153)
- #5 `Gemini 2.5 Flash Image` (1152)

Notable FLUX placements on the same board:
- `Flux Pro 1.1` (#9)
- `Flux 1.1 Pro` (#12)
- `Flux Kontext Max` (#14)
- `Flux Kontext Pro` (#16)

## Image Editing Snapshot (LMArena, 2026-02-26)

Top models shown on the board:
- #1 `Gemini 2.5 Flash Image` (1166)
- #2 `GPT-image-1.5 High` (1143)
- #3 `SeedEdit 3.0` (1142)
- #4 `Flux Kontext Max` (1137)
- #5 `Flux Kontext Pro` (1135)

## Practical Routing Based on These Results

- Text-heavy generation: start with `gpt-image-1.5`
- Iterative edits: start with `gemini-2.5-flash-image-preview`
- Edit quality with identity retention: test `flux-kontext-max` and `flux-kontext-pro`
- Fast ideation: use lower tiers (`gpt-image-1-mini`, `imagen-4.0-fast-generate-001`) before premium rerender

## Important Caveat

Leaderboard rank can shift quickly as providers tune models.
When output quality is critical, re-check rankings before final delivery.
