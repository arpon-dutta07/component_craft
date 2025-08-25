import type { NextConfig } from "next";
import { createMDX } from 'fumadocs-mdx/next';
const withMDX = createMDX();


const nextConfig: NextConfig = {

  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
    outputFileTracingIncludes: {
        "/**": ["components/componentcraftui/**/*"],
    },
    async headers() {
        return [
            {
                source: "/r/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
        ];
    },

    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'ferf1mheo22r9ira.public.blob.vercel-storage.com',
          port: '',
          pathname: '/**',
        },
      ],
    },

    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default withMDX(nextConfig);