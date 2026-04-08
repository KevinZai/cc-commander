'use strict';

var test = require('node:test');
var assert = require('node:assert');
var tui = require('../tui');

test('S symbols object has all expected keys', function() {
  assert.ok(tui.S, 'S should be exported');
  var expected = ['BAR', 'BAR_START', 'BAR_END', 'STEP_ACTIVE', 'STEP_DONE', 'RADIO_ON', 'RADIO_OFF'];
  expected.forEach(function(key) {
    assert.ok(tui.S[key], 'S.' + key + ' should exist');
  });
});

test('renderLogo produces non-empty ANSI output', function() {
  var logo = tui.renderLogo('CCC');
  assert.ok(logo.length > 50, 'Logo should be substantial');
  assert.ok(logo.includes('\x1b['), 'Logo should contain ANSI codes');
});

test('stripAnsi removes all ANSI codes', function() {
  var colored = tui.colorText('hello', [255, 0, 0]);
  var stripped = tui.stripAnsi(colored);
  assert.strictEqual(stripped, 'hello');
});

test('gradient produces colored text longer than input', function() {
  var g = tui.gradient('Hello', [[255, 0, 0], [0, 0, 255]]);
  assert.ok(g.includes('\x1b['));
  assert.ok(g.length > 'Hello'.length);
});

test('all 10 themes are available', function() {
  var names = tui.getThemeNames();
  assert.ok(names.length >= 10, 'Expected 10+ themes, got ' + names.length);
});

test('sparkline renders from values', function() {
  var s = tui.sparkline([0, 25, 50, 75, 100]);
  var stripped = tui.stripAnsi(s);
  assert.ok(stripped.length > 0, 'Sparkline should produce output');
});

test('box renders content with borders', function() {
  var b = tui.box('test content');
  var stripped = tui.stripAnsi(b);
  assert.ok(stripped.includes('test content'));
});

test('divider renders with optional title', function() {
  var d = tui.divider('Test');
  assert.ok(d.includes('Test'));
  var plain = tui.divider();
  assert.ok(plain.length > 10);
});

test('progressBar renders filled and empty blocks', function() {
  var p = tui.progressBar(50, 100);
  var stripped = tui.stripAnsi(p);
  assert.ok(stripped.length > 5);
});
