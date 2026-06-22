const fs = require('fs');
const path = require('path');

// Target directory containing the game files
const gamesDir = path.join(__dirname, '..', 'lib', 'games');

// Get all .ts files in lib/games
const files = fs.readdirSync(gamesDir).filter(f => f.startsWith('game') && f.endsWith('.ts'));

console.log(`Analyzing ${files.length} game files in lib/games...`);
console.log('----------------------------------------------------');

const results = [];

files.forEach(file => {
  const filePath = path.join(gamesDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  // We can search for scene types programmatically.
  // Since visual novel files are exported as objects, we can look for "type: \"prompt\"" or "type: 'prompt'" or "type: \"construct\""
  const hasPrompt = content.includes('type: "prompt"') || content.includes("type: 'prompt'") || content.includes('type:  "prompt"');
  const hasConstruct = content.includes('type: "construct"') || content.includes("type: 'construct'") || content.includes('type:  "construct"');
  const hasPromptChallenge = content.includes('promptChallenge:');

  results.push({
    file,
    hasPrompt,
    hasConstruct,
    hasPromptChallenge,
    isComplete: hasPrompt || hasConstruct || hasPromptChallenge
  });
});

// Print results
console.log(String.prototype.padEnd ? 'File'.padEnd(20) : 'File', ' | Prompt? | Construct? | PromptChallenge? | Completed?');
console.log('---------------------------------------------------------------------------------');
results.forEach(r => {
  console.log(
    (r.file).padEnd(20),
    `| ${r.hasPrompt ? 'YES   ' : 'NO    '} | ${r.hasConstruct ? 'YES       ' : 'NO        '} | ${r.hasPromptChallenge ? 'YES             ' : 'NO              '} | ${r.isComplete ? '✅ YES' : '❌ NO'}`
  );
});

console.log('----------------------------------------------------');
const missing = results.filter(r => !r.isComplete).map(r => r.file);
console.log(`Summary: ${results.filter(r => r.isComplete).length} games have a 'do it' moment.`);
console.log(`Summary: ${missing.length} games are missing a 'do it' moment.`);
if (missing.length > 0) {
  console.log(`Missing files:`, missing);
}
