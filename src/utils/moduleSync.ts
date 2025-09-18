import type { Module as MainModule } from '../types/module';
import type { Module as ScoreModule } from '../components/Scores/types/GameData';

/**
 * Module ID mapping between main modules and score modules
 */
export const MODULE_ID_MAPPING = {
  // Main module ID -> Score module ID
  '1': 1,
  '2': 2, 
  '3': 3,
  '4': 4,
  'HL1': 5,
  'HL2': 6
} as const;

/**
 * Status mapping between different module systems
 */
export const STATUS_MAPPING = {
  // Main module status -> Score module status
  'locked': 'locked' as const,
  'available': 'unlocked' as const,
  'completed': 'completed' as const
} as const;

/**
 * Convert main modules to score modules with proper ID and status mapping
 */
export function syncMainModulesToScoreModules(mainModules: MainModule[]): ScoreModule[] {
  // Create a map of main modules by ID for quick lookup
  const mainModuleMap = new Map<string, MainModule>();
  mainModules.forEach(module => {
    mainModuleMap.set(module.id, module);
  });

  // Generate score modules based on mapping
  const scoreModules: ScoreModule[] = [];
  
  // Iterate through all possible score module IDs (1-6)
  for (let scoreId = 1; scoreId <= 6; scoreId++) {
    // Find the corresponding main module
    const mainModuleId = Object.keys(MODULE_ID_MAPPING).find(
      key => MODULE_ID_MAPPING[key as keyof typeof MODULE_ID_MAPPING] === scoreId
    );
    
    if (mainModuleId) {
      const mainModule = mainModuleMap.get(mainModuleId);
      if (mainModule) {
        // Map the status from main module to score module
        const scoreStatus = STATUS_MAPPING[mainModule.status] || 'locked';
        
        scoreModules.push({
          id: scoreId,
          status: scoreStatus,
          // You can add other properties here as needed
          levels: [] // Empty for now, can be populated if needed
        });
      } else {
        // Main module not found, default to locked
        scoreModules.push({
          id: scoreId,
          status: 'locked',
          levels: []
        });
      }
    } else {
      // No mapping found, default to locked
      scoreModules.push({
        id: scoreId,
        status: 'locked',
        levels: []
      });
    }
  }
  
  return scoreModules;
}

/**
 * Get reverse mapping (Score module ID -> Main module ID)
 */
export function getMainModuleIdFromScoreId(scoreId: number): string | undefined {
  return Object.keys(MODULE_ID_MAPPING).find(
    key => MODULE_ID_MAPPING[key as keyof typeof MODULE_ID_MAPPING] === scoreId
  );
}

/**
 * Get score module ID from main module ID
 */
export function getScoreModuleIdFromMainId(mainId: string): number | undefined {
  return MODULE_ID_MAPPING[mainId as keyof typeof MODULE_ID_MAPPING];
}

/**
 * Debug function to show current mappings
 */
export function debugModuleMappings(mainModules: MainModule[], scoreModules: ScoreModule[]): void {
  console.log('🔍 Module Mapping Debug:');
  console.log('📋 Main Modules:', mainModules.map(m => `${m.id}:${m.status}`));
  console.log('🎯 Score Modules:', scoreModules.map(m => `${m.id}:${m.status}`));
  console.log('🔗 Mappings:');
  Object.entries(MODULE_ID_MAPPING).forEach(([mainId, scoreId]) => {
    const mainModule = mainModules.find(m => m.id === mainId);
    const scoreModule = scoreModules.find(m => m.id === scoreId);
    console.log(`   ${mainId}(${mainModule?.status || 'N/A'}) -> ${scoreId}(${scoreModule?.status || 'N/A'})`);
  });
}