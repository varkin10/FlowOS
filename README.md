# FlowOS

A product case study on omni-channel order sourcing and delivery promising —
how retailers decide where an order ships from and how they generate a
reliable delivery estimate. See [CLAUDE.md](./CLAUDE.md) for the full project
brief, site map, and content rules.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Prisma +
SQLite · Framer Motion · Recharts

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` / `npm run start` — production build and serve
- `npm run lint` — ESLint
- `npm run db:generate` — generate the Prisma client after editing the schema
- `npm run db:push` — push the Prisma schema to the local SQLite database
- `npm run db:seed` — reseed the local database
- `npm run db:studio` — open Prisma Studio

## Deploying (Vercel)

The seeded `prisma/dev.db` is committed to the repo and read-only in
production — this is a single-tenant demo, not a system that writes data, so
there's nothing to seed or migrate at deploy time. Two things to set:

1. Add a `DATABASE_URL` environment variable in the Vercel project settings
   with the same value as `.env.example` (`file:./dev.db`).
2. `next.config.mjs` includes `experimental.outputFileTracingIncludes` for
   `prisma/dev.db` — without it, Vercel's serverless bundler won't detect the
   SQLite file (it's only referenced via `DATABASE_URL`, not a static
   import), and every Prisma query would 500 in production. Verified locally
   against a production build (`npm run build && npm run start`) that the
   Interactive Demo's Server Action resolves correctly with this config.
