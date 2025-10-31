'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/app/lib/supabaseClient';

const UserContext = createContext<any>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Fetch once on mount
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // Listen for login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
