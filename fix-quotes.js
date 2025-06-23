const fs = require('fs');
const path = require('path');

// Files that need quote fixes
const filesToFix = [
  './app/cards/page.tsx',
  './app/enterprise-demo/page.tsx',
  './app/flow-canvas-documentation/page.tsx',
  './app/mercury-flows/page.tsx',
  './app/page.tsx',
  './app/timeline-demo/page.tsx',
  './components/mercury/mercury-chat-module.tsx'
];

// Function to fix quotes in JSX
function fixQuotes(content) {
  // Replace unescaped single quotes in JSX text
  content = content.replace(/>(.*?)'/g, (match, p1) => {
    if (p1.includes('<')) return match; // Skip if contains JSX
    return match.replace(/'/g, '&apos;');
  });
  
  // Replace unescaped double quotes in JSX text
  content = content.replace(/>(.*?)"/g, (match, p1) => {
    if (p1.includes('<')) return match; // Skip if contains JSX
    return match.replace(/"/g, '&quot;');
  });
  
  // Fix specific known patterns
  content = content.replace(/Mercury's/g, 'Mercury&apos;s');
  content = content.replace(/"invisible"/g, '&quot;invisible&quot;');
  content = content.replace(/"until"/g, '&quot;until&quot;');
  content = content.replace(/"needed"/g, '&quot;needed&quot;');
  content = content.replace(/don't/g, 'don&apos;t');
  content = content.replace(/can't/g, 'can&apos;t');
  content = content.replace(/won't/g, 'won&apos;t');
  content = content.replace(/it's/g, 'it&apos;s');
  content = content.replace(/that's/g, 'that&apos;s');
  content = content.replace(/what's/g, 'what&apos;s');
  content = content.replace(/here's/g, 'here&apos;s');
  content = content.replace(/there's/g, 'there&apos;s');
  content = content.replace(/we're/g, 'we&apos;re');
  content = content.replace(/you're/g, 'you&apos;re');
  content = content.replace(/they're/g, 'they&apos;re');
  
  return content;
}

// Process each file
filesToFix.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`Fixing quotes in ${filePath}...`);
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixQuotes(content);
    fs.writeFileSync(filePath, fixedContent);
    console.log(`✅ Fixed ${filePath}`);
  } else {
    console.log(`⚠️  File not found: ${filePath}`);
  }
});

console.log('\n🎉 Quote fixing complete!');
console.log('Run "npm run lint" to verify the fixes.');

