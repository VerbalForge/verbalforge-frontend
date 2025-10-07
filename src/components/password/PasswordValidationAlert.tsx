import { CheckCircle2, XCircle } from 'lucide-react';

interface PasswordValidationAlertProps {
  errors?: string[];
  success?: string;
}

export function PasswordValidationAlert({ errors, success }: PasswordValidationAlertProps) {
  if (success) {
    return (
      <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5" />
          <p className="text-sm text-green-800 dark:text-green-100 font-medium">{success}</p>
        </div>
      </div>
    );
  }

  if (errors && errors.length > 0) {
    return (
      <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
        <div className="flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800 dark:text-red-100 mb-2">Please fix the following errors:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-300">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
