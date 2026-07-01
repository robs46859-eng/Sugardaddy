# SugarDaddy LGBT

A peer-to-peer premium service marketplace focused on privacy, secure escrows, and specialized premium lifestyle coaching and companionship.

## Overview
This platform connects elite clients with top-tier service providers. It supports secure dual-portals (Client and Provider), Firebase authentication, booking management, and encrypted messaging.

## Architecture
- **Frontend**: A React SPA built with Vite, hosted on Firebase Hosting.
- **Backend**: An Express API (`server.ts`), intended to run on Google Cloud Run.
- **Database**: A PostgreSQL database (e.g., Cloud SQL), accessed via Drizzle ORM.

## Setup Instructions

### Environment Variables
For the platform to function correctly, you must provide your own environment variables.

Create a `.env` file in the root directory (you can copy `.env.example`) and add the following keys:

**Firebase Config**
Firebase configuration is public and hardcoded in `firebase-applet-config.json`. Do not use `VITE_FIREBASE_*` variables.

**Backend Configuration**
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
   npm run build
   ```

## Deployment
This application is deployed on Google Cloud using a split architecture:
- **Frontend**: Hosted on Firebase Hosting (configured in `firebase.json`).
- **Backend**: Hosted on Cloud Run (deployed via Dockerfile).

### Secrets Management
Secrets such as `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `SQL_*` variables should NOT be committed to the repository. 
In production, use **Cloud Run Environment Variables** to securely pass these credentials to the backend.

### CI/CD
Deployment is automated via GitHub Actions (`.github/workflows/firebase-hosting-deploy.yml`). Pushing to the `main` branch will automatically build and deploy both the frontend (Firebase) and backend (Cloud Run).
