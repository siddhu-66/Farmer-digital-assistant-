// Fix casing issue script
const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'controllers');
const oldFile = path.join(controllersDir, 'locationcontroller.js');
const newFile = path.join(controllersDir, 'locationController.js');

console.log('Fixing casing issue...');

try {
  // Check if lowercase version exists and remove it
  if (fs.existsSync(oldFile)) {
    console.log('Removing lowercase file...');
    fs.unlinkSync(oldFile);
  }

  // Ensure uppercase version exists
  if (fs.existsSync(newFile)) {
    console.log('Uppercase file exists correctly');
  } else {
    console.log('Uppercase file missing - this should not happen');
  }

  console.log('Casing issue fixed!');
  console.log('Please restart your IDE to clear the TypeScript cache.');
  
} catch (error) {
  console.error('Error fixing casing:', error);
}
