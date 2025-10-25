import { ValueCard } from './ValueCard';
import { Target, Repeat, Users } from 'lucide-react';

export function Values() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold mb-2">WHY VERBALFORGE</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Built for practice-focused<br />learners like you
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Not every student learns the same way. VerbalForge is designed for those who believe in the power of practice and need unlimited resources to excel.
          </p>
        </div>

        {/* Value cards grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <ValueCard
            icon={<Repeat className="w-7 h-7 text-emerald-800" />}
            title="Unlimited Practice"
            description="No need to ration those limited study materials. Access thousands of AI-generated questions at your fingertips. Practice as much as you need without worrying about running out of resources."
          />
          <ValueCard
            icon={<Target className="w-7 h-7 text-emerald-800" />}
            title="Perfect for Math Backgrounds"
            description={
              <>
                Strong in quant but need to boost verbal? For those who believe - <span className="italic">Practice makes a man perfect</span>, and this platform will give you the volume you need to master vocabulary and ace that verbal section.
              </>
            }
          />
          <ValueCard
            icon={<Users className="w-7 h-7 text-emerald-800" />}
            title="Community Support"
            description="Non-native speakers often need extra help. No more tedious screenshots to friends. Simply link questions and ask the community directly for instant, focused assistance."
          />
        </div>
      </div>
    </section>
  );
}
