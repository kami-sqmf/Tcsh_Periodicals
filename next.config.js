/** @type {import('next').NextConfig} */
const { withPlaiceholder } = require("@plaiceholder/next");

const nextConfig = withPlaiceholder({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: '**.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/tcsh-periodicals.appspot.com/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
    ],
  },
});

module.exports = nextConfig