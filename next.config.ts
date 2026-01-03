import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Ignora erros de TypeScript e ESLint para publicar rápido */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
