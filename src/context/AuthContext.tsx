import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: string | null;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  role: null,
  logout: async () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [dbRole, setDbRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const sessionRef = useRef<Session | null>(null);

  useEffect(() => {
    const fetchRole = async (userId?: string) => {
      if (userId) {
        try {
          const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
          if (data) setDbRole(data.role);
        } catch (error) {
          console.error('Error fetching role:', error);
        }
      } else {
        setDbRole(null);
      }
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      sessionRef.current = initialSession;
      fetchRole(initialSession?.user?.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      // Determine if this is a genuine new sign-in transition
      // (going from no-session to active-session)
      const isNewLogin = event === 'SIGNED_IN' && !sessionRef.current;

      console.log('[AuthContext] onAuthStateChange event:', event, 'isNewLogin:', isNewLogin, 'hasCurrentSession:', !!currentSession, 'hasSessionRef:', !!sessionRef.current);

      setSession(currentSession);
      sessionRef.current = currentSession;

      if (isNewLogin) {
        setLoading(true);
      }
      fetchRole(currentSession?.user?.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // Force clear all local states to be sure
      setSession(null);
      setDbRole(null);
      // Optional: Force reload to clear any hung memory/states if needed
      // window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const currentRole = dbRole || session?.user?.user_metadata?.role;

  return (
    <AuthContext.Provider value={{
      user: session?.user || null,
      session,
      role: currentRole || null,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
