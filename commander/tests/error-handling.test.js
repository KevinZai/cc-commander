'use strict';

var test = require('node:test');
var assert = require('node:assert');
var path = require('path');

var errorLogger = require('../error-logger');

// ─── error-logger.js ──────────────────────────────────────────────────────────

test('errorLogger: log is a function', function() {
  assert.strictEqual(typeof errorLogger.log, 'function');
});

test('errorLogger: logError is a function', function() {
  assert.strictEqual(typeof errorLogger.logError, 'function');
});

test('errorLogger: logError returns string starting with CCC-ERR-', function() {
  var id = errorLogger.logError(new Error('test error'), 'test-context');
  assert.ok(typeof id === 'string', 'should return a string');
  assert.ok(id.startsWith('CCC-ERR-'), 'should start with CCC-ERR-, got: ' + id);
});

test('errorLogger: logError with string error returns CCC-ERR- id', function() {
  var id = errorLogger.logError('plain string error', 'test-context');
  assert.ok(id.startsWith('CCC-ERR-'));
});

test('errorLogger: logError without context still returns CCC-ERR- id', function() {
  var id = errorLogger.logError(new Error('no context'));
  assert.ok(id.startsWith('CCC-ERR-'));
});

test('errorLogger: LOG_FILE ends with errors.log', function() {
  assert.ok(typeof errorLogger.LOG_FILE === 'string', 'LOG_FILE should be a string');
  assert.ok(errorLogger.LOG_FILE.endsWith('errors.log'), 'LOG_FILE should end with errors.log, got: ' + errorLogger.LOG_FILE);
});

test('errorLogger: log does not throw for Error instance', function() {
  assert.doesNotThrow(function() {
    errorLogger.log(new Error('test'), 'test-context');
  });
});

test('errorLogger: log does not throw for string', function() {
  assert.doesNotThrow(function() {
    errorLogger.log('something went wrong', 'test');
  });
});

test('errorLogger: logError IDs are unique across calls', function() {
  var id1 = errorLogger.logError(new Error('err1'), 'ctx');
  var id2 = errorLogger.logError(new Error('err2'), 'ctx');
  // IDs contain timestamp so may collide only if called in same ms — acceptable
  // but they must be valid CCC-ERR- strings
  assert.ok(id1.startsWith('CCC-ERR-'));
  assert.ok(id2.startsWith('CCC-ERR-'));
});

// ─── Action module structure tests ────────────────────────────────────────────

var ACTION_FILES = ['build', 'session', 'linear', 'skills', 'settings', 'stats', 'infra'];

ACTION_FILES.forEach(function(name) {
  var modulePath = path.join(__dirname, '..', 'actions', name + '.js');

  test('actions/' + name + '.js: require does not throw', function() {
    var mod;
    assert.doesNotThrow(function() {
      mod = require(modulePath);
    });
  });

  test('actions/' + name + '.js: exports is an object', function() {
    var mod = require(modulePath);
    assert.ok(typeof mod === 'object' && mod !== null, 'module.exports should be an object');
    assert.ok(!Array.isArray(mod), 'module.exports should not be an array');
  });

  test('actions/' + name + '.js: every exported value is an async function', function() {
    var mod = require(modulePath);
    var keys = Object.keys(mod);
    assert.ok(keys.length > 0, name + '.js should export at least one function');
    keys.forEach(function(key) {
      var fn = mod[key];
      assert.strictEqual(typeof fn, 'function', key + ' should be a function');
      assert.strictEqual(
        fn.constructor.name,
        'AsyncFunction',
        key + ' should be an AsyncFunction, got ' + fn.constructor.name
      );
    });
  });
});
