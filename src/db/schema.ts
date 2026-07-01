import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

// PostgreSQL Users table synced with Firebase Auth and wallet balances
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').default('customer'), // 'customer' | 'provider' | 'admin'
  walletBalance: integer('wallet_balance').default(0),
  verificationGovId: text('verification_gov_id').default('unverified'),
  verificationSelfie: text('verification_selfie').default('unverified'),
  verificationPhone: text('verification_phone').default('unverified'),
  verificationEmail: text('verification_email').default('unverified'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Logs for tracking or creating Google Forms in the app
export const googleFormsLogs = pgTable('google_forms_logs', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.uid).notNull(),
  formId: text('form_id').notNull(),
  title: text('title').notNull(),
  formUrl: text('form_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Logs for synchronizing or adding Google Calendar events
export const googleCalendarEvents = pgTable('google_calendar_events', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.uid).notNull(),
  eventId: text('event_id').notNull(),
  summary: text('summary').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Logs for retrieving or importing Google Contacts (People API)
export const googleContactsLogs = pgTable('google_contacts_logs', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.uid).notNull(),
  contactId: text('contact_id').notNull(),
  fullName: text('full_name').notNull(),
  email: text('email'),
  phone: text('phone'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Logs for Google Chat spacing and workspace notifications
export const googleChatNotifications = pgTable('google_chat_notifications', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.uid).notNull(),
  spaceName: text('space_name').notNull(),
  messageText: text('message_text').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations definitions
export const usersRelations = relations(users, ({ many }) => ({
  forms: many(googleFormsLogs),
  events: many(googleCalendarEvents),
  contacts: many(googleContactsLogs),
  chats: many(googleChatNotifications),
}));

// Processed Stripe events for idempotency
export const stripeEvents = pgTable('stripe_events', {
  id: text('id').primaryKey(), // Stripe event ID
  type: text('type').notNull(),
  processedAt: timestamp('processed_at').defaultNow(),
});

export const providers = pgTable('providers', {
  id: text('id').primaryKey(), // references users.uid
  name: text('name').notNull(),
  title: text('title').notNull(),
  bio: text('bio').notNull(),
  pricePerEvent: integer('price_per_event').notNull(),
  locationName: text('location_name').notNull(),
  avatarUrl: text('avatar_url'),
  extraData: jsonb('extra_data'), // JSONB for categories, reviews, stats
  createdAt: timestamp('created_at').defaultNow(),
});

export const bookings = pgTable('bookings', {
  id: text('id').primaryKey(), // uuid
  providerId: text('provider_id').notNull(),
  customerId: text('customer_id').notNull(),
  date: text('date').notNull(),
  timeSlot: text('time_slot').notNull(),
  status: text('status').notNull(),
  totalAmount: integer('total_amount').notNull(),
  extraData: jsonb('extra_data'), // JSONB for names, avatars, questions
  createdAt: timestamp('created_at').defaultNow(),
});

export const messages = pgTable('messages', {
  id: text('id').primaryKey(), // uuid
  chatId: text('chat_id').notNull(),
  senderId: text('sender_id').notNull(),
  text: text('text').notNull(),
  extraData: jsonb('extra_data'), // JSONB for senderName, isVoice
  createdAt: timestamp('created_at').defaultNow(),
});

export const adminRevenue = pgTable('admin_revenue', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(),
  amount: integer('amount').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
