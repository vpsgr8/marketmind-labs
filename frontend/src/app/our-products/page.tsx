import type { Metadata } from 'next'
import { ExternalLink, Wrench, Languages } from 'lucide-react'
import { OTHER_PRODUCTS } from '@/lib/other-products'

export const metadata: Metadata = {
  title: 'Our Products — MarketMind Labs',
  description:
    'Explore other products from MarketMind Labs: WorkPilot Tools (67+ free online PDF, AI, and utility tools) and English in 100 Days (spoken English for Indian learners).',
  keywords: [
    'MarketMind Labs products',
    'WorkPilot Tools',
    'workpilottools.biz',
    'English in 100 Days',
    'englishlearner.store',
    'spoken English India',
    'free online tools',
  ],
}

const icons = [Wrench, Languages]

export default function OurProductsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl lg:text-4xl font-bold mb-2">Our Products</h1>
      <p className="text-gray-500 mb-8">
        LogicTrade is one of several practical products built by{' '}
        <strong className="text-gray-700">MarketMind Labs</strong> for Indian users. Explore our sister sites below.
      </p>

      <div className="space-y-8">
        {OTHER_PRODUCTS.map((product, i) => {
          const Icon = icons[i] ?? Wrench
          return (
            <article
              key={product.domain}
              className="bg-white border border-gray-200 rounded-xl p-6 lg:p-8 hover:border-primary-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary-50 rounded-lg shrink-0">
                  <Icon className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{product.name}</h2>
                  <p className="text-primary-600 font-medium">{product.tagline}</p>
                </div>
              </div>

              <p className="text-gray-600 mb-5">{product.description}</p>

              <ul className="space-y-2 mb-6">
                {product.highlights.map((item) => (
                  <li key={item} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-primary-500 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Visit {product.domain}
                <ExternalLink className="w-4 h-4" />
              </a>
            </article>
          )
        })}
      </div>

      <p className="mt-10 text-sm text-gray-400 text-center">
        You are currently on LogicTrade — NIFTY, BANKNIFTY &amp; SENSEX analysis tools at logictrade.site
      </p>
    </div>
  )
}
