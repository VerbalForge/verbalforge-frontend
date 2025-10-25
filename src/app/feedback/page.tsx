'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Send, Lightbulb, Bug, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { feedbackService } from '@/lib/services/feedbackService';

type FeedbackType = 'suggestion' | 'bug' | 'general' | 'praise';

export default function Feedback() {
  const [formData, setFormData] = useState<{ email: string; type: FeedbackType; message: string }>({
    email: '',
    type: 'suggestion',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await feedbackService.createFeedback({
        email: formData.email || undefined,
        type: formData.type,
        message: formData.message,
      });
      
      setSubmitStatus('success');
      setFormData({ email: '', type: 'suggestion', message: '' });
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const feedbackTypes: Array<{
    value: FeedbackType;
    label: string;
    icon: typeof Lightbulb;
    description: string;
    color: string;
    bg: string;
  }> = [
    {
      value: 'suggestion',
      label: 'Feature Suggestion',
      icon: Lightbulb,
      description: 'Share ideas for new features',
      color: 'text-yellow-600',
      bg: 'bg-yellow-100 dark:bg-yellow-950/40',
    },
    {
      value: 'bug',
      label: 'Bug Report',
      icon: Bug,
      description: 'Report issues or errors',
      color: 'text-red-600',
      bg: 'bg-red-100 dark:bg-red-950/40',
    },
    {
      value: 'general',
      label: 'General Feedback',
      icon: MessageSquare,
      description: 'Share your thoughts',
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-950/40',
    },
    {
      value: 'praise',
      label: 'Compliment',
      icon: Sparkles,
      description: 'Let us know what you love',
      color: 'text-emerald-600',
      bg: 'bg-emerald-100 dark:bg-emerald-950/40',
    },
  ];

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

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            We value your feedback!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help us improve VerbalForge by sharing your thoughts, ideas, and experiences
          </p>
        </div>

        {/* Feedback Type Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {feedbackTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div
                key={type.value}
                onClick={() => setFormData({ ...formData, type: type.value as FeedbackType })}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.type === type.value
                    ? 'border-primary bg-emerald-10 shadow-md'
                    : 'border hover:border-emerald-30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${type.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${type.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{type.label}</h3>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feedback Form */}
        <div className="bg-card rounded-3xl border-2 p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                Your Email (optional)
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 border-2 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-background"
                disabled={isSubmitting}
              />
              <p className="mt-2 text-sm text-muted-foreground">
                Leave your email if you&apos;d like us to follow up with you
              </p>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-muted-foreground mb-2">
                Your Feedback
              </label>
              <textarea
                id="message"
                required
                minLength={10}
                maxLength={5000}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={
                  formData.type === 'suggestion'
                    ? 'I think it would be great if VerbalForge had...'
                    : formData.type === 'bug'
                    ? 'I encountered an issue when...'
                    : formData.type === 'praise'
                    ? 'I really love how...'
                    : 'I wanted to share that...'
                }
                rows={8}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none bg-background"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground/80 mt-1">
                {formData.message.length}/5000 characters (minimum 10)
              </p>
            </div>

            {submitStatus === 'success' && (
              <div className="p-4 bg-emerald-100 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/50 rounded-xl">
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Thank you! Your feedback helps us make VerbalForge better 🎉
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-4 bg-red-100 dark:bg-red-950/30 border border-red-300 dark:border-red-800/50 rounded-xl">
                <p className="text-red-800 dark:text-red-400 font-semibold">
                  Oops! Something went wrong. Please try again.
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
                  Submit Feedback
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 p-6 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl">
            <h3 className="font-semibold text-foreground mb-2">💡 What makes good feedback?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Be specific about what you experienced or what you&apos;d like to see</li>
              <li>✓ Include steps to reproduce bugs or errors</li>
              <li>✓ Explain how a feature would help your learning</li>
              <li>✓ Share both what works well and what could be better</li>
            </ul>
          </div>
        </div>

        <p className="text-center text-muted-foreground/80 text-sm mt-8">
          All feedback is reviewed by our team. Thank you for helping us improve! 🙏
        </p>
      </div>
    </div>
  );
}
