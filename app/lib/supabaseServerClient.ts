import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerClientInstance() {
  // In Next 16, cookies() may be async depending on context
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // @ts-ignore
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          // @ts-ignore
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}
