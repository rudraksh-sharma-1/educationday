import { createServerClientInstance } from './supabaseServerClient';

export async function getUserSession() {
  const supabase = await createServerClientInstance();
  const { data } = await supabase.auth.getUser();
  return data.user;
}
