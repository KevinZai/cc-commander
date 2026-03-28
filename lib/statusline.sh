#!/bin/bash
# ============================================================================
# The Claude Code Bible — KZ Status Line
# ============================================================================
# Persistent footer showing context gauge, model, tokens, cost, rate limits.
# Receives JSON session data on stdin from Claude Code.
#
# Install:
#   Add to ~/.claude/settings.json:
#   "statusLine": {
#     "type": "command",
#     "command": "~/.claude/lib/statusline.sh",
#     "padding": 1
#   }
#
# Colors use KZ Matrix palette (bright green on black).
# ============================================================================

# Colors — KZ Matrix palette
G='\033[38;5;46m'    # bright green
M='\033[38;5;34m'    # mid green
D='\033[38;5;22m'    # dim green
C='\033[38;5;51m'    # cyan
W='\033[38;5;255m'   # white
A='\033[38;5;214m'   # amber
R='\033[38;5;196m'   # red
GR='\033[38;5;238m'  # gray
B='\033[1m'          # bold
N='\033[0m'          # reset

# Read JSON from stdin
INPUT=$(cat)

# Parse fields with jq (fall back gracefully)
if ! command -v jq &>/dev/null; then
  echo -e "${D}━━ ${M}KZ${N} ${D}━ jq required for status line ━━━${N}"
  exit 0
fi

# Extract values
CTX_PCT=$(echo "$INPUT" | jq -r '.context_window.used_percentage // 0' 2>/dev/null)
CTX_REM=$(echo "$INPUT" | jq -r '.context_window.remaining_percentage // 100' 2>/dev/null)
MODEL=$(echo "$INPUT" | jq -r '.model.display_name // "unknown"' 2>/dev/null)
MODEL_ID=$(echo "$INPUT" | jq -r '.model.id // ""' 2>/dev/null)
COST=$(echo "$INPUT" | jq -r '.cost.total_cost_usd // 0' 2>/dev/null)
IN_TOK=$(echo "$INPUT" | jq -r '.context_window.total_input_tokens // 0' 2>/dev/null)
OUT_TOK=$(echo "$INPUT" | jq -r '.context_window.total_output_tokens // 0' 2>/dev/null)
DURATION=$(echo "$INPUT" | jq -r '.cost.total_duration_ms // 0' 2>/dev/null)
PROJECT=$(echo "$INPUT" | jq -r '.workspace.current_dir // "?"' 2>/dev/null)
RATE_5H=$(echo "$INPUT" | jq -r '.rate_limits.five_hour.used_percentage // empty' 2>/dev/null)
RATE_7D=$(echo "$INPUT" | jq -r '.rate_limits.seven_day.used_percentage // empty' 2>/dev/null)
LINES_ADD=$(echo "$INPUT" | jq -r '.cost.total_lines_added // 0' 2>/dev/null)
LINES_REM=$(echo "$INPUT" | jq -r '.cost.total_lines_removed // 0' 2>/dev/null)
AGENT=$(echo "$INPUT" | jq -r '.agent.name // empty' 2>/dev/null)

# Round context percentage
CTX_INT=${CTX_PCT%.*}
CTX_INT=${CTX_INT:-0}

# Build context gauge bar (20 chars wide)
BAR_W=20
FILLED=$(( CTX_INT * BAR_W / 100 ))
EMPTY=$(( BAR_W - FILLED ))
[ $FILLED -gt $BAR_W ] && FILLED=$BAR_W && EMPTY=0

# Zone color based on usage
if [ "$CTX_INT" -ge 90 ]; then
  ZC="$R"; ZONE="DANGER"
elif [ "$CTX_INT" -ge 80 ]; then
  ZC="$R"; ZONE="RED"
elif [ "$CTX_INT" -ge 70 ]; then
  ZC="$A"; ZONE="ORANGE"
elif [ "$CTX_INT" -ge 50 ]; then
  ZC="$A"; ZONE="YELLOW"
else
  ZC="$G"; ZONE="GREEN"
fi

# Build the bar
BAR="${M}▐${ZC}"
for ((i=0; i<FILLED; i++)); do BAR+="█"; done
BAR+="${D}"
for ((i=0; i<EMPTY; i++)); do BAR+="░"; done
BAR+="${M}▌${N}"

# Format tokens (K)
fmt_k() {
  local v=$1
  if [ "$v" -ge 1000000 ]; then
    printf "%.1fM" "$(echo "scale=1; $v/1000000" | bc 2>/dev/null || echo "?")"
  elif [ "$v" -ge 1000 ]; then
    printf "%.0fK" "$(echo "scale=0; $v/1000" | bc 2>/dev/null || echo "?")"
  else
    printf "%d" "$v"
  fi
}

IN_FMT=$(fmt_k "$IN_TOK")
OUT_FMT=$(fmt_k "$OUT_TOK")

# Format duration
DUR_SEC=$(( DURATION / 1000 ))
if [ "$DUR_SEC" -ge 3600 ]; then
  DUR_FMT="$(( DUR_SEC / 3600 ))h$(( (DUR_SEC % 3600) / 60 ))m"
elif [ "$DUR_SEC" -ge 60 ]; then
  DUR_FMT="$(( DUR_SEC / 60 ))m$(( DUR_SEC % 60 ))s"
else
  DUR_FMT="${DUR_SEC}s"
fi

# Format cost
COST_FMT=$(printf "\$%.2f" "$COST" 2>/dev/null || echo "\$?")

# Short project name (last dir component)
PROJ_SHORT=$(basename "$PROJECT")

# Short model name
case "$MODEL_ID" in
  *opus*) MODEL_SHORT="Opus" ;;
  *sonnet*) MODEL_SHORT="Sonnet" ;;
  *haiku*) MODEL_SHORT="Haiku" ;;
  *) MODEL_SHORT="$MODEL" ;;
esac

# Rate limit section (only if available)
RATE_STR=""
if [ -n "$RATE_5H" ]; then
  R5=${RATE_5H%.*}
  if [ "$R5" -ge 80 ]; then
    RATE_STR+=" ${R}5h:${R5}%${N}"
  elif [ "$R5" -ge 50 ]; then
    RATE_STR+=" ${A}5h:${R5}%${N}"
  else
    RATE_STR+=" ${D}5h:${R5}%${N}"
  fi
fi
if [ -n "$RATE_7D" ]; then
  R7=${RATE_7D%.*}
  if [ "$R7" -ge 80 ]; then
    RATE_STR+=" ${R}7d:${R7}%${N}"
  elif [ "$R7" -ge 50 ]; then
    RATE_STR+=" ${A}7d:${R7}%${N}"
  else
    RATE_STR+=" ${D}7d:${R7}%${N}"
  fi
fi

# Agent indicator
AGENT_STR=""
[ -n "$AGENT" ] && AGENT_STR=" ${C}⚡${AGENT}${N}"

# Lines changed
LINES_STR=""
if [ "$LINES_ADD" -gt 0 ] || [ "$LINES_REM" -gt 0 ]; then
  LINES_STR=" ${G}+${LINES_ADD}${N}${R}-${LINES_REM}${N}"
fi

# ── Output ──────────────────────────────────────────────────────────────────

# Line 1: Context gauge + model + cost
echo -e "${D}━━${N} ${M}KZ${N} ${BAR} ${ZC}${B}${CTX_INT}%${N} ${D}│${N} ${C}${MODEL_SHORT}${N} ${D}│${N} ${W}${COST_FMT}${N} ${D}│${N} ${D}in:${N}${W}${IN_FMT}${N} ${D}out:${N}${W}${OUT_FMT}${N} ${D}│${N} ${D}${DUR_FMT}${N}${LINES_STR}${RATE_STR}${AGENT_STR} ${D}│${N} ${GR}${PROJ_SHORT}${N}"
