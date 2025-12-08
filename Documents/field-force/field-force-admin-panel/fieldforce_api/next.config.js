/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // CORS headers are handled by middleware and apiResponse.ts
  // No need to set them in next.config.js to avoid duplicates
};

module.exports = nextConfig;

