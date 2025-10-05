import { Check, XCircle } from 'lucide-react';

interface PasswordRequirementsProps {
  password: string;
  showStatus?: boolean;
  currentPassword?: string;
}

export function PasswordRequirements({ password, showStatus = false, currentPassword }: PasswordRequirementsProps) {
  const requirements = [
    {
      label: 'At least 8 characters long',
      met: password.length >= 8,
    },
    {
      label: 'Contains uppercase and lowercase letters',
      met: /[A-Z]/.test(password) && /[a-z]/.test(password),
    },
    {
      label: 'Contains at least one number',
      met: /[0-9]/.test(password),
    },
    {
      label: 'Contains at least one special character (!@#$%^&*)',
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  // Add "Different from current password" requirement only if currentPassword is provided
  if (currentPassword !== undefined) {
    requirements.push({
      label: 'Different from your current password',
      met: password !== currentPassword && password.length > 0,
    });
  }

  return (
    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
      <p className="text-sm font-medium text-blue-900 mb-2">Password Requirements:</p>
      <ul className="text-xs text-blue-700 space-y-1">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-center gap-2">
            {showStatus ? (
              req.met ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <XCircle className="w-3 h-3 text-muted-foreground" />
              )
            ) : (
              <Check className="w-3 h-3" />
            )}
            <span className={showStatus && !req.met ? 'text-gray-500' : ''}>{req.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
