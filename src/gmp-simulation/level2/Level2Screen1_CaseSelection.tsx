import React, { useEffect, useState } from 'react';
import { saveSelectedCase } from './supabaseHelpers';
import { supabase } from '../../lib/supabase';
import { fetchLevel1CasesForTeam, AttemptDetail } from './fetchLevel1Cases';
import { hackathonData } from '../HackathonData';
import ConfirmModal from './ui/ConfirmModal';
import CaseQuestionModal from './ui/CaseQuestionModal';

interface TeamMember {
  name: string;
  email: string;
  full_name?: string;
}

interface Level2Screen1Props {
  teamName: string;
  teamMembers: TeamMember[];
  selectedCases: { [email: string]: number };
  onSelectCase: (email: string, caseId: number) => void;
  onContinue: () => void;
}

const Level2Screen1_CaseSelection: React.FC<Level2Screen1Props> = ({
  teamName,
  teamMembers,
  selectedCases,
  onSelectCase,
  onContinue,
}) => {
  // DEBUG: Log props on mount
  React.useEffect(() => {
    console.log('[Level2Screen1_CaseSelection] teamName:', teamName);
    console.log('[Level2Screen1_CaseSelection] teamMembers:', teamMembers);
    console.log('[Level2Screen1_CaseSelection] selectedCases:', selectedCases);
  }, [teamName, teamMembers, selectedCases]);
  const [loading, setLoading] = useState(true);
  const [casesByMember, setCasesByMember] = useState<Record<string, AttemptDetail[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; email: string | null; caseId: number | null }>({ open: false, email: null, caseId: null });

  // mobile modal for viewing/navigating cases
  const [mobileCaseIndex, setMobileCaseIndex] = useState<number | null>(null);

  // For desktop: show question modal on click
  const [modalCase, setModalCase] = useState<null | { question: string; member: TeamMember; attempt: AttemptDetail; idx: number }>(null);

  useEffect(() => {
    setLoading(true);
    console.log('[Level2Screen1_CaseSelection] Fetching Level 1 cases for teamMembers:', teamMembers);
    fetchLevel1CasesForTeam(teamMembers)
      .then((result) => {
        console.log('[Level2Screen1_CaseSelection] fetchLevel1CasesForTeam result:', result);
        setCasesByMember(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[Level2Screen1_CaseSelection] Failed to load cases:', err);
        setError('Failed to load cases.');
        setLoading(false);
      });
  }, [teamMembers]);

  useEffect(() => {
    if (confirmModal.open || mobileCaseIndex !== null) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [confirmModal.open, mobileCaseIndex]);

  // Helper to save selected case to Supabase
  const handleSaveSelectedCase = async (_email: string, attemptOrCaseId: number | AttemptDetail) => {
    try {
      // Always resolve the hackathonData id, prefer attempt.hackathon_id if present
      let hackathonId: number | undefined;
      if (typeof attemptOrCaseId === 'number') {
        hackathonId = hackathonData.find(q => q.id === attemptOrCaseId)?.id;
      } else {
        // Prefer hackathon_id if present
        if ('hackathon_id' in attemptOrCaseId && attemptOrCaseId.hackathon_id) {
          hackathonId = attemptOrCaseId.hackathon_id;
        } else {
          // Fallback to extracting from question
          let qid: number | undefined;
          if (typeof attemptOrCaseId.question === 'object' && attemptOrCaseId.question.id) {
            qid = attemptOrCaseId.question.id;
          } else if (typeof attemptOrCaseId.question === 'string') {
            try {
              const parsed = JSON.parse(attemptOrCaseId.question);
              if (parsed && parsed.id) qid = parsed.id;
            } catch {}
          }
          if (qid) hackathonId = hackathonData.find(q => q.id === qid)?.id;
        }
      }
      if (!hackathonId) {
        console.error('[handleSaveSelectedCase] Could not resolve hackathonData id for selected case', { attemptOrCaseId });
        throw new Error('Could not resolve hackathonData id for selected case');
      }
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();
      if (authError || !user || !user.email) {
        console.error('[handleSaveSelectedCase] User not authenticated or email not found', { authError, user });
        throw new Error('User not authenticated or email not found');
      }
      console.log('[handleSaveSelectedCase] Saving selected case:', { email: user.email, caseId: hackathonId });
      const result = await saveSelectedCase({ email: user.email, caseId: hackathonId });
      console.log('[handleSaveSelectedCase] Save successful:', result);
      // Optionally show a toast or update UI
    } catch (err) {
      // Optionally handle error (show toast, etc)
      console.error('[handleSaveSelectedCase] Failed to save selected case:', err);
    }
  };
  const allCases = React.useMemo(() => {
    let cases: { member: TeamMember; attempt: AttemptDetail }[] = [];
    teamMembers.forEach((member) => {
      (casesByMember[member.email] || []).forEach((attempt) => {
        cases.push({ member, attempt });
      });
    });
    // Fill up to 20 with randoms if <4 members
    if (teamMembers.length < 4) {
      const usedIds = new Set(cases.map(({ attempt }) => attempt.id));
      const availableCases = hackathonData.filter(q => !usedIds.has(q.id));
      for (let i = availableCases.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableCases[i], availableCases[j]] = [availableCases[j], availableCases[i]];
      }
      let idx = 0;
      while (cases.length < 20 && idx < availableCases.length) {
        cases.push({
          member: { name: 'Random', email: `random${idx}@example.com` },
          attempt: {
            id: availableCases[idx].id,
            question: availableCases[idx],
            question_index: availableCases[idx].id - 1,
          } as AttemptDetail,
        });
        idx++;
      }
      if (cases.length > 20) cases = cases.slice(0, 20);
    }
    return cases;
  }, [teamMembers, casesByMember]);

  if (loading) {
    return <div className="p-6 text-white">Loading cases from Level 1...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-400">{error}</div>;
  }

  // Add blink animation style
  const blinkStyle = `\n@keyframes blink {\n  0%, 60%, 100% { opacity: 1; }\n  70%, 90% { opacity: 0.2; }\n}\n.blink-animate {\n  animation: blink 4s linear infinite;\n}\n`;

  return (
    <>
      <style>{blinkStyle}</style>
      <div className="min-h-screen bg-gray-800 flex items-center justify-center p-2 relative text-white">
  <div className="w-full max-w-6xl rounded-lg shadow-lg p-8 flex flex-col items-center max-h-[90vh] overflow-y-auto glass-3d-effect">
      {/* Glassmorphism style for container */}
      <style>{`
        .glass-3d-effect {
          background: rgba(59, 130, 246, 0.12); /* even lighter blue with more transparency */
          box-shadow:
            0 8px 32px 0 rgba(31, 38, 135, 0.37),
            0 0 40px 8px #60a5fa88,
            0 0 80px 16px #a5b4fc55;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 1rem;
          border: 1.5px solid rgba(255, 255, 255, 0.18);
          transition: box-shadow 0.4s;
        }
      `}</style>
        <div className="mb-8 text-center font-[Verdana,Arial,sans-serif]">
          <h1 className="text-3xl font-bold mb-2 pixel-text">Welcome Team <span className="team-highlight-animate">{teamName}</span></h1>
      {/* Team name highlight animation */}
      <style>{`
        .team-highlight-animate {
          color: #fde047; /* yellow-300 */
          background: linear-gradient(90deg, #fde047 0%, #fbbf24 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-fill-color: transparent;
          font-weight: 900;
          text-shadow: 0 0 16px #fde047, 0 0 32px #fbbf24;
          filter: brightness(1.3);
        }
      `}</style>
          <div className="inline-block px-6 py-4 rounded-xl shadow-lg bg-white bg-opacity-80 border border-yellow-200 mb-0.5">
            <h2 className="text-xl font-semibold blink-animate pixel-text text-gray-900 m-0">
              Below are a set of cases that your team solved in level 1, carefully select one case for the solution round based on which you want to show your innovation.
            </h2>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:block mb-6 w-full">
          <div className="max-h-96 overflow-y-auto px-8 py-8">
            <div className="grid grid-cols-4 gap-6">
              {allCases.map(({ member, attempt }, idx) => {
                let q = '';
                try {
                  const parsed = typeof attempt.question === 'string' ? JSON.parse(attempt.question) : attempt.question;
                  q = parsed.caseFile || parsed.text || 'No question text';
                } catch {
                  q = 'No question text';
                }
                return (
                  <div
                    key={attempt.id + '-' + idx}
                    className={`pixel-border-thick w-full min-h-[120px] max-w-xs mx-auto flex flex-col items-center justify-between p-4 rounded-2xl relative transition-all duration-200 cursor-pointer select-none shadow-lg ${
                      Object.values(selectedCases).includes(attempt.id)
                        ? 'border-amber-400 bg-amber-100' : 'border-gray-400 bg-white'
                    } hover:scale-105 hover:shadow-2xl`}
                    style={{ fontFamily: 'Verdana,Arial,sans-serif' }}
                  >
                    <div className="mb-2 mt-1">
                      <span className="font-black text-gray-900 pixel-text text-base">Case {idx + 1}</span>
                    </div>
                    <button
                      className="pixel-border bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-gray-900 font-black pixel-text transition-all duration-200 flex items-center space-x-2 py-2 px-6 transform hover:scale-105 shadow-lg mt-2 mx-auto"
                      onClick={() => setModalCase({ question: q, member, attempt, idx })}
                    >
                      <span className="text-xs">Read Case</span>
                    </button>
                  </div>
                );
              })}
            {/* Case Question Modal for desktop click */}
            <CaseQuestionModal
              open={!!modalCase}
              question={modalCase?.question || ''}
              caseNumber={typeof modalCase?.idx === 'number' ? modalCase.idx + 1 : undefined}
              onClose={() => setModalCase(null)}
              onConfirm={() => {
                if (modalCase) {
                  setConfirmModal({ open: true, email: modalCase.member.email, caseId: modalCase.attempt.id });
                  setModalCase(null);
                }
              }}
              onPrev={modalCase && modalCase.idx > 0 ? () => {
                const prevIdx = modalCase.idx - 1;
                const prevCase = allCases[prevIdx];
                let q = '';
                try {
                  const parsed = typeof prevCase.attempt.question === 'string' ? JSON.parse(prevCase.attempt.question) : prevCase.attempt.question;
                  q = parsed.caseFile || parsed.text || 'No question text';
                } catch {
                  q = 'No question text';
                }
                setModalCase({ question: q, member: prevCase.member, attempt: prevCase.attempt, idx: prevIdx });
              } : undefined}
              onNext={modalCase && modalCase.idx < allCases.length - 1 ? () => {
                const nextIdx = modalCase.idx + 1;
                const nextCase = allCases[nextIdx];
                let q = '';
                try {
                  const parsed = typeof nextCase.attempt.question === 'string' ? JSON.parse(nextCase.attempt.question) : nextCase.attempt.question;
                  q = parsed.caseFile || parsed.text || 'No question text';
                } catch {
                  q = 'No question text';
                }
                setModalCase({ question: q, member: nextCase.member, attempt: nextCase.attempt, idx: nextIdx });
              } : undefined}
              disablePrev={modalCase ? modalCase.idx === 0 : true}
              disableNext={modalCase ? modalCase.idx === allCases.length - 1 : true}
            />
            </div>
          </div>
        </div>

        {/* Mobile Grid: show all cases in one screen, 4 cards per row, popup effect, open modal on card click */}
        <div className="block md:hidden w-full mb-6">
          <div className="w-full flex flex-col items-center justify-center">
            <div
              className="grid grid-cols-4 gap-3 w-full"
              style={{ maxWidth: 600, margin: '0 auto' }}
            >
              {allCases.map((_, idx) => (
                <div
                  key={idx}
                  className="pixel-border-thick w-full min-h-[70px] flex flex-col items-center justify-center p-2 rounded-xl bg-white border-gray-400 text-gray-900 font-black text-base select-none shadow-md transition-transform duration-200 hover:scale-110 hover:z-10 hover:shadow-2xl cursor-pointer"
                  style={{ fontFamily: 'Verdana,Arial,sans-serif' }}
                  onClick={() => setMobileCaseIndex(idx)}
                >
                  Case {idx + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

  {/* Mobile Landscape View removed: no horizontal scroller, only vertical for desktop */}

  {/* Continue button removed as requested */}
      </div>

      {/* Confirm Modal (shared) */}
      <ConfirmModal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, email: null, caseId: null })}
        onConfirm={() => {
          if (confirmModal.email && confirmModal.caseId !== null) {
            onSelectCase(confirmModal.email, confirmModal.caseId);
            handleSaveSelectedCase(confirmModal.email, modalCase?.attempt ?? confirmModal.caseId);
            setConfirmModal({ open: false, email: null, caseId: null });
            onContinue();
            return;
          }
          setConfirmModal({ open: false, email: null, caseId: null });
        }}
        confirmText="CONFIRM & SELECT"
        title="Confirm Selection"
        message="Are you sure you want to select this case? This cannot be changed."
      />

      {/* Mobile Case Modal using CaseQuestionModal */}
      {mobileCaseIndex !== null && (
        <CaseQuestionModal
          open={true}
          question={(() => {
            try {
              const q = typeof allCases[mobileCaseIndex].attempt.question === 'string'
                ? JSON.parse(allCases[mobileCaseIndex].attempt.question)
                : allCases[mobileCaseIndex].attempt.question;
              return q.caseFile || q.text || 'No question text';
            } catch {
              return 'No question text';
            }
          })()}
          caseNumber={mobileCaseIndex + 1}
          onClose={() => setMobileCaseIndex(null)}
          onConfirm={() => {
            const { member, attempt } = allCases[mobileCaseIndex];
            if (selectedCases[member.email] !== attempt.id) {
              onSelectCase(member.email, attempt.id);
              handleSaveSelectedCase(member.email, attempt);
            }
            setMobileCaseIndex(null);
          }}
          onPrev={mobileCaseIndex > 0 ? () => setMobileCaseIndex(mobileCaseIndex - 1) : undefined}
          onNext={mobileCaseIndex < allCases.length - 1 ? () => setMobileCaseIndex(mobileCaseIndex + 1) : undefined}
          disablePrev={mobileCaseIndex === 0}
          disableNext={mobileCaseIndex === allCases.length - 1}
          // compact={true}
        />
      )}
    </div>
      </>
  );
};

export default Level2Screen1_CaseSelection;
