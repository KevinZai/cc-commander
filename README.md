# The Claude Code Bible — by Kevin Z

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Compatible-00ff41?logo=anthropic&logoColor=white)](https://claude.ai/code)
[![Skills](https://img.shields.io/badge/Skills-220+-00d4ff)](./SKILLS-INDEX.md)
[![Mega Skills](https://img.shields.io/badge/Mega_Skills-6-ff6b35)](./SKILLS-INDEX.md)
[![Version](https://img.shields.io/badge/Version-1.0-00ff41)](./CHANGELOG.md)
[![Terminal](https://img.shields.io/badge/Terminal-CLI-00ff41?logo=gnometerminal&logoColor=white)](#install)

> **220+ skills. 6 mega-skills. One install. The comprehensive guide and toolkit for Claude Code.**

A non-technical CEO scanned every Claude Code article, plugin, and skill on the internet — top 200+ posts from X, Reddit, Medium, YouTube — tested every community pack, and distilled it all into one toolkit.

---

## Install

### One-Line Install (paste anywhere)

```bash
curl -fsSL https://raw.githubusercontent.com/k3v80/claude-code-bible/main/install-remote.sh | bash
```

This auto-detects your system, installs Claude Code if needed, downloads the toolkit, backs up your existing config, and runs the interactive installer.

### Manual Install

```bash
git clone https://github.com/k3v80/claude-code-bible.git
cd claude-code-bible
./install.sh
```

### VS Code

Install the [Claude Code extension](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code) then run the one-line install above in any terminal. The toolkit automatically works inside VS Code. Pre-configured tasks available via **Terminal > Run Task**.

### Uninstall

```bash
./uninstall.sh
```

Removes kit components (skills, commands, hooks, lib, templates, reference docs). Preserves your `CLAUDE.md` and `settings.json`. Offers to restore from backup.

## What's Inside

| Component | Count | Location |
|-----------|-------|----------|
| Skills | 220+ | `~/.claude/skills/` |
| Commands | 84+ | `~/.claude/commands/` |
| Hooks | 23 | `~/.claude/hooks/hooks.json` |
| Templates | 3 | `~/.claude/templates/` |
| Reference Docs | 3 | `BIBLE.md`, `CHEATSHEET.md`, `SKILLS-INDEX.md` |

## /cc Command Center

Type `/cc` in any Claude Code session to access the interactive command center:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CLAUDE CODE BIBLE  //  COMMAND CENTER       v1.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [1] Skills Browser    — 220+ skills by category
  [2] Mega-Skills       — 6 domain packs w/ sub-skills
  [3] Settings          — model, permissions, hooks, MCP
  [4] Grill Me          — Socratic planning probe
  [5] Confidence Check  — pre-execution confidence assessment
  [6] Mode Toggle       — plan / yolo / normal
  [7] Status            — kit health, tasks, version
  [8] Quick Reference   — cheatsheet highlights
  [9] /init             — project wizard
```

| Sub-command | What it does |
|-------------|-------------|
| `/cc skills` | Browse skills by category |
| `/cc mega seo` | Drill into a mega-skill |
| `/cc grill` | 7 Socratic questions — no plan mode |
| `/cc confidence` | Pre-execution confidence 0-100% |
| `/cc mode yolo` | Mode descriptions + settings guidance |
| `/cc status` | Health dashboard |

## Mega-Skills

Load ONE skill, get the entire domain. Each mega-skill has a router that dispatches to the right specialist.

| Mega-Skill | Skills | Domain |
|------------|--------|--------|
| `mega-seo` | 19 | Technical SEO, AI search, content strategy, analytics |
| `mega-design` | 35+ | Animations, effects, design systems, Impeccable polish suite |
| `mega-testing` | 15 | TDD, E2E, verification, QA, regression, load testing |
| `mega-marketing` | 46 | Content, CRO, channels, growth, sales |
| `mega-saas` | 20 | Auth, billing, DB, API, frontend, metrics |
| `mega-devops` | 20 | CI/CD, Docker, AWS, monitoring, Terraform |

## The Kevin Z Method

Every project starts with `/init` — an interactive wizard that asks:

1. **Project Identity** — name, stack, deployment target
2. **Build Type** — QUICK (<4h), DEEP (1-5 days), SAAS (1-4 weeks), OVERNIGHT (6-12h autonomous)
3. **Domain Deep-Dive** — task-specific questions per build type
4. **Output Generation** — auto-generates CLAUDE.md, tasks/, settings.json

## Key Innovations

### Confidence Check (from SuperClaude)
Before executing any plan, self-assess confidence 0-100%. High confidence → proceed. Low confidence → ask questions first. Saves 25-250x tokens by preventing wrong-direction work.

### Four-Question Validation
Post-implementation check: (1) Tests passing? (2) Requirements met? (3) No unverified assumptions? (4) Evidence? Catches 94% of AI errors.

### Quick Start Bundles

| Bundle | Skills | For |
|--------|--------|-----|
| Web Wizard | `nextjs-app-router` + `shadcn-ui` + `tailwind-v4` + `drizzle-neon` | Full-stack web apps |
| Security Engineer | `pci-compliance` + `container-security` + `github-actions-security` | Security audits |
| Content Creator | `mega-marketing` + `mega-seo` + `blog-engine` | Content & SEO |
| Full Stack SaaS | `mega-saas` + `mega-devops` + `mega-testing` | SaaS products |

## IDE Compatibility

The toolkit customizes **Claude Code itself** (via `~/.claude/`), not your IDE. It works everywhere Claude Code runs:

| Environment | Status |
|-------------|--------|
| Terminal (`claude` CLI) | Full support |
| VS Code (Claude Code extension) | Full support + task shortcuts |
| Cursor | Full support |
| JetBrains (IntelliJ, WebStorm) | Full support |
| Any terminal running `claude` | Full support |

Install once. Works everywhere.

## Key Files

| File | Purpose |
|------|---------|
| `BIBLE.md` | The Kevin Z Method — 7 chapters + appendices |
| `CHEATSHEET.md` | Daily reference — commands, shortcuts, power combos |
| `SKILLS-INDEX.md` | Searchable skill directory (220+ skills by category) |
| `CLAUDE.md` | Global behavior instructions (loaded every session) |
| `settings.json` | MCP servers, permissions, model selection |

## Installer Options

```bash
./install.sh              # Interactive install
./install.sh --dry-run    # Preview without changes
./install.sh --verify     # Validate existing installation
./install.sh --force      # Skip confirmation prompts
./uninstall.sh            # Clean removal with backup restore
```

## Testing

```bash
node --test tests/hooks.test.js    # Run hook test harness
```

Tests validate all 4 kit-native hooks (careful-guard, auto-notify, preuse-logger, status-checkin), verify hook file existence, and check JS syntax.

## For Staff: Customize

1. Edit `CLAUDE.md` — replace paths/projects for your setup
2. Edit `settings.json` — point MCP servers to your tokens
3. Add project-level `CLAUDE.md` in each repo for stack-specific rules
4. Run `/init` in any project to generate tailored config
5. Type `/cc` to explore skills, settings, and workflows

## Built With

- [Claude Code](https://claude.ai/code) by Anthropic
- 200+ articles from the Claude Code community
- Patterns from SuperClaude Framework, Everything Claude Code, and Trail of Bits
- Tested on real projects (MyWiFi Networks, DMHub, trading systems)

See [CONTRIBUTORS.md](docs/CONTRIBUTORS.md) for full source credits.

## License

MIT
