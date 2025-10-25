"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { authService } from "@/lib/services/authService"

type ThemeProviderProps = Parameters<typeof NextThemesProvider>[0]

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [defaultTheme, setDefaultTheme] = React.useState<string>("system")

  React.useEffect(() => {
    // Fetch user's theme preference from the backend
    const fetchTheme = async () => {
      try {
        const user = await authService.getCurrentUser()
        if (user.preferences?.theme) {
          setDefaultTheme(user.preferences.theme)
        }
      } catch {
        // If API fails, default to system theme
        console.log('Failed to fetch theme preference, using system theme')
        setDefaultTheme("system")
      }
    }

    const token = localStorage.getItem('token')
    if (token) {
      fetchTheme()
    }
  }, [])

  return (
    <NextThemesProvider 
      {...props} 
      defaultTheme={defaultTheme}
      enableSystem
      forcedTheme={undefined}
    >
      {children}
    </NextThemesProvider>
  )
}
