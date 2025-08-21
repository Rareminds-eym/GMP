import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { hackathonData } from "../HackathonData";
import Level2SolutionCard from "./Level2SolutionCard";


const Level2Screen2: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSelectedCase = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user || !user.email) throw new Error("User not authenticated");
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
        setLoading(false);
      }
    };
    fetchSelectedCase();
  }, []);

  if (loading) return <div className="p-6 text-white">Loading selected case...</div>;
  if (error) return <div className="p-6 text-red-400">{error}</div>;
  if (selectedCaseId == null) return <div className="p-6 text-yellow-300">No case selected.</div>;

  // Find the question data for the selected case
  const question = hackathonData.find(q => q.id === selectedCaseId);
  if (!question) return <div className="p-6 text-red-400">Selected case not found.</div>;

  // Only render the card, which includes the scenario/case description
  return <Level2SolutionCard question={question} />;
};

export default Level2Screen2;
