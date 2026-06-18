import type { Metadata } from 'next'
import ProbabilityCalculator from '@/components/ProbabilityCalculator'
import AdUnit from '@/components/AdUnit'
import MonetizationSidebar from '@/components/MonetizationSidebar'
import ToolGate from '@/components/ToolGate'

export const metadata: Metadata = {
  title: 'NIFTY Probability Calculator',
  description: 'Calculate NIFTY bull, bear, and sideways probability using candle mathematics, momentum, and volatility analysis. Free online tool for NIFTY traders.',
  openGraph: { title: 'NIFTY Probability Calculator - MarketMind Labs' },
}

export default function NiftyProbabilityPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">NIFTY Probability Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Analyze NIFTY market probability using real-time candle data. Our engine combines candle strength,
          momentum, bull/bear forces, and GANN factors for objective analysis.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-8">
        <div>
          <ToolGate>
            <ProbabilityCalculator market="nifty" />
          </ToolGate>

          <div className="mt-12 p-6 bg-amber-50 border border-amber-200 rounded-xl">
            <h2 className="font-semibold text-lg mb-2">How It Works</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><strong>Candle Strength (30%):</strong> Body-to-range ratio determines directional conviction.</li>
              <li><strong>Bull/Bear Force (20% each):</strong> Upper and lower wick proportions reveal control.</li>
              <li><strong>Momentum (20%):</strong> Rate of change within the candle.</li>
              <li><strong>Trend (15%):</strong> Close position within the range.</li>
              <li><strong>Volatility (10%):</strong> Range relative to price.</li>
              <li><strong>GANN Factor (5%):</strong> Harmonic price proximity.</li>
            </ul>
          </div>

          <div className="mt-8">
            <AdUnit slotKey="probability" format="horizontal" />
          </div>
        </div>
        <MonetizationSidebar />
      </div>
    </div>
  )
}
