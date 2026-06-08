import type { NextConfig } from "next"
import path from "path"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  // Railway injects PORT — Next.js reads it automatically from env
  // start script uses: next start -p ${PORT:-3000}

  // Turbopack workspace-root fix: multiple package-lock.json files in the
  // parent directory cause Turbopack to infer the wrong root, which breaks
  // .env.local loading. Pin root explicitly to this project directory.
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
