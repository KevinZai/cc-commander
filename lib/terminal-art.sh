#!/bin/bash
# ============================================================================
# The Claude Code Bible — Terminal Art Library
# ============================================================================
# Source this file in any shell script for consistent KZ branding.
#   source "$(dirname "$0")/lib/terminal-art.sh"
#
# All functions respect these env vars:
#   KZ_NO_COLOR=1        Disable all ANSI colors
#   KZ_NO_ANIMATION=1    Disable matrix rain and typewriter effects
#   KZ_RAIN_DURATION=N   Override rain duration (seconds, default: 2)
# ============================================================================

# ── Color Palette (256-color ANSI) ─────────────────────────────────────────

if [[ "$KZ_NO_COLOR" == "1" ]] || [[ ! -t 1 ]] || [[ "$TERM" == "dumb" ]]; then
  # No color mode
  M_BRIGHT="" M_MID="" M_DIM="" M_FADE=""
  M_WHITE="" M_CYAN="" M_AMBER="" M_RED="" M_GRAY=""
  M_BOLD="" M_ITALIC="" M_UNDERLINE="" NC=""
  M_BG_DIM="" M_BG_DARK=""
else
  M_BRIGHT='\033[38;5;46m'    # #00FF00 — headings, active elements
  M_MID='\033[38;5;34m'       # #00AF00 — body text, borders
  M_DIM='\033[38;5;22m'       # #005F00 — background, shadows
  M_FADE='\033[38;5;28m'      # #008700 — gradient transitions
  M_WHITE='\033[38;5;255m'    # #EEEEEE — key values, names
  M_CYAN='\033[38;5;51m'      # #00FFFF — links, references
  M_AMBER='\033[38;5;214m'    # #FFAF00 — warnings
  M_RED='\033[38;5;196m'      # #FF0000 — errors
  M_GRAY='\033[38;5;238m'     # #444444 — inactive/completed
  M_BOLD='\033[1m'
  M_ITALIC='\033[3m'
  M_UNDERLINE='\033[4m'
  NC='\033[0m'
  M_BG_DIM='\033[48;5;233m'   # Dark background for panels
  M_BG_DARK='\033[48;5;232m'  # Darker background
fi

# ── Utility ────────────────────────────────────────────────────────────────

kz_term_width() {
  local w
  w=$(tput cols 2>/dev/null || echo 80)
  echo "$w"
}

kz_can_animate() {
  [[ "$KZ_NO_ANIMATION" != "1" ]] && [[ -t 1 ]] && [[ "$TERM" != "dumb" ]] && \
  [[ -z "$CI" ]] && [[ -z "$GITHUB_ACTIONS" ]] && [[ -z "$JENKINS_URL" ]]
}

kz_repeat_char() {
  local char="$1" count="$2"
  printf '%*s' "$count" '' | tr ' ' "$char"
}

# ── Matrix Rain ────────────────────────────────────────────────────────────

kz_matrix_rain() {
  local duration="${1:-${KZ_RAIN_DURATION:-2}}"

  kz_can_animate || return 0

  local cols rows
  cols=$(tput cols 2>/dev/null || echo 80)
  rows=$(tput lines 2>/dev/null || echo 24)

  # Character sets
  local ascii_chars='0123456789@#$%&*+=<>?~^|/\'
  local kata_chars='アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'

  # Test katakana support — fall back to ASCII
  local chars="$kata_chars"
  if ! printf '\xe3\x82\xa2' 2>/dev/null | grep -q 'ア' 2>/dev/null; then
    chars="$ascii_chars"
  fi
  local char_len=${#chars}

  # Drop state arrays
  declare -a drop_y drop_speed drop_active
  for ((i=0; i<cols; i++)); do
    drop_y[$i]=0
    drop_speed[$i]=$(( (RANDOM % 3) + 1 ))
    drop_active[$i]=$(( RANDOM % 3 == 0 ? 1 : 0 ))
  done

  # Save screen and hide cursor
  tput smcup 2>/dev/null
  tput civis 2>/dev/null
  printf '\033[2J\033[H'  # Clear screen

  local end_time=$(( $(date +%s) + duration ))
  local frame=0

  while [[ $(date +%s) -lt $end_time ]]; do
    for ((c=0; c<cols; c+=2)); do  # Skip every other column for performance
      # Spawn new drops
      if [[ ${drop_active[$c]} -eq 0 ]] && (( RANDOM % 8 == 0 )); then
        drop_y[$c]=0
        drop_speed[$c]=$(( (RANDOM % 3) + 1 ))
        drop_active[$c]=1
      fi

      if [[ ${drop_active[$c]} -eq 1 ]]; then
        local y=${drop_y[$c]}
        local ch_idx=$(( RANDOM % char_len ))
        local ch="${chars:$ch_idx:1}"

        # Head (bright green)
        if (( y >= 0 && y < rows )); then
          printf "\033[%d;%dH${M_BRIGHT}%s${NC}" "$((y+1))" "$((c+1))" "$ch"
        fi

        # Trail (mid green, 1 behind)
        if (( y-1 >= 0 && y-1 < rows )); then
          local tr_idx=$(( RANDOM % char_len ))
          printf "\033[%d;%dH${M_MID}%s${NC}" "$y" "$((c+1))" "${chars:$tr_idx:1}"
        fi

        # Fade (dim green, 3 behind)
        if (( y-3 >= 0 && y-3 < rows )); then
          local fd_idx=$(( RANDOM % char_len ))
          printf "\033[%d;%dH${M_DIM}%s${NC}" "$((y-2))" "$((c+1))" "${chars:$fd_idx:1}"
        fi

        # Erase (far behind)
        if (( y-6 >= 0 && y-6 < rows )); then
          printf "\033[%d;%dH " "$((y-5))" "$((c+1))"
        fi

        # Advance
        drop_y[$c]=$(( y + ${drop_speed[$c]} ))

        # Despawn if off screen
        if (( ${drop_y[$c]} > rows + 8 )); then
          drop_active[$c]=0
        fi
      fi
    done

    sleep 0.04
    ((frame++))
  done

  # Restore screen
  tput rmcup 2>/dev/null
  tput cnorm 2>/dev/null
}

# ── ASCII Banners ──────────────────────────────────────────────────────────

kz_banner() {
  local w
  w=$(kz_term_width)

  if (( w < 55 )); then
    kz_mini_banner
    return
  fi

  echo ""
  echo -e "${M_MID}┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓${NC}"
  echo -e "${M_MID}┃${NC}                                                     ${M_MID}┃${NC}"
  echo -e "${M_MID}┃${NC}   ${M_BRIGHT}╔╗ ╦╔╗ ╦  ╔═╗${NC}                                  ${M_MID}┃${NC}"
  echo -e "${M_MID}┃${NC}   ${M_BRIGHT}╠╩╗║╠╩╗║  ║╣${NC}                                   ${M_MID}┃${NC}"
  echo -e "${M_MID}┃${NC}   ${M_BRIGHT}╚═╝╩╚═╝╩═╝╚═╝${NC}                                  ${M_MID}┃${NC}"
  echo -e "${M_MID}┃${NC}                                                     ${M_MID}┃${NC}"
  echo -e "${M_MID}┃${NC}   ${M_WHITE}The Claude Code Bible${NC}  ${M_DIM}v1.0${NC}                              ${M_MID}┃${NC}"
  echo -e "${M_MID}┃${NC}   ${M_DIM}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}   ${M_MID}┃${NC}"
  echo -e "${M_MID}┃${NC}   ${M_CYAN}by Kevin Z${NC}  ${M_DIM}//${NC}  ${M_WHITE}220+ Skills. One Install.${NC}     ${M_MID}┃${NC}"
  echo -e "${M_MID}┃${NC}                                                     ${M_MID}┃${NC}"
  echo -e "${M_MID}┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛${NC}"
  echo ""
}

kz_mini_banner() {
  echo ""
  echo -e "${M_MID}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "  ${M_BRIGHT}BIBLE${NC} ${M_DIM}v1.0${NC}  ${M_CYAN}The Claude Code Bible — by Kevin Z${NC}"
  echo -e "${M_MID}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
}

# ── Section Headers ────────────────────────────────────────────────────────

kz_section_header() {
  local title="$1"
  local w
  w=$(kz_term_width)
  local title_len=${#title}
  local pad=$(( (w - title_len - 6) / 2 ))
  (( pad < 2 )) && pad=2
  local left=$(kz_repeat_char '━' "$pad")
  local right=$(kz_repeat_char '━' "$pad")
  echo ""
  echo -e "${M_MID}${left}${NC} ${M_BRIGHT}[ ${title} ]${NC} ${M_MID}${right}${NC}"
  echo ""
}

# ── Status Line ────────────────────────────────────────────────────────────

kz_status_line() {
  local icon="$1" msg="$2" color="${3:-}"
  local icon_color=""
  case "$icon" in
    "✓"|"done")    icon="✓"; icon_color="$M_BRIGHT" ;;
    "✗"|"error")   icon="✗"; icon_color="$M_RED" ;;
    "!"|"warn")    icon="!"; icon_color="$M_AMBER" ;;
    "►"|"active")  icon="►"; icon_color="$M_CYAN" ;;
    "·"|"info")    icon="·"; icon_color="$M_DIM" ;;
    *)             icon_color="$M_DIM" ;;
  esac
  echo -e "  ${icon_color}${icon}${NC} ${color}${msg}${NC}"
}

# ── Progress Bar ───────────────────────────────────────────────────────────

kz_progress_bar() {
  local current="$1" total="$2" label="${3:-}"
  local bar_width=20
  local filled=$(( current * bar_width / total ))
  local empty=$(( bar_width - filled ))

  local bar_filled=$(kz_repeat_char '█' "$filled")
  local bar_empty=$(kz_repeat_char '░' "$empty")

  echo -e "  ${M_MID}▐${M_BRIGHT}${bar_filled}${M_DIM}${bar_empty}${M_MID}▌${NC}  ${M_WHITE}${current}/${total}${NC}  ${M_DIM}${label}${NC}"
}

# ── Typewriter Effect ──────────────────────────────────────────────────────

kz_typewriter() {
  local text="$1" delay="${2:-0.015}" color="${3:-$M_DIM}"

  if ! kz_can_animate; then
    echo -e "${color}${text}${NC}"
    return
  fi

  printf "${color}"
  local i
  for (( i=0; i<${#text}; i++ )); do
    printf '%s' "${text:$i:1}"
    sleep "$delay"
  done
  printf "${NC}\n"
}

# ── Bible Summary Card ────────────────────────────────────────────────────

kz_bible_summary() {
  echo ""
  echo -e "${M_MID}┌─────────────────────────────────────────────────────┐${NC}"
  echo -e "${M_MID}│${NC}  ${M_BRIGHT}${M_BOLD}THE KEVIN Z METHOD${NC}                                  ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}                                                     ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_WHITE}Golden Rules:${NC}                                       ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_CYAN}1.${NC} Context is King — structure > freestyle           ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_CYAN}2.${NC} Skills > Prompts — load, don't type               ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_CYAN}3.${NC} Plan Before Build — evals → spec → code           ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_CYAN}4.${NC} Verify Everything — trust but verify              ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_CYAN}5.${NC} Learn From Mistakes — lessons.md is sacred        ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}                                                     ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_WHITE}Build Types:${NC}                                        ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_BRIGHT}QUICK${NC} <4h  ${M_DIM}│${NC}  ${M_BRIGHT}DEEP${NC} 1-5d  ${M_DIM}│${NC}  ${M_BRIGHT}SAAS${NC} 1-4w          ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_BRIGHT}OVERNIGHT${NC} 6-12h autonomous                        ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}                                                     ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_DIM}Full Bible: ~/.claude/BIBLE.md${NC}                       ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_DIM}Cheatsheet: ~/.claude/CHEATSHEET.md${NC}                  ${M_MID}│${NC}"
  echo -e "${M_MID}└─────────────────────────────────────────────────────┘${NC}"
  echo ""
}

# ── Next Steps Panel ───────────────────────────────────────────────────────

kz_next_steps() {
  local mode="${1:-staff}"

  echo -e "${M_MID}┌─────────────────────────────────────────────────────┐${NC}"
  echo -e "${M_MID}│${NC}  ${M_BRIGHT}${M_BOLD}NEXT STEPS${NC}                                          ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}                                                     ${M_MID}│${NC}"
  if [[ "$mode" == "kevin" ]]; then
    echo -e "${M_MID}│${NC}  ${M_WHITE}1.${NC} ${M_CYAN}claude${NC}                                            ${M_MID}│${NC}"
    echo -e "${M_MID}│${NC}     Start Claude Code (API key already set)         ${M_MID}│${NC}"
    echo -e "${M_MID}│${NC}                                                     ${M_MID}│${NC}"
    echo -e "${M_MID}│${NC}  ${M_WHITE}2.${NC} ${M_CYAN}/init${NC}                                             ${M_MID}│${NC}"
    echo -e "${M_MID}│${NC}     Launch the KZ Project Wizard                    ${M_MID}│${NC}"
    echo -e "${M_MID}│${NC}                                                     ${M_MID}│${NC}"
    echo -e "${M_MID}│${NC}  ${M_WHITE}3.${NC} ${M_CYAN}/plan${NC}                                             ${M_MID}│${NC}"
    echo -e "${M_MID}│${NC}     Spec-first planning for any feature             ${M_MID}│${NC}"
  else
    echo -e "${M_MID}│${NC}  ${M_WHITE}1.${NC} ${M_CYAN}export ANTHROPIC_API_KEY='your-key'${NC}                ${M_MID}│${NC}"
    echo -e "${M_MID}│${NC}     Set your API key (or use Claude Max)            ${M_MID}│${NC}"
    echo -e "${M_MID}│${NC}                                                     ${M_MID}│${NC}"
    echo -e "${M_MID}│${NC}  ${M_WHITE}2.${NC} ${M_CYAN}claude${NC}                                            ${M_MID}│${NC}"
    echo -e "${M_MID}│${NC}     Start Claude Code                               ${M_MID}│${NC}"
    echo -e "${M_MID}│${NC}                                                     ${M_MID}│${NC}"
    echo -e "${M_MID}│${NC}  ${M_WHITE}3.${NC} ${M_CYAN}/init${NC}                                             ${M_MID}│${NC}"
    echo -e "${M_MID}│${NC}     Launch the KZ Project Wizard                    ${M_MID}│${NC}"
  fi
  echo -e "${M_MID}│${NC}                                                     ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_DIM}220+ skills  │  84 commands  │  6 mega-skills${NC}      ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_DIM}22 hooks     │  3 templates  │  The Kevin Z Bible${NC}  ${M_MID}│${NC}"
  echo -e "${M_MID}└─────────────────────────────────────────────────────┘${NC}"
  echo ""
}

# ── Farewell ───────────────────────────────────────────────────────────────

kz_farewell() {
  echo ""
  if kz_can_animate; then
    # Cascading green fade effect
    local lines=(
      "  ${M_BRIGHT}The Matrix has you...${NC}"
      "  ${M_MID}Now go build something amazing.${NC}"
      ""
      "  ${M_DIM}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
      "  ${M_DIM}The Claude Code Bible — by Kevin Z  //  github.com/k3v80${NC}"
      "  ${M_DIM}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    )
    for line in "${lines[@]}"; do
      echo -e "$line"
      sleep 0.15
    done
  else
    echo -e "  ${M_DIM}The Claude Code Bible — by Kevin Z  //  github.com/k3v80${NC}"
  fi
  echo ""
}

# ── Init Intro ─────────────────────────────────────────────────────────────

kz_init_intro() {
  echo ""
  echo -e "${M_MID}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "  ${M_BRIGHT}${M_BOLD}BIBLE INIT${NC}  ${M_DIM}//${NC}  ${M_CYAN}CHOOSE YOUR ADVENTURE${NC}"
  echo -e "${M_MID}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "${M_MID}┌──────────────────────────────────────────────────────┐${NC}"
  echo -e "${M_MID}│${NC}                                                      ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_WHITE}Welcome to the Bible Project Initializer.${NC}              ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}                                                      ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  I'll ask you a series of questions to configure     ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  your perfect development environment. Every         ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  answer shapes your CLAUDE.md, skills, and workflow. ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}                                                      ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_CYAN}►${NC} ${M_WHITE}Phase 1:${NC} Project Identity        ${M_DIM}(3 questions)${NC}   ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_CYAN}►${NC} ${M_WHITE}Phase 2:${NC} Build Type              ${M_DIM}(THE question)${NC}  ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_CYAN}►${NC} ${M_WHITE}Phase 3:${NC} Domain Deep-Dive        ${M_DIM}(2-5 questions)${NC} ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_CYAN}►${NC} ${M_WHITE}Phase 4:${NC} Output Generation       ${M_DIM}(automatic)${NC}    ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}                                                      ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_DIM}Estimated time: ~3 minutes${NC}                          ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}                                                      ${M_MID}│${NC}"
  echo -e "${M_MID}└──────────────────────────────────────────────────────┘${NC}"
  echo ""
}

# ── Flow Display ───────────────────────────────────────────────────────────

kz_flow_display() {
  local current="$1" total="$2"
  local phases=("IDENTITY" "BUILD TYPE" "DEEP-DIVE" "GENERATE")
  local i

  echo ""
  printf "  "
  for ((i=0; i<total; i++)); do
    if (( i < current )); then
      printf "${M_BRIGHT}● ${phases[$i]}${NC}"
    elif (( i == current )); then
      printf "${M_CYAN}◉ ${phases[$i]}${NC}"
    else
      printf "${M_GRAY}○ ${phases[$i]}${NC}"
    fi
    if (( i < total - 1 )); then
      printf " ${M_DIM}→${NC} "
    fi
  done
  echo ""

  # Progress bar
  local filled=$(( (current + 1) * 100 / total ))
  kz_progress_bar "$((current + 1))" "$total" "Phase $((current + 1)) of $total"
  echo ""
}

# ── Mega-Skills Summary ───────────────────────────────────────────────────

kz_mega_skills_display() {
  echo -e "${M_MID}┌─────────────────────────────────────────────────────┐${NC}"
  echo -e "${M_MID}│${NC}  ${M_BRIGHT}${M_BOLD}KZ MEGA-SKILLS${NC}  ${M_DIM}Load ONE, get the entire domain${NC}    ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}                                                     ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_CYAN}mega-seo${NC}       ${M_DIM}─${NC} ${M_WHITE}19${NC} SEO skills in one            ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_CYAN}mega-design${NC}    ${M_DIM}─${NC} ${M_WHITE}35+${NC} design/animation skills     ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_CYAN}mega-testing${NC}   ${M_DIM}─${NC} ${M_WHITE}15${NC} testing skills in one        ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_CYAN}mega-marketing${NC} ${M_DIM}─${NC} ${M_WHITE}46${NC} marketing skills in one      ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_CYAN}mega-saas${NC}      ${M_DIM}─${NC} ${M_WHITE}20${NC} SaaS building skills        ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}  ${M_CYAN}mega-devops${NC}    ${M_DIM}─${NC} ${M_WHITE}20${NC} DevOps skills in one        ${M_MID}│${NC}"
  echo -e "${M_MID}│${NC}                                                     ${M_MID}│${NC}"
  echo -e "${M_MID}└─────────────────────────────────────────────────────┘${NC}"
}
