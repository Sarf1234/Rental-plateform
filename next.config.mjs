/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dsc5aznps/image/upload/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dnq42wt3a/image/upload/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dlwcvgox7/image/upload/**',
      },
    ],
  },
  
  async redirects() {
    return [
      {
        source: '/',
        destination: '/city/patna-bihar', // YAHAN APNA DEFAULT CITY DAAL DO
        permanent: true, // 308 permanent redirect (SEO ke liye best)
      }
    ]
  },
};

export default nextConfig;