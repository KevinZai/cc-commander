'use strict';

var fs = require('fs');
var path = require('path');

/**
 * Sync plan file ↔ Linear project.
 * Plan file is the local representation. Linear is the remote truth.
 * On read: pull from Linear, write to plan file.
 * On update: push plan changes to Linear.
 */

var linear = require('./linear');

/**
 * Pull Linear project state into a plan markdown file.
 * @param {string} planPath - Path to write plan file
 * @param {string} projectName - Linear project name
 * @returns {Promise<string>} Generated plan content
 */
async function pullToFile(planPath, projectName) {
  var issues = await linear.getProjectIssues();
  if (!issues || issues.length === 0) return '';

  var byState = {};
  issues.forEach(function(i) {
    var s = i.state.type;
    if (!byState[s]) byState[s] = [];
    byState[s].push(i);
  });

  var lines = [];
  lines.push('# ' + (projectName || 'CC Commander') + ' — Linear Sync');
  lines.push('');
  lines.push('> Auto-generated from Linear. Last sync: ' + new Date().toISOString());
  lines.push('');

  var progress = await linear.getProgress();
  lines.push('**Progress:** ' + progress.done + '/' + progress.total + ' (' + Math.round(progress.done / progress.total * 100) + '%)');
  lines.push('');

  if (byState.started && byState.started.length > 0) {
    lines.push('## In Progress');
    byState.started.sort(function(a, b) { return a.priority - b.priority; });
    byState.started.forEach(function(i) {
      lines.push('- [ ] **' + i.identifier + '**: ' + i.title);
    });
    lines.push('');
  }

  if (byState.unstarted && byState.unstarted.length > 0) {
    lines.push('## Todo');
    byState.unstarted.sort(function(a, b) { return a.priority - b.priority; });
    byState.unstarted.forEach(function(i) {
      var pri = ['', 'P0', 'P1', 'P2', 'P3'][i.priority] || '';
      lines.push('- [ ] **' + i.identifier + '** [' + pri + ']: ' + i.title);
    });
    lines.push('');
  }

  if (byState.backlog && byState.backlog.length > 0) {
    lines.push('## Backlog');
    byState.backlog.sort(function(a, b) { return a.priority - b.priority; });
    byState.backlog.forEach(function(i) {
      var pri = ['', 'P0', 'P1', 'P2', 'P3'][i.priority] || '';
      lines.push('- [ ] ' + i.identifier + ' [' + pri + ']: ' + i.title);
    });
    lines.push('');
  }

  if (byState.completed && byState.completed.length > 0) {
    lines.push('## Done (' + byState.completed.length + ')');
    lines.push('');
    lines.push('<details><summary>Show completed</summary>');
    lines.push('');
    byState.completed.forEach(function(i) {
      lines.push('- [x] ' + i.identifier + ': ' + i.title);
    });
    lines.push('');
    lines.push('</details>');
    lines.push('');
  }

  var content = lines.join('\n');
  if (planPath) {
    var dir = path.dirname(planPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(planPath, content);
  }
  return content;
}

/**
 * Sync the current plan file to Linear and back.
 * @param {string} planPath
 */
async function sync(planPath) {
  if (!planPath) planPath = path.join(require('os').homedir(), '.claude', 'plans', 'cc-commander-linear.md');
  return await pullToFile(planPath);
}

module.exports = { pullToFile: pullToFile, sync: sync };
