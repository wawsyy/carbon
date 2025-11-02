import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers() {
    // Note: Cross-Origin-Opener-Policy removed to support Base Account SDK
    // FHEVM will work without it in most cases
    return Promise.resolve([
      {
        source: '/',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ]);
  }
};

export default nextConfig;

