'use client';

import { MessageSquare } from "lucide-react"
import Link from "next/link"
import { Logo } from '@/components/Logo';
import { ThemeToggle } from "@/components/theme-toggle"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoginForm } from "@/components/login-form"

function LoginContent() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  
  let bannerMessage = ''
  if (redirect === '/admin') {
    bannerMessage = 'Please login to access the Admin Portal'
  } else if (redirect === '/support') {
    bannerMessage = 'Please login to submit a support ticket'
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col overflow-y-auto max-h-svh">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-6 md:px-10 py-4">
          <div className="flex justify-center gap-2 md:justify-start">
            <Link href="/" className="flex items-center gap-2 font-medium flex-1">
              <Logo width={24} height={24} />
              <span className="text-lg font-bold">
                <span className="text-foreground">VerbalForge</span>
              </span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-xs space-y-4">
            {bannerMessage && (
              <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                <AlertDescription>{bannerMessage}</AlertDescription>
              </Alert>
            )}
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted hidden lg:block sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <div className="relative">
            <div className="relative h-[400px] w-[400px] rounded-full border-2 border-border/50 flex items-center justify-center">
              <MessageSquare className="h-32 w-32 text-muted-foreground/30" />
            </div>
            {/* Decorative grid lines */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-0 h-full w-px bg-border/30" />
              <div className="absolute left-0 top-1/2 h-px w-full bg-border/30" />
              <div className="absolute left-1/4 top-1/4 h-1/2 w-1/2 border border-border/20 rotate-45" />
              <div className="absolute left-1/3 top-1/3 h-1/3 w-1/3 border border-border/20 -rotate-45" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-svh flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
