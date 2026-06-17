import Link from 'next/link'

const ALL_TOOLS = [
  { label: 'NIFTY Probability Calculator', href: '/nifty-probability-calculator', keywords: 'NIFTY probability' },
  { label: 'BANKNIFTY Probability Calculator', href: '/banknifty-probability-calculator', keywords: 'BANKNIFTY probability' },
  { label: 'SENSEX Probability Calculator', href: '/sensex-probability-calculator', keywords: 'SENSEX probability' },
  { label: 'GANN Square of 9', href: '/gann-square-of-9', keywords: 'GANN square of 9' },
  { label: 'GANN Time Cycle Calculator', href: '/gann-time-cycle-calculator', keywords: 'GANN time cycle' },
  { label: 'Master Candle Detector', href: '/master-candle-detector', keywords: 'master candle' },
  { label: 'Swish Breakout Scanner', href: '/swish-breakout-scanner', keywords: 'swish breakout' },
  { label: 'Intraday Reversal Time', href: '/intraday-reversal-time', keywords: 'intraday reversal' },
  { label: 'Support & Resistance', href: '/support-resistance', keywords: 'support resistance' },
  { label: 'Daily Outlook Generator', href: '/daily-outlook', keywords: 'daily market outlook' },
]

interface Props {
  current?: string
  title?: string
}

export default function RelatedTools({ current, title = 'Related Analysis Tools' }: Props) {
  const links = ALL_TOOLS.filter((t) => t.href !== current)

  return (
    <section className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {links.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="text-sm text-primary-700 hover:text-primary-900 hover:underline bg-primary-50 px-4 py-3 rounded-lg border border-primary-100"
          >
            {tool.label}
          </Link>
        ))}
      </div>
      <p className="mt-4 text-sm">
        Read our{' '}
        <Link href="/blog" className="text-primary-600 hover:underline font-medium">
          trading analysis blog
        </Link>{' '}
        for NIFTY, BANKNIFTY, GANN, and market structure guides.
      </p>
    </section>
  )
}

export { ALL_TOOLS }
