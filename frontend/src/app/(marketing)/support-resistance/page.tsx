'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import type { CandleData, SupportResistanceResult } from '@/types'

export default function SupportResistancePage() {
  const [candles, setCandles] = useState<CandleData[]>(
    Array.from({ length: 10 }, () => ({ open: 0, high: 0, low: 0, close: 0 }))
  )
  const [result, setResult] = useState<SupportResistanceResult | null>(null)

  const update = (idx: number, field: keyof CandleData, value: string) => {
    const updated = [...candles]
    updated[idx] = { ...updated[idx], [field]: parseFloat(value) || 0 }
    setCandles(updated)
  }

  const calculate = async () => {
    const res = await api.supportResistance.calculate({ candles })
    setResult(res)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">Support &amp; Resistance Engine</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Automatic support and resistance detection using pivot points and price clustering.
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
          <button onClick={calculate} className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700">
            Calculate S&amp;R
          </button>
        </div>

        {result && (
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-4">Key Levels</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-sm text-gray-500">Immediate Resistance</p>
                <p className="text-xl font-bold text-green-600">{result.immediate_resistance ?? 'N/A'}</p>
              </div>
              <div className="border-l-4 border-green-300 pl-4">
                <p className="text-sm text-gray-500">Major Resistance</p>
                <p className="text-lg font-semibold text-green-500">{result.major_resistance ?? 'N/A'}</p>
              </div>
              <div className="border-t border-gray-200 my-4" />
              <div className="border-l-4 border-red-300 pl-4">
                <p className="text-sm text-gray-500">Immediate Support</p>
                <p className="text-lg font-semibold text-red-500">{result.immediate_support ?? 'N/A'}</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <p className="text-sm text-gray-500">Major Support</p>
                <p className="text-xl font-bold text-red-600">{result.major_support ?? 'N/A'}</p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">Current Price: <span className="font-mono font-semibold">{result.current_price}</span></p>
              <p className="text-sm text-gray-500">Range: <span className="font-mono">{result.range_low} - {result.range_high}</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
