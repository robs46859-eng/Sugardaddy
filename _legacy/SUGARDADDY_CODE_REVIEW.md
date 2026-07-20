# Sugardaddy — Code Review

Repo: https://github.com/robs46859-eng/Sugardaddy.git (cloned into `sugar/`)
Reviewed: 2026-07-01 · HEAD commit `4e321c3` on `main`

## Git Status

Working tree is clean and up to date with `origin/main` (12 commits, latest: "feat(ui): add 60hz hardware parallax effect and structured category discovery layout"). No local changes, no uncommitted work.

## Deployment Status

CI/CD is GitHub Actions → Firebase Hosting (project `vertex1-490112`), triggered on push to `main`. Checked the live Actions history via the GitHub API:

- **Every single deploy run has failed** — 0 successful runs exist for this workflow, including the run for the current HEAD commit (run `28456959631`, 2026-06-30).
- All recent runs fail at the same step: **"Deploy to Firebase Hosting"**, after build and Google Cloud auth both succeed. This points to a Firebase/Workload Identity Federation (WIF) permissions problem, not a code/build problem.
- Commit history shows three separate attempts to fix this ("fix(ci): fix github actions deploy auth", "...again", "use firebase-tools CLI directly instead of broken action") — none succeeded.
- **Net effect: this app has never been successfully deployed through its CI pipeline. There is no live, working deployment right now.**

## API Calls

**Internal (Express backend in `server.ts`, called from the React frontend):**
| Endpoint | Purpose |
|---|---|
| `GET /api/health` | Health check |
| `POST /api/auth/sync` | Sync Firebase user → Postgres |
| `POST /api/wallet/update` | Update wallet balance |
| `POST /api/stripe/create-checkout-session` | Create Stripe Checkout session |
| `POST /api/stripe/webhook` | Stripe webhook receiver |
| `POST /api/workspace/log` | Log Google Workspace actions to DB |
| `GET /api/workspace/logs/:uid` | Fetch Workspace logs |

**External (called directly from the browser in `WorkspaceHub.tsx`):**
- Firebase Auth (Google sign-in) — `src/lib/firebase.ts`
- Stripe API — via `stripe` SDK, server-side
- Google Forms API — `forms.googleapis.com/v1/forms` (create + batchUpdate)
- Google Calendar API — `www.googleapis.com/calendar/v3/calendars/primary/events`
- Google People API — `people.googleapis.com/v1/people:createContact`
- Google Chat API — `chat.googleapis.com/v1/spaces/Luxe/messages`

These Google Workspace calls run client-side using the OAuth token from Google sign-in — meaning that token (with Drive/Calendar/Forms/Contacts scopes) lives in the browser.

## Environment Variables Needed to Deploy

The README and `.env.example` are **inconsistent with each other and with the actual code** — three different, overlapping sets of variables are referenced:

**Firebase (frontend) — README says these go in `.env`, but they are unused:** `firebase-applet-config.json` is committed to the repo and hardcodes the real project's Firebase config instead. The `VITE_FIREBASE_*` vars listed in the README are dead — `src/lib/firebase.ts` imports the JSON file directly, not `import.meta.env`.

**`.env.example` (backend, AI Studio-oriented):**
- `GEMINI_API_KEY` — unused anywhere in the code (no `@google/genai` calls exist despite being a dependency)
- `APP_URL` — unused
- `DATABASE_URL` — unused; the actual DB connection code doesn't read this var at all

**Actually required by the running code:**
- `STRIPE_SECRET_KEY` — required for any Stripe functionality (checkout, webhook)
- `STRIPE_WEBHOOK_SECRET` — required to verify Stripe webhook signatures; if unset, signature verification is silently bypassed (see fatal issues)
- `SQL_HOST`, `SQL_USER`, `SQL_PASSWORD`, `SQL_DB_NAME` — used by `src/db/index.ts` for the live Postgres connection (defaults to `127.0.0.1`/`postgres`/`postgres` if unset)
- `SQL_ADMIN_USER`, `SQL_ADMIN_PASSWORD` — used only by `drizzle-kit` migrations (`drizzle.config.ts`)
- `NODE_ENV=production` — required to serve the static build instead of booting the Vite dev server

**Recommendation:** before deploying, reconcile these three lists into one accurate `.env.example` (drop `GEMINI_API_KEY`/`APP_URL`/`VITE_FIREBASE_*`, add the `SQL_*` and `STRIPE_*` vars).

## Potentially Fatal / High-Risk Issues

1. **Backend API is not actually deployed anywhere.** `firebase.json` only configures static `hosting` (serves `dist/`) — there's no Cloud Run/Functions target and no rewrite for `/api/*`. Even if the CI deploy started succeeding, all seven Express routes (auth sync, wallet, Stripe checkout, Stripe webhook, workspace logging) would 404 on Firebase Hosting. The frontend calls to `/api/...` have no backend to reach in production.

2. **CI deploy is currently broken with a 0% success rate** (see Deployment Status above) — nothing from `main` is reaching production.

3. **Stripe checkout silently overcharges by 5%.** `server.ts` line 132: `unit_amount: Math.round(amount * 105)` — for cents this should be `amount * 100`. The `* 105` multiplier, labeled "simple nominal simulation" in a comment, charges users 5% more than the amount they requested with no disclosure in the UI. In a real payment flow this is a billing-integrity bug, not a placeholder.

4. **Stripe webhook signature check has a silent bypass.** If `STRIPE_WEBHOOK_SECRET` is unset, `server.ts` skips signature verification entirely and parses the raw request body as a trusted Stripe event (`event = JSON.parse(rawBodyStr)`). Anyone who finds the webhook URL could POST a fake `checkout.session.completed` event and credit funds to any wallet, with no verification. This is exploitable if the env var is ever missing in production.

5. **Identity verification is faked outright.** In `src/App.tsx`, every new user (both the Firebase auth-state fallback and `handleAuthSuccess`) is created with `verification: { governmentId: 'verified', selfie: 'verified', phone: 'verified', email: 'verified' }` — hardcoded to "verified" with no actual ID/selfie check performed. For a marketplace that markets itself around "secure escrows" and safety, shipping fake verification badges is a serious trust-and-safety and potential legal-liability issue, not just a cosmetic bug.

6. **State lives in `localStorage`, not the database, for core business data.** Bookings, providers, messages, and admin revenue are managed almost entirely through React state persisted to `localStorage` (`sugardaddy_bookings`, `sugardaddy_providers`, `sugardaddy_messages`, `sugardaddy_admin_revenue`), while Postgres (via Drizzle) only tracks `users` and Workspace logs. `walletBalance` is tracked independently in both `localStorage` and Postgres and can drift out of sync — the Stripe webhook updates the DB balance, but the frontend's `handleTopUpBalance` updates local state without waiting for webhook confirmation. Two spontaneously-diverging sources of truth for money is a real risk.

7. **Firebase web API key and project config are committed to the public repo** (`firebase-applet-config.json`). Firebase client keys are technically meant to be public, but this only stays safe if Firebase Auth domain restrictions and Firestore/DB security rules are locked down server-side — worth explicitly confirming, since nothing in this repo shows those rules.

8. **DB connection swallows errors silently in places, and defaults to insecure local credentials.** `src/db/index.ts` defaults to `postgres`/`postgres`/`127.0.0.1` if env vars are missing, rather than failing loudly — in a misconfigured production environment this could silently attempt to write to the wrong database instead of erroring out clearly.

9. **Google Workspace OAuth token is held and used client-side** (`WorkspaceHub.tsx`) with broad scopes (Drive, Calendar, Forms, Contacts). No visible token refresh/expiry handling; a stale or leaked token in the browser has meaningful blast radius given the scopes granted.

## Summary

The codebase builds fine locally, but production readiness is low: deploys are 100% failing in CI, and even a successful deploy wouldn't serve the backend API. On top of that, there's a real money-handling bug (5% overcharge), a webhook auth bypass, and fake identity verification badges — the last one in particular is a trust/safety concern given the nature of the platform (escrow-based companionship marketplace).
