'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { Menu, X, TrendingUp, ChevronDown } from 'lucide-react'

const tools = [
  { label: 'NIFTY Probability', href: '/nifty-probability-calculator' },
  { label: 'BANKNIFTY Probability', href: '/banknifty-probability-calculator' },
  { label: 'SENSEX Probability', href: '/sensex-probability-calculator' },
  { label: 'Master Candle Detector', href: '/master-candle-detector' },
  { label: 'Swish Breakout Scanner', href: '/swish-breakout-scanner' },
  { label: 'GANN Square of 9', href: '/gann-square-of-9' },
  { label: 'GANN Time Cycle', href: '/gann-time-cycle-calculator' },
  { label: 'Intraday Reversal Time', href: '/intraday-reversal-time' },
  { label: 'S&R Engine', href: '/support-resistance' },
  { label: 'Daily Outlook', href: '/daily-outlook' },
]

export default function Header() {
  const { user, isPremium, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">MarketMind Labs</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <div className="relative group">
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className="flex items-center gap-1 text-gray-600 hover:text-primary-600 font-medium"
              >
                Tools <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="py-2">
                  {tools.map((t) => (
                    <Link key={t.href} href={t.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700">
                      {t.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/blog" className="text-gray-600 hover:text-primary-600 font-medium">Blog</Link>
            {isPremium && <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 font-medium">Dashboard</Link>}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-primary-600">
                  {user.name}
                </Link>
                {!isPremium && (
                  <Link href="/pricing" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">
                    Premium
                  </Link>
                )}
                <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-600 hover:text-primary-600 font-medium">Login</Link>
                <Link href="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">
                  Sign Up Free
                </Link>
              </>
            )}
          </div>

          <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="space-y-2">
              {tools.map((t) => (
                <Link key={t.href} href={t.href} className="block py-2 text-gray-600 hover:text-primary-600"
                  onClick={() => setMobileOpen(false)}>
                  {t.label}
                </Link>
              ))}
              <Link href="/blog" className="block py-2 text-gray-600 hover:text-primary-600" onClick={() => setMobileOpen(false)}>Blog</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
