'use strict';
var fs = require('fs');
var path = require('path');
var knowledge = require('../../commander/knowledge');

/**
 * Analyze knowledge base and find skills that need improvement.
 * @returns {Array<{ skill: string, pattern: string, count: number, suggestion: string }>}
 */
function findEvolutionOpportunities() {
  var lessons = knowledge.listAll();
  if (lessons.length < 5) return [];

  var errorsByCategory = {};
  lessons.forEach(function(lesson) {
    if (lesson.outcome === 'error' || (lesson.patterns && lesson.patterns.errorPatterns && lesson.patterns.errorPatterns.length > 0)) {
      var cat = lesson.category || 'general';
      if (!errorsByCategory[cat]) errorsByCategory[cat] = [];
      errorsByCategory[cat].push({
        task: lesson.task,
        errors: (lesson.patterns && lesson.patterns.errorPatterns) || [],
        successes: (lesson.patterns && lesson.patterns.successPatterns) || [],
        tech: (lesson.patterns && lesson.patterns.techStack) || [],
      });
    }
  });

  var opportunities = [];
  Object.keys(errorsByCategory).forEach(function(cat) {
    var errors = errorsByCategory[cat];
    if (errors.length >= 2) {
      var patternCounts = {};
      errors.forEach(function(e) {
        e.errors.forEach(function(p) {
          var key = p.slice(0, 80);
          patternCounts[key] = (patternCounts[key] || 0) + 1;
        });
      });

      Object.keys(patternCounts).forEach(function(pattern) {
        if (patternCounts[pattern] >= 2) {
          opportunities.push({
            category: cat,
            pattern: pattern,
            count: patternCounts[pattern],
            suggestion: 'Add warning about: ' + pattern,
          });
        }
      });
    }
  });

  return opportunities.sort(function(a, b) { return b.count - a.count; }).slice(0, 5);
}

/**
 * Log a skill evolution event.
 */
function logEvolution(skillName, change, evidence) {
  var logPath = path.join(require('os').homedir(), '.claude', 'commander', 'skill-evolution-log.json');
  var log = [];
  try { log = JSON.parse(fs.readFileSync(logPath, 'utf8')); } catch(_e) {}
  log.push({
    timestamp: new Date().toISOString(),
    skill: skillName,
    change: change,
    evidence: evidence,
  });
  var dir = path.dirname(logPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
}

module.exports = { findEvolutionOpportunities: findEvolutionOpportunities, logEvolution: logEvolution };
