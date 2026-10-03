//app/forgot-password/page.tsx
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center">
        <Link href="/" className="text-2xl font-bold text-kren">
          Kren
        </Link>
        <h1 className="mt-8 text-xl font-bold">Password reset</h1>
        <p className="mt-2 text-sm text-gray-600">
          Password reset is coming soon. Contact support on WhatsApp if you
          need to recover your account.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm font-medium text-kren hover:underline"
        >
          Back to login
        </Link>
      </div>
    </main>
  )
}