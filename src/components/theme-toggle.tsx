"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { userService } from "@/lib/services/userService"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isUpdating, setIsUpdating] = React.useState(false)

  const toggleTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    
    // Update theme in database
    setIsUpdating(true)
    try {
      await userService.updateTheme({ theme: newTheme as 'light' | 'dark' })
    } catch (error) {
      console.error('Failed to update theme preference:', error)
      // Theme is still changed locally even if API fails
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="icon"
      onClick={toggleTheme}
      disabled={isUpdating}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
