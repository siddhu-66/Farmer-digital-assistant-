const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Unified Purge of contamination strings
  content = content.replace(/text-gray-40060/g, 'text-gray-500');
  content = content.replace(/text-gray-500[0-9]+/g, 'text-gray-500');
  
  // 2. Fix trailing opacity suffixes
  content = content.replace(/opacity-\s/g, ' ');
  content = content.replace(/opacity-"/g, '"');
  content = content.replace(/opacity-`/g, '`');
  content = content.replace(/opacity-'\b/g, '\'');
  content = content.replace(/\bopacity-\b/g, ''); 

  // 3. Fix background/border artifacts
  content = content.replace(/border-border-color/g, 'border-gray-200');
  content = content.replace(/\bbg-surface\b/g, 'bg-gray-50');
  
  // 4. Double space cleanup
  content = content.replace(/\s{2,}/g, ' ');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed Cleanly:', filePath);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      if (!dirPath.includes('node_modules') && !dirPath.includes('.next')) walkDir(dirPath);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.css')) {
      processFile(dirPath);
    }
  });
}

const target = path.join(__dirname, '..', 'src');
console.log('Final Global Sweep on:', target);
walkDir(target);
console.log('Sweep Complete.');
