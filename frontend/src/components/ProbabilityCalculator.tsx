'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import ProbabilityGauge from './ProbabilityGauge'
import type { ProbabilityResult } from '@/types'

interface Props {
  market: 'nifty' | 'banknifty' | 'sensex'
}

export default function ProbabilityCalculator({ market }: Props) {
  const [form, setForm] = useState({ open: 0, high: 0, low: 0, close: 0 })
  const [result, setResult] = useState<ProbabilityResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const calculate = async () => {
    setLoading(true)
    setError('')
    try {
      const fn = api.probability[market]
      const res = await fn(form)
      setResult(res)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const signalColor = result?.signal === 'STRONG_BUY' || result?.signal === 'BUY'
    ? 'text-market-bull'
    : result?.signal === 'SELL'
    ? 'text-market-bear'
    : 'text-market-neutral'

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {(['open', 'high', 'low', 'close'] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 uppercase">
                {field}
              </label>
              <input
                type="number"
                step="0.05"
                value={form[field] || ''}
                onChange={(e) => setForm({ ...form, [field]: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder={`Enter ${field}`}
              />
            </div>
          ))}
        </div>

        <button
          onClick={calculate}
          disabled={loading}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Calculating...' : 'Calculate Probability'}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex justify-center gap-6 mb-6">
            <ProbabilityGauge value={result.bull_probability} label="Bull" color="#22c55e" />
            <ProbabilityGauge value={result.bear_probability} label="Bear" color="#ef4444" />
            <ProbabilityGauge value={result.sideways_probability} label="Sideways" color="#f59e0b" />
          </div>

          <div className="text-center space-y-2">
            <p className="text-lg">
              Signal: <span className={`font-bold ${signalColor}`}>{result.signal}</span>
            </p>
            <p className="text-sm text-gray-500">
              Confidence: {result.confidence_score.toFixed(1)}%
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
