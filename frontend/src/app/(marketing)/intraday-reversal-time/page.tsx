'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import type { ReversalTimeResult } from '@/types'

export default function IntradayReversalPage() {
  const [result, setResult] = useState<ReversalTimeResult | null>(null)
  const [times, setTimes] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setError('')
    setLoading(true)
    Promise.all([
      api.reversalTime.calculate({}).then(setResult),
      api.reversalTime.times().then(setTimes),
    ])
      .catch((e: any) => setError(e?.message || 'Could not load reversal times. Please try again.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">Intraday Reversal Time Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          GANN-based intraday reversal timing for the Indian market session. Know when the next reversal is due.
        </p>
      </div>

      {loading && <p className="text-center text-gray-500 mb-6">Loading reversal times…</p>}
      {error && (
        <div className="text-center mb-8">
          <p className="text-red-500 text-sm mb-2">{error}</p>
          <button onClick={load} className="bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">
            Retry
          </button>
        </div>
      )}

      {result && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-4">Session Info</h2>
            <div className="space-y-2">
              <p className="text-sm">Market Open: <span className="font-mono">{result.market_open}</span></p>
              <p className="text-sm">Market Close: <span className="font-mono">{result.market_close}</span></p>
              <p className="text-sm">Time Until Close: <span className="font-mono">{result.time_until_close}</span></p>
              <p className="text-sm">Next Reversal: <span className="font-mono font-semibold text-primary-600">{result.next_reversal.time}</span></p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-4">Reversal Times</h2>
            <div className="space-y-2">
              {result.reversal_times.map((r, i) => (
                <div key={i} className={`flex justify-between items-center p-2 rounded ${r.is_past ? 'opacity-40' : 'bg-primary-50'}`}>
                  <span className="font-mono font-semibold">{r.time}</span>
                  <span className="text-sm text-gray-500">{r.angle_deg}°</span>
                  <span className={`text-xs px-2 py-1 rounded ${r.is_past ? 'bg-gray-200' : 'bg-primary-200 text-primary-800'}`}>
                    {r.is_past ? 'Past' : 'Upcoming'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {times && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="font-semibold text-lg mb-4">GANN Time Analysis</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Time</th>
                  <th className="p-2 text-left">Angle</th>
                  <th className="p-2 text-left">Price Level</th>
                  <th className="p-2 text-left">Significance</th>
                </tr>
              </thead>
              <tbody>
                {times.analysis.map((a: any, i: number) => (
                  <tr key={i} className="border-b">
                    <td className="p-2 font-mono font-semibold">{a.time}</td>
                    <td className="p-2">{a.angle_deg}°</td>
                    <td className="p-2 font-mono">{a.price_level}</td>
                    <td className="p-2">
                      <span className={`text-xs px-2 py-1 rounded ${a.significance === 'MAJOR' ? 'bg-red-100 text-red-700' : a.significance === 'MODERATE' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'}`}>
                        {a.significance}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
