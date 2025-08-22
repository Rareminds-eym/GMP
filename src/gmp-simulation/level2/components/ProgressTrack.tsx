import React from 'react';
import { CheckCircle, Flame, Star } from 'lucide-react';
import { ProgressTrackProps } from '../types';

const ProgressTrack: React.FC<ProgressTrackProps> = ({
  stages,
  currentStage,
  isStageComplete,
  onStageClick,
  progress,
  isMobileHorizontal,
  isAnimating,
  setIsAnimating
}) => {
  const handleStageClick = (stageNumber: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      onStageClick(stageNumber);
      setIsAnimating(false);
    }, 200);
  };

  return (
    <div className={`${isMobileHorizontal ? 'mb-3' : 'mb-6'}`}>
      <div className="pixel-border-thick bg-gray-900/90 p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-pixel-pattern opacity-5"></div>
        <div className="relative z-10">
          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
              <span className="pixel-text font-black text-white text-sm">MISSION PROGRESS</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="pixel-text font-bold text-cyan-300 text-sm">{Math.round(progress)}% COMPLETE</span>
              <Star className="w-4 h-4 text-yellow-400" />
            </div>
          </div>
          
          {/* Visual Progress Bar */}
          <div className="relative h-2 bg-gray-800 pixel-border mb-4">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000 ease-out"
              style={{ 
                width: `${progress}%`,
                boxShadow: '0 0 10px rgba(6,182,212,0.6)'
              }}
            ></div>
            <div className="absolute top-0 right-0 h-full w-4 bg-gradient-to-l from-white/20 to-transparent animate-pulse"></div>
          </div>

          {/* Stage Navigation Grid */}
          <div className={`grid ${isMobileHorizontal ? 'grid-cols-9 gap-1' : 'grid-cols-9 gap-2'}`}>
            {stages.map((stageData, index) => {
              const stageNumber = index + 1;
              const isCurrent = stageNumber === currentStage;
              const isCompleted = stageNumber < currentStage || isStageComplete(stageNumber);
              const isPrevious = stageNumber < currentStage;
              const isNext = stageNumber === currentStage + 1;
              
              return (
                <div
                  key={stageNumber}
                  className={`relative group transition-all duration-300 transform ${
                    isCurrent ? 'scale-110' : 'hover:scale-105'
                  } cursor-default`}
                  // onClick removed to disable stage change
                >
                  {/* Connection Line */}
                  {index < 8 && (
                    <div className={`absolute top-1/2 -right-1 w-2 h-0.5 -translate-y-1/2 transition-all duration-500 ${
                      isPrevious || isCurrent ? 'bg-cyan-400' : 'bg-gray-600'
                    }`} style={{
                      boxShadow: isPrevious || isCurrent ? '0 0 4px rgba(6,182,212,0.5)' : 'none'
                    }}></div>
                  )}
                  
                  {/* Stage Card */}
                  <div className={`pixel-border flex flex-col items-center transition-all duration-300 ${
                    isMobileHorizontal ? 'p-1.5' : 'p-3'
                  } relative overflow-hidden ${
                    isCurrent 
                      ? `bg-gradient-to-br ${stageData.bgColor} ring-2 ring-cyan-400 ring-opacity-50` 
                      : isCompleted 
                        ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 hover:from-green-800/40 hover:to-emerald-800/40' 
                        : isNext
                          ? 'bg-gradient-to-br from-yellow-900/20 to-orange-900/20 hover:from-yellow-800/30 hover:to-orange-800/30'
                          : 'bg-gray-800/50 hover:bg-gray-700/60'
                  }`}>
                    
                    {/* Animated Background for Current Stage */}
                    {isCurrent && (
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 animate-pulse"></div>
                    )}
                    
                    {/* Stage Icon */}
                    <div className={`pixel-border ${isMobileHorizontal ? 'p-1' : 'p-2'} mb-1 transition-all duration-300 relative overflow-hidden ${
                      isCurrent 
                        ? `bg-gradient-to-br ${stageData.color} shadow-lg` 
                        : isCompleted 
                          ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                          : isNext
                            ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                            : 'bg-gray-600'
                    }`}>
                      {/* Glow Effect */}
                      {(isCurrent || isCompleted) && (
                        <div className={`absolute inset-0 blur-sm ${
                          isCurrent ? `bg-gradient-to-br ${stageData.color}` : 'bg-green-500'
                        } opacity-30 -z-10`}></div>
                      )}
                      
                      {/* Icon with State */}
                      {isCompleted && !isCurrent ? (
                        <CheckCircle className={`${isMobileHorizontal ? 'w-3 h-3' : 'w-4 h-4'} text-white`} />
                      ) : isNext ? (
                        <div className="relative">
                          <stageData.icon className={`${isMobileHorizontal ? 'w-3 h-3' : 'w-4 h-4'} text-white animate-pulse`} />
                          <div className="absolute inset-0 bg-white/30 animate-ping rounded-full"></div>
                        </div>
                      ) : (
                        <stageData.icon className={`${isMobileHorizontal ? 'w-3 h-3' : 'w-4 h-4'} text-white`} />
                      )}
                    </div>
                    
                    {/* Stage Number */}
                    <div className={`pixel-text ${isMobileHorizontal ? 'text-[8px]' : 'text-[10px]'} font-black mb-1 ${
                      isCurrent ? 'text-cyan-300' : isCompleted ? 'text-green-400' : isNext ? 'text-yellow-400' : 'text-gray-400'
                    }`}>
                      {stageNumber}
                    </div>
                    
                    {/* Stage Title */}
                    <span className={`pixel-text ${isMobileHorizontal ? 'text-[8px]' : 'text-[10px]'} font-bold text-center leading-tight ${
                      isCurrent ? 'text-cyan-200' : isCompleted ? 'text-green-300' : isNext ? 'text-yellow-300' : 'text-gray-500'
                    }`}>
                      {stageData.subtitle}
                    </span>
                  </div>
                  
                  {/* Tooltip on Hover */}
                  <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs pixel-text font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap ${
                    isMobileHorizontal ? 'hidden' : ''
                  }`}>
                    {stageData.title}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTrack;
