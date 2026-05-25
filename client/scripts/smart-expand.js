/**
 * smart-expand.js  
 * Restores newlines in collapsed .tsx/.ts files.
 * Only touches files with <= 10 lines but > 300 bytes (truly collapsed).
 */
const fs = require('fs');
const path = require('path');

function expandSmart(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const lineCount = content.split('\n').length;
  
  // Only process collapsed files
  if (lineCount > 10) return;
  if (content.length < 300) return;

  let ex = content;

  // Insert newlines at key JSX/TS boundaries
  // After JSX closing > before < or {
  ex = ex.replace(/> <\//g, '>\n</');
  ex = ex.replace(/> </g, '>\n<');
  ex = ex.replace(/> {/g, '>\n{');
  ex = ex.replace(/} </g, '}\n<');
  ex = ex.replace(/} \(/g, '}\n(');

  // After semicolons before keywords
  ex = ex.replace(/; (import|export|const|let|var|function|return|if|for|while|class|interface|type|async|\/\/)/g, ';\n$1');

  // After { before keywords (function bodies)
  ex = ex.replace(/\{ (const|let|var|return|if|for|while|try|\/\/)/g, '{\n  $1');

  // After closing braces before keywords
  ex = ex.replace(/\} (const|let|var|export|import|return|if|else|for|while|try|function|class|interface|async|\/\/)/g, '}\n$1');

  // After closing ) before arrow => {
  ex = ex.replace(/\) => \{/g, ') => {\n  ');

  // After 'use client'; / 'use server';
  ex = ex.replace(/"use client"; /g, '"use client";\n');
  ex = ex.replace(/"use server"; /g, '"use server";\n');

  // Clean up triple+ newlines
  ex = ex.replace(/\n{3,}/g, '\n\n');

  if (ex !== content) {
    fs.writeFileSync(filePath, ex, 'utf8');
    console.log(`Expanded (${lineCount} -> ${ex.split('\n').length} lines): ${path.basename(filePath)}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(f => {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.next')) walkDir(fullPath);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      expandSmart(fullPath);
    }
  });
}

const target = path.join(__dirname, '..', 'src');
console.log('Smart-expanding collapsed files in:', target);
walkDir(target);
console.log('Done.');
