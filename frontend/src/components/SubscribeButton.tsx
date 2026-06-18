'use client'

import { useState } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth'

declare global {
  interface Window {
    Razorpay: any
  }
}

interface Props {
  label?: string
  className?: string
}

export default function SubscribeButton({ label = 'Subscribe ₹999/month', className = '' }: Props) {
  const { user, token, login, isPremium, isTrialActive } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Trial users are "premium" for access purposes but should still be able to
  // set up their paid subscription. Only block when they have a real paid plan.
  const paidActive = isPremium && !isTrialActive

  const handleSubscribe = async () => {
    if (!token || !user) {
      router.push('/register?next=/pricing')
      return
    }
    if (paidActive) return

    setLoading(true)
    setError('')
    try {
      const sub = await api.payments.createSubscription()
      if (!window.Razorpay) {
        throw new Error('Payment gateway failed to load')
      }

      const options = {
        key: sub.key_id,
        subscription_id: sub.subscription_id,
        name: 'LogicTrade / MarketMind Labs',
        description: `Premium — ₹${sub.amount_inr}/month after ${sub.trial_days}-day trial`,
        prefill: { name: sub.user.name, email: sub.user.email },
        theme: { color: '#2563eb' },
        handler: async (response: {
          razorpay_subscription_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          await api.payments.verify({
            razorpay_subscription_id: response.razorpay_subscription_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })
          const me = await api.auth.me()
          login(token, me)
          router.push('/dashboard')
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', () => setError('Payment failed. Please try again.'))
      rzp.open()
    } catch (e: any) {
      setError(e.message || 'Could not start checkout')
    } finally {
      setLoading(false)
    }
  }

  if (paidActive) {
    return (
      <span className={`inline-block text-center py-3 px-6 rounded-lg bg-green-100 text-green-800 font-semibold ${className}`}>
        Premium Active
      </span>
    )
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 ${className}`}
      >
        {loading ? 'Opening checkout...' : label}
      </button>
      {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
    </>
  )
}
