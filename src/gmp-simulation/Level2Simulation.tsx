import React, { useEffect, useState, useCallback } from "react";
import Level2Card from "./Level2Card";
import { Play, Clock, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Real eligibility check: only allow if user is in winners_list_level1
import { supabase } from "../lib/supabase";
async function isLevel2Allowed(email: string | null, session_id: string | null): Promise<boolean> {
  if (!email) return false;
  // Check if user is in winners_list_l1 table by email only (to match GmpSimulation)
  const { data, error } = await supabase
    .from("winners_list_l1")
    .select("*")
    .eq("email", email)
    .limit(1);
  console.log("[Level2 Access Debug] Querying winners_list_l1 with:", { email });
  console.log("[Level2 Access Debug] Supabase response:", { data, error });
  if (error) {
    console.error("Eligibility check error (winners_list_l1):", error);
    return false;
  }
  return !!(data && data.length > 0);
}

const showWalkthroughVideo = () => {
  const videoUrl = "https://www.youtube.com/watch?v=7CemV2XIaXo";
  window.open(videoUrl, '_blank');
};

const Level2Simulation: React.FC = () => {
  const [canAccessLevel2, setCanAccessLevel2] = useState<boolean | null>(null);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [session_id, setSessionId] = useState<string | null>(null);
  const [showLevel2Card, setShowLevel2Card] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const totalQuestions = 5; // Adjust if dynamic
  // On mount, fetch the authenticated user's email and session_id
  useEffect(() => {
    const fetchAuthInfo = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        setEmail(null);
        setSessionId(null);
        return;
      }
      const userEmail = session.user?.email || null;
      setEmail(userEmail);
      setSessionId(session.user?.id || null);
    };
    fetchAuthInfo();
  }, []);

  // Eligibility check
  useEffect(() => {
    const checkLevel2Access = async () => {
      setCanAccessLevel2(null); // loading
      const allowed = await isLevel2Allowed(email, session_id);
      setCanAccessLevel2(allowed);
    };
    checkLevel2Access();
  }, [email, session_id]);

  // Completion logic
  const isHackathonCompleted = useCallback(() => {
    // TODO: Replace with real completion logic
    return gameCompleted;
  }, [gameCompleted]);

  const showCompletionModal = useCallback(() => {
    setShowLevelModal(true);
  }, []);

  // UI rendering
  if (canAccessLevel2 === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800">
        <div className="text-white text-lg font-bold animate-pulse">Checking access...</div>
      </div>
    );
  }
  if (!canAccessLevel2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800">
        <div className="pixel-border-thick bg-gradient-to-r from-red-700 to-red-800 p-6 max-w-xl w-full text-center">
          <h2 className="text-2xl font-black text-red-100 mb-3 pixel-text">ACCESS DENIED</h2>
          <p className="text-red-200 mb-4 text-sm font-bold">You are not eligible to participate in Level 2 (HL2).<br/>Only winners from Level 1 can access this round.</p>
        </div>
      </div>
    );
  }

  // Countdown overlay
  if (showCountdown) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div className="text-8xl md:text-9xl font-black text-white pixel-text animate-pulse mb-4">
          {countdownNumber}
        </div>
      </div>
    );
  }

  if (showLevel2Card) {
    // Progress bar above Level2Card
    return (
      <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-2 relative">
        <div className="w-full max-w-xl px-2">
          <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        <Level2Card
          teamName="Demo Team"
          teamMembers={[{ name: "Alice", email: "alice@example.com" }, { name: "Bob", email: "bob@example.com" }]}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-2 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pixel-pattern opacity-10"></div>
      <div className="absolute inset-0 bg-scan-lines opacity-20"></div>
      <div className="pixel-border-thick bg-gradient-to-r from-purple-600 to-purple-700 p-4 max-w-xl w-full text-center relative z-10">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-purple-500 pixel-border flex items-center justify-center">
            <Play className="w-6 h-6 text-purple-900" />
          </div>
        </div>
        <h1 className="text-xl font-black text-purple-100 mb-3 pixel-text">
          GMP SOLUTION ROUND
        </h1>
        <p className="text-purple-100 mb-4 text-sm font-bold">
          Select the best solutions for each GMP case scenario
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
          <div className="pixel-border bg-gradient-to-r from-blue-700 to-blue-600 p-2">
            <div className="w-6 h-6 bg-blue-800 pixel-border mx-auto mb-1 flex items-center justify-center">
              <Clock className="w-3 h-3 text-blue-300" />
            </div>
            <h3 className="font-black text-white text-xs pixel-text">
              90 MINUTES
            </h3>
            <p className="text-blue-100 text-xs font-bold">
              Complete all solutions
            </p>
          </div>
          <div className="pixel-border bg-gradient-to-r from-orange-700 to-orange-600 p-2">
            <div className="w-6 h-6 bg-orange-800 pixel-border mx-auto mb-1 flex items-center justify-center">
              <AlertTriangle className="w-3 h-3 text-orange-300" />
            </div>
            <h3 className="font-black text-white text-xs pixel-text">
              5 CASES
            </h3>
            <p className="text-orange-100 text-xs font-bold">
              Random GMP scenarios
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            onClick={() => {
              setShowCountdown(true);
              setCountdownNumber(3);
              let i = 3;
              const interval = setInterval(() => {
                i--;
                setCountdownNumber(i);
                if (i === 0) {
                  clearInterval(interval);
                  setShowCountdown(false);
                  setShowLevel2Card(true);
                }
              }, 1000);
            }}
            className="pixel-border bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-black py-2 px-4 pixel-text transition-all transform hover:scale-105 text-sm"
          >
            START HACKATHON
          </button>
          <button
            onClick={showWalkthroughVideo}
            className="pixel-border bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-black py-2 px-4 pixel-text transition-all transform hover:scale-105 text-sm flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            WALKTHROUGH VIDEO
          </button>
        </div>
        {/* Completion Modal */}
        {showLevelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
              <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
              <p className="mb-4">You have completed Level 2 (HL2)!</p>
              <button
                onClick={() => setShowLevelModal(false)}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded font-bold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Level2Simulation;
