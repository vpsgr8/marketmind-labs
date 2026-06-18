'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import type { CandleData } from '@/types'

export default function SwishBreakoutPage() {
  const [candles, setCandles] = useState<CandleData[]>(
    Array.from({ length: 10 }, () => ({ open: 0, high: 0, low: 0, close: 0 }))
  )
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'analyze' | 'scan'>('analyze')

  const updateCandle = (idx: number, field: keyof CandleData, value: string) => {
    const updated = [...candles]
    updated[idx] = { ...updated[idx], [field]: parseFloat(value) || 0 }
    setCandles(updated)
  }

  const run = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const filled = candles.filter((c) => c.high > 0 && c.low > 0)
      if (filled.length < 5) {
        setError('Enter at least 5 candles (open, high, low, close) to scan for swish breakouts.')
        return
      }
      const fn = mode === 'analyze' ? api.swish.analyze : api.swish.scan
      const res = await fn({ candles: filled })
      setResult(res)
    } catch (e: any) {
      setError(e.message || 'Scan failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">Swish Breakout Scanner</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Detect swish breakout patterns - high-probability setups with defined targets and risk levels.
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setMode('analyze')} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'analyze' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Analyze</button>
        <button onClick={() => setMode('scan')} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'scan' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Scan</button>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4 text-xs font-medium text-gray-500">
        <span>#</span><span>Open</span><span>High</span><span>Low</span><span>Close</span>
      </div>
      <div className="space-y-2 mb-6">
        {candles.map((c, i) => (
          <div key={i} className="grid grid-cols-5 gap-2">
            <div className="text-sm font-medium text-gray-500 self-center">{i + 1}</div>
            {(Object.keys(c) as Array<keyof CandleData>).map((field) => (
              <input key={field} type="number" step="0.05" value={c[field] || ''}
                onChange={(e) => updateCandle(i, field, e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm w-full" />
            ))}
          </div>
        ))}
      </div>

      <button onClick={run} disabled={loading}
        className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50">
        {loading ? 'Scanning...' : mode === 'analyze' ? 'Analyze Swish' : 'Scan Swish Patterns'}
      </button>
      {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}

      {result && (
        <div className="mt-8 bg-gray-50 rounded-xl p-6">
          {(Array.isArray(result) && result.length === 0) || result?.found === false ? (
            <p className="text-gray-500">No swish breakout setups detected in the given data.</p>
          ) : (
            <pre className="text-sm overflow-x-auto">{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  )
}
