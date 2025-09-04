/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    staleTimes: {
      dynamic: 0,
    },
  },
  transpilePackages: ["@4trip/shared-ui"],
};

export default nextConfig;
