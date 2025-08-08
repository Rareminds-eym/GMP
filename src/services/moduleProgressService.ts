import { supabase } from '../lib/supabase';
import type { Module } from '../types/module';

export interface ModuleProgress {
  module_id: number;
  is_unlocked: boolean;
  is_completed: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface ModuleSummary {
  module_id: number;
  total_levels: number;
  completed_levels: number;
  unlocked_levels: number;
  progress_percentage: number;
}

export interface ModuleProgressRecord {
  id: string;
  user_id: string;
  module_id: number;
  is_unlocked: boolean;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ModuleProgressData {
  id: string;
  user_id: string;
  module_id: number;
  total_levels: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface LevelCompletionData {
  user_id: string;
  module_id: number;
  level_id: number;
  current_level: number;
  total_levels: number;
}

export class ModuleProgressService {
  /**
   * Handle module click - fetch total_levels and create/update module_progress entry
   */
  static async handleModuleClick(
    userId: string, 
    moduleId: number
  ): Promise<{ data: ModuleProgressData | null; error: any; isNewlyUnlocked: boolean }> {
    try {
      console.log(`ModuleProgressService: Handling click for Module ${moduleId}, User ${userId}`);

      // First, get total_levels for this module from configuration
      const totalLevels = await this.getModuleTotalLevels(moduleId);
      
      // Check if module_progress entry exists
      const { data: existing, error: fetchError } = await supabase
        .from('module_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('module_id', moduleId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 is "not found" error
        console.error('Error fetching existing module progress:', fetchError);
        return { data: null, error: fetchError, isNewlyUnlocked: false };
      }

      let result;
      let isNewlyUnlocked = false;

      if (!existing) {
        // Create new module_progress entry
        const { data: newEntry, error: insertError } = await supabase
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
          console.error('Error creating module progress:', insertError);
          return { data: null, error: insertError, isNewlyUnlocked: false };
        }

        result = newEntry;
        isNewlyUnlocked = true;
        console.log(`✅ Created new module progress for Module ${moduleId}`);
      } else {
        result = existing;
        console.log(`✅ Module ${moduleId} progress already exists`);
      }

      return { data: result, error: null, isNewlyUnlocked };
    } catch (error) {
      console.error('ModuleProgressService: Error in handleModuleClick:', error);
      return { data: null, error, isNewlyUnlocked: false };
    }
  }

  /**
   * Get total levels for a module based on configuration
   */
  static async getModuleTotalLevels(moduleId: number): Promise<number> {
    try {
      // Try to get from module_config table first
      const { data: configData, error: configError } = await supabase
        .rpc('get_module_total_levels', { p_module_id: moduleId });

      if (!configError && configData) {
        return configData;
      }

      // Fallback to default values if config doesn't exist
      const defaultLevels: Record<number, number> = {
        1: 4, // Module 1 has 4 levels
        2: 4, // Module 2 has 4 levels
        3: 4, // Module 3 has 4 levels
        4: 4, // Module 4 has 4 levels
      };

      return defaultLevels[moduleId] || 4; // Default to 4 levels
    } catch (error) {
      console.error('Error getting module total levels:', error);
      return 4; // Default fallback
    }
  }

  /**
   * Track level completion and check if module should be completed
   */
  static async trackLevelCompletion(
    userId: string, 
    moduleId: number, 
    levelId: number
  ): Promise<{ 
    data: LevelCompletionData | null; 
    error: any; 
    moduleCompleted: boolean;
    nextModuleUnlocked: boolean;
  }> {
    try {
      console.log(`ModuleProgressService: Tracking level completion - Module ${moduleId}, Level ${levelId}`);

      // Get current module progress
      const { data: moduleProgress, error: fetchError } = await supabase
        .from('module_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('module_id', moduleId)
        .single();

      if (fetchError) {
        console.error('Error fetching module progress:', fetchError);
        return { data: null, error: fetchError, moduleCompleted: false, nextModuleUnlocked: false };
      }

      const totalLevels = moduleProgress.total_levels;
      const currentLevel = levelId;

      // Check if this is the last level (level completion marks module as complete)
      const isLastLevel = currentLevel >= totalLevels;
      let moduleCompleted = false;
      let nextModuleUnlocked = false;

      if (isLastLevel && !moduleProgress.is_completed) {
        // Mark current module as completed
        const { error: updateError } = await supabase
          .from('module_progress')
          .update({ 
            is_completed: true,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('module_id', moduleId);

        if (updateError) {
          console.error('Error marking module as completed:', updateError);
        } else {
          moduleCompleted = true;
          console.log(`✅ Module ${moduleId} marked as completed`);

          // Unlock next module
          const unlockResult = await this.unlockNextModule(userId, moduleId);
          nextModuleUnlocked = unlockResult.success;
        }
      }

      const levelCompletionData: LevelCompletionData = {
        user_id: userId,
        module_id: moduleId,
        level_id: levelId,
        current_level: currentLevel,
        total_levels: totalLevels
      };

      return { 
        data: levelCompletionData, 
        error: null, 
        moduleCompleted,
        nextModuleUnlocked
      };
    } catch (error) {
      console.error('ModuleProgressService: Error in trackLevelCompletion:', error);
      return { data: null, error, moduleCompleted: false, nextModuleUnlocked: false };
    }
  }

  /**
   * Unlock the next module by creating a module_progress entry
   */
  static async unlockNextModule(
    userId: string, 
    currentModuleId: number
  ): Promise<{ success: boolean; error: any; nextModuleId?: number }> {
    try {
      const nextModuleId = currentModuleId + 1;
      
      // Check if next module already exists
      const { data: existing, error: fetchError } = await supabase
        .from('module_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('module_id', nextModuleId)
        .single();

      if (existing) {
        // Next module already unlocked
        return { success: true, error: null, nextModuleId };
      }

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking next module:', fetchError);
        return { success: false, error: fetchError };
      }

      // Get total levels for next module
      const totalLevels = await this.getModuleTotalLevels(nextModuleId);
      
      // Only unlock if the module exists (has levels)
      if (totalLevels > 0) {
        const { error: insertError } = await supabase
          .from('module_progress')
          .insert({
            user_id: userId,
            module_id: nextModuleId,
            total_levels: totalLevels,
            is_completed: false
          });

        if (insertError) {
          console.error('Error unlocking next module:', insertError);
          return { success: false, error: insertError };
        }

        console.log(`✅ Module ${nextModuleId} unlocked for user`);
        return { success: true, error: null, nextModuleId };
      } else {
        // No more modules to unlock
        return { success: true, error: null };
      }
    } catch (error) {
      console.error('ModuleProgressService: Error in unlockNextModule:', error);
      return { success: false, error };
    }
  }

  /**
   * Test database connection and module functions availability
   */
  static async testDatabaseConnection(): Promise<{ success: boolean; error?: any }> {
    try {
      console.log('Testing module database connection...');

      // Test basic connection by querying auth.users
      const { data: authData, error: authError } = await supabase.auth.getUser();
      console.log('Auth test:', { authData, authError });

      // Test if module_progress table exists
      const { data: tableData, error: tableError } = await supabase
        .from('module_progress')
        .select('*')
        .limit(1);

      console.log('Module progress table test:', { tableData, tableError });

      return { success: !tableError, error: tableError };
    } catch (error) {
      console.error('Module database connection test failed:', error);
      return { success: false, error };
    }
  }

  /**
   * Initialize modules for a new user (Module 1 unlocked, others locked)
   */
  static async initializeUserModules(userId: string): Promise<{ data: any; error: any }> {
    try {
      console.log('ModuleProgressService: Initializing modules for user:', userId);

      const { data, error } = await supabase.rpc('initialize_user_modules', {
        p_user_id: userId
      });

      console.log('ModuleProgressService: Initialize modules response:', { data, error });

      if (error) {
        console.error('Error initializing user modules:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in initializeUserModules:', error);
      return { data: null, error };
    }
  }

  /**
   * Get all module progress for a user
   */
  static async getAllModuleProgress(userId: string): Promise<{ data: ModuleProgress[] | null; error: any }> {
    try {
      console.log('ModuleProgressService: Getting all module progress for user:', userId);

      const { data, error } = await supabase.rpc('get_all_module_progress', {
        p_user_id: userId
      });

      console.log('ModuleProgressService: Get all module progress response:', { data, error });

      if (error) {
        console.error('Error getting all module progress:', error);
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error in getAllModuleProgress:', error);
      return { data: null, error };
    }
  }

  /**
   * Check if a specific module is unlocked for a user
   */
  static async isModuleUnlocked(
    userId: string,
    moduleId: number
  ): Promise<{ data: boolean; error: any }> {
    try {
      console.log('ModuleProgressService: Checking if module is unlocked:', { userId, moduleId });

      const { data, error } = await supabase.rpc('is_module_unlocked', {
        p_user_id: userId,
        p_module_id: moduleId
      });

      console.log('ModuleProgressService: Is module unlocked response:', { data, error });

      if (error) {
        console.error('Error checking if module is unlocked:', error);
        return { data: false, error };
      }

      return { data: data || false, error: null };
    } catch (error) {
      console.error('Error in isModuleUnlocked:', error);
      return { data: false, error };
    }
  }

  /**
   * Start a module for a user (creates record if doesn't exist)
   */
  static async startModule(
    userId: string,
    moduleId: number
  ): Promise<{ data: any; error: any }> {
    try {
      console.log('ModuleProgressService: Starting module:', { userId, moduleId });

      const { data, error } = await supabase.rpc('start_module', {
        p_user_id: userId,
        p_module_id: moduleId
      });

      console.log('ModuleProgressService: Start module response:', { data, error });

      if (error) {
        console.error('Error starting module:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in startModule:', error);
      return { data: null, error };
    }
  }

  /**
   * Mark a module as completed for a user
   */
  static async completeModule(
    userId: string,
    moduleId: number
  ): Promise<{ data: any; error: any }> {
    try {
      console.log('ModuleProgressService: Completing module:', { userId, moduleId });

      const { data, error } = await supabase.rpc('complete_module', {
        p_user_id: userId,
        p_module_id: moduleId
      });

      console.log('ModuleProgressService: Complete module response:', { data, error });

      if (error) {
        console.error('Error completing module:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in completeModule:', error);
      return { data: null, error };
    }
  }

  /**
   * Get user's module summary with level statistics
   */
  static async getUserModuleSummary(userId: string): Promise<{ data: ModuleSummary[] | null; error: any }> {
    try {
      console.log('ModuleProgressService: Getting user module summary for:', userId);

      const { data, error } = await supabase.rpc('get_user_module_summary', {
        p_user_id: userId
      });

      console.log('ModuleProgressService: Get user module summary response:', { data, error });

      if (error) {
        console.error('Error getting user module summary:', error);
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error in getUserModuleSummary:', error);
      return { data: null, error };
    }
  }

  /**
   * Get module progress directly from the table
   */
  static async getModuleProgressRecords(
    userId: string,
    moduleId?: number
  ): Promise<{ data: ModuleProgressRecord[] | null; error: any }> {
    try {
      let query = supabase
        .from('module_progress')
        .select('*')
        .eq('user_id', userId);

      if (moduleId !== undefined) {
        query = query.eq('module_id', moduleId);
      }

      const { data, error } = await query.order('module_id', { ascending: true });

      if (error) {
        console.error('Error getting module progress records:', error);
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error in getModuleProgressRecords:', error);
      return { data: null, error };
    }
  }

  /**
   * Reset user module progress (for debugging/testing)
   */
  static async resetUserModuleProgress(userId: string): Promise<{ data: any; error: any }> {
    try {
      console.log('ModuleProgressService: Resetting user module progress for:', userId);

      const { data, error } = await supabase.rpc('reset_user_module_progress', {
        p_user_id: userId
      });

      console.log('ModuleProgressService: Reset user module progress response:', { data, error });

      if (error) {
        console.error('Error resetting user module progress:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in resetUserModuleProgress:', error);
      return { data: null, error };
    }
  }

  /**
   * Convert ModuleProgress data to Module format for UI components
   */
  static convertToModuleFormat(
    moduleProgress: ModuleProgress[],
    moduleSummary?: ModuleSummary[]
  ): Module[] {
    const moduleNames = {
      1: 'Introduction to GMP',
      2: 'Personal Hygiene', 
      3: 'Cleaning Validation',
      4: 'Documentation'
    };

    return moduleProgress.map((progress) => {
      const summary = moduleSummary?.find(s => s.module_id === progress.module_id);
      
      let status: 'completed' | 'available' | 'locked' = 'locked';
      if (progress.is_completed) {
        status = 'completed';
      } else if (progress.is_unlocked) {
        status = 'available';
      }

      return {
        id: progress.module_id.toString(),
        status,
        title: moduleNames[progress.module_id as keyof typeof moduleNames] || `Module ${progress.module_id}`,
        progress: summary?.progress_percentage || 0
      };
    });
  }

  /**
   * Get modules formatted for UI components
   */
  static async getModulesForUI(userId: string): Promise<{ data: Module[] | null; error: any }> {
    try {
      // Get both module progress and summary
      const [progressResult, summaryResult] = await Promise.all([
        this.getAllModuleProgress(userId),
        this.getUserModuleSummary(userId)
      ]);

      if (progressResult.error) {
        return { data: null, error: progressResult.error };
      }

      if (summaryResult.error) {
        console.warn('Could not get module summary, proceeding without it:', summaryResult.error);
      }

      const modules = this.convertToModuleFormat(
        progressResult.data || [],
        summaryResult.data || []
      );

      return { data: modules, error: null };
    } catch (error) {
      console.error('Error in getModulesForUI:', error);
      return { data: null, error };
    }
  }

  /**
   * Handle module selection (start module if not started)
   */
  static async selectModule(
    userId: string,
    moduleId: number
  ): Promise<{ data: any; error: any }> {
    try {
      // First check if module is unlocked
      const { data: isUnlocked, error: unlockError } = await this.isModuleUnlocked(userId, moduleId);
      
      if (unlockError) {
        return { data: null, error: unlockError };
      }

      if (!isUnlocked) {
        return { 
          data: null, 
          error: { message: `Module ${moduleId} is locked and cannot be selected` }
        };
      }

      // Start the module (this will create a record if it doesn't exist)
      return await this.startModule(userId, moduleId);
    } catch (error) {
      console.error('Error in selectModule:', error);
      return { data: null, error };
    }
  }

  /**
   * Check if module should be completed based on level completion
   */
  static async checkAndUpdateModuleCompletion(
    userId: string,
    moduleId: number
  ): Promise<{ data: any; error: any }> {
    try {
      console.log('ModuleProgressService: Checking and updating module completion:', { userId, moduleId });

      const { data, error } = await supabase.rpc('update_module_progress_on_level_completion', {
        p_user_id: userId,
        p_module_id: moduleId
      });

      console.log('ModuleProgressService: Update module progress response:', { data, error });

      if (error) {
        console.error('Error updating module progress on level completion:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in checkAndUpdateModuleCompletion:', error);
      return { data: null, error };
    }
  }

  /**
   * Get module level count for a specific module
   */
  static getModuleLevelCount(moduleId: number): number {
    const levelCounts = {
      1: 4, // Module 1: 4 levels
      2: 3, // Module 2: 3 levels  
      3: 3, // Module 3: 3 levels
      4: 4  // Module 4: 4 levels
    };
    
    return levelCounts[moduleId as keyof typeof levelCounts] || 0;
  }

  /**
   * Utility method to ensure user has module records initialized
   */
  static async ensureUserModulesInitialized(userId: string): Promise<{ data: any; error: any }> {
    try {
      // Check if user has any module progress records
      const { data: existingProgress, error: checkError } = await this.getModuleProgressRecords(userId);
      
      if (checkError) {
        return { data: null, error: checkError };
      }

      // If no records exist, initialize them
      if (!existingProgress || existingProgress.length === 0) {
        console.log('No module progress found for user, initializing...');
        return await this.initializeUserModules(userId);
      }

      return { data: existingProgress, error: null };
    } catch (error) {
      console.error('Error in ensureUserModulesInitialized:', error);
      return { data: null, error };
    }
  }
}