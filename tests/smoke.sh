#!/bin/bash
set -e
echo "=== CC Commander Smoke Tests ==="

PASS=0
FAIL=0
TMPFILE=$(mktemp)
trap "rm -f $TMPFILE" EXIT

check() {
  local label="$1"
  local result="$2"
  echo -n "${label}... "
  if [ "$result" = "0" ]; then
    echo "PASS"
    PASS=$((PASS + 1))
  else
    echo "FAIL"
    FAIL=$((FAIL + 1))
  fi
}

# Version flag
node bin/kc.js --version > /dev/null 2>&1
check "Version flag" $?

# Self-test
node bin/kc.js --test > /dev/null 2>&1
check "Self-test" $?

# Status JSON
node bin/kc.js --status > "$TMPFILE" 2>/dev/null
node -e "JSON.parse(require('fs').readFileSync('$TMPFILE','utf8'))" > /dev/null 2>&1
check "Status JSON" $?

# List skills JSON
node bin/kc.js --list-skills --json > "$TMPFILE" 2>/dev/null
node -e "var d=JSON.parse(require('fs').readFileSync('$TMPFILE','utf8')); if(!Array.isArray(d)||d.length<100) process.exit(1)" > /dev/null 2>&1
RC=$?
COUNT=$(node -e "var d=JSON.parse(require('fs').readFileSync('$TMPFILE','utf8')); console.log(d.length)" 2>/dev/null || echo "?")
check "List skills JSON (${COUNT} skills)" $RC

# Template output — must contain at least one markdown heading
node bin/kc.js --template > "$TMPFILE" 2>/dev/null
grep -q "#" "$TMPFILE" > /dev/null 2>&1
check "Template output" $?

# Stats output
node bin/kc.js --stats > /dev/null 2>&1
check "Stats output" $?

echo ""
echo "=== SMOKE TESTS COMPLETE (${PASS} pass, ${FAIL} fail) ==="
[ "$FAIL" -eq 0 ]
