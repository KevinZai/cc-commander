#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');
const path = require('path');

const installScript = path.join(__dirname, '..', 'install.sh');
const args = process.argv.slice(2).join(' ');

try {
  execSync(`bash "${installScript}" ${args}`, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
  });
} catch (err) {
  process.exit(err.status || 1);
}
