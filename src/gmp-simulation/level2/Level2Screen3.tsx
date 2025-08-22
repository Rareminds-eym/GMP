import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { hackathonData } from '../HackathonData';
import { useAuth } from './../../contexts/AuthContext';
import { useDeviceLayout } from '../../hooks/useOrientation';
import { Lightbulb, Users, Zap, Target, Rocket, Globe, FileText, Sparkles, Upload } from 'lucide-react';
import { StageData, StageFormData } from './types';
import Header from './components/Header';

import ProgressTrack from './components/ProgressTrack';
import StageContent from './components/StageContent';
import NavigationBar from './components/NavigationBar';
import ConfirmationModal from './components/ConfirmationModal';

const Level2Screen3: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<{ email: string; case_id: number; updated_at: string, description?: string } | null>(null);
  const [showBrief, setShowBrief] = useState(false);
  const [loadingCase, setLoadingCase] = useState(true);
  const [caseError, setCaseError] = useState<string | null>(null);
  // Fetch selected case on mount
  const { user } = useAuth();
  useEffect(() => {
    if (!user) return;
    // Fetch selected_cases data for the current user from Supabase
    const fetchSelectedCase = async () => {
      setLoadingCase(true);
      setCaseError(null);
      try {
        const userEmail = user.email;
        if (!userEmail) throw new Error('User email not found');
        // Fetch the selected case for the user
        const { data, error } = await supabase
          .from('selected_cases')
          .select('*')
          .eq('email', userEmail)
          .order('updated_at', { ascending: false })
          .limit(1);
        if (error) throw error;
        if (Array.isArray(data) && data.length > 0) {
          const selected = data[0];
          // Find the question in hackathonData by id (case_id)
          const question = hackathonData.find(q => q.id === selected.case_id);
          setSelectedCase({ ...selected, description: question ? question.caseFile : undefined });
        } else {
          setSelectedCase(null);
        }
      } catch (error: any) {
        setSelectedCase(null);
        setCaseError(error.message || error.toString() || 'Unknown error');
      } finally {
        setLoadingCase(false);
      }
    };
    fetchSelectedCase();
  }, [user]);
  const [stage, setStage] = useState(1);
  const [showProceedWarning, setShowProceedWarning] = useState(false);
  const [formData, setFormData] = useState<StageFormData>({
  problem: '', 
    technology: '',
    collaboration: '',
    creativity: '',
    speedScale: '',
    impact: '',
    reflection: '',
    file: null
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { isMobile, isHorizontal } = useDeviceLayout();
  const isMobileHorizontal = isMobile && isHorizontal;

  // Calculate progress based on completed stages
  useEffect(() => {
    let completed = 0;
    for (let i = 1; i <= 9; i++) {
      if (isStageComplete(i)) completed++;
    }
    setProgress((completed / 9) * 100);
  }, [formData]);

  const handleFormDataChange = (field: keyof StageFormData, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const stages: StageData[] = [
    { 
      icon: Target, 
      title: "Problem", 
      subtitle: "Identify",
      color: "from-red-500 to-pink-500", 
      bgColor: "from-red-900/20 to-pink-900/20",
      accent: "red",
      description: "Define the core issue you're solving",
      caseNumber: 1
    },
    { 
      icon: Zap, 
      title: "Technology", 
      subtitle: "Amplify",
      color: "from-blue-500 to-cyan-500", 
      bgColor: "from-blue-900/20 to-cyan-900/20",
      accent: "blue",
      description: "Choose your tech stack wisely",
      caseNumber: 2
    },
    { 
      icon: Users, 
      title: "Collaboration", 
      subtitle: "Unite",
      color: "from-green-500 to-emerald-500", 
      bgColor: "from-green-900/20 to-emerald-900/20",
      accent: "green",
      description: "Build strategic partnerships",
      caseNumber: 3
    },
    { 
      icon: Sparkles, 
      title: "Creativity", 
      subtitle: "Innovate",
      color: "from-purple-500 to-violet-500", 
      bgColor: "from-purple-900/20 to-violet-900/20",
      accent: "purple",
      description: "Add your unique twist",
      caseNumber: 4
    },
    { 
      icon: Rocket, 
      title: "Speed & Scale", 
      subtitle: "Deploy",
      color: "from-orange-500 to-red-500", 
      bgColor: "from-orange-900/20 to-red-900/20",
      accent: "orange",
      description: "Plan for rapid growth",
      caseNumber: 5
    },
    { 
      icon: Globe, 
      title: "Purpose & Impact", 
      subtitle: "Transform",
      color: "from-teal-500 to-cyan-500", 
      bgColor: "from-teal-900/20 to-cyan-900/20",
      accent: "teal",
      description: "Measure meaningful change",
      caseNumber: 6
    },
    { 
      icon: FileText, 
      title: "Mission Statement", 
      subtitle: "Synthesize",
      color: "from-indigo-500 to-purple-500", 
      bgColor: "from-indigo-900/20 to-purple-900/20",
      accent: "indigo",
      description: "Craft your innovation story",
      caseNumber: 7
    },
    { 
      icon: Upload, 
      title: "Prototype", 
      subtitle: "Demonstrate",
      color: "from-gray-500 to-slate-500", 
      bgColor: "from-gray-900/20 to-slate-900/20",
      accent: "gray",
      description: "Optional: Show your solution in action",
      caseNumber: 8
    },
    { 
      icon: Lightbulb, 
      title: "Reflection", 
      subtitle: "Learn",
      color: "from-yellow-500 to-amber-500", 
      bgColor: "from-yellow-900/20 to-amber-900/20",
      accent: "yellow",
      description: "Document your journey",
      caseNumber: 9
    }
  ];

  const currentStageData = stages[stage - 1];

  const isStageComplete = (stageNum: number) => {
    switch(stageNum) {
      case 1: return formData.problem.length > 0;
      case 2: return formData.technology.length > 0;
      case 3: return formData.collaboration.length > 0;
      case 4: return formData.creativity.length > 0;
      case 5: return formData.speedScale.length > 0;
      case 6: return formData.impact.length > 0;
      case 7: return true; // Final statement is always complete
      case 8: return true; // Prototype/Demo/Sketch is optional
      case 9: return formData.reflection.length > 0;
      default: return false;
    }
  };

  const canProceed = isStageComplete(stage);

  const handleProceed = () => {
    if (canProceed && stage !== 9) {
      setShowProceedWarning(true);
    }
  };

  const handleConfirmProceed = () => {
    setShowProceedWarning(false);
    setStage(stage + 1);
  };

  return (
    <div
      className={`min-h-screen bg-gray-800 relative flex flex-col compact-all${isMobileHorizontal ? ' compact-mobile-horizontal' : ''}`}
      style={{ fontFamily: 'Verdana, Geneva, Tahoma, sans-serif', fontSize: isMobileHorizontal ? '12px' : '13px', lineHeight: 1.2, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}
    >
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-pixel-pattern opacity-10"></div>
      <div className="fixed inset-0 bg-scan-lines opacity-20"></div>
      
      <div
        className={`relative z-10 max-w-6xl mx-auto flex flex-col w-full ${isMobileHorizontal ? 'px-0 py-1 pb-5' : 'px-1 xs:px-2 sm:px-4 py-2 xs:py-3 sm:py-6 pb-5'}`}
      >
        {/* Header */}
        <Header 
          currentStageData={currentStageData}
          progress={progress}
          isMobileHorizontal={isMobileHorizontal}
          selectedCase={selectedCase}
          onShowBrief={() => setShowBrief(true)}
        />
        {/* Loading/Error for Brief Button */}
        {loadingCase && (
          <div className="text-xs text-cyan-300 mt-2">Loading previously selected case...</div>
        )}
        {caseError && (
          <div className="text-xs text-red-400 mt-2">Error loading case: {caseError} (showing fallback)</div>
        )}
      {/* Brief Popup */}
      {showBrief && selectedCase && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-all"
          onClick={e => {
            if (e.target === e.currentTarget) setShowBrief(false);
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full relative border-2 border-cyan-700 animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-cyan-700 text-2xl font-bold focus:outline-none"
              onClick={() => setShowBrief(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex items-center mb-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 mr-3">
                <svg className="w-5 h-5 text-cyan-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m9 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </span>
              <h2 className="text-xl font-bold text-cyan-800">Selected Question</h2>
            </div>
            <div className="mb-2 text-gray-700 text-base">
              {/* Show the question description. Replace with your actual field name if different. */}
              {selectedCase.description || 'No description available for this question.'}
            </div>
          </div>
        </div>
      )}

        {/* Progress Track */}
        {!isMobileHorizontal && (
          <ProgressTrack 
            stages={stages}
            currentStage={stage}
            isStageComplete={isStageComplete}
            onStageClick={setStage}
            progress={progress}
            isMobileHorizontal={isMobileHorizontal}
            isAnimating={isAnimating}
            setIsAnimating={setIsAnimating}
          />
        )}

        {/* Stage Content */}
        <StageContent 
          stage={stage}
          formData={formData}
          onFormDataChange={handleFormDataChange}
          isMobileHorizontal={isMobileHorizontal}
          isAnimating={isAnimating}
        />

        {/* Navigation Bar */}
        <NavigationBar 
          stage={stage}
          canProceed={canProceed}
          currentStageData={currentStageData}
          isMobileHorizontal={isMobileHorizontal}
          onProceed={handleProceed}
        />
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal 
        show={showProceedWarning}
        onClose={() => setShowProceedWarning(false)}
        onConfirm={handleConfirmProceed}
      />
    </div>
  );
};

export default Level2Screen3;
