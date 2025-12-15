"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { createCompanyForUser } from "@/lib/supabase/companies"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [isEmployer, setIsEmployer] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters"
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter"
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter"
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number"
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "Password must contain at least one special character"
    }
    return null
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      setLoading(false)
      return
    }

    if (isEmployer && !companyName.trim()) {
      setError("Company name is required for employers")
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            is_employer: isEmployer,
          },
        },
      })

      if (error) {
        if (error.message.includes("already registered") || error.message.includes("already exists")) {
          throw new Error("This email is already registered. Please log in instead.")
        }
        throw error
      }

      if (data?.user?.identities?.length === 0) {
        throw new Error("This email is already registered. Please log in instead.")
      }

      // Create company for employer
      if (isEmployer && data.user && data.session) {
        // Wait for the profile trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1500))

        const { error: companyError } = await createCompanyForUser(
          supabase,
          data.user.id,
          companyName.trim()
        )

        if (companyError) {
          console.error("Failed to create company:", companyError.message)
        }
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "An error occurred during signup")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
              <CardDescription>
                We've sent you a confirmation link to <span className="font-medium text-slate-900">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Click the link in the email to confirm your account and get started.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full">
                  Back to login
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <span className="text-3xl font-bold text-orange-600">Werkly</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Enter your email to get started with Werkly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="8+ chars, uppercase, lowercase, number, special"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <p className="text-xs text-slate-500">
                  Must include: uppercase, lowercase, number, and special character
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label>Account Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEmployer(false)}
                    disabled={loading}
                    className={`rounded-lg border-2 p-4 text-left transition-colors ${!isEmployer
                      ? "border-orange-600 bg-orange-50"
                      : "border-slate-200 hover:border-slate-300"
                      }`}
                  >
                    <p className="font-semibold text-slate-900">Employee</p>
                    <p className="text-xs text-slate-600">Access onboarding content</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEmployer(true)}
                    disabled={loading}
                    className={`rounded-lg border-2 p-4 text-left transition-colors ${isEmployer
                      ? "border-orange-600 bg-orange-50"
                      : "border-slate-200 hover:border-slate-300"
                      }`}
                  >
                    <p className="font-semibold text-slate-900">Employer</p>
                    <p className="text-xs text-slate-600">Manage documents</p>
                  </button>
                </div>
              </div>
              {isEmployer && (
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    type="text"
                    placeholder="Your Company Inc."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required={isEmployer}
                    disabled={loading}
                  />
                </div>
              )}
              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                  {error}
                  {error.includes("already registered") && (
                    <div className="mt-2">
                      <Link href="/login" className="font-medium underline hover:text-red-700">
                        Go to login
                      </Link>
                    </div>
                  )}
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="text-orange-600 hover:text-orange-700 font-medium">
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
