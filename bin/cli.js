#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');
const path = require('path');

const installScript = path.join(__dirname, '..', 'install.sh');
const args = process.argv.slice(2).join(' ');

try {
  execFileSync('bash', [installScript].concat(process.argv.slice(2)), {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
  });
} catch (err) {
  process.exit(err.status || 1);
}
