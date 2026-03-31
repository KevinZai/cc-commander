'use strict';

var fs = require('fs');
var path = require('path');

/**
 * Scan a project directory and return signal map.
 * Pure Node.js — no LLM, no network calls. Target: <200ms.
 */
function scan(projectDir) {
  var dir = projectDir || process.cwd();
  if (!path.isAbsolute(dir)) dir = path.resolve(dir);

  var signals = {
    // Language & Runtime
    language: null,
    hasPackageJson: false,
    hasTsConfig: false,
    hasPyprojectToml: false,
    hasCargoToml: false,
    hasGoMod: false,
    packageManager: null,

    // Framework
    framework: null,
    hasNextConfig: false,
    hasViteConfig: false,
    hasDockerfile: false,
    hasDockerCompose: false,

    // Quality Gaps
    missingTestConfig: true,
    missingCI: true,
    missingLinter: true,
    missingReadme: true,
    missingClaudeMd: true,
    envCommitted: false,
    hasHardcodedSecrets: false,

    // Code Metrics
    totalFiles: 0,
    totalLines: 0,
    testCoverage: null,
    depCount: 0,
    outdatedMajorDeps: 0,

    // CCC State
    installedSkills: [],
    installedHooks: [],
    installedCommands: [],
  };

  // 1. Manifest check (instant, definitive)
  signals.hasPackageJson = fileExists(dir, 'package.json');
  signals.hasTsConfig = fileExists(dir, 'tsconfig.json');
  signals.hasPyprojectToml = fileExists(dir, 'pyproject.toml');
  signals.hasCargoToml = fileExists(dir, 'Cargo.toml');
  signals.hasGoMod = fileExists(dir, 'go.mod');

  // Determine language — cascade stops at first unambiguous answer
  if (signals.hasTsConfig) signals.language = 'typescript';
  else if (signals.hasPackageJson) signals.language = 'javascript';
  else if (signals.hasPyprojectToml || fileExists(dir, 'requirements.txt') || fileExists(dir, 'setup.py')) signals.language = 'python';
  else if (signals.hasCargoToml) signals.language = 'rust';
  else if (signals.hasGoMod) signals.language = 'go';
  else if (fileExists(dir, 'Gemfile')) signals.language = 'ruby';
  else if (fileExists(dir, 'pom.xml') || fileExists(dir, 'build.gradle')) signals.language = 'java';
  else if (fileExists(dir, 'Package.swift')) signals.language = 'swift';

  // 2. Config file check — framework detection
  signals.hasNextConfig = globExists(dir, 'next.config');
  signals.hasViteConfig = globExists(dir, 'vite.config');
  signals.hasDockerfile = fileExists(dir, 'Dockerfile');
  signals.hasDockerCompose = fileExists(dir, 'docker-compose.yml') || fileExists(dir, 'docker-compose.yaml') || fileExists(dir, 'compose.yml') || fileExists(dir, 'compose.yaml');

  if (signals.hasNextConfig) signals.framework = 'nextjs';
  else if (signals.hasViteConfig) signals.framework = 'vite';
  else if (globExists(dir, 'astro.config')) signals.framework = 'astro';
  else if (fileExists(dir, 'nuxt.config.ts') || fileExists(dir, 'nuxt.config.js')) signals.framework = 'nuxt';
  else if (fileExists(dir, 'remix.config.js') || fileExists(dir, 'remix.config.ts')) signals.framework = 'remix';
  else if (fileExists(dir, 'angular.json')) signals.framework = 'angular';

  // Check package.json for framework hints if not yet determined
  if (!signals.framework && signals.hasPackageJson) {
    var pkg = readJsonSafe(path.join(dir, 'package.json'));
    if (pkg) {
      var deps = Object.assign({}, pkg.dependencies || {}, pkg.devDependencies || {});
      if (deps.next) signals.framework = 'nextjs';
      else if (deps.express) signals.framework = 'express';
      else if (deps.fastify) signals.framework = 'fastify';
      else if (deps.hono) signals.framework = 'hono';
      else if (deps.koa) signals.framework = 'koa';
      else if (deps.react) signals.framework = 'react';
      else if (deps.vue) signals.framework = 'vue';
      else if (deps.svelte || deps['@sveltejs/kit']) signals.framework = 'svelte';
      else if (deps.solid) signals.framework = 'solid';
      signals.depCount = Object.keys(deps).length;
    }
  }

  // Parse depCount from package.json if not already set
  if (signals.depCount === 0 && signals.hasPackageJson) {
    var pkgForDeps = readJsonSafe(path.join(dir, 'package.json'));
    if (pkgForDeps) {
      var allDeps = Object.assign({}, pkgForDeps.dependencies || {}, pkgForDeps.devDependencies || {});
      signals.depCount = Object.keys(allDeps).length;
    }
  }

  // 3. Package manager detection (lockfile check)
  if (fileExists(dir, 'pnpm-lock.yaml')) signals.packageManager = 'pnpm';
  else if (fileExists(dir, 'yarn.lock')) signals.packageManager = 'yarn';
  else if (fileExists(dir, 'bun.lockb') || fileExists(dir, 'bun.lock')) signals.packageManager = 'bun';
  else if (fileExists(dir, 'package-lock.json')) signals.packageManager = 'npm';

  // 4. Quality gap detection
  signals.missingTestConfig = !hasTestConfig(dir);
  signals.missingCI = !dirExists(dir, '.github/workflows') && !fileExists(dir, '.gitlab-ci.yml') && !fileExists(dir, '.circleci/config.yml') && !fileExists(dir, 'Jenkinsfile') && !fileExists(dir, 'bitbucket-pipelines.yml');
  signals.missingLinter = !hasLinterConfig(dir);
  signals.missingReadme = !caseInsensitiveFileExists(dir, 'README.md');
  signals.missingClaudeMd = !fileExists(dir, 'CLAUDE.md') && !fileExists(dir, '.claude/CLAUDE.md');

  // 5. Security signals
  signals.envCommitted = isFileTracked(dir, '.env');
  signals.hasHardcodedSecrets = scanForSecrets(dir);

  // 6. Code metrics (light, fast — depth-limited walk)
  var metrics = countFiles(dir);
  signals.totalFiles = metrics.files;
  signals.totalLines = metrics.lines;

  // 7. CCC state
  signals.installedSkills = listDir(path.join(dir, '.claude', 'skills'));
  signals.installedHooks = listHooksFromJson(path.join(dir, '.claude', 'settings.json'));
  signals.installedCommands = listDir(path.join(dir, '.claude', 'commands'));

  return signals;
}


// Helper functions

function fileExists(dir, name) {
  try { return fs.existsSync(path.join(dir, name)); }
  catch (_) { return false; }
}

function dirExists(dir, name) {
  try {
    var full = path.join(dir, name);
    return fs.existsSync(full) && fs.statSync(full).isDirectory();
  } catch (_) { return false; }
}

function caseInsensitiveFileExists(dir, name) {
  try {
    var entries = fs.readdirSync(dir);
    var lower = name.toLowerCase();
    return entries.some(function(e) { return e.toLowerCase() === lower; });
  } catch (_) { return false; }
}

function globExists(dir, pattern) {
  var exts = ['.js', '.mjs', '.ts', '.cjs', '.mts'];
  return exts.some(function(ext) { return fileExists(dir, pattern + ext); });
}

function readJsonSafe(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
  catch (_) { return null; }
}

function hasTestConfig(dir) {
  var testFiles = [
    'vitest.config.ts', 'vitest.config.js', 'vitest.config.mts', 'vitest.config.mjs',
    'jest.config.js', 'jest.config.ts', 'jest.config.mjs', 'jest.config.cjs',
    '.mocharc.yml', '.mocharc.json', '.mocharc.js',
    'cypress.config.js', 'cypress.config.ts',
    'playwright.config.js', 'playwright.config.ts',
    'pytest.ini', 'setup.cfg', 'tox.ini',
    'phpunit.xml', 'phpunit.xml.dist',
  ];
  for (var i = 0; i < testFiles.length; i++) {
    if (fileExists(dir, testFiles[i])) return true;
  }
  // Check pyproject.toml for pytest section
  if (fileExists(dir, 'pyproject.toml')) {
    try {
      var content = fs.readFileSync(path.join(dir, 'pyproject.toml'), 'utf8');
      if (content.indexOf('[tool.pytest') >= 0) return true;
    } catch (_) {}
  }
  // Check package.json for test config or test deps
  if (fileExists(dir, 'package.json')) {
    var pkg = readJsonSafe(path.join(dir, 'package.json'));
    if (pkg) {
      if (pkg.jest) return true;
      var deps = Object.assign({}, pkg.dependencies || {}, pkg.devDependencies || {});
      if (deps.vitest || deps.jest || deps.mocha || deps['@playwright/test'] || deps.cypress) return true;
    }
  }
  return false;
}

function hasLinterConfig(dir) {
  var linterFiles = [
    '.eslintrc.js', '.eslintrc.json', '.eslintrc.yml', '.eslintrc.yaml', '.eslintrc.cjs',
    'eslint.config.js', 'eslint.config.mjs', 'eslint.config.cjs', 'eslint.config.ts',
    'biome.json', 'biome.jsonc',
    '.prettierrc', '.prettierrc.json', '.prettierrc.yml', '.prettierrc.yaml', '.prettierrc.js', '.prettierrc.cjs',
    'prettier.config.js', 'prettier.config.mjs', 'prettier.config.cjs',
    '.stylelintrc', '.stylelintrc.json',
    'deno.json', 'deno.jsonc',
    '.rubocop.yml',
    '.flake8', '.pylintrc',
    'ruff.toml',
    'clippy.toml',
  ];
  for (var i = 0; i < linterFiles.length; i++) {
    if (fileExists(dir, linterFiles[i])) return true;
  }
  // Check pyproject.toml for ruff/pylint/flake8 sections
  if (fileExists(dir, 'pyproject.toml')) {
    try {
      var content = fs.readFileSync(path.join(dir, 'pyproject.toml'), 'utf8');
      if (content.indexOf('[tool.ruff') >= 0 || content.indexOf('[tool.pylint') >= 0 || content.indexOf('[tool.flake8') >= 0) return true;
    } catch (_) {}
  }
  // Check package.json for eslintConfig
  if (fileExists(dir, 'package.json')) {
    var pkg = readJsonSafe(path.join(dir, 'package.json'));
    if (pkg && pkg.eslintConfig) return true;
  }
  return false;
}

function isFileTracked(dir, filename) {
  if (!fileExists(dir, filename)) return false;
  if (!dirExists(dir, '.git')) return false;
  try {
    var cp = require('child_process');
    cp.execSync('git -C ' + JSON.stringify(dir) + ' ls-files --error-unmatch ' + JSON.stringify(filename), { stdio: 'ignore', timeout: 3000 });
    return true;
  } catch (_) { return false; }
}

function scanForSecrets(dir) {
  var patterns = [
    /['"]sk-proj-[A-Za-z0-9]{20,}['"]/,
    /['"]sk-ant-[A-Za-z0-9]{20,}['"]/,
    /['"]ghp_[A-Za-z0-9]{36}['"]/,
    /['"]gho_[A-Za-z0-9]{36}['"]/,
    /['"]xoxb-[0-9]{10,}['"]/,
    /['"]xoxp-[0-9]{10,}['"]/,
    /AKIA[0-9A-Z]{16}/,
    /['"]glpat-[A-Za-z0-9_-]{20}['"]/,
    /password\s*[:=]\s*['"][^'"]{8,}['"]/i,
    /api[_-]?key\s*[:=]\s*['"][^'"]{16,}['"]/i,
    /secret[_-]?key\s*[:=]\s*['"][^'"]{16,}['"]/i,
    /private[_-]?key\s*[:=]\s*['"][^'"]{16,}['"]/i,
  ];

  var filesToCheck = [
    'config.js', 'config.ts', 'config.mjs',
    '.env.example', '.env.sample', '.env.local',
    'src/config.js', 'src/config.ts',
    'lib/config.js', 'lib/config.ts',
    'app/config.js', 'app/config.ts',
    'settings.js', 'settings.ts',
    'constants.js', 'constants.ts',
    'src/constants.js', 'src/constants.ts',
  ];

  for (var i = 0; i < filesToCheck.length; i++) {
    var fullPath = path.join(dir, filesToCheck[i]);
    try {
      if (!fs.existsSync(fullPath)) continue;
      var stat = fs.statSync(fullPath);
      if (stat.size > 100000) continue;
      var content = fs.readFileSync(fullPath, 'utf8');
      for (var j = 0; j < patterns.length; j++) {
        if (patterns[j].test(content)) return true;
      }
    } catch (_) {}
  }
  return false;
}

function countFiles(dir) {
  var files = 0;
  var lines = 0;
  var ignore = new Set([
    'node_modules', '.git', 'vendor', 'dist', 'build', '.next', 'coverage',
    '__pycache__', '.venv', 'venv', 'target', '.cache', '.turbo',
    '.output', '.nuxt', '.svelte-kit', 'out',
  ]);
  var codeExtensions = new Set([
    '.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs', '.mts', '.cts',
    '.py', '.rb', '.go', '.rs', '.java', '.kt', '.swift', '.c', '.cpp', '.h',
    '.css', '.scss', '.less', '.html', '.vue', '.svelte', '.astro',
    '.json', '.yaml', '.yml', '.toml', '.md', '.mdx',
    '.sql', '.graphql', '.gql', '.prisma',
    '.sh', '.bash', '.zsh', '.fish',
    '.php', '.ex', '.exs', '.erl',
  ]);

  function walk(d, depth) {
    if (depth > 6) return;
    var entries;
    try { entries = fs.readdirSync(d, { withFileTypes: true }); }
    catch (_) { return; }
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      if (e.name.charAt(0) === '.' && e.name !== '.github') continue;
      if (ignore.has(e.name)) continue;
      var full = path.join(d, e.name);
      if (e.isDirectory()) {
        walk(full, depth + 1);
      } else if (e.isFile()) {
        var ext = path.extname(e.name).toLowerCase();
        if (!codeExtensions.has(ext)) continue;
        files++;
        try {
          var stat = fs.statSync(full);
          if (stat.size > 500000) continue;
          var content = fs.readFileSync(full, 'utf8');
          lines += content.split('\n').length;
        } catch (_) {}
      }
    }
  }

  walk(dir, 0);
  return { files: files, lines: lines };
}

function listDir(dir) {
  try {
    return fs.readdirSync(dir).filter(function(f) {
      return f.charAt(0) !== '.';
    });
  } catch (_) { return []; }
}

function listHooksFromJson(settingsPath) {
  var settings = readJsonSafe(settingsPath);
  if (!settings || !settings.hooks) return [];
  var hookNames = [];
  var hookTypes = ['PreToolUse', 'PostToolUse', 'Stop', 'PreCompact'];
  hookTypes.forEach(function(type) {
    var hooks = settings.hooks[type];
    if (Array.isArray(hooks)) {
      hooks.forEach(function(h) {
        if (h && h.command) {
          var name = type + ':' + path.basename(h.command).replace(/\.[^.]+$/, '');
          hookNames.push(name);
        }
      });
    }
  });
  return hookNames;
}

module.exports = { scan: scan };
