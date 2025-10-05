import { MessageSquare } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col overflow-y-auto max-h-svh">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-6 md:px-10 md:py-6">
          <div className="flex justify-center gap-2 md:justify-start">
            <Link href="/" className="flex items-center gap-2 font-medium flex-1">
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <MessageSquare className="size-4" />
              </div>
              VerbalForge
            </Link>
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-xs">
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
