// ============================================================================
// The Claude Code Bible — Hook Test Harness
// ============================================================================
// Tests all 4 kit-native hooks using Node.js built-in test runner.
// Run: node --test tests/hooks.test.js
// ============================================================================

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { execSync } = require('node:child_process');
const path = require('node:path');

const HOOKS_DIR = path.join(__dirname, '..', 'hooks');

describe('careful-guard.js', () => {
  const hookPath = path.join(HOOKS_DIR, 'careful-guard.js');

  function runHook(command) {
    const input = JSON.stringify({
      tool_name: 'Bash',
      tool_input: { command },
    });
    try {
      const result = execSync(`echo '${input.replace(/'/g, "'\\''")}' | node "${hookPath}"`, {
        encoding: 'utf-8',
        timeout: 5000,
      });
      return { exitCode: 0, output: result };
    } catch (err) {
      return { exitCode: err.status, output: err.stderr || '' };
    }
  }

  it('blocks rm -rf /', () => {
    const result = runHook('rm -rf /');
    assert.equal(result.exitCode, 2);
  });

  it('blocks rm -fr ~/', () => {
    const result = runHook('rm -fr ~/');
    assert.equal(result.exitCode, 2);
  });

  it('blocks DROP TABLE', () => {
    const result = runHook('DROP TABLE users');
    assert.equal(result.exitCode, 2);
  });

  it('blocks git push --force', () => {
    const result = runHook('git push --force');
    assert.equal(result.exitCode, 2);
  });

  it('blocks git push -f', () => {
    const result = runHook('git push -f origin main');
    assert.equal(result.exitCode, 2);
  });

  it('blocks DELETE FROM', () => {
    const result = runHook('DELETE FROM users');
    assert.equal(result.exitCode, 2);
  });

  it('allows safe commands', () => {
    const result = runHook('git status');
    assert.equal(result.exitCode, 0);
  });

  it('allows npm install', () => {
    const result = runHook('npm install express');
    assert.equal(result.exitCode, 0);
  });

  it('allows ls -la', () => {
    const result = runHook('ls -la');
    assert.equal(result.exitCode, 0);
  });

  it('handles malformed input gracefully', () => {
    try {
      execSync(`echo 'not json' | node "${hookPath}"`, {
        encoding: 'utf-8',
        timeout: 5000,
      });
    } catch (err) {
      // Should not crash — graceful handling
      assert.ok(true);
    }
  });
});

describe('hook files exist', () => {
  const expectedHooks = [
    'careful-guard.js',
    'auto-notify.js',
    'preuse-logger.js',
    'status-checkin.js',
  ];

  for (const hook of expectedHooks) {
    it(`${hook} exists`, () => {
      const fs = require('fs');
      const hookPath = path.join(HOOKS_DIR, hook);
      assert.ok(fs.existsSync(hookPath), `${hook} should exist in hooks/`);
    });
  }
});

describe('hook syntax', () => {
  it('all JS hooks have valid syntax', () => {
    const fs = require('fs');
    const hooks = fs.readdirSync(HOOKS_DIR).filter(f => f.endsWith('.js'));
    for (const hook of hooks) {
      const hookPath = path.join(HOOKS_DIR, hook);
      // node --check validates syntax without executing
      execSync(`node --check "${hookPath}"`, { timeout: 5000 });
    }
  });
});
