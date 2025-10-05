import { useState, useCallback } from 'react';

export interface PasswordValidationOptions {
  currentPassword?: string;
  requireCurrentPassword?: boolean;
}

export function usePasswordValidation(options: PasswordValidationOptions = {}) {
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState('');

  const validatePassword = useCallback((
    newPassword: string,
    confirmPassword: string,
    currentPassword?: string
  ): boolean => {
    const validationErrors: string[] = [];

    // Check if current password is required and provided
    if (options.requireCurrentPassword && !currentPassword) {
      validationErrors.push('Current password is required');
    }

    // Check if fields are empty
    if (!newPassword) {
      validationErrors.push('New password is required');
    }
    if (!confirmPassword) {
      validationErrors.push('Please confirm your new password');
    }

    // Check minimum length
    if (newPassword && newPassword.length < 8) {
      validationErrors.push('Password must be at least 8 characters long');
    }

    // Check if new password contains at least one uppercase letter
    if (newPassword && !/[A-Z]/.test(newPassword)) {
      validationErrors.push('Password must contain at least one uppercase letter');
    }

    // Check if new password contains at least one lowercase letter
    if (newPassword && !/[a-z]/.test(newPassword)) {
      validationErrors.push('Password must contain at least one lowercase letter');
    }

    // Check if new password contains at least one number
    if (newPassword && !/[0-9]/.test(newPassword)) {
      validationErrors.push('Password must contain at least one number');
    }

    // Check if new password contains at least one special character
    if (newPassword && !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      validationErrors.push('Password must contain at least one special character');
    }

    // Check if new password is same as current password
    if (
      options.requireCurrentPassword &&
      currentPassword &&
      newPassword &&
      currentPassword === newPassword
    ) {
      validationErrors.push('New password must be different from current password');
    }

    // Check if passwords match
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      validationErrors.push('New password and confirmation do not match');
    }

    setErrors(validationErrors);
    return validationErrors.length === 0;
  }, [options.requireCurrentPassword]);

  const clearValidation = useCallback(() => {
    setErrors([]);
    setSuccess('');
  }, []);

  const setSuccessMessage = useCallback((message: string) => {
    setSuccess(message);
    setErrors([]);
  }, []);

  const setErrorMessages = useCallback((errorMessages: string[]) => {
    setErrors(errorMessages);
    setSuccess('');
  }, []);

  return {
    errors,
    success,
    validatePassword,
    clearValidation,
    setSuccessMessage,
    setErrorMessages,
  };
}
