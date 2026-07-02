# SugarDaddy LGBT

A peer-to-peer premium service marketplace focused on privacy, secure escrows, and specialized premium lifestyle coaching and companionship.

## Overview
This platform connects elite clients with top-tier service providers. It supports secure dual-portals (Client and Provider), Firebase authentication, booking management, and encrypted messaging.

## Architecture
- **Hosting**: The entire application (frontend + `/api` backend) is served from **Hostinger**. The Express server (`server.ts`) serves the built SPA from `dist/` and handles all `/api` routes.
- **Frontend**: A React SPA built with Vite. Production build outputs to `dist/` (client only).
- **Backend**: An Express API (`server.ts`). Production bundle outputs to `dist-server/server.cjs` — kept **outside** the publicly served `dist/` directory on purpose. Never copy `dist-server/` into a public web root.
- **Database**: A PostgreSQL database, accessed via Drizzle ORM. If DB env vars are unset in production, the app runs in offline/degraded mode rather than falling back to localhost defaults.
- **Firebase**: Used for **Auth only**. Firebase Hosting is decommissioned — the old `vertex1-490112.web.app` address serves a static "site moved" page (`firebase-public/`).

## Setup Instructions

### Environment Variables
Create a `.env` file in the root directory (copy `.env.example`) with:

**Firebase client config**
The public Firebase web config (API key, project ID, etc.) is hardcoded in `src/lib/firebase.ts`. This is safe to commit *only* while Firebase Auth authorized domains and any Firestore/DB security rules are locked down. `VITE_FIREBASE_*` env vars override the hardcoded values if set at build time.

**Backend configuration (required in production)**
```
SQL_HOST=127.0.0.1
SQL_USER=postgres
SQL_PASSWORD=password
SQL_DB_NAME=sugardaddy
SQL_ADMIN_USER=postgres
SQL_ADMIN_PASSWORD=password

STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

NODE_ENV=development
PORT=3000
```

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build   # client → dist/, server → dist-server/server.cjs
   npm start       # runs dist-server/server.cjs, serves dist/ + /api
   ```

## Deployment
The app is deployed to Hostinger: upload/sync the repo (or `dist/` + `dist-server/` + `node_modules`), set the env vars above, and run `npm start` (or use the Dockerfile). **Only `dist/` may be exposed as a web root** — `dist-server/` contains the server bundle and sourcemap.

### Secrets Management
Secrets (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SQL_*`) must NOT be committed. Set them as environment variables on the host.

### CI/CD
`.github/workflows/firebase-hosting-deploy.yml` only publishes the static "site moved" placeholder to the old Firebase Hosting address when `firebase-public/` or `firebase.json` change. There is no automated deploy to Hostinger; deploys there are manual.
