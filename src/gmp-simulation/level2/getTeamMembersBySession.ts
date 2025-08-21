import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface TeamMember {
  name: string; // fallback to email if name not available
  email: string;
}


export async function getTeamMembersBySession(session_id: string): Promise<TeamMember[]> {
  // Query attempt_details for all unique emails for this session_id
  const { data, error } = await supabase
    .from('attempt_details')
    .select('email')
    .eq('session_id', session_id);
  if (error) {
    console.error('[getTeamMembersBySession] Supabase error:', error);
    return [];
  }
  // Get unique emails
  const uniqueEmails = Array.from(new Set((data || []).map((row: any) => row.email)));
  // Optionally, fetch names from another table if available
  // For now, use email as name fallback
  return uniqueEmails.map(email => ({ name: email, email }));
}

// New function to get team name by session_id
export async function getTeamNameBySession(session_id: string): Promise<string> {
  const { data, error } = await supabase
    .from('attempt_details')
    .select('team_name')
    .eq('session_id', session_id)
    .limit(1)
    .single();
  if (error) {
    console.error('[getTeamNameBySession] Supabase error:', error);
    return '';
  }
  return data?.team_name || '';
}
