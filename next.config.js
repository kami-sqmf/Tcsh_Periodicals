/** @type {import('next').NextConfig} */
const nextConfig = {
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
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/tcsh-periodicals.appspot.com/**',
      },
    ],
  },
  i18n: {
    locales: ['en', 'zh', 'de'],
    defaultLocale: 'zh',
  },
}

module.exports = nextConfig
