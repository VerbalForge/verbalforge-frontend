# VerbalForge Frontend

Next.js App Router frontend for GRE study and administration.

## Stack

- Node.js 20.18.0 (see `.nvmrc`)
- Next.js 15, React 19, and strict TypeScript
- Tailwind CSS 4 with shadcn/Radix components

## Commands

- `npm ci`: install the locked dependencies in a clean environment
- `npm run dev`: start the Turbopack development server
- `npm run build`: create the production build
- `npm start`: invokes `next start`, which is incompatible with the configured `output: "standalone"`
- `npm run lint`: run ESLint

There are no test, standalone typecheck, or format scripts. Do not invent checks that are not defined in `package.json`.

After `npm run build`, start production with `node .next/standalone/server.js`. Make `public` and
`.next/static` available under the standalone output at their expected paths.

## Layout

- `src/app`: App Router pages, layouts, and route-level UI
- `src/components`: shared feature components
- `src/components/ui`: shadcn/Radix UI primitives
- `src/contexts`: React context providers
- `src/hooks`: reusable hooks
- `src/lib/models`: domain models
- `src/lib/services`: backend API services

## Conventions

- Prefer `@/*` imports for files under `src`.
- Use functional components and hooks. Add `"use client"` only when browser APIs, state, effects, or event handlers require it.
- Match neighboring formatting; the repository has no formatter script.
- Use Sonner for user-visible success and error status.
- Route backend calls through the shared `httpClient` and modules in `src/lib/services`; keep authorization decisions and enforcement on the backend.
- Avoid unsanitized HTML.

## Environment And Generated Files

- Refer only to public environment variable names such as `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID`; all `NEXT_PUBLIC_*` values are browser-visible.
- Never inspect or expose `.env.local` or any other environment file.
- Do not edit generated output: `node_modules`, `.next`, `next-env.d.ts`, or `*.tsbuildinfo`.
