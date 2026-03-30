#!/usr/bin/env node
'use strict';

var path = require('path');
var args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('\n  CC Commander — 280+ skills. One command. Your AI work, managed.\n');
  console.log('  Usage:  npx kit-commander    or    kc\n');
  console.log('  --version    Show version');
  console.log('  --test       Run self-test (validate all modules)');
  console.log('  --stats      Quick stats without TUI');
  console.log('  --repair     Fix corrupt state files');
  console.log('  --help       Show this help\n');
  console.log('  KC_NO_COLOR=1   Disable colors');
  console.log('  https://github.com/k3v80/claude-code-kit\n');
  process.exit(0);
}

if (args.includes('--version')) {
  var B = require(path.join(__dirname, '..', 'commander', 'branding'));
  console.log(B.product + ' v' + B.version);
  process.exit(0);
}

if (args.includes('--repair')) {
  var st = require(path.join(__dirname, '..', 'commander', 'state'));
  console.log('CC Commander — State Repair\n');
  var r = st.repairState();
  console.log(r.repaired ? '  Repaired: ' + r.details.join(', ') : '  State healthy. No repairs needed.');
  process.exit(0);
}

if (args.includes('--stats')) {
  var st2 = require(path.join(__dirname, '..', 'commander', 'state'));
  var cs = st2.loadState();
  var ks; try { ks = require(path.join(__dirname, '..', 'lib', 'kit-stats')); } catch (_e) { ks = { getStats: function(){return {};}, getStreak: function(){return {current:0};}, getAchievements: function(){return [];} }; }
  var s = ks.getStats(), sk = ks.getStreak(), a = ks.getAchievements();
  console.log('\n  CC Commander Stats\n');
  console.log('  Sessions:     ' + (s.totalSessions || (cs.user && cs.user.sessionsCompleted) || 0));
  console.log('  Streak:       ' + (sk.current||0) + ' days (longest: ' + (sk.longest||0) + ')');
  console.log('  Achievements: ' + a.length);
  console.log('  Cost:         $' + (s.totalCost||0).toFixed(2));
  console.log('  Level:        ' + st2.getUserLevel(cs) + '\n');
  process.exit(0);
}

if (args.includes('--test')) {
  console.log('CC Commander self-test:\n');
  var checks = [
    ['branding.js', function(){ return require(path.join(__dirname,'..','commander','branding')); }],
    ['state.js', function(){ var m=require(path.join(__dirname,'..','commander','state')); if(typeof m.repairState!=='function') throw new Error('repairState missing'); return m; }],
    ['adventure.js', function(){ var m=require(path.join(__dirname,'..','commander','adventure')); if(typeof m.resolveGitData!=='function') throw new Error('resolveGitData missing'); return m; }],
    ['renderer.js', function(){ return require(path.join(__dirname,'..','commander','renderer')); }],
    ['dispatcher.js', function(){ var m=require(path.join(__dirname,'..','commander','dispatcher')); if(typeof m.generateSessionName!=='function') throw new Error('generateSessionName missing'); return m; }],
    ['tui.js', function(){ var m=require(path.join(__dirname,'..','commander','tui')); if(typeof m.renderLogo!=='function') throw new Error('renderLogo missing'); return m; }],
    ['skill-browser.js', function(){ return require(path.join(__dirname,'..','commander','skill-browser')); }],
    ['recommendations.js', function(){ return require(path.join(__dirname,'..','commander','recommendations')); }],
    ['sync.js', function(){ return require(path.join(__dirname,'..','commander','sync')); }],
    ['engine.js', function(){ return require(path.join(__dirname,'..','commander','engine')); }],
    ['main-menu.json', function(){ return require(path.join(__dirname,'..','commander','adventures','main-menu.json')); }],
    ['build-something.json', function(){ return require(path.join(__dirname,'..','commander','adventures','build-something.json')); }],
    ['continue-work.json', function(){ return require(path.join(__dirname,'..','commander','adventures','continue-work.json')); }],
    ['review-work.json', function(){ return require(path.join(__dirname,'..','commander','adventures','review-work.json')); }],
    ['learn-skill.json', function(){ return require(path.join(__dirname,'..','commander','adventures','learn-skill.json')); }],
    ['check-stats.json', function(){ return require(path.join(__dirname,'..','commander','adventures','check-stats.json')); }],
  ];
  var passed = 0;
  for (var c of checks) { try { c[1](); console.log('  v ' + c[0]); passed++; } catch(e) { console.log('  x ' + c[0] + ': ' + e.message); } }
  console.log('\n  ' + passed + '/' + checks.length + ' passed');
  process.exit(passed === checks.length ? 0 : 1);
}

var KitCommander = require(path.join(__dirname, '..', 'commander', 'engine'));
var commander = new KitCommander();
commander.start().catch(function(err) { console.error('CC Commander error:', err.message); process.exit(1); });
