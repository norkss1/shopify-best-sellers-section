const fs   = require('fs');
const path = require('path');

const src   = path.join(__dirname, 'src', 'best-sellers');
const srcRoot = path.join(__dirname, 'src');
const theme = path.join(__dirname, 'theme');

fs.copyFileSync(`${src}/best-sellers.liquid`,        `${theme}/sections/best-sellers.liquid`);
fs.copyFileSync(`${src}/section-best-sellers.css`,   `${theme}/assets/section-best-sellers.css`);
fs.copyFileSync(`${src}/section-best-sellers.js`,    `${theme}/assets/section-best-sellers.js`);
fs.copyFileSync(`${srcRoot}/favicon.svg`,            `${theme}/assets/favicon.svg`);

console.log('Synced src/ -> theme/');
