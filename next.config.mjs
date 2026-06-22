const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  eslint: {
    // eslint-config-next version should match Next.js; until updated, skip lint during build
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
