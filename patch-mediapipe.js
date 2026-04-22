// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
const path = require('path');

function findFilesToPatch(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFilesToPatch(fullPath));
    } else {
      if (fullPath.endsWith('face_detection.js') && fullPath.includes('@mediapipe')) results.push(fullPath);
      if (fullPath.endsWith('hands.js') && fullPath.includes('@mediapipe')) results.push(fullPath);
      if (fullPath.endsWith('face_mesh.js') && fullPath.includes('@mediapipe')) results.push(fullPath);
    }
  }
  return results;
}

const pnpmDir = path.join(__dirname, 'node_modules', '.pnpm');
const regularDir = path.join(__dirname, 'node_modules', '@mediapipe');

let filesToPatch = [];
if (fs.existsSync(regularDir)) {
  filesToPatch = filesToPatch.concat(findFilesToPatch(regularDir));
}
if (fs.existsSync(pnpmDir)) {
  const pnpmMediapipeDirs = fs.readdirSync(pnpmDir).filter(d => d.includes('@mediapipe'));
  for (const d of pnpmMediapipeDirs) {
    filesToPatch = filesToPatch.concat(findFilesToPatch(path.join(pnpmDir, d)));
  }
}

// deduplicate
filesToPatch = [...new Set(filesToPatch)];

filesToPatch.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    let patched = false;
    
    if (file.includes('face_detection.js') && !content.includes('exports.FaceDetection')) {
      fs.appendFileSync(file, '\ntypeof exports !== "undefined" && (exports.FaceDetection = typeof FaceDetection !== "undefined" ? FaceDetection : {});\n');
      patched = true;
    }
    else if (file.includes('hands.js') && !content.includes('exports.Hands')) {
      fs.appendFileSync(file, '\ntypeof exports !== "undefined" && (exports.Hands = typeof Hands !== "undefined" ? Hands : {});\n');
      patched = true;
    }
    else if (file.includes('face_mesh.js') && !content.includes('exports.FaceMesh')) {
      fs.appendFileSync(file, '\ntypeof exports !== "undefined" && (exports.FaceMesh = typeof FaceMesh !== "undefined" ? FaceMesh : {});\n');
      patched = true;
    }
    
    if (patched) {
      console.log(`Successfully patched ${file} for Next.js build compatibility.`);
    }
  } catch (err) {
    console.error(`Failed to patch ${file}:`, err);
  }
});
