/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prisma reads prisma/dev.db via DATABASE_URL, not a static import, so
  // Next's output file tracing won't bundle it into serverless functions
  // automatically — Vercel deploys would 500 on any Prisma query without
  // this. The seeded dev.db is committed and read-only in production.
  experimental: {
    outputFileTracingIncludes: {
      "/": ["./prisma/dev.db"],
      "/page": ["./prisma/dev.db"],
      "/**/*": ["./prisma/dev.db"],
    },
  },
};

export default nextConfig;
