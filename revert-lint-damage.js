#!/usr/bin/env node

/**
 * Script to revert damage caused by automated lint fixes
 * and properly handle unused variables
 */

const fs = require('fs');
const path = require('path');

// Files that were damaged by the lint fix script
const problematicFiles = [
  'hooks/useTimelineData.ts',
  'components/mercury/mercury-uploads-timeline.tsx',
  'components/mercury/mercury-module-card.tsx', 
  'components/mercury/mercury-housing-module.tsx',
  'components/mercury/mercury-chat-module.tsx',
  'components/mercury/mercury-add-module-bubble.tsx',
  'components/mercury/mercury-context-card.tsx',
  'components/mercury/mercury-dashboard-card.tsx',
  'components/mercury/mercury-draggable-action.tsx',
  'components/mercury/mercury-editable-field.tsx',
  'components/mercury/mercury-flow-canvas.tsx',
  'components/mercury/mercury-flow-cards.tsx',
  'components/mercury/mercury-wysiwyg-editor.tsx',
  'components/mercury/location-card.tsx',
  'components/mercury/message-card.tsx',
  'components/mercury/music-card.tsx',
  'components/mercury/product-card.tsx',
  'app/workflow/EditableCard.tsx',
  'app/workflow/MainCard.tsx',
  'app/workflow/OldWorkflowPage.tsx'
];

// Common fixes to apply
const fixes = [
  // Fix parameter mismatches
  { from: /\(_([a-zA-Z]+)\)\s*=>\s*{([^}]*?)\b\1\b/g, to: '($1) => {$2$1' },
  
  // Fix map parameter issues
  { from: /\.map\(\(_([a-zA-Z]+)\)\s*=>\s*\{([^}]*?)\b\1\b/g, to: '.map(($1) => {$2$1' },
  { from: /\.map\(\(_([a-zA-Z]+)\)\s*=>\s*\(([^)]*)\b\1\b/g, to: '.map(($1) => ($2$1' },
  
  // Fix common variable reference patterns
  { from: /_context\)\s*=>\s*\({[^}]*context\./g, to: match => match.replace('_context', 'context') },
  { from: /_focusLevel(?![a-zA-Z0-9_])/g, to: 'focusLevel' },
  { from: /_e\)\s*=>\s*{[^}]*\be\./g, to: match => match.replace('_e)', 'e)') },
  
  // Fix unused variable declarations (remove underscore if variable is used)
  { from: /const\s+_([a-zA-Z]+)\s*=[^;]+;([\s\S]*?)\b\1\b/g, to: 'const $1 = $2$1' },
  { from: /let\s+_([a-zA-Z]+)\s*=[^;]+;([\s\S]*?)\b\1\b/g, to: 'let $1 = $2$1' },
];

// Process each file
problematicFiles.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  const originalContent = content;
  
  // Apply fixes
  fixes.forEach(fix => {
    content = content.replace(fix.from, fix.to);
  });
  
  // Write back if changed
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
  } else {
    console.log(`🔍 No changes needed: ${filePath}`);
  }
});

console.log('\n🎯 Revert completed! Please run npm run lint to check remaining issues.');
console.log('\n💡 For remaining unused variables, either:');
console.log('   - Remove them if truly unused');
console.log('   - Use them if they should be used');
console.log('   - Prefix with _ only if required by API but unused');

