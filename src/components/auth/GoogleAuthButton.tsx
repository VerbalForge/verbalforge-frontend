import GoogleIcon from '@mui/icons-material/Google';
import { Button } from "@/components/ui/button";

interface GoogleAuthButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'login' | 'signup';
}

export function GoogleAuthButton({ 
  onClick, 
  disabled = false, 
  variant = 'login' 
}: GoogleAuthButtonProps) {
  const buttonText = variant === 'login' ? 'Sign in with Google' : 'Sign up with Google';

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={onClick}
      disabled={disabled}
    >
      <GoogleIcon className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  );
}
