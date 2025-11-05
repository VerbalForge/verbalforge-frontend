export function Stats() {
  return (
    <section className="py-20 bg-gradient-to-br from-emerald-900 to-emerald-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Stats */}
          <div className="space-y-8">
            <div>
              <div className="text-6xl md:text-7xl font-bold mb-2">8 Sources</div>
              <p className="text-emerald-200 text-lg">Premium GRE word lists combined</p>
            </div>
            <div>
              <div className="text-6xl md:text-7xl font-bold mb-2">∞</div>
              <p className="text-emerald-200 text-lg">Unlimited AI practice questions</p>
            </div>
          </div>

          {/* Right side - CTA */}
          <div className="space-y-4">
            <p className="text-emerald-200 font-semibold">LEARN WITH US</p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Master vocab and build the confidence
            </h2>
            <p className="text-emerald-100 text-lg">
              Learn from curated word lists including GregMat, Magoosh, Barron&apos;s, and Manhattan Prep. Practice with unlimited AI-generated questions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
