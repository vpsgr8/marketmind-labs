'use client'

import { useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import type { GannSquareResult } from '@/types'
import RelatedTools from '@/components/RelatedTools'
import MonetizationSidebar from '@/components/MonetizationSidebar'
import AdUnit from '@/components/AdUnit'

export default function GannSquareOf9Calculator() {
  const [price, setPrice] = useState('')
  const [result, setResult] = useState<GannSquareResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const calculate = async () => {
    const value = parseFloat(price)
    if (!price || Number.isNaN(value) || value <= 0) {
      setError('Enter a valid price (e.g. 19500 for NIFTY)')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await api.gann.squareOf9({ price: value })
      setResult(res)
    } catch (e: any) {
      setError(e.message || 'Calculation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">GANN Square of 9 Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Free GANN Square of 9 calculator for NIFTY, BANKNIFTY, and SENSEX. Project harmonic support and resistance levels at 45°, 90°, 180°, 270°, and 360° angles.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-8">
        <div>
          <div className="max-w-md mx-auto mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Price</label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.05"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && calculate()}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. 19500"
              />
              <button
                onClick={calculate}
                disabled={loading}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? '...' : 'Calculate'}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          {result && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="font-semibold text-lg mb-4">Harmonic Levels</h2>
                <div className="space-y-3">
                  {Object.entries(result.levels).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {k.replace('_support', '° Support').replace('_resistance', '° Resistance').replace('deg', '°')}
                      </span>
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

          <section className="mt-10 prose prose-sm max-w-none text-gray-600">
            <h2 className="text-lg font-semibold text-gray-900">What is GANN Square of 9?</h2>
            <p>
              The GANN Square of 9 is a W.D. Gann method to find natural support and resistance levels from any price.
              Traders use it for NIFTY and BANKNIFTY intraday levels, options strike selection, and swing trading.
            </p>
            <p>
              Read our guide:{' '}
              <Link href="/blog/gann-square-of-9-beginners" className="text-primary-600 hover:underline">
                GANN Square of 9 for Beginners
              </Link>
              . Also try the{' '}
              <Link href="/gann-time-cycle-calculator" className="text-primary-600 hover:underline">
                GANN Time Cycle Calculator
              </Link>{' '}
              and{' '}
              <Link href="/intraday-reversal-time" className="text-primary-600 hover:underline">
                Intraday Reversal Time
              </Link>{' '}
              tools.
            </p>
          </section>

          <AdUnit slotKey="probability" format="horizontal" className="mt-8" />
          <RelatedTools current="/gann-square-of-9" />
        </div>
        <MonetizationSidebar />
      </div>
    </div>
  )
}
