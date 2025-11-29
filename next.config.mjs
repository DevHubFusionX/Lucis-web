/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide', '@react-three/drei', '@react-three/fiber']
  },
  turbopack: {
    moduleIdStrategy: 'deterministic'
  }
};

export default nextConfig;