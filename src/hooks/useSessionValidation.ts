import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useSessionValidation() {
  const { user, loading, validateSession } = useAuth();

  useEffect(() => {
    const checkSession = async () => {
      // Don't validate if still loading initial auth state
      if (loading) return;

      // If no user, validate session
      if (!user) {
        const isValid = await validateSession();
        if (!isValid) {
          // Session expired dialog will be shown by AuthContext
          return;
        }
      }
    };

    checkSession();
  }, [loading, user, validateSession]);

  return { user, loading };
}
