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

VERSION="1.0.0"
CLAUDE_DIR="$HOME/.claude"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
INSTALL_MODE="staff"
USER_NAME=""
DRY_RUN=false
VERIFY_ONLY=false
FORCE=false
BACKUP_DIR=""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# ── Parse flags ──────────────────────────────────────────────────────────────

while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)  DRY_RUN=true; shift ;;
    --verify)   VERIFY_ONLY=true; shift ;;
    --force)    FORCE=true; shift ;;
    --help|-h)
      echo "Kevin Z's Claude Code Kit v$VERSION — Installer"
      echo ""
      echo "Usage: ./install.sh [flags]"
      echo "  --dry-run    Preview what would be installed"
      echo "  --verify     Validate an existing installation"
      echo "  --force      Skip confirmation prompts"
      echo "  --help       Show this help"
      exit 0
      ;;
    *) echo "Unknown flag: $1"; exit 1 ;;
  esac
done

# ── Header ───────────────────────────────────────────────────────────────────

echo ""
echo -e "${BOLD}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}║   Kevin Z's Claude Code Kit v${VERSION}           ║${NC}"
echo -e "${BOLD}║   The Ultimate Claude Code Setup             ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════════════╝${NC}"
echo ""

# ── Verify mode ──────────────────────────────────────────────────────────────

if $VERIFY_ONLY; then
  echo -e "${CYAN}Verifying installation...${NC}"
  errors=0

  # Check claude binary
  if command -v claude &>/dev/null; then
    echo -e "  ${GREEN}✓${NC} Claude Code CLI installed"
  else
    echo -e "  ${RED}✗${NC} Claude Code CLI not found"
    ((errors++))
  fi

  # Check CLAUDE.md
  if [ -f "$CLAUDE_DIR/CLAUDE.md" ]; then
    echo -e "  ${GREEN}✓${NC} CLAUDE.md exists"
  else
    echo -e "  ${RED}✗${NC} CLAUDE.md missing"
    ((errors++))
  fi

  # Check settings.json
  if [ -f "$CLAUDE_DIR/settings.json" ]; then
    if python3 -c "import json; json.load(open('$CLAUDE_DIR/settings.json'))" 2>/dev/null; then
      echo -e "  ${GREEN}✓${NC} settings.json valid JSON"
    else
      echo -e "  ${RED}✗${NC} settings.json invalid JSON"
      ((errors++))
    fi
  else
    echo -e "  ${RED}✗${NC} settings.json missing"
    ((errors++))
  fi

  # Check skills
  if [ -d "$CLAUDE_DIR/skills" ]; then
    skill_count=$(find "$CLAUDE_DIR/skills" -maxdepth 1 -type d | wc -l | tr -d ' ')
    skill_count=$((skill_count - 1))  # subtract the skills/ dir itself
    echo -e "  ${GREEN}✓${NC} Skills directory ($skill_count skills)"
  else
    echo -e "  ${RED}✗${NC} Skills directory missing"
    ((errors++))
  fi

  # Check mega-skills
  for mega in mega-seo mega-design mega-testing mega-marketing mega-saas mega-devops; do
    if [ -d "$CLAUDE_DIR/skills/$mega" ]; then
      sub_count=$(find "$CLAUDE_DIR/skills/$mega" -maxdepth 1 -type d | wc -l | tr -d ' ')
      sub_count=$((sub_count - 1))
      echo -e "  ${GREEN}✓${NC} KZ $mega ($sub_count sub-skills)"
    else
      echo -e "  ${YELLOW}!${NC} KZ $mega not found"
    fi
  done

  # Check commands
  if [ -d "$CLAUDE_DIR/commands" ]; then
    cmd_count=$(find "$CLAUDE_DIR/commands" -name '*.md' | wc -l | tr -d ' ')
    echo -e "  ${GREEN}✓${NC} Commands directory ($cmd_count commands)"
  else
    echo -e "  ${RED}✗${NC} Commands directory missing"
    ((errors++))
  fi

  # Check hooks
  if [ -f "$CLAUDE_DIR/hooks/hooks.json" ]; then
    echo -e "  ${GREEN}✓${NC} hooks.json exists"
  else
    echo -e "  ${YELLOW}!${NC} hooks.json not found"
  fi

  # Check reference docs
  for doc in BIBLE.md CHEATSHEET.md SKILLS-INDEX.md; do
    if [ -f "$CLAUDE_DIR/$doc" ]; then
      echo -e "  ${GREEN}✓${NC} $doc exists"
    else
      echo -e "  ${YELLOW}!${NC} $doc not found"
    fi
  done

  # Check for placeholder tokens
  if grep -rq '\[Your Name\]' "$CLAUDE_DIR/CLAUDE.md" 2>/dev/null; then
    echo -e "  ${YELLOW}!${NC} CLAUDE.md still has [Your Name] placeholder"
  fi

  echo ""
  if [ $errors -eq 0 ]; then
    echo -e "${GREEN}Installation is healthy.${NC}"
  else
    echo -e "${RED}Found $errors issue(s).${NC}"
  fi
  exit $errors
fi

# ── Identity ─────────────────────────────────────────────────────────────────

echo -e "${BOLD}Who is this?${NC}"
read -p "Enter your name: " USER_NAME

if [ -z "$USER_NAME" ]; then
  echo -e "${RED}Name required.${NC}"
  exit 1
fi

if [[ "${USER_NAME,,}" == "kevin" ]]; then
  read -sp "Password: " PASS
  echo ""
  if [[ "$PASS" == "kz123" ]]; then
    INSTALL_MODE="kevin"
    echo -e "${GREEN}Welcome back, Kevin.${NC}"
  else
    echo -e "${YELLOW}Wrong password. Installing staff config for Kevin.${NC}"
    INSTALL_MODE="staff"
  fi
else
  echo -e "${BLUE}Setting up staff config for ${USER_NAME}.${NC}"
fi

echo ""
echo -e "Install mode: ${BOLD}${INSTALL_MODE}${NC}"
echo -e "Target: ${BOLD}${CLAUDE_DIR}/${NC}"

# ── Dry run ──────────────────────────────────────────────────────────────────

if $DRY_RUN; then
  echo ""
  echo -e "${CYAN}DRY RUN — nothing will be changed${NC}"
  echo ""
  echo "Would install:"
  echo "  CLAUDE.md        ← CLAUDE.md.${INSTALL_MODE}${INSTALL_MODE:+"-template"}"
  echo "  settings.json    ← settings.json.${INSTALL_MODE}${INSTALL_MODE:+"-template"}"
  echo "  skills/          ← $(find "$SCRIPT_DIR/skills" -maxdepth 1 -type d | wc -l | tr -d ' ') skill directories"
  echo "  commands/        ← $(find "$SCRIPT_DIR/commands" -name '*.md' | wc -l | tr -d ' ') commands"
  echo "  hooks/           ← hooks.json + example scripts"
  echo "  templates/       ← starter templates"
  echo "  BIBLE.md         ← Kevin Z's Claude Code Bible"
  echo "  CHEATSHEET.md    ← Quick reference"
  echo "  SKILLS-INDEX.md  ← Skill discovery"
  echo ""

  if [ -d "$CLAUDE_DIR" ]; then
    echo "Would backup existing ~/.claude/ first."
  fi

  echo ""
  echo -e "${YELLOW}Run without --dry-run to install.${NC}"
  exit 0
fi

# ── Confirmation ─────────────────────────────────────────────────────────────

if ! $FORCE; then
  echo ""
  if [ -d "$CLAUDE_DIR" ]; then
    echo -e "${YELLOW}This will backup and replace your existing ~/.claude/ setup.${NC}"
  else
    echo "This will create a new ~/.claude/ setup."
  fi
  read -p "Continue? (y/N) " confirm
  if [[ "${confirm,,}" != "y" ]]; then
    echo "Aborted."
    exit 0
  fi
fi

# ── Backup ───────────────────────────────────────────────────────────────────

if [ -d "$CLAUDE_DIR" ]; then
  BACKUP_DIR="$CLAUDE_DIR.backup.$(date +%Y%m%d%H%M%S)"
  echo ""
  echo -e "${CYAN}Backing up existing ~/.claude/ → ${BACKUP_DIR}${NC}"
  cp -r "$CLAUDE_DIR" "$BACKUP_DIR"
  echo -e "  ${GREEN}✓${NC} Backup complete"
  echo -e "  Restore: ${BOLD}rm -rf ~/.claude && mv $BACKUP_DIR ~/.claude${NC}"
fi

# ── Install Claude Code CLI ─────────────────────────────────────────────────

if ! command -v claude &>/dev/null; then
  echo ""
  echo -e "${CYAN}Installing Claude Code CLI...${NC}"
  npm install -g @anthropic-ai/claude-code
  echo -e "  ${GREEN}✓${NC} Claude Code CLI installed"
fi

# ── Create directory structure ───────────────────────────────────────────────

echo ""
echo -e "${CYAN}Installing Kevin Z's Claude Code Kit v${VERSION}...${NC}"

mkdir -p "$CLAUDE_DIR"

# ── Skills ───────────────────────────────────────────────────────────────────

echo -e "  Installing skills..."
rm -rf "$CLAUDE_DIR/skills"
cp -r "$SCRIPT_DIR/skills/" "$CLAUDE_DIR/skills/"
skill_count=$(find "$CLAUDE_DIR/skills" -maxdepth 1 -type d | wc -l | tr -d ' ')
skill_count=$((skill_count - 1))
echo -e "  ${GREEN}✓${NC} $skill_count skills installed"

# ── Commands ─────────────────────────────────────────────────────────────────

echo -e "  Installing commands..."
rm -rf "$CLAUDE_DIR/commands"
cp -r "$SCRIPT_DIR/commands/" "$CLAUDE_DIR/commands/"
cmd_count=$(find "$CLAUDE_DIR/commands" -name '*.md' | wc -l | tr -d ' ')
echo -e "  ${GREEN}✓${NC} $cmd_count commands installed"

# ── Hooks ────────────────────────────────────────────────────────────────────

echo -e "  Installing hooks..."
mkdir -p "$CLAUDE_DIR/hooks"
cp -r "$SCRIPT_DIR/hooks/"* "$CLAUDE_DIR/hooks/" 2>/dev/null || true
echo -e "  ${GREEN}✓${NC} Hooks installed"

# ── Templates ────────────────────────────────────────────────────────────────

echo -e "  Installing templates..."
mkdir -p "$CLAUDE_DIR/templates"
cp -r "$SCRIPT_DIR/templates/"* "$CLAUDE_DIR/templates/" 2>/dev/null || true
echo -e "  ${GREEN}✓${NC} Templates installed"

# ── Reference docs ───────────────────────────────────────────────────────────

echo -e "  Installing reference docs..."
for doc in BIBLE.md CHEATSHEET.md SKILLS-INDEX.md; do
  if [ -f "$SCRIPT_DIR/$doc" ]; then
    cp "$SCRIPT_DIR/$doc" "$CLAUDE_DIR/$doc"
    echo -e "  ${GREEN}✓${NC} $doc"
  fi
done

# ── Config files ─────────────────────────────────────────────────────────────

echo -e "  Applying ${INSTALL_MODE} configuration..."

if [[ "$INSTALL_MODE" == "kevin" ]]; then
  # Kevin's config
  if [ -f "$SCRIPT_DIR/CLAUDE.md.kevin" ]; then
    cp "$SCRIPT_DIR/CLAUDE.md.kevin" "$CLAUDE_DIR/CLAUDE.md"
  fi
  if [ -f "$SCRIPT_DIR/settings.json.kevin" ]; then
    cp "$SCRIPT_DIR/settings.json.kevin" "$CLAUDE_DIR/settings.json"
  fi
  echo -e "  ${GREEN}✓${NC} Kevin's config applied (full MCP servers, custom paths)"
else
  # Staff config — personalize with user's name
  if [ -f "$SCRIPT_DIR/CLAUDE.md.staff-template" ]; then
    sed "s/\[Your Name\]/$USER_NAME/g" "$SCRIPT_DIR/CLAUDE.md.staff-template" > "$CLAUDE_DIR/CLAUDE.md"
  fi
  if [ -f "$SCRIPT_DIR/settings.json.staff-template" ]; then
    cp "$SCRIPT_DIR/settings.json.staff-template" "$CLAUDE_DIR/settings.json"
  fi
  echo -e "  ${GREEN}✓${NC} Staff config applied for $USER_NAME"
fi

# Validate JSON
if [ -f "$CLAUDE_DIR/settings.json" ]; then
  if python3 -c "import json; json.load(open('$CLAUDE_DIR/settings.json'))" 2>/dev/null; then
    echo -e "  ${GREEN}✓${NC} settings.json valid"
  else
    echo -e "  ${RED}✗${NC} settings.json has syntax errors — check manually"
  fi
fi

# ── Create symlinks for backward compatibility ───────────────────────────────

echo -e "  Creating backward-compatibility symlinks..."
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

if [ $symlink_count -gt 0 ]; then
  echo -e "  ${GREEN}✓${NC} $symlink_count symlinks created"
fi

# ── Summary ──────────────────────────────────────────────────────────────────

echo ""
echo -e "${BOLD}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}║           Installation Complete              ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  User:       ${BOLD}$USER_NAME${NC} ($INSTALL_MODE)"
echo -e "  Skills:     ${BOLD}$skill_count${NC} (including 6 KZ Mega-Skills)"
echo -e "  Commands:   ${BOLD}$cmd_count${NC}"
echo -e "  Symlinks:   ${BOLD}$symlink_count${NC}"
echo ""
echo -e "  ${BOLD}KZ Mega-Skills:${NC}"
echo -e "    ${CYAN}mega-seo${NC}       — 19 SEO skills in one"
echo -e "    ${CYAN}mega-design${NC}    — 35+ design/animation skills in one"
echo -e "    ${CYAN}mega-testing${NC}   — 15 testing skills in one"
echo -e "    ${CYAN}mega-marketing${NC} — 46 marketing skills in one"
echo -e "    ${CYAN}mega-saas${NC}      — 20 SaaS building skills in one"
echo -e "    ${CYAN}mega-devops${NC}    — 20 DevOps skills in one"
echo ""

if [ -n "$BACKUP_DIR" ]; then
  echo -e "  ${YELLOW}Backup:${NC} $BACKUP_DIR"
  echo -e "  Restore: rm -rf ~/.claude && mv $BACKUP_DIR ~/.claude"
  echo ""
fi

echo -e "${BOLD}NEXT STEPS:${NC}"
echo -e "  1. ${BOLD}export ANTHROPIC_API_KEY='your-key'${NC} (if not already set)"
echo -e "  2. ${BOLD}claude${NC} — start Claude Code"
echo -e "  3. ${BOLD}/init${NC} — run the interactive project setup wizard"
echo ""
echo -e "${BOLD}REFERENCE DOCS:${NC}"
echo -e "  Bible:      ${CYAN}~/.claude/BIBLE.md${NC}"
echo -e "  Cheatsheet: ${CYAN}~/.claude/CHEATSHEET.md${NC}"
echo -e "  Skills:     ${CYAN}~/.claude/SKILLS-INDEX.md${NC}"
echo ""
