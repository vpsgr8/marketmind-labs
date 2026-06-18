'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import type { GannTimeResult } from '@/types'
import ToolGate from '@/components/ToolGate'

export default function GannTimeCyclePage() {
  const [highDate, setHighDate] = useState('')
  const [lowDate, setLowDate] = useState('')
  const [result, setResult] = useState<GannTimeResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const calculate = async () => {
    setError('')
    if (!highDate || !lowDate) {
      setError('Please select both a swing high date and a swing low date.')
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const res = await api.gann.timeCycle({ swing_high_date: highDate, swing_low_date: lowDate })
      setResult(res)
    } catch (e: any) {
      setError(e.message || 'Calculation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">GANN Time Cycle Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate GANN time cycles from swing high and swing low dates. Project future reversal dates.
        </p>
      </div>

      <ToolGate>
      <div className="max-w-lg mx-auto mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Swing High Date</label>
          <input type="date" value={highDate} onChange={(e) => setHighDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Swing Low Date</label>
          <input type="date" value={lowDate} onChange={(e) => setLowDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
        </div>
        <button onClick={calculate} disabled={loading} className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50">
          {loading ? 'Calculating...' : 'Calculate Cycles'}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-4">Time Cycles</h2>
            <p className="text-sm text-gray-500 mb-4">Swing Duration: {result.swing_days} days</p>
            <div className="space-y-3">
              {Object.entries(result.cycles).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-gray-600">{k.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                  <span className="font-mono">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-4">Harmonic Levels</h2>
            <div className="space-y-3">
              {Object.entries(result.harmonic_levels).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-gray-600">{k}</span>
                  <span className="font-mono">{v} days</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      </ToolGate>
    </div>
  )
}
