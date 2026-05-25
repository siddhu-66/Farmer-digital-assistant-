const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Fix malformed trailing strings from previous regex attempts
  content = content.replace(/\bopacity-\s/g, ' ');
  content = content.replace(/\bopacity-"/g, '"');
  content = content.replace(/\bopacity-`/g, '`');
  content = content.replace(/\bopacity-'\b/g, '\'');
  
  // 2. Fix the specific corrupted state seen in grep: "text-[var(--theme-text)] opacity-60 opacity-"
  content = content.replace(/text-\[var\(--theme-text\)\] opacity-[0-9]+ opacity-/g, 'text-gray-500');
  content = content.replace(/text-\[var\(--theme-text\)\] opacity-/g, 'text-gray-400');

  // 3. Convert all remaining text-white opacities to grays (Readability focus)
  content = content.replace(/\btext-white\/(80|90|100)\b/g, 'text-gray-800');
  content = content.replace(/\btext-white\/(50|60|70)\b/g, 'text-gray-500');
  content = content.replace(/\btext-white\/(10|20|30|40)\b/g, 'text-gray-400');

  // 4. Convert structural bg-white/x to clean white surface
  content = content.replace(/\bbg-white\/([0-9]+)\b/g, 'bg-white shadow-sm border border-gray-50');
  
  // 5. Convert glass-bg references
  content = content.replace(/\bbg-surface\b/g, 'bg-gray-50');

  // 6. Fix border-white references
  content = content.replace(/\bborder-white\/([0-9]+)\b/g, 'border-gray-100');

  // 7. Ensure backgrounds are not black
  content = content.replace(/\bbg-black\/40\b/g, 'bg-gray-50');
  content = content.replace(/\bbg-background\b/g, 'bg-white');

  // 8. Handle text-white specifically
  // We want to keep text-white on primary/status backgrounds but change standalone to theme-text
  content = content.replace(/className=(["`'])(.*?)(["`'])/g, (match, p1, classes, p3) => {
    let newClasses = classes;
    
    if (newClasses.includes('text-white')) {
       // Check if this element likely has a dark background
       const hasDarkBg = /\b(bg-primary|bg-green|bg-blue|bg-red|bg-yellow|bg-emerald|bg-indigo|bg-black|glass-button|bg-secondary|bg-approved|bg-pending|bg-rejected)\b/i.test(newClasses);
       if (!hasDarkBg) {
         newClasses = newClasses.replace(/\btext-white\b/g, 'text-[var(--theme-text)]');
       }
    }

    // Clean up double spaces
    newClasses = newClasses.replace(/\s+/g, ' ').trim();
    
    return `className=${p1}${newClasses}${p3}`;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Polished:', filePath);
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

const targetDir = path.join(__dirname, '..', 'src');
console.log('Starting cleanup on:', targetDir);
walkDir(targetDir);
console.log('Cleanup V2 finished.');
