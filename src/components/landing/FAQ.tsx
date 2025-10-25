'use client';

import { useState } from 'react';
import { ChevronDown, Send, Sparkles } from 'lucide-react';
import { faqService } from '@/lib/services/faqService';

export function FAQ() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ email: '', question: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await faqService.createFAQ({
        email: formData.email,
        question: formData.question,
      });
      
      setSubmitStatus('success');
      setFormData({ email: '', question: '' });
      
      setTimeout(() => {
        setSubmitStatus('idle');
        setIsFormOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to submit FAQ:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <p className="text-primary font-semibold">Got Questions?</p>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            We&apos;re new here! 🚀
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help us build the FAQ section you need. Ask away!
          </p>
        </div>

        <div className="border-2 border-primary/20 rounded-3xl overflow-hidden transition-all hover:shadow-xl bg-card">
          <button
            className="w-full px-6 py-6 text-left flex justify-between items-center gap-4 transition-colors"
            onClick={() => setIsFormOpen(!isFormOpen)}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <span className="font-bold text-foreground text-xl block">
                  What do you want to know?
                </span>
                <span className="text-muted-foreground text-sm">
                  Share your question and email – we&apos;ll get back to you!
                </span>
              </div>
            </div>
            <ChevronDown
              className={`w-6 h-6 text-primary flex-shrink-0 transition-transform ${
                isFormOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          {isFormOpen && (
            <div className="px-6 pb-6 transition-colors">
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border-2 border-primary/20 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-background"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label htmlFor="question" className="block text-sm font-semibold text-foreground mb-2">
                    Your Question
                  </label>
                  <textarea
                    id="question"
                    required
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="What would you like to know about VerbalForge?"
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-primary/20 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none bg-background"
                    disabled={isSubmitting}
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-xl">
                    <p className="text-emerald-800 font-semibold flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Thanks! We&apos;ll answer your question soon 🎉
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-100 border border-red-300 rounded-xl">
                    <p className="text-red-800 font-semibold">
                      Oops! Something went wrong. Please try again.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || submitStatus === 'success'}
                  className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Question
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        <p className="text-center text-muted-foreground text-sm mt-6">
          Common questions will be featured here soon! 💡
        </p>
      </div>
    </section>
  );
}
