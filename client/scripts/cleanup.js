const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Search and destroy malformed CSS insertions resulting from regex interruption
  content = content.replace(/opacity-\s/g, ' ');
  content = content.replace(/opacity-"/g, '"');
  content = content.replace(/text-\[var\(--text-primary\)\]/g, 'text-[var(--theme-text)] opacity-60');
  content = content.replace(/bg-surface opacity-/g, 'bg-gray-50');

  // Fix some potentially broken border assignments
  content = content.replace(/border-border-color/g, 'border-gray-200');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed malformed classes:', filePath);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      if (!dirPath.includes('node_modules') && !dirPath.includes('.next')) walkDir(dirPath);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      processFile(dirPath);
    }
  });
}

// Adjust base depending on __dirname context
walkDir(path.join(__dirname, '..', 'src'));
console.log('Cleanup script finished.');
