import Link from 'next/link'

const posts = [
  { title: 'Understanding NIFTY Probability Scores', date: '2024-12-01', excerpt: 'Learn how our probability engine calculates bull, bear, and sideways probabilities for NIFTY.', slug: 'understanding-nifty-probability' },
  { title: 'Master Candle Strategy Guide', date: '2024-11-28', excerpt: 'Complete guide to identifying and trading master candle breakouts with swish confirmation.', slug: 'master-candle-strategy-guide' },
  { title: 'GANN Square of 9 for Beginners', date: '2024-11-25', excerpt: 'Introduction to GANN theory and practical application of Square of 9 for intraday trading.', slug: 'gann-square-of-9-beginners' },
  { title: 'BANKNIFTY vs NIFTY: Volatility Comparison', date: '2024-11-22', excerpt: 'Quantitative comparison of BANKNIFTY and NIFTY volatility patterns.', slug: 'banknifty-vs-nifty-volatility' },
  { title: 'Swish Breakout Pattern Explained', date: '2024-11-19', excerpt: 'What is a swish breakout and how to trade it with high probability.', slug: 'swish-breakout-pattern' },
  { title: 'GANN Time Cycles in Indian Markets', date: '2024-11-16', excerpt: 'Applying GANN time cycle analysis to NIFTY and BANKNIFTY for reversal prediction.', slug: 'gann-time-cycles-indian-markets' },
]

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl lg:text-4xl font-bold mb-2">MarketMind Blog</h1>
      <p className="text-gray-500 mb-8">Trading analysis, GANN tutorials, and market structure insights.</p>

      <div className="space-y-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}
            className="block bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-300 hover:shadow-md transition-all">
            <p className="text-sm text-gray-500 mb-1">{post.date}</p>
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600 text-sm">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
