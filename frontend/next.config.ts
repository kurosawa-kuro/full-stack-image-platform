import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // 許可する画像ドメインのリストに "localhost" を追加
    domains: ['localhost'],
  }, 
};

export default nextConfig;
