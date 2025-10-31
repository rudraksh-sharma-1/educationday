'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function AuthButton() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // start loading until we check user
  const hasWelcomed = useRef(false);

  // Check session on mount (fixes "resets to login" bug)
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    }

    loadUser();

    // Listen for login/logout events globally
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session?.user ?? null);

          if (!hasWelcomed.current) {
            hasWelcomed.current = true;
            toast.success(`Welcome, ${session?.user?.user_metadata?.full_name || 'User'}!`);
          }

          router.refresh();
        } else if (event === 'SIGNED_OUT') {
          hasWelcomed.current = false;
          setUser(null);
          toast('You’ve been logged out.', { description: 'Come back soon!' });
          router.refresh();
        }
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, [router, supabase]);

  // Login via Google OAuth
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

  // Logout
  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      toast.success('Successfully logged out.');
      setUser(null);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Button disabled className="bg-gray-500 text-white">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading...
      </Button>
    );
  }

  // Logged-in view
  if (user) {
    const displayName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'User';

    return (
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
          <>Logout ({displayName})</>
        )}
      </Button>
    );
  }

  // Logged-out view
  return (
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
