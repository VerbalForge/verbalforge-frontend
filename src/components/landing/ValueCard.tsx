import { ReactNode } from 'react';

interface ValueCardProps {
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
}

export function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="bg-card rounded-3xl p-8 border shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed mb-6">{description}</p>
        {/* <button className="text-emerald-800 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
          Learn more
          <span>→</span>
        </button> */}
      </div>
    </div>
  );
}
