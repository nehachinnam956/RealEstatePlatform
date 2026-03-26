/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.housingcdn.com',
      },
      {
        protocol: 'https',
        hostname: '**.housing.com',
      },
    ],
  },
}

module.exports = nextConfig