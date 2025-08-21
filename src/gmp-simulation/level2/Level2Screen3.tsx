import React, { useState } from 'react';
import { useDeviceLayout } from '../../hooks/useOrientation';
import { ChevronLeft, ChevronRight, Lightbulb, Users, Zap, Target, Rocket, Globe, FileText, Sparkles, Upload, CheckCircle } from 'lucide-react';

const Level2Screen3: React.FC = () => {
  const [stage, setStage] = useState(1);
  const [problem, setProblem] = useState('');
  const [technology, setTechnology] = useState('');
  const [collaboration, setCollaboration] = useState('');
  const [creativity, setCreativity] = useState('');
  const [speedScale, setSpeedScale] = useState('');
  const [impact, setImpact] = useState('');
  const [reflection, setReflection] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { isMobile, isHorizontal } = useDeviceLayout();
  const isMobileHorizontal = isMobile && isHorizontal;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const stages = [
    { icon: Target, title: "Problem", color: "from-red-600 to-red-500" },
    { icon: Zap, title: "Technology", color: "from-blue-600 to-blue-500" },
    { icon: Users, title: "Collaboration", color: "from-green-600 to-green-500" },
    { icon: Sparkles, title: "Creativity", color: "from-purple-600 to-purple-500" },
    { icon: Rocket, title: "Speed & Scale", color: "from-orange-600 to-orange-500" },
    { icon: Globe, title: "Purpose & Impact", color: "from-teal-600 to-teal-500" },
    { icon: FileText, title: "Final Statement", color: "from-indigo-600 to-indigo-500" },
    { icon: Upload, title: "Prototype", color: "from-gray-600 to-gray-500" },
    { icon: Lightbulb, title: "Reflection", color: "from-yellow-600 to-yellow-500" }
  ];

  const currentStageData = stages[stage - 1];
  const progress = (stage / 9) * 100;

  const isStageComplete = (stageNum: number) => {
    switch(stageNum) {
      case 1: return problem.length > 0;
      case 2: return technology.length > 0;
      case 3: return collaboration.length > 0;
      case 4: return creativity.length > 0;
      case 5: return speedScale.length > 0;
      case 6: return impact.length > 0;
      case 7: return true; // Final statement is always complete
      case 8: return file !== null;
      case 9: return reflection.length > 0;
      default: return false;
    }
  };

  const canProceed = isStageComplete(stage);

  return (
  <div
    className={`min-h-screen bg-gray-800 overflow-hidden relative flex flex-col${isMobileHorizontal ? ' compact-mobile-horizontal' : ''}`}
    style={{ fontFamily: 'Verdana, Arial, sans-serif', maxHeight: '100vh', height: '100vh' }}
  >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 255, 0.1) 2px,
            rgba(0, 255, 255, 0.1) 4px
          )`
        }}></div>
      </div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 255, 0.05) 2px,
            rgba(0, 255, 255, 0.05) 4px
          )`
        }}></div>
      </div>
      
  <div
    className={`relative z-10 max-w-6xl mx-auto flex flex-col h-full max-h-full w-full ${isMobileHorizontal ? 'px-0 py-1' : 'px-1 xs:px-2 sm:px-4 py-2 xs:py-3 sm:py-6'}`}
  >
        {/* Header */}
  <div className={isMobileHorizontal ? 'mb-2' : 'mb-6'}>
          <div 
            className={`bg-gradient-to-r from-cyan-600 to-blue-600 relative overflow-hidden ${isMobileHorizontal ? 'p-2' : 'p-4'}`}
            style={{
              border: '2px solid #0891b2',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
            }}
          >
            <div className="absolute inset-0 opacity-10">
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
            <div className={`relative z-10 flex items-center ${isMobileHorizontal ? 'space-x-1' : 'space-x-3'}`}>
              <div 
                className={`bg-cyan-800 flex items-center justify-center ${isMobileHorizontal ? 'p-1' : 'p-3'}`}
                style={{ border: '1px solid #0891b2' }}
              >
                <currentStageData.icon className="w-8 h-8 text-cyan-300" />
              </div>
              <div>
                <h1 className={`${isMobileHorizontal ? 'text-lg' : 'text-3xl'} font-black text-white`} style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
                  INNOVATION TEMPLATE
                </h1>
                <p className={`text-cyan-100 font-bold ${isMobileHorizontal ? 'text-xs' : ''}`}>TRANSFORM IDEAS INTO IMPACT</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
  <div className={isMobileHorizontal ? 'mb-2' : 'mb-6'}>
          <div 
            className={`bg-gray-800 ${isMobileHorizontal ? 'p-2' : 'p-4'}`}
            style={{ border: '2px solid #374151' }}
          >
            <div className={`flex justify-between items-center ${isMobileHorizontal ? 'mb-1' : 'mb-2'}`}>
              <span className={`${isMobileHorizontal ? 'text-xs' : 'text-sm'} font-black text-cyan-300`}>STEP {stage} OF 9</span>
              <span className={`${isMobileHorizontal ? 'text-xs' : 'text-sm'} font-black text-cyan-300`}>{Math.round(progress)}% COMPLETE</span>
            </div>
            <div className={`w-full bg-gray-700 ${isMobileHorizontal ? 'h-2' : 'h-3'}`} style={{ border: '1px solid #4b5563' }}>
              <div 
                className={`h-full bg-gradient-to-r ${currentStageData.color} transition-all duration-500 ease-out`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Stage indicators */}
        <div className={`${isMobileHorizontal ? 'mb-2' : 'mb-6'} overflow-x-auto`}>
          <div className={`flex ${isMobileHorizontal ? 'gap-1' : 'gap-2'} min-w-max pb-2`}>
            {stages.map((stageData, index) => {
              const stageNumber = index + 1;
              const isCurrent = stageNumber === stage;
              const isCompleted = stageNumber < stage || isStageComplete(stageNumber);
              
              return (
                <div
                  key={stageNumber}
                  className={`flex flex-col items-center transition-all duration-300 cursor-pointer ${isMobileHorizontal ? 'p-1' : 'p-2'} ${
                    isCurrent 
                      ? 'bg-cyan-900/50 scale-105' 
                      : isCompleted 
                        ? 'bg-green-900/30 hover:bg-green-900/50' 
                        : 'bg-gray-800/50 hover:bg-gray-700/50'
                  }`}
                  style={{ border: '1px solid #374151' }}
                  onClick={() => setStage(stageNumber)}
                >
                  <div className={`${isMobileHorizontal ? 'p-1' : 'p-2'} mb-1 transition-all duration-300 ${
                    isCurrent 
                      ? `bg-gradient-to-r ${stageData.color}` 
                      : isCompleted 
                        ? 'bg-green-600' 
                        : 'bg-gray-700'
                  }`}
                  style={{ border: '1px solid #4b5563' }}
                  >
                    {isCompleted && !isCurrent ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <stageData.icon className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className={`${isMobileHorizontal ? 'text-[10px]' : 'text-xs'} font-black ${
                    isCurrent ? 'text-cyan-300' : isCompleted ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {stageData.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main content area */}
        <div 
          className={`bg-gray-800 relative overflow-hidden flex-1 min-h-0 max-h-full ${isMobileHorizontal ? 'p-2 mb-2' : 'p-6 mb-6'}`}
          style={{ 
            border: '3px solid #374151',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
            overflow: 'auto',
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 8px,
                rgba(0,255,255,0.1) 8px,
                rgba(0,255,255,0.1) 16px
              )`
            }}></div>
          </div>
          
          <div className="relative z-10 min-h-[400px]">
            {stage === 1 && (
              <div className="space-y-6">
                <div className={`text-center ${isMobileHorizontal ? 'mb-2' : 'mb-6'}`}>
                  <h2 className={`${isMobileHorizontal ? 'text-lg' : 'text-3xl'} font-black text-white mb-2`} style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
                    PROBLEM IDENTIFICATION
                  </h2>
                  <p className={`text-cyan-300 font-bold ${isMobileHorizontal ? 'text-xs' : 'text-lg'}`}>EVERY INNOVATION STARTS WITH A PROBLEM</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={`block font-black text-cyan-300 mb-1 ${isMobileHorizontal ? 'text-sm' : 'text-lg'}`}>TARGET PROBLEM:</label>
                    <p className={`text-gray-300 font-bold ${isMobileHorizontal ? 'mb-1 text-xs' : 'mb-3'}`}>What issue are you addressing? Who faces this problem?</p>
                    <textarea
                      className={`w-full bg-gray-900 text-white font-bold resize-none focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 ${isMobileHorizontal ? 'p-1 min-h-[40px] text-xs' : 'p-1 xs:p-2 sm:p-4 min-h-[60px] xs:min-h-[80px] sm:min-h-[120px] text-xs xs:text-sm sm:text-base'}`}
                      style={{ 
                        border: '2px solid #4b5563',
                        fontFamily: 'Verdana, Arial, sans-serif'
                      }}
                      value={problem}
                      onChange={e => setProblem(e.target.value)}
                      placeholder="DESCRIBE THE PROBLEM IN DETAIL..."
                    />
                  </div>
                </div>
              </div>
            )}

            {stage === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-black text-white mb-2" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
                    TECHNOLOGY INTEGRATION
                  </h2>
                  <p className="text-cyan-300 text-lg font-bold">AMPLIFY YOUR SOLUTION WITH TECH</p>
                </div>
                <div>
                  <label className={`block font-black text-cyan-300 mb-1 ${isMobileHorizontal ? 'text-sm' : 'text-lg'}`}>TECH STACK:</label>
                  <p className={`text-gray-300 font-bold ${isMobileHorizontal ? 'mb-1 text-xs' : 'mb-3'}`}>What tools, apps, or digital aids will strengthen your solution?</p>
                  <input
                    type="text"
                    className={`w-full bg-gray-900 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${isMobileHorizontal ? 'p-1 text-xs' : 'p-1 xs:p-2 sm:p-4 text-xs xs:text-sm sm:text-base'}`}
                    style={{ 
                      border: '2px solid #4b5563',
                      fontFamily: 'Verdana, Arial, sans-serif'
                    }}
                    value={technology}
                    onChange={e => setTechnology(e.target.value)}
                    placeholder="E.G., AI/ML, MOBILE APP, IOT DEVICES..."
                  />
                </div>
              </div>
            )}

            {stage === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-black text-white mb-2" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
                    COLLABORATION NETWORK
                  </h2>
                  <p className="text-cyan-300 text-lg font-bold">UNITE FORCES FOR MAXIMUM IMPACT</p>
                </div>
                <div>
                  <label className={`block font-black text-cyan-300 mb-1 ${isMobileHorizontal ? 'text-sm' : 'text-lg'}`}>ALLIANCE PARTNERS:</label>
                  <p className={`text-gray-300 font-bold ${isMobileHorizontal ? 'mb-1 text-xs' : 'mb-3'}`}>Who can you team up with to scale your idea?</p>
                  <input
                    type="text"
                    className={`w-full bg-gray-900 text-white font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${isMobileHorizontal ? 'p-1 text-xs' : 'p-1 xs:p-2 sm:p-4 text-xs xs:text-sm sm:text-base'}`}
                    style={{ 
                      border: '2px solid #4b5563',
                      fontFamily: 'Verdana, Arial, sans-serif'
                    }}
                    value={collaboration}
                    onChange={e => setCollaboration(e.target.value)}
                    placeholder="E.G., STUDENT ORGS, LOCAL BUSINESSES, NGOS..."
                  />
                </div>
              </div>
            )}

            {stage === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-black text-white mb-2" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
                    CREATIVE EDGE
                  </h2>
                  <p className="text-cyan-300 text-lg font-bold">YOUR UNIQUE INNOVATION FACTOR</p>
                </div>
                <div>
                  <label className={`block font-black text-cyan-300 mb-1 ${isMobileHorizontal ? 'text-sm' : 'text-lg'}`}>DIFFERENTIATION:</label>
                  <p className={`text-gray-300 font-bold ${isMobileHorizontal ? 'mb-1 text-xs' : 'mb-3'}`}>What unique approach makes your idea stand out?</p>
                  <input
                    type="text"
                    className={`w-full bg-gray-900 text-white font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${isMobileHorizontal ? 'p-1 text-xs' : 'p-1 xs:p-2 sm:p-4 text-xs xs:text-sm sm:text-base'}`}
                    style={{ 
                      border: '2px solid #4b5563',
                      fontFamily: 'Verdana, Arial, sans-serif'
                    }}
                    value={creativity}
                    onChange={e => setCreativity(e.target.value)}
                    placeholder="E.G., GAMIFICATION, NOVEL ALGORITHM, CREATIVE UX..."
                  />
                </div>
              </div>
            )}

            {stage === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-black text-white mb-2" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
                    RAPID DEPLOYMENT
                  </h2>
                  <p className="text-cyan-300 text-lg font-bold">FROM PROTOTYPE TO GLOBAL SCALE</p>
                </div>
                <div>
                  <label className={`block font-black text-cyan-300 mb-1 ${isMobileHorizontal ? 'text-sm' : 'text-lg'}`}>SCALING STRATEGY:</label>
                  <p className={`text-gray-300 font-bold ${isMobileHorizontal ? 'mb-1 text-xs' : 'mb-3'}`}>How can you deploy quickly and scale globally?</p>
                  <input
                    type="text"
                    className={`w-full bg-gray-900 text-white font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${isMobileHorizontal ? 'p-1 text-xs' : 'p-1 xs:p-2 sm:p-4 text-xs xs:text-sm sm:text-base'}`}
                    style={{ 
                      border: '2px solid #4b5563',
                      fontFamily: 'Verdana, Arial, sans-serif'
                    }}
                    value={speedScale}
                    onChange={e => setSpeedScale(e.target.value)}
                    placeholder="E.G., CLOUD DEPLOYMENT, FRANCHISE MODEL, OPEN SOURCE..."
                  />
                </div>
              </div>
            )}

            {stage === 6 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-black text-white mb-2" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
                    IMPACT ASSESSMENT
                  </h2>
                  <p className="text-cyan-300 text-lg font-bold">MEASURE YOUR VALUE CREATION</p>
                </div>
                <div>
                  <label className={`block font-black text-cyan-300 mb-1 ${isMobileHorizontal ? 'text-sm' : 'text-lg'}`}>VALUE DELIVERY:</label>
                  <p className={`text-gray-300 font-bold ${isMobileHorizontal ? 'mb-1 text-xs' : 'mb-3'}`}>What meaningful change will your innovation create?</p>
                  <input
                    type="text"
                    className={`w-full bg-gray-900 text-white font-bold focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 ${isMobileHorizontal ? 'p-1 text-xs' : 'p-1 xs:p-2 sm:p-4 text-xs xs:text-sm sm:text-base'}`}
                    style={{ 
                      border: '2px solid #4b5563',
                      fontFamily: 'Verdana, Arial, sans-serif'
                    }}
                    value={impact}
                    onChange={e => setImpact(e.target.value)}
                    placeholder="E.G., REDUCES CARBON FOOTPRINT, CREATES JOBS..."
                  />
                </div>
              </div>
            )}

            {stage === 7 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-black text-white mb-2" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
                    MISSION STATEMENT
                  </h2>
                  <p className="text-cyan-300 text-lg font-bold">YOUR COMPLETE INNOVATION PROFILE</p>
                </div>
                <div 
                  className="bg-gradient-to-r from-indigo-900 to-purple-900 p-6 relative overflow-hidden"
                  style={{ border: '2px solid #4338ca' }}
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
                    <span className="text-indigo-300 font-black">OUR INNOVATION SOLVES</span>{' '}
                    <span className="text-red-400 font-black bg-red-900/30 px-2 py-1">
                      {problem || '_____'}
                    </span>{' '}
                    <span className="text-indigo-300 font-black">BY USING</span>{' '}
                    <span className="text-blue-400 font-black bg-blue-900/30 px-2 py-1">
                      {technology || 'TECHNOLOGY'}
                    </span>,{' '}
                    <span className="text-indigo-300 font-black">BUILT WITH</span>{' '}
                    <span className="text-green-400 font-black bg-green-900/30 px-2 py-1">
                      {collaboration || 'COLLABORATION'}
                    </span>,{' '}
                    <span className="text-indigo-300 font-black">ADDING</span>{' '}
                    <span className="text-purple-400 font-black bg-purple-900/30 px-2 py-1">
                      {creativity || 'CREATIVE TWIST'}
                    </span>.{' '}
                    <span className="text-indigo-300 font-black">IT CAN GROW WITH</span>{' '}
                    <span className="text-orange-400 font-black bg-orange-900/30 px-2 py-1">
                      {speedScale || 'SPEED & SCALE'}
                    </span>{' '}
                    <span className="text-indigo-300 font-black">AND WILL CREATE</span>{' '}
                    <span className="text-teal-400 font-black bg-teal-900/30 px-2 py-1">
                      {impact || 'PURPOSE/IMPACT'}
                    </span>.
                  </div>
                </div>
              </div>
            )}

            {stage === 8 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-black text-white mb-2" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
                    PROTOTYPE UPLOAD
                  </h2>
                  <p className="text-cyan-300 text-lg font-bold">SUBMIT YOUR DEMO OR SKETCH</p>
                </div>
                <div 
                  className="border-2 border-dashed border-gray-600 p-8 text-center hover:border-gray-500 transition-colors duration-300 bg-gray-900/50"
                >
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-lg font-black text-white mb-2 block">UPLOAD PDF PROTOTYPE</span>
                    <span className="text-gray-400 block mb-4 font-bold">DRAG & DROP OR CLICK TO BROWSE</span>
                    <input
                      id="file-upload"
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <div 
                      className="inline-flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-300 font-black"
                      style={{ border: '1px solid #4b5563' }}
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      SELECT FILE
                    </div>
                  </label>
                  {file && (
                    <div 
                      className="mt-4 p-4 bg-green-900/30 relative overflow-hidden"
                      style={{ border: '2px solid #16a34a' }}
                    >
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0" style={{
                          backgroundImage: `repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 4px,
                            rgba(0,255,0,0.1) 4px,
                            rgba(0,255,0,0.1) 8px
                          )`
                        }}></div>
                      </div>
                      <div className="relative z-10">
                        <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                        <span className="text-green-400 font-black">{file.name}</span>
                        <p className="text-green-300 text-sm mt-1 font-bold">FILE UPLOAD SUCCESSFUL</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {stage === 9 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-black text-white mb-2" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
                    MISSION DEBRIEF
                  </h2>
                  <p className="text-cyan-300 text-lg font-bold">ANALYZE YOUR INNOVATION JOURNEY</p>
                </div>
                <div>
                  <label className="block text-lg font-black text-cyan-300 mb-2">REFLECTION LOG:</label>
                  <p className="text-gray-300 mb-3 font-bold">What did you learn? What would you improve?</p>
                  <textarea
                    className={`w-full bg-gray-900 text-white font-bold resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300 ${isMobileHorizontal ? 'p-1 min-h-[40px] text-xs' : 'p-4 min-h-[120px]'}`}
                    style={{ 
                      border: '2px solid #4b5563',
                      fontFamily: 'Verdana, Arial, sans-serif'
                    }}
                    value={reflection}
                    onChange={e => setReflection(e.target.value)}
                    placeholder="DOCUMENT YOUR LEARNINGS AND IMPROVEMENTS..."
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
  <div className={`flex justify-between items-center ${isMobileHorizontal ? 'gap-1' : ''}`}>
          <button
            className={`flex items-center bg-gray-700 hover:bg-gray-600 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-black ${isMobileHorizontal ? 'gap-1 px-2 py-1 text-xs' : 'gap-1 xs:gap-2 px-3 xs:px-4 sm:px-6 py-2 xs:py-3 text-xs xs:text-sm sm:text-base'}`}
            style={{ border: '2px solid #4b5563' }}
            onClick={() => setStage(stage - 1)}
            disabled={stage === 1}
          >
            <ChevronLeft className="w-5 h-5" />
            PREVIOUS
          </button>

          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1 font-bold">
              {canProceed ? "READY TO PROCEED" : "COMPLETE CURRENT STEP"}
            </div>
            <div className={`w-3 h-3 mx-auto transition-all duration-300 ${
              canProceed ? 'bg-green-400 animate-pulse' : 'bg-gray-600'
            }`} style={{ border: '1px solid #4b5563' }}></div>
          </div>

          <button
            className={`flex items-center transition-all duration-300 font-black ${isMobileHorizontal ? 'gap-1 px-2 py-1 text-xs' : 'gap-1 xs:gap-2 px-3 xs:px-4 sm:px-6 py-2 xs:py-3 text-xs xs:text-sm sm:text-base'} ${
              stage === 9 
                ? 'bg-green-600 hover:bg-green-500' 
                : canProceed 
                  ? `bg-gradient-to-r ${currentStageData.color} hover:scale-105`
                  : 'bg-gray-700 cursor-not-allowed opacity-50'
            }`}
            style={{ border: '2px solid #4b5563' }}
            onClick={() => setStage(stage + 1)}
            disabled={stage === 9 || !canProceed}
          >
            {stage === 9 ? 'COMPLETE MISSION' : 'NEXT'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Level2Screen3;