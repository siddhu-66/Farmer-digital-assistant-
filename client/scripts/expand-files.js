/**
 * expand-files.js
 * Re-inserts newlines into single-line TSX/TS files by restoring JSX structure.
 * Purely regex-based, fast, safe.
 */
const fs = require('fs');
const path = require('path');

// Tags after which we insert a newline
const OPEN_TAGS_NL = [
  { rx: /(?<!\/)>\s*(?=[<{])/g, rep: '>\n' },
  { rx: /;\s*(?=(const|let|var|function|export|import|return|if|else|try|catch|async|\/\/))/g, rep: ';\n' },
  { rx: /\}\s*(?=(const|let|var|function|export|import|return|if|else|try|catch|\/\/))/g, rep: '}\n' },
];

function expandFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Only process files that are collapsed into <= 3 lines but have substantial content
  const lineCount = content.split('\n').length;
  if (lineCount > 10) return; // Already multi-line, skip

  let expanded = content;

  // 1. Restore newlines after JSX closing >
  expanded = expanded.replace(/>\s*</g, '>\n<');
  // 2. Restore newlines after semicolons
  expanded = expanded.replace(/;\s*(const|let|var|function|export|import|return|if|for|\/\/|async)/g, ';\n$1');
  // 3. Restore newlines at block boundaries
  expanded = expanded.replace(/\}\s*(const|let|var|function|export|import|return|if|else|for|\/\/|async)/g, '}\n$1');
  // 4. Restore newlines before block starts
  expanded = expanded.replace(/\{\s*(const|let|var|function|export|import|return|if|for|\/\/|async)/g, '{\n  $1');
  // 5. Restore newlines after import statements
  expanded = expanded.replace(/';(\s*import)/g, "';\n$1");
  expanded = expanded.replace(/";(\s*import)/g, '";\n$1');
  // 6. Clean up excessive blank lines
  expanded = expanded.replace(/\n{3,}/g, '\n\n');

  if (expanded !== content) {
    fs.writeFileSync(filePath, expanded, 'utf8');
    console.log('Expanded:', path.basename(filePath));
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(f => {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.next')) walkDir(fullPath);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      expandFile(fullPath);
    }
  });
}

const target = path.join(__dirname, '..', 'src');
console.log('Expanding collapsed files in:', target);
walkDir(target);
console.log('Done.');
