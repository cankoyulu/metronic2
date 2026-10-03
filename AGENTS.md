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

## Environment / Auth

The app uses Supabase **only for auth** (no Supabase database-table queries). Auth state
is persisted in `localStorage` (`src/auth/lib/helpers.js`). The root `/` route is wrapped
in `<RequireAuth />` and redirects to `/auth/signin` when there is no session.

**Auth backend is selected by `VITE_AUTH_MODE`** (see `src/auth/adapters/index.js`):

- `VITE_AUTH_MODE=local` (default) — uses `src/auth/adapters/local-adapter.js`, a
  localStorage-backed user store seeded with the demo user `demo@kt.com` / `demo123`.
  This lets the demo run with **no external services**. Log in with those credentials to
  see the dashboards. Passwords are plaintext in localStorage (dev-only, not for prod).
- `VITE_AUTH_MODE=supabase` — uses the real `src/auth/adapters/supabase-adapter.js`.
  Requires real `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
  `VITE_SUPABASE_SERVICE_ROLE_KEY` (via the Base44 secrets dashboard, overriding the
  placeholders in `.env.base44-defaults`). `src/lib/supabase.js` calls `createClient(...)`
  at module load, so a valid-format URL placeholder is still needed just to boot.

`src/components/supabase/SupabaseStatus.jsx` is unused and references a non-existent
`isAvailable()` method — left as-is.

## Ön Kayıt (Pre-registration) Wizard

A gate (`src/auth/require-onboarding.jsx` → `<RequireOnboarding />`) sits between
`<RequireAuth />` and `<Demo1Layout />`: after login, if the user hasn't completed
pre-registration they're redirected to `/onboarding` (white-theme step wizard at
`src/pages/onboarding/onboarding-wizard.jsx`). Completing it persists a real record and
sets the complete flag, then redirects to `/`.

- 3 steps: Kimlik (T.C. 11 haneli, Ad/Soyad büyük harf, doğum, cinsiyet), İletişim
  (e-posta, telefon `0XXX XXX XX XX`, il/ilçe — 81 il + ilçe `src/data/tr-locations.js`,
  ilçe il'e göre dinamik), Fotoğraf (vesikalık yükleme + tarayıcıda biyometrik/arka plan
  analizi + rastgele 6 haneli kullanıcı adı).
- Records persist via `src/lib/onboarding-db.js` to localStorage (the app's local DB),
  keyed by `userId`. `isOnboardingComplete(userId)` / `saveOnboardingRecord(...)`.

## Notes

- These are `VITE_*` vars — they are baked into the client bundle and exposed to the
  browser by design (the demo ships the service-role key to the client too).
- The other three subprojects (TS/JS Next.js, TS Vite) are not wired into the Base44
  compose; the Next.js ones additionally need Prisma + a database.
