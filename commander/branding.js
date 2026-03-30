'use strict';

var BRAND = Object.freeze({
  product: 'CC Commander',
  productFull: 'Claude Code Commander',
  productShort: 'CC',
  tagline: '280+ skills. One command. Your AI work, managed by AI.',
  taglineShort: 'The ultimate Claude Code setup.',
  version: '1.6.0',

  author: 'Kevin Z',
  authorFull: 'Kevin Zicherman',
  website: 'https://kevinz.ai',
  twitter: '@kzic',
  github: 'k3v80',
  repo: 'claude-code-kit',
  repoUrl: 'https://github.com/k3v80/claude-code-kit',

  envPrefix: 'KC_',

  proName: 'CC Commander Pro',
  proPrice: '$19/mo',
  proUrl: 'https://kevinz.ai/pro',

  welcomeNew: "Welcome! I'm your mission control for Claude Code.\nI'll help you build, create, and ship — no coding knowledge needed.",
  welcomeBack: function(name, streak) {
    return 'Welcome back, ' + name + "! You're on a " + streak + '-day streak.';
  },

  planModeNote: 'All sessions start in plan mode for safety.',
  scope: 'Not just coding — marketing, content, social media, research, and more.',

  footer: 'CC Commander by Kevin Z — kevinz.ai',
});

module.exports = BRAND;
