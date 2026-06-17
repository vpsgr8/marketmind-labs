import type { Metadata } from 'next'
import GannSquareOf9Calculator from '@/components/GannSquareOf9Calculator'

export const metadata: Metadata = {
  title: 'GANN Square of 9 Calculator — NIFTY BANKNIFTY Support & Resistance',
  description:
    'Free GANN Square of 9 calculator for NIFTY, BANKNIFTY, and SENSEX. Calculate harmonic support and resistance levels, cardinal and ordinal GANN points for intraday and swing trading.',
  keywords: [
    'GANN square of 9',
    'GANN calculator',
    'NIFTY GANN levels',
    'BANKNIFTY support resistance',
    'GANN harmonic levels',
    'W.D. Gann',
    'intraday GANN',
    'Indian stock market',
  ],
  openGraph: {
    title: 'GANN Square of 9 Calculator | LogicTrade',
    description: 'Calculate GANN harmonic price levels for NIFTY and BANKNIFTY instantly.',
  },
}

export default function GannSquareOf9Page() {
  return <GannSquareOf9Calculator />
}
