import React, { useState } from 'react';
import { Category, ServiceProvider, UserState } from '../types';
import { ShieldCheck, CreditCard, User, Sparkles, Building, CheckCircle, RefreshCcw, Camera } from 'lucide-react';

interface OnboardingWizardProps {
  currentUser: UserState;
  categories: Category[];
  onCompleteOnboarding: (updatedUser: UserState, newProvider?: ServiceProvider) => void;
}

const LUXE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200'
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  currentUser,
  categories,
  onCompleteOnboarding,
}) => {
  const isProvider = currentUser.role === 'provider';
  
  // Current step state
  // Step 1: Sub / Pay, Step 2: Details / Avatar setup
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Payment Form States
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState(currentUser.name || '');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [selectedClientTier, setSelectedClientTier] = useState<'free' | 'paid'>('free');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Profile Form States
  const [profileTitle, setProfileTitle] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileLocation, setProfileLocation] = useState('New York, NY');
  const [profilePrice, setProfilePrice] = useState<number>(150);
  const [profilePriceUnit, setProfilePriceUnit] = useState<string>('hour');
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState(LUXE_AVATARS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [profileError, setProfileError] = useState<string | null>(null);

  // Handle Client Tier continue
  const handleClientStep1Continue = () => {
    if (selectedClientTier === 'free') {
      // Free client goes straight to step 3 (profile setup)
      setCurrentStep(3);
    } else {
      // Premium client goes to step 2 (payment checkout)
      setCurrentStep(2);
    }
  };

  // Process Simulated Payment
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);
    
    if (selectedClientTier === 'paid' || isProvider) {
      if (!cardNumber || !expiry || !cvv || !cardName) {
        setPaymentError('Please fill out all billing information.');
        return;
      }
      if (cardNumber.replace(/\s+/g, '').length < 13) {
        setPaymentError('Kindly enter a valid credit card credentials sequence.');
        return;
      }
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // If it's a provider, they move to Step 2 (provider details)
      // If it's a premium client, payment completed, move to Step 3 (profile details)
      if (isProvider) {
        setCurrentStep(2);
      } else {
        setCurrentStep(3);
      }
    }, 1500);
  };

  // Toggle category select
  const handleCategoryToggle = (name: string) => {
    if (selectedCats.includes(name)) {
      setSelectedCats(selectedCats.filter(c => c !== name));
    } else {
      setSelectedCats([...selectedCats, name]);
    }
  };

  // Submit Profile & complete onboarding
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);

    if (isProvider) {
      if (!profileTitle.trim()) {
        setProfileError('Please specify your professional elite title.');
        return;
      }
      if (profileBio.trim().length < 25) {
        setProfileError('Kindly compose a brief bio with at least 25 characters to describe your services.');
        return;
      }
      if (selectedCats.length === 0) {
        setProfileError('Please choose at least 1 specialty category.');
        return;
      }

      // Create updated user with provider values
      const updatedUser: UserState = {
        ...currentUser,
        name: cardName || currentUser.name,
        avatarUrl: customAvatarUrl || selectedAvatar,
        providerSubscriptionActive: true,
        hasCompletedProviderProfile: true, // Mark boarding finish
        providerSubscriptionPaidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };

      // Create new ServiceProvider record
      const newProvider: ServiceProvider = {
        id: currentUser.id,
        name: cardName || currentUser.name,
        title: profileTitle,
        bio: profileBio,
        rating: 5.0,
        reviewsCount: 0,
        completionRate: 100,
        responseTime: '12 mins',
        repeatCustomerRate: 100,
        categories: selectedCats,
        pricePerEvent: profilePrice || 150,
        priceUnit: profilePriceUnit,
        distanceMiles: 1.5,
        locationName: profileLocation || 'Manhattan, New York',
        isFeatured: false,
        avatarUrl: customAvatarUrl || selectedAvatar,
        verification: {
          governmentId: 'verified',
          selfie: 'verified',
          phone: 'verified',
          email: 'verified',
          professionalCredential: 'pending'
        },
        reviews: [],
        verifiedBadge: true,
        availabilityCalendar: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        privatePhone: '+1 (555) 720-0909',
        privateEmail: `${updatedUser.name.toLowerCase().replace(/\s+/g, '')}@luxeelevate.net`
      };

      onCompleteOnboarding(updatedUser, newProvider);
    } else {
      // Client completing profile
      const isPaid = selectedClientTier === 'paid';
      
      const updatedUser: UserState = {
        ...currentUser,
        name: cardName || currentUser.name,
        avatarUrl: customAvatarUrl || selectedAvatar,
        isClientPremium: isPaid,
        hasCompletedClientProfile: true, // Mark client boarding complete
        walletBalance: 0, // starting funds are depleted/empty
      };

      onCompleteOnboarding(updatedUser);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10 bg-[radial-gradient(#d6c3b4_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="max-w-2xl w-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative z-10">
        
        {/* Upper Brand strip */}
        <div className="bg-gradient-to-r from-amber-500/20 via-zinc-900 to-amber-500/10 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <span className="text-white font-mono text-xs uppercase font-extrabold tracking-widest">
              Luxe Platform Integration Boarding
            </span>
          </div>
          <span className="text-[10px] font-mono text-amber-500 font-bold uppercase p-1 rounded bg-amber-500/10 border border-amber-500/20">
            {isProvider ? 'PROVIDER ACCESS' : 'CLIENT PORTAL'}
          </span>
        </div>

        {/* Wizard Progress Bar */}
        <div className="bg-zinc-950 px-6 py-2.5 border-b border-zinc-850 flex items-center justify-between text-[11px] font-mono text-[#9e8e80]">
          <span>Onboarding Progress:</span>
          <div className="flex gap-2">
            <span className={`px-2 py-0.5 rounded ${currentStep >= 1 ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30' : 'bg-zinc-900'}`}>
              Stage 1
            </span>
            <span className={`px-2 py-0.5 rounded ${currentStep >= 2 ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30' : 'bg-zinc-900'}`}>
              Stage 2
            </span>
            {!isProvider && (
              <span className={`px-2 py-0.5 rounded ${currentStep >= 3 ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30' : 'bg-zinc-900'}`}>
                Stage 3
              </span>
            )}
          </div>
        </div>

        {/* ========================================= */}
        {/* PROVIDER STAGE 1: PAY LICENSE FEE         */}
        {/* ========================================= */}
        {isProvider && currentStep === 1 && (
          <div className="p-6 space-y-6">
            <div className="text-left space-y-1.5">
              <h2 className="text-lg font-bold text-white tracking-tight uppercase font-serif">Activate Professional Service License</h2>
              <p className="text-xs text-neutral-400">
                To create listings and support e2e secure chat rooms, we charge a security maintenance flat fee of <strong className="text-amber-400">$25/month</strong>.
              </p>
            </div>

            <div className="bg-[#151311] border border-amber-500/20 p-4 rounded-xl flex items-start gap-3 text-xs text-[#d6c3b4]">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1 text-left">
                <p className="font-bold text-white uppercase font-mono tracking-tight text-[11px]">Listing Partner License Privileges</p>
                <p>✓ Placement inside active luxury discovery feeds (up to 8 specialties)</p>
                <p>✓ Unlimited End-to-End Encrypted messaging logs with verified VIP clients</p>
                <p>✓ Connect calendars, manage client questionnaires, and run escrow transactions</p>
                <p>✓ Complete switch-access to the Client-side portal anytime</p>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              {paymentError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded text-left">
                  ✕ {paymentError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-neutral-400 uppercase font-semibold">Cardholder Full Name</label>
                  <input 
                    type="text" 
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="e.g. Alessandra Duval"
                    className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-neutral-400 uppercase font-semibold">Credit Card Credentials</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4000 1234 5678 9010"
                      className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white focus:outline-none focus:border-amber-500 pl-8 font-mono"
                      maxLength={19}
                      required
                    />
                    <CreditCard className="w-4 h-4 text-neutral-600 absolute left-2.5 top-3.5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-neutral-400 uppercase font-semibold">Expiry Date</label>
                  <input 
                    type="text" 
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    maxLength={5}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-neutral-400 uppercase font-semibold">CVV Sec Code</label>
                  <input 
                    type="password" 
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="•••"
                    className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl text-xs uppercase tracking-wider font-mono transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-4"
              >
                {isProcessing ? (
                  <>
                    <RefreshCcw className="w-4 h-4 animate-spin" />
                    <span>Processing Secure Gateway Payment...</span>
                  </>
                ) : (
                  <span>Authorize &amp; Purchase Membership ($25/mo)</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ========================================= */}
        {/* PROVIDER STAGE 2: DETAILS SETUP          */}
        {/* ========================================= */}
        {isProvider && currentStep === 2 && (
          <div className="p-6 space-y-6 max-h-[550px] overflow-y-auto">
            <div className="text-left space-y-1.5">
              <h2 className="text-lg font-bold text-white tracking-tight uppercase font-serif">Compose Professional Showcase Profile</h2>
              <p className="text-xs text-neutral-400">
                Setup your active profile card detail so Elite Clients can recognize and solicit your expertise immediately.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4 text-left">
              {profileError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded">
                  ✕ {profileError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-neutral-400 uppercase font-semibold">Professional Headline / Specialty</label>
                <input 
                  type="text" 
                  value={profileTitle}
                  onChange={(e) => setProfileTitle(e.target.value)}
                  placeholder="e.g. Luxury Concierge &amp; Private Yacht Crew"
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-mono text-neutral-400 uppercase font-semibold block">Select Specialization Tracks</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => {
                    const isSelected = selectedCats.includes(cat.name);
                    return (
                      <div 
                        key={cat.id}
                        onClick={() => handleCategoryToggle(cat.name)}
                        className={`p-2 border rounded-lg cursor-pointer transition-colors text-xs flex items-center justify-between ${
                          isSelected ? 'bg-amber-500/15 border-amber-500 text-white' : 'border-zinc-800 text-neutral-400 bg-zinc-950 hover:border-zinc-700'
                        }`}
                      >
                        <span>{cat.name}</span>
                        {isSelected && <CheckCircle className="w-3.5 h-3.5 text-amber-500" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-neutral-400 uppercase font-semibold">Detailed Service Overview Bio</label>
                <textarea 
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  placeholder="Describe your credentials, lifestyle style, speaking languages, and what high quality assistance you bring to private bookings."
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-neutral-400 uppercase font-semibold">Baseline Rate Amount ($)</label>
                  <input 
                    type="number" 
                    value={profilePrice}
                    onChange={(e) => setProfilePrice(Number(e.target.value))}
                    placeholder="150"
                    className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    min={50}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-neutral-400 uppercase font-semibold">Rate Unit Type</label>
                  <select 
                    value={profilePriceUnit}
                    onChange={(e) => setProfilePriceUnit(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
                  >
                    <option value="hour">Per Hour</option>
                    <option value="day">Per Day</option>
                    <option value="event">Per Escrow Event</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-neutral-400 uppercase font-semibold">Hub Core Location</label>
                <input 
                  type="text" 
                  value={profileLocation}
                  onChange={(e) => setProfileLocation(e.target.value)}
                  placeholder="e.g. SUTTON PLACE, NEW YORK"
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-[11px] font-mono text-neutral-400 uppercase font-semibold block">Profile Photo (Visual Showcase)</label>
                <div className="flex justify-center mb-3">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-500/80 relative bg-zinc-950">
                    <img 
                      src={selectedAvatar || customAvatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                      alt="Selected Profile Showcase avatar" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>

                <div className="mt-2 p-3 border border-dashed border-zinc-800 rounded bg-zinc-950/50 text-center relative group hover:border-amber-500/50 transition-all cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          const base64 = evt.target?.result as string;
                          setSelectedAvatar(base64);
                          setCustomAvatarUrl(base64);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-x-0 inset-y-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <Camera className="w-5 h-5 text-neutral-400 group-hover:text-amber-500 transition-colors" />
                    <span className="text-[11px] font-mono text-neutral-300 font-bold uppercase tracking-wider">Upload Custom Photo 📁</span>
                    <span className="text-[9px] text-zinc-500">Supports JPG, PNG, WEBP files</span>
                  </div>
                </div>

                <div className="space-y-1 mt-2">
                  <label className="text-[10px] font-mono text-neutral-400 block font-semibold">Or enter custom Image Link URL:</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={customAvatarUrl.startsWith('data:') ? 'Local Upload Image Locked 🔒' : customAvatarUrl}
                      disabled={customAvatarUrl.startsWith('data:')}
                      onChange={(e) => {
                        setCustomAvatarUrl(e.target.value);
                        setSelectedAvatar(e.target.value);
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-[11px] text-white focus:outline-none focus:border-amber-500 font-mono disabled:opacity-55"
                    />
                    <Camera className="w-3.5 h-3.5 text-neutral-600 absolute right-2 top-2.5" />
                  </div>
                  {customAvatarUrl.startsWith('data:') && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomAvatarUrl('');
                        setSelectedAvatar('');
                      }}
                      className="text-[9px] text-rose-450 underline font-mono cursor-pointer mt-0.5 block hover:text-rose-400"
                    >
                      Clear uploaded photograph
                    </button>
                  )}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-650 hover:to-amber-500 text-zinc-950 font-extrabold rounded-xl text-xs uppercase tracking-wider font-mono transition-transform hover:scale-[1.01] active:scale-[0.99] mt-3 flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Launch Elite Professional Listing!</span>
              </button>
            </form>
          </div>
        )}

        {/* ========================================= */}
        {/* CLIENT STAGE 1: TIER OPTION SELECTION     */}
        {/* ========================================= */}
        {!isProvider && currentStep === 1 && (
          <div className="p-6 space-y-6">
            <div className="text-left space-y-1.5">
              <h2 className="text-lg font-bold text-white tracking-tight uppercase font-serif">Identify Your Luxe Portal Status</h2>
              <p className="text-xs text-neutral-400">
                Choose a portal membership status. Select premium benefits or standard client directory browsing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option A: Free */}
              <div 
                onClick={() => setSelectedClientTier('free')}
                className={`p-5 rounded-xl border cursor-pointer transition-all text-left flex flex-col justify-between space-y-4 ${
                  selectedClientTier === 'free' ? 'bg-zinc-900 border-neutral-600 text-white ring-2 ring-neutral-700/50' : 'bg-[#151311] border-zinc-800 text-neutral-400 hover:border-zinc-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] uppercase font-bold tracking-widest bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                      Standard Client
                    </span>
                    <span className="text-xs font-bold text-neutral-400">FREE</span>
                  </div>
                  <h3 className="text-sm font-bold text-white font-mono">Free Lifetime Directory Profile</h3>
                  <div className="space-y-1 text-xs text-neutral-400">
                    <p>• Daily messaging limit of 3 secure exchanges</p>
                    <p>• Standard directory browsing &amp; booking filters</p>
                    <p className="line-through opacity-40">• Switch &amp; create service profiles</p>
                    <p className="line-through opacity-40">• Review premium professionals</p>
                  </div>
                </div>
                <div className="pt-2">
                  <div className={`w-full py-1.5 text-center text-[10px] font-mono font-bold rounded ${selectedClientTier === 'free' ? 'bg-neutral-800 text-white' : 'bg-transparent text-neutral-500 border border-zinc-800'}`}>
                    {selectedClientTier === 'free' ? '✓ SELECTED TIER' : 'CHOOSE FREE STATUS'}
                  </div>
                </div>
              </div>

              {/* Option B: Premium */}
              <div 
                onClick={() => setSelectedClientTier('paid')}
                className={`p-5 rounded-xl border cursor-pointer transition-all text-left flex flex-col justify-between space-y-4 relative overflow-hidden ${
                  selectedClientTier === 'paid' ? 'bg-[#1a1715] border-amber-500 text-white ring-2 ring-amber-500/20' : 'bg-[#151311] border-zinc-800 text-[#9e8e80] hover:border-zinc-750'
                }`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] uppercase font-bold tracking-widest bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded">
                      Paid Elite Member
                    </span>
                    <span className="text-xs font-bold text-amber-500 font-mono">$25/MO</span>
                  </div>
                  <h3 className="text-sm font-bold text-white font-mono">Premium VIP Client Membership</h3>
                  <div className="space-y-1 text-xs text-[#d6c3b4]">
                    <p>✓ Limit raised to 20 secured daily message exchanges</p>
                    <p>✓ Full switch access to build/list a professional provider profile</p>
                    <p>✓ Unlocked unredacted coordinates &amp; phone details and write reviews</p>
                  </div>
                </div>
                <div className="pt-2">
                  <div className={`w-full py-1.5 text-center text-[10px] font-mono font-bold rounded ${selectedClientTier === 'paid' ? 'bg-amber-500 text-zinc-950 font-bold' : 'bg-transparent text-amber-600 border border-amber-500/10'}`}>
                    {selectedClientTier === 'paid' ? '✓ SELECTED PREMIUM TIER' : 'UPGRADE TO ELITE TIER'}
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleClientStep1Continue}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl text-xs uppercase tracking-wider font-mono transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1 mt-4"
            >
              <span>Commit Option &amp; Continue</span>
            </button>
          </div>
        )}

        {/* ========================================= */}
        {/* CLIENT STAGE 2: PREMIUM CHECKOUT PAY      */}
        {/* ========================================= */}
        {!isProvider && currentStep === 2 && (
          <div className="p-6 space-y-6">
            <div className="text-left space-y-1.5">
              <h2 className="text-lg font-bold text-white tracking-tight uppercase font-serif">Process Premium Account Checkout</h2>
              <p className="text-xs text-neutral-400">
                You have selected VIP Premium Membership. Authorize the <strong className="text-amber-400">$25/month</strong> membership fee inside our payment gateway.
              </p>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              {paymentError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded text-left">
                  ✕ {paymentError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-neutral-400 uppercase font-semibold">Billing Holder Name</label>
                  <input 
                    type="text" 
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="e.g. Marcus Sterling"
                    className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-neutral-400 uppercase font-semibold">Credit Card Number</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4000 5512 8890 1022"
                      className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white focus:outline-none focus:border-amber-500 pl-8 font-mono"
                      maxLength={19}
                      required
                    />
                    <CreditCard className="w-4 h-4 text-neutral-600 absolute left-2.5 top-3.5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-neutral-400 uppercase font-semibold">Expiration Info (MM/YY)</label>
                  <input 
                    type="text" 
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    maxLength={5}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-neutral-400 uppercase font-semibold">CVV Secure code</label>
                  <input 
                    type="password" 
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="•••"
                    className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl text-xs uppercase tracking-wider font-mono transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-4"
              >
                {isProcessing ? (
                  <>
                    <RefreshCcw className="w-4 h-4 animate-spin" />
                    <span>Processing Secure Gateway Checkout...</span>
                  </>
                ) : (
                  <span>Authorize &amp; Complete Checkout ($25/MO)</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ========================================= */}
        {/* CLIENT STAGE 3: DETAILS SETUP            */}
        {/* ========================================= */}
        {!isProvider && currentStep === 3 && (
          <div className="p-6 space-y-6">
            <div className="text-left space-y-1.5">
              <h2 className="text-lg font-bold text-white tracking-tight uppercase font-serif">Personalize Your Client Identity</h2>
              <p className="text-xs text-neutral-400">
                Setup your display name and preferred avatar visual settings to initialize your secure dashboard session.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4 text-left">
              {profileError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded">
                  ✕ {profileError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-neutral-400 uppercase font-semibold">Your Display Name</label>
                <input 
                  type="text" 
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="e.g. Marcus Sterling"
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-[11px] font-mono text-neutral-400 uppercase font-semibold block">Profile Photo (Visual Showcase)</label>
                <div className="flex justify-center mb-3">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-500/80 relative bg-zinc-950">
                    <img 
                      src={selectedAvatar || customAvatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                      alt="Selected Profile Showcase avatar" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>

                <div className="mt-2 p-3 border border-dashed border-zinc-800 rounded bg-zinc-950/50 text-center relative group hover:border-amber-500/50 transition-all cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          const base64 = evt.target?.result as string;
                          setSelectedAvatar(base64);
                          setCustomAvatarUrl(base64);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-x-0 inset-y-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <Camera className="w-5 h-5 text-neutral-400 group-hover:text-amber-500 transition-colors" />
                    <span className="text-[11px] font-mono text-neutral-300 font-bold uppercase tracking-wider">Upload Custom Photo 📁</span>
                    <span className="text-[9px] text-zinc-500">Supports JPG, PNG, WEBP files</span>
                  </div>
                </div>

                <div className="space-y-1 mt-2">
                  <label className="text-[10px] font-mono text-neutral-400 block font-semibold">Or enter custom Image Link URL:</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={customAvatarUrl.startsWith('data:') ? 'Local Upload Image Locked 🔒' : customAvatarUrl}
                      disabled={customAvatarUrl.startsWith('data:')}
                      onChange={(e) => {
                        setCustomAvatarUrl(e.target.value);
                        setSelectedAvatar(e.target.value);
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-[11px] text-white focus:outline-none focus:border-amber-500 font-mono disabled:opacity-55"
                    />
                    <Camera className="w-3.5 h-3.5 text-neutral-600 absolute right-2 top-2.5" />
                  </div>
                  {customAvatarUrl.startsWith('data:') && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomAvatarUrl('');
                        setSelectedAvatar('');
                      }}
                      className="text-[9px] text-rose-450 underline font-mono cursor-pointer mt-0.5 block hover:text-rose-400"
                    >
                      Clear uploaded photograph
                    </button>
                  )}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-650 hover:to-amber-500 text-zinc-950 font-extrabold rounded-xl text-xs uppercase tracking-wider font-mono transition-transform hover:scale-[1.01] active:scale-[0.99] mt-3 flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Initialize Secured Client Account!</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
export default OnboardingWizard;
