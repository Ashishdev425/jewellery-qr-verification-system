import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
      experimental: {
        serverActions: {
          allowedOrigins: [
            "3000-124b65b9-5be0-4186-9585-51cc8e0ba6f7.orchids.cloud",
            "3000-124b65b9-5be0-4186-9585-51cc8e0ba6f7.proxy.daytona.works"
          ]
        }
      }
};

export default nextConfig;
// Orchids restart: 1768041091531
