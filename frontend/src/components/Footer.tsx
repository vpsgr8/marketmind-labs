import Link from 'next/link'
import { MessageCircle, Mail } from 'lucide-react'
import { OTHER_PRODUCTS } from '@/lib/other-products'

const WHATSAPP_NUMBER = '919527089655'
const CONSULT_EMAIL = 'mml.products26@gmail.com'
const WHATSAPP_MSG = encodeURIComponent(
  "Hi! I'd like to book the ₹3999 one-time LogicTrade consultation to learn how to use the tools properly.",
)

const tools = [
  { label: 'NIFTY Probability', href: '/nifty-probability-calculator' },
  { label: 'BANKNIFTY Probability', href: '/banknifty-probability-calculator' },
  { label: 'SENSEX Probability', href: '/sensex-probability-calculator' },
  { label: 'GANN Square of 9', href: '/gann-square-of-9' },
  { label: 'GANN Time Cycle', href: '/gann-time-cycle-calculator' },
  { label: 'Master Candle Detector', href: '/master-candle-detector' },
  { label: 'Swish Breakout Scanner', href: '/swish-breakout-scanner' },
  { label: 'Intraday Reversal Time', href: '/intraday-reversal-time' },
  { label: 'Support & Resistance', href: '/support-resistance' },
  { label: 'Daily Outlook', href: '/daily-outlook' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div className="max-w-2xl">
              <span className="inline-block bg-yellow-300 text-gray-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
                LIMITED 1-ON-1 SLOTS
              </span>
              <h3 className="text-white text-xl lg:text-2xl font-bold mb-2">
                Want to truly master these tools? Let me teach you personally.
              </h3>
              <p className="text-primary-100 text-sm lg:text-base">
                Book a private 1-on-1 session and I&apos;ll walk you through the exact setups, pro tips,
                hidden tricks, and time-saving cheats to read NIFTY, BANKNIFTY &amp; SENSEX like a pro —
                so you stop guessing and start trading with confidence.
              </p>
              <p className="text-white font-semibold mt-3">
                One-time fee — just{' '}
                <span className="text-yellow-300 text-lg">₹3,999</span>{' '}
                <span className="text-primary-200 font-normal text-sm">
                  (no subscription, lifetime know-how)
                </span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-lg"
              >
                <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
              </a>
              <a
                href={`mailto:${CONSULT_EMAIL}?subject=${encodeURIComponent('LogicTrade ₹3999 Consultation')}`}
                className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg"
              >
                <Mail className="w-5 h-5" /> Email Me
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">LogicTrade</h3>
            <p className="text-sm text-gray-400">
              NIFTY, BANKNIFTY &amp; SENSEX probability, GANN analysis, master candle, and market structure tools for Indian traders.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Tools</h4>
            <ul className="space-y-2 text-sm">
              {tools.slice(0, 5).map((t) => (
                <li key={t.href}>
                  <Link href={t.href} className="hover:text-white transition-colors">{t.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">More Tools</h4>
            <ul className="space-y-2 text-sm">
              {tools.slice(5).map((t) => (
                <li key={t.href}>
                  <Link href={t.href} className="hover:text-white transition-colors">{t.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog &amp; Guides</Link></li>
              <li><Link href="/our-products" className="hover:text-white transition-colors">Our Products</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing — ₹999/mo</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Our Products</h4>
            <ul className="space-y-3 text-sm">
              {OTHER_PRODUCTS.map((p) => (
                <li key={p.domain}>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors block">
                    <span className="text-white font-medium">{p.name}</span>
                    <span className="block text-gray-500 text-xs mt-0.5">{p.tagline}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-xs text-gray-500 space-y-2">
          <p>
            Keywords: NIFTY probability calculator, BANKNIFTY options, GANN square of 9, master candle, swish breakout,
            intraday reversal time, support resistance, daily outlook, SENSEX analysis
          </p>
          <p>Disclaimer: Educational information only. Not investment advice. Trading involves risk.</p>
          <p>&copy; {new Date().getFullYear()} LogicTrade / MarketMind Labs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
