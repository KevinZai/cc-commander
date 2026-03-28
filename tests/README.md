# Tests — The Claude Code Bible

## Running Tests

```bash
# All tests
node --test tests/hooks.test.js

# Specific test
node --test --test-name-pattern "careful-guard" tests/hooks.test.js
```

## What's Tested

- **careful-guard.js** — Destructive command blocking (rm -rf, DROP TABLE, force push, DELETE FROM)
- **Hook file existence** — All 4 kit-native hooks present
- **Hook syntax** — All JS hooks parse without errors

## Adding Tests

Use Node.js built-in test runner (no dependencies required):

```javascript
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

describe('my hook', () => {
  it('does something', () => {
    assert.ok(true);
  });
});
```
