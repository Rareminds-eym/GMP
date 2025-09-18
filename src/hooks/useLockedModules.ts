import { useMemo } from 'react';
import { modules as staticMainModules } from '../data/modules';
import { modules as staticScoreModules } from '../components/Scores/modulesData';
import { moduleLockManager, setupModuleLocking } from '../utils/moduleLockManager';
import { syncMainModulesToScoreModules } from '../utils/moduleSync';
import type { Module as MainModule } from '../types/module';
import type { Module as ScoreModule } from '../components/Scores/types/GameData';

/**
 * Hook to get dynamically locked main modules
 * @param userEmail - User email for conditional locking
 * @param additionalContext - Additional context for rule evaluation
 */
export function useLockedMainModules(
  userEmail?: string, 
  additionalContext: Record<string, any> = {}
): MainModule[] {
  return useMemo(() => {
    // If no userEmail is provided, return the base modules as-is (no dynamic rules applied)
    if (!userEmail) {
      console.log('🔒 No user email provided - using base module configuration');
      console.log('📋 Base Modules:', staticMainModules.map(m => `${m.id}:${m.status}`));
      return staticMainModules;
    }
    
    // Initialize the module locking system
    setupModuleLocking();
    
    const context = {
      user_email: userEmail,
      ...additionalContext
    };

    // Apply dynamic rules to main modules
    const processedModules = moduleLockManager.applyRules(staticMainModules, context);
    
    console.log('🔑 Dynamic Main Modules Processing:');
    console.log('📧 User Email:', userEmail);
    console.log('📋 Original Modules:', staticMainModules.map(m => `${m.id}:${m.status}`));
    console.log('✅ Processed Modules:', processedModules.map(m => `${m.id}:${m.status}`));
    
    return processedModules;
  }, [userEmail, additionalContext]);
}

/**
 * Hook to get dynamically locked score modules
 * Automatically syncs with main modules
 * @param userEmail - User email for conditional locking
 * @param additionalContext - Additional context for rule evaluation
 */
export function useLockedScoreModules(
  userEmail?: string,
  additionalContext: Record<string, any> = {}
): ScoreModule[] {
  const mainModules = useLockedMainModules(userEmail, additionalContext);
  
  return useMemo(() => {
    // Sync main modules to score modules
    const syncedScoreModules = syncMainModulesToScoreModules(mainModules);
    
    console.log('🎯 Dynamic Score Modules Processing:');
    console.log('🔗 Synced from Main Modules:', mainModules.map(m => `${m.id}:${m.status}`));
    console.log('✅ Score Modules Result:', syncedScoreModules.map(m => `${m.id}:${m.status}`));
    
    return syncedScoreModules;
  }, [mainModules]);
}

/**
 * Hook to get both main and score modules together
 * @param userEmail - User email for conditional locking
 * @param additionalContext - Additional context for rule evaluation
 */
export function useAllDynamicModules(
  userEmail?: string,
  additionalContext: Record<string, any> = {}
) {
  const mainModules = useLockedMainModules(userEmail, additionalContext);
  const scoreModules = useLockedScoreModules(userEmail, additionalContext);
  
  return {
    mainModules,
    scoreModules
  };
}