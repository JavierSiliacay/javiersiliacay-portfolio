// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');

const filesToPatch = [
  './node_modules/@mediapipe/face_detection/face_detection.js',
  './node_modules/@mediapipe/hands/hands.js',
  './node_modules/@mediapipe/face_mesh/face_mesh.js'
];

filesToPatch.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      if (file.includes('face_detection.js') && !content.includes('export const FaceDetection')) {
        fs.appendFileSync(file, '\nexport const FaceDetection = {};\n');
      }
      else if (file.includes('hands.js') && !content.includes('export const Hands')) {
        fs.appendFileSync(file, '\nexport const Hands = {};\n');
      }
      else if (file.includes('face_mesh.js') && !content.includes('export const FaceMesh')) {
        fs.appendFileSync(file, '\nexport const FaceMesh = {};\n');
      }
      
      console.log(`Successfully patched ${file} for Next.js build compatibility.`);
    }
  } catch (err) {
    console.error(`Failed to patch ${file}:`, err);
  }
});
