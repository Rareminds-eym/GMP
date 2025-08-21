import React from 'react';
import { Award, ChevronRight } from 'lucide-react';
import { HeaderProps } from '../types';

const Header: React.FC<HeaderProps> = ({ currentStageData, progress, isMobileHorizontal }) => {
  return (
    <div className={isMobileHorizontal ? 'mb-3' : 'mb-6'}>
      <div 
        className={`pixel-border-thick bg-gradient-to-br ${currentStageData.bgColor} relative overflow-hidden ${isMobileHorizontal ? 'p-3' : 'p-6'}`}
        style={{
          background: `linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(37,99,235,0.15) 100%), linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`
        }}
      >
        <div className="absolute inset-0 bg-pixel-pattern opacity-5"></div>
        <div className="absolute inset-0 bg-scan-lines opacity-10"></div>
        
        {/* Animated Background Effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse opacity-30" style={{ animationDelay: '0.5s' }}></div>
        
        <div className={`relative z-10 flex items-center justify-between`}>
          <div className={`flex items-center ${isMobileHorizontal ? 'space-x-2' : 'space-x-4'}`}>
            <div 
              className={`pixel-border-thick bg-gradient-to-br ${currentStageData.color} flex items-center justify-center ${isMobileHorizontal ? 'p-2' : 'p-4'} relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <currentStageData.icon className={`${isMobileHorizontal ? 'w-6 h-6' : 'w-10 h-10'} text-white relative z-10 drop-shadow-lg`} />
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${currentStageData.color} blur-sm opacity-50 -z-10`}></div>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h1 className={`pixel-text ${isMobileHorizontal ? 'text-xl' : 'text-4xl'} font-black text-white`} 
                    style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.7), 0 0 20px rgba(6,182,212,0.3)' }}>
                  INNOVATION QUEST
                </h1>
                <Award className={`${isMobileHorizontal ? 'w-4 h-4' : 'w-6 h-6'} text-yellow-400 animate-pulse`} />
              </div>
              <div className="flex items-center space-x-2">
                <span className={`pixel-text text-cyan-100 font-bold ${isMobileHorizontal ? 'text-xs' : 'text-lg'}`}>
                  {currentStageData.subtitle.toUpperCase()}
                </span>
                <ChevronRight className={`${isMobileHorizontal ? 'w-3 h-3' : 'w-4 h-4'} text-cyan-300`} />
                <span className={`pixel-text text-cyan-200 font-bold ${isMobileHorizontal ? 'text-xs' : 'text-base'}`}>
                  {currentStageData.title.toUpperCase()}
                </span>
              </div>
              <p className={`pixel-text text-cyan-400/80 font-semibold ${isMobileHorizontal ? 'text-xs' : 'text-sm'} mt-1`}>
                {currentStageData.description}
              </p>
            </div>
          </div>
          
          {/* Progress Circle */}
          <div className={`relative ${isMobileHorizontal ? 'w-12 h-12' : 'w-16 h-16'}`}>
            <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 36 36">
              <path
                className="stroke-gray-700"
                strokeWidth="3"
                fill="transparent"
                d="M18 2.5 A 15.5 15.5 0 1 1 18 2.499"
              />
              <path
                className={`stroke-cyan-400 transition-all duration-1000 ease-out drop-shadow-lg`}
                strokeWidth="3"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={`${progress}, 100`}
                d="M18 2.5 A 15.5 15.5 0 1 1 18 2.499"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.6))'
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`pixel-text font-black text-white ${isMobileHorizontal ? 'text-xs' : 'text-sm'}`}
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
