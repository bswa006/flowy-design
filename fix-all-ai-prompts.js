const fs = require('fs');

// Read the original backup file
const content = fs.readFileSync('./docs/playbook.json.backup', 'utf8');

console.log('Fixing ALL ai_prompts sections in the JSON...');

// Function to properly escape strings for JSON
function escapeForJson(str) {
  return str
    .replace(/\\/g, '\\\\')    // Escape backslashes first
    .replace(/"/g, '\\"')      // Escape quotes  
    .replace(/\n/g, '\\n')     // Escape newlines
    .replace(/\r/g, '\\r')     // Escape carriage returns
    .replace(/\t/g, '\\t')     // Escape tabs
    .replace(/\f/g, '\\f')     // Escape form feeds
    .replace(/\b/g, '\\b');    // Escape backspaces
}

// Replace all content between quotes that contains newlines
let fixedContent = content;

// Find all string values that contain unescaped newlines and fix them
// Look for patterns like "key": "value with
// newlines"
const stringPattern = /"([^"]+)":\s*"([^"]*(?:\n[^"]*)*?)"/g;

fixedContent = fixedContent.replace(stringPattern, (match, key, value) => {
  // Only escape if the value contains actual newlines or quotes
  if (value.includes('\n') || value.includes('"') || value.includes('\\')) {
    const escapedValue = escapeForJson(value);
    return `"${key}": "${escapedValue}"`;
  }
  return match;
});

// Additional fix for string values that might span multiple lines  
// and might not be caught by the above pattern
const multilineStringPattern = /"([^"]+)":\s*"([^"]*)$/gm;

fixedContent = fixedContent.replace(multilineStringPattern, (match, key, partialValue, offset) => {
  // Find the closing quote for this string
  const searchStart = offset + match.length;
  const searchText = fixedContent.substring(searchStart);
  const closingQuoteIndex = searchText.indexOf('"');
  
  if (closingQuoteIndex !== -1) {
    const fullValue = partialValue + searchText.substring(0, closingQuoteIndex);
    const escapedValue = escapeForJson(fullValue);
    return `"${key}": "${escapedValue}"`;
  }
  
  return match;
});

// Try to parse and validate
try {
  JSON.parse(fixedContent);
  console.log('✅ JSON is now valid!');
  
  // Save the fixed file
  fs.writeFileSync('./docs/playbook.json', fixedContent);
  console.log('✅ Fixed file saved successfully!');
  
} catch (error) {
  console.log('❌ JSON still has errors:', error.message);
  console.log('Trying manual approach...');
  
  // Fall back to a more manual approach
  // Read the content line by line and fix obvious issues
  const lines = content.split('\n');
  const fixedLines = [];
  let inStringValue = false;
  let currentStringKey = '';
  let currentStringContent = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if we're starting a string value that might span multiple lines
    const stringStartMatch = line.match(/^(\s*)"([^"]+)":\s*"(.*)$/);
    if (stringStartMatch && !stringStartMatch[3].endsWith('"')) {
      // Starting a multi-line string
      inStringValue = true;
      currentStringKey = stringStartMatch[1] + '"' + stringStartMatch[2] + '": "';
      currentStringContent = stringStartMatch[3];
      continue;
    }
    
    if (inStringValue) {
      // Check if this line ends the string
      if (line.endsWith('",') || line.endsWith('"')) {
        // End of string
        currentStringContent += '\\n' + line.substring(0, line.lastIndexOf('"'));
        const escapedContent = escapeForJson(currentStringContent);
        const endChar = line.endsWith('",') ? '",' : '"';
        fixedLines.push(currentStringKey + escapedContent + endChar);
        inStringValue = false;
        currentStringKey = '';
        currentStringContent = '';
      } else {
        // Continue accumulating string content
        currentStringContent += '\\n' + line;
      }
    } else {
      // Regular line, just add it
      fixedLines.push(line);
    }
  }
  
  const manuallyFixedContent = fixedLines.join('\n');
  
  try {
    JSON.parse(manuallyFixedContent);
    console.log('✅ Manual fix succeeded!');
    fs.writeFileSync('./docs/playbook.json', manuallyFixedContent);
    console.log('✅ Manually fixed file saved!');
  } catch (error2) {
    console.log('❌ Manual fix also failed:', error2.message);
    fs.writeFileSync('./docs/playbook-debug.json', manuallyFixedContent);
    console.log('Saved debug file for inspection');
  }
}