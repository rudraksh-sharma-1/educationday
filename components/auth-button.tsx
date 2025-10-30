'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function AuthButton({ user: initialUser }: { user: any }) {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(false);

  const hasWelcomed = useRef(false);

  useEffect(() => {
    if (initialUser) hasWelcomed.current = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);

        if (!hasWelcomed.current) {
          hasWelcomed.current = true;
          toast.success(`Welcome back, ${session?.user?.email || 'user'}!`);
        }

        router.refresh();
      } else if (event === 'SIGNED_OUT') {
        hasWelcomed.current = false;
        setUser(null);
        toast('You’ve been logged out.', { description: 'Come back soon!' });
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase, initialUser]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      toast.loading('Redirecting to Google...');
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${location.origin}` },
      });
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Login failed. Try again.');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    toast.success('Successfully logged out.');
    setLoading(false);
    setUser(null);
    router.refresh();
  };

  return user ? (
    <Button
      onClick={handleLogout}
      disabled={loading}
      className="bg-red-500 hover:bg-red-600 text-white"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Logging out...
        </>
      ) : (
        <>Logout ({user.email})</>
      )}
    </Button>
  ) : (
    <Button
      onClick={handleLogin}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Redirecting...
        </>
      ) : (
        <>Login with Google</>
      )}
    </Button>
  );
}
