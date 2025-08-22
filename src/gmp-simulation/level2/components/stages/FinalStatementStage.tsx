import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { StageProps } from '../../types';

const FinalStatementStage: React.FC<StageProps> = ({ onFormDataChange, isMobileHorizontal }) => {
  // Local state for user-filled blanks
  const [fields, setFields] = useState({
    problem: '',
    technology: '',
    collaboration: '',
    creativity: '',
    speedScale: '',
    impact: '',
  });

  const handleChange = (field: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFields(prev => ({ ...prev, [field]: value }));
    if (onFormDataChange) onFormDataChange(field, value);
  };

  return (
    <div className={`${isMobileHorizontal ? 'space-y-3' : 'space-y-8'} animate-fadeIn`}>
      <div className={`text-center ${isMobileHorizontal ? 'mb-3' : 'mb-8'}`}>
        <div className="pixel-border-thick bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-pixel-pattern opacity-5"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="pixel-border bg-gradient-to-br from-indigo-500 to-purple-500 p-3 relative overflow-hidden">
                <FileText className="w-8 h-8 text-white" />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 blur-sm opacity-50 -z-10"></div>
              </div>
              <div>
                <h2 className={`pixel-text ${isMobileHorizontal ? 'text-xl' : 'text-4xl'} font-black text-white mb-1`} style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.7), 0 0 20px rgba(99,102,241,0.3)' }}>
                  FINAL STATEMENT
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="pixel-border-thick bg-gray-900/50 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-pixel-pattern opacity-5"></div>
          <div className="relative z-10">
            <div 
              className={`pixel-border bg-gradient-to-r from-indigo-900 to-purple-900 relative overflow-hidden ${isMobileHorizontal ? 'p-4' : 'p-6'}`}
            >
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 4px,
                    rgba(255,255,255,0.1) 4px,
                    rgba(255,255,255,0.1) 8px
                  )`
                }}></div>
              </div>
              <div className="relative z-10 text-lg text-white leading-relaxed font-bold">
                <span className="text-indigo-300 font-black">"Our innovation solves </span>
                <input
                  className="inline-block text-red-400 font-black bg-red-900/30 px-2 py-1 w-40 mx-1 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                  type="text"
                  value={fields.problem}
                  onChange={handleChange('problem')}
                  placeholder="(problem)"
                />
                <span className="text-indigo-300 font-black"> by using </span>
                <input
                  className="inline-block text-blue-400 font-black bg-blue-900/30 px-2 py-1 w-32 mx-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  type="text"
                  value={fields.technology}
                  onChange={handleChange('technology')}
                  placeholder="(technology)"
                />
                <span className="text-indigo-300 font-black">, built with </span>
                <input
                  className="inline-block text-green-400 font-black bg-green-900/30 px-2 py-1 w-32 mx-1 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  type="text"
                  value={fields.collaboration}
                  onChange={handleChange('collaboration')}
                  placeholder="(collaboration)"
                />
                <span className="text-indigo-300 font-black">, adding </span>
                <input
                  className="inline-block text-purple-400 font-black bg-purple-900/30 px-2 py-1 w-32 mx-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                  type="text"
                  value={fields.creativity}
                  onChange={handleChange('creativity')}
                  placeholder="(creative twist)"
                />
                <span className="text-indigo-300 font-black">. It can grow with </span>
                <input
                  className="inline-block text-orange-400 font-black bg-orange-900/30 px-2 py-1 w-32 mx-1 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                  type="text"
                  value={fields.speedScale}
                  onChange={handleChange('speedScale')}
                  placeholder="(speed & scale)"
                />
                <span className="text-indigo-300 font-black"> and will create </span>
                <input
                  className="inline-block text-teal-400 font-black bg-teal-900/30 px-2 py-1 w-32 mx-1 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
                  type="text"
                  value={fields.impact}
                  onChange={handleChange('impact')}
                  placeholder="(purpose/impact)"
                />
                <span className="text-indigo-300 font-black">."</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalStatementStage;
