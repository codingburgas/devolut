/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true
  },
  env:{
    BACKEND_URL : process.env.BACKEND_URL,
    AVATARS_PATH: process.env.AVATARS_PATH
  }
}

module.exports = nextConfig
