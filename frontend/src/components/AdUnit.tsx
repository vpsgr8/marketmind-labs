'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth'

interface Props {
  slot?: string
  slotKey?: 'probability' | 'sidebar' | 'footer'
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
}

export default function AdUnit({ slot, slotKey = 'probability', format = 'auto', className = '' }: Props) {
  const adRef = useRef<HTMLDivElement>(null)
  const { showAds } = useAuth()
  const clientId = process.env.NEXT_PUBLIC_AD_CLIENT
  const adSlot = slot || process.env[`NEXT_PUBLIC_AD_SLOT_${slotKey.toUpperCase()}` as keyof NodeJS.ProcessEnv] || ''

  useEffect(() => {
    if (!showAds || !clientId || clientId.includes('xxxxxxxx')) return
    try {
      const adsbygoogle = (window as any).adsbygoogle || []
      adsbygoogle.push({})
    } catch {}
  }, [showAds, clientId])

  if (!showAds || !clientId || clientId.includes('xxxxxxxx') || !adSlot) {
    return null
  }

  return (
    <div className={`ad-container ${className}`} ref={adRef}>
      <p className="text-xs text-gray-400 mb-1 text-center">Advertisement</p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
