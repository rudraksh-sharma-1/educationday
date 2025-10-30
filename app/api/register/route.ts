// app/api/register/solo/route.ts
import { NextResponse } from 'next/server';
import { createServerClientInstance } from '@/app/lib/supabaseServerClient';

export async function POST(req: Request) {
  const { eventId } = await req.json();
  const supabase = await createServerClientInstance();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  // check existing registration
  const { data: existing } = await supabase.from('registration')
    .select('*').eq('event_id', eventId).eq('user_id', user.id).maybeSingle();
  if (existing) return NextResponse.json({ error: 'Already registered' }, { status: 400 });

  // insert registration
  const { data: reg, error } = await supabase.from('registration').insert({
    event_id: eventId,
    user_id: user.id,
    payment_status: 'pending',
    registered_at: new Date().toISOString()
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ registration: reg });
}
