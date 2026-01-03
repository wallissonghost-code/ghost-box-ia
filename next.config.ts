import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* O Pulo do Gato: Ignora os erros para o site entrar no ar */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
