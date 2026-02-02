/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide', 'lucide-react', '@react-three/drei', '@react-three/fiber', 'framer-motion', '@heroicons/react']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      }
    ],
  },
  turbopack: {
    // Standard Turbopack options
  }
};

export default nextConfig;