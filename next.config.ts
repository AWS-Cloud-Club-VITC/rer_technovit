import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "192.168.29.72",
    "192.168.29.72:3000",
    "localhost",
    "localhost:3000",
  ],
};

export default nextConfig;
