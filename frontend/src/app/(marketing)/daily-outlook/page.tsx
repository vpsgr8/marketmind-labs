'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import type { CandleData, DailyOutlookResult } from '@/types'

export default function DailyOutlookPage() {
  const [candles, setCandles] = useState<CandleData[]>(
    Array.from({ length: 5 }, () => ({ open: 0, high: 0, low: 0, close: 0 }))
  )
  const [result, setResult] = useState<DailyOutlookResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (idx: number, field: keyof CandleData, value: string) => {
    const updated = [...candles]
    updated[idx] = { ...updated[idx], [field]: parseFloat(value) || 0 }
    setCandles(updated)
  }

  const generate = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const filled = candles.filter((c) => c.high > 0 && c.low > 0)
      if (filled.length < 1) {
        setError('Enter at least one candle (open, high, low, close) to generate an outlook.')
        return
      }
      const res = await api.dailyOutlook.generate({ candles: filled, market: 'NIFTY' })
      setResult(res)
    } catch (e: any) {
      setError(e.message || 'Could not generate outlook. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const directionColor = (d: string) =>
    d === 'BULLISH' ? 'text-green-600' : d === 'BEARISH' ? 'text-red-600' : 'text-yellow-600'

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">Daily Outlook Generator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get a complete daily market outlook with direction, probability, expected range, and trading strategy.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="grid grid-cols-5 gap-2 mb-2 text-xs font-medium text-gray-500">
            <span>#</span><span>Open</span><span>High</span><span>Low</span><span>Close</span>
          </div>
          <div className="space-y-2 mb-4">
            {candles.map((c, i) => (
              <div key={i} className="grid grid-cols-5 gap-2">
                <span className="text-sm text-gray-500 self-center">{i + 1}</span>
                {(Object.keys(c) as Array<keyof CandleData>).map((field) => (
                  <input key={field} type="number" step="0.05" value={c[field] || ''}
                    onChange={(e) => update(i, field, e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm w-full" />
                ))}
              </div>
            ))}
          </div>
          <button onClick={generate} disabled={loading} className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50">
            {loading ? 'Generating...' : 'Generate Outlook'}
          </button>
          {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
        </div>

        {result && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{result.market} Outlook</h2>
                  <p className="text-sm text-gray-500">{result.date}</p>
                </div>
                <span className={`text-2xl font-bold ${directionColor(result.direction)}`}>{result.direction}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{result.bullish_probability.toFixed(0)}%</div>
                  <div className="text-xs text-gray-500">Bullish</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">{result.bearish_probability.toFixed(0)}%</div>
                  <div className="text-xs text-gray-500">Bearish</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">{result.sideways_probability.toFixed(0)}%</div>
                  <div className="text-xs text-gray-500">Sideways</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p>Signal: <span className="font-semibold">{result.signal}</span></p>
                <p>Confidence: <span className="font-semibold">{result.confidence_score.toFixed(0)}%</span></p>
                <p>Risk Level: <span className={`font-semibold ${result.risk_level === 'EXTREME' ? 'text-red-600' : result.risk_level === 'HIGH' ? 'text-orange-600' : 'text-green-600'}`}>{result.risk_level}</span></p>
                <p>Expected Range: <span className="font-mono">{result.expected_range.min} - {result.expected_range.max}</span></p>
              </div>
            </div>

            <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
              <h3 className="font-semibold mb-2">Suggested Strategy</h3>
              <p className="text-sm text-gray-700">{result.suggested_strategy}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
