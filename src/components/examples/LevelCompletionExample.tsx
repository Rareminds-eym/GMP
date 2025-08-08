import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { handleLevelCompletion, isLastLevelInModule } from '../../utils/levelCompletionHandler';

/**
 * Example component showing how to integrate level completion with module unlocking
 * This demonstrates the proper way to handle level completion in any game component
 */
const LevelCompletionExample: React.FC = () => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [currentModule, setCurrentModule] = useState(1);
  const [currentLevel, setCurrentLevel] = useState(1);

  const handleLevelComplete = async () => {
    if (!user?.id) {
      setMessage('User not authenticated');
      return;
    }

    setIsProcessing(true);
    setMessage('Processing level completion...');

    try {
      // Check if this is the last level before completing
      const isLastLevel = await isLastLevelInModule(currentModule, currentLevel);
      
      // Handle the level completion
      const result = await handleLevelCompletion(user.id, currentModule, currentLevel);

      if (result.success) {
        if (result.moduleCompleted) {
          setMessage(
            `🎉 Level ${currentLevel} completed! Module ${currentModule} is now complete!` +
            (result.nextModuleUnlocked 
              ? ` Module ${result.nextModuleId} has been unlocked!` 
              : '')
          );
          
          // If module completed and next module unlocked, you might want to:
          // - Show a celebration animation
          // - Update the UI to reflect the new unlocked module
          // - Navigate to the module selection screen
          // - Send analytics events
          
          if (result.nextModuleUnlocked) {
            // Example: Auto-advance to next module after a delay
            setTimeout(() => {
              setCurrentModule(result.nextModuleId!);
              setCurrentLevel(1);
              setMessage(`Now starting Module ${result.nextModuleId}!`);
            }, 3000);
          }
        } else {
          setMessage(`✅ Level ${currentLevel} completed! Continue to the next level.`);
          
          // Advance to next level in the same module
          setCurrentLevel(prev => prev + 1);
        }
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Level completion error:', error);
      setMessage('❌ An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetExample = () => {
    setCurrentModule(1);
    setCurrentLevel(1);
    setMessage('');
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Level Completion Example
      </h2>
      
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p><strong>Current Module:</strong> {currentModule}</p>
        <p><strong>Current Level:</strong> {currentLevel}</p>
        <p><strong>User:</strong> {user?.email || 'Not authenticated'}</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Module ID:
        </label>
        <input
          type="number"
          min="1"
          max="6"
          value={currentModule}
          onChange={(e) => setCurrentModule(parseInt(e.target.value))}
          className="w-full p-2 border rounded"
          disabled={isProcessing}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Level ID:
        </label>
        <input
          type="number"
          min="1"
          max="4"
          value={currentLevel}
          onChange={(e) => setCurrentLevel(parseInt(e.target.value))}
          className="w-full p-2 border rounded"
          disabled={isProcessing}
        />
      </div>

      <div className="space-y-2 mb-4">
        <button
          onClick={handleLevelComplete}
          disabled={isProcessing || !user}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isProcessing ? 'Processing...' : 'Complete Level'}
        </button>
        
        <button
          onClick={resetExample}
          disabled={isProcessing}
          className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-400"
        >
          Reset Example
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded ${
          message.includes('❌') 
            ? 'bg-red-100 text-red-700' 
            : message.includes('🎉') 
            ? 'bg-green-100 text-green-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {message}
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 rounded border-l-4 border-yellow-400">
        <h3 className="font-semibold text-yellow-800 mb-2">How to Use in Your Components:</h3>
        <pre className="text-xs text-yellow-700 overflow-x-auto">
{`import { handleLevelCompletion } from '../utils/levelCompletionHandler';

const onLevelComplete = async () => {
  const result = await handleLevelCompletion(
    user.id, 
    moduleId, 
    levelId
  );
  
  if (result.moduleCompleted) {
    // Module completed!
    if (result.nextModuleUnlocked) {
      // Next module unlocked!
    }
  }
};`}
        </pre>
      </div>
    </div>
  );
};

export default LevelCompletionExample;