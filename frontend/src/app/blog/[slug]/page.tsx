import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BLOG_POSTS } from '@/lib/blog-posts'
import RelatedTools from '@/components/RelatedTools'

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug)
  if (!post) notFound()

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/blog" className="text-sm text-primary-600 hover:underline mb-4 inline-block">
        ← Back to Blog
      </Link>
      <p className="text-sm text-gray-500 mb-2">{post.date}</p>
      <h1 className="text-3xl lg:text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-6">{post.excerpt}</p>

      <div
        className="prose prose-gray max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: post.content.trim() }}
      />

      <section className="bg-primary-50 border border-primary-100 rounded-xl p-6 mb-8">
        <h2 className="font-semibold text-lg mb-3">Try these tools</h2>
        <ul className="space-y-2">
          {post.relatedTools.map((href) => (
            <li key={href}>
              <Link href={href} className="text-primary-700 hover:underline font-medium">
                {href.replace('/', '').replace(/-/g, ' ')}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <RelatedTools title="More LogicTrade Tools" />
    </article>
  )
}
