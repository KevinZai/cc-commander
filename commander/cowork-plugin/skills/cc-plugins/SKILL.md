---
name: cc-plugins
description: "CC Commander Plugin Manager — detect installed Claude Code packages, show orchestration plan. Use when the user says 'what plugins do I have', 'show installed packages', 'plugin status', or 'orchestration plan'."
allowed-tools:
  - Read
  - Glob
  - Bash
---

# Plugin Manager

Detect and report on installed Claude Code packages.

## Known Packages

| Package | Author | Stars | Strength |
|---------|--------|-------|----------|
| gstack | Garry Tan | 54.6K | Decision gates + QA testing |
| Compound Engineering | Every Inc | 11.5K | Knowledge compounding + deep review |
| Superpowers | Jesse Vincent | 121K | Structured workflow |
| Everything Claude Code | Community | 100K | Lifecycle hooks + profiles |
| Simone | banagale | 3K | PM framework |

## Detection

Scan these directories for installed skills:
- ~/.claude/skills/
- ~/.claude/commands/
- .claude/skills/
- .claude/commands/

Match against known package skill names to determine which packages are installed.

## Orchestration Plan

Show the 8-step build pipeline with the best tool assigned per phase based on what's installed:
1. Clarify → 2. Decide → 3. Plan → 4. Execute → 5. Review → 6. Test → 7. Learn → 8. Ship
