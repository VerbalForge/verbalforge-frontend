'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { useAuth } from '@/contexts/AuthContext';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { GoogleOAuthButtonWrapper } from '@/components/auth/GoogleOAuthButtonWrapper';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Google OAuth integration
  const { hasValidGoogleClientId, googleLogin, handleSuccess, handleError } = useGoogleAuth({
    onSuccess: () => setShouldRedirect(true),
    onError: (error) => setError(error),
  });

  // Redirect after successful login
  useEffect(() => {
    if (shouldRedirect && user) {
      const redirect = searchParams.get('redirect');
      if (redirect) {
        router.push(redirect);
      } else {
        router.push(`/${user.username}/dashboard`);
      }
    }
  }, [shouldRedirect, user, router, searchParams]);

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.identifier || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(formData.identifier, formData.password);
      setShouldRedirect(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={onSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        
        {hasValidGoogleClientId && (
          <>
            <GoogleOAuthButtonWrapper
              variant="login"
              onSuccess={async (code) => {
                await googleLogin(code);
                handleSuccess();
              }}
              onError={handleError}
            />
            
            <FieldSeparator>or</FieldSeparator>
          </>
        )}
        
        <Field>
          <FieldLabel htmlFor="identifier">Email or Username</FieldLabel>
          <Input 
            id="identifier" 
            name="identifier"
            type="text" 
            placeholder="jondoe@example.com" 
            value={formData.identifier}
            onChange={handleInputChange}
            disabled={isLoading}
            required 
          />
        </Field>
        
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <PasswordInput 
            id="password" 
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </Field>

        {error && (
          <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-3 rounded-md border border-red-200 dark:border-red-900">
            {error}
          </div>
        )}
        
        <Field>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </Field>
        
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </FieldGroup>
    </form>
  )
}
