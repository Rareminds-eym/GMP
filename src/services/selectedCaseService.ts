import { supabase } from '../lib/supabase';

export async function upsertSelectedCase(user_id: string, case_id: number) {
  // Upsert the selected case for the user
  const { data, error } = await supabase
    .from('selected_cases')
    .upsert([
      { user_id, case_id, updated_at: new Date().toISOString() }
    ], { onConflict: 'user_id' });
  if (error) throw error;
  return data;
}

export async function getSelectedCase(user_id: string) {
  const { data, error } = await supabase
    .from('selected_cases')
    .select('case_id')
    .eq('user_id', user_id)
    .single();
  if (error) throw error;
  return data?.case_id;
}
