# Kevin Z's Claude Code Kit

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Compatible-00ff41?logo=anthropic&logoColor=white)](https://claude.ai/code)
[![Skills](https://img.shields.io/badge/Skills-220+-00d4ff)](./SKILLS-INDEX.md)
[![Mega Skills](https://img.shields.io/badge/Mega_Skills-6-ff6b35)](./SKILLS-INDEX.md)
[![VS Code](https://img.shields.io/badge/VS_Code-Extension-007ACC?logo=visualstudiocode)](https://marketplace.visualstudio.com/items?itemName=k3v80.claude-code-kit)
[![Terminal](https://img.shields.io/badge/Terminal-CLI-00ff41?logo=gnometerminal&logoColor=white)](#install)

> **220+ skills. 6 mega-skills. One install command.**

A non-technical CEO scanned every Claude Code article, plugin, and skill on the internet — top 200+ posts from X, Reddit, Medium, YouTube — tested every community pack, and distilled it all into one kit.

---

## Install

### One-Line Install (paste anywhere)

```bash
curl -fsSL https://raw.githubusercontent.com/k3v80/claude-code-kit/main/install-remote.sh | bash
```

This auto-detects your system, installs Claude Code if needed, downloads the kit, backs up your existing config, and runs the interactive installer.

### Manual Install

```bash
git clone https://github.com/k3v80/claude-code-kit.git
cd claude-code-kit
./install.sh
```

### VS Code

Install the [Claude Code extension](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code) then run the one-line install above in any terminal. The kit automatically works inside VS Code.

The installer backs up your existing `~/.claude/`, asks who you are, and installs everything.

## What's Inside

| Component | Count | Location |
|-----------|-------|----------|
| Skills | 220+ | `~/.claude/skills/` |
| Commands | 84+ | `~/.claude/commands/` |
| Hooks | 23 | `~/.claude/hooks/hooks.json` |
| Templates | 3 | `~/.claude/templates/` |
| Reference Docs | 3 | `BIBLE.md`, `CHEATSHEET.md`, `SKILLS-INDEX.md` |

## KZ Mega-Skills

Load ONE skill, get the entire domain. Each mega-skill has a router that dispatches to the right specialist.

<details>
<summary><strong>mega-seo</strong> — 19 SEO skills in one</summary>

Technical SEO, AI search optimization (LLM citations, structured data), content strategy, analytics, programmatic SEO at scale.

**Includes:** `ai-seo`, `aaio`, `seo-optimizer`, `seo-content-brief`, `serp-analyzer`, `backlink-audit`, `search-console`, `site-architecture`, `analytics-conversion`, `analytics-product`, `bulk-page-generator`, `content-strategy`, `blog-engine`, `social-integration`, `guest-blogger` + 4 NEW routing/context skills

</details>

<details>
<summary><strong>mega-design</strong> — 35+ design & animation skills</summary>

CSS/JS animations, SVG morphing, Framer Motion, GSAP, particle systems, WebGL shaders, interactive effects, retro/pixel art, full design systems, and the 19-skill Impeccable polish suite (adapt, arrange, audit, bolder, clarify, critique, delight, distill, extract, harden, normalize, onboard, optimize, overdrive, polish, quieter, typeset).

**Includes:** `animate`, `svg-animation`, `motion-design`, `interactive-visuals`, `particle-systems`, `generative-backgrounds`, `canvas-design`, `webgl-shader`, `retro-pixel`, `colorize`, `theme-factory`, `frontend-design`, `landing-page-builder`, `design-consultation` + 5 NEW pattern skills

</details>

<details>
<summary><strong>mega-testing</strong> — 15 testing skills in one</summary>

TDD workflow (red/green/refactor), Playwright E2E, visual regression (Percy/Chromatic), load testing (k6/Artillery), AI-assisted regression detection, eval-driven development, full QA passes.

**Includes:** `e2e-testing`, `webapp-testing`, `tdd-workflow`, `verification-loop`, `verification-before-completion`, `ai-regression-testing`, `eval-harness`, `qa`, `qa-only`, `plankton-code-quality`, `python-testing` + 4 NEW strategy/testing skills

</details>

<details>
<summary><strong>mega-marketing</strong> — 46 marketing skills in one</summary>

7 specialist pods: Content (production, strategy, humanizer, copywriting), SEO (audit, AI-SEO, programmatic), CRO (page, form, signup, paywall, onboarding, popup), Channels (email, cold email, paid ads, social), Growth (A/B testing, referrals, free tools, churn prevention), Intelligence (campaign analytics, competitor analysis, psychology), Sales & GTM (pricing, launch strategy).

**Includes:** 43 existing marketing skills + `influencer-outreach`, `product-hunt-launch`, `seo-content-production`

</details>

<details>
<summary><strong>mega-saas</strong> — 20 SaaS building skills in one</summary>

Full SaaS lifecycle: scaffold from scratch, authentication (Better Auth), billing (Stripe subscriptions, dunning), database (Drizzle + Neon), API (Fastify, REST patterns), frontend (Next.js 15, shadcn/ui, Tailwind v4), metrics (ARR, MRR, churn, LTV), multi-tenancy, webhooks, feature flags.

**Includes:** `api-design`, `backend-patterns`, `database-designer`, `better-auth`, `stripe-subscriptions`, `billing-automation`, `saas-metrics-coach`, `nextjs-app-router`, `shadcn-ui`, `drizzle-neon`, `tailwind-v4`, `fastify-api` + 5 NEW advanced skills

</details>

<details>
<summary><strong>mega-devops</strong> — 20 DevOps skills in one</summary>

CI/CD pipelines (GitHub Actions, reusable workflows), containers (Docker multi-stage, security hardening), AWS (Solution Architect, Lambda, S3, CloudFront, IAM), monitoring (Prometheus, Grafana, PromQL alerting, full-stack APM), infrastructure as code (Terraform modules, state management), zero-downtime deployments (blue-green, canary, rolling).

**Includes:** `docker-development`, `senior-devops`, `github-actions-security`, `aws-solution-architect`, `aws-lambda-best-practices`, `prometheus-configuration`, `grafana-dashboards`, `container-security` + 5 NEW deployment/monitoring skills

</details>

## The Kevin Z Method

Every project starts with `/init` — an interactive wizard that asks:

1. **Project Identity** — name, stack, deployment target
2. **Build Type** — QUICK (<4h), DEEP (1-5 days), SAAS (1-4 weeks), OVERNIGHT (6-12h autonomous)
3. **Domain Deep-Dive** — task-specific questions per build type
4. **Output Generation** — auto-generates CLAUDE.md, tasks/, settings.json

## IDE Compatibility

The kit customizes **Claude Code itself** (via `~/.claude/`), not your IDE. It works everywhere Claude Code runs:

| Environment | Status |
|-------------|--------|
| Terminal (`claude` CLI) | Full support |
| VS Code (Claude Code extension) | Full support |
| Cursor | Full support |
| JetBrains (IntelliJ, WebStorm) | Full support |
| Any terminal running `claude` | Full support |

Install once. Works everywhere.

## Key Files

| File | Purpose |
|------|---------|
| `BIBLE.md` | The Kevin Z Method — golden rules, build types, 6 stages of development |
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
```

## For Staff: Customize

1. Edit `CLAUDE.md` — replace paths/projects for your setup
2. Edit `settings.json` — point MCP servers to your tokens
3. Add project-level `CLAUDE.md` in each repo for stack-specific rules
4. Run `/init` in any project to generate tailored config

## Built With

- [Claude Code](https://claude.ai/code) by Anthropic
- 100+ articles from the Claude Code community
- Tested on real projects (MyWiFi Networks, DMHub, trading systems)

## License

MIT
