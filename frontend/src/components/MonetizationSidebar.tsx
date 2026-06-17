'use client'

import AdUnit from './AdUnit'
import AmazonAffiliate from './AmazonAffiliate'
import { useAuth } from '@/lib/auth'

export default function MonetizationSidebar() {
  const { showAds } = useAuth()

  if (!showAds) return null

  return (
    <aside className="space-y-6 mt-8 lg:mt-0">
      <AdUnit slotKey="sidebar" format="rectangle" className="min-h-[250px]" />
      <AmazonAffiliate />
    </aside>
  )
}
