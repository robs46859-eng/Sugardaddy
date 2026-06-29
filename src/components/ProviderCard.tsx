import React, { useState } from 'react';
import { ServiceProvider } from '../types';
import { Star, MapPin, CheckCircle2, ShieldAlert, Heart, MessageSquare, ChevronRight, ChevronLeft, X, Film, Image as ImageIcon } from 'lucide-react';

import { UserState } from '../types';

interface ProviderCardProps {
  provider: ServiceProvider;
  isSaved: boolean;
  onToggleSave: () => void;
  onSelectBook: () => void;
  onStartChat: () => void;
  currentUser?: UserState;
  onUnlockContact?: (providerId: string) => void;
  onUpgradePremium?: () => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  isSaved,
  onToggleSave,
  onSelectBook,
  onStartChat,
  currentUser,
  onUnlockContact,
  onUpgradePremium,
}) => {
  // Check validation status count
  const verifiedCount = Object.values(provider.verification).filter(v => v === 'verified').length;
  const isFullyVerified = verifiedCount >= 4;

  // Media Modal controllers
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaTab, setMediaTab] = useState<'photos' | 'videos'>('photos');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Preselected stock assets if custom arrays are empty
  const defaultImages = provider.id === 'prov_1' ? [
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=600',
  ] : [
    'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600',
  ];

  const defaultVideos = provider.id === 'prov_1' ? [
    'https://assets.mixkit.co/videos/preview/mixkit-yacht-floating-in-the-sea-41235-large.mp4',
  ] : [
    'https://assets.mixkit.co/videos/preview/mixkit-waves-crashing-on-golden-sand-41618-large.mp4',
  ];

  const portfolioImages = provider.images && provider.images.length > 0 ? provider.images : defaultImages;
  const portfolioVideos = provider.videos && provider.videos.length > 0 ? provider.videos : defaultVideos;

  const totalImages = portfolioImages.length;
  const totalVideos = portfolioVideos.length;

  const handleNextPhoto = () => {
    setActivePhotoIdx(prev => (prev + 1) % totalImages);
  };

  const handlePrevPhoto = () => {
    setActivePhotoIdx(prev => (prev - 1 + totalImages) % totalImages);
  };

  return (
    <div className="relative group overflow-hidden rounded-xl bg-surface border border-outline-variant hover:border-primary/40 transition-all duration-300 shadow-xl flex flex-col h-full hover:shadow-[0_0_20px_rgba(253,186,116,0.12)]">
      
      {/* Background Subtle Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10 pointer-events-none" />
      
      {/* Prime Glow Badge */}
      {provider.isFeatured && (
        <span className="absolute top-3 left-3 z-20 bg-[#ffdebf] text-[#492900] text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded shadow-[0_0_12px_rgba(255,222,191,0.25)] font-mono">
          Featured Luxe
        </span>
      )}

      {/* Save Button */}
      <button 
        onClick={onToggleSave}
        className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 hover:bg-black/95 text-neutral-200 transition-colors border border-outline-variant active:scale-90"
        aria-label="Save Provider"
      >
        <Heart className={`w-4 h-4 transition-colors ${isSaved ? 'text-rose-500 fill-rose-500' : 'text-neutral-400 hover:text-white'}`} />
      </button>

      {/* Header Info Area */}
      <div className="relative h-44 overflow-hidden bg-[#100e0c]">
        <img
          src={provider.avatarUrl}
          alt={provider.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Bottom Tag overlay - Warm Accent */}
        <div className="absolute bottom-3 left-4 right-4 z-20 flex flex-wrap gap-1.5">
          {provider.categories.map((cat, idx) => (
            <span key={idx} className="bg-[#ffdebf]/10 border border-[#ffdebf]/20 text-[#ffdebf] text-[10px] font-medium px-2 py-0.5 rounded font-mono uppercase tracking-wider backdrop-blur-md">
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 flex flex-col flex-grow z-20 relative bg-[#211f1d]/95">
        
        {/* Name & Verification Badge */}
        <div className="flex items-start justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <h3 className="text-white font-serif font-bold text-lg tracking-tight group-hover:text-[#ffdebf] transition-colors">
              {provider.name}
            </h3>
            {isFullyVerified ? (
              <CheckCircle2 className="w-5 h-5 text-primary fill-[#1d1b19]" title="All Verifications Cleared" />
            ) : verifiedCount > 2 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-[#1d1b19]" title="Partially Verified" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-neutral-500" title="Verification Pending" />
            )}
          </div>
          <div className="flex items-center gap-1 text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/15 text-xs font-bold font-mono">
            <Star className="w-3.5 h-3.5 fill-primary text-primary" />
            <span>{provider.rating.toFixed(2)}</span>
          </div>
        </div>

        {/* Professional Title */}
        <p className="text-[#d6c3b4] font-medium text-xs tracking-wider uppercase mb-1.5 font-mono">
          {provider.title}
        </p>

        {/* Passed Interview Badges */}
        {provider.passedQuizzes && provider.passedQuizzes.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            <span className="text-[9px] font-mono font-semibold bg-emerald-950/45 text-emerald-400 border border-emerald-500/20 rounded-md px-1.5 py-0.5 uppercase tracking-wider flex items-center gap-0.5" title="Mandatory interviews completed successfully">
              <span>✓</span> {provider.passedQuizzes.length} Assessment{provider.passedQuizzes.length > 1 ? 's' : ''} Cleared
            </span>
          </div>
        )}

        {/* Biography excerpt */}
        <p className="text-neutral-300 text-sm line-clamp-2 mb-3 leading-relaxed flex-grow">
          {provider.bio}
        </p>

        {/* Media Showcase Selector Trigger Button */}
        <div className="mb-4">
          <button
            onClick={() => setShowMediaModal(true)}
            className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#100e0c]/60 border border-outline-variant hover:border-primary/45 transition-all font-mono text-[10px] text-neutral-300 hover:text-white uppercase tracking-wider group/media cursor-pointer hover:bg-neutral-900/40"
          >
            <span className="flex items-center gap-1.5 font-bold">
              <span className="text-[#ffdebf] animate-pulse">✦</span> View Media Portfolio
            </span>
            <span className="flex items-center gap-1.5 font-bold">
              <span>{totalImages} Photos</span>
              <span className="text-neutral-600">•</span>
              <span>{totalVideos} Clips</span>
              <ChevronRight className="w-3.5 h-3.5 text-primary group-hover/media:translate-x-0.5 transition-transform" />
            </span>
          </button>
        </div>

        {/* Operational Statistics */}
        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-[#100e0c]/85 rounded border border-outline-variant mb-4 text-center">
          <div>
            <p className="text-[9px] text-[#9e8e80] uppercase tracking-widest font-mono">Repeat</p>
            <p className="text-xs font-bold text-neutral-100 font-mono">{provider.repeatCustomerRate}%</p>
          </div>
          <div>
            <p className="text-[9px] text-[#9e8e80] uppercase tracking-widest font-mono">Active</p>
            <p className="text-xs font-bold text-neutral-100 font-mono">{provider.completionRate}%</p>
          </div>
          <div>
            <p className="text-[9px] text-[#9e8e80] uppercase tracking-widest font-mono">Reply</p>
            <p className="text-xs font-bold text-primary font-mono">{provider.responseTime}</p>
          </div>
        </div>

        {/* Footer Meta: Pricing & Location */}
        <div className="flex items-center justify-between pt-3 border-t border-outline-variant text-[13px] text-neutral-400 mb-4 gap-2">
          <div className="flex items-center gap-1 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-[#9e8e80] shrink-0" />
            <span className="truncate text-neutral-300">{provider.locationName}</span>
            <span className="text-xs font-mono text-neutral-500 shrink-0">({provider.distanceMiles.toFixed(1)}m)</span>
          </div>
          
          <div className="text-right shrink-0">
            <span className="text-primary font-bold text-lg font-mono">${provider.pricePerEvent}</span>
            <span className="text-[#9e8e80] text-[10px] block -mt-1 uppercase font-mono">/ {provider.priceUnit}</span>
          </div>
        </div>

        {/* Private Contact Information Unlock Section */}
        {currentUser && currentUser.role === 'customer' && (
          <div className="mb-4 p-2.5 rounded-lg border border-outline-variant bg-[#131110] text-center space-y-2">
            <span className="text-[9px] uppercase font-bold text-[#849588] font-mono block tracking-wider">
              🔒 Verified Direct Contact Link
            </span>
            {currentUser.isClientPremium ? (
              currentUser.unlockedProviderContactIds?.includes(provider.id) ? (
                <div className="space-y-1 py-1 px-2 rounded bg-primary/5 border border-primary/20">
                  <p className="text-xs text-neutral-200 font-mono flex items-center justify-center gap-1.5">
                    <span>📞</span> Private Line: <strong className="text-primary tracking-wide select-all">{provider.privatePhone || "+1 (555) 791-0023"}</strong>
                  </p>
                  <p className="text-[10.5px] text-neutral-300 font-mono flex items-center justify-center gap-1.5">
                    <span>✉️</span> Secure Email: <strong className="text-[#ffdebf] tracking-wide select-all">{provider.privateEmail || `${provider.name.toLowerCase().replace(/\s+/g, '')}@exclusive.private`}</strong>
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[11px] text-neutral-400 font-sans italic px-1">
                    Direct details are locked. Premium connects include up to 3 direct unlocks per month.
                  </p>
                  {(currentUser.unlockedCountThisMonth || 0) < 3 ? (
                    <button
                      onClick={() => onUnlockContact?.(provider.id)}
                      className="w-full py-1.5 bg-gradient-to-r from-amber-500/20 to-primary/25 hover:from-amber-400 hover:to-primary hover:text-[#2c1a04] text-primary font-mono text-[9.5px] font-bold uppercase rounded border border-primary/30 transition-all cursor-pointer shadow-sm"
                    >
                      🔓 Unlock Direct Contact Info ({3 - (currentUser.unlockedCountThisMonth || 0)} left)
                    </button>
                  ) : (
                    <p className="text-[10px] text-rose-400 font-bold font-mono">
                      Monthly Lock Limit (3/3 used. Resets on new calendar billing cycle)
                    </p>
                  )}
                </div>
              )
            ) : (
              <div className="space-y-2">
                <div className="relative py-1 border border-dashed border-outline-variant/40 rounded filter blur-[2px] opacity-40 select-none">
                  <p className="text-[11px] font-mono text-neutral-405">📞 +1 (555) 791-0023</p>
                  <p className="text-[10.5px] font-mono text-neutral-410">✉️ service@exclusive.private</p>
                </div>
                <button
                  onClick={onUpgradePremium}
                  className="w-full py-1.5 bg-gradient-to-r from-[#ffdebf]/10 to-primary/10 hover:from-primary hover:to-amber-300 hover:text-[#2c1a04] text-primary font-mono text-[9.5px] font-bold uppercase rounded border border-primary/20 transition-all cursor-pointer shadow-sm animate-pulse"
                >
                  🔒 Unlock with Premium Membership ($25/mo)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quick Interaction Keys */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button 
            onClick={onStartChat}
            className="flex items-center justify-center gap-1 px-3 py-2 bg-[#2c2a27] hover:bg-[#373432] text-neutral-200 rounded text-xs font-semibold transition-all duration-200 active:scale-95 border border-outline-variant hover:border-outline shadow font-mono uppercase tracking-wider"
          >
            <MessageSquare className="w-3.5 h-3.5 text-secondary mr-1" />
            <span>Chat</span>
          </button>
          
          <button 
            onClick={onSelectBook}
            className="flex items-center justify-center gap-1 px-3 py-2 bg-[#ffdebf] hover:bg-[#fdba74] text-[#492900] rounded text-xs font-bold transition-all duration-200 active:scale-95 shadow-md shadow-primary/10 hover:shadow-primary/25 glow-primary-sm font-mono uppercase tracking-wider"
          >
            <span>Book</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* PORTFOLIO LIGHTBOX / MODAL OVERLAY */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in text-neutral-200">
          <div className="max-w-xl w-full bg-[#1e1b19] border border-outline-variant rounded-xl p-6 relative shadow-2xl space-y-5">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-outline-variant">
              <div>
                <span className="text-[10px] text-primary uppercase font-bold tracking-widest font-mono">EXECUTIVE PORTFOLIO INDEX</span>
                <h3 className="text-base font-serif font-bold text-white uppercase mt-0.5">{provider.name} — Media Showcase</h3>
              </div>
              <button
                onClick={() => setShowMediaModal(false)}
                className="text-neutral-400 hover:text-white font-bold text-lg p-1.5 rounded-lg hover:bg-neutral-850 transition-colors"
                title="Close Showcase"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tab Swapper */}
            <div className="flex gap-2 border-b border-outline-variant/60 pb-px">
              <button
                onClick={() => setMediaTab('photos')}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold font-mono uppercase transition-all border-b-2 ${
                  mediaTab === 'photos' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-neutral-400'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Photos ({totalImages})</span>
              </button>
              <button
                onClick={() => setMediaTab('videos')}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold font-mono uppercase transition-all border-b-2 ${
                  mediaTab === 'videos' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-neutral-400'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Clips ({totalVideos})</span>
              </button>
            </div>

            {/* TAB CONTENT: PHOTOS */}
            {mediaTab === 'photos' && (
              <div className="space-y-4">
                {totalImages === 0 ? (
                  <p className="text-xs text-neutral-500 italic py-10 text-center">No portfolio images uploaded.</p>
                ) : (
                  <div className="space-y-3">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-outline-variant/80 bg-neutral-950 flex items-center justify-center">
                      <img 
                        src={portfolioImages[activePhotoIdx]} 
                        alt={`Portfolio index element ${activePhotoIdx + 1}`} 
                        className="w-full h-full object-cover" 
                      />
                      
                      {/* Nav controllers */}
                      {totalImages > 1 && (
                        <>
                          <button
                            onClick={handlePrevPhoto}
                            className="absolute left-2.5 p-2 bg-black/75 rounded-full border border-neutral-700 hover:border-primary text-white transition-all hover:scale-105 active:scale-95"
                            title="Previous image"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleNextPhoto}
                            className="absolute right-2.5 p-2 bg-black/75 rounded-full border border-neutral-700 hover:border-primary text-white transition-all hover:scale-105 active:scale-95"
                            title="Next image"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {/* Pagination Index Badge */}
                      <span className="absolute bottom-3.5 right-3.5 bg-black/75 text-[10px] font-mono px-2 py-0.5 rounded text-white tracking-widest leading-none">
                        {activePhotoIdx + 1} / {totalImages}
                      </span>
                    </div>

                    {/* Thumbnail slider list */}
                    <div className="flex gap-2 overflow-x-auto pb-1.5 pt-1">
                      {portfolioImages.map((img, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setActivePhotoIdx(idx)}
                          className={`w-14 h-11 shrink-0 rounded overflow-hidden cursor-pointer border transition-all ${
                            activePhotoIdx === idx ? 'border-primary ring-1 ring-primary/30 scale-102 bg-neutral-900' : 'border-outline-variant hover:border-neutral-400'
                          }`}
                        >
                          <img src={img} alt="Thumbnail preview item" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: VIDEOS */}
            {mediaTab === 'videos' && (
              <div className="space-y-4">
                {totalVideos === 0 ? (
                  <p className="text-xs text-neutral-500 italic py-10 text-center">No portfolio video highlights uploaded.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {portfolioVideos.map((vid, idx) => (
                      <div key={idx} className="p-3 bg-neutral-950/60 border border-outline-variant rounded-lg space-y-2.5">
                        <div className="aspect-video relative rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900">
                          <video 
                            src={vid} 
                            controls 
                            playsInline
                            className="w-full h-full object-cover bg-black" 
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 bg-neutral-900 px-2 py-1 rounded">
                          <span className="flex items-center gap-1.5">
                            <Film className="w-3.5 h-3.5 text-primary" />
                            <span>10-Second Showcase Clip #{idx+1} (Length compliant)</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Controls */}
            <div className="pt-3 border-t border-outline-variant flex justify-end gap-2.5">
              <button
                onClick={() => setShowMediaModal(false)}
                className="px-4 py-2 border border-outline-variant rounded font-mono uppercase tracking-wider text-xs font-semibold text-neutral-400 hover:text-white"
              >
                Close Showcase
              </button>
              <button
                onClick={() => {
                  setShowMediaModal(false);
                  onSelectBook();
                }}
                className="px-5 py-2 bg-[#ffdebf] hover:bg-[#fdba74] text-[#492900] font-mono uppercase tracking-wider font-extrabold text-xs rounded shadow transition-all active:scale-95 flex items-center gap-1.5 glow-primary-sm"
              >
                <span>Book Escrow Directly</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
export default ProviderCard;
