/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      domains: ['lh3.googleusercontent.com',
          'firebasestorage.googleapis.com',
          "via.placeholder.com",
          "graph.facebook.com",
          'raw.githubusercontent.com'
      ],
  },

  reactStrictMode: true,
}

export default nextConfig