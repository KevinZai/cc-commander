// ============================================================================
// Claude Code Kit — Terminal Art Library (Node.js)
// ============================================================================
// Pure functions returning ANSI strings. No I/O — callers decide output.
//
//   const art = require('./terminal-art');
//   console.error(art.statusBlock({ step: 'Auth', done: 3, total: 8 }));
// ============================================================================

'use strict';

const COLORS = {
  bright: '\x1b[38;5;172m',
  mid: '\x1b[38;5;145m',
  dim: '\x1b[38;5;240m',
  fade: '\x1b[38;5;130m',
  white: '\x1b[38;5;255m',
  cyan: '\x1b[38;5;99m',
  amber: '\x1b[38;5;214m',
  red: '\x1b[38;5;196m',
  gray: '\x1b[38;5;238m',
  bold: '\x1b[1m',
  reset: '\x1b[0m',
};

const C = COLORS;

function repeat(ch, n) {
  return n > 0 ? ch.repeat(n) : '';
}

function sectionDivider(title) {
  const pad = repeat('━', 18);
  return `${C.mid}${pad}${C.reset} ${C.bright}[ ${title} ]${C.reset} ${C.mid}${pad}${C.reset}`;
}

function progressBar(current, total) {
  const width = 20;
  const filled = Math.round((current / total) * width);
  const empty = width - filled;
  const bar = `${C.bright}${repeat('█', filled)}${C.dim}${repeat('░', empty)}`;
  return `${C.mid}▐${bar}${C.mid}▌${C.reset}  ${C.white}${current}/${total}${C.reset}`;
}

function statusBlock({ step, nextStep, done, total, suggestions }) {
  const bar = progressBar(done, total);
  const lines = [
    `${C.mid}┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓${C.reset}`,
    `${C.mid}┃${C.reset}  ${C.bright}${C.bold}KIT${C.reset}  ${bar}  ${C.dim}tasks done${C.reset}    ${C.mid}┃${C.reset}`,
    `${C.mid}┃${C.reset}  ${C.white}Step:${C.reset} ${step || 'Working...'}${pad(step, 37)}${C.mid}┃${C.reset}`,
  ];

  if (nextStep) {
    lines.push(`${C.mid}┃${C.reset}  ${C.dim}Next:${C.reset} ${nextStep}${pad(nextStep, 37)}${C.mid}┃${C.reset}`);
  }

  lines.push(`${C.mid}┃${C.reset}                                               ${C.mid}┃${C.reset}`);

  if (suggestions && suggestions.length > 0) {
    lines.push(`${C.mid}┃${C.reset}  ${C.dim}Manage tasks:${C.reset}                                 ${C.mid}┃${C.reset}`);
    for (const s of suggestions) {
      lines.push(`${C.mid}┃${C.reset}    ${C.cyan}${s.cmd}${C.reset}${pad(s.cmd, 20)}${C.dim}— ${s.desc}${C.reset}${pad(s.desc, 16)}${C.mid}┃${C.reset}`);
    }
  }

  lines.push(`${C.mid}┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛${C.reset}`);

  return lines.join('\n');
}

function pad(text, maxLen) {
  const len = (text || '').length;
  const remaining = maxLen - len;
  return remaining > 0 ? ' '.repeat(remaining) : '';
}

function minimalFooter() {
  return `${C.dim}━━━━━━${C.reset} ${C.mid}CCK${C.reset} ${C.dim}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}`;
}

function parseTodo(content) {
  if (!content) return { done: 0, total: 0, currentStep: null, nextStep: null };

  const lines = content.split('\n');
  let done = 0;
  let total = 0;
  let currentStep = null;
  let nextStep = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- [x]') || trimmed.startsWith('- [X]')) {
      done++;
      total++;
    } else if (trimmed.startsWith('- [ ]')) {
      total++;
      const task = trimmed.replace(/^- \[ \]\s*/, '').trim();
      if (!currentStep) {
        currentStep = task;
      } else if (!nextStep) {
        nextStep = task;
      }
    }
  }

  return { done, total, currentStep, nextStep };
}

function defaultSuggestions() {
  return [
    { cmd: '/project:todo', desc: 'view task list' },
    { cmd: '/checkpoint', desc: 'save progress' },
    { cmd: '/verify', desc: 'run checks' },
  ];
}

module.exports = {
  COLORS,
  sectionDivider,
  progressBar,
  statusBlock,
  minimalFooter,
  parseTodo,
  defaultSuggestions,
};
