import Link from 'next/link'
import { TrendingUp, BarChart3, Brain, Shield, Zap, Target } from 'lucide-react'

const features = [
  { icon: BarChart3, title: 'Probability Models', desc: 'Data-driven bull/bear/sideways probability scores with confidence metrics.' },
  { icon: Brain, title: 'GANN Intelligence', desc: 'Square of 9 and Time Cycle calculators for harmonic analysis.' },
  { icon: Shield, title: 'Master Candle', desc: 'Detect master candles, inside bars, breakouts, and swish signals.' },
  { icon: Zap, title: 'Swish Breakout', desc: 'Scan for high-probability breakout setups with target and risk levels.' },
  { icon: Target, title: 'S&R Engine', desc: 'Automatic support and resistance detection from price action.' },
  { icon: TrendingUp, title: 'Daily Outlook', desc: 'AI-generated daily market outlook with expected range and strategy.' },
]

const tools = [
  { name: 'NIFTY Probability', href: '/nifty-probability-calculator', desc: 'Calculate bull/bear/sideways probability for NIFTY' },
  { name: 'BANKNIFTY Probability', href: '/banknifty-probability-calculator', desc: 'BANKNIFTY-specific probability analysis' },
  { name: 'GANN Square of 9', href: '/gann-square-of-9', desc: 'GANN harmonic price level calculator' },
  { name: 'Master Candle Detector', href: '/master-candle-detector', desc: 'Find master candles and breakout setups' },
  { name: 'Intraday Reversal Time', href: '/intraday-reversal-time', desc: 'GANN-based intraday reversal timing' },
  { name: 'Daily Outlook Generator', href: '/daily-outlook', desc: 'Complete daily market outlook and strategy' },
]

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6">
              Trade with Data, Not Emotions
            </h1>
            <p className="text-lg lg:text-xl text-primary-200 mb-8">
              India&apos;s first probability &amp; market structure analysis platform for retail traders.
              Make objective trading decisions with quantitative data.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/nifty-probability-calculator"
                className="bg-white text-primary-900 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                Try NIFTY Calculator
              </Link>
              <Link href="/gann-square-of-9"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Explore GANN Tools
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">10 Powerful Analysis Modules</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <f.icon className="w-10 h-10 text-primary-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((t) => (
              <Link key={t.href} href={t.href}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-lg mb-1">{t.name}</h3>
                <p className="text-gray-500 text-sm">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Built for Indian Traders</h2>
          <p className="text-gray-600 mb-8">
            Whether you trade NIFTY, BANKNIFTY, or SENSEX options, our quantitative tools help you
            analyze market structure objectively and make data-driven decisions.
          </p>
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div><div className="text-3xl font-bold text-primary-600">10+</div><div className="text-sm text-gray-500">Analysis Tools</div></div>
            <div><div className="text-3xl font-bold text-primary-600">NIFTY</div><div className="text-sm text-gray-500">BANKNIFTY</div></div>
            <div><div className="text-3xl font-bold text-primary-600">GANN</div><div className="text-sm text-gray-500">Intelligence</div></div>
          </div>
        </div>
      </section>
    </div>
  )
}
