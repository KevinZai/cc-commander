# Changelog

All notable changes to The Claude Code Bible will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-27

### Added
- 220+ skills organized by category with 6 mega-skills (mega-seo, mega-design, mega-testing, mega-marketing, mega-saas, mega-devops)
- 84+ slash commands for common workflows
- 23 lifecycle hooks (PreToolUse, PostToolUse, Stop)
- 3 starter templates (Next.js + shadcn, Turborepo fullstack, marketing site)
- `/cc` interactive command center with skills browser, settings viewer, confidence check, grill me, mode toggle
- `confidence-check` skill — pre-execution confidence assessment (inspired by SuperClaude)
- `four-question-validation` skill — post-implementation hallucination detection
- BIBLE.md — comprehensive development guide structured as 7 chapters + appendices
- CHEATSHEET.md — daily reference for commands, workflows, and power user tips
- SKILLS-INDEX.md — searchable skill directory with quick-start bundles
- Interactive installer with matrix rain, ASCII art, and progress visualization
- Uninstaller with backup detection and restore support
- Hook test harness (Node.js built-in test runner)
- Standalone hooks.json for users without ECC
- VS Code tasks.json for keyboard shortcut integration
- Plugin manifest for Claude Code marketplace compatibility
- GitHub Actions CI for validation
- Kevin's personal overlay (kevin/ directory) with OpenClaw/Paperclip integration
- IDE compatibility guide for VS Code, Cursor, JetBrains, and terminal

### Security
- Destructive command guard (careful-guard.js) with disclaimer about scope
- Settings template deny list for rm -rf, force push, hard reset
- Input sanitization in installer

### Contributors
Built by Kevin Z. Incorporates patterns and best practices from 200+ community sources including ykdojo, hooeem, aiedge_, dr_cintas, SuperClaude Framework, MichLieben, coreyganim, GriffinHilly, bekacru, and many more. See BIBLE.md Appendix B for full credits.
