'use strict';

var childProcess = require('child_process');

function evaluatePackage(url) {
  var result = {
    url: url,
    name: null,
    stars: 0,
    license: null,
    licenseRisk: 'unknown', // green, yellow, red
    lastCommit: null,
    description: null,
    overlap: [],
    recommendation: 'SKIP', // ADOPT, REFERENCE, SKIP
    reason: '',
  };

  // Extract owner/repo from URL
  var match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) {
    result.reason = 'Not a valid GitHub URL';
    return result;
  }
  var owner = match[1];
  var repo = match[2].replace(/\.git$/, '');
  result.name = repo;

  // Get repo info via gh CLI
  try {
    var info = JSON.parse(childProcess.execFileSync('gh', ['repo', 'view', owner + '/' + repo, '--json', 'name,description,stargazerCount,licenseInfo,pushedAt'], { encoding: 'utf8', timeout: 15000 }));
    result.stars = info.stargazerCount || 0;
    result.description = info.description || '';
    result.lastCommit = info.pushedAt || null;
    if (info.licenseInfo) {
      var spdx = (info.licenseInfo.spdxId || '').toLowerCase();
      result.license = info.licenseInfo.name || spdx;
      if (['mit', 'apache-2.0', 'bsd-2-clause', 'bsd-3-clause', 'isc', 'unlicense'].includes(spdx)) {
        result.licenseRisk = 'green';
      } else if (['gpl-3.0', 'agpl-3.0', 'gpl-2.0'].includes(spdx)) {
        result.licenseRisk = 'red';
      } else {
        result.licenseRisk = 'yellow';
      }
    }
  } catch(e) {
    result.reason = 'Could not fetch repo info: ' + e.message;
    return result;
  }

  // Check overlap with existing skills
  try {
    var skillBrowser = require('../skill-browser');
    var skills = skillBrowser.listSkills();
    var repoWords = (result.description + ' ' + result.name).toLowerCase().split(/\s+/);
    var overlapping = skills.filter(function(s) {
      return repoWords.some(function(w) { return w.length > 3 && (s.name.includes(w) || (s.description || '').toLowerCase().includes(w)); });
    });
    result.overlap = overlapping.slice(0, 5).map(function(s) { return s.name; });
  } catch(_) {}

  // Score and recommend
  var score = 0;
  if (result.stars >= 1000) score += 3;
  else if (result.stars >= 100) score += 2;
  else if (result.stars >= 10) score += 1;

  if (result.licenseRisk === 'green') score += 2;
  else if (result.licenseRisk === 'yellow') score += 1;
  else score -= 2;

  if (result.lastCommit) {
    var daysSince = (Date.now() - new Date(result.lastCommit).getTime()) / 86400000;
    if (daysSince < 30) score += 2;
    else if (daysSince < 90) score += 1;
    else if (daysSince > 365) score -= 1;
  }

  if (result.overlap.length > 3) score -= 2;
  else if (result.overlap.length > 0) score -= 1;

  if (score >= 5) { result.recommendation = 'ADOPT'; result.reason = 'High quality, compatible license, actively maintained'; }
  else if (score >= 3) { result.recommendation = 'REFERENCE'; result.reason = 'Useful patterns but some concerns (overlap or license)'; }
  else { result.recommendation = 'SKIP'; result.reason = 'Low quality, incompatible license, or high overlap'; }

  return result;
}

module.exports = { evaluatePackage: evaluatePackage };
