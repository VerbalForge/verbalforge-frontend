"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import GoogleIcon from '@mui/icons-material/Google'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { useAuth } from "@/contexts/AuthContext"
import { EmailInput } from "@/components/ui/email-input"
import { PhoneInput } from "@/components/ui/phone-input"
import { UsernameInput } from "@/components/ui/username-input"
import { PasswordInput } from "@/components/ui/password-input"
import { PasswordRequirements } from "@/components/password/PasswordRequirements"
import { PasswordValidationAlert } from "@/components/password/PasswordValidationAlert"
import { usePasswordValidation } from "@/hooks/usePasswordValidation"

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const { register: registerUser, user } = useAuth()
  const router = useRouter()

  // Redirect after successful signup
  useEffect(() => {
    if (shouldRedirect && user) {
      router.push(`/${user.username}/dashboard`)
    }
  }, [shouldRedirect, user, router])

  // Use password validation hook
  const {
    errors: passwordErrors,
    validatePassword,
    clearValidation,
  } = usePasswordValidation({ requireCurrentPassword: false })

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    
    // Clear errors when user types in password fields
    if (e.target.name.includes("assword")) {
      clearValidation()
      setError("")
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate password
    const isPasswordValid = validatePassword(
      formData.password,
      formData.confirmPassword
    )

    if (!isPasswordValid) {
      return
    }

    // Basic validation for other fields
    if (!formData.name || formData.name.length < 2) {
      setError("Name must be at least 2 characters")
      return
    }

    if (!formData.username || formData.username.length < 3) {
      setError("Username must be at least 3 characters")
      return
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      setError("Username must be 3-20 characters and contain only letters, numbers, and underscores")
      return
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address")
      return
    }

    if (!formData.phone || formData.phone.length < 10) {
      setError("Please enter a valid phone number")
      return
    }

    setIsLoading(true)

    try {
      await registerUser({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      })

      setShouldRedirect(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    // TODO: Implement Google OAuth signup
    console.log("Google signup clicked")
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your information to get started with VerbalForge
          </p>
        </div>
        {error && (
          <div className="bg-destructive/15 border border-destructive/30 text-destructive px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <UsernameInput
              id="username"
              name="username"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <FieldDescription>
              3-20 characters, letters, numbers, and underscores only
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <EmailInput
              id="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
            <PhoneInput
              id="phone"
              name="phone"
              placeholder="12345-67890"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </Field>
          <FieldSeparator />
          {/* Password Validation Alert */}
          <PasswordValidationAlert errors={passwordErrors} />
          {/* Password Requirements */}
          <PasswordRequirements 
            password={formData.password} 
            showStatus={formData.password.length > 0}
          />
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <PasswordInput
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </Field>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </FieldGroup>
        <FieldSeparator>or</FieldSeparator>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignup}
          disabled={isLoading}
        >
          <GoogleIcon className="mr-2 h-4 w-4" />
          Sign up with Google
        </Button>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </div>
    </form>
  )
}
