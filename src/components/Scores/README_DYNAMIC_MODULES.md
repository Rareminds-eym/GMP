# Dynamic Module System Documentation

## Overview
The module system now supports dynamic locking/unlocking based on user context (like email). The score modules automatically sync with the main modules configuration.

## Key Files
- **Main Modules**: `src/data/modules.ts` - Base configuration for main modules
- **Score Modules**: `src/components/Scores/modulesData.ts` - Now dynamically syncs with main modules
- **Dynamic Hooks**: `src/hooks/useLockedModules.ts` - React hooks for dynamic module management
- **Module Sync**: `src/utils/moduleSync.ts` - Synchronization logic between main and score modules
- **Lock Manager**: `src/utils/moduleLockManager.ts` - Rule-based dynamic locking system

## How It Works

### 1. Base Configuration
All modules start with the status defined in `modules.ts`:
```typescript
export const modules: Module[] = [
  { id: "1", status: 'locked', title: 'Introduction to GMP', progress: 0 },
  { id: "2", status: 'locked', title: 'Personal Hygiene' },
  // ... all locked by default
];
```

### 2. Dynamic Rules (Optional)
When a user email is provided, dynamic rules can override the base configuration:
```typescript
// Example rule: Unlock modules for hackathon user
moduleLockManager.addRule({
  id: 'hackathon_user_module_1',
  moduleId: '1',
  condition: {
    type: 'user_email',
    value: 'hackathon@example.com',
    operator: 'equals'
  },
  unlockAction: 'available'
});
```

### 3. Automatic Synchronization
Score modules automatically sync with main modules using the mapping:
- Main Module "1" → Score Module 1
- Main Module "2" → Score Module 2
- Main Module "3" → Score Module 3
- Main Module "4" → Score Module 4
- Main Module "HL1" → Score Module 5
- Main Module "HL2" → Score Module 6

Status mapping:
- 'locked' → 'locked'
- 'available' → 'unlocked'
- 'completed' → 'completed'

## Controlling Module Behavior

### Option 1: Respect Base Configuration (Current Setting)
```typescript
// In Score.tsx and useAvailableModules.ts
const userEmail = undefined; // No dynamic rules applied
```
Result: All modules will use exactly the status from `modules.ts`

### Option 2: Enable Dynamic Unlocking
```typescript
// In Score.tsx and useAvailableModules.ts
const userEmail = 'hackathon@example.com'; // Apply dynamic rules
```
Result: Modules will be unlocked based on the email-specific rules

### Option 3: Custom User Context
```typescript
// In Score.tsx
const userEmail = getUserEmailFromAuth(); // Get from actual authentication
const additionalContext = { progress: userProgress }; // Add more context
const modules = useLockedScoreModules(userEmail, additionalContext);
```

## Testing the System

### Current State (All Locked)
With `userEmail = undefined`:
- All main modules: locked
- All score modules: locked

### Hackathon User Test
With `userEmail = 'hackathon@example.com'`:
- Main modules 1 & HL2: available
- Score modules 1 & 6: unlocked
- All other modules: locked

## Usage Examples

### 1. Static Modules (No Dynamic Rules)
```typescript
// Use base configuration only
const modules = useLockedScoreModules(); // or useLockedScoreModules(undefined)
```

### 2. User-Specific Unlocking
```typescript
// Apply rules based on user
const modules = useLockedScoreModules(user.email);
```

### 3. Progressive Unlocking
```typescript
// Unlock based on progress
const modules = useLockedScoreModules(user.email, { 
  progress: userProgress,
  completedModules: userCompletedModules 
});
```

## Adding New Rules

To add new dynamic unlocking rules, modify `setupModuleLocking()` in `moduleLockManager.ts`:

```typescript
export function setupModuleLocking(): void {
  moduleLockManager.clearRules();
  
  // Add your custom rules here
  moduleLockManager.addRule({
    id: 'custom_rule_id',
    moduleId: 'TARGET_MODULE_ID',
    condition: {
      type: 'user_email', // or 'progress_based', 'time_based', 'custom'
      value: 'user@example.com',
      operator: 'equals' // or 'contains', 'greater_than', 'less_than'
    },
    unlockAction: 'available', // or 'completed'
    description: 'Custom rule description'
  });
}
```