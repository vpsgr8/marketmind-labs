'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { MessageCircle, Mail, Lock, Loader2, CheckCircle2 } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth'

const STORAGE_KEY = 'consultation_contact'
const WHATSAPP_MSG = encodeURIComponent(
  "Hi! I've paid the ₹3999 one-time fee. I'd like to understand the complete usage and strength of the LogicTrade calculators and tools.",
)

type Contact = { whatsapp: string; whatsapp_link: string; email: string }

export default function ConsultationOffer() {
  const { user } = useAuth()
  const [contact, setContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setContact(JSON.parse(saved))
    } catch {
      /* ignore */
    }
  }, [])

  const handleUnlock = async () => {
    setLoading(true)
    setError('')
    try {
      const order = await api.payments.consultation.createOrder({
        name: user?.name,
        email: user?.email,
      })
      if (!window.Razorpay) {
        throw new Error('Payment gateway failed to load. Please refresh and try again.')
      }

      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: 'LogicTrade / MarketMind Labs',
        description: 'Tool walkthrough — one-time access',
        prefill: user ? { name: user.name, email: user.email } : undefined,
        theme: { color: '#2563eb' },
        handler: async (resp: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          try {
            const res = await api.payments.consultation.verify({
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            })
            const c: Contact = {
              whatsapp: res.whatsapp,
              whatsapp_link: res.whatsapp_link,
              email: res.email,
            }
            setContact(c)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(c))
          } catch (e: any) {
            setError(e.message || 'Payment verification failed. Please contact support.')
          }
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

  return (
    <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
          <div className="max-w-2xl">
            <span className="inline-block bg-yellow-300 text-gray-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
              1-ON-1 TOOL WALKTHROUGH
            </span>
            <h3 className="text-white text-xl lg:text-2xl font-bold mb-2">
              Understand the complete strength &amp; usage of every tool
            </h3>
            <p className="text-primary-100 text-sm lg:text-base">
              Want to know the complete strength and correct usage of all the calculators and tools
              built for the Indian trade market — along with a few additional benefits? Connect with us
              for a one-time personal walkthrough that explains each tool in detail.
            </p>
            <p className="text-white font-semibold mt-3">
              One-time fee — just <span className="text-yellow-300 text-lg">₹3,999</span>{' '}
              <span className="text-primary-200 font-normal text-sm">(no subscription)</span>
            </p>
            <p className="text-primary-200/90 text-xs mt-3 leading-relaxed">
              Disclaimer: We are not SEBI-registered and we do not sell any courses. The entire
              discussion is limited strictly to the calculators and tools provided on this website and
              is not investment, trading, or financial advice.
            </p>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            {contact ? (
              <div className="bg-white/10 backdrop-blur rounded-xl p-5 text-left">
                <p className="flex items-center gap-2 text-green-300 font-semibold mb-3">
                  <CheckCircle2 className="w-5 h-5" /> Access unlocked — let&apos;s talk!
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`${contact.whatsapp_link}?text=${WHATSAPP_MSG}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" /> WhatsApp Me
                  </a>
                  <a
                    href={`mailto:${contact.email}?subject=${encodeURIComponent('LogicTrade Consultation')}`}
                    className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                  >
                    <Mail className="w-5 h-5" /> Email Me
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={handleUnlock}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 bg-yellow-300 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-200 transition-colors shadow-lg disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Opening checkout...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" /> Unlock Access — ₹3,999
                    </>
                  )}
                </button>
                <p className="text-primary-200 text-xs mt-2">
                  Pay once · Get my WhatsApp &amp; email instantly
                </p>
                {error && <p className="text-yellow-200 text-sm mt-2">{error}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
