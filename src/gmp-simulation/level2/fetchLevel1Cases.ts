import { createClient } from '@supabase/supabase-js';

// Use import.meta.env for Vite/React projects
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface AttemptDetail {
  id: number;
  email: string;
  session_id: string;
  module_number: number;
  question_index: number;
  question: any;
  answer: any;
  created_at: string;
  updated_at: string;
  time_remaining: number;
}

export async function fetchLevel1CasesForTeam(teamMembers: { email: string }[]): Promise<Record<string, AttemptDetail[]>> {
  // For each team member, fetch their 5 level 1 cases
  const result: Record<string, AttemptDetail[]> = {};
  console.log('[fetchLevel1CasesForTeam] teamMembers:', teamMembers);
  for (const member of teamMembers) {
    console.log(`[fetchLevel1CasesForTeam] Fetching for:`, member.email);
    const { data, error } = await supabase
      .from('attempt_details')
      .select('*')
      .eq('email', member.email)
      .eq('module_number', 5)
      .order('question_index', { ascending: true })
      .limit(5);
    console.log(`[fetchLevel1CasesForTeam] Result for ${member.email}:`, { data, error });
    if (error) {
      console.error('Error fetching attempt_details for', member.email, error);
      result[member.email] = [];
    } else {
      result[member.email] = data || [];
    }
  }
  console.log('[fetchLevel1CasesForTeam] Final result:', result);
  return result;
}
