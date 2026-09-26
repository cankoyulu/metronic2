# Base44 Dev Environment

This is a **Metronic Tailwind React demos** monorepo (`metronic-tailwind-react-demos/`)
with four subprojects: `javascript/vite`, `typescript/vite`, `javascript/nextjs`,
`typescript/nextjs`. Base44 runs the **`javascript/vite`** subproject (the simplest,
pure-frontend demo).

## Running

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

- Web entry point: host port `3000` → container Vite dev server on `5173`.
- Vite 7.3.2, React 19, Node 22. `npm install --force` is required (React 19 peer-dep conflicts).
- Source is bind-mounted at `/app`; `node_modules` lives in a named volume so deps persist.

## Environment / Supabase

`src/lib/supabase.js` calls `createClient(VITE_SUPABASE_URL, ...)` at **module load**.
With an empty/invalid URL Supabase throws and the whole app crashes, so a valid-format
placeholder is required just to boot — see `.env.base44-defaults`.

- The root `/` route is wrapped in `<RequireAuth />` and redirects to `/auth/signin`
  when there is no session. Without real Supabase credentials the preview shows the
  **sign-in page**; the dashboards and other demo pages are auth-gated.
- To enable login, supply real values for `VITE_SUPABASE_URL`,
  `VITE_SUPABASE_ANON_KEY`, and `VITE_SUPABASE_SERVICE_ROLE_KEY` (via the Base44
  secrets dashboard). They override the placeholders through `/run/base44/app.env`.

## Notes

- These are `VITE_*` vars — they are baked into the client bundle and exposed to the
  browser by design (the demo ships the service-role key to the client too).
- The other three subprojects (TS/JS Next.js, TS Vite) are not wired into the Base44
  compose; the Next.js ones additionally need Prisma + a database.
