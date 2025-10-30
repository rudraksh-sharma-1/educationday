import { NextResponse } from 'next/server';
import { createServerClientInstance } from '@/app/lib/supabaseServerClient';

export async function GET(request: Request) {
  const supabase = await createServerClientInstance();

  // Supabase automatically parses the OAuth session from the callback URL
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Auth callback error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!session) {
    return NextResponse.redirect('/?auth=failed');
  }

  // Redirect to home or dashboard
  return NextResponse.redirect('/');
}
