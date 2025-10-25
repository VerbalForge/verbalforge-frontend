import Link from 'next/link';

export function Footer() {
  const footerSections = [
    {
      title: 'Help',
      links: ['Support', 'Feedback'],
    },
    {
      title: 'Resources',
      links: ['Word Lists'],
    },
  ];

  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-3xl font-bold text-primary mb-4">
              VerbalForge
            </h3>
            <p className="text-muted-foreground mb-6">
              Master vocabulary with AI-powered learning.
            </p>
          </div>

          {/* Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-foreground mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => {
                  const href = 
                    link === 'Support' ? '/support' :
                    link === 'Feedback' ? '/feedback' :
                    link === 'Word Lists' ? '/word-lists' :
                    '#';
                  
                  return (
                    <li key={link}>
                      <Link
                        href={href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} VerbalForge. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/disclosure" className="text-muted-foreground hover:text-primary transition-colors">
              Disclosure
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
