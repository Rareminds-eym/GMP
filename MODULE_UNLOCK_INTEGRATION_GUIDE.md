# Module Unlock Integration Guide

This guide explains how the `@module.sql` database functions have been integrated with `@ModuleNode.tsx` to enable dynamic module unlocking functionality.

## Overview

The integration provides:
1. **Module Click Handling**: Automatically creates/updates module progress records when modules are clicked
2. **Level Completion Tracking**: Detects when the last level in a module is completed
3. **Automatic Module Unlocking**: Unlocks the next module when the current module is completed
4. **Database Synchronization**: Ensures all progress is stored in the `module_progress` table

## Files Created/Modified

### New Files
- `src/services/moduleUnlockService.ts` - Core service for module unlock functionality
- `src/hooks/useModuleUnlock.ts` - React hook for module unlock operations
- `src/utils/levelCompletionHandler.ts` - Utility functions for level completion handling

### Modified Files
- `src/components/modules/ModuleNode.tsx` - Added module click handling and loading states
- `src/components/modules/ModuleMap.tsx` - Added support for module unlock callbacks

## How It Works

### 1. Module Click Flow

When a user clicks on a module:

```typescript
// In ModuleNode.tsx
const handleClick = async () => {
  if (module.status === 'available' || module.status === 'completed') {
    // Handle module click to ensure database record exists
    const result = await handleModuleClick(parseInt(module.id));
    
    if (result.success) {
      // Navigate to module
      onSelect?.(parseInt(module.id));
    }
  }
};
```

**What happens:**
1. Checks if module is unlocked using `is_module_unlocked()` SQL function
2. Gets total levels for the module using `get_module_total_levels()` SQL function
3. Creates or updates a record in `module_progress` table with:
   - `user_id`: Current user
   - `module_id`: Selected module
   - `total_levels`: Retrieved from module config
   - `is_completed`: false (initially)

### 2. Level Completion Flow

When a level is completed, call the level completion handler:

```typescript
import { handleLevelCompletion } from '../utils/levelCompletionHandler';

// In your level completion logic
const result = await handleLevelCompletion(userId, moduleId, levelId);

if (result.success && result.moduleCompleted) {
  console.log(`Module ${moduleId} completed!`);
  
  if (result.nextModuleUnlocked) {
    console.log(`Module ${result.nextModuleId} unlocked!`);
  }
}
```

**What happens:**
1. Checks if the completed level is the last level in the module
2. If it's the last level, calls `complete_module()` SQL function which:
   - Marks current module as completed (`is_completed = true`)
   - Creates a new record for the next module (if it exists)
   - Sets the next module as unlocked but not completed

### 3. Database Schema

The integration uses the `module_progress` table:

```sql
CREATE TABLE module_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id integer NOT NULL,
  total_levels integer NOT NULL,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, module_id)
);
```

## Usage Examples

### 1. Basic Module Click Handling

The ModuleNode component automatically handles module clicks:

```tsx
<ModuleNode
  module={module}
  onSelect={(id) => navigate(`/modules/${id}`)}
  isCurrentModule={module.id === currentModuleId}
  onModuleUnlocked={(moduleId) => {
    console.log(`Module ${moduleId} was unlocked!`);
    // Refresh module list or update UI
  }}
/>
```

### 2. Level Completion in Game Components

In your level/game completion logic:

```typescript
import { handleLevelCompletion } from '../utils/levelCompletionHandler';
import { useAuth } from '../contexts/AuthContext';

const YourGameComponent = () => {
  const { user } = useAuth();
  
  const onLevelComplete = async (levelId: number) => {
    if (!user?.id) return;
    
    const moduleId = getCurrentModuleId(); // Your logic to get current module
    
    const result = await handleLevelCompletion(user.id, moduleId, levelId);
    
    if (result.success) {
      if (result.moduleCompleted) {
        // Show module completion celebration
        showModuleCompletionModal();
        
        if (result.nextModuleUnlocked) {
          // Show next module unlock notification
          showNextModuleUnlockedNotification(result.nextModuleId);
        }
      }
    } else {
      console.error('Level completion failed:', result.message);
    }
  };
};
```

### 3. Manual Module Completion

If you need to manually mark a module as completed:

```typescript
import { handleModuleCompletion } from '../utils/levelCompletionHandler';

const result = await handleModuleCompletion(userId, moduleId);

if (result.success && result.nextModuleUnlocked) {
  console.log(`Next module ${result.nextModuleId} unlocked!`);
}
```

### 4. Check Module Progress

To get user's current module progress:

```typescript
import { useModuleUnlock } from '../hooks/useModuleUnlock';

const YourComponent = () => {
  const { getUserModuleProgress } = useModuleUnlock();
  
  const checkProgress = async () => {
    const result = await getUserModuleProgress();
    
    if (result.success) {
      console.log('User progress:', result.data);
    }
  };
};
```

## SQL Functions Used

The integration leverages these SQL functions from `module.sql`:

- `is_module_unlocked(user_id, module_id)` - Check if module is unlocked
- `get_module_total_levels(module_id)` - Get total levels for a module
- `complete_module(user_id, module_id)` - Mark module as completed and unlock next
- `initialize_user_progress(user_id)` - Initialize Module 1 for new users
- `get_comprehensive_user_progress(user_id)` - Get all user progress

## Error Handling

The integration includes comprehensive error handling:

```typescript
const result = await handleModuleClick(moduleId);

if (!result.success) {
  switch (result.error?.code) {
    case 'MODULE_LOCKED':
      showMessage('This module is locked. Complete the previous module first.');
      break;
    case 'USER_NOT_AUTHENTICATED':
      redirectToLogin();
      break;
    default:
      showMessage('An error occurred. Please try again.');
  }
}
```

## Best Practices

1. **Always check authentication** before calling module unlock functions
2. **Handle loading states** when processing module clicks
3. **Provide user feedback** for module unlock events
4. **Call level completion handler** at the end of each level
5. **Initialize user progress** for new users

## Troubleshooting

### Common Issues

1. **Module not unlocking**: Check if the SQL functions are properly installed in your database
2. **User not authenticated**: Ensure user is logged in before calling unlock functions
3. **Database errors**: Check Supabase logs for RLS policy issues

### Debug Mode

Enable debug logging by checking the browser console. All module unlock operations log their progress and results.

## Integration Checklist

- [ ] SQL functions from `module.sql` are installed in Supabase
- [ ] RLS policies are properly configured
- [ ] Module config table exists with total_levels data
- [ ] ModuleNode components use the new unlock functionality
- [ ] Level completion handlers are integrated in game components
- [ ] Error handling is implemented
- [ ] User feedback for module unlocks is added

## Next Steps

1. Test the integration with different user scenarios
2. Add visual feedback for module unlock events
3. Implement progress persistence across sessions
4. Add analytics tracking for module completion rates