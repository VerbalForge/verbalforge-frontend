import { useCallback } from 'react';
import { useGoogleLogin, CodeResponse } from '@react-oauth/google';
import { useAuth } from '@/contexts/AuthContext';

interface UseGoogleAuthOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useGoogleAuth({ onSuccess, onError }: UseGoogleAuthOptions = {}) {
  const { googleLogin } = useAuth();

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const hasValidGoogleClientId = googleClientId && !googleClientId.includes('your-google-client-id');

  const handleError = useCallback((error: string) => {
    console.error('Google OAuth Error:', error);
    onError?.(error);
  }, [onError]);

  const handleSuccess = useCallback(() => {
    onSuccess?.();
  }, [onSuccess]);

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse: CodeResponse) => {
      try {
        await googleLogin(codeResponse.code);
        handleSuccess();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Google authentication failed';
        handleError(errorMessage);
      }
    },
    onError: () => {
      handleError('Google authentication was cancelled or failed');
    },
    flow: 'auth-code',
  });

  return {
    hasValidGoogleClientId,
    isGoogleLoading: false,
    triggerGoogleLogin,
  };
}
