import { supabase } from '../lib/supabase';

/**
 * Checks if the given email or session_id exists in the winners_list_l1 table.
 * Returns true if the user is allowed to access Level 2, false otherwise.
 */
export async function isLevel2Allowed(email: string, session_id: string): Promise<boolean> {
  console.log('[isLevel2Allowed] Checking access for:', { email, session_id });
    const { data, error } = await supabase
      .from('winners_list_l1')
      .select('*')
      .eq('email', email)
      .limit(1);
    console.log('[isLevel2Allowed] Supabase query result:', { data, error });
    if (error) {
      console.error('[isLevel2Allowed] Error from Supabase:', error);
      return false;
    }
    if (data && data.length > 0) {
      const matchedRecord = data[0];
      console.log('[isLevel2Allowed] Access GRANTED. Matched record:', JSON.stringify(matchedRecord, null, 2));
      return true;
    } else {
      console.warn('[isLevel2Allowed] Access DENIED. No matching record found. Query param (email):', email);
      return false;
    }
}
