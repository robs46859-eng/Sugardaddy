import { useState, useEffect, useRef } from 'react';
import { 
  Role, 
  Category, 
  ServiceProvider, 
  Booking, 
  Message, 
  Review, 
  UserState 
} from './types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_PROVIDERS 
} from './mockData';
import ProviderCard from './components/ProviderCard';
import CitySkyline from './components/CitySkyline';
import VerificationCenter from './components/VerificationCenter';
import ChatSection from './components/ChatSection';
import BookingCalendar from './components/BookingCalendar';
import ExportCenter from './components/ExportCenter';
import DashboardCustomer from './components/DashboardCustomer';
import DashboardProvider from './components/DashboardProvider';
import DashboardAdmin from './components/DashboardAdmin';
import AuthPortal from './components/AuthPortal';
import WorkspaceHub from './components/WorkspaceHub';
import OnboardingWizard from './components/OnboardingWizard';
import MyProfileSettings from './components/MyProfileSettings';
import { auth, googleAuthProvider } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';

import { 
  Star, 
  CheckCircle2, 
  MapPin, 
  ShieldAlert, 
  Heart, 
  Calendar, 
  Lock, 
  ShieldCheck, 
  X, 
  AlertCircle, 
  Check, 
  LayoutDashboard, 
  Plus, 
  Users, 
  Menu, 
  Power, 
  Compass, 
  Sparkles, 
  SlidersHorizontal, 
  Search, 
  Award, 
  Shield, 
  Database, 
  ChevronRight, 
  MessageSquare, 
  RefreshCw,
  Sliders,
  Compass as Globe,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

export default function App() {
  // Core application States
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);

  // Portal switching & Transition states
  const [portalViewMode, setPortalViewMode] = useState<'client' | 'provider'>('client');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState<'client' | 'provider' | null>(null);
  const [transitionMessage, setTransitionMessage] = useState('');

  // Current user initial setup
  const [currentUser, setCurrentUser] = useState<UserState>({
    id: '',
    name: '',
    email: '',
    role: 'customer',
    walletBalance: 0,
    savedProviderIds: [],
    verification: {
      governmentId: 'unverified',
      selfie: 'unverified',
      phone: 'unverified',
      email: 'unverified',
    },
    blockedUserIds: [],
    hasCompletedClientProfile: false,
    hasCompletedProviderProfile: false,
    providerSubscriptionActive: false,
    isClientPremium: false,
    luxePoints: 0
  });

  const [activeTab, setActiveTab] = useState<'browse' | 'dashboard' | 'admin' | 'verification' | 'export' | 'workspace' | 'profile'>('browse');

  const [userCity, setUserCity] = useState<'New York' | 'Los Angeles' | 'Miami' | 'London' | 'Paris' | 'Denver' | 'San Francisco' | 'San Diego' | 'Dallas' | 'Chicago' | 'Philadelphia' | 'Las Vegas' | 'Seattle' | 'Portland' | 'Washington DC' | 'Puerto Rico' | 'Boston' | 'Austin' | 'Phoenix' | 'Atlanta' | 'Nashville' | 'Detroit' | 'Barcelona' | 'Pittsburgh' | 'Cincinnati'>('New York');
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('All Luxe');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchRadius, setSearchRadius] = useState<number>(10);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sortOrder, setSortOrder] = useState<'distance' | 'price_asc' | 'price_desc'>('distance');

  // Interactive Overlays & Modals
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
   const [showBookingModal, setShowBookingModal] = useState(false);
  const [chattingWithProvider, setChattingWithProvider] = useState<ServiceProvider | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // --- IN-APP NAVIGATION HISTORY ENGINE ---
  const [navigationHistory, setNavigationHistory] = useState<any[]>([]);
  const [navigationForward, setNavigationForward] = useState<any[]>([]);
  const [isNavigatingHistory, setIsNavigatingHistory] = useState(false);

  const prevNavStateRef = useRef<any>(null);

  useEffect(() => {
    // Collect the current relevant state to form a unique snapshot
    const currentNavState = {
      activeTab,
      selectedCategory,
      selectedProviderId: selectedProvider?.id || null,
      chattingWithProviderId: chattingWithProvider?.id || null,
      portalViewMode,
    };

    if (!prevNavStateRef.current) {
      prevNavStateRef.current = currentNavState;
      return;
    }

    const prev = prevNavStateRef.current;
    const hasChanged =
      prev.activeTab !== currentNavState.activeTab ||
      prev.selectedCategory !== currentNavState.selectedCategory ||
      prev.selectedProviderId !== currentNavState.selectedProviderId ||
      prev.chattingWithProviderId !== currentNavState.chattingWithProviderId ||
      prev.portalViewMode !== currentNavState.portalViewMode;

    if (hasChanged) {
      if (!isNavigatingHistory) {
        // Push previous state of application into history Stack
        setNavigationHistory((oldHistory) => [...oldHistory, prev]);
        // Reset forward elements on new direct client interaction
        setNavigationForward([]);
      }
      prevNavStateRef.current = currentNavState;
    }
  }, [activeTab, selectedCategory, selectedProvider, chattingWithProvider, portalViewMode, isNavigatingHistory]);

  const handleGoBack = () => {
    if (navigationHistory.length === 0) return;

    setIsNavigatingHistory(true);
    const historyCopy = [...navigationHistory];
    const targetState = historyCopy.pop(); // grab the previous state

    // Push the current state into the forward stack
    const currentNavState = {
      activeTab,
      selectedCategory,
      selectedProviderId: selectedProvider?.id || null,
      chattingWithProviderId: chattingWithProvider?.id || null,
      portalViewMode,
    };
    setNavigationForward((oldForward) => [currentNavState, ...oldForward]);
    setNavigationHistory(historyCopy);

    // Apply the exact backwards configuration
    if (targetState) {
      setActiveTab(targetState.activeTab);
      setSelectedCategory(targetState.selectedCategory);
      setPortalViewMode(targetState.portalViewMode);

      if (targetState.selectedProviderId) {
        const found = providers.find(p => p.id === targetState.selectedProviderId);
        setSelectedProvider(found || null);
      } else {
        setSelectedProvider(null);
      }

      if (targetState.chattingWithProviderId) {
        const found = providers.find(p => p.id === targetState.chattingWithProviderId);
        setChattingWithProvider(found || null);
      } else {
        setChattingWithProvider(null);
      }

      prevNavStateRef.current = targetState;
    }

    setTimeout(() => {
      setIsNavigatingHistory(false);
    }, 80);
  };

  const handleGoForward = () => {
    if (navigationForward.length === 0) return;

    setIsNavigatingHistory(true);
    const forwardCopy = [...navigationForward];
    const targetState = forwardCopy.shift(); // grab the next state

    // Push the current state to the history stack
    const currentNavState = {
      activeTab,
      selectedCategory,
      selectedProviderId: selectedProvider?.id || null,
      chattingWithProviderId: chattingWithProvider?.id || null,
      portalViewMode,
    };
    setNavigationHistory((oldHistory) => [...oldHistory, currentNavState]);
    setNavigationForward(forwardCopy);

    // Apply forward state
    if (targetState) {
      setActiveTab(targetState.activeTab);
      setSelectedCategory(targetState.selectedCategory);
      setPortalViewMode(targetState.portalViewMode);

      if (targetState.selectedProviderId) {
        const found = providers.find(p => p.id === targetState.selectedProviderId);
        setSelectedProvider(found || null);
      } else {
        setSelectedProvider(null);
      }

      if (targetState.chattingWithProviderId) {
        const found = providers.find(p => p.id === targetState.chattingWithProviderId);
        setChattingWithProvider(found || null);
      } else {
        setChattingWithProvider(null);
      }

      prevNavStateRef.current = targetState;
    }

    setTimeout(() => {
      setIsNavigatingHistory(false);
    }, 80);
  };

  // Admin Revenue Metrics Persistence
  const [adminRevenue, setAdminRevenue] = useState<{ bookingFees: number; providerFees: number; clientFees: number }>({
    bookingFees: 0,
    providerFees: 0,
    clientFees: 0
  });

  const updateAdminRevenue = (key: 'bookingFees' | 'providerFees' | 'clientFees', amount: number) => {
    setAdminRevenue(prev => {
      const updated = { ...prev, [key]: Number((prev[key] + amount).toFixed(2)) };
      localStorage.setItem('sugardaddy_admin_revenue', JSON.stringify(updated));
      return updated;
    });
  };

  // Initial Bookings load
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Messages database list
  const [messages, setMessages] = useState<Message[]>([]);

  // Listen for firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      if (fUser) {
        setIsAuthenticated(true);
        const cachedUsers = localStorage.getItem('sugardaddy_user');
        if (cachedUsers) {
          try {
            const parsed = JSON.parse(cachedUsers);
            if (parsed.id === fUser.uid) {
              setCurrentUser(parsed);
              return;
            }
          } catch (e) {}
        }
        
        const fallbackUser: UserState = {
          id: fUser.uid,
          name: fUser.displayName || fUser.email?.split('@')[0] || 'Luxe Member',
          email: fUser.email || '',
          role: 'customer',
          walletBalance: 0,
          savedProviderIds: [],
          verification: {
            governmentId: 'verified',
            selfie: 'verified',
            phone: 'verified',
            email: 'verified',
          },
          blockedUserIds: [],
          hasCompletedClientProfile: false,
          hasCompletedProviderProfile: false,
          providerSubscriptionActive: false,
          isClientPremium: false
        };
        setCurrentUser(fallbackUser);
        localStorage.setItem('sugardaddy_user', JSON.stringify(fallbackUser));
      } else {
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = async (firebaseUser: any, name: string, preferredRole: Role, token?: string) => {
    if (token && token.length > 50) {
      setGoogleAccessToken(token);
    }

    const updatedUser: UserState = {
      id: firebaseUser.uid,
      name: name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Luxe Member',
      email: firebaseUser.email || '',
      role: preferredRole || 'customer',
      walletBalance: 0,
      savedProviderIds: [],
      verification: {
        governmentId: 'verified',
        selfie: 'verified',
        phone: 'verified',
        email: 'verified',
      },
      blockedUserIds: [],
      hasCompletedClientProfile: false,
      hasCompletedProviderProfile: false,
      providerSubscriptionActive: false,
      isClientPremium: false
    };

    setCurrentUser(updatedUser);
    setIsAuthenticated(true);
    localStorage.setItem('sugardaddy_user', JSON.stringify(updatedUser));

    // Async synchronization with Postgres SQL on Cloud SQL
    try {
      await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          walletBalance: updatedUser.walletBalance
        })
      });
      triggerNotification(`Established secure premium connection for ${updatedUser.name}`);
    } catch (err) {
      console.error('Backend database sync failed:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setGoogleAccessToken(null);
      setIsAuthenticated(false);
      triggerNotification('Successfully disconnected from Luxe Hub.');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleCompleteOnboarding = (updatedUser: UserState, newProvider?: ServiceProvider) => {
    setCurrentUser(updatedUser);
    
    let updatedProviders = [...providers];
    if (newProvider) {
      // Ensure we overwrite or insert the new provider profile card safely
      updatedProviders = [newProvider, ...providers.filter(p => p.id !== newProvider.id)];
      setProviders(updatedProviders);
    }
    
    saveToLocalStorage(updatedUser, bookings, updatedProviders, categories);
    
    triggerNotification(
      updatedUser.role === 'provider' 
        ? 'Congratulations! Your elite professional listing is now active.' 
        : `Welcome! Your client session has been initialized under ${updatedUser.isClientPremium ? 'Elite Premium' : 'Free'} status.`
    );
  };

  const triggerPortalSwitch = (target: 'client' | 'provider') => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTransitionTarget(target);
    
    const messagesList = [
      'Synchronizing security structures...',
      'Opening end-to-end connection keys...',
      'Reconfiguring visual dashboards...',
      'Loading cryptographic parameters...'
    ];
    setTransitionMessage(messagesList[0]);
    
    setTimeout(() => setTransitionMessage(messagesList[1]), 400);
    setTimeout(() => setTransitionMessage(messagesList[2]), 800);
    setTimeout(() => setTransitionMessage(messagesList[3]), 1200);

    setTimeout(() => {
      setPortalViewMode(target);
      // Clean active Tab to prevent cross-view bypasses entirely
      setActiveTab(target === 'client' ? 'browse' : 'dashboard');
      setIsTransitioning(false);
      setTransitionTarget(null);
      triggerNotification(`Successfully entered ${target === 'client' ? 'Elite Client Portal' : 'Service Provider Portal'}.`);
    }, 1600);
  };

  const triggerGoogleSignupPopup = async () => {
    try {
      googleAuthProvider.addScope('https://www.googleapis.com/auth/drive.file');
      googleAuthProvider.addScope('https://www.googleapis.com/auth/calendar.events');
      googleAuthProvider.addScope('https://www.googleapis.com/auth/forms.body');
      googleAuthProvider.addScope('https://www.googleapis.com/auth/contacts');

      const result = await signInWithPopup(auth, googleAuthProvider);
      const credential = (result as any)._credentials || {};
      const token = (result as any).accessToken || credential.accessToken;
      if (token) {
        setGoogleAccessToken(token);
        triggerNotification('Connected Google Workspace session successfully!');
      }
    } catch (err) {
      console.error('Google Workspace connect error:', err);
      triggerNotification('Google connect completed.');
    }
  };

  // Sync state with localstorage & auto-detect closest city
  useEffect(() => {
    const cachedUsers = localStorage.getItem('sugardaddy_user');
    const cachedBookings = localStorage.getItem('sugardaddy_bookings');
    const cachedProviders = localStorage.getItem('sugardaddy_providers');
    const cachedCategories = localStorage.getItem('sugardaddy_categories');
    const cachedCity = localStorage.getItem('sugardaddy_city');
    const cachedRevenue = localStorage.getItem('sugardaddy_admin_revenue');
    
    if (cachedUsers) {
      try {
        setCurrentUser(JSON.parse(cachedUsers));
      } catch (err) {}
    }
    if (cachedBookings) setBookings(JSON.parse(cachedBookings));
    if (cachedProviders) setProviders(JSON.parse(cachedProviders));
    // Re-initialize categories from mockData to enforce preset update.
    setCategories(INITIAL_CATEGORIES);

    const cachedMessages = localStorage.getItem('sugardaddy_messages');
    if (cachedMessages) {
      try {
        const parsedMsgs: Message[] = JSON.parse(cachedMessages);
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const freshMsgs = parsedMsgs.filter(m => {
          const createdTime = m.createdAt ? new Date(m.createdAt).getTime() : Date.now();
          return createdTime >= thirtyDaysAgo;
        });
        setMessages(freshMsgs);
      } catch (err) {}
    }
    
    if (cachedRevenue) {
      try {
        setAdminRevenue(JSON.parse(cachedRevenue));
      } catch (err) {}
    }
    
    if (cachedCity) {
      setUserCity(cachedCity as any);
    } else {
      // Auto-detect closest of New York, Los Angeles, Miami, London, Paris based on timezone
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase();
        if (tz.includes('london') || tz.includes('europe/london') || tz.includes('gmt') || tz.includes('bst')) {
          setUserCity('London');
        } else if (tz.includes('paris') || tz.includes('europe/paris') || tz.includes('cet') || tz.includes('cest')) {
          setUserCity('Paris');
        } else if (tz.includes('los_angeles') || tz.includes('america/los_angeles') || tz.includes('pst') || tz.includes('pdt')) {
          setUserCity('Los Angeles');
        } else if (tz.includes('miami') || tz.includes('america/miami') || tz.includes('florida')) {
          setUserCity('Miami');
        } else {
          setUserCity('New York'); // default New York
        }
      } catch (err) {
        setUserCity('New York');
      }
    }
  }, []);

  const saveToLocalStorage = (user: UserState, bList: Booking[], pList: ServiceProvider[], cList: Category[]) => {
    try {
      localStorage.setItem('sugardaddy_user', JSON.stringify(user));
      localStorage.setItem('sugardaddy_bookings', JSON.stringify(bList));
      localStorage.setItem('sugardaddy_providers', JSON.stringify(pList));
      localStorage.setItem('sugardaddy_categories', JSON.stringify(cList));
    } catch (e: any) {
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        console.warn("Storage Quota Exceeded. Safely pruning base64 images and video media to save crucial user data.");
        
        // Let's prune base64 images/videos to make sure it saves fine
        const prunedUser = {
          ...user,
          images: (user.images || []).map((img) => img.startsWith('data:') ? `https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600` : img),
          videos: (user.videos || []).map((vid) => vid.startsWith('data:') ? `https://assets.mixkit.co/videos/preview/mixkit-yacht-floating-in-the-sea-41235-large.mp4` : vid),
          avatarUrl: user.avatarUrl && user.avatarUrl.startsWith('data:') ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' : user.avatarUrl
        };

        const prunedProviders = pList.map(p => {
          if (p.id === user.id) {
            return {
              ...p,
              avatarUrl: p.avatarUrl && p.avatarUrl.startsWith('data:') ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' : p.avatarUrl,
              images: (p.images || []).map((img) => img.startsWith('data:') ? `https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600` : img),
              videos: (p.videos || []).map((vid) => vid.startsWith('data:') ? `https://assets.mixkit.co/videos/preview/mixkit-yacht-floating-in-the-sea-41235-large.mp4` : vid),
            };
          }
          return p;
        });

        try {
          localStorage.setItem('sugardaddy_user', JSON.stringify(prunedUser));
          localStorage.setItem('sugardaddy_bookings', JSON.stringify(bList));
          localStorage.setItem('sugardaddy_providers', JSON.stringify(prunedProviders));
          localStorage.setItem('sugardaddy_categories', JSON.stringify(cList));
          console.log("Pruned user data successfully saved to localStorage.");
        } catch (innerError) {
          console.error("Critical: Could not save even after pruning.", innerError);
        }
      } else {
        console.error("LocalStorage write error:", e);
      }
    }
  };

  // Dispatch Notification helper
  const triggerNotification = (text: string) => {
    setNotifications(prev => [...prev, text]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 5000);
  };

  // Update Current User profile details
  const handleUpdateCurrentUser = (updated: UserState) => {
    setCurrentUser(updated);
    saveToLocalStorage(updated, bookings, providers, categories);
    // sync wallet update to postgres
    fetch('/api/wallet/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: updated.id, balance: updated.walletBalance })
    }).catch(err => console.error(err));
  };


  // Update Provider custom listing portfolios
  const handleUpdateProviderListing = (updatedListing: Partial<ServiceProvider>) => {
    const updatedProviders = providers.map(p => {
      // If the provider has compiled their custom listing, we update it
      if (p.id === 'provider_custom') {
        return {
          ...p,
          ...updatedListing
        };
      }
      return p;
    });
    setProviders(updatedProviders);
    saveToLocalStorage(currentUser, bookings, updatedProviders, categories);
  };

  // Customer: Top up Wallet balance
  const handleTopUpBalance = (amount: number) => {
    const updatedUser = { ...currentUser, walletBalance: currentUser.walletBalance + amount };
    setCurrentUser(updatedUser);
    saveToLocalStorage(updatedUser, bookings, providers, categories);
    triggerNotification(`Secure deposit received: +$${amount} cleared in active wallet.`);
  };

  // Customer: Toggle Save Provider
  const handleToggleSaveProvider = (providerId: string) => {
    let updatedSaved = [...currentUser.savedProviderIds];
    if (updatedSaved.includes(providerId)) {
      updatedSaved = updatedSaved.filter(id => id !== providerId);
      triggerNotification('Provider removed from private vault.');
    } else {
      updatedSaved.push(providerId);
      triggerNotification('Provider saved to private vault.');
    }
    const updatedUser = { ...currentUser, savedProviderIds: updatedSaved };
    setCurrentUser(updatedUser);
    saveToLocalStorage(updatedUser, bookings, providers, categories);
  };

  // Customer: Confirm booking submission
  const handleConfirmNewBooking = (newBooking: Booking) => {
    const updatedUser = { 
      ...currentUser, 
      walletBalance: currentUser.walletBalance - newBooking.totalAmount,
      luxePoints: Math.max(0, (currentUser.luxePoints || 0) - (newBooking.pointsUsed || 0))
    };
    const updatedBookings = [newBooking, ...bookings];
    
    // Check if provider exists, increment reviews or listings
    const updatedProviders = providers.map(p => {
      if (p.id === newBooking.providerId) {
        return { ...p, reviewsCount: p.reviewsCount + 1 };
      }
      return p;
    });

    setCurrentUser(updatedUser);
    setBookings(updatedBookings);
    setProviders(updatedProviders);
    saveToLocalStorage(updatedUser, updatedBookings, updatedProviders, categories);
    triggerNotification('Booking Escrow Deposit secured successfully.');
  };

  const handleUnlockProviderContact = (providerId: string) => {
    if (!currentUser.isClientPremium) return;
    const unlockedIds = currentUser.unlockedProviderContactIds || [];
    const countThisMonth = currentUser.unlockedCountThisMonth || 0;
    if (unlockedIds.includes(providerId)) return;
    if (countThisMonth >= 3) {
      triggerNotification('Monthly contact unlock limit of 3 reached.');
      return;
    }
    const updatedUser = {
      ...currentUser,
      unlockedProviderContactIds: [...unlockedIds, providerId],
      unlockedCountThisMonth: countThisMonth + 1,
    };
    setCurrentUser(updatedUser);
    saveToLocalStorage(updatedUser, bookings, providers, categories);
    triggerNotification('Provider contact unlocked successfully!');
  };

  const handleUpgradeToPremium = () => {
    if (currentUser.isClientPremium) {
      triggerNotification('You are already an elite premium member!');
      return;
    }
    if (currentUser.walletBalance < 25) {
      triggerNotification('Insufficient balance ($25 needed). Please deposit inside your Escrow Wallet.');
      return;
    }

    const updatedUser = {
      ...currentUser,
      walletBalance: Number((currentUser.walletBalance - 25).toFixed(2)),
      isClientPremium: true,
      clientSubscribedAt: new Date().toISOString(),
      unlockedProviderContactIds: [],
      unlockedCountThisMonth: 0,
      lastUnlockResetDate: new Date().toISOString().slice(0, 7), // "2026-06"
    };
    setCurrentUser(updatedUser);
    updateAdminRevenue('clientFees', 25);
    saveToLocalStorage(updatedUser, bookings, providers, categories);
    triggerNotification('Welcome to Premium! Daily limits boosted to 20 messages + 3 unlocks.');
  };

  const handleProviderSubscribe = () => {
    if (currentUser.providerSubscriptionActive) {
      triggerNotification('Your provider subscription is already active.');
      return;
    }
    if (currentUser.walletBalance < 25) {
      triggerNotification('Insufficient balance ($25 needed). Please deposit inside your Escrow Wallet.');
      return;
    }
    const updatedUser = {
      ...currentUser,
      walletBalance: Number((currentUser.walletBalance - 25).toFixed(2)),
      providerSubscriptionActive: true,
      providerSubscriptionPaidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // paid for 30 days
    };
    setCurrentUser(updatedUser);
    updateAdminRevenue('providerFees', 25);
    saveToLocalStorage(updatedUser, bookings, providers, categories);
    triggerNotification('Success! Provider premium features unlocked for 30 days.');
  };

  // Support booking updates (such as questionnaire answering or client individual scoring revisions)
  const handleUpdateBooking = (updatedBooking: Booking) => {
    const updatedBookings = bookings.map(b => b.id === updatedBooking.id ? updatedBooking : b);
    setBookings(updatedBookings);
    saveToLocalStorage(currentUser, updatedBookings, providers, categories);
  };

  // Customer: Release funds to provider wallet
  const handleReleaseEscrowFunds = (bookingId: string) => {
    let earnedPoints = 0;
    const updatedBookings = bookings.map(b => {
      if (b.id === bookingId) {
        earnedPoints = Math.floor(b.totalAmount);
        return { ...b, status: 'completed' } as Booking;
      }
      return b;
    });
    setBookings(updatedBookings);
    
    // Add points to current user
    const updatedUser = { 
      ...currentUser, 
      luxePoints: (currentUser.luxePoints || 0) + earnedPoints 
    };
    setCurrentUser(updatedUser);
    
    saveToLocalStorage(updatedUser, updatedBookings, providers, categories);
    triggerNotification(`Escrow cleared! You earned ${earnedPoints} Luxe Points ✨`);
  };

  // Customer: Raise Dispute
  const handleRaiseDispute = (bookingId: string) => {
    const updatedBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'disputed' } as Booking;
      }
      return b;
    });
    setBookings(updatedBookings);
    saveToLocalStorage(currentUser, updatedBookings, providers, categories);
    triggerNotification('Dispute registered: Moderation team notified.');
  };

  // Customer: Submit completed Review feedback
  const handleAddReviewFeedback = (newReview: Review) => {
    const updatedProviders = providers.map(p => {
      if (p.id === newReview.providerId) {
        const copyReviews = [newReview, ...p.reviews];
        const avgScore = copyReviews.reduce((sum, r) => sum + r.rating, 0) / copyReviews.length;
        return {
          ...p,
          reviews: copyReviews,
          rating: avgScore,
          reviewsCount: copyReviews.length
        };
      }
      return p;
    });

    const updatedBookings = bookings.map(b => {
      if (b.providerId === newReview.providerId && b.status === 'completed') {
        return { ...b, hasBeenReviewed: true };
      }
      return b;
    });

    setProviders(updatedProviders);
    setBookings(updatedBookings);
    saveToLocalStorage(currentUser, updatedBookings, updatedProviders, categories);
    triggerNotification('Review metadata synced in reputational ledger.');
  };

  // Provider: Accept client-side Booking
  const handleAcceptRequest = (bookingId: string) => {
    const updatedBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'active_escrow' } as Booking;
      }
      return b;
    });
    setBookings(updatedBookings);
    saveToLocalStorage(currentUser, updatedBookings, providers, categories);
    triggerNotification('Request Accepted: Security Escrow holds funds active.');
  };

  // Provider: Reject booking
  const handleRejectRequest = (bookingId: string) => {
    const updatedBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'cancelled' } as Booking;
      }
      return b;
    });
    setBookings(updatedBookings);
    saveToLocalStorage(currentUser, updatedBookings, providers, categories);
    triggerNotification('Request Rejected: Client notified of cancellation.');
  };

  // Provider: Publish / Edit own listing
  const handlePublishMyListing = (editedData: Partial<ServiceProvider> | undefined) => {
    let updatedProviders = [...providers];
    if (editedData === undefined) {
      // Remove custom user listing
      updatedProviders = updatedProviders.filter(p => p.id !== 'provider_custom');
    } else {
      const customListing: ServiceProvider = {
        id: 'provider_custom',
        name: currentUser.name,
        title: editedData.title || 'Luxe Associate',
        bio: editedData.bio || '',
        rating: 5.0,
        reviewsCount: 0,
        completionRate: 100,
        responseTime: 'Instant',
        repeatCustomerRate: 100,
        categories: editedData.categories || [],
        pricePerEvent: editedData.pricePerEvent || 150,
        priceUnit: editedData.priceUnit || 'hour',
        distanceMiles: 1.0,
        locationName: editedData.locationName || 'New York',
        isFeatured: false,
        avatarUrl: editedData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        verification: {
          governmentId: 'verified',
          selfie: 'verified',
          phone: 'verified',
          email: 'verified',
        },
        verifiedBadge: true,
        availabilityCalendar: editedData.availabilityCalendar || ['Friday', 'Saturday'],
        reviews: []
      };

      // Ensure duplicates are replaced
      updatedProviders = updatedProviders.filter(p => p.id !== 'provider_custom');
      updatedProviders.unshift(customListing);
    }
    setProviders(updatedProviders);
    saveToLocalStorage(currentUser, bookings, updatedProviders, categories);
  };

  // Provider: Update availability
  const handleUpdateAvailabilityDays = (updatedDays: string[]) => {
    const updatedProviders = providers.map(p => {
      if (p.id === 'provider_custom') {
        return { ...p, availabilityCalendar: updatedDays };
      }
      return p;
    });
    setProviders(updatedProviders);
    saveToLocalStorage(currentUser, bookings, updatedProviders, categories);
    triggerNotification('Availability schedule updated.');
  };

  // Admin: Create custom categories
  const handleAddNewCategory = (newCat: Category) => {
    const updatedCategories = [...categories, newCat];
    setCategories(updatedCategories);
    saveToLocalStorage(currentUser, bookings, providers, updatedCategories);
    triggerNotification(`Global Category Schema updated with "${newCat.name}".`);
  };

  // Admin: Toggle featured provider status
  const handleModerateFeatured = (providerId: string) => {
    const updatedProviders = providers.map(p => {
      if (p.id === providerId) {
        return { ...p, isFeatured: !p.isFeatured };
      }
      return p;
    });
    setProviders(updatedProviders);
    saveToLocalStorage(currentUser, bookings, updatedProviders, categories);
  };

  // Admin: Approve pending credential audit
  const handleApproveVerifyRequest = (providerId: string, itemType: string) => {
    const updatedProviders = providers.map(p => {
      if (p.id === providerId) {
        return {
          ...p,
          verification: {
            ...p.verification,
            [itemType]: 'verified' as const
          }
        };
      }
      return p;
    });
    setProviders(updatedProviders);
    saveToLocalStorage(currentUser, bookings, updatedProviders, categories);
  };

  // Admin: Resolve Dispute or Refund
  const handleResolveDispute = (bookingId: string, action: 'refund' | 'release') => {
    const updatedBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: action === 'refund' ? 'cancelled' : 'completed' } as Booking;
      }
      return b;
    });
    setBookings(updatedBookings);
    saveToLocalStorage(currentUser, updatedBookings, providers, categories);
    triggerNotification(`Admin Arbitration complete: Resolved via ${action}.`);
  };

  // Chat messaging list sending helper
  const handleSendInstantMessage = (msg: Message) => {
    const enrichedMsg: Message = {
      ...msg,
      createdAt: new Date().toISOString()
    };
    const updated = [...messages, enrichedMsg];
    setMessages(updated);
    localStorage.setItem('sugardaddy_messages', JSON.stringify(updated));
  };

  // User list block toggler helper
  const handleBlockToggleUser = (targetId: string) => {
    let updatedBlocked = [...currentUser.blockedUserIds];
    if (updatedBlocked.includes(targetId)) {
      updatedBlocked = updatedBlocked.filter(id => id !== targetId);
      triggerNotification('Contact restored successfully.');
    } else {
      updatedBlocked.push(targetId);
      triggerNotification('Contact blocked. Chat has been secured.');
    }
    const updatedUser = { ...currentUser, blockedUserIds: updatedBlocked };
    setCurrentUser(updatedUser);
    saveToLocalStorage(updatedUser, bookings, providers, categories);
  };

  // Geolocation & Filter calculations
  const filteredProviders = providers.filter(p => {
    // Search query matches
    const nameMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      p.bio.toLowerCase().includes(searchQuery.toLowerCase());
                      
    // Selected category match
    const categoryMatch = selectedCategory === 'All Luxe' || p.categories.includes(selectedCategory);
    
    // Radius geofence simulation
    const radiusMatch = p.distanceMiles <= searchRadius;

    // Verified badge filter
    const verifyMatch = !onlyVerified || Object.values(p.verification).every(v => v === 'verified');

    return nameMatch && categoryMatch && radiusMatch && verifyMatch;
  }).sort((a, b) => {
    // Promoted listings have absolute top placement priority
    if (a.isPromoted && !b.isPromoted) return -1;
    if (!a.isPromoted && b.isPromoted) return 1;

    // Standard sorting selectors
    if (sortOrder === 'price_asc') return a.pricePerEvent - b.pricePerEvent;
    if (sortOrder === 'price_desc') return b.pricePerEvent - a.pricePerEvent;
    return a.distanceMiles - b.distanceMiles; // default: proximity distance
  });

  // Calculate my active provider custom listing
  const myListingProfile = providers.find(p => p.id === currentUser.id);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 text-wrap select-none">
        {/* Dynamic Push Notification Overlay alerts */}
        <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none max-w-sm w-full">
          {notifications.map((notif, idx) => (
            <div key={idx} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-2xl flex items-start gap-2.5 animate-slide-in backdrop-blur-md">
              <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-xs text-white font-medium font-sans leading-snug">{notif}</p>
            </div>
          ))}
        </div>
        <AuthPortal onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  const needsOnboarding = currentUser && (
    (currentUser.role === 'provider' && (!currentUser.hasCompletedProviderProfile || !currentUser.providerSubscriptionActive)) ||
    (currentUser.role === 'customer' && !currentUser.hasCompletedClientProfile)
  );

  if (needsOnboarding) {
    return (
      <div className="min-h-screen bg-zinc-950 select-none">
        <div className="fixed bottom-4 right-4 z-55 space-y-2 pointer-events-none max-w-sm w-full">
          {notifications.map((notif, idx) => (
            <div key={idx} className="bg-[#1c1a18] border border-zinc-800 p-4 rounded-xl shadow-2xl flex items-start gap-2.5 animate-slide-in backdrop-blur-md">
              <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-xs text-white font-medium font-sans leading-snug">{notif}</p>
            </div>
          ))}
        </div>
        <OnboardingWizard 
          currentUser={currentUser} 
          categories={categories} 
          onCompleteOnboarding={handleCompleteOnboarding} 
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background freckled-bg text-on-background flex flex-col font-sans selection:bg-primary selection:text-on-primary ${portalViewMode === 'provider' ? 'theme-provider' : 'theme-client'}`}>
      
      {/* Cinematic Portal Transition Screen Overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 bg-zinc-950/95 backdrop-blur-md z-[9999] flex flex-col items-center justify-center p-6 text-center select-none animate-fade-in animate-duration-300">
          <div className="relative max-w-sm space-y-6">
            
            {/* Decorative Rotating Gold Orbs */}
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-amber-500/20 animate-ping absolute" />
              <div className="w-12 h-12 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
              <Sparkles className="w-5 h-5 text-amber-500 absolute animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white font-serif uppercase tracking-widest text-amber-500">
                Swapping Portal Framework Mode
              </h3>
              <p className="text-neutral-400 text-xs font-mono tracking-tight">
                {transitionTarget === 'client' ? 'COMPILED PORTAL CLIENT VIEW...' : 'AUTHENTICATING ENCRYPTED WORKSPACE...'}
              </p>
            </div>

            <div className="pt-2">
              <div className="bg-[#151311] border border-zinc-800 rounded-lg p-3 text-left">
                <p className="text-[10px] text-zinc-500 font-mono tracking-tight leading-normal h-8 flex items-center">
                  ⚡ {transitionMessage}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Dynamic Push Notification Overlay alerts */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none max-w-sm w-full">
        {notifications.map((notif, idx) => (
          <div key={idx} className="bg-surface border border-outline p-4 rounded-xl shadow-2xl flex items-start gap-2.5 animate-slide-in backdrop-blur-md">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
            <p className="text-xs text-on-surface font-medium font-sans leading-snug">{notif}</p>
          </div>
        ))}
      </div>

      {/* Top Elite Hub bar */}
      <header className="sticky top-0 z-40 bg-background/95 border-b border-outline-variant backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand Header */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('browse')}>
            {portalViewMode === 'client' ? (
              <>
                <Globe className="w-6 h-6 text-primary shrink-0" />
                <span className="text-sm font-extrabold tracking-widest uppercase text-white font-serif flex items-center gap-1.5">
                  <span>SUGAR DADDY</span>
                  <span className="text-[10px] bg-primary/10 border border-primary/25 text-primary px-2 py-0.2 rounded font-bold font-mono">P2P MARKETPLACE</span>
                </span>
              </>
            ) : (
              <>
                <Shield className="w-6 h-6 text-primary shrink-0" />
                <span className="text-sm font-extrabold tracking-widest uppercase text-white font-sans flex items-center gap-1.5">
                  <span>PROVIDER PORTAL</span>
                  <span className="text-[10px] bg-primary/10 border border-primary/25 text-primary px-2 py-0.2 rounded font-bold font-mono">MANAGEMENT</span>
                </span>
              </>
            )}
          </div>

          {/* Center Swapper Roles selector (The gold premium control!) */}
          <div className="flex items-center bg-surface p-1 rounded-xl border border-outline-variant gap-1">
            {portalViewMode === 'client' ? (
              <button 
                onClick={() => {
                  if (currentUser.isClientPremium || currentUser.role === 'provider') {
                    triggerPortalSwitch('provider');
                  }
                }}
                disabled={!currentUser.isClientPremium && currentUser.role !== 'provider'}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all font-mono uppercase flex items-center gap-1.5 ${
                  (currentUser.isClientPremium || currentUser.role === 'provider')
                    ? 'bg-primary text-on-primary font-extrabold cursor-pointer hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/10'
                    : 'bg-zinc-800/20 border border-zinc-850 text-neutral-600 cursor-not-allowed opacity-50'
                }`}
                title={(!currentUser.isClientPremium && currentUser.role !== 'provider') ? 'Greyed out: Requires VIP Premium account level to switch sides' : 'Switch over to Provider Portal'}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Switch to Provider Portal 👑</span>
              </button>
            ) : (
              <button 
                onClick={() => triggerPortalSwitch('client')}
                className="px-3 py-1.5 bg-surface border border-outline-variant text-primary hover:text-white rounded-lg text-xs font-bold transition-all font-mono uppercase flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] shadow"
                title="Switch over to Client Portal"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Switch to Client Portal 👥</span>
              </button>
            )}
          </div>

          {/* Quick Stats Dashboard shortcut */}
          <div className="flex items-center gap-4">
            
            {/* Offline-First Synchronization simulator indicators */}
            <div 
              onClick={() => {
                setIsOfflineMode(!isOfflineMode);
                triggerNotification(isOfflineMode ? 'Secured satellite sync active' : 'Network offline simulation active. Caching state locally.');
              }}
              className={`cursor-pointer px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1.5 transition-colors select-none ${
                isOfflineMode 
                  ? 'bg-rose-500/10 border-rose-500/25 text-rose-450' 
                  : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
              }`}
              title="Toggle Network Sandbox states"
            >
              <div className={`w-2 h-2 rounded-full ${isOfflineMode ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              <span>{isOfflineMode ? 'OFFLINE CACHED' : 'SECURED CLOUD SYNCED'}</span>
            </div>

            {/* City Skyline Selector - Client Location detection simulator */}
            <div className="flex items-center gap-2 bg-[#1d1b19] border border-outline-variant px-3 py-1.5 rounded-xl hover:border-outline transition-colors shadow">
              <span className="text-[10px] text-[#9e8e80] font-mono uppercase tracking-wider font-bold">📍 HUB:</span>
              <select
                value={userCity}
                onChange={(e) => {
                  const cityVal = e.target.value as any;
                  setUserCity(cityVal);
                  localStorage.setItem('sugardaddy_city', cityVal);
                  triggerNotification(`Closest hub set to ${cityVal} skyline.`);
                }}
                className="bg-transparent border-none text-xs text-primary font-bold font-mono focus:outline-none cursor-pointer outline-none select-none"
                title="Select Local Hub City Skyline"
              >
                <option value="New York">NEW YORK</option>
                <option value="Los Angeles">LOS ANGELES</option>
                <option value="Miami">MIAMI</option>
                <option value="London">LONDON</option>
                <option value="Paris">PARIS</option>
                <option value="Denver">DENVER</option>
                <option value="San Francisco">SAN FRANCISCO</option>
                <option value="San Diego">SAN DIEGO</option>
                <option value="Dallas">DALLAS</option>
                <option value="Chicago">CHICAGO</option>
                <option value="Philadelphia">PHILADELPHIA</option>
                <option value="Las Vegas">LAS VEGAS</option>
                <option value="Seattle">SEATTLE</option>
                <option value="Portland">PORTLAND</option>
                <option value="Washington DC">WASHINGTON DC</option>
                <option value="Puerto Rico">PUERTO RICO</option>
                <option value="Boston">BOSTON</option>
                <option value="Austin">AUSTIN</option>
                <option value="Phoenix">PHOENIX</option>
                <option value="Atlanta">ATLANTA</option>
                <option value="Nashville">NASHVILLE</option>
                <option value="Detroit">DETROIT</option>
                <option value="Barcelona">BARCELONA</option>
                <option value="Pittsburgh">PITTSBURGH</option>
                <option value="Cincinnati">CINCINNATI</option>
              </select>
            </div>

            <div 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 bg-surface border border-outline-variant px-3 py-1.5 rounded-xl cursor-pointer hover:border-outline transition-colors animate-fade-in"
            >
              <Users className="w-4 h-4 text-primary" />
              <div>
                <span className="text-[10px] text-on-surface-variant block uppercase font-mono tracking-wider font-bold">Luxe Portfolio</span>
                <span className="text-xs font-bold text-primary font-mono">${currentUser.walletBalance}</span>
              </div>
            </div>

            <div 
              className="flex items-center gap-2 bg-surface border border-primary/20 px-3 py-1.5 rounded-xl animate-fade-in shadow-[0_0_8px_rgba(253,186,116,0.1)]"
              title="Luxe Points earned from completed bookings"
            >
              <span className="text-xs">✨</span>
              <div>
                <span className="text-[10px] text-primary block uppercase font-mono tracking-wider font-bold">Points</span>
                <span className="text-xs font-bold text-white font-mono">{currentUser.luxePoints || 0}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-[#1c1c1e] hover:bg-zinc-800 border border-zinc-805 px-3 py-1.5 rounded-xl cursor-pointer text-xs text-[#d6c3b4] hover:text-white transition-colors"
              title="Sign Out of Luxe Hub Session"
            >
              <Power className="w-4 h-4 text-red-500 hover:scale-110 transition-transform" />
              <span className="font-mono tracking-widest text-[10px] uppercase font-bold">Disconnect</span>
            </button>
          </div>

        </div>
      </header>

      {/* Primary Workspace Sections */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Navigation Tab selection list */}
        <div className="flex items-center gap-4 border-b border-outline-variant pb-2 overflow-x-auto select-none no-scrollbar">
          
          {/* Elite In-App Back/Forward browser-like controls */}
          <div className="flex items-center gap-1.5 bg-[#171513] border border-outline-variant p-1 rounded-xl shrink-0 mr-2 shadow-inner">
            <button
              onClick={handleGoBack}
              disabled={navigationHistory.length === 0}
              className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${
                navigationHistory.length > 0 
                  ? 'text-primary bg-primary/5 hover:bg-primary/20 cursor-pointer hover:scale-105 active:scale-95' 
                  : 'text-neutral-700 opacity-25 cursor-not-allowed'
              }`}
              title="Go Back In-App 📁"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-tight select-none">In-App Navigate</span>
            <button
              onClick={handleGoForward}
              disabled={navigationForward.length === 0}
              className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${
                navigationForward.length > 0 
                  ? 'text-primary bg-primary/5 hover:bg-primary/20 cursor-pointer hover:scale-105 active:scale-95' 
                  : 'text-neutral-700 opacity-25 cursor-not-allowed'
              }`}
              title="Go Forward In-App 📁"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {portalViewMode === 'client' ? (
            <>
              <button
                onClick={() => setActiveTab('browse')}
                className={`px-4 py-2 text-xs uppercase font-extrabold tracking-widest font-mono transition-all shrink-0 ${
                  activeTab === 'browse' ? 'text-primary border-b-2 border-primary w-fit' : 'text-[#d6c3b4] hover:text-white'
                }`}
              >
                ✈ Discover Services
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 text-xs uppercase font-extrabold tracking-widest font-mono transition-all shrink-0 ${
                  activeTab === 'dashboard' ? 'text-primary border-b-2 border-primary w-fit' : 'text-[#d6c3b4] hover:text-white'
                }`}
              >
                📋 Client Workspace
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 text-xs uppercase font-extrabold tracking-widest font-mono transition-all shrink-0 ${
                  activeTab === 'profile' ? 'text-primary border-b-2 border-primary w-fit' : 'text-[#d6c3b4] hover:text-white'
                }`}
              >
                👤 Profile Settings
              </button>

              <button
                onClick={() => setActiveTab('verification')}
                className={`px-4 py-2 text-xs uppercase font-extrabold tracking-widest font-mono transition-all shrink-0 ${
                  activeTab === 'verification' ? 'text-primary border-b-2 border-primary w-fit' : 'text-[#d6c3b4] hover:text-white'
                }`}
              >
                🛡️ Verification Center
              </button>

              <button
                onClick={() => setActiveTab('export')}
                className={`px-4 py-2 text-xs uppercase font-extrabold tracking-widest font-mono transition-all shrink-0 ${
                  activeTab === 'export' ? 'text-primary border-b-2 border-primary w-fit' : 'text-[#d6c3b4] hover:text-white'
                }`}
              >
                💾 Backup Logs
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 text-xs uppercase font-extrabold tracking-widest font-mono transition-all shrink-0 ${
                  activeTab === 'dashboard' ? 'text-primary border-b-2 border-primary w-fit' : 'text-[#d6c3b4] hover:text-white'
                }`}
              >
                📋 Provider Dashboard
              </button>

              <button
                onClick={() => setActiveTab('workspace')}
                className={`px-4 py-2 text-xs uppercase font-extrabold tracking-widest font-mono transition-all shrink-0 ${
                  activeTab === 'workspace' ? 'text-primary border-b-2 border-primary w-fit' : 'text-[#d6c3b4] hover:text-white'
                }`}
              >
                💼 Workspace Sync
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 text-xs uppercase font-extrabold tracking-widest font-mono transition-all shrink-0 ${
                  activeTab === 'profile' ? 'text-primary border-b-2 border-primary w-fit' : 'text-[#d6c3b4] hover:text-white'
                }`}
              >
                👤 Profile Settings
              </button>

              <button
                onClick={() => setActiveTab('verification')}
                className={`px-4 py-2 text-xs uppercase font-extrabold tracking-widest font-mono transition-all shrink-0 ${
                  activeTab === 'verification' ? 'text-primary border-b-2 border-primary w-fit' : 'text-[#d6c3b4] hover:text-white'
                }`}
              >
                🛡️ Verification Status
              </button>

              <button
                onClick={() => setActiveTab('export')}
                className={`px-4 py-2 text-xs uppercase font-extrabold tracking-widest font-mono transition-all shrink-0 ${
                  activeTab === 'export' ? 'text-primary border-b-2 border-primary w-fit' : 'text-[#d6c3b4] hover:text-white'
                }`}
              >
                💾 Backup Logs
              </button>
            </>
          )}

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 text-xs uppercase font-extrabold tracking-widest font-mono transition-all shrink-0 ${
                activeTab === 'admin' ? 'text-primary border-b-2 border-primary w-fit' : 'text-[#d6c3b4] hover:text-white'
              }`}
            >
              🛡️ Admin Control
            </button>
          )}
        </div>

        {/* Tab 1: Discovery Marketplace */}
        {activeTab === 'browse' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Luxe Career Specialties Paths */}
            <div className="space-y-4">
              <div className="text-left flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#ffdebf] font-bold">Discover Luxury Career Specialties</h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Select a career track card to filter verified professionals instantly.</p>
                </div>
                {selectedCategory !== 'All Luxe' && (
                  <button 
                    onClick={() => setSelectedCategory('All Luxe')}
                    className="text-[10px] font-mono text-primary hover:underline uppercase font-bold"
                  >
                    Clear Filter ×
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategory(isSelected ? 'All Luxe' : cat.name)}
                      className={`cursor-pointer p-4 rounded-xl border text-left transition-all duration-200 relative overflow-hidden select-none flex flex-col justify-between h-[120px] ${
                        isSelected 
                          ? 'border-primary bg-primary/5 text-white shadow-[0_0_15px_rgba(253,186,116,0.12)]' 
                          : 'border-outline-variant bg-surface hover:border-[#9e8e80] text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold uppercase text-[#9e7e60]">
                          {cat.isCustom ? 'Custom Sector' : 'Verified Career'}
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded bg-primary animate-pulse" />
                        )}
                      </div>

                      <div className="my-1.5 min-h-[44px]">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wide font-mono line-clamp-1">
                          {cat.name}
                        </h4>
                        <p className="text-[10px] text-neutral-400 leading-snug line-clamp-2 mt-0.5">
                          {cat.description}
                        </p>
                      </div>

                      <div className="pt-1.5 border-t border-outline-variant/60 flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-primary font-semibold">
                        <span>{isSelected ? 'Active Filter' : 'Filter Providers'}</span>
                        <ChevronRight className="w-3 h-3 text-neutral-500" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Filters Sidebar Column */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Premium Search input */}
                <div className="p-5 bg-surface border border-outline-variant rounded-xl relative shadow-md">
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant mb-4">
                    <span className="text-xs font-bold uppercase text-white font-mono tracking-wider">Search Filters</span>
                    <SlidersHorizontal className="w-4 h-4 text-[#d6c3b4]" />
                  </div>

                  <div className="space-y-4">
                    
                    {/* Text search with embedded filter options dropdown */}
                    <div className="relative flex items-center">
                      <input 
                        type="text" 
                        placeholder="NAME, SPECIALTY..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#100e0c] border border-outline-variant text-[11px] px-3 py-2.5 pl-8 pr-20 rounded-lg text-white outline-none focus:border-primary font-mono placeholder-neutral-600 uppercase"
                      />
                      <Search className="w-3.5 h-3.5 text-neutral-550 absolute left-2.5" />
                      
                      {/* Filter options drop-down menu for the search bar */}
                      <div className="absolute right-1">
                        <select
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value as any)}
                          className="bg-surface border border-outline-variant text-[9px] px-1.5 py-1 rounded text-neutral-300 outline-none focus:border-primary font-mono cursor-pointer"
                          title="Sort Order"
                        >
                          <option value="distance">Proximity</option>
                          <option value="price_asc">Price Asc</option>
                          <option value="price_desc">Price Desc</option>
                        </select>
                      </div>
                    </div>

                    {/* Proximity Distance Radius Slider */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono text-[#d6c3b4]">
                        <span>Proximity Radius:</span>
                        <span className="text-primary font-bold">{searchRadius} miles</span>
                      </div>
                      <input 
                        type="range" 
                        min={1} 
                        max={50} 
                        value={searchRadius} 
                        onChange={(e) => setSearchRadius(Number(e.target.value))}
                        className="w-full h-1 bg-[#100e0c] rounded appearance-none cursor-pointer accent-primary focus:outline-none"
                      />
                    </div>

                    {/* Verification checkbox */}
                    <label className="flex items-center gap-2.5 pt-1.5 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={onlyVerified}
                        onChange={(e) => setOnlyVerified(e.target.checked)}
                        className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-0 cursor-pointer accent-primary"
                      />
                      <span className="text-xs text-neutral-300 font-mono font-medium">Verified-Only results</span>
                    </label>

                    {/* Sorting orders select */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-neutral-500 font-mono tracking-widest block uppercase">Order Results</span>
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as any)}
                        className="w-full bg-[#100e0c] border border-outline-variant text-xs px-3 py-2 rounded-lg text-neutral-300 outline-none focus:border-primary font-mono"
                      >
                        <option value="distance">Proximity</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                      </select>
                    </div>

                  </div>
                </div>

                {/* Categories Navigation Grid list */}
                <div className="p-5 bg-surface border border-outline-variant rounded-xl relative shadow-md">
                  <span className="text-xs font-bold uppercase font-mono tracking-widest text-neutral-500 block mb-3.5">Discover Categorizations</span>
                  
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setSelectedCategory('All Luxe')}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-all font-mono ${
                        selectedCategory === 'All Luxe' 
                          ? 'bg-primary text-on-primary font-bold shadow-md shadow-primary/10' 
                          : 'text-[#d6c3b4] hover:bg-background/65 hover:text-white'
                      }`}
                    >
                      All Luxe Categories
                    </button>

                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-all font-mono flex items-center justify-between ${
                          selectedCategory === cat.name 
                            ? 'bg-primary text-on-primary font-bold shadow-md shadow-primary/10' 
                            : 'text-[#d6c3b4] hover:bg-background/65 hover:text-white'
                        }`}
                      >
                        <span>{cat.name}</span>
                        {cat.isCustom && (
                          <span className="text-[8px] uppercase tracking-wide bg-[#2c2a27] text-[#d6c3b4] py-px px-1.5 rounded-full font-bold">User</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Providers Feed Column */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Header category description card */}
                <div className="p-6 bg-[#1d1b19] rounded-xl border border-outline-variant flex items-center justify-between relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-white font-serif">
                      {selectedCategory === 'All Luxe' ? 'Select Verified Global Service Providers' : selectedCategory}
                    </h2>
                    <p className="text-xs text-[#d6c3b4] mt-1 max-w-xl leading-relaxed">
                      {selectedCategory === 'All Luxe' 
                        ? 'Secure lifestyle coaches, event companions, travel interpretation assistants, or concierge mentorship professionals from fully verified listings.' 
                        : categories.find(c => c.name === selectedCategory)?.description || 'Discover tailored elite services.'}
                    </p>
                  </div>
                </div>

                {/* Grid providers rendering */}
                {filteredProviders.length === 0 ? (
                  <div className="text-center py-20 rounded-xl bg-surface border border-outline-variant p-6 space-y-3">
                    <Compass className="w-10 h-10 text-neutral-600 mx-auto animate-spin" />
                    <p className="text-xs font-mono text-neutral-400">Zero matches correspond to these active geofencing coordinates.</p>
                    <p className="text-[11px] text-neutral-500 max-w-xs mx-auto leading-relaxed">
                      Attempt broadening your search radius, de-selecting filters, or searching alternative categories!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProviders.map((prov) => (
                      <ProviderCard
                        key={prov.id}
                        provider={prov}
                        isSaved={currentUser.savedProviderIds.includes(prov.id)}
                        onToggleSave={() => handleToggleSaveProvider(prov.id)}
                        onSelectBook={() => {
                          setSelectedProvider(prov);
                          setShowBookingModal(true);
                        }}
                        onStartChat={() => {
                          setChattingWithProvider(prov);
                          setActiveTab('dashboard'); // take to message console instant
                        }}
                        currentUser={currentUser}
                        onUnlockContact={handleUnlockProviderContact}
                        onUpgradePremium={handleUpgradeToPremium}
                      />
                    ))}
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Dashboard Suite (Supports swappable Client or Provider roles!) */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* left Messenger area - active cache drawer */}
            <div className="lg:col-span-1 space-y-6">
              
              <div className="p-4 bg-surface border border-outline-variant rounded-xl shadow">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block tracking-widest mb-3 uppercase">Secured Private Channels</span>
                
                {/* Active contact lists */}
                <div className="space-y-1.5">
                  {(() => {
                    const chatPartners = portalViewMode === 'client' 
                      ? providers 
                      : Array.from(new Set(
                          messages
                            .filter(m => m.chatId.includes(currentUser.id) && m.senderId !== currentUser.id)
                            .map(m => m.senderId)
                        )).map(uid => {
                          const userMsgs = messages.filter(m => m.senderId === uid || m.chatId.includes(uid));
                          const lastM = userMsgs[userMsgs.length - 1];
                          const cName = lastM ? lastM.senderName : 'VIP Client User';
                          return {
                            id: uid,
                            name: cName,
                            title: 'Verified Client Member',
                            avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
                            bio: 'Private client portfolio consult.',
                            rating: 5.0,
                            reviewsCount: 1,
                            completionRate: 100,
                            responseTime: '12 mins',
                            repeatCustomerRate: 100,
                            categories: [],
                            pricePerEvent: 0,
                            priceUnit: 'hour',
                            distanceMiles: 0,
                            locationName: 'Encrypted Routing',
                            isFeatured: false,
                            verification: { governmentId: 'verified', selfie: 'verified', phone: 'verified', email: 'verified' },
                            reviews: [],
                            verifiedBadge: true,
                            availabilityCalendar: []
                          } as any;
                        });

                    if (chatPartners.length === 0) {
                      return (
                        <div className="p-4 border border-zinc-800 bg-[#141210]/30 rounded-xl text-center text-xs text-neutral-500">
                          <p className="font-mono uppercase text-[10px] tracking-wider text-amber-500/80 font-bold mb-1">No Active Chat Connections</p>
                          <p className="text-[10px] text-zinc-500 leading-normal">
                            {portalViewMode === 'client' 
                              ? 'Tap "Discover Services" above to select an elite professional provider card and launch an encrypted chat channel.' 
                              : 'Incoming Client consulting sessions will appear here dynamically as they occur.'}
                          </p>
                        </div>
                      );
                    }

                    return chatPartners.map(p => {
                      const userMsgs = messages.filter(m => 
                        (m.chatId === `${p.id}_${currentUser.id}`) || 
                        (m.chatId === `${currentUser.id}_${p.id}`)
                      );
                      const lastMsg = userMsgs[userMsgs.length - 1];
                      const isSelected = chattingWithProvider?.id === p.id;
                      return (
                        <div 
                          key={p.id}
                          onClick={() => setChattingWithProvider(p)}
                          className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-primary/5 border-primary/40'
                              : 'border-outline-variant hover:border-outline bg-[#100e0c]/40'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {p.avatarUrl ? (
                              <img src={p.avatarUrl} alt={p.name} className="w-8 h-8 rounded-full object-cover border border-outline-variant shrink-0" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-zinc-805 text-white flex items-center justify-center text-xs font-bold font-mono shrink-0">
                                {p.name[0]}
                              </div>
                            )}
                            <div className="text-left min-w-0">
                              <h4 className="text-white font-bold text-xs truncate">{p.name}</h4>
                              <p className="text-[10px] text-neutral-400 font-mono tracking-tight truncate max-w-[130px]">
                                {lastMsg ? lastMsg.text : `${p.title}`}
                              </p>
                            </div>
                          </div>
                          <span className="text-[9px] text-[#9e8e80] font-mono shrink-0">
                            {lastMsg ? lastMsg.timestamp : 'Active'}
                          </span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
 
              {/* Chat section viewport if target exists */}
              {chattingWithProvider && (
                <ChatSection
                  currentUser={currentUser}
                  provider={chattingWithProvider}
                  onSendMessage={handleSendInstantMessage}
                  chatMessages={messages.filter(m => 
                    m.chatId === `${chattingWithProvider.id}_${currentUser.id}` || 
                    m.chatId === `${currentUser.id}_${chattingWithProvider.id}`
                  )}
                  onBlockUser={handleBlockToggleUser}
                  isUserBlocked={currentUser.blockedUserIds.includes(chattingWithProvider.id)}
                  onUpgradePremium={handleUpgradeToPremium}
                />
              )}

            </div>

            {/* right Dashboard operations Column */}
            <div className="lg:col-span-2">
              {portalViewMode === 'client' ? (
                <DashboardCustomer
                  currentUser={currentUser}
                  onTopUpWallet={handleTopUpBalance}
                  savedProviders={providers.filter(p => currentUser.savedProviderIds.includes(p.id))}
                  bookingsList={bookings}
                  providersList={providers}
                  onReleaseEscrow={handleReleaseEscrowFunds}
                  onAddReview={handleAddReviewFeedback}
                  onViewProvider={(id) => {
                    const found = providers.find(p => p.id === id);
                    if (found) setSelectedProvider(found);
                  }}
                  onRaiseDispute={handleRaiseDispute}
                  onUpdateCurrentUser={handleUpdateCurrentUser}
                  onUpdateBooking={handleUpdateBooking}
                  triggerNotification={triggerNotification}
                  onUpgradePremium={handleUpgradeToPremium}
                />
              ) : portalViewMode === 'provider' ? (
                <DashboardProvider
                  currentUser={currentUser}
                  categoriesList={categories}
                  bookingsList={bookings}
                  providersList={providers}
                  onAcceptBooking={handleAcceptRequest}
                  onRejectBooking={handleRejectRequest}
                  onPublishListing={handlePublishMyListing}
                  myListing={myListingProfile}
                  onUpdateAvailability={handleUpdateAvailabilityDays}
                  onUpdateCurrentUser={handleUpdateCurrentUser}
                  onUpdateProviderListing={handleUpdateProviderListing}
                  onUpdateBooking={handleUpdateBooking}
                  triggerNotification={triggerNotification}
                  onProviderSubscribe={handleProviderSubscribe}
                  onTopUpWallet={handleTopUpBalance}
                />
              ) : (
                <DashboardAdmin
                  categoriesList={categories}
                  providersList={providers}
                  bookingsList={bookings}
                  onAddNewCategory={handleAddNewCategory}
                  onModerateFeatured={handleModerateFeatured}
                  onApproveVerifyRequest={handleApproveVerifyRequest}
                  onResolveDisputeEscrow={handleResolveDispute}
                />
              )}
            </div>

          </div>
        )}

        {/* Tab 3: Verification Panel */}
        {activeTab === 'workspace' && (
          <div className="animate-fade-in">
            <WorkspaceHub 
              currentUser={currentUser}
              googleToken={googleAccessToken}
              onTriggerLogin={triggerGoogleSignupPopup}
              triggerNotification={triggerNotification}
            />
          </div>
        )}

        {/* Tab 3: Verification Panel */}
        {activeTab === 'verification' && (
          <div className="max-w-3xl mx-auto">
            <VerificationCenter
              currentVerification={currentUser.verification}
              onUpdateVerification={(updated) => {
                const refreshed = { ...currentUser, verification: { ...currentUser.verification, ...updated } };
                setCurrentUser(refreshed);
                saveToLocalStorage(refreshed, bookings, providers, categories);
              }}
              userType={currentUser.role === 'customer' ? 'customer' : 'provider'}
            />
          </div>
        )}

        {/* Tab 4: Local Storage Backup */}
        {activeTab === 'export' && (
          <div className="max-w-2xl mx-auto">
            <ExportCenter
              currentUser={currentUser}
              userBookings={bookings}
              messagesList={messages}
              reviewsList={providers.flatMap(p => p.reviews)}
            />
          </div>
        )}

        {/* Tab 5: Dynamic Profile Settings Management Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto">
            <MyProfileSettings
              currentUser={currentUser}
              myListing={currentUser.role === 'provider' ? providers.find(p => p.id === currentUser.id) : undefined}
              onUpdateCurrentUser={handleUpdateCurrentUser}
              onUpdateProviderListing={handleUpdateProviderListing}
              triggerNotification={triggerNotification}
            />
          </div>
        )}

      </main>

      {/* Slide-over Profile Details / Booking checkout overlay */}
      {showBookingModal && selectedProvider && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
          <div className="max-w-xl w-full">
            <BookingCalendar
              currentUser={currentUser}
              provider={selectedProvider}
              onConfirmBooking={(b) => {
                handleConfirmNewBooking(b);
                setShowBookingModal(false);
              }}
              onClose={() => setShowBookingModal(false)}
              onStartChat={() => {
                setChattingWithProvider(selectedProvider);
                setShowBookingModal(false);
                setActiveTab('dashboard');
                triggerNotification(`Direct secure link with ${selectedProvider.name} launched!`);
              }}
            />
          </div>
        </div>
      )}

      {/* Footer bar branding */}
      <footer className="footer bg-[#100e0c] border-t border-outline-variant py-6 mt-12 text-center text-xs text-[#9e8e80] font-mono relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Sugar Daddy Marketplace Inc. All global PII data credentials remain anonymous. Encryption level: AES-255-TLS-GCM v1.08.</p>
        </div>
      </footer>

      {/* Persistent global city skyline backdrop layer */}
      <CitySkyline city={userCity} />

    </div>
  );
}
