/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
      },
      {
        protocol: "https",
        hostname: "hjv2pvkv-3001.inc1.devtunnels.ms",
        port: "",
      },
    ],
  },
};

export default nextConfig;
