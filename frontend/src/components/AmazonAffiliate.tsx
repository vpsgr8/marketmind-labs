'use client'

const PRODUCTS = [
  {
    title: 'Trading in the Zone',
    asin: '0071360530',
    description: 'Classic psychology book for disciplined trading.',
  },
  {
    title: 'Technical Analysis of Financial Markets',
    asin: '0130660259',
    description: 'Comprehensive guide to charts and market structure.',
  },
  {
    title: 'Market Wizards',
    asin: '1118273052',
    description: 'Interviews with top traders and their strategies.',
  },
]

function amazonUrl(asin: string, tag: string) {
  return `https://www.amazon.in/dp/${asin}?tag=${tag}`
}

export default function AmazonAffiliate({ className = '' }: { className?: string }) {
  const tag = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG

  if (!tag || tag === 'yourtag-21') {
    return null
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-5 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-orange-600 mb-3">
        Recommended on Amazon
      </p>
      <ul className="space-y-3">
        {PRODUCTS.map((product) => (
          <li key={product.asin}>
            <a
              href={amazonUrl(product.asin, tag)}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block hover:bg-orange-50 rounded-lg p-2 -mx-2 transition-colors"
            >
              <p className="font-medium text-sm text-gray-900">{product.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{product.description}</p>
            </a>
          </li>
        ))}
      </ul>
      <p className="text-[10px] text-gray-400 mt-3">
        As an Amazon Associate we earn from qualifying purchases.
      </p>
    </div>
  )
}
