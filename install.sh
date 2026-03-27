#!/bin/bash
# ============================================================================
# Kevin Z's Claude Code Kit — Universal Installer
# ============================================================================
# Usage:
#   ./install.sh              Interactive install (asks who you are)
#   ./install.sh --dry-run    Preview what would be installed
#   ./install.sh --verify     Validate an existing installation
#   ./install.sh --force      Skip confirmation prompts
#
# For remote install:
#   git clone https://github.com/k3v80/claude-code-kit.git && cd claude-code-kit && ./install.sh
# ============================================================================

set -euo pipefail

VERSION="1.1.0"
CLAUDE_DIR="$HOME/.claude"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
INSTALL_MODE="staff"
USER_NAME=""
DRY_RUN=false
VERIFY_ONLY=false
FORCE=false
BACKUP_DIR=""

# Source the terminal art library
source "${SCRIPT_DIR}/lib/terminal-art.sh"

# ── Parse flags ──────────────────────────────────────────────────────────────

while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)  DRY_RUN=true; shift ;;
    --verify)   VERIFY_ONLY=true; shift ;;
    --force)    FORCE=true; shift ;;
    --help|-h)
      kz_mini_banner
      echo "Usage: ./install.sh [flags]"
      echo ""
      echo "  --dry-run    Preview what would be installed"
      echo "  --verify     Validate an existing installation"
      echo "  --force      Skip confirmation prompts"
      echo "  --help       Show this help"
      exit 0
      ;;
    *) echo -e "${M_RED}Unknown flag: $1${NC}"; exit 1 ;;
  esac
done

# ── Matrix Rain Intro ──────────────────────────────────────────────────────

kz_matrix_rain 2
clear 2>/dev/null || true
kz_banner
kz_typewriter "  Initializing the ultimate Claude Code setup..." 0.02 "$M_DIM"
echo ""

# ── Verify mode ──────────────────────────────────────────────────────────────

if $VERIFY_ONLY; then
  kz_section_header "VERIFICATION"
  errors=0

  # Check claude binary
  if command -v claude &>/dev/null; then
    kz_status_line "✓" "Claude Code CLI installed"
  else
    kz_status_line "✗" "Claude Code CLI not found"
    ((errors++))
  fi

  # Check CLAUDE.md
  if [ -f "$CLAUDE_DIR/CLAUDE.md" ]; then
    kz_status_line "✓" "CLAUDE.md exists"
  else
    kz_status_line "✗" "CLAUDE.md missing"
    ((errors++))
  fi

  # Check settings.json
  if [ -f "$CLAUDE_DIR/settings.json" ]; then
    if python3 -c "import json; json.load(open('$CLAUDE_DIR/settings.json'))" 2>/dev/null; then
      kz_status_line "✓" "settings.json valid JSON"
    else
      kz_status_line "✗" "settings.json invalid JSON"
      ((errors++))
    fi
  else
    kz_status_line "✗" "settings.json missing"
    ((errors++))
  fi

  # Check skills
  if [ -d "$CLAUDE_DIR/skills" ]; then
    skill_count=$(find "$CLAUDE_DIR/skills" -maxdepth 1 -type d | wc -l | tr -d ' ')
    skill_count=$((skill_count - 1))
    kz_status_line "✓" "Skills directory ($skill_count skills)"
  else
    kz_status_line "✗" "Skills directory missing"
    ((errors++))
  fi

  # Check mega-skills
  for mega in mega-seo mega-design mega-testing mega-marketing mega-saas mega-devops; do
    if [ -d "$CLAUDE_DIR/skills/$mega" ]; then
      sub_count=$(find "$CLAUDE_DIR/skills/$mega" -maxdepth 1 -type d | wc -l | tr -d ' ')
      sub_count=$((sub_count - 1))
      kz_status_line "✓" "KZ $mega ($sub_count sub-skills)" "$M_CYAN"
    else
      kz_status_line "!" "KZ $mega not found"
    fi
  done

  # Check commands
  if [ -d "$CLAUDE_DIR/commands" ]; then
    cmd_count=$(find "$CLAUDE_DIR/commands" -name '*.md' | wc -l | tr -d ' ')
    kz_status_line "✓" "Commands directory ($cmd_count commands)"
  else
    kz_status_line "✗" "Commands directory missing"
    ((errors++))
  fi

  # Check hooks
  if [ -f "$CLAUDE_DIR/hooks/hooks.json" ]; then
    kz_status_line "✓" "hooks.json exists"
  else
    kz_status_line "!" "hooks.json not found"
  fi

  # Check lib
  if [ -f "$CLAUDE_DIR/lib/terminal-art.sh" ]; then
    kz_status_line "✓" "Terminal art library installed"
  else
    kz_status_line "!" "Terminal art library not found"
  fi

  # Check reference docs
  for doc in BIBLE.md CHEATSHEET.md SKILLS-INDEX.md; do
    if [ -f "$CLAUDE_DIR/$doc" ]; then
      kz_status_line "✓" "$doc exists"
    else
      kz_status_line "!" "$doc not found"
    fi
  done

  # Check for placeholder tokens
  if grep -rq '\[Your Name\]' "$CLAUDE_DIR/CLAUDE.md" 2>/dev/null; then
    kz_status_line "!" "CLAUDE.md still has [Your Name] placeholder"
  fi

  echo ""
  if [ $errors -eq 0 ]; then
    kz_status_line "✓" "Installation is healthy" "$M_BRIGHT"
  else
    kz_status_line "✗" "Found $errors issue(s)" "$M_RED"
  fi
  echo ""
  exit $errors
fi

# ── Identity ─────────────────────────────────────────────────────────────────

kz_section_header "IDENTITY"
echo -e "  ${M_WHITE}Who is this?${NC}"
echo ""
read -p "  Enter your name: " USER_NAME

if [ -z "$USER_NAME" ]; then
  kz_status_line "✗" "Name required."
  exit 1
fi

echo ""

if [[ "${USER_NAME,,}" == "kevin" ]] && [ -f "$SCRIPT_DIR/CLAUDE.md.kevin" ]; then
  read -sp "  Passphrase: " PASS
  echo ""
  echo ""
  # Hash comparison — never store plaintext passwords
  PASS_HASH=$(printf '%s' "$PASS" | shasum -a 256 | cut -d' ' -f1)
  EXPECTED="83afc3fe3d62d629079a87a70afe9b32642162775f3929e9209741c052e99e11"
  if [[ "$PASS_HASH" == "$EXPECTED" ]]; then
    INSTALL_MODE="kevin"
    kz_status_line "✓" "Welcome back, Kevin." "$M_BRIGHT"
  else
    kz_status_line "!" "Wrong passphrase. Installing staff config."
    INSTALL_MODE="staff"
  fi
else
  kz_status_line "►" "Setting up config for ${USER_NAME}" "$M_CYAN"
fi

echo ""
echo -e "  ${M_DIM}Install mode:${NC} ${M_WHITE}${INSTALL_MODE}${NC}"
echo -e "  ${M_DIM}Target:${NC}       ${M_WHITE}${CLAUDE_DIR}/${NC}"

# ── Dry run ──────────────────────────────────────────────────────────────────

if $DRY_RUN; then
  kz_section_header "DRY RUN"
  echo -e "  ${M_AMBER}Nothing will be changed — preview only${NC}"
  echo ""

  local_skills=$(find "$SCRIPT_DIR/skills" -maxdepth 1 -type d | wc -l | tr -d ' ')
  local_skills=$((local_skills - 1))
  local_cmds=$(find "$SCRIPT_DIR/commands" -name '*.md' | wc -l | tr -d ' ')

  kz_status_line "·" "CLAUDE.md        ← CLAUDE.md.${INSTALL_MODE}$([ "$INSTALL_MODE" != "kevin" ] && echo '-template')"
  kz_status_line "·" "settings.json    ← settings.json.${INSTALL_MODE}$([ "$INSTALL_MODE" != "kevin" ] && echo '-template')"
  kz_status_line "·" "skills/          ← $local_skills skill directories"
  kz_status_line "·" "commands/        ← $local_cmds commands"
  kz_status_line "·" "hooks/           ← hooks.json + scripts"
  kz_status_line "·" "lib/             ← terminal art libraries"
  kz_status_line "·" "templates/       ← starter templates"
  kz_status_line "·" "BIBLE.md         ← Kevin Z's Claude Code Bible"
  kz_status_line "·" "CHEATSHEET.md    ← Quick reference"
  kz_status_line "·" "SKILLS-INDEX.md  ← Skill discovery"

  if [ -d "$CLAUDE_DIR" ]; then
    echo ""
    kz_status_line "!" "Would backup existing ~/.claude/ first"
  fi

  echo ""
  echo -e "  ${M_AMBER}Run without --dry-run to install.${NC}"
  echo ""
  exit 0
fi

# ── Confirmation ─────────────────────────────────────────────────────────────

if ! $FORCE; then
  echo ""
  if [ -d "$CLAUDE_DIR" ]; then
    echo -e "  ${M_AMBER}This will archive your existing ~/.claude/ setup and replace it.${NC}"
    echo -e "  ${M_DIM}Your old config will be safely backed up with a restore command.${NC}"
  else
    echo -e "  ${M_DIM}This will create a new ~/.claude/ setup.${NC}"
  fi
  echo ""
  read -p "  Continue? (y/N) " confirm
  if [[ "${confirm,,}" != "y" ]]; then
    echo ""
    kz_status_line "·" "Aborted. No changes made."
    echo ""
    exit 0
  fi
fi

# ── Backup ───────────────────────────────────────────────────────────────────

if [ -d "$CLAUDE_DIR" ]; then
  kz_section_header "ARCHIVING OLD SETUP"

  BACKUP_DIR="$CLAUDE_DIR.backup.$(date +%Y%m%d%H%M%S)"

  # Inventory of existing setup
  old_skills=0; old_cmds=0; old_hooks=0
  [ -d "$CLAUDE_DIR/skills" ] && old_skills=$(find "$CLAUDE_DIR/skills" -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ') && old_skills=$((old_skills - 1))
  [ -d "$CLAUDE_DIR/commands" ] && old_cmds=$(find "$CLAUDE_DIR/commands" -name '*.md' 2>/dev/null | wc -l | tr -d ' ')
  [ -f "$CLAUDE_DIR/hooks/hooks.json" ] && old_hooks=1

  echo -e "  ${M_DIM}Current setup contains:${NC}"
  [ -f "$CLAUDE_DIR/CLAUDE.md" ] && kz_status_line "·" "CLAUDE.md"
  [ -f "$CLAUDE_DIR/settings.json" ] && kz_status_line "·" "settings.json"
  [ "$old_skills" -gt 0 ] && kz_status_line "·" "$old_skills skills"
  [ "$old_cmds" -gt 0 ] && kz_status_line "·" "$old_cmds commands"
  [ "$old_hooks" -eq 1 ] && kz_status_line "·" "hooks.json"
  echo ""

  cp -r "$CLAUDE_DIR" "$BACKUP_DIR"

  kz_status_line "✓" "Archived to: ${M_WHITE}${BACKUP_DIR}${NC}"
  echo ""
  echo -e "  ${M_DIM}Restore command:${NC}"
  echo -e "  ${M_CYAN}rm -rf ~/.claude && mv ${BACKUP_DIR} ~/.claude${NC}"
fi

# ── Install Claude Code CLI ──────────────────────────────────────────────────

if ! command -v claude &>/dev/null; then
  kz_section_header "CLAUDE CODE CLI"
  echo -e "  ${M_DIM}Claude Code CLI not found. Installing...${NC}"
  npm install -g @anthropic-ai/claude-code
  kz_status_line "✓" "Claude Code CLI installed"
fi

# ── Install Components ───────────────────────────────────────────────────────

kz_section_header "INSTALLING"

install_step=0
install_total=8

mkdir -p "$CLAUDE_DIR"

# 1. Skills
((install_step++))
kz_progress_bar "$install_step" "$install_total" "Skills"
rm -rf "$CLAUDE_DIR/skills"
cp -r "$SCRIPT_DIR/skills/" "$CLAUDE_DIR/skills/"
skill_count=$(find "$CLAUDE_DIR/skills" -maxdepth 1 -type d | wc -l | tr -d ' ')
skill_count=$((skill_count - 1))
kz_status_line "✓" "$skill_count skills installed"

# 2. Commands
((install_step++))
kz_progress_bar "$install_step" "$install_total" "Commands"
rm -rf "$CLAUDE_DIR/commands"
cp -r "$SCRIPT_DIR/commands/" "$CLAUDE_DIR/commands/"
cmd_count=$(find "$CLAUDE_DIR/commands" -name '*.md' | wc -l | tr -d ' ')
kz_status_line "✓" "$cmd_count commands installed"

# 3. Hooks
((install_step++))
kz_progress_bar "$install_step" "$install_total" "Hooks"
mkdir -p "$CLAUDE_DIR/hooks"
cp -r "$SCRIPT_DIR/hooks/"* "$CLAUDE_DIR/hooks/" 2>/dev/null || true
kz_status_line "✓" "Hooks installed"

# 4. Lib (terminal art)
((install_step++))
kz_progress_bar "$install_step" "$install_total" "Libraries"
mkdir -p "$CLAUDE_DIR/lib"
cp -r "$SCRIPT_DIR/lib/"* "$CLAUDE_DIR/lib/" 2>/dev/null || true
kz_status_line "✓" "Terminal art library installed"

# 5. Templates
((install_step++))
kz_progress_bar "$install_step" "$install_total" "Templates"
mkdir -p "$CLAUDE_DIR/templates"
cp -r "$SCRIPT_DIR/templates/"* "$CLAUDE_DIR/templates/" 2>/dev/null || true
kz_status_line "✓" "Starter templates installed"

# 6. Reference docs
((install_step++))
kz_progress_bar "$install_step" "$install_total" "Reference docs"
for doc in BIBLE.md CHEATSHEET.md SKILLS-INDEX.md; do
  if [ -f "$SCRIPT_DIR/$doc" ]; then
    cp "$SCRIPT_DIR/$doc" "$CLAUDE_DIR/$doc"
  fi
done
kz_status_line "✓" "BIBLE.md + CHEATSHEET.md + SKILLS-INDEX.md"

# 7. Config files
((install_step++))
kz_progress_bar "$install_step" "$install_total" "Configuration"

if [[ "$INSTALL_MODE" == "kevin" ]]; then
  [ -f "$SCRIPT_DIR/CLAUDE.md.kevin" ] && cp "$SCRIPT_DIR/CLAUDE.md.kevin" "$CLAUDE_DIR/CLAUDE.md"
  [ -f "$SCRIPT_DIR/settings.json.kevin" ] && cp "$SCRIPT_DIR/settings.json.kevin" "$CLAUDE_DIR/settings.json"
  kz_status_line "✓" "Kevin's config applied (full MCP servers, custom paths)"
else
  if [ -f "$SCRIPT_DIR/CLAUDE.md.staff-template" ]; then
    # Sanitize user name for sed (escape sed special chars)
    SAFE_NAME=$(printf '%s\n' "$USER_NAME" | sed 's/[&/\]/\\&/g')
    sed "s/\[Your Name\]/$SAFE_NAME/g" "$SCRIPT_DIR/CLAUDE.md.staff-template" > "$CLAUDE_DIR/CLAUDE.md"
  fi
  [ -f "$SCRIPT_DIR/settings.json.staff-template" ] && cp "$SCRIPT_DIR/settings.json.staff-template" "$CLAUDE_DIR/settings.json"
  kz_status_line "✓" "Staff config applied for $USER_NAME"
fi

# Validate JSON
if [ -f "$CLAUDE_DIR/settings.json" ]; then
  if python3 -c "import json; json.load(open('$CLAUDE_DIR/settings.json'))" 2>/dev/null; then
    kz_status_line "✓" "settings.json validated"
  else
    kz_status_line "✗" "settings.json has syntax errors — check manually"
  fi
fi

# 8. Symlinks
((install_step++))
kz_progress_bar "$install_step" "$install_total" "Symlinks"

symlink_count=0

create_symlink() {
  local target="$1"
  local link="$2"
  if [ -d "$target" ] && [ ! -e "$link" ]; then
    ln -s "$target" "$link"
    ((symlink_count++))
  fi
}

# Mega-SEO symlinks
for skill in ai-seo aaio seo-optimizer seo-content-brief serp-analyzer backlink-audit search-console site-architecture analytics-conversion analytics-product bulk-page-generator content-strategy blog-engine social-integration guest-blogger; do
  create_symlink "$CLAUDE_DIR/skills/mega-seo/$skill" "$CLAUDE_DIR/skills/$skill"
done

# Mega-Design symlinks
for skill in animate svg-animation motion-design interactive-visuals particle-systems generative-backgrounds canvas-design webgl-shader retro-pixel colorize theme-factory screenshots frontend-design landing-page-builder frontend-slides web-artifacts-builder design-consultation adapt arrange audit bolder clarify critique delight distill extract harden normalize onboard optimize overdrive polish quieter typeset; do
  create_symlink "$CLAUDE_DIR/skills/mega-design/$skill" "$CLAUDE_DIR/skills/$skill"
done

# Mega-Testing symlinks
for skill in e2e-testing webapp-testing tdd-workflow verification-loop verification-before-completion ai-regression-testing eval-harness qa qa-only plankton-code-quality python-testing; do
  create_symlink "$CLAUDE_DIR/skills/mega-testing/$skill" "$CLAUDE_DIR/skills/$skill"
done

# Mega-SaaS symlinks
for skill in api-design backend-patterns database-designer better-auth stripe-subscriptions billing-automation saas-metrics-coach signup-flow-cro paywall-upgrade-cro form-cro nextjs-app-router shadcn-ui drizzle-neon tailwind-v4 fastify-api; do
  create_symlink "$CLAUDE_DIR/skills/mega-saas/$skill" "$CLAUDE_DIR/skills/$skill"
done

# Mega-DevOps symlinks
for skill in docker-development senior-devops github-actions-security github-actions-reusable-workflows aws-solution-architect aws-lambda-best-practices aws-s3-patterns aws-cloudfront-optimization aws-iam-security container-security prometheus-configuration grafana-dashboards promql-alerting infra-runbook network-engineer; do
  create_symlink "$CLAUDE_DIR/skills/mega-devops/$skill" "$CLAUDE_DIR/skills/$skill"
done

kz_status_line "✓" "$symlink_count backward-compatibility symlinks"
echo ""

# ── Bible Summary ────────────────────────────────────────────────────────────

kz_section_header "THE KEVIN Z METHOD"
kz_bible_summary

# ── Mega-Skills Overview ─────────────────────────────────────────────────────

kz_mega_skills_display
echo ""

# ── Installation Summary ─────────────────────────────────────────────────────

kz_section_header "INSTALLATION COMPLETE"

echo -e "  ${M_WHITE}User:${NC}       ${M_BRIGHT}$USER_NAME${NC} ${M_DIM}($INSTALL_MODE)${NC}"
echo -e "  ${M_WHITE}Skills:${NC}     ${M_BRIGHT}$skill_count${NC} ${M_DIM}(including 6 KZ Mega-Skills)${NC}"
echo -e "  ${M_WHITE}Commands:${NC}   ${M_BRIGHT}$cmd_count${NC}"
echo -e "  ${M_WHITE}Symlinks:${NC}   ${M_BRIGHT}$symlink_count${NC}"
echo ""

if [ -n "$BACKUP_DIR" ]; then
  echo -e "  ${M_AMBER}Old setup archived:${NC} ${M_DIM}${BACKUP_DIR}${NC}"
  echo -e "  ${M_DIM}Restore: rm -rf ~/.claude && mv ${BACKUP_DIR} ~/.claude${NC}"
  echo ""
fi

# ── Next Steps ───────────────────────────────────────────────────────────────

kz_next_steps "$INSTALL_MODE"

# ── Farewell ─────────────────────────────────────────────────────────────────

kz_farewell
