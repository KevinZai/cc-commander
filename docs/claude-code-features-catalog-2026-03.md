# Claude Code Features Catalog — March 2026

> Comprehensive catalog of every Claude Code feature, flag, and capability.
> Researched from official documentation at code.claude.com/docs/en/*

---

## 1. SKILLS SYSTEM

### What It Is
Skills extend what Claude can do via `SKILL.md` files. They replaced the older `.claude/commands/` system (which still works as an alias). Skills follow the open [Agent Skills](https://agentskills.io) standard.

### Skill Locations (Priority Order)
| Location | Path | Scope |
|----------|------|-------|
| Enterprise | Managed settings | All org users |
| Personal | `~/.claude/skills/<name>/SKILL.md` | All your projects |
| Project | `.claude/skills/<name>/SKILL.md` | This project only |
| Plugin | `<plugin>/skills/<name>/SKILL.md` | Where plugin enabled |

### Frontmatter Fields
| Field | Description |
|-------|-------------|
| `name` | Display name / slash command (lowercase, hyphens, max 64 chars) |
| `description` | What it does; Claude uses this for auto-invocation (250 char cap in listing) |
| `argument-hint` | Hint for autocomplete (e.g., `[issue-number]`) |
| `disable-model-invocation` | `true` = only user can invoke (not Claude) |
| `user-invocable` | `false` = hidden from `/` menu, only Claude can invoke |
| `allowed-tools` | Tools Claude can use without permission when skill active |
| `model` | Model override when skill active |
| `effort` | Effort level override: `low`, `medium`, `high`, `max` |
| `context` | `fork` = run in isolated subagent context |
| `agent` | Subagent type when `context: fork` (e.g., `Explore`, `Plan`, custom) |
| `hooks` | Hooks scoped to this skill's lifecycle |
| `paths` | Glob patterns limiting auto-activation to matching files |
| `shell` | `bash` (default) or `powershell` |

### String Substitutions
- `$ARGUMENTS` — all args passed to skill
- `$ARGUMENTS[N]` or `$N` — positional args (0-based)
- `${CLAUDE_SESSION_ID}` — current session ID
- `${CLAUDE_SKILL_DIR}` — directory containing SKILL.md

### Dynamic Context Injection
`` !`<command>` `` syntax runs shell commands BEFORE skill content is sent to Claude. Output replaces the placeholder.

### Bundled Skills (Ship with Claude Code)
| Skill | Purpose |
|-------|---------|
| `/batch <instruction>` | Parallel codebase changes across worktrees, spawns agents per unit |
| `/claude-api` | Load Claude API reference for your language (auto-triggers on `anthropic` imports) |
| `/debug [description]` | Enable debug logging, troubleshoot issues |
| `/loop [interval] <prompt>` | Run prompt on recurring interval (e.g., `/loop 5m check deploy`) |
| `/simplify [focus]` | Review changed files for reuse/quality/efficiency, spawns 3 parallel reviewers |

### Key Patterns
- **Reference content**: conventions/guidelines that run inline
- **Task content**: step-by-step actions (often `disable-model-invocation: true`)
- **Supporting files**: keep SKILL.md under 500 lines, reference detail files
- **Visual output**: bundle scripts that generate interactive HTML
- **`ultrathink`**: include anywhere in skill content to enable extended thinking

---

## 2. SUBAGENTS (Custom Agents)

### What It Is
Specialized AI assistants running in their own context window with custom system prompts, tool access, and permissions.

### Built-in Subagents
| Agent | Model | Tools | Purpose |
|-------|-------|-------|---------|
| **Explore** | Haiku (fast) | Read-only | File discovery, code search, exploration |
| **Plan** | Inherits | Read-only | Codebase research for plan mode |
| **general-purpose** | Inherits | All tools | Complex multi-step operations |
| **Bash** | Inherits | Terminal | Running commands in separate context |
| **statusline-setup** | Sonnet | — | `/statusline` configuration |
| **Claude Code Guide** | Haiku | — | Questions about CC features |

### Agent Locations (Priority Order)
1. `--agents` CLI flag (session only, JSON)
2. `.claude/agents/` (project)
3. `~/.claude/agents/` (user/personal)
4. Plugin `agents/` directory

### Frontmatter Fields
| Field | Description |
|-------|-------------|
| `name` | Unique identifier (required) |
| `description` | When to delegate (required) |
| `tools` | Allowlist of tools (inherits all if omitted) |
| `disallowedTools` | Denylist of tools |
| `model` | `sonnet`, `opus`, `haiku`, full ID, or `inherit` |
| `permissionMode` | `default`, `acceptEdits`, `dontAsk`, `bypassPermissions`, `plan` |
| `maxTurns` | Max agentic turns before stop |
| `skills` | Skills to preload into context at startup |
| `mcpServers` | MCP servers scoped to this subagent |
| `hooks` | Lifecycle hooks scoped to subagent |
| `memory` | Persistent memory: `user`, `project`, or `local` |
| `background` | `true` = always run as background task |
| `effort` | Effort level override |
| `isolation` | `worktree` = run in temporary git worktree |
| `initialPrompt` | Auto-submitted first user turn when running as `--agent` |

### Invocation Methods
1. **Automatic**: Claude delegates based on descriptions
2. **Natural language**: "Use the code-reviewer subagent..."
3. **@-mention**: `@"code-reviewer (agent)"` — guarantees that agent runs
4. **Session-wide**: `claude --agent code-reviewer` — entire session uses that agent
5. **Setting**: `"agent": "code-reviewer"` in `.claude/settings.json`

### Background vs Foreground
- **Foreground**: blocks main conversation, permission prompts pass through
- **Background**: runs concurrently, pre-approves permissions upfront, `Ctrl+B` to background
- Can disable: `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1`

### Persistent Memory
| Scope | Location |
|-------|----------|
| `user` | `~/.claude/agent-memory/<name>/` |
| `project` | `.claude/agent-memory/<name>/` |
| `local` | `.claude/agent-memory-local/<name>/` |

---

## 3. HOOKS SYSTEM

### What It Is
User-defined shell commands, HTTP endpoints, LLM prompts, or agents that execute automatically at lifecycle points.

### 28+ Hook Events

**Session Level:**
- `SessionStart` (matchers: `startup`, `resume`, `clear`, `compact`)
- `UserPromptSubmit` (can block prompts)
- `Stop` (can block Claude from stopping)
- `StopFailure` (matchers: `rate_limit`, `authentication_failed`, etc.)
- `SessionEnd` (matchers: `clear`, `resume`, `logout`, etc.)

**Agentic Loop:**
- `PreToolUse` (can block/allow/modify tool calls)
- `PermissionRequest` (can allow/deny/modify permissions)
- `PostToolUse` (after tool success)
- `PostToolUseFailure` (after tool failure)

**Subagent:**
- `SubagentStart` / `SubagentStop`
- `TaskCreated` / `TaskCompleted`
- `TeammateIdle`

**Async:**
- `Notification` (matchers: `permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog`)
- `ConfigChange`
- `CwdChanged`
- `FileChanged`
- `InstructionsLoaded`
- `WorktreeCreate` / `WorktreeRemove`
- `PreCompact` / `PostCompact`
- `Elicitation` / `ElicitationResult`

### Hook Types
1. **Command** (`type: "command"`) — shell command, JSON on stdin
2. **HTTP** (`type: "http"`) — POST to endpoint
3. **Prompt** (`type: "prompt"`) — LLM yes/no decision
4. **Agent** (`type: "agent"`) — spawn subagent for verification

### Common Fields
- `type` (required)
- `if` — permission rule syntax: `"Bash(git *)"`, `"Edit(*.ts)"`
- `timeout` — seconds (defaults: 600 command, 30 prompt, 60 agent)
- `statusMessage` — custom spinner text
- `once` — run only once per session (skills only)
- `async` — run in background without blocking

### Exit Codes
- `0` = success (parse JSON from stdout)
- `2` = blocking error (tool blocked/denied)
- Other = non-blocking error

### Key Environment Variables
- `$CLAUDE_PROJECT_DIR` — project root
- `${CLAUDE_PLUGIN_ROOT}` — plugin installation dir
- `${CLAUDE_PLUGIN_DATA}` — plugin persistent data dir
- `CLAUDE_ENV_FILE` — write `export` statements to persist env vars

---

## 4. HEADLESS / PROGRAMMATIC MODE (Agent SDK)

### Basic Usage
```bash
claude -p "prompt" [options]
```

### Key Flags
| Flag | Purpose |
|------|---------|
| `-p` / `--print` | Non-interactive mode |
| `--bare` | Skip all auto-discovery (hooks, skills, plugins, MCP, CLAUDE.md) — recommended for scripts |
| `--output-format text\|json\|stream-json` | Control output format |
| `--json-schema '{...}'` | Structured output matching JSON Schema |
| `--allowedTools "Read,Edit,Bash"` | Auto-approve tools |
| `--continue` / `--resume <id>` | Continue conversations |
| `--max-turns N` | Limit agentic turns |
| `--max-budget-usd N` | Dollar spending cap |
| `--fallback-model sonnet` | Fallback when default overloaded |
| `--no-session-persistence` | Don't save session to disk |
| `--input-format stream-json` | Stream JSON input |
| `--include-partial-messages` | Include streaming token events |
| `--verbose` | Full turn-by-turn output |

### System Prompt Flags
| Flag | Behavior |
|------|----------|
| `--system-prompt` | Replace entire default prompt |
| `--system-prompt-file` | Replace with file contents |
| `--append-system-prompt` | Append to default prompt |
| `--append-system-prompt-file` | Append file contents |

---

## 5. FULL CLI REFERENCE

### Commands
| Command | Description |
|---------|-------------|
| `claude` | Start interactive session |
| `claude "query"` | Start with initial prompt |
| `claude -p "query"` | SDK/headless mode |
| `claude -c` | Continue most recent conversation |
| `claude -r "<session>"` | Resume by ID or name |
| `claude update` | Update to latest version |
| `claude auth login\|logout\|status` | Authentication |
| `claude agents` | List configured subagents |
| `claude auto-mode defaults` | Print auto mode classifier rules |
| `claude mcp` | Configure MCP servers |
| `claude plugin` | Manage plugins |
| `claude remote-control` | Start Remote Control server |

### Major CLI Flags
| Flag | Description |
|------|-------------|
| `--add-dir` | Add additional working directories |
| `--agent <name>` | Run session as specified agent |
| `--agents <json>` | Define subagents dynamically via JSON |
| `--bare` | Minimal mode, skip auto-discovery |
| `--chrome` / `--no-chrome` | Enable/disable Chrome integration |
| `--channels` | MCP servers for channel notifications |
| `--effort low\|medium\|high\|max` | Set effort level |
| `--enable-auto-mode` | Unlock auto mode in Shift+Tab cycle |
| `--fork-session` | Create new session ID when resuming |
| `--from-pr <number>` | Resume sessions linked to PR |
| `--model <alias\|name>` | Set model |
| `--name / -n` | Name the session |
| `--permission-mode` | Start in specified permission mode |
| `--remote` | Create web session from terminal |
| `--remote-control / --rc` | Start with Remote Control enabled |
| `--settings <file>` | Load additional settings |
| `--mcp-config <file>` | Load MCP servers |
| `--strict-mcp-config` | Only use MCP from --mcp-config |
| `--plugin-dir <path>` | Load plugins from directory |
| `--teleport` | Resume web session in local terminal |
| `--teammate-mode` | Agent team display: `auto`, `in-process`, `tmux` |
| `--tools` | Restrict available tools |
| `--worktree / -w` | Start in isolated git worktree |
| `--tmux` | Create tmux session for worktree |
| `--init` / `--init-only` | Run initialization hooks |
| `--maintenance` | Run maintenance hooks and exit |
| `--debug` | Enable debug mode |
| `--verbose` | Show full turn-by-turn output |

---

## 6. BUILT-IN COMMANDS

| Command | Purpose |
|---------|---------|
| `/compact [instructions]` | Compact conversation with optional focus |
| `/clear` (`/reset`, `/new`) | Clear conversation, free context |
| `/config` (`/settings`) | Open Settings interface |
| `/context` | Visualize context usage as colored grid |
| `/copy [N]` | Copy last response to clipboard |
| `/cost` | Show token usage statistics |
| `/desktop` (`/app`) | Continue in Desktop app |
| `/diff` | Interactive diff viewer |
| `/doctor` | Diagnose installation |
| `/effort [level]` | Set effort level |
| `/export [filename]` | Export conversation as text |
| `/fast [on\|off]` | Toggle fast mode |
| `/branch [name]` (`/fork`) | Branch conversation |
| `/hooks` | View hook configurations |
| `/init` | Initialize project CLAUDE.md |
| `/insights` | Analyze session patterns |
| `/install-github-app` | Set up GitHub Actions integration |
| `/keybindings` | Open keybindings config |
| `/mcp` | Manage MCP connections |
| `/memory` | Edit CLAUDE.md files, manage auto-memory |
| `/model [model]` | Select/change AI model |
| `/permissions` | View/update permissions |
| `/plan [description]` | Enter plan mode |
| `/plugin` | Manage plugins |
| `/pr-comments [PR]` | Fetch GitHub PR comments |
| `/reload-plugins` | Reload all active plugins |
| `/remote-control` (`/rc`) | Start Remote Control |
| `/remote-env` | Configure default remote environment |
| `/rename [name]` | Rename session |
| `/resume [session]` | Resume conversation |
| `/rewind` (`/checkpoint`) | Rewind conversation/code |
| `/sandbox` | Toggle sandbox mode |
| `/schedule` | Manage scheduled tasks |
| `/security-review` | Analyze changes for security vulns |
| `/skills` | List available skills |
| `/stats` | Visualize usage, streaks, preferences |
| `/status` | Version, model, account info |
| `/statusline` | Configure status line |
| `/tasks` | List/manage background tasks |
| `/terminal-setup` | Configure terminal keybindings |
| `/theme` | Change color theme |
| `/vim` | Toggle Vim editing mode |
| `/voice` | Toggle push-to-talk voice dictation |
| `/color [color]` | Set prompt bar color |
| `/btw <question>` | Side question without adding to history |
| `/add-dir <path>` | Add working directory |
| `/agents` | Manage agent configurations |

---

## 7. MODEL CONFIGURATION

### Model Aliases
| Alias | Behavior |
|-------|----------|
| `default` | Recommended model per account type |
| `sonnet` | Latest Sonnet (currently 4.6) |
| `opus` | Latest Opus (currently 4.6) |
| `haiku` | Fast, efficient Haiku |
| `sonnet[1m]` | Sonnet with 1M context window |
| `opus[1m]` | Opus with 1M context window |
| `opusplan` | Opus for plan mode, Sonnet for execution |

### Effort Levels
| Level | Behavior | Persistence |
|-------|----------|-------------|
| `low` | Fast, minimal thinking | Persists across sessions |
| `medium` | Balanced (default) | Persists across sessions |
| `high` | Deep reasoning | Persists across sessions |
| `max` | Deepest, no token constraint (Opus 4.6 only) | Session only |
| `auto` | Reset to model default | — |

**Setting effort:** `/effort`, `/model` (arrow keys), `--effort` flag, `CLAUDE_CODE_EFFORT_LEVEL` env var, `effortLevel` in settings, or skill/agent frontmatter `effort` field.

**`ultrathink`**: Include in prompt to trigger high effort for one turn.

### Extended Context (1M Tokens)
- Opus 4.6 and Sonnet 4.6 support 1M token context
- On Max/Team/Enterprise: Opus auto-upgraded to 1M
- Enable via `/model opus[1m]` or `sonnet[1m]`
- Disable: `CLAUDE_CODE_DISABLE_1M_CONTEXT=1`

### Adaptive Reasoning
- Opus 4.6 and Sonnet 4.6 dynamically allocate thinking based on effort level
- Disable: `CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING=1`

---

## 8. FAST MODE

- **What**: 2.5x faster Opus 4.6 at higher cost ($30/150 MTok)
- **Toggle**: `/fast` command or `Alt+O`
- **Indicator**: `↯` icon next to prompt
- **Availability**: All subscription plans via extra usage
- **Persists** across sessions by default
- **Admin control**: `fastModePerSessionOptIn: true` in managed settings
- **Auto-fallback**: When rate limited, falls back to standard Opus

---

## 9. VOICE DICTATION

- **Enable**: `/voice` command or `"voiceEnabled": true` in settings
- **Push-to-talk**: Hold `Space` (configurable via keybindings)
- **Rebind**: Set `voice:pushToTalk` in `~/.claude/keybindings.json`
- **Requirements**: Claude.ai account (not API key), local microphone
- **Language**: Uses `language` setting; supports 20+ languages
- **Coding-aware**: Tuned for dev vocabulary (regex, OAuth, JSON, etc.)
- **Tips**: Modifier combos like `meta+k` skip warmup delay

---

## 10. PLAN MODE

- **What**: Read-only exploration mode for safe codebase analysis
- **Enter**: `Shift+Tab` cycle, `/plan [description]`, `--permission-mode plan`
- **Headless**: `claude --permission-mode plan -p "analyze..."`
- **Behavior**: Claude uses `AskUserQuestion` to gather requirements, proposes plan
- **Edit plan**: `Ctrl+G` opens plan in text editor
- **Auto-names** session from plan content when accepted
- **Default**: Set `"permissions": { "defaultMode": "plan" }` in settings

---

## 11. PERMISSION MODES

| Mode | Behavior |
|------|----------|
| `default` | Standard permission checking |
| `acceptEdits` | Auto-accept file edits |
| `plan` | Read-only exploration |
| `dontAsk` | Auto-deny prompts (allowed tools still work) |
| `bypassPermissions` | Skip permission prompts (dangerous) |
| `auto` | AI classifier evaluates safety (Team+ only) |

**Cycle**: `Shift+Tab` to cycle through enabled modes.

---

## 12. COMPACT / AUTO-COMPACT

- **Manual**: `/compact [instructions]` — compact with optional focus
- **Auto-compact**: Triggers at ~95% context capacity by default
- **Override**: `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50` (triggers at 50%)
- **Window override**: `CLAUDE_CODE_AUTO_COMPACT_WINDOW=500000` (treat as 500K)
- **Subagents**: Auto-compact works independently in each subagent
- **PreCompact/PostCompact hooks**: Fire on manual and auto triggers

---

## 13. CONTEXT MANAGEMENT

- **`/context`**: Visualize context usage as colored grid
- **`@` file references**: Include file content in prompt
- **`@` directory references**: Include directory listing
- **`@` MCP resources**: Fetch data from MCP servers
- **Auto-discovery**: Skills from nested `.claude/skills/` directories
- **`--add-dir`**: Additional working directories
- **Task list**: `Ctrl+T` to toggle; persists across compactions

---

## 14. PLUGINS SYSTEM

### Structure
```
my-plugin/
├── .claude-plugin/plugin.json    # Manifest (required)
├── skills/                       # Skills with SKILL.md
├── agents/                       # Custom agents
├── hooks/hooks.json              # Event handlers
├── commands/                     # Commands (alias for skills)
├── .mcp.json                     # MCP server configs
├── .lsp.json                     # LSP server configs
├── settings.json                 # Default settings (currently: agent key only)
```

### Plugin Manifest (`plugin.json`)
```json
{
  "name": "my-plugin",
  "description": "What it does",
  "version": "1.0.0",
  "author": { "name": "Your Name" }
}
```

### Commands
- `/plugin install <name>@<marketplace>`
- `/plugin marketplace add <owner/repo>`
- `/reload-plugins` — reload without restart
- `--plugin-dir ./path` — load for testing

### Namespacing
Plugin skills are namespaced: `/plugin-name:skill-name`

### Security Restrictions
Plugin agents cannot use `hooks`, `mcpServers`, or `permissionMode` frontmatter.

---

## 15. CLAUDE CODE ON THE WEB

- **URL**: claude.ai/code
- **Start from CLI**: `claude --remote "Fix the auth bug"`
- **Teleport to CLI**: `claude --teleport` or `/teleport`
- **Auto-fix PRs**: Watch PRs, auto-respond to CI failures and review comments
- **Diff view**: Review changes before creating PR
- **Environment**: Ubuntu VM with pre-installed languages, databases (PostgreSQL 16, Redis 7)
- **Setup scripts**: Bash scripts that run before Claude Code launches
- **Network**: Limited by default (allowlisted domains), configurable
- **Parallel**: Multiple `--remote` commands create independent sessions
- **Scheduling**: Recurring tasks via cloud scheduled tasks

---

## 16. REMOTE CONTROL

- **What**: Drive a local CLI session from claude.ai or mobile app
- **Start**: `claude remote-control`, `claude --remote-control`, or `/remote-control`
- **Server mode flags**: `--name`, `--spawn same-dir|worktree`, `--capacity N`
- **QR code**: Press spacebar in server mode to show QR code
- **Bidirectional**: Messages sync across terminal, browser, and phone
- **Local execution**: Code runs on your machine (not cloud)
- **Always-on**: Set `enableRemoteControl: true` in `/config` for all sessions
- **Plans**: Available on Pro, Max, Team, Enterprise

---

## 17. CHANNELS (Research Preview)

- **What**: Push events from external systems (Telegram, Discord, iMessage) into running session
- **Enable**: `--channels plugin:<name>@<marketplace>`
- **Supported**: Telegram, Discord, iMessage (official plugins)
- **Custom**: Build your own via channels reference
- **Security**: Sender allowlists, pairing codes
- **Enterprise**: `channelsEnabled: true` + `allowedChannelPlugins` in managed settings
- **Permission relay**: Channels can forward permission prompts for remote approval
- **Development**: `--dangerously-load-development-channels` for testing

---

## 18. AGENT TEAMS (Experimental)

- **Enable**: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
- **What**: Multiple Claude Code instances coordinating via shared task list and messaging
- **Components**: Team lead, teammates, task list, mailbox
- **Display modes**: `in-process` (default) or `tmux`/iTerm2 split panes
- **Navigation**: `Shift+Down` to cycle teammates in in-process mode
- **Plan approval**: Require teammates to plan before implementing
- **Task states**: pending, in-progress, completed (with dependencies)
- **Hooks**: `TeammateIdle`, `TaskCreated`, `TaskCompleted`
- **Best for**: Research, parallel features, competing hypotheses, cross-layer changes

---

## 19. GIT WORKTREES

- **Flag**: `claude --worktree <name>` or `claude -w <name>`
- **Location**: `<repo>/.claude/worktrees/<name>/`
- **Branch**: `worktree-<name>` based on `origin/HEAD`
- **Subagent worktrees**: `isolation: worktree` in agent frontmatter
- **Auto-cleanup**: No changes = auto-remove; changes = prompt keep/remove
- **`.worktreeinclude`**: List gitignored files to copy (`.env`, etc.)
- **Non-git VCS**: Configure `WorktreeCreate`/`WorktreeRemove` hooks

---

## 20. SESSION MANAGEMENT

- **Continue**: `claude --continue` or `claude -c`
- **Resume**: `claude --resume <name-or-id>` or `/resume`
- **Name**: `claude -n "name"` or `/rename name`
- **Fork**: `/branch [name]` or `--fork-session`
- **From PR**: `claude --from-pr 123`
- **Session picker**: `/resume` opens interactive picker with preview (`P`), rename (`R`), search (`/`), branch filter (`B`)
- **Export**: `/export [filename]`

---

## 21. INTERACTIVE MODE FEATURES

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl+C` | Cancel current input/generation |
| `Ctrl+B` | Background running task |
| `Ctrl+T` | Toggle task list |
| `Ctrl+O` | Toggle verbose output |
| `Ctrl+G` | Open in text editor |
| `Ctrl+L` | Clear terminal screen |
| `Ctrl+R` | Reverse search history |
| `Ctrl+V` | Paste image from clipboard |
| `Shift+Tab` | Cycle permission modes |
| `Alt+P` | Switch model |
| `Alt+T` | Toggle extended thinking |
| `Alt+O` | Toggle fast mode |
| `Esc+Esc` | Rewind or summarize |
| `Ctrl+X Ctrl+K` | Kill all background agents |

### Quick Commands
- `!` prefix: bash mode (run commands directly)
- `@` mentions: file/directory/MCP resource autocomplete
- `/` prefix: commands and skills

### Vim Mode
- `/vim` command or configure in `/config`
- Full NORMAL/INSERT mode with motions, text objects, operators

### Prompt Suggestions
- Grayed-out suggestions after Claude responds
- Based on conversation history
- Tab to accept, Enter to accept+submit
- Disable: `CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION=false`

### /btw Side Questions
- Quick ephemeral question using current context
- No tool access, not added to history
- Works while Claude is processing
- Low cost (reuses cache)

### PR Review Status
- Clickable PR link in footer with colored underline (green=approved, yellow=pending, red=changes requested)

---

## 22. SETTINGS SYSTEM

### Settings Scopes
| Scope | Location | Shared |
|-------|----------|--------|
| Managed | Server-managed / plist / registry | Yes (IT deployed) |
| User | `~/.claude/settings.json` | No |
| Project | `.claude/settings.json` | Yes (git) |
| Local | `.claude/settings.local.json` | No |

### Key Settings
- `model` — default model
- `effortLevel` — low/medium/high
- `agent` — default agent for sessions
- `env` — environment variables
- `permissions.defaultMode` — default permission mode
- `permissions.allow` / `permissions.deny` — tool rules
- `availableModels` — restrict model selection (enterprise)
- `modelOverrides` — map model IDs to provider-specific strings
- `hooks` — hook configurations
- `voiceEnabled` — voice dictation
- `fastMode` — fast mode
- `apiKeyHelper` — external command for API key
- `disableAllHooks` — disable all hooks
- `channelsEnabled` — enable channels (enterprise)
- `allowedChannelPlugins` — restrict channel plugins

---

## 23. KEY ENVIRONMENT VARIABLES

### Authentication
- `ANTHROPIC_API_KEY` — API key
- `ANTHROPIC_AUTH_TOKEN` — Custom Authorization header
- `ANTHROPIC_BASE_URL` — Override API endpoint

### Model Control
- `ANTHROPIC_MODEL` — Model name/alias
- `ANTHROPIC_DEFAULT_OPUS_MODEL` / `SONNET` / `HAIKU` — Pin model versions
- `CLAUDE_CODE_SUBAGENT_MODEL` — Model for subagents
- `CLAUDE_CODE_EFFORT_LEVEL` — Effort level
- `CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING` — Disable adaptive reasoning

### Context Control
- `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` — Auto-compact threshold percentage
- `CLAUDE_CODE_AUTO_COMPACT_WINDOW` — Context window for compaction
- `CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS` — File read token limit
- `CLAUDE_CODE_MAX_OUTPUT_TOKENS` — Max output tokens
- `MAX_THINKING_TOKENS` — Thinking token budget

### Feature Toggles
- `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` — Disable background tasks
- `CLAUDE_CODE_DISABLE_1M_CONTEXT` — Disable 1M context
- `CLAUDE_CODE_DISABLE_FAST_MODE` — Disable fast mode
- `CLAUDE_CODE_DISABLE_CRON` — Disable scheduled tasks
- `CLAUDE_CODE_DISABLE_AUTO_MEMORY` — Disable auto memory
- `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS` — Remove git instructions
- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` — Enable agent teams

### Bash Control
- `BASH_DEFAULT_TIMEOUT_MS` — Default bash timeout
- `BASH_MAX_TIMEOUT_MS` — Max bash timeout
- `BASH_MAX_OUTPUT_LENGTH` — Max bash output chars
- `CLAUDE_CODE_SHELL` — Override shell detection
- `CLAUDE_CODE_SHELL_PREFIX` — Command prefix for all bash

### Environment Detection
- `CLAUDECODE=1` — Set in shells Claude spawns
- `CLAUDE_CODE_REMOTE=true` — Set in web environments
- `CLAUDE_CODE_SIMPLE=1` — Bare mode active

### Prompt Caching
- `DISABLE_PROMPT_CACHING` — Disable for all models
- `DISABLE_PROMPT_CACHING_HAIKU` / `SONNET` / `OPUS` — Per-model

---

## 24. SCHEDULED TASKS

### Options
| Method | Where It Runs | Best For |
|--------|--------------|----------|
| Cloud scheduled tasks | Anthropic infrastructure | Always-on, even when computer off |
| Desktop scheduled tasks | Your machine (Desktop app) | Local file access |
| GitHub Actions | CI pipeline | Repo events, cron |
| `/loop [interval] <prompt>` | Current CLI session | Quick polling while session open |

### /loop Skill
- `/loop 5m check if deploy finished`
- Defaults to 10 minute interval
- Cancelled when session exits

### /schedule Command
- Create, update, list, or run cloud scheduled agents
- Conversational setup flow

---

## 25. CHECKPOINTING & REWIND

- **`/rewind`** (`/checkpoint`): Rewind conversation and/or code to previous point
- **`Esc+Esc`**: Quick rewind or summarize from selected message
- **Git integration**: Restores file states alongside conversation
- **Diff view**: `/diff` shows uncommitted changes and per-turn diffs

---

## 26. IMAGE SUPPORT

- **Drag & drop** images into Claude Code
- **`Ctrl+V`** to paste from clipboard
- **File path**: "Analyze this image: /path/to/image.png"
- **Multiple images** in single conversation
- **Works with**: diagrams, screenshots, mockups, schemas
- **Cmd+Click** image references to open in viewer

---

## 27. STATUS LINE

- **Configure**: `/statusline` command
- **Shows**: Context gauge, model, cost, tokens, account, rate limit
- **Custom**: Describe what you want or auto-configure from shell

---

## 28. CHROME INTEGRATION

- **Enable**: `claude --chrome` or `/chrome`
- **What**: Browser automation and web testing
- **Uses**: Playwright or similar for web interaction

---

## 29. SANDBOXING

- **Toggle**: `/sandbox` command
- **What**: Filesystem and network isolation
- **Available**: On supported platforms

---

## 30. MCP (Model Context Protocol) INTEGRATION

- **Configure**: `.mcp.json` at project or user level
- **Types**: `stdio`, `http`, `sse`, `ws`
- **Tool search**: Scales with many MCP tools
- **Resources**: `@server:resource` syntax
- **Prompts**: `/mcp__<server>__<prompt>` commands
- **Scoped to subagents**: `mcpServers` in agent frontmatter
- **Elicitation**: MCP servers can request user input during tool calls

---

## Kit Commander Relevance Summary

### MUST USE (Core capabilities Kit Commander should leverage)
1. **`-p` / `--bare`** — headless execution for all automated tasks
2. **`--agent`** — run entire session as custom agent type
3. **`--agents` JSON** — define agents dynamically per invocation
4. **`--allowedTools`** — pre-approve tools for unattended execution
5. **`--output-format json`** — structured output for parsing
6. **`--json-schema`** — validated structured output
7. **`--max-turns`** — safety limit on agentic loops
8. **`--max-budget-usd`** — cost control
9. **`--append-system-prompt`** — inject context without replacing defaults
10. **`--continue` / `--resume`** — conversation continuity
11. **`--worktree`** — isolation for parallel work
12. **`--remote`** — dispatch to web for autonomous execution
13. **`--effort`** — control reasoning depth per task
14. **`--model`** — route tasks to appropriate model tier
15. **`--mcp-config`** — load MCP servers for specific tasks
16. **`--settings`** — load custom settings per invocation
17. **`--fallback-model`** — resilience when primary overloaded
18. **`--permission-mode plan`** — safe research phase
19. **`context: fork`** in skills — isolated execution
20. **`isolation: worktree`** in agents — parallel agent work
21. **Skill `effort` frontmatter** — per-skill effort control
22. **Agent `memory` field** — persistent agent learning
23. **`/batch`** — parallel codebase changes
24. **`/loop`** — recurring task execution
25. **`!` bash prefix** — direct shell access
26. **`/btw`** — ephemeral side questions
27. **Hook system** — all 28+ events for automation
28. **Channels** — external event integration
29. **Agent teams** — multi-instance coordination
30. **Fast mode** — 2.5x speed for interactive work

### SHOULD LEVERAGE (Enhancement opportunities)
- **`/teleport`** — move web sessions to local
- **`/insights`** — analyze session patterns
- **`/diff`** — interactive change review
- **`/security-review`** — pre-commit security analysis
- **`/context`** — context window visualization
- **`/stats`** — usage analytics
- **Prompt suggestions** — workflow acceleration
- **PR review status** — automated PR monitoring
- **Task list** (`Ctrl+T`) — progress tracking
- **Voice dictation** — hands-free prompting
- **Image support** — visual context for debugging
