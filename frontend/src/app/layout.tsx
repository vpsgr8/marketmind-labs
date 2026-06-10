import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'MarketMind Labs - Probability & Market Structure Analysis',
    template: '%s | MarketMind Labs',
  },
  description: "India's first retail trader-focused platform combining Candle Mathematics, Market Structure Analysis, GANN Intelligence, and Probability Models for better trading decisions.",
  keywords: ['NIFTY', 'BANKNIFTY', 'SENSEX', 'probability calculator', 'GANN square of 9', 'master candle', 'swish breakout', 'trading analysis', 'market structure'],
  openGraph: {
    title: 'MarketMind Labs',
    description: 'Probability & Market Structure Analysis Platform',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
          crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
