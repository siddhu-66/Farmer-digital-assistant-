const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // General Replacements
  content = content.replace(/\bbg-background\b/g, 'bg-[var(--theme-bg)]');
  
  // Text Opacity mapped to grays matching the prompt "clean white" background
  content = content.replace(/\btext-white\/(80|90)\b/g, 'text-gray-600');
  content = content.replace(/\btext-white\/(50|60|70)\b/g, 'text-gray-500');
  content = content.replace(/\btext-white\/(10|20|30|40)\b/g, 'text-gray-400');
  
  // Borders
  content = content.replace(/\bborder-white\/([0-9]+)\b/g, 'border-gray-200');
  
  // Transparent white backgrounds on glass elements back to solid white surface with shadow styling
  content = content.replace(/\bbg-white\/([0-9]+)\b/g, 'bg-[var(--theme-surface)] shadow-sm');
  
  // Dark form inputs
  content = content.replace(/\bbg-black\/40\b/g, 'bg-gray-50');

  // Carefully replace `text-white` knowing it might break dark buttons
  content = content.replace(/className=(["`'])(.*?)(["`'])/g, (match, p1, classes, p3) => {
    let newClasses = classes;
    
    // Only replace pure text-white if there is NO strong dark background forcing it
    if (newClasses.includes('text-white')) {
      const isButtonOrDarkBg = /(bg-primary|bg-green|bg-blue|bg-red|bg-yellow|bg-black|bg-accent|glass-button|bg-blue-600)/i.test(newClasses);
      if (!isButtonOrDarkBg) {
        newClasses = newClasses.replace(/\btext-white\b/g, 'text-[var(--theme-text)]');
      }
    }
    
    return `className=${p1}${newClasses}${p3}`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory() && !dirPath.includes('node_modules') && !dirPath.includes('.next')) {
      walkDir(dirPath);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      processFile(dirPath);
    }
  });
}

walkDir(path.join(__dirname, '..', 'src'));
console.log('Migration complete.');
