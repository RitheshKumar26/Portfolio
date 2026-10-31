import { useEffect, useState, ReactNode } from 'react';
import { Navigate } from 'react-router';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Terminal } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // If Supabase is not configured yet, allow viewing admin in preview/demo mode
    if (!isSupabaseConfigured) {
      setIsAuthenticated(true);
      return;
    }

    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(Boolean(session));
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-black text-[#00D23B] flex flex-col items-center justify-center font-mono">
        <Terminal className="w-8 h-8 animate-spin mb-4" />
        <p className="tracking-widest text-sm">&gt; VERIFYING_SECURITY_CLEARANCE...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
