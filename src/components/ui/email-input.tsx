'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CheckCircle2, XCircle } from 'lucide-react';

interface EmailInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export function EmailInput({
  id,
  name,
  value,
  onChange,
  placeholder = 'Enter your email',
  disabled,
  error,
}: EmailInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const validateEmail = (email: string) => {
    if (!email) return true; // Don't show error for empty field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValid = validateEmail(value);
  const showError = !isFocused && value && !isValid;

  return (
    <div className="space-y-1">
      <div className="relative">
        <Input
          id={id}
          name={name}
          type="email"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`pr-10 ${showError || error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {value && (
          <div className="absolute right-0 top-0 h-full px-3 py-2 flex items-center">
            {isValid ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>
      {showError && (
        <p className="text-xs text-red-600">Please enter a valid email address</p>
      )}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
