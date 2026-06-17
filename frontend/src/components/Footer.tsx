import Link from 'next/link'

const tools = [
  { label: 'NIFTY Probability', href: '/nifty-probability-calculator' },
  { label: 'BANKNIFTY Probability', href: '/banknifty-probability-calculator' },
  { label: 'Master Candle Detector', href: '/master-candle-detector' },
  { label: 'Swish Breakout Scanner', href: '/swish-breakout-scanner' },
  { label: 'GANN Square of 9', href: '/gann-square-of-9' },
  { label: 'GANN Time Cycle', href: '/gann-time-cycle-calculator' },
  { label: 'Intraday Reversal Time', href: '/intraday-reversal-time' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">LogicTrade</h3>
            <p className="text-sm text-gray-400">
              Probability &amp; market structure analysis for Indian traders. Powered by MarketMind Labs.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Tools</h4>
            <ul className="space-y-2 text-sm">
              {tools.map((t) => (
                <li key={t.href}>
                  <Link href={t.href} className="hover:text-white transition-colors">{t.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing — ₹999/mo</Link></li>
              <li><Link href="/monetization.html" className="hover:text-white transition-colors">Integrations</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-xs text-gray-500 space-y-2">
          <p>
            We use Google AdSense for ads, Amazon Associates for affiliate links, and Razorpay for secure payments.
            Premium subscribers enjoy an ad-free experience.
          </p>
          <p>Disclaimer: Educational information only. Not investment advice. Trading involves risk.</p>
          <p>&copy; {new Date().getFullYear()} LogicTrade / MarketMind Labs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
