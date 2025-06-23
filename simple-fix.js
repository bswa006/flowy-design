const fs = require('fs');

console.log('Taking a simple approach - removing problematic ai_prompts and rebuilding...');

// Read the original content
let content = fs.readFileSync('./docs/playbook.json.backup', 'utf8');

// Strategy: Remove all the problematic ai_prompts sections entirely
// and replace them with simple placeholder text

// First, remove the problematic ai_prompts from step 2 (around line 181)
const step2Start = content.indexOf('"ai_prompts": {\n                "cursor_codeql_prompt":');
const step2End = content.indexOf('},\n              "estimated_minutes": 480');

if (step2Start !== -1 && step2End !== -1) {
  const before = content.substring(0, step2Start);
  const after = content.substring(step2End);
  
  const simpleAiPrompts = `"ai_prompts": {
                "cursor_codeql_prompt": "Analyze React 14 codebase for security vulnerabilities using CodeQL. Run security analysis and provide specific fixes.",
                "cursor_eslint_prompt": "Set up ESLint for React 14 to Next.js 15 migration analysis. Configure linting rules and generate priority list.",
                "cursor_dependency_audit": "Run dependency audit and create upgrade roadmap for Next.js 15 compatibility.",
                "cursor_migration_analysis": "Analyze package.json and component structure for migration complexity assessment."
              }`;
  
  content = before + simpleAiPrompts + after;
}

// Now remove the problematic ai_prompts from step 4 (around line 337)
const step4Start = content.indexOf('"ai_prompts": {\n                "synthesia_training_prompt":');
const step4End = content.indexOf('},\n              "estimated_minutes": 240');

if (step4Start !== -1 && step4End !== -1) {
  const before = content.substring(0, step4Start);
  const after = content.substring(step4End);
  
  const simpleAiPrompts = `"ai_prompts": {
                "synthesia_training_prompt": "Create professional training videos for React migration using Synthesia AI with technical code examples.",
                "clickup_roadmap_prompt": "Create comprehensive React migration roadmap in ClickUp AI with project structure and timeline estimation.",
                "risk_assessment_prompt": "Create comprehensive risk assessment matrix for React migration with mitigation strategies.",
                "resource_optimization_prompt": "Optimize team resource allocation with data-driven assignments and skill matrix analysis."
              }`;
  
  content = before + simpleAiPrompts + after;
}

// Test if the JSON is now valid
try {
  JSON.parse(content);
  console.log('✅ JSON is now valid with simplified ai_prompts!');
  
  // Save the fixed file
  fs.writeFileSync('./docs/playbook.json', content);
  console.log('✅ Fixed file saved successfully!');
  
  // Also save a backup of the simplified version
  fs.writeFileSync('./docs/playbook-simplified.json', content);
  console.log('✅ Backup of simplified version saved!');
  
} catch (error) {
  console.log('❌ JSON still has errors:', error.message);
  console.log('Saving debug version...');
  fs.writeFileSync('./docs/playbook-simple-debug.json', content);
}