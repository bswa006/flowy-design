const fs = require('fs');
const path = require('path');

// Function to add underscore prefix to unused variables
function fixUnusedVars(content, filePath) {
  console.log(`Processing: ${filePath}`);
  
  // Remove specific unused imports
  if (filePath.includes('flow-canvas-documentation')) {
    content = content.replace(/ChevronDown,\s*/, '');
  }
  
  if (filePath.includes('mercury-contextual-demo')) {
    content = content.replace(/const cardsCreated/g, 'const _cardsCreated');
  }
  
  if (filePath.includes('EditableCard.tsx')) {
    content = content.replace(/isActive = false/g, '_isActive = false');
  }
  
  if (filePath.includes('OldWorkflowPage.tsx')) {
    content = content.replace(/isExpanded,/g, '_isExpanded,');
  }
  
  if (filePath.includes('enhanced-email-card.tsx')) {
    content = content.replace(/onMarkAsRead,/g, '_onMarkAsRead,');
    content = content.replace(/, index\)/, ', _index)');
  }
  
  // Fix calendar-card.tsx
  if (filePath.includes('calendar-card.tsx')) {
    content = content.replace(/Clock,\s*/, '');
  }
  
  // Fix email-card.tsx
  if (filePath.includes('email-card.tsx')) {
    content = content.replace(/Archive,\s*/, '');
    content = content.replace(/Star,\s*/, '');
    content = content.replace(/preview,/g, '_preview,');
  }
  
  // Remove unused mercury imports from various files
  const mercuryImportsToRemove = [
    'MERCURY_ANIMATIONS',
    'MERCURY_RADIUS', 
    'getMercuryFocusClasses',
    'getMercuryStatusColors',
    'getMercuryTypography',
    'MERCURY_COMPONENT_PADDING',
    'getMercuryAccentBar'
  ];
  
  mercuryImportsToRemove.forEach(importName => {
    content = content.replace(new RegExp(`\\s*${importName},?`, 'g'), '');
    content = content.replace(new RegExp(`${importName},\\s*`, 'g'), '');
  });
  
  // Fix unused parameters with underscore prefix
  const parameterReplacements = [
    { from: /variant\)/g, to: '_variant)' },
    { from: /percentage\s*=/g, to: '_percentage =' },
    { from: /onCall\)/g, to: '_onCall)' },
    { from: /onNext\)/g, to: '_onNext)' },
    { from: /onPrevious\)/g, to: '_onPrevious)' },
    { from: /focusLevel\)/g, to: '_focusLevel)' },
    { from: /context\)/g, to: '_context)' },
    { from: /trimmedText/g, to: '_trimmedText' },
    { from: /wuWeiSlowEasing/g, to: '_wuWeiSlowEasing' },
    { from: /wuWeiSpringEasing/g, to: '_wuWeiSpringEasing' },
    { from: /animateLayoutChange/g, to: '_animateLayoutChange' },
    { from: /dragPreview/g, to: '_dragPreview' },
    { from: /dragPosition/g, to: '_dragPosition' },
    { from: /isValidDrop/g, to: '_isValidDrop' },
    { from: /canvasRef/g, to: '_canvasRef' },
    { from: /event,\s*info/g, to: '_event, _info' },
    { from: /style\)/g, to: '_style)' },
    { from: /e\)\s*=>/g, to: '_e) =>' }
  ];
  
  parameterReplacements.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });
  
  // Remove unused React imports
  content = content.replace(/useEffect,\s*/, '');
  content = content.replace(/useRef,\s*/, '');
  content = content.replace(/useCallback,\s*/, '');
  content = content.replace(/motion,\s*/, '');
  content = content.replace(/Send,\s*/, '');
  content = content.replace(/Heart,\s*/, '');
  content = content.replace(/Mic,\s*/, '');
  content = content.replace(/Calendar,\s*/, '');
  content = content.replace(/MapPin,\s*/, '');
  content = content.replace(/cn,\s*/, '');
  
  // Fix unused variable assignments
  content = content.replace(/const listingVariants/g, 'const _listingVariants');
  content = content.replace(/const INSIGHT_STYLES/g, 'const _INSIGHT_STYLES');
  
  // Clean up empty import lines
  content = content.replace(/import\s*{\s*}\s*from.*?;\n/g, '');
  content = content.replace(/import\s*{\s*,\s*}\s*from.*?;\n/g, '');
  
  return content;
}

// Get all TypeScript/React files
function getAllTSXFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.next')) {
      getAllTSXFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Process all files
const allFiles = getAllTSXFiles('.');
const filesToProcess = allFiles.filter(f => 
  !f.includes('node_modules') && 
  !f.includes('.next') &&
  !f.includes('fix-') &&
  !f.includes('test-') &&
  !f.includes('debug-')
);

console.log(`Found ${filesToProcess.length} files to process...\n`);

filesToProcess.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const fixedContent = fixUnusedVars(content, filePath);
  
  if (content !== fixedContent) {
    fs.writeFileSync(filePath, fixedContent);
    console.log(`✅ Fixed unused variables in ${filePath}`);
  }
});

console.log('\n🎉 Unused variable fixing complete!');

