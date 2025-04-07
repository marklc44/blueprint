import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/',
        destination: '/assessments/bpds/section/1',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
