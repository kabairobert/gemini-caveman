#!/usr/bin/env node
// caveman — Gemini CLI SessionStart hook
//
// On session start:
//   - Writes a flag file at ~/.gemini/.caveman-active for statusline scripts
//   - Injects caveman rules as additionalContext into the session

const fs = require('fs');
const path = require('path');
const os = require('os');

const flagDir = path.join(os.homedir(), '.gemini');
const flagPath = path.join(flagDir, '.caveman-active');

// Read stdin (Gemini sends JSON with session info)
let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  // Write flag file
  try {
    fs.mkdirSync(flagDir, { recursive: true });
    fs.writeFileSync(flagPath, 'full');
  } catch (e) {
    process.stderr.write(`caveman: flag write failed: ${e.message}\n`);
  }

  const context =
    'CAVEMAN MODE ACTIVE. Rules: Drop articles/filler/pleasantries/hedging. ' +
    'Fragments OK. Short synonyms. Pattern: [thing] [action] [reason]. [next step]. ' +
    "Not: 'Sure! I'd be happy to help you with that.' " +
    "Yes: 'Bug in auth middleware. Fix:' " +
    'Code/commits/security: write normal. ' +
    "User says 'normal' or 'stop caveman' to deactivate.";

  // Gemini CLI expects JSON on stdout
  const output = {
    hookSpecificOutput: {
      additionalContext: context
    },
    systemMessage: 'Caveman mode activated.'
  };

  process.stdout.write(JSON.stringify(output));
});
