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

## Ön Kayıt ve Başvuru Formu (Multi-Step)

A standalone public route at `/onboarding` (`src/pages/onboarding/page.jsx` →
`OnboardingWizard`). White/light-themed, responsive, 4-step stepper:

1. **Kişisel Bilgiler** — T.C. Kimlik No (11-digit algorithm validation), ad, soyad,
   cinsiyet (radio), doğum tarihi (date input), doğum yeri (81 il select).
2. **İletişim & Adres** — e-posta, telefon (country-code select + masked `(5XX) XXX XX XX`
   input storing raw 10 digits), ikametgah ili + dinamik ilçe select.
3. **Eğitim Bilgileri** — eğitim düzeyi (Lise/Üniversite), okuduğu il + dinamik ilçe,
   eğitim kurumu (üniversite autocomplete from `src/data/tr-universities.js` or free
   text for lise), giriş yılı (year select).
4. **Fotoğraf & Onay** — vesikalık drag & drop (.jpg/.jpeg/.png, max 5MB, preview),
   summary table of all entered data, KVKK checkbox (required), submit.

State managed by React Hook Form + Zod (`src/pages/onboarding/onboarding-schema.js`).
Step validation via `form.trigger(stepFields[n])` before advancing. Data persists
across step navigation.

Data files: `src/data/tr-cities.js` (81 il + ilçeler), `src/data/tr-universities.js`.
Theme: `defaultTheme="light"` in `src/providers/theme-provider.jsx`.

## Notes

- These are `VITE_*` vars — they are baked into the client bundle and exposed to the
  browser by design (the demo ships the service-role key to the client too).
- The other three subprojects (TS/JS Next.js, TS Vite) are not wired into the Base44
  compose; the Next.js ones additionally need Prisma + a database.
