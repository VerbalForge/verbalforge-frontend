import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-emerald-800 to-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side */}
          <div className="space-y-4 text-white">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Change the way you learn{' '}
              <span className="italic font-serif">vocabulary</span>
            </h2>
            <p className="text-emerald-100 text-lg max-w-md">
              Join students who refuse to let limited resources hold them back.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-white text-emerald-900 hover:bg-gray-100 px-8 group">
                Get Started Now
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Right side - Decorative element */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl" />
            <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600" />
                  <div className="flex-1">
                    <div className="h-4 bg-white/20 rounded mb-2" />
                    <div className="h-4 bg-white/10 rounded w-2/3" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-white/5 rounded-2xl border border-white/10" />
                  <div className="h-24 bg-white/5 rounded-2xl border border-white/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
