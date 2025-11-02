import { NextResponse } from 'next/server';
import { createServerClientInstance } from '@/app/lib/supabaseServerClient'; 

export async function GET() {
  const supabase = await createServerClientInstance();

  const { data, error } = await supabase
    .from('registration')
    .select(`
      id,
      payment_status,
      registered_at,
      user_id,
      team_id,
      phone_number,
      users:user_id (name, email),
      teams:team_id (
        team_name, 
        team_code,
        created_by,
        team_members (
          user_id,
          role,
          users (name, email),
          phone_number
        )
      ),
      events:event_id (name)
    `)
    .order('registered_at', { ascending: false });

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Clean and flatten structure
  const formatted = (data || []).map((item: any) => {
    const team = Array.isArray(item.teams) ? item.teams[0] : item.teams;

    const teamMembers =
      team?.team_members?.map((tm: any) => ({
        name: tm.users?.name || 'Unknown',
        email: tm.users?.email || '',
        phone_number: tm.phone_number || '',
        user_id: tm.user_id,
        role: tm.role,
      })) || [];

    let leaderEmail = '';
    if (team) {
      const leader = teamMembers.find((m: any) => m.role === 'leader');
      if (leader) leaderEmail = leader.email;
    }

    return {
      ...item,
      events: Array.isArray(item.events) ? item.events[0] : item.events,
      teams: team
        ? {
            ...team,
            team_members: undefined,
            leader_email: leaderEmail,
          }
        : null,
      users: Array.isArray(item.users) ? item.users[0] : item.users,
      team_members: teamMembers,
    };
  });

  return NextResponse.json(formatted);
}
