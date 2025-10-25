import Link from 'next/link';
import { ArrowLeft, ExternalLink, BookOpen, Github, CheckCircle2 } from 'lucide-react';

export default function WordLists() {
  const wordSources = [
    {
      name: 'GregMat 960',
      words: 960,
      description: 'Curated high-frequency GRE vocabulary from GregMat\'s proven preparation method',
      url: 'https://docs.google.com/spreadsheets/d/1jRATLVV34vATsL4Y67fZZXQc7qZPYc0c0Yk7Bykh4fw/edit#gid=0',
      category: 'Core Lists',
    },
    {
      name: 'PrepScholar 357',
      words: 357,
      description: 'Essential GRE words selected by PrepScholar\'s expert team',
      url: 'https://www.prepscholar.com/gre/blog/gre-vocabulary-list-words/',
      category: 'Core Lists',
    },
    {
      name: 'Magoosh Basic 352',
      words: 352,
      description: 'Foundation vocabulary for GRE beginners from Magoosh',
      url: 'https://s3.amazonaws.com/magoosh.resources/magoosh-gre-1000-words_oct01.pdf',
      category: 'Magoosh Series',
    },
    {
      name: 'Magoosh Common 309',
      words: 309,
      description: 'Frequently appearing GRE words from Magoosh\'s analysis',
      url: 'https://s3.amazonaws.com/magoosh.resources/magoosh-gre-1000-words_oct01.pdf',
      category: 'Magoosh Series',
    },
    {
      name: 'Magoosh Advanced 367',
      words: 367,
      description: 'Advanced vocabulary for high GRE verbal scores',
      url: 'https://s3.amazonaws.com/magoosh.resources/magoosh-gre-1000-words_oct01.pdf',
      category: 'Magoosh Series',
    },
    {
      name: 'Magoosh 1000',
      words: 1000,
      description: 'Complete Magoosh GRE vocabulary collection',
      url: 'https://docs.google.com/spreadsheets/d/1hI7juCF8seIMZwjD6qsUgXZpdpa3VEUVTX8Uzd-_tpI/edit#gid=0',
      category: 'Magoosh Series',
    },
    {
      name: 'PowerScore Repeat Offenders 699',
      words: 699,
      description: 'Words that repeatedly appear on actual GRE tests',
      url: 'https://www.powerscore.com/gre/help/content/Repeat-Offenders-Vocabulary.pdf',
      category: 'Core Lists',
    },
    {
      name: 'Barron\'s 333',
      words: 333,
      description: 'Essential GRE words with proven mnemonics from Barron\'s',
      url: 'https://github.com/tasfik007/Barron-s-333-words-and-their-mnemonics',
      category: 'Barron\'s Series',
    },
    {
      name: 'Greenlight TestPrep Basic 500',
      words: 500,
      description: 'Foundation vocabulary from Greenlight Test Prep',
      url: 'https://quizlet.com/18795939/gre-basic-flash-cards/',
      category: 'Core Lists',
    },
    {
      name: 'Manhattan Prep 1000',
      words: 1000,
      description: 'Comprehensive word list from Manhattan Prep GRE experts',
      url: 'https://quizlet.com/755640375/manhattan-prep-1000-gre-words-definitions-flash-cards/',
      category: 'Core Lists',
    },
    {
      name: 'Vocabulary.com Top 1000',
      words: 1000,
      description: 'Most important academic vocabulary from Vocabulary.com',
      url: 'https://www.vocabulary.com/lists/52473',
      category: 'Extended Lists',
    },
  ];

  const categories = Array.from(new Set(wordSources.map(s => s.category)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-600/80 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Word Lists & Sources
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Complete transparency about our vocabulary sources. We aggregate words from the most trusted 
            GRE preparation resources to give you comprehensive coverage.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card rounded-2xl p-6 border-2 border-emerald-30 shadow-sm">
            <div className="text-4xl font-bold text-emerald-600 mb-2">2,900+</div>
            <div className="text-foreground font-semibold">Curated Words</div>
            <div className="text-sm text-muted-foreground mt-1">Currently available on platform</div>
          </div>
          <div className="bg-card rounded-2xl p-6 border-2 shadow-sm">
            <div className="text-4xl font-bold text-foreground mb-2">11</div>
            <div className="text-foreground font-semibold">Premium Sources</div>
            <div className="text-sm text-muted-foreground mt-1">Top GRE prep companies</div>
          </div>
          <div className="bg-card rounded-2xl p-6 border-2 shadow-sm">
            <div className="text-4xl font-bold text-foreground mb-2">9,500+</div>
            <div className="text-foreground font-semibold">Total Collection</div>
            <div className="text-sm text-muted-foreground mt-1">Available in public repository</div>
          </div>
        </div>

        {/* GitHub Repository */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 mb-12 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <Github className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Open Source Collection</h2>
              <p className="text-gray-300 mb-4">
                Our complete GRE word collection is based on this open source repository available on GitHub. 
                All words are processed through our custom attribution and aggregation scripts, ensuring proper crediting and deduplication across sources.
              </p>
              <a
                href="https://github.com/Xatta-Trone/gre-words-collection"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-card text-foreground rounded-xl font-semibold hover:bg-muted/50 transition-colors"
              >
                <Github className="w-5 h-5" />
                View on GitHub
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Word Sources by Category */}
        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">{category}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {wordSources
                .filter((source) => source.category === category)
                .map((source) => (
                  <div
                    key={source.name}
                    className="bg-card rounded-2xl p-6 border-2 border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{source.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-semibold text-emerald-600">
                            {source.words.toLocaleString()} words
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">{source.description}</p>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-600/80 font-semibold text-sm"
                    >
                      View Original Source
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {/* Dictionary Credits */}
        <div className="bg-card rounded-3xl border-2 border-gray-200 p-8 mb-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-3">Dictionary References</h2>
              <p className="text-muted-foreground mb-4">
                Word definitions, pronunciations, and usage examples are referenced from:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Merriam-Webster Collegiate Dictionary</strong> - Authoritative word definitions and etymology</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Merriam-Webster Collegiate Thesaurus</strong> - Synonyms, antonyms, and related words</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground/80 mt-4">
                We use these resources to ensure accuracy and provide comprehensive word information to our users.
              </p>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-200 dark:border-yellow-800/50 rounded-2xl p-6">
          <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            Important Notice
          </h3>
          <div className="text-muted-foreground space-y-2">
            <p>
              <strong>We do not claim ownership</strong> of these word lists. All credit belongs to the original 
              creators and publishers mentioned above.
            </p>
            <p>
              VerbalForge aggregates these publicly available resources to provide a comprehensive, free vocabulary 
              learning platform. We encourage users to support the original content creators.
            </p>
            <p>
              <strong>Not affiliated with ETS:</strong> VerbalForge is an independent study tool and is not affiliated 
              with, endorsed by, or sponsored by Educational Testing Service (ETS), the makers of the GRE® test.
            </p>
          </div>
        </div>

        {/* How We Use These Lists */}
        <div className="mt-12 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">How We Use These Lists</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              📚 <strong>Aggregation:</strong> We combine words from multiple sources to ensure comprehensive coverage
            </p>
            <p>
              🤖 <strong>AI Enhancement:</strong> Our AI generates unlimited practice questions using these words
            </p>
            <p>
              📊 <strong>Smart Learning:</strong> Words are organized by difficulty and source for targeted practice
            </p>
            <p>
              ✨ <strong>Community:</strong> Students can discuss words and share insights in our community forum
            </p>
          </div>
        </div>

        {/* Questions */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Have questions about our word sources or want to suggest additional lists?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/feedback"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
            >
              Send Feedback
            </Link>
            <Link
              href="/support"
              className="px-6 py-3 border-2 border-gray-200 hover:border-emerald-600 text-muted-foreground hover:text-emerald-600 font-semibold rounded-xl transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
