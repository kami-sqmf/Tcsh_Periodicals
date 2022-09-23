/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "platform-lookaside.fbsbx.com",
      "lh3.googleusercontent.com",
      "firebasestorage.googleapis.com",
      "scontent-hel3-1.cdninstagram.com"
    ],
  },
}

module.exports = nextConfig
