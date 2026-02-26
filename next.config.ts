import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/team-dashboard',
  images: { unoptimized: true }
}

export default nextConfig
