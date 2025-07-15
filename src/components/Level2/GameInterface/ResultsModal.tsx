import React, { useEffect, useState } from 'react';
import { ArrowRight, X, Clock, Target } from 'lucide-react';
import { Term } from '../../../types/Level2/types';
import { useAuth } from '../../../contexts/AuthContext';
import { LevelProgressService } from '../../../services/levelProgressService';
import { useLevelProgress } from '../../../hooks/useLevelProgress';

interface ResultsModalProps {
  showResults: boolean;
  score: number;
  currentScore: number;
  totalCorrect: number;
  terms: Term[];
  isMobile: boolean;
  onNextLevel: () => void;
  onReset: () => void;
  onClose: () => void;
  moduleId?: number;
  levelId?: number;
  scoreHistory?: number[];
  timeHistory?: number[];
}

const ResultsModal: React.FC<ResultsModalProps> = ({
  showResults,
  score,
  currentScore,
  totalCorrect,
  terms,
  isMobile,
  onNextLevel,
  onReset,
  onClose,
  moduleId = 1,
  levelId = 2,
  scoreHistory = [],
  timeHistory = [],
}) => {
  const { user } = useAuth();
  const [hasUpdatedProgress, setHasUpdatedProgress] = useState(false);

  // Use level progress hook to refresh progress after completion
  const { refreshProgress } = useLevelProgress(moduleId);

  // Update level progress when modal becomes visible and game is completed
  useEffect(() => {
    const updateLevelProgress = async () => {
      console.log('ResultsModal: useEffect triggered', {
        showResults,
        user: user?.id,
        moduleId,
        levelId,
        score,
        hasUpdatedProgress
      });

      if (!showResults || !user || hasUpdatedProgress) {
        console.log('ResultsModal: Skipping update due to conditions:', {
          showResults,
          hasUser: !!user,
          hasUpdatedProgress,
          score
        });
        return;
      }

      console.log('ResultsModal: Starting level progress update...');
      setHasUpdatedProgress(true);
      try {
        const { data, error } = await LevelProgressService.completeLevel(
          user.id,
          moduleId,
          levelId
        );

        if (error) {
          console.error('ResultsModal: Failed to update level progress:', error);
        } else {
          console.log('ResultsModal: Successfully updated level progress:', {
            moduleId,
            levelId,
            userId: user.id,
            data
          });
          // Refresh the level progress to update UI with newly unlocked levels
          await refreshProgress();
        }
      } catch (error) {
        console.error('ResultsModal: Error updating level progress:', error);
      }
    };

    updateLevelProgress();
  }, [showResults, user, moduleId, levelId, hasUpdatedProgress, score, refreshProgress]);

  // Reset the progress update flag when modal is closed
  useEffect(() => {
    if (!showResults) {
      setHasUpdatedProgress(false);
    }
  }, [showResults]);



  const getContextualFeedback = (currentScore: number, scoreHistory: number[]) => {


    const current = currentScore;
    const previous = scoreHistory[1]; // previous score
    const lastPrevious = scoreHistory[2]; // past previous score

    // Check for contextual feedback conditions
    if (previous !== undefined && current > previous) {
      // Current score is better than previous
      return { message: "🎉 Great! You're improving!", color: "text-green-300" };
    } else if (previous !== undefined && current < previous) {
      // Check if scores have dropped two sessions in a row
      if (lastPrevious !== undefined && previous < lastPrevious) {
        // Two consecutive drops: lastPrevious > previous > current
        return { message: "⚠️ Need help? Focus on the tricky parts!", color: "text-orange-300" };
      } else {
        // Single drop
        return { message: "💪 Don't worry—try again to beat your last score!", color: "text-blue-300" };
      }
    } else {
      // Handle two distinct scenarios for same score or no previous score
      if (!scoreHistory || scoreHistory.length === 0 || previous === undefined) {
        // No previous score exists - first time completion
        return { message: "Congrats this is your first score!", color: "text-blue-300" };
      } else if (current === previous) {
        // Same score as previous attempt
        return { message: "Keep practicing to improve!", color: "text-blue-300" };
      } else {
        // Fallback for any other case
        return { message: "Keep practicing to improve!", color: "text-blue-300" };
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderScoreHistory = () => {
    if (!scoreHistory || scoreHistory.length === 0) return null;

    return (
      <div className="mt-3 p-2 bg-gray-900 bg-opacity-50 pixel-border">
        <div className="text-gray-400 text-xs font-bold mb-2 pixel-text">SCORE HISTORY</div>
        <div className="space-y-1">
          {scoreHistory.slice(0, 3).map((historyScore, index) => {
            const historyTime = timeHistory?.[index];
            const isCurrentScore = index === 0;
            return (
              <div
                key={index}
                className={`flex items-center justify-between text-xs pixel-text ${
                  isCurrentScore ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Target className="w-3 h-3" />
                  <span>{isCurrentScore ? 'High Score' : `PREV ${index}`}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">{historyScore}/40</span>
                  {historyTime && (
                    <>
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(historyTime)}</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!showResults) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-2 z-50">
      <div className={`pixel-border-thick bg-gray-800 relative overflow-hidden ${
        isMobile
          ? 'w-11/12 h-4/5 max-w-md p-3'
          : 'p-6 max-w-md w-full'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-20 w-8 h-8 pixel-border bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white transition-all duration-200 flex items-center justify-center"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Background Pattern */}
        <div className="absolute inset-0 bg-pixel-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-scan-lines opacity-20"></div>
        
        <div className={`relative z-10 text-center h-full ${isMobile ? 'flex flex-col justify-between' : ''}`}>
          {/* Mobile Landscape Results Layout */}
          {isMobile ? (
            <>
              {/* Top Section - Mission Status */}
              <div className="flex-shrink-0">
                <div className="text-gray-400 text-xs font-bold mb-1 pixel-text">MISSION STATUS</div>
                <div className={`text-lg font-black pixel-text ${getContextualFeedback(currentScore, scoreHistory).color} mb-2`}>
                  {getContextualFeedback(currentScore, scoreHistory).message}
                </div>
              </div>

              {/* Middle Section - Scores and Stats in Horizontal Layout */}
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full">
                  {/* Scores */}
                  <div className="text-center mb-3">
                    <div className="text-2xl font-black text-yellow-400 pixel-text">
                      {currentScore}/40
                    </div>
                    <div className="text-xl font-black text-cyan-300 pixel-text">
                      {score}%
                    </div>
                    <p className="text-gray-300 text-xs font-bold pixel-text">
                      {totalCorrect}/{terms.length} TARGETS HIT
                    </p>
                  </div>

                  {/* Score History for Mobile */}
                  {renderScoreHistory()}
                </div>
              </div>

              {/* Bottom Section - Action Buttons with Flex Layout */}
              <div className="flex-shrink-0">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onNextLevel}
                    className="pixel-border-thick bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-2 py-2 font-black text-xs pixel-text transition-all duration-300"
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>NEXT LEVEL</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </button>
                  
                  <button
                    onClick={onReset}
                    className="pixel-border bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-2 py-2 font-bold text-xs pixel-text transition-all duration-200"
                  >
                    RETRY MISSION
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Desktop Results Layout */
            <>
              {/* Mission Status */}
              <div className="mb-4">
                <div className="text-gray-400 text-sm font-bold mb-1 pixel-text">MISSION STATUS</div>
                <div className={`text-2xl font-black mb-1 pixel-text ${getContextualFeedback(currentScore, scoreHistory).color}`}>
                  {getContextualFeedback(currentScore, scoreHistory).message}
                </div>
              </div>



              {/* Score Display */}
              <div className="mb-4">
                <div className="text-4xl font-black text-yellow-400 mb-1 pixel-text">
                  {currentScore}/40
                </div>
                <div className="text-3xl font-black text-cyan-300 mb-1 pixel-text">
                  {score}%
                </div>
                <p className="text-gray-300 text-base font-bold pixel-text">
                  {totalCorrect}/{terms.length} TARGETS HIT
                </p>

                {/* Score History for Desktop */}
                {renderScoreHistory()}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={onNextLevel}
                  className="w-full pixel-border-thick bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-6 py-3 font-black text-base pixel-text transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>NEXT LEVEL</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </button>

                <button
                  onClick={onReset}
                  className="w-full pixel-border bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-6 py-3 font-bold text-base pixel-text transition-all duration-200 hover:scale-105"
                >
                  RETRY MISSION
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;
