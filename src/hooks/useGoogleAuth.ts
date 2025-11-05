'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UseGoogleAuthOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useGoogleAuth({ onSuccess, onError }: UseGoogleAuthOptions = {}) {
  const { googleLogin } = useAuth();
  const [isClient, setIsClient] = useState(false);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const hasValidGoogleClientId = googleClientId && !googleClientId.includes('your-google-client-id');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleError = useCallback((error: string) => {
    console.error('Google OAuth Error:', error);
    onError?.(error);
  }, [onError]);

  const handleSuccess = useCallback(() => {
    onSuccess?.();
  }, [onSuccess]);

  const triggerGoogleLogin = useCallback(() => {
    // Placeholder - actual Google login handled by GoogleOAuthButton component
    // which will be conditionally rendered only on client-side
  }, []);

  return {
    hasValidGoogleClientId: hasValidGoogleClientId && isClient,
    isGoogleLoading: false,
    triggerGoogleLogin,
    // Export callbacks for use in other components
    googleLogin,
    handleSuccess,
    handleError,
  };
}
