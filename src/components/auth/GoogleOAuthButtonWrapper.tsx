'use client';

import { useGoogleLogin, CodeResponse } from '@react-oauth/google';
import { GoogleAuthButton } from './GoogleAuthButton';

interface GoogleOAuthButtonWrapperProps {
  variant?: 'login' | 'signup';
  onSuccess: (code: string) => Promise<void>;
  onError: (error: string) => void;
}

export function GoogleOAuthButtonWrapper({ 
  variant = 'login',
  onSuccess,
  onError
}: GoogleOAuthButtonWrapperProps) {
  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse: CodeResponse) => {
      try {
        await onSuccess(codeResponse.code);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Google authentication failed';
        onError(errorMessage);
      }
    },
    onError: () => {
      onError('Google authentication was cancelled or failed');
    },
    flow: 'auth-code',
  });

  return (
    <GoogleAuthButton 
      variant={variant}
      onClick={() => triggerGoogleLogin()}
      disabled={false}
    />
  );
}
