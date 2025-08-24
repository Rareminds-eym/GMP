import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { hackathonData } from "../HackathonData";
import Level2SolutionCard from "./Level2SolutionCard";
import { restoreHL2Progress, saveHL2Progress, markScreenCompleteWithTimer } from "./level2Services";


interface Level2Screen2Props {
  onProceedConfirmed?: () => void;
  timer: number;
}


const Level2Screen2: React.FC<Level2Screen2Props> = ({ onProceedConfirmed, timer }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restoredTimer, setRestoredTimer] = useState<number>(timer);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const fetchProgressAndCase = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user || !user.id) throw new Error("User not authenticated");
        // Restore progress
        const progress = await restoreHL2Progress(user.id);
        console.log('[Level2Screen2] Restored progress:', progress);
        if (progress) {
          setRestoredTimer(progress.timer);
        }
        // Fetch selected case as before
        const { data, error } = await supabase
          .from("selected_cases")
          .select("case_id")
          .eq("email", user.email)
          .maybeSingle();
        if (error) throw error;
        if (!data) {
          setSelectedCaseId(null);
        } else {
          setSelectedCaseId(data.case_id);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch selected case");
      } finally {
        timeoutId = setTimeout(() => setLoading(false), 500);
      }
    };
    fetchProgressAndCase();
    return () => { if (timeoutId) clearTimeout(timeoutId); };
  }, []);

  // Save progress and timer when proceeding to next screen
  const handleProceed = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user || !user.id) throw new Error("User not authenticated");
      
      console.log('[Level2Screen2] Marking screen 2 complete with timer:', restoredTimer);
      // Use the enhanced utility to mark screen complete with timer
      await markScreenCompleteWithTimer(user.id, 2, restoredTimer);
      
      if (onProceedConfirmed) onProceedConfirmed();
    } catch (err: any) {
      console.error('[Level2Screen2] Error saving progress:', err);
      setError(err.message || "Failed to save progress");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-[300px] flex flex-col items-center justify-center bg-gray-800 rounded-lg p-8 animate-fadeIn">
      <div className="w-12 h-12 rounded-full bg-yellow-200 flex items-center justify-center mb-4 animate-bounce">
        <svg className="w-8 h-8 text-yellow-600 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8" strokeWidth="4" className="opacity-75" /></svg>
      </div>
      <div className="text-yellow-200 text-lg font-bold pixel-text text-center">Preparing selected case for solution round...</div>
    </div>
  );
  if (error) return <div className="p-6 text-red-400">{error}</div>;
  if (selectedCaseId == null) return <div className="p-6 text-yellow-300">No case selected.</div>;

  // Find the question data for the selected case
  const question = hackathonData.find(q => q.id === selectedCaseId);
  if (!question) return <div className="p-6 text-red-400">Selected case not found.</div>;

  // Only render the card, which includes the scenario/case description
  return (
    <div>
      <Level2SolutionCard question={question} onProceedConfirmed={handleProceed} timer={restoredTimer} />
      {/* You can add a button to manually trigger save for demo/testing */}
      {/* <button onClick={handleProceed}>Save Progress & Continue</button> */}
    </div>
  );
};

export default Level2Screen2;
