// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_NODE_API_URL: process.env.NEXT_PUBLIC_NODE_API_URL,
  },
};

module.exports = nextConfig; // Change this line