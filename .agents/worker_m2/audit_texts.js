const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/night/Documents/ClaudeAgent/maestro-play/lib/games';
const files = fs.readdirSync(dir).filter(f => f.startsWith('game') && f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Find lines in format text: "..." or text:\n "..." or scenarioText: "..."
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    // Look for string literals that are very long
    if (line.includes('text:') || line.includes('scenarioText:')) {
      const match = line.match(/(text|scenarioText):\s*["'`](.*)["'`]/);
      if (match) {
        const text = match[2];
        if (text.length > 200) {
          console.log(`${file}:${idx + 1} (${text.length} chars): ${text.substring(0, 60)}...`);
        }
      }
    }
  });
});
