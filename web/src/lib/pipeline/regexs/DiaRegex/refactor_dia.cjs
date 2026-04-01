const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.js') && file !== 'tempCodeRunnerFile.js') {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;

      // Make sure the function is renamed
      if (content.includes('function extractLabelsFromArray(arr)')) {
        content = content.replace('function extractLabelsFromArray(arr)', 'export function extract(arr)');
        changed = true;
      }

      // Remove standalone execution block
      const loadIndex1 = content.indexOf('// ✅ Load JSON');
      const loadIndex2 = content.indexOf('const raw = fs.readFileSync');
      const loadIndex3 = content.indexOf('const raw =fs.readFileSync');

      let cutIndex = -1;
      if (loadIndex1 !== -1) cutIndex = loadIndex1;
      else if (loadIndex2 !== -1) cutIndex = Math.max(0, content.lastIndexOf('\n', loadIndex2)); // grab the line start
      else if (loadIndex3 !== -1) cutIndex = Math.max(0, content.lastIndexOf('\n', loadIndex3));

      if (cutIndex !== -1 && cutIndex > 50) { // arbitrary safe length
        content = content.substring(0, cutIndex);
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
        // console.log('Refactored:', fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'Dia'));
