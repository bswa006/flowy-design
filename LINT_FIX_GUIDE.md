# Lint Fix Guide

⚠️ **NEVER run automated scripts to fix unused variables by adding underscores!**

This causes JavaScript runtime errors because it creates variable reference mismatches.

## ✅ Proper Way to Fix Unused Variables

### 1. Truly Unused Variables
**Fix:** Remove them entirely
```typescript
// ❌ BAD: Adding underscore
const _unusedVar = someValue;

// ✅ GOOD: Remove it
// (remove the line entirely)
```

### 2. Variables That Should Be Used
**Fix:** Use them properly
```typescript
// ❌ BAD: Ignoring the warning
const data = fetchData();
// data never used

// ✅ GOOD: Use it
const data = fetchData();
console.log(data);
```

### 3. Required Parameters You Don't Need
**Fix:** Only prefix with _ if required by API
```typescript
// ✅ GOOD: Parameter required by React but not used
onClick={(_event) => {
  // event not needed
  doSomething();
}}

// ❌ BAD: Using different names
onClick={(_event) => {
  event.preventDefault(); // ReferenceError!
}}
```

## 🚨 Red Flags - These Cause Runtime Errors

- `(_param) => { param.something }` - Mismatch!
- `const _var = value; console.log(var);` - Mismatch!
- `map((_item) => ({ id: item.id }))` - Mismatch!

## 🛠️ Safe Lint Fix Process

1. **Read the error** - understand what variable is unused
2. **Check if it's needed** - look at the code context
3. **Choose the right fix:**
   - Remove if truly unused
   - Use if it should be used  
   - Prefix with _ only if required but unused
4. **Test the change** - make sure no runtime errors

## 📋 Manual Review Checklist

- [ ] No variable name mismatches (`_param` vs `param`)
- [ ] All imports are used or removed
- [ ] Function parameters match their usage
- [ ] No ReferenceErrors in browser console
- [ ] App runs without JavaScript errors

---

**Remember:** Lint warnings are guides, not laws. The goal is working, maintainable code!

