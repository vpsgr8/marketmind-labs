'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import type { CandleData, MasterCandleResult } from '@/types'
import ToolGate from '@/components/ToolGate'

export default function MasterCandlePage() {
  const [candles, setCandles] = useState<CandleData[]>([
    { open: 0, high: 0, low: 0, close: 0 },
    { open: 0, high: 0, low: 0, close: 0 },
    { open: 0, high: 0, low: 0, close: 0 },
    { open: 0, high: 0, low: 0, close: 0 },
    { open: 0, high: 0, low: 0, close: 0 },
  ])
  const [result, setResult] = useState<MasterCandleResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateCandle = (idx: number, field: keyof CandleData, value: string) => {
    const updated = [...candles]
    updated[idx] = { ...updated[idx], [field]: parseFloat(value) || 0 }
    setCandles(updated)
  }

  const detect = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const filled = candles.filter((c) => c.high > 0 && c.low > 0)
      if (filled.length < 5) {
        setError('Enter at least 5 candles (open, high, low, close) to detect a master candle.')
        return
      }
      const res = await api.masterCandle.detect({ candles: filled })
      setResult(res)
    } catch (e: any) {
      setError(e.message || 'Detection failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">Master Candle Detector</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Detect master candles, inside bars, breakouts, and swish signals for high-probability trading setups.
        </p>
      </div>

      <ToolGate>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Open</th>
              <th className="p-2 text-left">High</th>
              <th className="p-2 text-left">Low</th>
              <th className="p-2 text-left">Close</th>
            </tr>
          </thead>
          <tbody>
            {candles.map((c, i) => (
              <tr key={i} className="border-b">
                <td className="p-2 font-medium">{i + 1}</td>
                {(Object.keys(c) as Array<keyof CandleData>).map((field) => (
                  <td key={field} className="p-1">
                    <input type="number" step="0.05" value={c[field] || ''}
                      onChange={(e) => updateCandle(i, field, e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-sm" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={detect} disabled={loading}
        className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50">
        {loading ? 'Detecting...' : 'Detect Master Candle'}
      </button>
      {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}

      {result && (
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-4">Detection Results</h2>
            {result.found ? (
              <div className="space-y-2 text-sm">
                <p>Master Candle: <span className="font-semibold">#{result.master_candle! + 1}</span></p>
                <p>Range: <span className="font-mono">{result.master_range}</span></p>
                <p>Inside Complete: <span className={result.inside_complete ? 'text-green-600' : 'text-red-600'}>{result.inside_complete ? 'Yes' : 'No'}</span></p>
                {result.breakout && (
                  <p>Breakout: <span className={result.breakout.direction === 'BULLISH' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{result.breakout.direction}</span></p>
                )}
                {result.swish_signal && (
                  <>
                    <p>Swish Signal: <span className="font-bold text-primary-600">{result.swish_signal}</span></p>
                    <p>Swish Probability: <span className="font-semibold">{result.swish_probability}%</span></p>
                    <p>Target: <span className="font-mono">{result.target}</span></p>
                    <p>Risk: <span className="font-mono">{result.risk}</span></p>
                  </>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No master candle detected in the given data.</p>
            )}
          </div>
        </div>
      )}
      </ToolGate>
    </div>
  )
}
