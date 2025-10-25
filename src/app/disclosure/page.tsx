import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Disclosure() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-600/80 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Disclosure
        </h1>
        <p className="text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">About VerbalForge</h2>
            <p className="text-muted-foreground mb-4">
              VerbalForge is an independent GRE vocabulary learning platform designed to help students prepare for the 
              verbal section of the GRE exam. We are committed to transparency about our service, content sources, and 
              limitations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">No Affiliation with ETS</h2>
            <p className="text-muted-foreground mb-4">
              VerbalForge is <strong>not affiliated with, endorsed by, or sponsored by</strong> Educational Testing Service (ETS), 
              the makers of the GRE® test. GRE® is a registered trademark of ETS. Any references to the GRE exam are 
              for informational purposes only.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Content Sources</h2>
            <p className="text-muted-foreground mb-4">
              We aggregate vocabulary words from publicly available GRE preparation resources. Our word lists include 
              content from:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>GregMat:</strong> Popular GRE preparation resource by Greg Mat</li>
              <li><strong>Magoosh:</strong> Well-known test prep company (Basic, Common, and Advanced word lists)</li>
              <li><strong>Barron&apos;s:</strong> Established test prep publisher</li>
              <li><strong>Manhattan Prep:</strong> Test preparation company</li>
              <li><strong>PrepScholar:</strong> Online test prep service</li>
              <li><strong>PowerScore:</strong> Test prep company</li>
              <li><strong>Vocabulary.com:</strong> Online vocabulary learning platform</li>
              <li><strong>Greenlight Test Prep:</strong> GRE preparation resource</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              <strong>Important:</strong> We do not claim ownership of these word lists. Credit belongs to the original 
              creators and publishers. We compile these publicly available resources to provide comprehensive vocabulary 
              practice in one convenient location.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">AI-Generated Content</h2>
            <p className="text-muted-foreground mb-4">
              Our platform uses artificial intelligence technology to generate:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Practice questions and exercises</li>
              <li>Example sentences and usage contexts</li>
              <li>Study recommendations</li>
              <li>Learning insights and feedback</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              <strong>Limitations:</strong> While we strive for accuracy, AI-generated content may occasionally contain 
              errors or inconsistencies. We encourage users to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Cross-reference important information with official GRE materials</li>
              <li>Report any errors or concerns through our feedback system</li>
              <li>Use our platform as a supplementary study tool alongside official resources</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">No Guarantees</h2>
            <p className="text-muted-foreground mb-4">
              We <strong>do not guarantee</strong>:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Specific score improvements on the GRE exam</li>
              <li>That our word lists cover all possible GRE vocabulary</li>
              <li>That words from our lists will appear on your actual GRE exam</li>
              <li>Acceptance into graduate programs based on your vocabulary preparation</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Success on the GRE depends on many factors including your overall preparation, test-taking skills, and 
              individual effort. VerbalForge is a study tool, not a guarantee of results.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">No Affiliate Relationships</h2>
            <p className="text-muted-foreground mb-4">
              We currently have <strong>no affiliate relationships</strong> or financial partnerships with test prep 
              companies, publishers, or educational institutions. Any references to third-party resources are for 
              informational purposes only.
            </p>
            <p className="text-muted-foreground mb-4">
              If we establish affiliate relationships in the future, we will clearly disclose them on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Data Collection and Privacy</h2>
            <p className="text-muted-foreground mb-4">
              We collect user data to provide and improve our service. This includes:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Account information (email, username)</li>
              <li>Learning progress and performance data</li>
              <li>Usage statistics and interaction patterns</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We <strong>do not sell</strong> your personal information. For complete details about how we handle your 
              data, please see our <Link href="/privacy" className="text-emerald-600 hover:text-emerald-600/80">Privacy Policy</Link>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Community Guidelines</h2>
            <p className="text-muted-foreground mb-4">
              Our platform includes community discussion features. User-generated content (questions, comments, discussions) 
              represents the views of individual users, not VerbalForge. We moderate content but do not pre-screen all posts.
            </p>
            <p className="text-muted-foreground mb-4">
              We reserve the right to remove content that violates our terms or community guidelines.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Accuracy and Updates</h2>
            <p className="text-muted-foreground mb-4">
              We continuously work to improve our platform and update our content. However:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Word definitions and usage examples may be simplified for learning purposes</li>
              <li>Content is regularly updated, but may not reflect the latest changes in GRE format</li>
              <li>We rely on user feedback to identify and correct errors</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Please <Link href="/feedback" className="text-emerald-600 hover:text-emerald-600/80">report any errors</Link> you 
              encounter so we can improve the platform for everyone.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Recommended Official Resources</h2>
            <p className="text-muted-foreground mb-4">
              For the most accurate and up-to-date information about the GRE exam, we recommend:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Official GRE® website: <a href="https://www.ets.org/gre" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-600/80">ets.org/gre</a></li>
              <li>Official GRE® practice materials from ETS</li>
              <li>Official score reporting and test registration through ETS</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Questions and Concerns</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about our disclosures, content sources, or any aspect of our service:
            </p>
            <ul className="list-none text-muted-foreground space-y-2">
              <li>Email: verbalforgeai@gmail.com</li>
              <li>
                Support Page: <Link href="/support" className="text-emerald-600 hover:text-emerald-600/80">verbalforge.xyz/support</Link>
              </li>
              <li>
                Feedback: <Link href="/feedback" className="text-emerald-600 hover:text-emerald-600/80">verbalforge.xyz/feedback</Link>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Updates to This Disclosure</h2>
            <p className="text-muted-foreground mb-4">
              We may update this disclosure page to reflect changes in our service, content sources, or practices. 
              The &quot;Last updated&quot; date at the top indicates when changes were last made.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
