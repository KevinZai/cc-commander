// EXAMPLE: PreToolUse hook — block destructive commands
// NOTE: This is a standalone example. The actual hooks in this plugin use
// the command-based format in hooks.json. See hooks/README.md for details.
//
// To use this as a standalone hook, add to settings.json:
// { "matcher": "Bash", "hooks": [{ "type": "command", "command": "node ~/.claude/hooks/careful-guard.js" }] }

const dangerousPatterns = [
  /rm\s+(-[a-zA-Z]*r[a-zA-Z]*f|(-[a-zA-Z]*f[a-zA-Z]*\s+)?-[a-zA-Z]*r)[a-zA-Z]*\s+[\/~]/,  // rm -rf, rm -fr, rm -f -r, etc.
  /rm\s+--no-preserve-root/,
  /DROP\s+(TABLE|DATABASE)/i,
  /git\s+push\s+--force/,
  /git\s+push\s+-f\b/,
  /kubectl\s+delete/,
  /docker\s+system\s+prune/,
  /pm2\s+delete\s+all/,
  /truncate\s+table/i,
  /DELETE\s+FROM\s+\w+/i,  // No trailing semicolon requirement
];

let data = '';
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(data);
    const cmd = input.tool_input?.command || "";
    for (const pattern of dangerousPatterns) {
      if (pattern.test(cmd)) {
        console.error(`[careful-guard] Destructive command detected: ${cmd.slice(0, 100)}`);
        process.exit(2);
      }
    }
    console.log(data);
  } catch (e) {
    console.log(data);
  }
});
