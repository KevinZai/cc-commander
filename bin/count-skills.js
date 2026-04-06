#!/usr/bin/env node
'use strict';
var skillBrowser = require('../commander/skill-browser');
var count = skillBrowser.listSkills().length;
console.log(count);
