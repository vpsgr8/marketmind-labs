'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Lock, Sparkles } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import SubscribeButton from './SubscribeButton'

interface Props {
  children: ReactNode
}

export default function ToolGate({ children }: Props) {
  const { user, isPremium, isTrialActive, loading } = useAuth()
  const pathname = usePathname()
  const next = encodeURIComponent(pathname || '/')

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400">
        <div className="animate-spin h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  // Not signed in — require account
  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-50 mb-4">
          <Lock className="w-7 h-7 text-primary-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">Sign in to use this tool</h2>
        <p className="text-gray-600 text-sm mb-6">
          Create a free account to access all calculators. New users get a{' '}
          <strong>7-day Premium free trial</strong> — no payment required to start.
        </p>
        <div className="space-y-3">
          <Link href={`/register?next=${next}`}
            className="block w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700">
            Start 7-Day Free Trial
          </Link>
          <Link href={`/login?next=${next}`}
            className="block w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-200">
            I already have an account
          </Link>
        </div>
      </div>
    )
  }

  // Signed in and within trial or paid — allow
  if (isPremium) {
    return (
      <div>
        {isTrialActive && (
          <div className="mb-6 flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-2 rounded-lg">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>
              Free trial active
              {typeof user.trial_days_remaining === 'number' && user.trial_days_remaining > 0
                ? ` — ${user.trial_days_remaining} day${user.trial_days_remaining === 1 ? '' : 's'} left.`
                : '.'}{' '}
              <Link href="/pricing" className="underline font-medium">Subscribe ₹999/mo</Link> to keep access after it ends.
            </span>
          </div>
        )}
        {children}
      </div>
    )
  }

  // Signed in but trial ended and not subscribed — upsell
  return (
    <div className="max-w-md mx-auto text-center bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-50 mb-4">
        <Sparkles className="w-7 h-7 text-primary-600" />
      </div>
      <h2 className="text-xl font-bold mb-2">Your free trial has ended</h2>
      <p className="text-gray-600 text-sm mb-6">
        Subscribe to Premium for <strong>₹999/month</strong> to keep using all calculators.
        Billed monthly via Razorpay — cancel anytime.
      </p>
      <SubscribeButton label="Subscribe ₹999/month" />
      <p className="text-xs text-gray-400 mt-4">
        Recurring monthly payment. You can manage it from your{' '}
        <Link href="/dashboard" className="underline">dashboard</Link>.
      </p>
    </div>
  )
}
