const fs = require('fs');

console.log('--- STARTING PRODUCTION BUILD ---');

// 1. Minify CSS safely
const rawCss = fs.readFileSync('css/style.css', 'utf8');

function minifyCss(css) {
  return css
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Normalize newlines and tabs
    .replace(/[\r\n\t]+/g, ' ')
    // Collapse multiple spaces
    .replace(/\s{2,}/g, ' ')
    // Remove space around { } ; ,
    .replace(/\s*([\{\};,])\s*/g, '$1')
    // Remove space before : (preserve space after colon in values where needed)
    .replace(/\s*:\s*/g, ':')
    // Clean up empty lines
    .replace(/;}/g, '}')
    .trim();
}

const minCss = minifyCss(rawCss);
fs.writeFileSync('css/style.min.css', minCss, 'utf8');
console.log(`✓ CSS Minified: ${rawCss.length} bytes -> ${minCss.length} bytes (${Math.round((1 - minCss.length / rawCss.length) * 100)}% reduction)`);

// Verify that minified CSS starts with :root and has balanced braces
const openBracesCss = (minCss.match(/\{/g) || []).length;
const closeBracesCss = (minCss.match(/\}/g) || []).length;
if (openBracesCss !== closeBracesCss || !minCss.includes(':root{')) {
  console.error('ERROR: CSS minification validation failed! open:', openBracesCss, 'close:', closeBracesCss);
  process.exit(1);
} else {
  console.log('✓ CSS validation passed: braces balanced, :root intact');
}

// 2. Minify JS safely
const rawJs = fs.readFileSync('js/app.js', 'utf8');

function minifyJs(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/[^\r\n]*/g, '$1')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
}

const minJs = minifyJs(rawJs);
fs.writeFileSync('js/app.min.js', minJs, 'utf8');
console.log(`✓ JS Minified: ${rawJs.length} bytes -> ${minJs.length} bytes (${Math.round((1 - minJs.length / rawJs.length) * 100)}% reduction)`);

console.log('--- PRODUCTION BUILD COMPLETE ---');
