'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supportService } from '@/lib/services/supportService';
import { useAuth } from '@/contexts/AuthContext';

export default function Support() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/support');
    } else if (user) {
      // Pre-fill user data
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await supportService.createSupportTicket({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      
      setSubmitStatus('success');
      setFormData({ name: user?.name || '', email: user?.email || '', subject: '', message: '' });
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Failed to submit support ticket:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We&apos;re here to answer your questions and help you succeed
          </p>
        </div>

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-3xl border-2 p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-emerald-10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Contact Support</h2>
                <p className="text-muted-foreground">We&apos;ll get back to you within 24-48 hours</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border-2 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-background"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-muted-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border-2 border rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-muted-foreground mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  required
                  minLength={5}
                  maxLength={200}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 border-2 border rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground/80 mt-1">
                  {formData.subject.length}/200 characters (minimum 5)
                </p>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-muted-foreground mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  minLength={10}
                  maxLength={5000}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe your issue or question in detail..."
                  rows={6}
                  className="w-full px-4 py-3 border-2 border rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground/80 mt-1">
                  {formData.message.length}/5000 characters (minimum 10)
                </p>
              </div>

              {submitStatus === 'success' && (
                <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-xl">
                  <p className="text-emerald-600 font-semibold">
                    ✓ Message sent successfully! We&apos;ll get back to you soon.
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-100 border border-red-300 rounded-xl">
                  <p className="text-red-800 font-semibold">
                    ✗ Something went wrong. Please try again or email us directly.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || submitStatus === 'success'}
                className="w-full py-6 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-muted-foreground">
              <p className="text-center text-muted-foreground">
                You can also email us directly at{' '}
                <a href="mailto:verbalforgeai@gmail.com" className="text-emerald-600 hover:text-emerald-600/80 font-semibold">
                  verbalforgeai@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
