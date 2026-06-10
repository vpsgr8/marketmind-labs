'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import type { GannSquareResult } from '@/types'

export default function GannSquareOf9Page() {
  const [price, setPrice] = useState('')
  const [result, setResult] = useState<GannSquareResult | null>(null)
  const [loading, setLoading] = useState(false)

  const calculate = async () => {
    if (!price) return
    setLoading(true)
    try {
      const res = await api.gann.squareOf9({ price: parseFloat(price) })
      setResult(res)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">GANN Square of 9</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate GANN harmonic price levels using the Square of 9 method. Get support and resistance at key angles.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Current Price</label>
        <div className="flex gap-2">
          <input type="number" step="0.05" value={price} onChange={(e) => setPrice(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="e.g. 19500" />
          <button onClick={calculate} disabled={loading}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50">
            {loading ? '...' : 'Calculate'}
          </button>
        </div>
      </div>

      {result && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-4">Harmonic Levels</h2>
            <div className="space-y-3">
              {Object.entries(result.levels).map(([k, v]) => (
                <div key={k} className="flex justify-between items-center">
                  <span className="text-gray-600">{k.replace('_support', '° Support').replace('_resistance', '° Resistance').replace('deg', '°')}</span>
                  <span className="font-mono font-semibold">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-4">Cardinal Points</h2>
            <div className="space-y-3">
              {Object.entries(result.cardinal_points).map(([k, v]) => (
                <div key={k} className="flex justify-between items-center">
                  <span className="text-gray-600">{k}</span>
                  <span className="font-mono font-semibold">{v}</span>
                </div>
              ))}
            </div>
            <h2 className="font-semibold text-lg mt-6 mb-4">Ordinal Points</h2>
            <div className="space-y-3">
              {Object.entries(result.ordinal_points).map(([k, v]) => (
                <div key={k} className="flex justify-between items-center">
                  <span className="text-gray-600">{k}</span>
                  <span className="font-mono font-semibold">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
