'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function NavigationProgress() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set loading to true when pathname changes
    setLoading(true);
    
    // Reset loading after a short delay to show the animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
      <div className="h-full bg-primary animate-loading-bar" />
    </div>
  );
}
