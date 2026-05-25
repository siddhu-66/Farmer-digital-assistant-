import path from "path";
import type { NextConfig } from "next";

import { getBackendOrigin } from "./src/lib/getPublicApiBase.server";

const backendOrigin = getBackendOrigin();

/** Express route prefixes proxied through Next (filesystem /api/* routes take precedence). */
const PROXIED_API_PREFIXES = [
  "auth",
  "farmer",
  "business",
  "order",
  "admin",
  "listings",
  "bids",
  "partners",
  "schemes",
  "sell-request",
  "crops",
  "crop-management",
  "chat",
  "location",
  "ml",
  "market-prices",
  "market",
  "assistant",
];

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "openweathermap.org",
        pathname: "/img/wn/**",
      },
    ],
  },
  async rewrites() {
    const proxyRules = PROXIED_API_PREFIXES.map((prefix) => ({
      source: `/api/${prefix}/:path*`,
      destination: `${backendOrigin}/api/${prefix}/:path*`,
    }));

    return [
      { source: "/api/login", destination: `${backendOrigin}/api/login` },
      ...proxyRules,
      {
        source: "/api/location/:path*",
        destination: `${backendOrigin}/api/location/:path*`,
      },
      {
        source: "/api/weather/by-pincode/:path*",
        destination: `${backendOrigin}/api/weather/by-pincode/:path*`,
      },
    ];
  },
};

export default nextConfig;
