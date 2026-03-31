'use strict';
var fs = require('fs');
var path = require('path');
var os = require('os');

var LOG_DIR = path.join(os.homedir(), '.claude', 'commander');
var LOG_FILE = path.join(LOG_DIR, 'error.log');
var MAX_SIZE = 1024 * 1024; // 1MB max

function log(error, context) {
  try {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
    // Rotate if too big
    if (fs.existsSync(LOG_FILE) && fs.statSync(LOG_FILE).size > MAX_SIZE) {
      fs.renameSync(LOG_FILE, LOG_FILE + '.old');
    }
    var entry = new Date().toISOString() + ' [' + (context || 'unknown') + '] ' +
      (error instanceof Error ? error.message + '\n' + error.stack : String(error)) + '\n';
    fs.appendFileSync(LOG_FILE, entry);
  } catch (_e) {} // never crash on logging
}

module.exports = { log: log, LOG_FILE: LOG_FILE };
