import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Visual */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-emerald-600 mb-4">404</h1>
          <div className="flex justify-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-emerald-100 animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-20 h-20 rounded-2xl bg-emerald-200 animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-20 h-20 rounded-2xl bg-emerald-300 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Looks like this page took a detour. It might have been moved, deleted, or perhaps it never existed.
        </p>

        {/* Suggestions */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">Here&apos;s what you can do:</h3>
          <ul className="text-left text-gray-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">✓</span>
              <span>Check the URL for typos or errors</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">✓</span>
              <span>Go back to the previous page</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">✓</span>
              <span>Visit our home page and start fresh</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">✓</span>
              <span>Use the search feature to find what you need</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            size="lg"
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          
          <Link href="/">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 inline-flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>

          <Link href="/words">
            <Button
              variant="outline"
              size="lg"
              className="inline-flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Browse Words
            </Button>
          </Link>
        </div>

        {/* Help */}
        <p className="text-gray-500 text-sm mt-12">
          Still having trouble?{' '}
          <Link href="/support" className="text-emerald-600 hover:text-emerald-700 font-semibold">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
