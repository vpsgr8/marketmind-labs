import type { Metadata } from 'next'
import ProbabilityCalculator from '@/components/ProbabilityCalculator'
import AdUnit from '@/components/AdUnit'
import ToolGate from '@/components/ToolGate'

export const metadata: Metadata = {
  title: 'BANKNIFTY Probability Calculator',
  description: 'Calculate BANKNIFTY bull, bear, and sideways probability. Free probability analysis tool for BANKNIFTY traders using quantitative market data.',
  openGraph: { title: 'BANKNIFTY Probability Calculator - MarketMind Labs' },
}

export default function BankNiftyProbabilityPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">BANKNIFTY Probability Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Analyze BANKNIFTY market probability with the same powerful engine used for NIFTY.
          Get objective bull/bear/sideways probabilities based on real candle data.
        </p>
      </div>

      <ToolGate>
        <ProbabilityCalculator market="banknifty" />
      </ToolGate>

      <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-xl">
        <h2 className="font-semibold text-lg mb-2">Why BANKNIFTY Needs Separate Analysis</h2>
        <p className="text-sm text-gray-700">
          BANKNIFTY exhibits different volatility characteristics than NIFTY due to its composition of banking stocks.
          Our probability engine accounts for these differences in its calculations.
        </p>
      </div>

      <div className="mt-8">
        <AdUnit slot="1234567890" format="horizontal" />
      </div>
    </div>
  )
}
