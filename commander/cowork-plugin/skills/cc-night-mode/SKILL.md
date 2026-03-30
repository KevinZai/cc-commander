---
name: cc-night-mode
description: "Night Mode — 8-hour autonomous build. Use when the user says 'night mode', 'overnight build', 'autonomous build', 'build while I sleep', or wants a comprehensive unattended build session."
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

# Night Mode — Autonomous Build

Night Mode is an intensive spec-gathering + autonomous execution flow.
Designed for overnight runs: start before bed, wake up to shipped code.

## Spec Interview (10 Questions)

Ask ALL of these before starting:

1. **What are you building?** — Project description
2. **Who is it for?** — Target audience/users
3. **Most critical feature?** — The one thing that must work
4. **Tech stack?** — Languages, frameworks, databases
5. **What does DONE look like?** — Acceptance criteria
6. **What does BROKEN look like?** — Failure modes to prevent
7. **Edge cases?** — Known tricky scenarios
8. **Testing requirements?** — Unit, integration, E2E expectations
9. **Deployment target?** — Where it runs (Vercel, AWS, local, etc.)
10. **Anything else?** — Additional context, constraints, preferences

## Dispatch Configuration

After gathering the spec:
- **Effort**: max (deepest reasoning)
- **Budget**: $10 ceiling
- **Max turns**: 100
- **Model**: opusplan (Opus for planning, Sonnet for execution)
- **Self-testing**: Include tests, run them, fix failures

## Post-Build

After completing the build:
1. Run all tests
2. Fix any failures
3. Commit with conventional commit message
4. Extract lessons to knowledge base
5. Summarize what was built, what works, what needs attention
