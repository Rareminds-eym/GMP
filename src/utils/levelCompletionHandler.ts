import { ModuleUnlockService } from '../services/moduleUnlockService';

/**
 * Utility function to handle level completion and check for module completion
 * This should be called whenever a level is completed in any module
 */
export async function handleLevelCompletion(
  userId: string,
  moduleId: number,
  levelId: number
): Promise<{
  success: boolean;
  message: string;
  moduleCompleted?: boolean;
  nextModuleUnlocked?: boolean;
  nextModuleId?: number;
  error?: any;
}> {
  try {
    console.log('Level completion handler called:', { userId, moduleId, levelId });

    // Use the ModuleUnlockService to handle level completion
    const result = await ModuleUnlockService.handleLevelCompletion(userId, moduleId, levelId);

    if (!result.success) {
      console.error('Level completion failed:', result.message);
      return {
        success: false,
        message: result.message,
        error: result.error
      };
    }

    const moduleCompleted = result.data?.moduleCompleted || false;
    const nextModuleUnlocked = result.data?.nextModuleUnlocked || false;
    const nextModuleId = result.data?.nextModuleId || null;

    console.log('Level completion result:', {
      moduleCompleted,
      nextModuleUnlocked,
      nextModuleId
    });

    console.log('DEBUG: Checking conditions for console.log:', {
      moduleCompleted,
      nextModuleUnlocked,
      bothTrue: moduleCompleted && nextModuleUnlocked,
      resultData: result.data
    });

    // Add the requested console.log when module is completed and next module is opened
    if (moduleCompleted && nextModuleUnlocked) {
      console.log("Completed next module is opened");
    }

    return {
      success: true,
      message: result.message,
      moduleCompleted,
      nextModuleUnlocked,
      nextModuleId
    };

  } catch (error) {
    console.error('Error in level completion handler:', error);
    return {
      success: false,
      message: 'An unexpected error occurred during level completion',
      error
    };
  }
}

/**
 * Utility function to manually complete a module
 * This can be called when all levels in a module are completed
 */
export async function handleModuleCompletion(
  userId: string,
  moduleId: number
): Promise<{
  success: boolean;
  message: string;
  nextModuleUnlocked?: boolean;
  nextModuleId?: number;
  error?: any;
}> {
  try {
    console.log('Module completion handler called:', { userId, moduleId });

    const result = await ModuleUnlockService.handleModuleCompletion(userId, moduleId);

    if (!result.success) {
      console.error('Module completion failed:', result.message);
      return {
        success: false,
        message: result.message,
        error: result.error
      };
    }

    const nextModuleUnlocked = result.data?.nextModuleUnlocked || false;
    const nextModuleId = result.data?.nextModuleId || null;

    console.log('Module completion result:', {
      nextModuleUnlocked,
      nextModuleId
    });

    return {
      success: true,
      message: result.message,
      nextModuleUnlocked,
      nextModuleId
    };

  } catch (error) {
    console.error('Error in module completion handler:', error);
    return {
      success: false,
      message: 'An unexpected error occurred during module completion',
      error
    };
  }
}

/**
 * Check if a specific level is the last level in its module
 */
export async function isLastLevelInModule(
  moduleId: number,
  levelId: number
): Promise<boolean> {
  try {
    return await ModuleUnlockService.isLastLevelInModule(moduleId, levelId);
  } catch (error) {
    console.error('Error checking if last level in module:', error);
    return false;
  }
}

/**
 * Get the total number of levels in a module
 */
export async function getModuleTotalLevels(moduleId: number): Promise<number> {
  try {
    return await ModuleUnlockService.getModuleTotalLevels(moduleId);
  } catch (error) {
    console.error('Error getting module total levels:', error);
    return 4; // Default fallback
  }
}