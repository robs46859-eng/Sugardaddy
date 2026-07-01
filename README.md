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

**Frontend Firebase Config**
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

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
You can deploy this application via standard static hosting providers (such as Vercel, Netlify, or Firebase Hosting). Before deploying, ensure that your environment variables are configured correctly in your hosting provider's dashboard.

- Push your repository to GitHub.
- Link your GitHub repository to your hosting provider.
- Configure the environment variables in the provider settings.
- Build and deploy the site using the `npm run build` command.
