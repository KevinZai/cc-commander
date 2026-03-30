---
name: cc-yolo-mode
description: "YOLO Mode — autonomous overnight build. Use when the user says 'yolo mode', 'yolo loop', 'night mode', 'overnight build', 'build while I sleep', 'autonomous build', 'continuous improvement loop'."
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Agent
  - WebSearch
---

# YOLO Mode — Autonomous Build System

Set it. Forget it. Wake up to shipped code.

## Spec Interview (10 Questions — ALL required)

Ask every question. Do not skip. Do not assume.

1. **What are you building?** — Full project description
2. **Who is it for?** — Target users/audience
3. **Most critical feature?** — The one thing that MUST work
4. **Tech stack?** — Languages, frameworks, databases, infrastructure
5. **What does DONE look like?** — Specific acceptance criteria
6. **What does BROKEN look like?** — Failure modes to prevent
7. **Edge cases?** — Known tricky scenarios to handle
8. **Testing requirements?** — Unit, integration, E2E expectations
9. **Deployment target?** — Where it runs (Vercel, AWS, Docker, local)
10. **Anything else?** — Additional context, constraints, API keys needed

## Execution Configuration

After spec is complete:
- Model: opusplan (Opus for planning, Sonnet for execution)
- Effort: max (deepest reasoning)
- Budget: $10 ceiling
- Max turns: 100
- Self-testing: Write tests, run them, fix failures
- Knowledge: Check past lessons before starting, extract new lessons after

## YOLO Loop (Continuous Improvement)

When requested, run multiple build-review-improve cycles:
1. Cycle 1: Build from scratch using the spec
2. Cycle 2-N: Review previous work, fix issues, add tests, improve quality
3. Write status to ~/.claude/commander/yolo-status.txt each cycle
4. Each cycle gets proportional budget ($10 / N cycles)
5. After final cycle: extract all lessons to knowledge base

## Post-Build Checklist

After autonomous execution completes:
1. Run all tests — report results
2. Fix any test failures
3. Check for console.log statements — remove
4. Commit with conventional commit message
5. Extract lessons to ~/.claude/commander/knowledge/
6. Write completion summary

## Attribution
YOLO Mode by Kevin Z — CC Commander (kevinz.ai)
