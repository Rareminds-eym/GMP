import { supabase } from '../../lib/supabase';



export interface Level2Progress {
  user_id: string;
  current_screen: number;
  completed_screens: number[];
  timer: number;
}

export async function saveLevel2Progress({ user_id, current_screen, completed_screens, timer }: Level2Progress) {
  const { data, error } = await supabase
    .from('hl2_progress')
    .upsert([
      {
        user_id,
        current_screen,
        completed_screens,
        timer,
        updated_at: new Date().toISOString(),
      },
    ], { onConflict: 'user_id' });
  if (error) throw error;
  return data;
}

export async function getLevel2Progress(user_id: string) {
  const { data, error } = await supabase
    .from('hl2_progress')
    .select('*')
    .eq('user_id', user_id)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116: No rows found
  return data;
}
