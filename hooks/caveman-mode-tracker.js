#!/usr/bin/env node
// caveman — Gemini CLI BeforeAgent hook
//
// Fires before the agent processes each prompt. Inspects user input for
// /caveman commands and mode switches, updates the flag file, and
// optionally injects mode-specific context.

const fs = require('fs');
const path = require('path');
const os = require('os');

const flagDir = path.join(os.homedir(), '.gemini');
const flagPath = path.join(flagDir, '.caveman-active');

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const prompt = (data.prompt || '').trim().toLowerCase();
    const output = {};

    // Detect /caveman commands
    if (prompt.startsWith('/caveman')) {
      const parts = prompt.split(/\s+/);
      const cmd = parts[0];
      const arg = parts[1] || '';

      let mode = null;

      if (cmd === '/caveman:commit') {
        mode = 'commit';
      } else if (cmd === '/caveman:review') {
        mode = 'review';
      } else if (cmd === '/caveman') {
        if (arg === 'lite') mode = 'lite';
        else if (arg === 'ultra') mode = 'ultra';
        else if (arg === 'off' || arg === 'stop' || arg === 'normal') mode = null;
        else mode = 'full';
      }

      if (mode) {
        fs.mkdirSync(flagDir, { recursive: true });
        fs.writeFileSync(flagPath, mode);
        process.stderr.write(`caveman: mode set to ${mode}\n`);
      } else {
        // Deactivation
        try { fs.unlinkSync(flagPath); } catch (e) {}
        process.stderr.write('caveman: mode deactivated\n');
      }
    }

    // Detect natural-language deactivation
    if (/\b(stop caveman|normal mode|caveman off)\b/i.test(prompt)) {
      try { fs.unlinkSync(flagPath); } catch (e) {}
      process.stderr.write('caveman: mode deactivated via natural language\n');
    }

    process.stdout.write(JSON.stringify(output));
  } catch (e) {
    process.stderr.write(`caveman: hook error: ${e.message}\n`);
    process.stdout.write('{}');
  }
});
