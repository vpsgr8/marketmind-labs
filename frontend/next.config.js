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
  },
}

module.exports = nextConfig
