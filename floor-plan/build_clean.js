const fs = require('fs');
const path = require('path');

const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
const threeJs = fs.readFileSync(path.join(__dirname, 'three.min.js'), 'utf8');
const orbitControls = fs.readFileSync(path.join(__dirname, 'OrbitControls.js'), 'utf8');

const output = template
    .replace('/* THREE_JS_INLINE */', threeJs)
    .replace('/* ORBIT_CONTROLS_INLINE */', orbitControls);

fs.writeFileSync(path.join(__dirname, 'index.html'), output, 'utf8');
console.log('Successfully rebuilt index.html from scratch!');
