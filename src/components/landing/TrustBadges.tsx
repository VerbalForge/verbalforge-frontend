export function TrustBadges() {
  const partners = [
    { name: 'GregMat', logo: '🏛️'},
    { name: 'Princeton Review', logo: '🎓' },
    { name: 'Kaplan', logo: '📖' },
    { name: 'Magoosh', logo: '🚀' },
    { name: 'Manhattan Prep', logo: '🏛️' },
    { name: 'Barron\'s', logo: '📚' },
  ];

  return (
    <section className="py-12 bg-background border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Sourced words from all the popular sources.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center gap-2 text-xl font-semibold text-foreground"
            >
              <span className="text-2xl">{partner.logo}</span>
              <span className="hidden sm:inline">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
