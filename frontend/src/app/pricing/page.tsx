'use client'

import Link from 'next/link'
import { Check, Sparkles } from 'lucide-react'
import SubscribeButton from '@/components/SubscribeButton'
import { useAuth } from '@/lib/auth'

const freeFeatures = [
  'All probability & GANN calculators',
  'Blog access',
  'Basic charts',
  'Ads-supported experience',
]

const premiumFeatures = [
  'Everything in Free — ad-free',
  '7-day free trial on signup',
  'Unlimited saved reports',
  'PDF export',
  'Watchlists & price alerts',
  'Daily outlook & premium tools',
]

export default function PricingPage() {
  const { user, isTrialActive, loading } = useAuth()

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-800 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
          <Sparkles className="w-4 h-4" /> 7-day free trial included
        </div>
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Start with a <strong>1-week free trial</strong>, then continue at <strong>₹999/month</strong> via secure Razorpay payments.
          Cancel anytime from your dashboard.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-2">Free</h3>
          <div className="mb-6">
            <span className="text-4xl font-bold">₹0</span>
            <span className="text-gray-500 text-sm"> forever</span>
          </div>
          <ul className="space-y-3 mb-8">
            {freeFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <Link href="/register"
            className="block text-center py-3 rounded-lg font-semibold bg-gray-100 text-gray-800 hover:bg-gray-200">
            Get Started Free
          </Link>
        </div>

        <div className="bg-white border-2 border-primary-500 rounded-2xl p-8 shadow-xl relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-bold px-4 py-1 rounded-full">
            Most Popular
          </div>
          <h3 className="text-xl font-bold mb-2">Premium</h3>
          <div className="mb-2">
            <span className="text-4xl font-bold">₹999</span>
            <span className="text-gray-500 text-sm">/month</span>
          </div>
          <p className="text-sm text-primary-700 font-medium mb-6">
            {isTrialActive && user
              ? `${user.trial_days_remaining} day(s) left in your free trial`
              : '7-day free trial · then ₹999/month via Razorpay'}
          </p>
          <ul className="space-y-3 mb-8">
            {premiumFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
          {!loading && (
            user ? (
              <SubscribeButton
                label={isTrialActive ? 'Subscribe after trial (₹999/mo)' : 'Subscribe ₹999/month'}
              />
            ) : (
              <div className="space-y-3">
                <Link href="/register?next=/pricing"
                  className="block text-center py-3 rounded-lg font-semibold bg-primary-600 text-white hover:bg-primary-700">
                  Start 7-Day Free Trial
                </Link>
                <Link href="/login?next=/pricing"
                  className="block text-center py-3 rounded-lg font-semibold border border-primary-600 text-primary-700 hover:bg-primary-50">
                  Sign in to subscribe
                </Link>
              </div>
            )
          )}
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            Setting up autopay requires a refundable ₹5 verification by Razorpay.
            Your first ₹999 payment happens only after your 7-day free trial ends —
            cancel anytime before then and you won&apos;t be charged.
          </p>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-10 max-w-lg mx-auto">
        Payments processed securely by Razorpay. UPI, cards, and net banking accepted.
        By subscribing you agree to recurring monthly billing after your trial period.
      </p>
    </div>
  )
}
