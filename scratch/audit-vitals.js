const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

console.log('=== CORE WEB VITALS AUDIT ===\n');

// 1. Audit Images
const imgRegex = /<img\s+([^>]+)>/gi;
let match;
let imgCount = 0;
let missingAlt = [];
let missingWidthHeight = [];
let missingLoading = [];
let missingDecoding = [];
let brokenSrc = [];

while ((match = imgRegex.exec(html)) !== null) {
  imgCount++;
  const attrs = match[1];
  
  // Extract src
  const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
  const src = srcMatch ? srcMatch[1] : '';
  
  // Extract alt
  const altMatch = attrs.match(/alt=["']([^"']*)["']/i);
  if (!altMatch || altMatch[1].trim() === '') {
    missingAlt.push(src || `img #${imgCount}`);
  }
  
  // Extract width & height
  const widthMatch = attrs.match(/width=["']([^"']+)["']/i);
  const heightMatch = attrs.match(/height=["']([^"']+)["']/i);
  if (!widthMatch || !heightMatch) {
    missingWidthHeight.push({ src, width: !!widthMatch, height: !!heightMatch });
  }
  
  // Extract loading
  const loadingMatch = attrs.match(/loading=["']([^"']+)["']/i);
  const isHero = attrs.includes('fetchpriority="high"') || src.includes('164438248');
  if (!loadingMatch && !isHero) {
    missingLoading.push(src);
  }
  
  // Extract decoding
  const decodingMatch = attrs.match(/decoding=["']([^"']+)["']/i);
  if (!decodingMatch) {
    missingDecoding.push(src);
  }
  
  // Check if local file exists
  if (src && !src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('//')) {
    const localImgPath = path.join(__dirname, '..', src);
    if (!fs.existsSync(localImgPath)) {
      brokenSrc.push(src);
    }
  }
}

console.log(`Total <img> elements analyzed: ${imgCount}`);
console.log(`- Missing Alt: ${missingAlt.length}`, missingAlt);
console.log(`- Missing Width/Height: ${missingWidthHeight.length}`, missingWidthHeight);
console.log(`- Non-hero Missing loading="lazy": ${missingLoading.length}`, missingLoading);
console.log(`- Missing decoding="async": ${missingDecoding.length}`, missingDecoding);
console.log(`- Broken Image Paths: ${brokenSrc.length}`, brokenSrc);

// 2. Head resource analysis
console.log('\n=== HEAD RESOURCE ANALYSIS ===');
const hasFontPreconnect = html.includes('rel="preconnect" href="https://fonts.googleapis.com"');
const hasFontStaticPreconnect = html.includes('rel="preconnect" href="https://fonts.gstatic.com"');
const hasLcpPreload = html.includes('rel="preload" as="image"');
const hasFontAwesome = html.includes('font-awesome');
const hasDeferredJs = html.includes('<script src="js/app.min.js" defer></script>');

console.log(`- Google Font Preconnect: ${hasFontPreconnect}`);
console.log(`- Font Static Preconnect: ${hasFontStaticPreconnect}`);
console.log(`- Hero LCP Preload: ${hasLcpPreload}`);
console.log(`- FontAwesome in Head: ${hasFontAwesome}`);
console.log(`- Deferred Production JS: ${hasDeferredJs}`);

// 3. Form action & accessibility audit
console.log('\n=== FORMS & BUTTONS AUDIT ===');
const btnRegex = /<button\s+([^>]+)>/gi;
let btnCount = 0;
let btnsWithoutAriaOrText = [];
while ((match = btnRegex.exec(html)) !== null) {
  btnCount++;
  const attrs = match[1];
  const ariaLabel = attrs.match(/aria-label=["']([^"']+)["']/i);
  const ariaExpanded = attrs.match(/aria-expanded=["']([^"']+)["']/i);
  // checking if button has text inside or aria-label
}
console.log(`Total <button> elements: ${btnCount}`);

