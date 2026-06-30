export type Role = 'customer' | 'provider' | 'admin';

export interface Category {
  id: string;
  name: string;
  iconName: string;
  description: string;
  isCustom?: boolean;
  group?: string;
}

export interface VerificationChecklist {
  governmentId: 'unverified' | 'pending' | 'verified';
  selfie: 'unverified' | 'pending' | 'verified';
  phone: 'unverified' | 'pending' | 'verified';
  email: 'unverified' | 'pending' | 'verified';
  professionalCredential?: 'unverified' | 'pending' | 'verified';
  backgroundCheck?: 'unverified' | 'pending' | 'verified';
}

export interface ServiceProvider {
  id: string;
  name: string;
  title: string;
  bio: string;
  rating: number;
  reviewsCount: number;
  completionRate: number; // e.g. 98%
  responseTime: string; // e.g. "12 mins"
  repeatCustomerRate: number; // e.g. 84%
  categories: string[]; // references Category names
  pricePerEvent: number;
  priceUnit: string; // "event", "hour", "day"
  distanceMiles: number;
  locationName: string;
  isFeatured: boolean;
  avatarUrl: string;
  verification: VerificationChecklist;
  reviews: Review[];
  verifiedBadge: boolean;
  availabilityCalendar: string[]; // ['Monday', 'Wednesday', 'Saturday'] etc.
  images?: string[]; // up to 8 portfolio images
  videos?: string[]; // up to 2 portfolio videos
  isPromoted?: boolean; // spot at the top of the feed
  promotedUntil?: string; // ISO date or status
  adTimeCreditsMinutes?: number; // free ad credits earned
  privatePhone?: string; // locked/unlocked credential routing
  privateEmail?: string; // locked/unlocked credential routing
  passedQuizzes?: string[]; // list of completed/passed onboarding quizzes
}

export interface Booking {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  customerId: string;
  customerName: string;
  date: string;
  timeSlot: string;
  status: 'pending_approval' | 'escrow_pending' | 'active_escrow' | 'completed' | 'disputed' | 'cancelled';
  totalAmount: number;
  categoryName: string;
  createdAt: string;
  hasBeenReviewed?: boolean;
  interviewQuestions?: string[]; // custom client inquiry interview questions
  questionnaireScores?: Record<string, number>; // question index or string -> priority/score weight
  questionnaireAnswers?: Record<string, string>; // question index or string -> reply text
  overallCompatibilityScore?: number;
  pointsUsed?: number;
}

export interface Message {
  id: string;
  chatId: string; // combined providerId & customerId e.g. "prov_1_cust_1"
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isVoice?: boolean;
  isImage?: boolean;
  voiceDuration?: string;
  encrypted?: boolean;
  read?: boolean;
  createdAt?: string;
}

export interface Review {
  id: string;
  providerId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  adminResponse?: string;
}

export interface UserState {
  id: string;
  name: string;
  email: string;
  role: Role;
  walletBalance: number;
  savedProviderIds: string[];
  verification: VerificationChecklist;
  blockedUserIds: string[];
  avatarUrl?: string;
  images?: string[]; // up to 8 images
  videos?: string[]; // up to 2 videos
  referralCode?: string;
  referralsMadeCount?: number;
  discountsEarnedAmount?: number;
  adCreditsEarnedBalance?: number;
  luxePoints?: number; // loyalty points earned from completed bookings
  
  // Subscription parameters
  providerSubscriptionActive?: boolean;
  providerSubscriptionPaidUntil?: string;
  isClientPremium?: boolean;
  clientSubscribedAt?: string;
  
  // Message counts & Contact unlocks
  todayMessageCount?: number;
  lastMessageResetDate?: string;
  unlockedProviderContactIds?: string[];
  unlockedCountThisMonth?: number;
  lastUnlockResetDate?: string;

  // Stripe & Bank credentials connecting
  stripeConnectedId?: string;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;

  // Onboarding parameters
  hasCompletedClientProfile?: boolean;
  hasCompletedProviderProfile?: boolean;
}
