import { FeatureCard } from './FeatureCard';
import { BookOpen, Brain, MessageSquare } from 'lucide-react';

export function Features() {
  return (
    <section id="features" className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold mb-2">FEATURES</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything you need to<br />ace your GRE verbal
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three powerful features working together to maximize your vocabulary mastery.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Learn - Large card */}
          <div className="md:row-span-2">
            <FeatureCard
              variant="dark"
              icon={<BookOpen className="w-7 h-7" />}
              title={
                <>
                  Learn from<br />your favorite sources
                </>
              }
              description={
                <div className="space-y-4">
                  <p>Master vocabulary from all major GRE prep sources. Track your progress and discover word overlaps across different lists.</p>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-sm text-emerald-200 mb-2">Identify common words</div>
                    <div className="flex items-center justify-center relative h-42">
                      {/* GregMat - Top */}
                      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-24 h-24 rounded-full bg-emerald-600/60 border-2 border-emerald-300/40 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">GregMat</span>
                      </div>
                      {/* Magoosh - Bottom Left */}
                      <div className="absolute left-[32.5%] bottom-1 w-24 h-24 rounded-full bg-emerald-500/60 border-2 border-emerald-300/40 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">Magoosh</span>
                      </div>
                      {/* Barron's - Bottom Right */}
                      <div className="absolute right-[32.5%] bottom-1 w-24 h-24 rounded-full bg-emerald-400/60 border-2 border-emerald-300/40 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">Barron&apos;s</span>
                      </div>
                    </div>
                    <div className="text-center mt-2">
                      <div className="text-2xl font-bold">85%</div>
                      <div className="text-xs text-emerald-200">Overlap across sources</div>
                    </div>
                  </div>
                </div>
              }
            />
          </div>

          {/* Practice */}
          <div>
            <FeatureCard
              variant="accent"
              icon={<Brain className="w-7 h-7" />}
              title="AI-Powered Practice"
              description={
                <div className="space-y-3">
                  <p>Practice from hundreds of questions generated daily in an interactive UI. Track time, earn XP, and make learning fun.</p>
                  <div className="flex items-center gap-3 pt-2">

                  </div>
                </div>
              }
            />
          </div>

          {/* Discuss */}
          <div>
            <FeatureCard
              variant="default"
              icon={<MessageSquare className="w-7 h-7" />}
              title="Community Discussions"
              description={
                <div className="space-y-3">
                  <p>Join discussions, ask questions, and share insights. Link directly to questions for focused help.</p>
                  <div className="text-sm text-emerald-800 font-medium">
                    Growing community
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
