# CLAUDE.md — Kevin Z's Claude Code Kit

## What This Is

A comprehensive Claude Code configuration kit — 220+ skills, 6 mega-skills, 84+ commands, 23 hooks, 3 templates. Built by scanning 200+ articles from the Claude Code community and distilling into one install.

## Project Structure

```
├── skills/              # 220+ skills organized by category
│   ├── mega-*/          # 6 mega-skills (router + sub-skills)
│   ├── init-decision-tree/  # /init project wizard
│   └── */               # Individual skills (SKILL.md each)
├── commands/            # 84+ slash commands (.md files)
├── hooks/               # 23 hooks (JS) + hooks.json config
├── templates/           # 3 starter templates (nextjs, api, cli)
├── lib/                 # Terminal art libraries (bash + JS)
├── docs/                # GitHub Pages landing site
│   ├── index.html       # Single-page marketing site
│   └── assets/          # CSS, JS, images
├── compatibility/       # IDE compatibility guides
├── install.sh           # Interactive installer
├── install-remote.sh    # One-line remote installer (curl | bash)
├── BIBLE.md             # The Kevin Z Method — golden rules, build types
├── CHEATSHEET.md        # Daily reference
├── SKILLS-INDEX.md      # Searchable skill directory
├── CLAUDE.md.kevin      # Kevin's personal CLAUDE.md template
└── CLAUDE.md.staff-template  # Staff CLAUDE.md template
```

## Current Status

**Version:** 1.1 (committed `b10b207`, pushed to GitHub)

**Live:**
- GitHub repo: github.com/k3v80/claude-code-kit
- Landing page: k3v80.github.io/claude-code-kit
- One-line install: `curl -fsSL https://raw.githubusercontent.com/k3v80/claude-code-kit/main/install-remote.sh | bash`

## Key Commands

```bash
./install.sh              # Interactive install (matrix rain, ASCII art, progress)
./install.sh --dry-run    # Preview without changes
./install.sh --verify     # Validate existing installation
./install.sh --force      # Skip confirmation prompts
```

## Development Notes

- Shell scripts source `lib/terminal-art.sh` for all visual output
- Hooks use `lib/terminal-art.js` for consistent branding
- All animations respect `KZ_NO_COLOR=1`, `KZ_NO_ANIMATION=1`, CI detection
- OG image generated via `docs/assets/og-image.svg` → PNG conversion
- Mega-skills use router pattern: one SKILL.md dispatches to sub-skill directories

## Next Steps

- VS Code Marketplace extension (separate project — needs extension packaging)
- Homebrew formula for `brew install claude-code-kit`
- Community contribution guidelines
- Automated testing for installer across Linux/macOS
- Skill versioning and update mechanism
