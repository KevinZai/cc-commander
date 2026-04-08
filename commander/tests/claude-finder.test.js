'use strict';

var test = require('node:test');
var assert = require('node:assert');

test('claude-finder exports resolve function', function() {
  var cf = require('../claude-finder');
  assert.ok(typeof cf.resolve === 'function');
});

test('resolve returns a non-empty string', function() {
  var cf = require('../claude-finder');
  var result = cf.resolve();
  assert.ok(typeof result === 'string');
  assert.ok(result.length > 0);
});

test('resolve result contains claude', function() {
  var cf = require('../claude-finder');
  var result = cf.resolve();
  assert.ok(result.includes('claude'), 'Expected path to contain "claude", got: ' + result);
});
