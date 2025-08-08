import { supabase } from '../lib/supabase';

export interface ModuleUnlockResult {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

export class ModuleUnlockService {
  /**
   * Handle module click - fetch total levels and insert/update module progress
   */
  static async handleModuleClick(
    userId: string,
    moduleId: number
  ): Promise<ModuleUnlockResult> {
    try {
      console.log('ModuleUnlockService: Handling module click:', { userId, moduleId });

      // First check if module is unlocked
      const { data: isUnlocked, error: unlockError } = await supabase.rpc('is_module_unlocked', {
        p_user_id: userId,
        p_module_id: moduleId
      });

      if (unlockError) {
        console.error('Error checking module unlock status:', unlockError);
        return {
          success: false,
          message: 'Failed to check module unlock status',
          error: unlockError
        };
      }

      if (!isUnlocked) {
        return {
          success: false,
          message: `Module ${moduleId} is locked. Complete the previous module first.`,
          data: { isUnlocked: false }
        };
      }

      // Get total levels for the module
      const totalLevels = await this.getModuleTotalLevels(moduleId);

      // Check if module progress record already exists
      const { data: existingProgress, error: checkError } = await supabase
        .from('module_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('module_id', moduleId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking existing module progress:', checkError);
        return {
          success: false,
          message: 'Failed to check existing module progress',
          error: checkError
        };
      }

      let result;
      if (existingProgress) {
        // Update existing record
        const { data: updateData, error: updateError } = await supabase
          .from('module_progress')
          .update({
            total_levels: totalLevels,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('module_id', moduleId)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating module progress:', updateError);
          return {
            success: false,
            message: 'Failed to update module progress',
            error: updateError
          };
        }

        result = updateData;
        console.log('Module progress updated:', result);
      } else {
        // Insert new record
        const { data: insertData, error: insertError } = await supabase
          .from('module_progress')
          .insert({
            user_id: userId,
            module_id: moduleId,
            total_levels: totalLevels,
            is_completed: false
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error inserting module progress:', insertError);
          return {
            success: false,
            message: 'Failed to create module progress record',
            error: insertError
          };
        }

        result = insertData;
        console.log('Module progress created:', result);
      }

      return {
        success: true,
        message: `Module ${moduleId} is ready to start`,
        data: {
          moduleProgress: result,
          totalLevels,
          isUnlocked: true
        }
      };

    } catch (error) {
      console.error('Error in handleModuleClick:', error);
      return {
        success: false,
        message: 'An unexpected error occurred',
        error
      };
    }
  }

  /**
   * Handle module completion - mark as completed and unlock next module
   */
  static async handleModuleCompletion(
    userId: string,
    moduleId: number
  ): Promise<ModuleUnlockResult> {
    try {
      console.log('ModuleUnlockService: Handling module completion:', { userId, moduleId });

      // Use the complete_module function from the SQL
      const { data, error } = await supabase.rpc('complete_module', {
        p_user_id: userId,
        p_module_id: moduleId
      });

      if (error) {
        console.error('Error completing module:', error);
        return {
          success: false,
          message: 'Failed to complete module',
          error
        };
      }

      console.log('Module completed successfully:', data);

      // Check if next module was unlocked
      const nextModuleId = moduleId + 1;
      const { data: nextModuleProgress, error: nextModuleError } = await supabase
        .from('module_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('module_id', nextModuleId)
        .single();

      let nextModuleUnlocked = false;
      if (!nextModuleError && nextModuleProgress) {
        nextModuleUnlocked = true;
      }

      return {
        success: true,
        message: `Module ${moduleId} completed successfully${nextModuleUnlocked ? ` and Module ${nextModuleId} unlocked` : ''}`,
        data: {
          completedModuleId: moduleId,
          nextModuleUnlocked,
          nextModuleId: nextModuleUnlocked ? nextModuleId : null
        }
      };

    } catch (error) {
      console.error('Error in handleModuleCompletion:', error);
      return {
        success: false,
        message: 'An unexpected error occurred during module completion',
        error
      };
    }
  }

  /**
   * Get total levels for a module using the SQL function
   */
  static async getModuleTotalLevels(moduleId: number): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('get_module_total_levels', {
        p_module_id: moduleId
      });

      if (error) {
        console.error('Error getting module total levels:', error);
        // Return default values if function fails
        return this.getDefaultModuleLevels(moduleId);
      }

      return data || this.getDefaultModuleLevels(moduleId);
    } catch (error) {
      console.error('Error in getModuleTotalLevels:', error);
      return this.getDefaultModuleLevels(moduleId);
    }
  }

  /**
   * Get default module levels as fallback
   */
  private static getDefaultModuleLevels(moduleId: number): number {
    const defaultLevels: Record<number, number> = {
      1: 4,
      2: 3,
      3: 3,
      4: 4,
      5: 2, // HL1
      6: 2  // HL2
    };

    return defaultLevels[moduleId] || 4;
  }

  /**
   * Check if a level is the last level in a module
   */
  static async isLastLevelInModule(
    moduleId: number,
    levelId: number
  ): Promise<boolean> {
    try {
      const totalLevels = await this.getModuleTotalLevels(moduleId);
      return levelId === totalLevels;
    } catch (error) {
      console.error('Error checking if last level in module:', error);
      return false;
    }
  }

  /**
   * Handle level completion - check if it's the last level and complete module if so
   */
  static async handleLevelCompletion(
    userId: string,
    moduleId: number,
    levelId: number
  ): Promise<ModuleUnlockResult> {
    try {
      console.log('ModuleUnlockService: Handling level completion:', { userId, moduleId, levelId });

      // Use the new SQL function to handle level completion
      const { data, error } = await supabase.rpc('handle_level_completion', {
        p_user_id: userId,
        p_module_id: moduleId,
        p_level_id: levelId
      });

      if (error) {
        console.error('Error in handle_level_completion SQL function:', error);
        return {
          success: false,
          message: 'Failed to process level completion',
          error
        };
      }

      const result = data && data.length > 0 ? data[0] : null;
      
      if (!result) {
        return {
          success: true,
          message: `Level ${levelId} completed`,
          data: {
            levelCompleted: levelId,
            moduleCompleted: false,
            nextModuleUnlocked: false
          }
        };
      }

      const moduleCompleted = result.module_completed || false;
      const nextModuleUnlocked = result.next_module_unlocked || false;
      const nextModuleId = result.next_module_id || null;

      let message = `Level ${levelId} completed`;
      if (moduleCompleted) {
        message += ` and Module ${moduleId} is now complete!`;
        if (nextModuleUnlocked) {
          message += ` Module ${nextModuleId} has been unlocked!`;
        }
      }

      console.log('Level completion result:', {
        moduleCompleted,
        nextModuleUnlocked,
        nextModuleId,
        rawResult: result
      });

      return {
        success: true,
        message,
        data: {
          levelCompleted: levelId,
          moduleCompleted,
          nextModuleUnlocked,
          nextModuleId
        }
      };

    } catch (error) {
      console.error('Error in handleLevelCompletion:', error);
      return {
        success: false,
        message: 'An unexpected error occurred during level completion',
        error
      };
    }
  }

  /**
   * Get user's module progress with unlock status
   */
  static async getUserModuleProgress(userId: string): Promise<ModuleUnlockResult> {
    try {
      const { data, error } = await supabase.rpc('get_comprehensive_user_progress', {
        p_user_id: userId
      });

      if (error) {
        console.error('Error getting user module progress:', error);
        return {
          success: false,
          message: 'Failed to get user module progress',
          error
        };
      }

      return {
        success: true,
        message: 'User module progress retrieved successfully',
        data: data || []
      };

    } catch (error) {
      console.error('Error in getUserModuleProgress:', error);
      return {
        success: false,
        message: 'An unexpected error occurred',
        error
      };
    }
  }

  /**
   * Initialize user progress (create Module 1 record)
   */
  static async initializeUserProgress(userId: string): Promise<ModuleUnlockResult> {
    try {
      const { data, error } = await supabase.rpc('initialize_user_progress', {
        p_user_id: userId
      });

      if (error) {
        console.error('Error initializing user progress:', error);
        return {
          success: false,
          message: 'Failed to initialize user progress',
          error
        };
      }

      return {
        success: true,
        message: 'User progress initialized successfully',
        data
      };

    } catch (error) {
      console.error('Error in initializeUserProgress:', error);
      return {
        success: false,
        message: 'An unexpected error occurred during initialization',
        error
      };
    }
  }
}