import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveAudit(data: {
  email: string;
  company_name: string;
  total_savings: number;
}) {
  const { data: result, error } = await supabase
    .from('audits')
    .insert([data]);

  if (error) throw error;
  return result;
}
