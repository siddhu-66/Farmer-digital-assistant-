const fs = require('fs');
const path = require('path');

function fixComments(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.next')) {
        fixComments(fullPath);
      }
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let orig = content;

      // Fix swallowed code: "// some comment const x" -> "// some comment\nconst x"
      // Matching // followed by anything but newline, then a space, then a keyword
      const regex = /\/\/ ([^\n]+?) (export|import|const|let|var|function|return|if|else|for|while|try|catch|class|interface|type|async|await)(?=\s|\{)/g;
      
      content = content.replace(regex, '// $1\n$2');

      // Also fix `} else` that got joined:
      content = content.replace(/\}\s*else/g, '} else');

      // Also fix cases like `// Validating file ... } else {` -> `// Validating file ...\n} else {`
      content = content.replace(/\/\/ ([^\n]+?) \}(?=\s|else)/g, '// $1\n}');
      
      // Also fix missing brace ends before tags `} </` -> `}\n</`
      content = content.replace(/\}\s*</g, '}\n<');

      if (content !== orig) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log("Fixed comments in:", fullPath);
      }
    }
  }
}

fixComments(path.join(__dirname, '..', 'src'));
