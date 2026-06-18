import type { Metadata } from 'next'
import ProbabilityCalculator from '@/components/ProbabilityCalculator'
import ToolGate from '@/components/ToolGate'

export const metadata: Metadata = {
  title: 'SENSEX Probability Calculator',
  description: 'Calculate SENSEX bull, bear, and sideways probability. Free probability analysis tool for SENSEX traders.',
  openGraph: { title: 'SENSEX Probability Calculator - MarketMind Labs' },
}

export default function SensexProbabilityPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">SENSEX Probability Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Analyze SENSEX market probability using quantitative candle analysis.
        </p>
      </div>

      <ToolGate>
        <ProbabilityCalculator market="sensex" />
      </ToolGate>
    </div>
  )
}
