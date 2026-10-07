const fs = require('fs');
const file = '_bmad-output/planning-artifacts/.memlog.md';
let text = fs.readFileSync(file, 'utf8');

const h = text.indexOf('<<<<<<< HEAD');
const eq = text.indexOf('=======', h);
const end = text.indexOf('>>>>>>>', eq);
const endLineIndex = text.indexOf('\n', end);

const headChunk = text.slice(h + 12, eq).trim();
const remoteChunk = text.slice(eq + 7, end).trim();

const combined = headChunk + '\n\n' + remoteChunk;
const resolvedText = text.slice(0, h) + combined + text.slice(endLineIndex);

fs.writeFileSync(file, resolvedText, 'utf8');
console.log('Successfully resolved .memlog.md conflict!');
