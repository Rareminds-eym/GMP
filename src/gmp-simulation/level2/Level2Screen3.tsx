import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import LevelCompletionPopup from './components/LevelCompletionPopup';
import BriefPopup from './components/BriefPopup';

const Level2Screen3: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<{ email: string; case_id: number; updated_at: string, description?: string } | null>(null);
  const navigate = useNavigate();
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
    file: null,
    finalProblem: '',
    finalTechnology: '',
    finalCollaboration: '',
    finalCreativity: '',
    finalSpeedScale: '',
    finalImpact: '',
  });
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { isMobile, isHorizontal } = useDeviceLayout();
  const isMobileHorizontal = isMobile && isHorizontal;

  // Calculate progress based on completed stages
  useEffect(() => {
    // Only count stages that require user input (exclude always-complete/optional stages 7 and 8)
    const inputStages = [1, 2, 3, 4, 5, 6, 9];
    let completed = 0;
    for (const i of inputStages) {
      if (isStageComplete(i)) completed++;
    }
    setProgress(completed === 0 ? 0 : (completed / inputStages.length) * 100);
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
      color: "from-pink-500 to-yellow-500", 
      bgColor: "from-pink-900/20 to-yellow-900/20",
      accent: "pink",
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
      case 7:
        // All final statement fields must be filled (use unique keys)
        return (
          !!formData.finalProblem && formData.finalProblem.trim() !== '' &&
          !!formData.finalTechnology && formData.finalTechnology.trim() !== '' &&
          !!formData.finalCollaboration && formData.finalCollaboration.trim() !== '' &&
          !!formData.finalCreativity && formData.finalCreativity.trim() !== '' &&
          !!formData.finalSpeedScale && formData.finalSpeedScale.trim() !== '' &&
          !!formData.finalImpact && formData.finalImpact.trim() !== ''
        );
      case 8: return true; // Prototype/Demo/Sketch is optional
      case 9: return formData.reflection.length > 0;
      default: return false;
    }
  };

  const canProceed = isStageComplete(stage);

  const handleProceed = () => {
    if (canProceed) {
      setShowProceedWarning(true);
    }
  };

  const handleConfirmProceed = () => {
    setShowProceedWarning(false);
    if (stage === 8) {
      // Just advance to stage 9, do not show completion popup yet
      setStage(stage + 1);
    } else if (stage === 9) {
      // User is completing the last stage, show completion popup
      setShowCompletionPopup(true);
    } else {
      setStage(stage + 1);
    }
  };

  return (
    <>
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

          {/* Brief Popup as component */}
          <BriefPopup
            show={showBrief && !!selectedCase}
            description={selectedCase?.description}
            isMobileHorizontal={isMobileHorizontal}
            onClose={() => setShowBrief(false)}
          />

          {/* Confirmation Modal */}
          <ConfirmationModal 
            show={showProceedWarning}
            onClose={() => setShowProceedWarning(false)}
            onConfirm={handleConfirmProceed}
          />

          {/* Level Completion Popup */}
          <LevelCompletionPopup
            show={showCompletionPopup && stage === 9}
            onContinue={() => navigate('/modules')}
            message="Congratulations! You have completed all stages of Level 2."
          />
        </div>
      </div>
    </>
  );
};

export default Level2Screen3;
