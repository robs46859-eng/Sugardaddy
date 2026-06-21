import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getDb } from './src/db/index';
import { users, googleFormsLogs, googleCalendarEvents, googleContactsLogs, googleChatNotifications } from './src/db/schema';
import { eq, desc } from 'drizzle-orm';
import Stripe from 'stripe';

let stripeClient: Stripe | null = null;
function getStripeInstance(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    // @ts-ignore
    stripeClient = new Stripe(key, { apiVersion: '2023-10-16' });
  }
  return stripeClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES FIRST ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Hub Full-Stack Server', databaseUrlAvailable: !!process.env.DATABASE_URL });
  });

  // User synchronization with Firebase and Cloud SQL
  app.post('/api/auth/sync', async (req, res) => {
    try {
      const { uid, email, name, role, walletBalance } = req.body;
      if (!uid || !email) {
        return res.status(400).json({ error: 'Missing required sync fields: uid and email.' });
      }

      const db = getDb();
      if (!db) {
        return res.json({ message: 'Database running in transient memory mode, sync bypassed.', synced: false });
      }

      // Check if user exists
      const existingUser = await db.select().from(users).where(eq(users.uid, uid)).limit(1);

      if (existingUser.length > 0) {
        // Update user
        await db.update(users)
          .set({ 
            name: name || existingUser[0].name, 
            role: role || existingUser[0].role 
          })
          .where(eq(users.uid, uid));
        
        return res.json({ success: true, user: { ...existingUser[0], name, role }, action: 'updated' });
      } else {
        // Insert user
        await db.insert(users).values({
          uid,
          email,
          name: name || 'Valued User',
          role: role || 'customer',
          walletBalance: walletBalance !== undefined ? walletBalance : 0,
        });

        return res.json({ success: true, action: 'inserted' });
      }
    } catch (err: any) {
      console.error('Error syncing user:', err);
      res.status(500).json({ error: err.message || 'Error occurred during database auth sync' });
    }
  });

  // Wallet balance update route
  app.post('/api/wallet/update', async (req, res) => {
    try {
      const { uid, balance } = req.body;
      if (!uid || balance === undefined) {
        return res.status(400).json({ error: 'Missing uid or balance.' });
      }

      const db = getDb();
      if (!db) {
        return res.json({ message: 'Database offline, sync bypassed.' });
      }

      await db.update(users)
        .set({ walletBalance: balance })
        .where(eq(users.uid, uid));

      res.json({ success: true, balance });
    } catch (err: any) {
      console.error('Error updating wallet:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // --- REAL STRIPE FINANCIAL SYSTEM INTEGRATIONS ---

  // 1. Create a Stripe Checkout Session for wallet top-ups
  app.post('/api/stripe/create-checkout-session', async (req, res) => {
    try {
      const { uid, amount, successUrl, cancelUrl } = req.body;
      if (!uid || !amount) {
        return res.status(400).json({ error: 'Missing uid or amount for payment.' });
      }

      // Safe lazy check of secret key presence
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(501).json({ 
          error: 'Stripe API has not been configured in .env variables.', 
          message: 'Define STRIPE_SECRET_KEY in environmental setups to handle secure billing sessions.' 
        });
      }

      const stripe = getStripeInstance();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Luxe Hub Escrow Wallet Deposit',
                description: `Secure funds deposit for client ID: ${uid}`,
              },
              unit_amount: Math.round(amount * 105), // amount in cents with simple nominal simulation
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        metadata: {
          uid,
          amount: amount.toString(),
          type: 'wallet_top_up'
        },
        success_url: successUrl || 'http://localhost:3000/?payment=success',
        cancel_url: cancelUrl || 'http://localhost:3000/?payment=cancelled',
      });

      res.json({ success: true, sessionId: session.id, url: session.url });
    } catch (err: any) {
      console.error('Stripe session creation error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // 2. Stripe Webhook Endpoint with secure signature checks (Stripe-Signature header validation)
  app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(501).json({ error: 'Stripe secret key missing' });
    }

    let event: Stripe.Event;

    try {
      const stripe = getStripeInstance();
      if (webhookSecret && signature) {
        // Authenticate webhook request signatures securely
        event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
      } else {
        // fallback simulated webhook logic for sandbox/local/testing environment
        console.warn('⚠️ STRIPE_WEBHOOK_SECRET is missing. Bypassing secure signature verification.');
        const rawBodyStr = req.body.toString('utf8');
        event = JSON.parse(rawBodyStr) as Stripe.Event;
      }

      console.log(`[Stripe Webhook] Received webhook event: ${event.type}`);

      // Handle checkout.session.completed
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const uid = session.metadata?.uid;
        const amountStr = session.metadata?.amount;
        const type = session.metadata?.type;

        if (uid && amountStr && type === 'wallet_top_up') {
          const topUpAmount = parseFloat(amountStr);
          const db = getDb();

          if (db) {
            console.log(`[Stripe Webhook] Wallet upgrade triggered for user ${uid}. Depositing $${topUpAmount}`);
            const existingUser = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
            if (existingUser.length > 0) {
              const currentBalance = existingUser[0].walletBalance || 0;
              const newBalance = currentBalance + topUpAmount;
              await db.update(users)
                .set({ walletBalance: newBalance })
                .where(eq(users.uid, uid));
              console.log(`[Stripe Webhook] Successfully credited $${topUpAmount} to database user ${uid}. New balance: $${newBalance}`);
            }
          } else {
            console.warn(`[Stripe Webhook] Database offline. Session verified but not written: ${uid}, $${topUpAmount}`);
          }
        }
      }

      res.status(200).json({ received: true });
    } catch (err: any) {
      console.error(`❌ Stripe webhooks verification failed: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });

  // Log Workspace Action (Forms, Calendar, Contacts, Chat) to Cloud SQL
  app.post('/api/workspace/log', async (req, res) => {
    try {
      const { uid, type, payload } = req.body;
      if (!uid || !type || !payload) {
        return res.status(400).json({ error: 'Missing uid, type, or payload.' });
      }

      const db = getDb();
      if (!db) {
        return res.json({ message: 'Database offline, action logged locally only.' });
      }

      // Ensure user entry exists in MySQL/PostgreSQL
      const usr = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
      if (usr.length === 0) {
        await db.insert(users).values({
          uid,
          email: payload.email || `${uid}@demo.com`,
          name: payload.name || 'Workspace User',
        });
      }

      let logId;
      if (type === 'forms') {
        const result = await db.insert(googleFormsLogs).values({
          userId: uid,
          formId: payload.formId,
          title: payload.title,
          formUrl: payload.formUrl,
        }).returning({ id: googleFormsLogs.id });
        logId = result[0]?.id;
      } else if (type === 'calendar') {
        const result = await db.insert(googleCalendarEvents).values({
          userId: uid,
          eventId: payload.eventId,
          summary: payload.summary,
          startTime: payload.startTime,
          endTime: payload.endTime,
        }).returning({ id: googleCalendarEvents.id });
        logId = result[0]?.id;
      } else if (type === 'contacts') {
        const result = await db.insert(googleContactsLogs).values({
          userId: uid,
          contactId: payload.contactId,
          fullName: payload.fullName,
          email: payload.email,
          phone: payload.phone,
        }).returning({ id: googleContactsLogs.id });
        logId = result[0]?.id;
      } else if (type === 'chat') {
        const result = await db.insert(googleChatNotifications).values({
          userId: uid,
          spaceName: payload.spaceName,
          messageText: payload.messageText,
        }).returning({ id: googleChatNotifications.id });
        logId = result[0]?.id;
      }

      res.json({ success: true, type, logId });
    } catch (err: any) {
      console.error('Error logging workspace action:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Get Workspace logs for a specific user
  app.get('/api/workspace/logs/:uid', async (req, res) => {
    try {
      const { uid } = req.params;
      const db = getDb();
      if (!db) {
        return res.json({ forms: [], calendar: [], contacts: [], chat: [], offline: true });
      }

      const forms = await db.select().from(googleFormsLogs).where(eq(googleFormsLogs.userId, uid)).orderBy(desc(googleFormsLogs.createdAt));
      const calendar = await db.select().from(googleCalendarEvents).where(eq(googleCalendarEvents.userId, uid)).orderBy(desc(googleCalendarEvents.createdAt));
      const contacts = await db.select().from(googleContactsLogs).where(eq(googleContactsLogs.userId, uid)).orderBy(desc(googleContactsLogs.createdAt));
      const chat = await db.select().from(googleChatNotifications).where(eq(googleChatNotifications.userId, uid)).orderBy(desc(googleChatNotifications.createdAt));

      res.json({ forms, calendar, contacts, chat, offline: false });
    } catch (err: any) {
      console.error('Error retrieving workspace logs:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for assets compile and serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
