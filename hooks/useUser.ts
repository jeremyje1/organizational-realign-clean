// hooks/useUser.ts
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Get the current session and user
    async function getUser() {
      try {
        setLoading(true);
        
        // Get session data
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        // Get user data if session exists
        if (currentSession) {
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error getting user data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    getUser();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);
  
  return { user, session, loading };
}
