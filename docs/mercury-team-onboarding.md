# Mercury Design System - Team Onboarding Guide
## Ensuring 100% Compliance Across Your Development Team

Welcome to the Mercury Design System! This guide will get every developer on your team producing 10/10 enterprise-grade components that maintain perfect consistency with our established standards.

---

## 🚀 Quick Start (5 Minutes)

### 1. **Install Mercury Tools**
```bash
# Install dependencies
npm install

# Add Mercury component generator to package.json scripts
echo '"mercury:create": "node scripts/generate-mercury-component.js"' >> package.json

# Set up Mercury linting
cp .eslintrc.mercury.json .eslintrc.json
```

### 2. **Create Your First Mercury Component**
```bash
npm run mercury:create MyDashboardCard
```

### 3. **Test Mercury Compliance**
```bash
npm run lint:mercury
npm test
```

---

## 📚 Essential Reading (Required)

Every team member **MUST** read these documents before writing any code:

1. **[Mercury Design System Standards](./mercury-design-system-standards.md)** - The complete specification
2. **[Mercury Tokens Documentation](../flowy-cards/lib/mercury-tokens.ts)** - Design tokens and utilities
3. **[Enterprise Dashboard Example](../flowy-cards/components/mercury/enterprise-dashboard-card.tsx)** - The gold standard reference

---

## 🎯 The Mercury Mindset

### **Core Philosophy: "Fluid, Focused, Familiar"**

Before writing any component, ask yourself:

- **Fluid**: Are my animations natural and smooth?
- **Focused**: Does my component respect the focus hierarchy?
- **Familiar**: Will users immediately understand this interface?

### **The Golden Rules (Never Break These)**

1. **ONE focused element per view** - Mercury selective contrast is sacred
2. **Status trumps aesthetics** - Critical information must be visible
3. **Accessibility is non-negotiable** - WCAG 2.1 AAA compliance always
4. **Intent props are required** - Every component needs a data-intent
5. **Natural animations only** - Use Mercury easing curves

---

## 🛠️ Development Workflow

### **Every Component Must Follow This Process:**

#### **Step 1: Generate Component**
```bash
npm run mercury:create ComponentName
```

#### **Step 2: Customize Implementation**
- Update the interface with your specific props
- Modify the Component Content section
- Keep all Mercury compliance requirements intact

#### **Step 3: Test Focus Hierarchy**
```jsx
// Test all three states
<ComponentName focusLevel="focused" {...props} />
<ComponentName focusLevel="ambient" {...props} />  
<ComponentName focusLevel="fog" {...props} />
```

#### **Step 4: Validate Accessibility**
- Run screen reader test
- Check keyboard navigation (Tab, Enter, Space)
- Verify ARIA attributes are correct

#### **Step 5: Performance Check**
- Ensure 60fps animations
- Validate transform-gpu usage
- Test on slower devices

#### **Step 6: Mercury Compliance Audit**
Use this checklist before every commit:

```markdown
- [ ] Component has intent prop
- [ ] data-intent attribute present  
- [ ] Supports focused/ambient/fog states
- [ ] Status communication uses color, not contrast violation
- [ ] Typography follows focus-based scaling
- [ ] Animations use natural easing
- [ ] Accessibility attributes complete
- [ ] No focus hierarchy violations
```

---

## 🔧 Development Tools

### **Mercury Component Generator**
```bash
# Generate new component
npm run mercury:create ProductCard

# Output includes:
# ✅ Complete Mercury-compliant component
# ✅ TypeScript interfaces  
# ✅ Accessibility implementation
# ✅ Focus hierarchy support
# ✅ Status communication system
```

### **Mercury Linting**
```bash
# Check Mercury compliance
npm run lint:mercury

# Auto-fix where possible  
npm run lint:mercury --fix
```

### **Mercury Design Tokens**
```jsx
import { 
  getMercuryFocusClasses,
  getMercuryStatusColors,
  getMercuryTypography,
  validateMercuryProps
} from '@/lib/mercury-tokens'

// Always use Mercury tokens instead of hardcoded values
const focusClasses = getMercuryFocusClasses('focused')
const statusColors = getMercuryStatusColors('warning')
```

---

## 🚦 Code Review Requirements

### **Every PR Must Include:**

1. **Mercury Compliance Screenshot** - Show focused/ambient/fog states
2. **Accessibility Testing Video** - Screen reader + keyboard navigation  
3. **Performance Metrics** - 60fps confirmation, no layout shift
4. **Linting Passed** - Zero Mercury compliance warnings

### **Review Checklist Template**
```markdown
## Mercury Design Review ✨

### Visual Hierarchy ✅
- [ ] Focus hierarchy clearly visible (focused → ambient → fog)
- [ ] Only ONE focused element at a time
- [ ] Status communication respects hierarchy

### Enterprise Standards ✅  
- [ ] Component follows Mercury typography scaling
- [ ] Status warnings/errors impossible to miss
- [ ] Enterprise-appropriate professional appearance

### Technical Implementation ✅
- [ ] Intent prop and data-intent attribute present
- [ ] Mercury design tokens used throughout
- [ ] Natural animation easing (no jarring motion)
- [ ] Transform-gpu used for smooth animations

### Accessibility ✅
- [ ] WCAG 2.1 AAA compliant
- [ ] Screen reader friendly
- [ ] Keyboard navigation support
- [ ] Proper ARIA attributes

### Performance ✅
- [ ] 60fps animations confirmed
- [ ] No layout shifts or jank
- [ ] Respects prefers-reduced-motion
```

---

## 🎓 Training Exercises

### **Exercise 1: Focus Hierarchy** ⭐
Create a dashboard with 5 cards. Implement focus management so users can cycle through focused states. Validate that ambient/fog cards remain readable but de-emphasized.

### **Exercise 2: Status Communication** ⭐⭐
Build a KPI card that shows warning/critical states. Ensure the status is visible in ALL focus levels (focused/ambient/fog) without breaking Mercury hierarchy.

### **Exercise 3: Accessibility Champion** ⭐⭐⭐
Create a complex component and test it with:
- VoiceOver (Mac) or NVDA (Windows)
- Keyboard-only navigation
- High contrast mode
- Reduced motion preferences

---

## 🚨 Common Mistakes & How to Avoid Them

### **❌ Anti-Pattern: Multiple Focused Elements**
```jsx
// WRONG - breaks Mercury selective contrast
<Card focusLevel="focused" />
<Card focusLevel="focused" />
<Card focusLevel="focused" />
```

```jsx
// CORRECT - one star at a time
<Card focusLevel="focused" />
<Card focusLevel="ambient" />
<Card focusLevel="fog" />
```

### **❌ Anti-Pattern: Breaking Status Visibility**
```jsx
// WRONG - warning invisible in fog state
<Card 
  focusLevel="fog" 
  status="critical"
  className="opacity-30" // Makes critical info invisible!
/>
```

```jsx
// CORRECT - status overrides fog opacity
<Card 
  focusLevel="fog" 
  status="critical" 
  // Mercury automatically ensures visibility
/>
```

### **❌ Anti-Pattern: Hardcoded Values**
```jsx
// WRONG - breaks design system consistency
<div className="text-4xl text-red-500 scale-110">
```

```jsx
// CORRECT - uses Mercury tokens
<div className={cn(
  getMercuryTypography('focused', 'compact'),
  getMercuryStatusColors('critical').text,
  getMercuryFocusClasses('focused').scale
)}>
```

---

## 📊 Success Metrics

### **Team Readiness Checklist**

- [ ] **100% of developers** have completed Mercury onboarding
- [ ] **Zero Mercury linting errors** in CI/CD pipeline
- [ ] **95%+ accessibility score** on all components (Lighthouse)
- [ ] **Consistent component quality** across team members
- [ ] **Sub-100ms interaction times** for all Mercury components

### **Quality Gates**

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Focus Hierarchy Compliance** | 100% | Automated linting |
| **Accessibility Score** | 95%+ | Lighthouse CI |
| **Animation Performance** | 60fps | Chrome DevTools |
| **Design Consistency** | 100% | Visual regression tests |
| **Code Review Approval** | 100% | Require Mercury checklist completion |

---

## 🆘 Getting Help

### **Mercury Support Channels**

- **Design System Questions**: `#mercury-design-system`
- **Implementation Help**: `#mercury-dev-support` 
- **Accessibility Issues**: `#mercury-accessibility`
- **Performance Optimization**: `#mercury-performance`

### **Emergency Contacts**

- **Mercury System Lead**: [Your Team Lead]
- **Accessibility Expert**: [A11y Specialist]
- **Performance Engineer**: [Performance Expert]

---

## 🎉 Graduation Requirements

To be certified as a Mercury Developer, complete:

1. ✅ **Read all documentation** (Mercury standards + tokens)
2. ✅ **Complete training exercises** (all 3 levels)  
3. ✅ **Build one component** using Mercury generator
4. ✅ **Pass code review** with perfect Mercury compliance
5. ✅ **Demonstrate accessibility** testing skills

**Upon completion, you'll be authorized to:**
- Review Mercury components
- Mentor new team members  
- Contribute to Mercury system evolution
- Ship enterprise-grade components with confidence

---

*Remember: Mercury isn't just a design system—it's a commitment to excellence. Every component you build represents the quality standard of our entire organization.*

---

## 🔗 Quick Links

- **[Mercury Standards](./mercury-design-system-standards.md)** - Complete specification
- **[Design Tokens](../flowy-cards/lib/mercury-tokens.ts)** - All Mercury constants
- **[Component Generator](../scripts/generate-mercury-component.js)** - Auto-generation tool
- **[Linting Rules](./.eslintrc.mercury.json)** - Compliance enforcement
- **[Gold Standard Example](../flowy-cards/components/mercury/enterprise-dashboard-card.tsx)** - Perfect implementation

---

Welcome to Mercury! 🚀 Let's build exceptional user experiences together. 