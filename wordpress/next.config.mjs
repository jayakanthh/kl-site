/** @type {import('next').NextConfig} */
const basePath = '/bachupally-testing';

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
