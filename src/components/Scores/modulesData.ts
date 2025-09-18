import { Module } from './types/GameData';
import { modules as mainModules } from '../../data/modules';
import { syncMainModulesToScoreModules } from '../../utils/moduleSync';
import { moduleLockManager, setupModuleLocking } from '../../utils/moduleLockManager';

// Helper function to calculate module score based on levels
export const getModuleScore = (module: Module): number => {
  // Return 0 if module has no levels or levels is undefined
  if (!module.levels || module.levels.length === 0) {
    return 0;
  }

  const totalScore = module.levels.reduce((sum, level) => sum + level.score, 0);
  return Math.round(totalScore / module.levels.length);
};

/**
 * Get dynamic score modules that sync with main modules
 * @param userEmail - User email for conditional unlocking
 * @param additionalContext - Additional context for rule evaluation
 */
export function getDynamicScoreModules(
  userEmail?: string,
  additionalContext: Record<string, any> = {}
): Module[] {
  // Initialize the module locking system
  setupModuleLocking();
  
  const context = {
    user_email: userEmail,
    ...additionalContext
  };

  // Apply dynamic rules to main modules
  const processedMainModules = moduleLockManager.applyRules(mainModules, context);
  
  // Sync main modules to score modules
  const syncedScoreModules = syncMainModulesToScoreModules(processedMainModules);
  
  console.log('🔄 Dynamic Score Modules Update:');
  console.log('📧 User Email:', userEmail);
  console.log('🔗 Main Modules:', processedMainModules.map(m => `${m.id}:${m.status}`));
  console.log('✅ Score Modules:', syncedScoreModules.map(m => `${m.id}:${m.status}`));
  
  return syncedScoreModules;
}

// Static fallback modules (base configuration)
export const staticModules: Module[] = [
  {
    id: 1,
    status: 'locked'
  },
  {
    id: 2,
    status: 'locked'
  },
  {
    id: 3,
    status: 'locked'
  },
  {
    id: 4,
    status: 'locked'
  },
  {
    id: 5,
    status: 'locked'
  },
  {
    id: 6,
    status: 'locked'
  }
];

// Export dynamic modules as default export
// For backward compatibility, you can still import 'modules' but it will be static
// Use getDynamicScoreModules() for dynamic behavior
export const modules = staticModules;

