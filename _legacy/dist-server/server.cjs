var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);

// src/db/index.ts
var import_node_postgres = require("drizzle-orm/node-postgres");
var import_pg = __toESM(require("pg"), 1);

// src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  adminRevenue: () => adminRevenue,
  bookings: () => bookings,
  googleCalendarEvents: () => googleCalendarEvents,
  googleChatNotifications: () => googleChatNotifications,
  googleContactsLogs: () => googleContactsLogs,
  googleFormsLogs: () => googleFormsLogs,
  messages: () => messages,
  providers: () => providers,
  stripeEvents: () => stripeEvents,
  users: () => users,
  usersRelations: () => usersRelations
});
var import_drizzle_orm = require("drizzle-orm");
var import_pg_core = require("drizzle-orm/pg-core");
var users = (0, import_pg_core.pgTable)("users", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  uid: (0, import_pg_core.text)("uid").notNull().unique(),
  // Firebase Auth UID
  email: (0, import_pg_core.text)("email").notNull(),
  name: (0, import_pg_core.text)("name"),
  role: (0, import_pg_core.text)("role").default("customer"),
  // 'customer' | 'provider' | 'admin'
  walletBalance: (0, import_pg_core.integer)("wallet_balance").default(0),
  verificationGovId: (0, import_pg_core.text)("verification_gov_id").default("unverified"),
  verificationSelfie: (0, import_pg_core.text)("verification_selfie").default("unverified"),
  verificationPhone: (0, import_pg_core.text)("verification_phone").default("unverified"),
  verificationEmail: (0, import_pg_core.text)("verification_email").default("unverified"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var googleFormsLogs = (0, import_pg_core.pgTable)("google_forms_logs", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  userId: (0, import_pg_core.text)("user_id").references(() => users.uid).notNull(),
  formId: (0, import_pg_core.text)("form_id").notNull(),
  title: (0, import_pg_core.text)("title").notNull(),
  formUrl: (0, import_pg_core.text)("form_url"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var googleCalendarEvents = (0, import_pg_core.pgTable)("google_calendar_events", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  userId: (0, import_pg_core.text)("user_id").references(() => users.uid).notNull(),
  eventId: (0, import_pg_core.text)("event_id").notNull(),
  summary: (0, import_pg_core.text)("summary").notNull(),
  startTime: (0, import_pg_core.text)("start_time").notNull(),
  endTime: (0, import_pg_core.text)("end_time").notNull(),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var googleContactsLogs = (0, import_pg_core.pgTable)("google_contacts_logs", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  userId: (0, import_pg_core.text)("user_id").references(() => users.uid).notNull(),
  contactId: (0, import_pg_core.text)("contact_id").notNull(),
  fullName: (0, import_pg_core.text)("full_name").notNull(),
  email: (0, import_pg_core.text)("email"),
  phone: (0, import_pg_core.text)("phone"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var googleChatNotifications = (0, import_pg_core.pgTable)("google_chat_notifications", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  userId: (0, import_pg_core.text)("user_id").references(() => users.uid).notNull(),
  spaceName: (0, import_pg_core.text)("space_name").notNull(),
  messageText: (0, import_pg_core.text)("message_text").notNull(),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var usersRelations = (0, import_drizzle_orm.relations)(users, ({ many }) => ({
  forms: many(googleFormsLogs),
  events: many(googleCalendarEvents),
  contacts: many(googleContactsLogs),
  chats: many(googleChatNotifications)
}));
var stripeEvents = (0, import_pg_core.pgTable)("stripe_events", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  // Stripe event ID
  type: (0, import_pg_core.text)("type").notNull(),
  processedAt: (0, import_pg_core.timestamp)("processed_at").defaultNow()
});
var providers = (0, import_pg_core.pgTable)("providers", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  // references users.uid
  name: (0, import_pg_core.text)("name").notNull(),
  title: (0, import_pg_core.text)("title").notNull(),
  bio: (0, import_pg_core.text)("bio").notNull(),
  pricePerEvent: (0, import_pg_core.integer)("price_per_event").notNull(),
  locationName: (0, import_pg_core.text)("location_name").notNull(),
  avatarUrl: (0, import_pg_core.text)("avatar_url"),
  extraData: (0, import_pg_core.jsonb)("extra_data"),
  // JSONB for categories, reviews, stats
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var bookings = (0, import_pg_core.pgTable)("bookings", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  // uuid
  providerId: (0, import_pg_core.text)("provider_id").notNull(),
  customerId: (0, import_pg_core.text)("customer_id").notNull(),
  date: (0, import_pg_core.text)("date").notNull(),
  timeSlot: (0, import_pg_core.text)("time_slot").notNull(),
  status: (0, import_pg_core.text)("status").notNull(),
  totalAmount: (0, import_pg_core.integer)("total_amount").notNull(),
  extraData: (0, import_pg_core.jsonb)("extra_data"),
  // JSONB for names, avatars, questions
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var messages = (0, import_pg_core.pgTable)("messages", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  // uuid
  chatId: (0, import_pg_core.text)("chat_id").notNull(),
  senderId: (0, import_pg_core.text)("sender_id").notNull(),
  text: (0, import_pg_core.text)("text").notNull(),
  extraData: (0, import_pg_core.jsonb)("extra_data"),
  // JSONB for senderName, isVoice
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var adminRevenue = (0, import_pg_core.pgTable)("admin_revenue", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  type: (0, import_pg_core.text)("type").notNull(),
  amount: (0, import_pg_core.integer)("amount").notNull(),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});

// src/db/index.ts
var { Pool } = import_pg.default;
var isProduction = process.env.NODE_ENV === "production";
var createPool = () => {
  if (isProduction && (!process.env.SQL_HOST || !process.env.SQL_USER || !process.env.SQL_PASSWORD || !process.env.SQL_DB_NAME)) {
    throw new Error("Database env vars (SQL_HOST, SQL_USER, SQL_PASSWORD, SQL_DB_NAME) must be set in production.");
  }
  return new Pool({
    host: process.env.SQL_HOST || "127.0.0.1",
    user: process.env.SQL_USER || "postgres",
    password: process.env.SQL_PASSWORD || "postgres",
    database: process.env.SQL_DB_NAME || "postgres",
    connectionTimeoutMillis: 15e3
  });
};
var dbClient = null;
var dbPool = null;
function getDb() {
  if (!dbClient) {
    try {
      dbPool = createPool();
      dbPool.on("error", (err) => {
        console.error("Unexpected error on idle SQL pool client:", err);
      });
      dbClient = (0, import_node_postgres.drizzle)(dbPool, { schema: schema_exports });
    } catch (err) {
      console.error("Failed to initialize database pool:", err);
      return null;
    }
  }
  return dbClient;
}

// server.ts
var import_drizzle_orm2 = require("drizzle-orm");
var import_stripe = __toESM(require("stripe"), 1);
var stripeClient = null;
function getStripeInstance() {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY environment variable is required");
    }
    stripeClient = new import_stripe.default(key, { apiVersion: "2023-10-16" });
  }
  return stripeClient;
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = Number(process.env.PORT) || 3e3;
  const logError = (context, err, metadata = {}) => {
    console.error(JSON.stringify({
      severity: "ERROR",
      message: err?.message || String(err),
      context,
      ...metadata,
      stack: err?.stack
    }));
  };
  app.use(import_express.default.json());
  app.get("/api/health", async (req, res) => {
    let dbStatus = "disconnected";
    try {
      const db = getDb();
      if (db) {
        await db.execute("SELECT 1");
        dbStatus = "connected";
      }
    } catch (e) {
      logError("Health check DB connection failed", e);
      dbStatus = "error";
    }
    res.json({ status: "ok", service: "Hub Full-Stack Server", databaseStatus: dbStatus });
  });
  app.post("/api/auth/sync", async (req, res) => {
    try {
      const { uid, email, name, role, walletBalance } = req.body;
      if (!uid || !email) {
        return res.status(400).json({ error: "Missing required sync fields: uid and email." });
      }
      const db = getDb();
      if (!db) {
        return res.json({ message: "Database running in transient memory mode, sync bypassed.", synced: false });
      }
      const existingUser = await db.select().from(users).where((0, import_drizzle_orm2.eq)(users.uid, uid)).limit(1);
      if (existingUser.length > 0) {
        await db.update(users).set({
          name: name || existingUser[0].name,
          role: role || existingUser[0].role
        }).where((0, import_drizzle_orm2.eq)(users.uid, uid));
        return res.json({ success: true, user: { ...existingUser[0], name, role }, action: "updated" });
      } else {
        await db.insert(users).values({
          uid,
          email,
          name: name || "Valued User",
          role: role || "customer",
          walletBalance: walletBalance !== void 0 ? walletBalance : 0
        });
        return res.json({ success: true, action: "inserted" });
      }
    } catch (err) {
      logError("Auth sync failed", err);
      res.status(500).json({ error: err.message || "Error occurred during database auth sync" });
    }
  });
  app.post("/api/wallet/update", async (req, res) => {
    try {
      const { uid, balance } = req.body;
      if (!uid || balance === void 0) {
        return res.status(400).json({ error: "Missing uid or balance." });
      }
      const db = getDb();
      if (!db) {
        return res.json({ message: "Database offline, sync bypassed." });
      }
      await db.update(users).set({ walletBalance: balance }).where((0, import_drizzle_orm2.eq)(users.uid, uid));
      res.json({ success: true, balance });
    } catch (err) {
      console.error("Error updating wallet:", err);
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/stripe/create-checkout-session", async (req, res) => {
    try {
      const { uid, amount, successUrl, cancelUrl } = req.body;
      if (!uid || !amount) {
        return res.status(400).json({ error: "Missing uid or amount for payment." });
      }
      if (!successUrl || !cancelUrl) {
        return res.status(400).json({ error: "Missing successUrl or cancelUrl for payment redirect." });
      }
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(501).json({
          error: "Stripe API has not been configured in .env variables.",
          message: "Define STRIPE_SECRET_KEY in environmental setups to handle secure billing sessions."
        });
      }
      const stripe = getStripeInstance();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Luxe Hub Escrow Wallet Deposit",
                description: `Secure funds deposit for client ID: ${uid}`
              },
              unit_amount: Math.round(amount * 100)
              // amount in cents
            },
            quantity: 1
          }
        ],
        mode: "payment",
        metadata: {
          uid,
          amount: amount.toString(),
          type: "wallet_top_up"
        },
        success_url: successUrl,
        cancel_url: cancelUrl
      });
      res.json({ success: true, sessionId: session.id, url: session.url });
    } catch (err) {
      console.error("Stripe session creation error:", err);
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/stripe/create-verification-session", async (req, res) => {
    try {
      const { uid, returnUrl } = req.body;
      if (!uid) {
        return res.status(400).json({ error: "Missing uid for verification." });
      }
      if (!returnUrl) {
        return res.status(400).json({ error: "Missing returnUrl for verification redirect." });
      }
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(501).json({ error: "Stripe API has not been configured." });
      }
      const stripe = getStripeInstance();
      const session = await stripe.identity.verificationSessions.create({
        type: "document",
        metadata: { uid },
        return_url: returnUrl
      });
      res.json({ success: true, client_secret: session.client_secret, url: session.url });
    } catch (err) {
      console.error("Stripe verification session error:", err);
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/stripe/webhook", import_express.default.raw({ type: "application/json" }), async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(501).json({ error: "Stripe secret key missing" });
    }
    let event;
    try {
      const stripe = getStripeInstance();
      if (!webhookSecret || !signature) {
        console.error("\u26A0\uFE0F STRIPE_WEBHOOK_SECRET or signature is missing. Failing closed.");
        return res.status(400).send("Webhook Error: Missing secret or signature");
      }
      event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
      console.log(`[Stripe Webhook] Received webhook event: ${event.type}`);
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const uid = session.metadata?.uid;
        const amountStr = session.metadata?.amount;
        const type = session.metadata?.type;
        if (uid && amountStr && type === "wallet_top_up") {
          const topUpAmount = parseFloat(amountStr);
          const db = getDb();
          if (db) {
            const processedEvent = await db.select().from(stripeEvents).where((0, import_drizzle_orm2.eq)(stripeEvents.id, event.id)).limit(1);
            if (processedEvent.length > 0) {
              console.log(`[Stripe Webhook] Event ${event.id} already processed. Skipping.`);
              return res.status(200).json({ received: true, alreadyProcessed: true });
            }
            console.log(`[Stripe Webhook] Wallet upgrade triggered for user ${uid}. Depositing $${topUpAmount}`);
            const existingUser = await db.select().from(users).where((0, import_drizzle_orm2.eq)(users.uid, uid)).limit(1);
            if (existingUser.length > 0) {
              const currentBalance = existingUser[0].walletBalance || 0;
              const newBalance = currentBalance + topUpAmount;
              await db.transaction(async (tx) => {
                await tx.update(users).set({ walletBalance: newBalance }).where((0, import_drizzle_orm2.eq)(users.uid, uid));
                await tx.insert(stripeEvents).values({ id: event.id, type: event.type });
              });
              console.log(`[Stripe Webhook] Successfully credited $${topUpAmount} to database user ${uid}. New balance: $${newBalance}`);
            }
          } else {
            console.warn(`[Stripe Webhook] Database offline. Session verified but not written: ${uid}, $${topUpAmount}`);
          }
        }
      } else if (event.type === "identity.verification_session.verified") {
        const session = event.data.object;
        const uid = session.metadata?.uid;
        if (uid) {
          const db = getDb();
          if (db) {
            console.log(`[Stripe Webhook] Verification approved for user ${uid}.`);
            const processedEvent = await db.select().from(stripeEvents).where((0, import_drizzle_orm2.eq)(stripeEvents.id, event.id)).limit(1);
            if (processedEvent.length === 0) {
              await db.transaction(async (tx) => {
                await tx.update(users).set({
                  verificationGovId: "verified",
                  verificationSelfie: "verified"
                }).where((0, import_drizzle_orm2.eq)(users.uid, uid));
                await tx.insert(stripeEvents).values({ id: event.id, type: event.type });
              });
              console.log(`[Stripe Webhook] Verification status updated in DB for user ${uid}.`);
            }
          }
        }
      }
      res.status(200).json({ received: true });
    } catch (err) {
      logError("Stripe webhook failed", err);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });
  app.post("/api/workspace/log", async (req, res) => {
    try {
      const { uid, type, payload } = req.body;
      if (!uid || !type || !payload) {
        return res.status(400).json({ error: "Missing uid, type, or payload." });
      }
      const db = getDb();
      if (!db) {
        return res.json({ message: "Database offline, action logged locally only." });
      }
      const usr = await db.select().from(users).where((0, import_drizzle_orm2.eq)(users.uid, uid)).limit(1);
      if (usr.length === 0) {
        await db.insert(users).values({
          uid,
          email: payload.email || `${uid}@demo.com`,
          name: payload.name || "Workspace User"
        });
      }
      let logId;
      if (type === "forms") {
        const result = await db.insert(googleFormsLogs).values({
          userId: uid,
          formId: payload.formId,
          title: payload.title,
          formUrl: payload.formUrl
        }).returning({ id: googleFormsLogs.id });
        logId = result[0]?.id;
      } else if (type === "calendar") {
        const result = await db.insert(googleCalendarEvents).values({
          userId: uid,
          eventId: payload.eventId,
          summary: payload.summary,
          startTime: payload.startTime,
          endTime: payload.endTime
        }).returning({ id: googleCalendarEvents.id });
        logId = result[0]?.id;
      } else if (type === "contacts") {
        const result = await db.insert(googleContactsLogs).values({
          userId: uid,
          contactId: payload.contactId,
          fullName: payload.fullName,
          email: payload.email,
          phone: payload.phone
        }).returning({ id: googleContactsLogs.id });
        logId = result[0]?.id;
      } else if (type === "chat") {
        const result = await db.insert(googleChatNotifications).values({
          userId: uid,
          spaceName: payload.spaceName,
          messageText: payload.messageText
        }).returning({ id: googleChatNotifications.id });
        logId = result[0]?.id;
      }
      res.json({ success: true, type, logId });
    } catch (err) {
      logError("Workspace log action failed", err);
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/workspace/logs/:uid", async (req, res) => {
    try {
      const { uid } = req.params;
      const db = getDb();
      if (!db) {
        return res.json({ forms: [], calendar: [], contacts: [], chat: [], offline: true });
      }
      const forms = await db.select().from(googleFormsLogs).where((0, import_drizzle_orm2.eq)(googleFormsLogs.userId, uid)).orderBy((0, import_drizzle_orm2.desc)(googleFormsLogs.createdAt));
      const calendar = await db.select().from(googleCalendarEvents).where((0, import_drizzle_orm2.eq)(googleCalendarEvents.userId, uid)).orderBy((0, import_drizzle_orm2.desc)(googleCalendarEvents.createdAt));
      const contacts = await db.select().from(googleContactsLogs).where((0, import_drizzle_orm2.eq)(googleContactsLogs.userId, uid)).orderBy((0, import_drizzle_orm2.desc)(googleContactsLogs.createdAt));
      const chat = await db.select().from(googleChatNotifications).where((0, import_drizzle_orm2.eq)(googleChatNotifications.userId, uid)).orderBy((0, import_drizzle_orm2.desc)(googleChatNotifications.createdAt));
      res.json({ forms, calendar, contacts, chat, offline: false });
    } catch (err) {
      logError("Workspace get logs failed", err);
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/providers", async (req, res) => {
    try {
      const db = getDb();
      if (!db) return res.json([]);
      const data = await db.select().from(providers);
      const result = data.map((p) => ({
        id: p.id,
        name: p.name,
        title: p.title,
        bio: p.bio,
        pricePerEvent: p.pricePerEvent,
        locationName: p.locationName,
        avatarUrl: p.avatarUrl,
        ...p.extraData || {}
      }));
      res.json(result);
    } catch (err) {
      logError("API fetch failed", err);
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/bookings", async (req, res) => {
    try {
      const db = getDb();
      if (!db) return res.json([]);
      const data = await db.select().from(bookings);
      const result = data.map((b) => ({
        id: b.id,
        providerId: b.providerId,
        customerId: b.customerId,
        date: b.date,
        timeSlot: b.timeSlot,
        status: b.status,
        totalAmount: b.totalAmount,
        ...b.extraData || {}
      }));
      res.json(result);
    } catch (err) {
      logError("API fetch failed", err);
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/messages", async (req, res) => {
    try {
      const db = getDb();
      if (!db) return res.json([]);
      const data = await db.select().from(messages);
      const result = data.map((m) => ({
        id: m.id,
        chatId: m.chatId,
        senderId: m.senderId,
        text: m.text,
        ...m.extraData || {}
      }));
      res.json(result);
    } catch (err) {
      logError("API fetch failed", err);
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/admin/revenue", async (req, res) => {
    try {
      const db = getDb();
      if (!db) return res.json([]);
      const data = await db.select().from(adminRevenue);
      res.json(data);
    } catch (err) {
      logError("API fetch failed", err);
      res.status(500).json({ error: err.message });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
