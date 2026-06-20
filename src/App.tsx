import { useState, useEffect } from 'react';
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
  Compass as Globe
} from 'lucide-react';

export default function App() {
  // Core application States
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [providers, setProviders] = useState<ServiceProvider[]>(INITIAL_PROVIDERS);
  
  // Current user initial setup
  const [currentUser, setCurrentUser] = useState<UserState>({
    id: 'cust_99',
    name: 'Marcus Sterling',
    email: 'robs46859@gmail.com',
    role: 'customer',
    walletBalance: 1500,
    savedProviderIds: ['prov_1'],
    verification: {
      governmentId: 'verified',
      selfie: 'verified',
      phone: 'verified',
      email: 'verified',
    },
    blockedUserIds: []
  });

  const [activeTab, setActiveTab] = useState<'browse' | 'dashboard' | 'admin' | 'verification' | 'export'>('browse');
  const [userCity, setUserCity] = useState<'New York' | 'Los Angeles' | 'Miami' | 'London' | 'Paris'>('New York');
  
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

  // Initial Bookings load (one mock booking for visual interest)
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'book_pre_1',
      providerId: 'prov_1',
      providerName: 'Alessandra Duval',
      providerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      customerId: 'cust_99',
      customerName: 'Marcus Sterling',
      date: 'Friday, June 26, 2026',
      timeSlot: '07:00 PM',
      status: 'active_escrow',
      totalAmount: 385,
      categoryName: 'Lifestyle Coaching',
      createdAt: '2026-06-18',
    }
  ]);

  // Messages database list
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_pre_1',
      chatId: 'prov_1_cust_99',
      senderId: 'prov_1',
      senderName: 'Alessandra Duval',
      text: 'Good afternoon Marcus, looking forward to facilitating your guests this weekend. All preparation details are safely locked on my end.',
      timestamp: '01:14 PM',
      encrypted: true,
      read: true
    }
  ]);

  // Sync state with localstorage & auto-detect closest city
  useEffect(() => {
    const cachedUsers = localStorage.getItem('sugardaddy_user');
    const cachedBookings = localStorage.getItem('sugardaddy_bookings');
    const cachedProviders = localStorage.getItem('sugardaddy_providers');
    const cachedCategories = localStorage.getItem('sugardaddy_categories');
    const cachedCity = localStorage.getItem('sugardaddy_city');
    
    if (cachedUsers) setCurrentUser(JSON.parse(cachedUsers));
    if (cachedBookings) setBookings(JSON.parse(cachedBookings));
    if (cachedProviders) setProviders(JSON.parse(cachedProviders));
    if (cachedCategories) setCategories(JSON.parse(cachedCategories));
    
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
    localStorage.setItem('sugardaddy_user', JSON.stringify(user));
    localStorage.setItem('sugardaddy_bookings', JSON.stringify(bList));
    localStorage.setItem('sugardaddy_providers', JSON.stringify(pList));
    localStorage.setItem('sugardaddy_categories', JSON.stringify(cList));
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
    const updatedUser = { ...currentUser, walletBalance: currentUser.walletBalance - newBooking.totalAmount };
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

  // Support booking updates (such as questionnaire answering or client individual scoring revisions)
  const handleUpdateBooking = (updatedBooking: Booking) => {
    const updatedBookings = bookings.map(b => b.id === updatedBooking.id ? updatedBooking : b);
    setBookings(updatedBookings);
    saveToLocalStorage(currentUser, updatedBookings, providers, categories);
  };

  // Customer: Release funds to provider wallet
  const handleReleaseEscrowFunds = (bookingId: string) => {
    const updatedBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'completed' } as Booking;
      }
      return b;
    });
    setBookings(updatedBookings);
    saveToLocalStorage(currentUser, updatedBookings, providers, categories);
    triggerNotification('Escrow cleared: Funds released to Service Provider.');
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
    const updated = [...messages, msg];
    setMessages(updated);
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
  const myListingProfile = providers.find(p => p.id === 'provider_custom');

  return (
    <div className="min-h-screen bg-background freckled-bg text-on-background flex flex-col font-sans selection:bg-primary selection:text-on-primary">
      
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
            <Globe className="w-6 h-6 text-primary shrink-0" />
            <span className="text-sm font-extrabold tracking-widest uppercase text-white font-serif flex items-center gap-1.5">
              <span>SUGAR DADDY</span>
              <span className="text-[10px] bg-primary/10 border border-primary/25 text-primary px-2 py-0.2 rounded font-bold font-mono">P2P MARKETPLACE</span>
            </span>
          </div>

          {/* Center Swapper Roles selector (The gold premium control!) */}
          <div className="flex items-center bg-surface p-1 rounded-xl border border-outline-variant">
            <button 
              onClick={() => {
                const updated = { ...currentUser, role: 'customer' as Role };
                setCurrentUser(updated);
                saveToLocalStorage(updated, bookings, providers, categories);
                triggerNotification('Switched to Client Dashboard');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all font-mono uppercase ${
                currentUser.role === 'customer' 
                  ? 'bg-primary text-on-primary shadow-md shadow-primary/10' 
                  : 'text-[#d6c3b4] hover:text-white'
              }`}
            >
              Client (Buyer)
            </button>
            <button 
              onClick={() => {
                const updated = { ...currentUser, role: 'provider' as Role };
                setCurrentUser(updated);
                saveToLocalStorage(updated, bookings, providers, categories);
                triggerNotification('Switched to Provider Dashboard');
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all font-mono uppercase ${
                currentUser.role === 'provider' 
                  ? 'bg-primary text-on-primary shadow-md shadow-primary/10' 
                  : 'text-[#d6c3b4] hover:text-white'
              }`}
            >
              Provider (Creator)
            </button>
            <button 
              onClick={() => {
                const updated = { ...currentUser, role: 'admin' as Role };
                setCurrentUser(updated);
                saveToLocalStorage(updated, bookings, providers, categories);
                triggerNotification('Switched to System Administration Panel');
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all font-mono uppercase ${
                currentUser.role === 'admin' 
                  ? 'bg-primary text-on-primary shadow-md shadow-primary/10' 
                  : 'text-[#d6c3b4] hover:text-white'
              }`}
            >
              Platform Admin
            </button>
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
              </select>
            </div>

            <div 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 bg-surface border border-outline-variant px-3 py-1.5 rounded-xl cursor-pointer hover:border-outline transition-colors"
            >
              <Users className="w-4 h-4 text-primary" />
              <div>
                <span className="text-[10px] text-on-surface-variant block uppercase font-mono tracking-wider font-bold">Luxe Portfolio</span>
                <span className="text-xs font-bold text-primary font-mono">${currentUser.walletBalance}</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Primary Workspace Sections */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Navigation Tab selection list */}
        <div className="flex items-center gap-4 border-b border-outline-variant pb-2">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 text-xs uppercase font-extrabold tracking-widest font-mono transition-all ${
              activeTab === 'browse' ? 'text-primary border-b-2 border-primary' : 'text-[#d6c3b4] hover:text-white'
            }`}
          >
            ✈ Discover Services
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 text-xs uppercase font-extrabold tracking-widest font-mono transition-all ${
              activeTab === 'dashboard' ? 'text-primary border-b-2 border-primary' : 'text-[#d6c3b4] hover:text-white'
            }`}
          >
            📋 {currentUser.role === 'customer' ? 'Client Workspace' : currentUser.role === 'provider' ? 'Provider Dashboard' : 'Disputes Board'}
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-2 text-xs uppercase font-extrabold tracking-widest font-mono transition-all ${
              activeTab === 'verification' ? 'text-primary border-b-2 border-primary' : 'text-[#d6c3b4] hover:text-white'
            }`}
          >
            🛡️ Verification Center
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 text-xs uppercase font-extrabold tracking-widest font-mono transition-all ${
              activeTab === 'export' ? 'text-primary border-b-2 border-primary' : 'text-[#d6c3b4] hover:text-white'
            }`}
          >
            💾 Backup Logs
          </button>
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
                  <div 
                    onClick={() => setChattingWithProvider(providers[0])}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      chattingWithProvider?.id === providers[0].id
                        ? 'bg-primary/5 border-primary/40'
                        : 'border-outline-variant hover:border-outline bg-[#100e0c]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={providers[0].avatarUrl} alt={providers[0].name} className="w-8 h-8 rounded-full object-cover border border-outline-variant" />
                      <div>
                        <h4 className="text-white font-bold text-xs">{providers[0].name}</h4>
                        <p className="text-[10px] text-neutral-400 font-mono tracking-tight truncate max-w-[120px]">Good afternoon Marcus...</p>
                      </div>
                    </div>
                    <span className="text-[9px] text-[#9e8e80] font-mono">1:14 PM</span>
                  </div>

                  {providers[1] && (
                    <div 
                      onClick={() => setChattingWithProvider(providers[1])}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        chattingWithProvider?.id === providers[1].id
                          ? 'bg-primary/5 border-primary/40'
                          : 'border-outline-variant hover:border-outline bg-[#100e0c]/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={providers[1].avatarUrl} alt={providers[1].name} className="w-8 h-8 rounded-full object-cover border border-outline-variant" />
                        <div>
                          <h4 className="text-white font-bold text-xs">{providers[1].name}</h4>
                          <p className="text-[10px] text-neutral-400 font-mono tracking-tight truncate max-w-[120px]">Let&apos;s finalize the...</p>
                        </div>
                      </div>
                      <span className="text-[9px] text-[#9e8e80] font-mono">Yesterday</span>
                    </div>
                  )}

                </div>
              </div>

              {/* Chat section viewport if target exists */}
              {chattingWithProvider && (
                <ChatSection
                  currentUser={currentUser}
                  provider={chattingWithProvider}
                  onSendMessage={handleSendInstantMessage}
                  chatMessages={messages.filter(m => m.chatId === `${chattingWithProvider.id}_${currentUser.id}` || m.chatId === `prov_1_cust_99` /* mock hack */)}
                  onBlockUser={handleBlockToggleUser}
                  isUserBlocked={currentUser.blockedUserIds.includes(chattingWithProvider.id)}
                />
              )}

            </div>

            {/* right Dashboard operations Column */}
            <div className="lg:col-span-2">
              {currentUser.role === 'customer' ? (
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
                />
              ) : currentUser.role === 'provider' ? (
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
