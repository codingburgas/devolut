/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true
  },
  env:{
    BACKEND_URL : process.env.BACKEND_URL,
  }
}

module.exports = nextConfig
