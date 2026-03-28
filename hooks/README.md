# Hooks — The Claude Code Bible

## Overview

Hooks are lifecycle scripts that run automatically during Claude Code sessions. They fire at specific events (PreToolUse, PostToolUse, Stop) and can validate, log, or augment tool calls.

## Two Hook Configurations

| File | For | Hooks |
|------|-----|-------|
| `hooks.json` | Users with ECC installed | 23 hooks (4 kit-native + 19 ECC-inherited via `CLAUDE_PLUGIN_ROOT`) |
| `hooks-standalone.json` | Users WITHOUT ECC | 4 kit-native hooks only |

## Kit-Native Hooks

| Hook | Type | File | Purpose |
|------|------|------|---------|
| Careful Guard | PreToolUse (Bash) | `careful-guard.js` | Block destructive commands (rm -rf, DROP TABLE, force push) |
| Auto Notify | PostToolUse (Bash) | `auto-notify.js` | Notifications on significant events |
| PreUse Logger | PostToolUse (Bash) | `preuse-logger.js` | Log tool usage for cost analysis |
| Status Check-in | Stop | `status-checkin.js` | Session end summary |

## Important: careful-guard.js Limitations

The careful-guard hook is a **best-effort safety net**, not a security boundary. It uses regex pattern matching which can be bypassed. Always combine with:

1. `settings.json` deny list (e.g., `"deny": ["Bash(rm -rf:*)"]`)
2. OS-level file permissions
3. Code review processes

## Installation

The installer (`install.sh`) copies all hooks to `~/.claude/hooks/`. If you have ECC, use `hooks.json`. If not, rename `hooks-standalone.json` to the hooks key in your `settings.json`.

## Writing Custom Hooks

Hooks receive JSON on stdin and must output JSON to stdout. Exit code 2 blocks the tool call (PreToolUse only).

```javascript
let data = '';
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  const input = JSON.parse(data);
  // Your logic here
  console.log(data); // Pass through
});
```
