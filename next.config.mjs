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
      {
        protocol: "http",
        hostname: "46.28.44.24",
        port: "3000",
        pathname: "/public/*",
      },
      {
        protocol: "https",
        hostname: "api.drdiptismilesuite.com",
        port: "",
        pathname: "/public/*",
      },
    ],
  },
};

export default nextConfig;
