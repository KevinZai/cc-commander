# CC Commander — Skill Catalog

Only ~30 essential skills are auto-loaded by default. The full catalog of 450+ skills remains available.

## Quick Start

```bash
ccc --skills                    # See installed vs available
ccc --skills list               # List installed skills
ccc --skills available          # List skills NOT installed
ccc --skills install <name>     # Add a specific skill
ccc --skills tier recommended   # Switch to recommended tier (~100 skills)
```

## Tiers

| Tier | Skills | Description |
|------|--------|-------------|
| essential | ~30 | Core workflow — planning, execution, verification |
| recommended | ~100 | Code review, testing, agents, patterns (includes essential) |
| domain | 11 | CCC mega-skill routers (design, testing, devops, etc.) |
| full | 450+ | Everything (legacy behavior) |

## Discover Skills

- **SKILLS-INDEX.md** — Full searchable directory at `~/.claude/SKILLS-INDEX.md`
- **`ccc --list-skills`** — JSON or text listing of all available skills
- **By category:** Skills are organized by prefix (ccc-*, openclaw-*, etc.)

## Load a Skill On Demand

If a skill isn't installed, you can still use it:
1. Read it directly: `Read ~/clawd/projects/cc-commander/skills/<name>/SKILL.md`
2. Or install it: `ccc --skills install <name>`
3. Or switch tier: `ccc --skills tier recommended`

## Tier File

The tier definitions live in `skills/_tiers.json`. Edit this to customize which skills load in each tier.
