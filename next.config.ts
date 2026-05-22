import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  // Railway injects PORT — Next.js reads it automatically from env
  // start script uses: next start -p ${PORT:-3000}
}

export default nextConfig
