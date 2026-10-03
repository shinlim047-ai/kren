//app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const email = form.get('email') as string
    const password = form.get('password') as string

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="min-h-screen grid md:grid-cols-2">
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-kren inline-block"
          >
            Kren
          </Link>

          <h1 className="mt-10 text-2xl font-bold text-gray-900">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Log in to see your livestock.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-kren hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-kren hover:bg-kren-dark text-white"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>

          <p className="mt-8 text-sm text-center text-gray-600">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="font-medium text-kren hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden md:flex bg-kren relative overflow-hidden p-12 flex-col justify-between text-white">
        <p className="text-sm font-medium opacity-80">
          Kren Livestock tracking
        </p>
        <div>
          <h2 className="text-3xl font-bold leading-tight">
            Your livestock, always in sight.
          </h2>
          <p className="mt-4 text-white/80 max-w-sm">
            Real-time GPS tracking, geofence alerts, and notifications for easy tracking of your livestock.
          </p>
        </div>
        <p className="text-xs opacity-70">
          © {new Date().getFullYear()} Kren
        </p>
      </div>
    </main>
  )
}