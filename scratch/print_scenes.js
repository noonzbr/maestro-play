const fs = require('fs');
const path = require('path');

const fileArg = process.argv[2] || 'game2.ts';
const filePath = path.join(__dirname, '..', 'lib', 'games', fileArg);

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf-8');

console.log(`Parsing scenes in ${fileArg}...`);
console.log('----------------------------------------------------');

// Simple parser for scenes array
// Find blocks inside scenes: [ ... ]
const scenesMatch = content.match(/scenes:\s*\[([\s\S]*?)\]\s*,\s*\n\s*\}/);
if (!scenesMatch) {
  // Try another format matching ending
  console.log("Could not parse scenes list easily, printing raw occurrences of id / type:");
}

const sceneBlocks = [];
const regex = /\{\s*id:\s*['"]([^'"]+)['"]\s*,\s*\n\s*type:\s*['"]([^'"]+)['"]/g;
let match;
while ((match = regex.exec(content)) !== null) {
  sceneBlocks.push({ id: match[1], type: match[2] });
}

sceneBlocks.forEach((s, idx) => {
  console.log(`[Scene ${idx}] ID: ${s.id.padEnd(25)} | Type: ${s.type}`);
});
