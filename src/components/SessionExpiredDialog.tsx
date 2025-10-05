'use client';

import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SessionExpiredDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SessionExpiredDialog({ isOpen, onClose }: SessionExpiredDialogProps) {
  const router = useRouter();

  const handleLoginAgain = () => {
    onClose();
    router.push('/login');
  };

  const handleReturnHome = () => {
    onClose();
    router.push('/');
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Session Expired</AlertDialogTitle>
          <AlertDialogDescription>
            Your session has expired. Please log in again to continue using the application.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleReturnHome}>
            Return To Home
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleLoginAgain}>
            Login Again
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
