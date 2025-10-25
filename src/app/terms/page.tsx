import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
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
          Terms of Service
        </h1>
        <p className="text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Agreement to Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing or using VerbalForge, you agree to be bound by these Terms of Service. If you disagree with 
              any part of these terms, you may not access our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Description of Service</h2>
            <p className="text-muted-foreground mb-4">
              VerbalForge is an AI-powered GRE vocabulary learning platform that provides:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Access to curated GRE word lists from multiple sources (GregMat, Magoosh, Barron&apos;s, etc.)</li>
              <li>AI-generated practice questions and exercises</li>
              <li>Progress tracking and performance analytics</li>
              <li>Community discussion features</li>
              <li>Personalized learning recommendations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">User Accounts</h2>
            <p className="text-muted-foreground mb-4">
              When you create an account with us, you must:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide accurate, complete, and current information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Not share your account credentials with others</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We reserve the right to refuse service, terminate accounts, or remove content at our sole discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Acceptable Use</h2>
            <p className="text-muted-foreground mb-4">You agree NOT to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Use the service for any illegal purpose or in violation of any laws</li>
              <li>Attempt to gain unauthorized access to our systems or other users&apos; accounts</li>
              <li>Share, sell, or distribute content from our platform without permission</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Scrape, copy, or download bulk content using automated tools</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Impersonate others or provide false information</li>
              <li>Interfere with or disrupt the service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Intellectual Property</h2>
            <p className="text-muted-foreground mb-4">
              The service and its original content (excluding user-generated content and third-party materials) are the 
              exclusive property of VerbalForge. Our platform, features, and functionality are protected by copyright, 
              trademark, and other intellectual property laws.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Word Lists:</strong> We aggregate vocabulary from publicly available GRE preparation sources. 
              Credit belongs to the original creators (GregMat, Magoosh, Barron&apos;s, etc.). We do not claim ownership 
              of these word lists.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>User Content:</strong> You retain rights to content you post. By posting, you grant us a license 
              to use, modify, and display that content on our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">AI-Generated Content</h2>
            <p className="text-muted-foreground mb-4">
              Our platform uses AI to generate practice questions and learning materials. While we strive for accuracy:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>AI-generated content may contain errors or inaccuracies</li>
              <li>We do not guarantee the correctness of all AI-generated materials</li>
              <li>You should verify important information from authoritative sources</li>
              <li>Use our platform as a supplementary study tool, not as the sole resource</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Disclaimers and Limitations</h2>
            <p className="text-muted-foreground mb-4">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND. 
              We do not guarantee:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Uninterrupted or error-free service</li>
              <li>Specific GRE score improvements</li>
              <li>Accuracy of all content</li>
              <li>Availability of specific features</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              <strong>Limitation of Liability:</strong> To the maximum extent permitted by law, VerbalForge shall not be 
              liable for any indirect, incidental, special, or consequential damages arising from your use of the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Termination</h2>
            <p className="text-muted-foreground mb-4">
              We may terminate or suspend your account immediately, without prior notice, for conduct that we believe:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Violates these Terms of Service</li>
              <li>Is harmful to other users or us</li>
              <li>Violates applicable laws</li>
              <li>Is fraudulent or abusive</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              You may also delete your account at any time through your account settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Changes to Terms</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to modify these terms at any time. We will notify users of significant changes by 
              posting a notice on our platform or via email. Your continued use after changes constitutes acceptance 
              of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Governing Law</h2>
            <p className="text-muted-foreground mb-4">
              These Terms shall be governed by and construed in accordance with applicable laws, without regard to 
              conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <ul className="list-none text-muted-foreground space-y-2">
              <li>Email: verbalforgeai@gmail.com</li>
              <li>
                Support Page: <Link href="/support" className="text-emerald-600 hover:text-emerald-600/80">verbalforge.xyz/support</Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
