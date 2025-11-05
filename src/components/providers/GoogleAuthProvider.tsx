'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactNode, useEffect, useState } from 'react';

interface GoogleAuthProviderProps {
  children: ReactNode;
}

export function GoogleAuthProvider({ children }: GoogleAuthProviderProps) {
  const [isClient, setIsClient] = useState(false);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const hasValidGoogleClientId = googleClientId && !googleClientId.includes('your-google-client-id');

  // Only render GoogleOAuthProvider on client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // During SSR or if no valid client ID, just render children
  if (!isClient || !hasValidGoogleClientId) {
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
