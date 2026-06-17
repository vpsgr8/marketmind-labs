/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['logictrade.site', 'www.logictrade.site'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    NEXT_PUBLIC_AD_CLIENT: process.env.NEXT_PUBLIC_AD_CLIENT || 'ca-pub-xxxxxxxxxxxxxxxx',
    NEXT_PUBLIC_AD_SLOT_PROBABILITY: process.env.NEXT_PUBLIC_AD_SLOT_PROBABILITY || '1234567890',
    NEXT_PUBLIC_AD_SLOT_SIDEBAR: process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR || '1234567891',
    NEXT_PUBLIC_AD_SLOT_FOOTER: process.env.NEXT_PUBLIC_AD_SLOT_FOOTER || '1234567892',
    NEXT_PUBLIC_AMAZON_AFFILIATE_TAG: process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'yourtag-21',
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  },
}

module.exports = nextConfig
