import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sortie autonome : l'image Docker n'embarque que le serveur et ses
  // dépendances réellement utilisées, pas tout node_modules.
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.brawlify.com",
      },
    ],
  },
};

export default nextConfig;
