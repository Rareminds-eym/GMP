import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ModuleProgressService } from '../../services/moduleProgressService';

const ModuleDebugger: React.FC = () => {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDebugTest = async () => {
    if (!user) {
      setDebugInfo({ error: 'No user authenticated' });
      return;
    }

    setLoading(true);
    try {
      console.log('🔧 Running module debug test...');
      
      // Test 1: Initialize user modules
      const initResult = await ModuleProgressService.initializeUserModules(user.id);
      console.log('Initialize result:', initResult);

      // Test 2: Get all module progress
      const progressResult = await ModuleProgressService.getAllModuleProgress(user.id);
      console.log('Progress result:', progressResult);

      // Test 3: Get modules for UI
      const uiResult = await ModuleProgressService.getModulesForUI(user.id);
      console.log('UI modules result:', uiResult);

      // Test 4: Check individual module unlock status
      const module1Unlock = await ModuleProgressService.isModuleUnlocked(user.id, 1);
      const module2Unlock = await ModuleProgressService.isModuleUnlocked(user.id, 2);
      
      setDebugInfo({
        userId: user.id,
        initResult,
        progressResult,
        uiResult,
        unlockTests: {
          module1: module1Unlock,
          module2: module2Unlock
        }
      });

    } catch (error) {
      console.error('Debug test error:', error);
      setDebugInfo({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      runDebugTest();
    }
  }, [user]);

  if (!user) {
    return <div className="p-4 bg-red-100 text-red-800">Please log in to test modules</div>;
  }

  return (
    <div className="fixed top-4 right-4 w-96 max-h-96 overflow-auto bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
      <h3 className="text-lg font-bold mb-2">Module Debug Info</h3>
      
      <button
        onClick={runDebugTest}
        disabled={loading}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Run Test'}
      </button>

      {debugInfo && (
        <div className="text-xs">
          <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ModuleDebugger;
