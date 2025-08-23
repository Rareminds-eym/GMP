import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { StageFormData } from '../types';

export interface Level2Screen3Progress {
  id?: string;
  user_id: string;
  email: string;
  
  // Idea statement fields (new stage 1)
  idea_statement_what: string;
  idea_statement_who: string;
  idea_statement_how: string;
  idea_statement?: string; // Computed field
  
  // Form data fields
  problem: string;
  technology: string;
  collaboration: string;
  creativity: string;
  speed_scale: string;
  impact: string;
  reflection: string;
  
  // Final statement fields
  final_problem: string;
  final_technology: string;
  final_collaboration: string;
  final_creativity: string;
  final_speed_scale: string;
  final_impact: string;
  
  // File storage
  uploaded_file_name?: string;
  uploaded_file_data?: string;
  
  // Progress tracking
  current_stage: number;
  completed_stages: number[];
  is_completed: boolean;
  progress_percentage: number;
  
  // Case information
  selected_case_id?: number;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
  completed_at?: string;
}

interface UseLevel2Screen3ProgressReturn {
  progress: Level2Screen3Progress | null;
  isLoading: boolean; // For initial load/fetch operations only
  isSaving: boolean; // For save operations
  error: string | null;
  saveProgress: (formData: StageFormData, currentStage: number, completedStages: number[]) => Promise<boolean>;
  loadProgress: () => Promise<Level2Screen3Progress | null>;
  markCompleted: () => Promise<boolean>;
  resetProgress: () => Promise<boolean>;
  hasExistingProgress: boolean;
}

export const useLevel2Screen3Progress = (): UseLevel2Screen3ProgressReturn => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Level2Screen3Progress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasExistingProgress, setHasExistingProgress] = useState(false);

  // Calculate progress percentage based on completed stages
  const calculateProgressPercentage = useCallback((completedStages: number[]): number => {
    // Only count stages that require user input (exclude always-complete/optional stages 8 and 9)
    const inputStages = [1, 2, 3, 4, 5, 6, 7, 10]; // Updated for 10 stages total
    const completedInputStages = completedStages.filter(stage => inputStages.includes(stage));
    return completedInputStages.length === 0 ? 0 : (completedInputStages.length / inputStages.length) * 100;
  }, []);

  // Helper function to parse idea statement into parts
  const parseIdeaStatement = useCallback((ideaStatement: string) => {
    if (!ideaStatement) {
      return { what: '', who: '', how: '' };
    }
    
    // Try to parse the existing format: "I want to solve X for Y by Z"
    const match = ideaStatement.match(/I want to solve (.+) for (.+) by (.+)/);
    if (match) {
      return {
        what: match[1]?.trim() || '',
        who: match[2]?.trim() || '',
        how: match[3]?.trim() || ''
      };
    }
    return { what: '', who: '', how: '' };
  }, []);

  // Convert form data to progress format
  const formDataToProgress = useCallback((
    formData: StageFormData,
    currentStage: number,
    completedStages: number[]
  ): Partial<Level2Screen3Progress> => {
    // Parse idea statement into individual parts
    const ideaParts = parseIdeaStatement(formData.ideaStatement || '');
    
    return {
      // Idea statement fields (stage 1)
      idea_statement_what: ideaParts.what,
      idea_statement_who: ideaParts.who,
      idea_statement_how: ideaParts.how,
      
      // Other form data fields
      problem: formData.problem || '',
      technology: formData.technology || '',
      collaboration: formData.collaboration || '',
      creativity: formData.creativity || '',
      speed_scale: formData.speedScale || '',
      impact: formData.impact || '',
      reflection: formData.reflection || '',
      final_problem: formData.finalProblem || '',
      final_technology: formData.finalTechnology || '',
      final_collaboration: formData.finalCollaboration || '',
      final_creativity: formData.finalCreativity || '',
      final_speed_scale: formData.finalSpeedScale || '',
      final_impact: formData.finalImpact || '',
      uploaded_file_name: formData.file?.name,
      current_stage: currentStage,
      completed_stages: completedStages,
      progress_percentage: calculateProgressPercentage(completedStages),
      is_completed: currentStage === 10 && completedStages.includes(10) // Updated to stage 10
    };
  }, [calculateProgressPercentage, parseIdeaStatement]);

  // Convert progress data to form format
  const progressToFormData = useCallback((progressData: Level2Screen3Progress): StageFormData => {
    // Reconstruct the ideaStatement from the individual parts
    let ideaStatement = '';
    if (progressData.idea_statement_what || progressData.idea_statement_who || progressData.idea_statement_how) {
      ideaStatement = `I want to solve ${progressData.idea_statement_what || ''} for ${progressData.idea_statement_who || ''} by ${progressData.idea_statement_how || ''}`;
    }
    
    return {
      ideaStatement: ideaStatement,
      problem: progressData.problem || '',
      technology: progressData.technology || '',
      collaboration: progressData.collaboration || '',
      creativity: progressData.creativity || '',
      speedScale: progressData.speed_scale || '',
      impact: progressData.impact || '',
      reflection: progressData.reflection || '',
      finalProblem: progressData.final_problem || '',
      finalTechnology: progressData.final_technology || '',
      finalCollaboration: progressData.final_collaboration || '',
      finalCreativity: progressData.final_creativity || '',
      finalSpeedScale: progressData.final_speed_scale || '',
      finalImpact: progressData.final_impact || '',
      file: null // File objects can't be restored from database
    };
  }, []);

  // Load existing progress from database
  const loadProgress = useCallback(async (): Promise<Level2Screen3Progress | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    setIsLoading(true);
    setError(null);
    console.log('📋 Loading progress from database for user:', user.id);

    try {
      const { data, error: fetchError } = await supabase
        .from('level2_screen3_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error loading progress:', fetchError);
        setError(fetchError.message);
        return null;
      }

      if (data) {
        console.log('📋 Loaded progress from database:', data);
        console.log('   - current_stage:', data.current_stage);
        console.log('   - completed_stages:', data.completed_stages);
        setProgress(data);
        setHasExistingProgress(true);
        return data;
      } else {
        console.log('📋 No existing progress found in database');
        setProgress(null);
        setHasExistingProgress(false);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error in loadProgress:', err);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Save progress to database
  const saveProgress = useCallback(async (
    formData: StageFormData,
    currentStage: number,
    completedStages: number[]
  ): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    setIsSaving(true);
    setError(null);

    try {
      console.log('🏗️ Building progress data to save:');
      console.log('   - Input currentStage:', currentStage);
      console.log('   - Input completedStages:', completedStages);
      console.log('   - Input formData:', formData);
      
      const formDataProgress = formDataToProgress(formData, currentStage, completedStages);
      console.log('   - Converted formData to progress:', formDataProgress);
      
      const progressData = {
        user_id: user.id,
        email: user.email || '',
        ...formDataProgress
      };
      
      console.log('   - Final progressData to save:', progressData);

      // Handle file data conversion to base64 if file exists
      if (formData.file) {
        try {
          const fileBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(formData.file!);
          });
          progressData.uploaded_file_data = fileBase64;
        } catch (fileError) {
          console.warn('Could not convert file to base64:', fileError);
        }
      }

      const { data, error: saveError } = await supabase
        .from('level2_screen3_progress')
        .upsert(progressData, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (saveError) {
        console.error('Error saving progress:', saveError);
        setError(saveError.message);
        return false;
      }

      setProgress(data);
      setHasExistingProgress(true);
      console.log('✅ Progress saved successfully to database:', data);
      console.log('   - Saved current_stage:', data.current_stage);
      console.log('   - Saved completed_stages:', data.completed_stages);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error in saveProgress:', err);
      setError(errorMessage);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user, formDataToProgress]);

  // Mark progress as completed
  const markCompleted = useCallback(async (): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    setIsSaving(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase
        .from('level2_screen3_progress')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
          progress_percentage: 100
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error marking completion:', updateError);
        setError(updateError.message);
        return false;
      }

      setProgress(data);
      console.log('Progress marked as completed:', data);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error in markCompleted:', err);
      setError(errorMessage);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user]);

  // Reset progress (delete from database)
  const resetProgress = useCallback(async (): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('level2_screen3_progress')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('Error resetting progress:', deleteError);
        setError(deleteError.message);
        return false;
      }

      setProgress(null);
      setHasExistingProgress(false);
      console.log('Progress reset successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error in resetProgress:', err);
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load progress on component mount
  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user, loadProgress]);

  return {
    progress,
    isLoading,
    isSaving,
    error,
    saveProgress,
    loadProgress,
    markCompleted,
    resetProgress,
    hasExistingProgress
  };
};

// Utility functions for converting between formats
export const convertProgressToFormData = (progressData: Level2Screen3Progress): StageFormData => {
  // Reconstruct the ideaStatement from the individual parts
  let ideaStatement = '';
  if (progressData.idea_statement_what || progressData.idea_statement_who || progressData.idea_statement_how) {
    ideaStatement = `I want to solve ${progressData.idea_statement_what || ''} for ${progressData.idea_statement_who || ''} by ${progressData.idea_statement_how || ''}`;
  }
  
  return {
    ideaStatement: ideaStatement,
    problem: progressData.problem || '',
    technology: progressData.technology || '',
    collaboration: progressData.collaboration || '',
    creativity: progressData.creativity || '',
    speedScale: progressData.speed_scale || '',
    impact: progressData.impact || '',
    reflection: progressData.reflection || '',
    finalProblem: progressData.final_problem || '',
    finalTechnology: progressData.final_technology || '',
    finalCollaboration: progressData.final_collaboration || '',
    finalCreativity: progressData.final_creativity || '',
    finalSpeedScale: progressData.final_speed_scale || '',
    finalImpact: progressData.final_impact || '',
    file: null // File objects can't be restored from database
  };
};

export default useLevel2Screen3Progress;
