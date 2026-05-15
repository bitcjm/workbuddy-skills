---
name: self-improvement
description: Generic agent self-improvement skill built on OpenClaw-RL research
  (arxiv.org/abs/2603.10165). Captures evaluative signals (+1/-1) and directive
  hints from any user feedback, generates improvement suggestions.
metadata:
  openclaw:
    emoji: 🧬
    homepage: https://adelpro.us.kg
disable: true
---

# Self-Improvement Skill

Enables any agent to learn and improve from user feedback using PRM-style evaluation.

## What It Does

- **Capture Feedback**: Store user responses to agent outputs
- **Evaluate**: Extract score (+1 positive, -1 correction)
- **Analyze**: Find patterns in directive hints
- **Suggest**: Generate actionable improvements

## Concept (OpenClaw-RL Inspired)

From [OpenClaw-RL paper](https://arxiv.org/abs/2603.10165):

> "Next-state signals encode both evaluative and directive information about the preceding action."

Two signal types:
1. **Evaluative**: Did the output work? (binary score)
2. **Directive**: How should it be different? (hints)

## Usage

### Capture Feedback
```
SKILL:self-improvement --feedback "Great!" --job daily-report
SKILL:self-improvement --feedback "Add more stats" --job daily-report
```

### Get Stats
```
SKILL:self-improvement --stats daily-report
```

### Generate Improvements
```
SKILL:self-improvement --improve daily-report
```

## Arguments

| Arg | Description | Example |
|-----|-------------|---------|
| `--job` | Task/job name | `daily-digest`, `weekly-recap` |
| `--feedback` | User response | `"Thanks!"`, `"Add more X"` |
| `--score` | Manual score override | `1`, `0`, `-1` |
| `--stats` | Show feedback stats | `daily-digest` |
| `--improve` | Generate improvements | `daily-digest` |
| `--weekly` | Weekly summary | (flag) |

## Storage

`memory/learning/agent-feedback.json`:
```json
{
  "jobs": {
    "daily-digest": {
      "evaluations": [
        { "date": "2026-03-14", "score": 1, "hint": null },
        { "date": "2026-03-13", "score": -1, "hint": "add weekly star comparison" }
      ],
      "improvements": [
        { "date": "2026-03-14", "suggestion": "Add weekly star delta", "implemented": false }
      ]
    }
  }
}
```

## Cron Integration

### Daily: Capture Feedback (9:30 AM)
```json
{
  "id": "feedback-capture",
  "schedule": "30 9 * * *",
  "message": "SKILL:self-improvement --job daily-digest"
}
```

### Daily: Generate Improvements (10 AM)
```json
{
  "id": "improvement-suggestions",
  "schedule": "0 10 * * *",
  "message": "SKILL:self-improvement --improve daily-digest → Telegram"
}
```

### Weekly: Summary (Saturday 9 AM)
```json
{
  "id": "weekly-summary",
  "schedule": "0 9 * * 6",
  "message": "SKILL:self-improvement --improve all --weekly"
}
```

## Example Workflow

1. **User receives daily digest**
2. **User responds:** "Good! But can you show star trends?"
3. **Feedback captured:** score=1, hint="show star trends"
4. **Next day, improvements generated:**
   - "Add star trend comparison (last 7 days)"
   - "User满意度: 75%"
5. **Agent auto-updates prompt**

## Improvement Suggestion Format

```
📈 Improvement Suggestions - {job}

Stats: 8 evaluations, avg score: 0.75

Top Hints:
1. "add weekly star changes" (2x)
2. "use table format" (1x)

Suggested Actions:
• Add 7-day star delta to GitHub section
• Use table-image-generator for stats

Status: 1 improvement pending
```

## Manual Evaluation

If no user feedback available, manually evaluate:
```
Evaluate yesterday's output as: good/bad
```

## Related Skills

- compound-engineering: Deep session analysis
- agent-evolver: Legacy name, see self-improvement
