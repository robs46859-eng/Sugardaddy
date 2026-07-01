# Sugardaddy — Secrets & Environment Variables

Every secret/variable actually required by the code, where it's used, and where it needs to be configured. Supersedes the current `.env.example` and README, which both list variables (`GEMINI_API_KEY`, `APP_URL`, `DATABASE_URL`, `VITE_FIREBASE_*`) that are not read by any code path — see `SUGARDADDY_CODE_REVIEW.md` and Phase 0 of `DEPLOYMENT_FIX_SPEC.md`.

## Backend — Stripe

| Variable | Purpose | Used in | Where to configure |
|---|---|---|---|
| `STRIPE_SECRET_KEY` | Server-side Stripe API key for creating checkout sessions and constructing webhook events | `server.ts` (`getStripeInstance`, `/api/stripe/create-checkout-session`, `/api/stripe/webhook`) | GitHub Actions secret (if used at build/deploy time) + Cloud Run / hosting platform secret manager at runtime |
| `STRIPE_WEBHOOK_SECRET` | Verifies the `Stripe-Signature` header on incoming webhook events | `server.ts` (`/api/stripe/webhook`) | Same as above. **Must always be set in production** — see Phase 3 of the fix spec regarding the current fail-open bypass when this is missing |

Get both from the Stripe Dashboard → Developers → API keys (secret key) and Developers → Webhooks → your endpoint (signing secret). Use test-mode keys for staging, live-mode keys only in production.

## Backend — Database (Postgres, via `pg` + Drizzle)

| Variable | Purpose | Used in | Where to configure |
|---|---|---|---|
| `SQL_HOST` | Postgres host | `src/db/index.ts` (`createPool`) | Runtime secret manager. Defaults to `127.0.0.1` if unset — **do not rely on this default in production** |
| `SQL_USER` | Postgres application user | `src/db/index.ts` | Runtime secret manager. Defaults to `postgres` if unset |
| `SQL_PASSWORD` | Postgres application user password | `src/db/index.ts` | Runtime secret manager. Defaults to `postgres` if unset — this default must never be used in production |
| `SQL_DB_NAME` | Database name | `src/db/index.ts` | Runtime secret manager. Defaults to `postgres` if unset |
| `SQL_ADMIN_USER` | Elevated Postgres user used for running migrations | `src/db/drizzle.config.ts` | CI secret (only needed where `drizzle-kit` migrations run, not in the running app) |
| `SQL_ADMIN_PASSWORD` | Password for the migrations user | `src/db/drizzle.config.ts` | CI secret, same scope as above |

If the intent is to run on Cloud SQL, also confirm whether connections go through the Cloud SQL Auth Proxy/Unix socket or a direct TCP host — `SQL_HOST` needs to match whichever connection method is chosen; this isn't currently documented anywhere in the repo.

## Backend — Runtime Mode

| Variable | Purpose | Used in | Where to configure |
|---|---|---|---|
| `NODE_ENV` | Set to `production` to serve the static build via Express instead of booting the Vite dev middleware | `server.ts` (`startServer`) | Set directly in the Cloud Run / hosting platform's runtime environment |

## Frontend — Firebase

Firebase client config (`projectId`, `appId`, `apiKey`, `authDomain`, `storageBucket`, `messagingSenderId`) is currently **hardcoded in the committed file `firebase-applet-config.json`**, not sourced from environment variables, even though the README instructs setting `VITE_FIREBASE_*` vars. This is inconsistent — see Phase 0 of the fix spec.

- **If keeping the committed-JSON approach:** no env vars needed for this piece; just keep `firebase-applet-config.json` current and confirm Firebase Auth's authorized-domains list is locked down (Phase 6 of the fix spec) since this file is public in the repo.
- **If switching to env-var-driven config (recommended for multi-environment setups — dev/staging/prod using different Firebase projects):** wire `src/lib/firebase.ts` to read `import.meta.env.VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, and set these as build-time variables in the CI workflow (Vite inlines `VITE_*` vars at build time, so they'd need to be present when `npm run build` runs, not just at runtime).

## CI/CD — Google Cloud Deploy Auth

These are not application secrets but are required for the GitHub Actions deploy workflow to authenticate to Google Cloud. Currently configured directly in the workflow YAML (not as GitHub secrets), via Workload Identity Federation rather than a long-lived key — this is good practice and should stay this way rather than being converted to a static service-account JSON key.

| Value | Purpose | Where it lives today |
|---|---|---|
| `projects/899325565183/locations/global/workloadIdentityPools/github-pool/providers/github-provider` | WIF provider used to authenticate GitHub Actions to GCP without a stored key | Hardcoded in `.github/workflows/firebase-hosting-deploy.yml` and `firebase-hosting-preview.yml` |
| `github-actions-deploy@vertex1-490112.iam.gserviceaccount.com` | Service account the WIF exchange impersonates to run the Firebase deploy | Same files |

This service account currently lacks (or has misconfigured) permissions on project `vertex1-490112`, which is why every deploy run has failed — see Phase 1 of the fix spec. No new secret needs to be created; the IAM role binding needs to be fixed.

## Unused — Safe to Remove from Docs/Examples

These appear in the current README or `.env.example` but are not referenced anywhere in the actual application code:

- `GEMINI_API_KEY` — no `@google/genai` calls exist in the codebase despite the package being a listed dependency
- `APP_URL` — not read anywhere
- `DATABASE_URL` — not read anywhere; the real DB connection uses the discrete `SQL_*` vars above instead
- `VITE_FIREBASE_API_KEY` / `VITE_FIREBASE_AUTH_DOMAIN` / `VITE_FIREBASE_PROJECT_ID` / `VITE_FIREBASE_STORAGE_BUCKET` / `VITE_FIREBASE_MESSAGING_SENDER_ID` / `VITE_FIREBASE_APP_ID` — listed in the README's setup instructions but `src/lib/firebase.ts` reads the committed JSON file instead (only relevant again if Phase 0's env-var migration is adopted)

## Suggested Clean `.env.example`

```
# --- Stripe ---
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# --- Postgres (application runtime) ---
SQL_HOST=
SQL_USER=
SQL_PASSWORD=
SQL_DB_NAME=

# --- Postgres (migrations only, CI/local admin use) ---
SQL_ADMIN_USER=
SQL_ADMIN_PASSWORD=

# --- Runtime mode ---
NODE_ENV=production
```
