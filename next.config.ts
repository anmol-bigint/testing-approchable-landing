import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  // bundle content/posts so serverless functions can read them at runtime (ISR)
  outputFileTracingIncludes: {
    '/blog': ['./content/posts/**/*'],
    '/blog/[slug]': ['./content/posts/**/*'],
  },
  async redirects() {
    return [
      { source: '/glossary', destination: '/ai-glossary', permanent: true },
      { source: '/glossary/:slug', destination: '/ai-glossary/:slug', permanent: true },
    ];
  },
};

export default nextConfig;
