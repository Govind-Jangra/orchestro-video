/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.squarespace-cdn.com',
          pathname: '/content/**',
        },
      ],
      // Alternatively, you can use 'domains' like this:
      // domains: ['images.squarespace-cdn.com'],
    },
  };
  
  export default nextConfig;
  