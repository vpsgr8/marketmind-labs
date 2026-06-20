import type { MetadataRoute } from 'next'
import { BLOG_POSTS } from '@/lib/blog-posts'

const BASE_URL = 'https://www.logictrade.site'

const STATIC_PATHS = [
  '',
  '/pricing',
  '/our-products',
  '/blog',
  '/privacy',
  '/terms',
  // Tools
  '/nifty-probability-calculator',
  '/banknifty-probability-calculator',
  '/sensex-probability-calculator',
  '/master-candle-detector',
  '/swish-breakout-scanner',
  '/gann-square-of-9',
  '/gann-time-cycle-calculator',
  '/intraday-reversal-time',
  '/support-resistance',
  '/daily-outlook',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : path === '/pricing' ? 0.9 : 0.8,
  }))

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticEntries, ...blogEntries]
}
