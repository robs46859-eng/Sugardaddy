# Deployment — Sugardaddy (robs46859-eng/Sugardaddy)

## Status: no automated deployment exists

The GitHub Action never ran. It cannot run in its current state.

**Why:** GitHub only executes workflows located at `.github/workflows/` in the
repository root. This repo's only workflow file is at:

```
_legacy/.github/workflows/firebase-hosting-deploy.yml
```

Because it sits under `_legacy/`, GitHub treats it as an ordinary text file and
ignores it. There are zero runs, and the Actions tab will be empty.

**Second reason it wouldn't help anyway:** that workflow only publishes a static
"site moved" placeholder to Firebase Hosting. Its own header comments state the
real app is served from Hostinger. No workflow in this repo has ever deployed to
Hostinger. Every previous deploy was a manual zip upload.

---

## The blocker: this is no longer a static site

Commit `a51d5469` ("Next.js migration with Avatar Stage and Gemini multi-agent")
converted this into a **server-rendered Next.js 16 application**. It cannot be
exported to static HTML because it contains:

| Server dependency | Location |
|---|---|
| Stripe webhook API route | `src/app/api/stripe/route.ts` |
| Prisma database client | `src/lib/db/prisma.ts` |
| Gemini agent logic (server-side) | `src/lib/ai/mainAgent.ts`, `subAgent.ts`, `tools.ts` |

`next.config.ts` has no `output: 'export'`, and adding it would fail the build —
`output: 'export'` is incompatible with API route handlers.

**Consequence:** uploading a zip of static files to `public_html` will not work.
The app needs a running Node.js process.

---

## Plan tier: confirmed OK

Hostinger supports Node.js apps on **Business** and **Cloud** plans (5 apps on
Business, 10 on Cloud Startup), not on Premium or Single.

The account already runs a Node app (**judy.lgbt**), which confirms the tier
supports this. Judy is also a working reference — her build/start commands and
Node version in hPanel are a known-good example on this exact account.

Only check remaining: that you have a free app slot (Business caps at 5).

---

## Deploy from GitHub — do not upload a zip

Next.js's official docs link Hostinger's own template for this
(`github.com/hostinger/deploy-nextjs`). This replaces zip uploads entirely and
gives you the auto-deploy the GitHub Action was meant to provide. No workflow
file needed — Hostinger runs the build itself.

1. hPanel → **Websites** → **Add Website**
2. Choose **Node.js Apps**
3. Choose **Import Git Repository**, authorize GitHub, select
   `robs46859-eng/Sugardaddy`, branch `main`
4. Review the auto-detected build settings. Confirm:
   - **Node version:** 22 (Next.js 16 requires 20+)
   - **Build command:** `npm install && npx prisma generate && npm run build`
     — the `prisma generate` step is easy to miss and the build fails without it
   - **Start command:** `npm run start`
5. Add environment variables (see below) **before** deploying — the build reads
   `DATABASE_URL`
6. **Deploy**

Pushes to `main` redeploy automatically after this.

### About the old site

Adding a new Node.js app does not touch the existing site, so nothing breaks
while you set this up. Point the new app at its own domain or subdomain first
and confirm it boots.

Only once the new app serves correctly should you clear the old one:

1. hPanel → **File Manager** → `domains/<yourdomain>/public_html`
2. Select all → **Download** (this is the only copy outside git — keep it)
3. Select all → **Delete**

File Manager deletes permanently; there is no trash to recover from.

---

## Option B — Manual zip upload

Only if you want to avoid the GitHub connection. You still need a Business/Cloud
plan and the Node.js app created as in Option A steps 1–3.

Build on your Mac, then upload. **Do not zip `node_modules`** — Hostinger installs
those itself, and Mac-compiled native binaries (lightningcss, SWC) will not run on
Hostinger's Linux servers. That specific mismatch is a common cause of a deploy
that silently 500s.

```bash
cd ~/Desktop/claude7126/sugar

# verify it builds clean before packaging
npm install
npx prisma generate
npm run build

# package source only
zip -r sugardaddy-deploy.zip . \
  -x "node_modules/*" \
  -x ".next/cache/*" \
  -x ".git/*" \
  -x "_legacy/*" \
  -x ".env" \
  -x "*.db" \
  -x ".DS_Store"
```

Upload `sugardaddy-deploy.zip` via File Manager into the empty `public_html`,
extract it, then run **Build** and **Restart** in the Node.js panel.

---

## Environment variables

Set these in hPanel's Node.js panel under **Environment variables**. Do **not**
upload your `.env` file — it is gitignored (correctly) and the zip command above
excludes it.

Required, based on the code:

- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` (read in `src/app/api/stripe/route.ts`)
- `GEMINI_API_KEY` (or whatever `src/lib/ai/*` expects — confirm the exact name)
- `NODE_ENV=production`

Good news on secrets: `.env` was **never** committed to git. Verified with
`git log --all -- .env` — no results. Nothing to rotate.

---

## Database caveat

`DATABASE_URL` currently points at a local SQLite file (`dev.db`, gitignored).
SQLite on shared hosting is fragile — the file can be wiped by a redeploy, and
concurrent writes on shared storage are unreliable.

Before taking Stripe payments in production, move to a hosted Postgres or MySQL
instance (Hostinger provides MySQL on Business plans; update the Prisma provider
in `prisma/schema.prisma` to match) and run `npx prisma migrate deploy` against it.
Losing the `stripePackage.status` writes from the webhook handler means paid
orders silently stay unpaid.

---

## Cleanup worth doing

- Delete `_legacy/` from the repo. It contains a full committed `node_modules`
  tree (~thousands of files), which is bloating clones and cluttering search.
- Run `firebase hosting:disable --project vertex1-490112` to take the old
  Firebase placeholder down, as that workflow's own comments suggest.
