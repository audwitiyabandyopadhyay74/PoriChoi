import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',
      "yt3.ggpht.com",
      'firebasestorage.googleapis.com',
      'via.placeholder.com',
      'graph.facebook.com',
      'raw.githubusercontent.com',
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;