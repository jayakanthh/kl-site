/** @type {import('next').NextConfig} */
// When deployed standalone (Vercel demo), basePath is empty.
// When served inside WordPress, set NEXT_PUBLIC_BASE_PATH=/bachupally-testing at build time.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const nextConfig = {
  output: 'export',
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  reactStrictMode: true,
  images: {
    disableStaticImages: true,
    unoptimized: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|webp|avif)$/i,
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;
