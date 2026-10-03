//app/signup/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/superbase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const fullName = form.get('fullName') as string
    const phoneRaw = form.get('phone') as string
    const phone = phoneRaw.replace(/\D/g, '')
    const password = form.get('password') as string
    const farmName = form.get('farmName') as string
    const location = form.get('location') as string
    const animalCount = parseInt(form.get('animalCount') as string, 10)
    const email = `${phone}@phone.local`

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phoneRaw,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        farm_name: farmName,
        location,
        animal_count: animalCount,
      })
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="min-h-screen grid md:grid-cols-2">
      {/* Left — form */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-kren inline-block"
          >
            Kren
          </Link>

          <h1 className="mt-10 text-2xl font-bold text-gray-900">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Start tracking your livestock in minutes.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Tendai Moyo"
                autoComplete="name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+263 77 123 4567"
                autoComplete="tel"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
              />
              <p className="text-xs text-gray-500">
                At least 6 characters.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="farmName">Farm name</Label>
              <Input
                id="farmName"
                name="farmName"
                type="text"
                placeholder="Mhofu Ranch"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                type="text"
                placeholder="Mashonaland West"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="animalCount">Number of animals</Label>
              <Input
                id="animalCount"
                name="animalCount"
                type="number"
                min="1"
                placeholder="10"
                required
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="consent"
                name="consent"
                required
                className="mt-1 h-4 w-4 rounded border-gray-300 text-kren focus:ring-kren"
              />
              <label
                htmlFor="consent"
                className="text-xs text-gray-600 leading-relaxed"
              >
                I agree to the collection and processing of my personal data
                for the purpose of livestock monitoring, in line with the
                Cyber and Data Protection Act.
              </label>
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
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="mt-8 text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-kren hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Right — brand panel */}
      <div className="hidden md:flex bg-kren relative overflow-hidden p-12 flex-col justify-between text-white">
        <p className="text-sm font-medium opacity-80">
          Kren — Livestock tracking
        </p>
        <div>
          <h2 className="text-3xl font-bold leading-tight">
            Protect every animal on your farm.
          </h2>
          <p className="mt-4 text-white/80 max-w-sm">
            Start with as little as one collar. No hardware installation, no
            commitments. Just real-time visibility of your livestock.
          </p>
        </div>
        <p className="text-xs opacity-70">
          © {new Date().getFullYear()} Kren
        </p>
      </div>
    </main>
  )
}