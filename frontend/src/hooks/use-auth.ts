import { useState, useCallback, useEffect } from 'react';
import { auth, type AuthState } from '@/lib/auth';

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: auth.currentUser,
    loading: true,
    error: null
  });

  // Update state when auth state changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      user: auth.currentUser,
      loading: false
    }));
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await auth.signUp(email, password);
      setState(prev => ({ ...prev, user: auth.currentUser }));
    } catch (error) {
      setState(prev => ({ ...prev, error: (error as Error).message }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await auth.signIn(email, password);
      setState(prev => ({ ...prev, user: auth.currentUser }));
    } catch (error) {
      setState(prev => ({ ...prev, error: (error as Error).message }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await auth.signOut();
      setState(prev => ({ ...prev, user: null }));
    } catch (error) {
      setState(prev => ({ ...prev, error: (error as Error).message }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);


  const verifyEmail = useCallback(async (code: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await auth.verifyEmail(code);
      setState(prev => ({
        ...prev,
        user: auth.currentUser
      }));
    } catch (error) {
      setState(prev => ({ ...prev, error: (error as Error).message }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const useTrial = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await auth.useTrial();
      setState(prev => ({
        ...prev,
        user: auth.currentUser
      }));
    } catch (error) {
      setState(prev => ({ ...prev, error: (error as Error).message }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    verifyEmail,
    useTrial
  };
}
