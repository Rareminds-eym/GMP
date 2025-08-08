import { useState, useCallback } from 'react';
import { ModuleUnlockService, ModuleUnlockResult } from '../services/moduleUnlockService';
import { useAuth } from '../contexts/AuthContext';

export interface UseModuleUnlockReturn {
  handleModuleClick: (moduleId: number) => Promise<ModuleUnlockResult>;
  handleLevelCompletion: (moduleId: number, levelId: number) => Promise<ModuleUnlockResult>;
  handleModuleCompletion: (moduleId: number) => Promise<ModuleUnlockResult>;
  initializeUserProgress: () => Promise<ModuleUnlockResult>;
  getUserModuleProgress: () => Promise<ModuleUnlockResult>;
  isLoading: boolean;
  error: string | null;
}

export function useModuleUnlock(): UseModuleUnlockReturn {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleModuleClick = useCallback(async (moduleId: number): Promise<ModuleUnlockResult> => {
    if (!user?.id) {
      const result = {
        success: false,
        message: 'User not authenticated',
        error: { message: 'User not authenticated' }
      };
      setError(result.message);
      return result;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await ModuleUnlockService.handleModuleClick(user.id, moduleId);
      
      if (!result.success) {
        setError(result.message);
      }

      return result;
    } catch (error) {
      const errorMessage = 'Failed to handle module click';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
        error
      };
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const handleLevelCompletion = useCallback(async (
    moduleId: number, 
    levelId: number
  ): Promise<ModuleUnlockResult> => {
    if (!user?.id) {
      const result = {
        success: false,
        message: 'User not authenticated',
        error: { message: 'User not authenticated' }
      };
      setError(result.message);
      return result;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await ModuleUnlockService.handleLevelCompletion(user.id, moduleId, levelId);
      
      if (!result.success) {
        setError(result.message);
      }

      return result;
    } catch (error) {
      const errorMessage = 'Failed to handle level completion';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
        error
      };
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const handleModuleCompletion = useCallback(async (moduleId: number): Promise<ModuleUnlockResult> => {
    if (!user?.id) {
      const result = {
        success: false,
        message: 'User not authenticated',
        error: { message: 'User not authenticated' }
      };
      setError(result.message);
      return result;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await ModuleUnlockService.handleModuleCompletion(user.id, moduleId);
      
      if (!result.success) {
        setError(result.message);
      }

      return result;
    } catch (error) {
      const errorMessage = 'Failed to handle module completion';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
        error
      };
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const initializeUserProgress = useCallback(async (): Promise<ModuleUnlockResult> => {
    if (!user?.id) {
      const result = {
        success: false,
        message: 'User not authenticated',
        error: { message: 'User not authenticated' }
      };
      setError(result.message);
      return result;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await ModuleUnlockService.initializeUserProgress(user.id);
      
      if (!result.success) {
        setError(result.message);
      }

      return result;
    } catch (error) {
      const errorMessage = 'Failed to initialize user progress';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
        error
      };
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const getUserModuleProgress = useCallback(async (): Promise<ModuleUnlockResult> => {
    if (!user?.id) {
      const result = {
        success: false,
        message: 'User not authenticated',
        error: { message: 'User not authenticated' }
      };
      setError(result.message);
      return result;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await ModuleUnlockService.getUserModuleProgress(user.id);
      
      if (!result.success) {
        setError(result.message);
      }

      return result;
    } catch (error) {
      const errorMessage = 'Failed to get user module progress';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
        error
      };
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  return {
    handleModuleClick,
    handleLevelCompletion,
    handleModuleCompletion,
    initializeUserProgress,
    getUserModuleProgress,
    isLoading,
    error
  };
}