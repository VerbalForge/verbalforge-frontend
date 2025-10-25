import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
  variant?: 'default' | 'dark' | 'accent';
}

export function FeatureCard({ icon, title, description, variant = 'default' }: FeatureCardProps) {
  const cardVariants = {
    default: 'bg-card border text-foreground',
    dark: 'bg-gradient-to-br from-emerald-800 to-emerald-900 border-emerald-800 text-white',
    accent: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800 text-foreground',
  };

  const iconVariants = {
    default: 'bg-primary/10 text-primary',
    dark: 'bg-white/10 text-white',
    accent: 'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200',
  };

  return (
    <div className={`rounded-3xl p-8 border shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 ${cardVariants[variant]}`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${iconVariants[variant]}`}>
        {icon}
      </div>
      <h3 className={`text-xl font-bold mb-3 ${variant === 'dark' ? 'text-white' : 'text-foreground'}`}>
        {title}
      </h3>
      <div className={variant === 'dark' ? 'text-white/90' : 'text-muted-foreground'}>
        {description}
      </div>
    </div>
  );
}
