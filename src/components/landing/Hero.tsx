import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background to-primary/5 pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <Star className="w-4 h-4 fill-primary" />
              <span>Verbal Prep Made Simple</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Change the way you learn{' '}
                <span className="italic font-serif text-primary">vocabulary</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl">
                Master vocabulary with AI-powered learning. Practice thousands of verbal problems all in one place.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-emerald-800 hover:bg-emerald-900 text-white px-8 group">
                  Get Started Now
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              {/* <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white"
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600">5.0 from 500+ reviews</p>
                </div>
              </div> */}
            </div>
          </div>

          {/* Right Content - Stats Cards */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Words Card */}
              <div className="bg-card rounded-3xl p-5 shadow-lg border">
                <div className="text-4xl font-bold text-foreground mb-1">2,900+</div>
                <div className="text-sm text-muted-foreground mb-2">Words</div>
                <div className="text-xs text-muted-foreground">Comprehensive vocabulary</div>
              </div>

              {/* Questions Card */}
              <div className="bg-emerald-800 rounded-3xl p-5 shadow-lg text-white">
                <div className="text-4xl font-bold mb-1">100+</div>
                <div className="text-sm text-emerald-100 mb-3">Questions</div>
                <div className="flex items-center gap-2 text-emerald-200">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-xs">More added daily</span>
                </div>
              </div>

              {/* Progress Chart */}
              <div className="col-span-2 bg-gradient-to-br from-foreground/90 to-foreground/80 rounded-3xl p-5 shadow-lg text-background">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-sm opacity-80 mb-1">Track your progress</div>
                    <div className="text-2xl font-bold">Daily learning streak</div>
                  </div>
                  <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                    +12%
                  </div>
                </div>
                <div className="flex items-end gap-1 h-16">
                  {[30, 45, 35, 55, 48, 65, 58, 75, 70, 85].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-sm"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
