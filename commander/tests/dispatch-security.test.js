'use strict';

var test = require('node:test');
var assert = require('node:assert');
var dispatcher = require('../dispatcher');

test('generateSessionName produces safe slugs', function() {
  var name = dispatcher.generateSessionName('Test `$(evil)` task');
  assert.ok(!name.includes('`'), 'Should not contain backticks');
  assert.ok(!name.includes('$'), 'Should not contain dollar signs');
  assert.ok(name.startsWith('kc-'));
});

test('generateSessionName strips shell metacharacters', function() {
  var name = dispatcher.generateSessionName('Build API; rm -rf /');
  assert.ok(!name.includes(';'), 'Should not contain semicolons');
});

test('generateSessionName truncates long input', function() {
  var long = 'A'.repeat(200);
  var name = dispatcher.generateSessionName(long);
  assert.ok(name.length <= 50, 'Name should be <= 50 chars, got ' + name.length);
});

test('generateSessionName handles empty input', function() {
  var name = dispatcher.generateSessionName('');
  assert.ok(name.startsWith('kc-'));
  assert.ok(name.length >= 3);
});
