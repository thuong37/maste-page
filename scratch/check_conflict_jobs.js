const fs = require('fs');
const text = fs.readFileSync('js/home.js', 'utf8');
const headPart = text.slice(text.indexOf('<<<<<<< HEAD'), text.indexOf('======='));
const remotePart = text.slice(text.indexOf('======='), text.indexOf('>>>>>>>'));
console.log('HEAD jobs count:', (headPart.match(/id:\s*\d+/g) || []).length);
console.log('REMOTE jobs count:', (remotePart.match(/id["']?\s*:\s*\d+/g) || []).length);
