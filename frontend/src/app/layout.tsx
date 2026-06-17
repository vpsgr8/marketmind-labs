import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { AuthProvider } from '@/lib/auth'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AdUnit from '@/components/AdUnit'

export const metadata: Metadata = {
  title: {
    default: 'LogicTrade - Probability & Market Structure Analysis',
    template: '%s | LogicTrade',
  },
  metadataBase: new URL('https://www.logictrade.site'),
  description: "India's first retail trader-focused platform combining Candle Mathematics, Market Structure Analysis, GANN Intelligence, and Probability Models for better trading decisions.",
  keywords: ['NIFTY', 'BANKNIFTY', 'SENSEX', 'probability calculator', 'GANN square of 9', 'master candle', 'swish breakout', 'trading analysis', 'market structure'],
  openGraph: {
    title: 'MarketMind Labs',
    description: 'Probability & Market Structure Analysis Platform',
    type: 'website',
  },
}

const adClient = process.env.NEXT_PUBLIC_AD_CLIENT || ''

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {adClient && !adClient.includes('xxxxxxxx') && (
          <Script
            id="adsense"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <div className="max-w-7xl mx-auto px-4 pb-4 w-full">
            <AdUnit slotKey="footer" format="horizontal" />
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
