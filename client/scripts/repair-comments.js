const fs = require('fs');
const path = require('path');

function repairFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Insert newline after known comment texts that swallowed code
  const replacements = [
    { search: /\/\/ 5MB export default/g, replace: '// 5MB\nexport default' },
    { search: /\/\/ State for Step 1: Verification const/g, replace: '// State for Step 1: Verification\nconst' },
    { search: /\/\/ Base64 or mock URL \} \);/g, replace: '// Base64 or mock URL\n});' },
    { search: /\/\/ Mocking document upload setFormData/g, replace: '// Mocking document upload\nsetFormData' },
    { search: /\/\/ Validate size and type for images if/g, replace: '// Validate size and type for images\nif' },
    { search: /\/\/ mock PDF upload \}/g, replace: '// mock PDF upload\n}' },
    { search: /\/\/ Dialog State const/g, replace: '// Dialog State\nconst' },
    { search: /\/\/ Check local storage \/ mock backend for business status const/g, replace: '// Check local storage / mock backend for business status\nconst' },
    { search: /\/\/ Not registered as a business yet router/g, replace: '// Not registered as a business yet\nrouter' },
    { search: /\/\/ Approved Status return/g, replace: '// Approved Status\nreturn' },
    { search: /\/\/ Verification Success Banner \}/g, replace: '// Verification Success Banner\n}' },
    { search: /\/\/ Render children module \(the actual business dashboard portal\) <div/g, replace: '// Render children module (the actual business dashboard portal)\n<div' },
    { search: /\/\/ Base64 or mock URL landDocument:/g, replace: '// Base64 or mock URL\nlandDocument:' },
    { search: /\/\/ Base64 or mock URL \}\);/g, replace: '// Base64 or mock URL\n});' }
  ];

  replacements.forEach(({ search, replace }) => {
    content = content.replace(search, replace);
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Repaired comments in:', path.basename(filePath));
  }
}

['src/components/forms/BusinessRegistrationForm.tsx', 
 'src/components/forms/FarmerRegistrationForm.tsx',
 'src/app/admin/verifications/page.tsx',
 'src/app/business/layout.tsx'].forEach(file => {
   const fullPath = path.join(__dirname, '..', file);
   if (fs.existsSync(fullPath)) repairFile(fullPath);
});
