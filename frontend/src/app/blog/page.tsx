import Link from 'next/link'
import { BLOG_POSTS } from '@/lib/blog-posts'

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl lg:text-4xl font-bold mb-2">LogicTrade Blog</h1>
      <p className="text-gray-500 mb-4">
        NIFTY, BANKNIFTY, SENSEX trading analysis — GANN tutorials, probability models, master candle strategies, and market structure insights.
      </p>
      <p className="text-sm text-gray-400 mb-8">
        Keywords: NIFTY probability, BANKNIFTY options, GANN square of 9, swish breakout, intraday reversal, support resistance, daily outlook
      </p>

      <div className="space-y-6">
        {BLOG_POSTS.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}
            className="block bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-300 hover:shadow-md transition-all">
            <p className="text-sm text-gray-500 mb-1">{post.date}</p>
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600 text-sm mb-3">{post.excerpt}</p>
            <p className="text-xs text-primary-600">{post.keywords.join(' · ')}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
