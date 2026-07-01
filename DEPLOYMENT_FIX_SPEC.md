# Sugardaddy — Production Readiness Spec

Companion to `SUGARDADDY_CODE_REVIEW.md`. This spec addresses every issue found in that review, organized into build phases rather than a timeline. Each phase lists its goal, the work involved, and what "done" looks like. Phases are ordered by dependency — later phases assume earlier ones are complete, but phases within the same tier (e.g. 3 and 4) can be worked in parallel.

---

## Phase 0 — Establish a Single Source of Truth for Configuration

**Goal:** Stop the current situation where the README, `.env.example`, and the actual code all disagree about what environment variables exist.

Work:
- Delete the unused `GEMINI_API_KEY`, `APP_URL`, and `VITE_FIREBASE_*` references from the README and `.env.example` — none of them are read by any code path.
- Replace `.env.example` with the real variable set: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SQL_HOST`, `SQL_USER`, `SQL_PASSWORD`, `SQL_DB_NAME`, `SQL_ADMIN_USER`, `SQL_ADMIN_PASSWORD`, `NODE_ENV`. (Full detail in `SECRETS_AND_ENV_VARS.md`.)
- Decide, and document in the README, whether Firebase config should move from the committed `firebase-applet-config.json` to environment variables injected at build time (`VITE_FIREBASE_*` consumed via `import.meta.env`), or stay as a checked-in file. Either is workable for Firebase's public client config, but the code and docs need to agree on one approach.
- Add a short "Architecture" section to the README stating explicitly where the frontend is hosted, where the backend runs, and where the database lives — this doesn't exist today and is why the hosting mismatch in Phase 2 happened in the first place.

Done when: a new engineer can read `.env.example` + README and populate a working local environment without reading source code first.

---

## Phase 1 — Get the CI/CD Pipeline to a Green Build

**Goal:** Every push to `main` currently fails at the "Deploy to Firebase Hosting" step (0 successful runs on record, including the current HEAD commit). Fix that before anything else, since no downstream phase can be verified in a real environment otherwise.

Work:
- Pull the failed job logs for the latest run and identify the exact Firebase CLI error (most likely candidates: the Workload Identity Federation service account `github-actions-deploy@vertex1-490112.iam.gserviceaccount.com` lacks the `roles/firebasehosting.admin` — or equivalent — IAM role on project `vertex1-490112`; or the WIF pool/provider attribute mapping doesn't match the GitHub repo).
- Verify the WIF pool (`projects/899325565183/locations/global/workloadIdentityPools/github-pool/providers/github-provider`) has an attribute condition scoped to `repository == "robs46859-eng/Sugardaddy"` and that the service account's IAM policy grants the pool `roles/iam.workloadIdentityUser`.
- Grant the deploy service account `Firebase Hosting Admin` (or `Firebase Admin`) on the target project.
- Re-run the workflow against the current `main` HEAD and confirm `conclusion: success`.
- Add a branch-protection or required-check rule so `main` cannot silently accumulate more failed deploys unnoticed.

Done when: the GitHub Actions run for the latest commit on `main` shows a successful "Deploy to Firebase Hosting" step, and the Firebase Hosting URL serves the current build.

---

## Phase 2 — Fix the Backend Hosting Architecture

**Goal:** `firebase.json` only configures static `hosting`; there is no deploy target for `server.ts`. Right now, even a "successful" Firebase Hosting deploy serves a frontend whose `/api/*` calls have nothing to answer them.

Work — pick one of two structural approaches:

**Option A: Split frontend and backend.**
- Keep Firebase Hosting for the static Vite build (`dist/`).
- Deploy `server.ts` (bundled as `dist/server.cjs`, which the build script already produces) to Cloud Run, and add a Firebase Hosting rewrite rule (`"source": "/api/**"` → `"run": {"serviceId": ..., "region": ...}"`) so `/api/*` requests are proxied to Cloud Run.
- Add a second CI job (or extend the existing one) to build and deploy the Cloud Run container on every push to `main`.

**Option B: Consolidate onto Cloud Run.**
- Drop Firebase Hosting for the app and serve everything — static assets and API — from the existing Express server (it already falls back to `express.static(distPath)` + SPA catch-all in production). Deploy that single container to Cloud Run.
- Simpler operationally (one deploy target, one set of logs) but loses Firebase Hosting's CDN/edge caching for static assets.

Either option requires: confirming outbound connectivity from the chosen compute target to the Postgres instance (Cloud SQL, if that's the intended DB — the current `.env.example` references `DATABASE_URL` in a way that suggests Cloud SQL was originally intended, while the actual code uses discrete `SQL_*` vars for a direct `pg.Pool` connection; reconcile these), and adding `/api/health` to the deploy's smoke test so a broken backend fails the deploy loudly instead of silently.

Done when: hitting `/api/health` on the production URL returns `{"status":"ok", ...}` and a full auth-sync round trip (sign in → `/api/auth/sync` → row appears in Postgres) works against the deployed environment, not just locally.

---

## Phase 3 — Fix the Stripe Payment Bugs

**Goal:** Two issues directly affect real money: an unannounced 5% overcharge, and a webhook signature bypass that lets forged events credit arbitrary wallets.

Work:
- In `server.ts`, change `unit_amount: Math.round(amount * 105)` to `Math.round(amount * 100)` (assuming `amount` is a whole-dollar value with no intended fee). If a platform fee actually is intended, implement it as a separate, disclosed `application_fee_amount` or an itemized line item — not a silent multiplier baked into the base charge.
- Remove the webhook's fallback path that parses `req.body` as a trusted event when `STRIPE_WEBHOOK_SECRET` or the `Stripe-Signature` header is missing. Instead, fail closed: return `400` and log an alert if signature verification can't be performed. A webhook that can't verify its sender should never be treated as trusted, even in "sandbox" scenarios — use a separate test-mode secret instead of disabling verification.
- Add a test that posts an unsigned payload to `/api/stripe/webhook` and asserts it's rejected.
- Add idempotency handling on `checkout.session.completed` (check whether the session ID has already been processed before crediting a wallet) so retried webhook deliveries can't double-credit.

Done when: a test suite covers (a) correct cent conversion for a range of dollar amounts, (b) rejection of unsigned/forged webhook payloads, and (c) no double-credit on duplicate webhook delivery.

---

## Phase 4 — Replace Fake Identity Verification with Real Verification

**Goal:** Every new user is currently created with `governmentId/selfie/phone/email: 'verified'` hardcoded, regardless of whether any check happened. For a platform built around "secure escrows" and safety, this is the highest-priority trust/safety fix in the codebase.

Work:
- Change the default verification state on user creation (both the Firebase auth-state-listener fallback and `handleAuthSuccess` in `App.tsx`) to `'unverified'` (or `'pending'`) for every field.
- Decide on and integrate an actual verification provider for government ID + selfie liveness matching (e.g., Stripe Identity, Persona, or Onfido — Stripe Identity is a natural fit given Stripe is already integrated for payments).
- Gate provider-side actions that currently assume verification (accepting bookings, receiving escrow funds) behind the real verification status instead of the current always-true flag.
- Add a `VerificationCenter` backend endpoint that receives the verification provider's webhook/callback and updates the user's row in Postgres — verification state should live in the database, not just in `localStorage`.
- Audit `ExportCenter.tsx` and any other component that reads `verification.*` to confirm they reflect the new real status.

Done when: a freshly created account shows "unverified" across the board until it completes an actual verification flow, and that state is persisted server-side.

---

## Phase 5 — Make the Database the Single Source of Truth

**Goal:** Bookings, providers, messages, and admin revenue currently live in `localStorage`, while Postgres only tracks `users` and Workspace logs. Wallet balance is tracked in both places independently and can drift.

Work:
- Extend the Drizzle schema (`src/db/schema.ts`) with tables for `bookings`, `providers`, `messages`, and `admin_revenue` — mirroring the shapes already used in `mockData.ts`/`App.tsx`.
- Add REST endpoints (following the existing pattern in `server.ts`) for CRUD on each of these, and migrate `App.tsx` to call them instead of writing directly to `localStorage`.
- Keep `localStorage` only as an offline/optimistic-UI cache layered on top of the API calls, not as the primary store — every write should go to the backend first, with `localStorage` updated from the confirmed server response.
- Specifically for wallet balance: make the Stripe webhook the only writer of `walletBalance` in Postgres, and have the frontend read balance from `/api/wallet` rather than maintaining its own optimistic copy in `localStorage` that can diverge from what was actually charged.
- Remove the `INITIAL_CATEGORIES`/mock provider scaffolding from production code paths once real data exists, or clearly gate it behind a `SEED_DEMO_DATA` flag so it never ships to real users by accident.

Done when: clearing browser `localStorage` for a logged-in user does not lose any booking, message, or balance data — a reload re-hydrates everything from the backend.

---

## Phase 6 — Secrets and Access Hygiene

**Goal:** Reduce the blast radius of any single leaked credential and confirm the two "public-by-design" pieces of config (Firebase client key, GitHub Actions WIF setup) are actually locked down where it matters.

Work:
- Confirm Firebase Auth's "Authorized domains" list is restricted to the production domain(s) only, and that Firestore/Realtime Database security rules (if used) deny by default — the client-side API key in `firebase-applet-config.json` is safe to expose only if these are correctly configured.
- Confirm the Google Workspace OAuth scopes requested (Drive, Calendar, Forms, Contacts) are the minimum needed; consider narrowing `drive.file` and dropping any scope not actively used, and add token expiry/refresh handling in `WorkspaceHub.tsx` rather than holding a single long-lived token in component state.
- Move all secrets (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SQL_*`) into GitHub Actions repository secrets and the runtime platform's secret manager (Cloud Run/Cloud SQL environment config) — never into `.env` files committed to the repo (already correctly `.gitignore`d, just confirm this stays true).
- Rotate the Stripe secret key and any DB credentials once, after the above is in place, so that any earlier local exposure during development is invalidated.

Done when: a secrets audit confirms no credential exists in git history in plaintext, and every secret used in production is sourced from a secret manager, not a checked-in file.

---

## Phase 7 — Observability and Failure Handling

**Goal:** Right now, database connection failures, Stripe errors, and workspace API failures are mostly caught and logged to console with no alerting, and some errors are swallowed silently (e.g., `catch (e) {}` blocks in `App.tsx`'s localStorage/JSON parsing).

Work:
- Add structured logging (request ID, user ID where available, error type) to all `catch` blocks currently just logging to `console.error`, and remove the empty `catch (e) {}` blocks — at minimum log what was swallowed.
- Wire up basic error monitoring (e.g., Sentry or Cloud Error Reporting) for the backend, so a spike in `/api/stripe/webhook` or `/api/auth/sync` failures is visible without manually reading logs.
- Expand `/api/health` to check DB connectivity (not just report `databaseUrlAvailable`) and Stripe key presence, so it's a meaningful readiness probe for the hosting platform.
- Add uptime/alerting on the production URL once Phase 1–2 give it a stable home.

Done when: an on-call engineer can tell from monitoring alone (not by asking a user) that the Stripe webhook or DB connection is failing.

---

## Phase 8 — Pre-Launch Verification Pass

**Goal:** Confirm all of the above actually works together before treating this as production-ready.

Work:
- End-to-end test: sign up → verification flow → browse providers → create a booking → top up wallet via Stripe test mode → confirm webhook correctly credits balance once, not twice → send a message → confirm all of the above persists after a full browser storage clear.
- Load the deployed `/api/health` endpoint and confirm it reflects true DB/Stripe status.
- Re-run the CI pipeline end-to-end on a throwaway branch/PR (the preview workflow already exists) to confirm the preview deploy also succeeds, not just `main`.
- Re-run the security review from `SUGARDADDY_CODE_REVIEW.md` against the updated code to confirm each of the nine flagged issues is closed, not just addressed in intent.

Done when: every item in this checklist passes without manual workarounds, and the "Potentially Fatal Issues" list from the original code review is empty.
