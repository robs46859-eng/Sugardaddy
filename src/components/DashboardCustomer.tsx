import React, { useState } from 'react';
import { Booking, ServiceProvider, UserState, Review } from '../types';
import { Star, Clock, Calendar, ShieldCheck, Heart, MessageSquare, User } from 'lucide-react';
import MyProfileSettings from './MyProfileSettings';

interface DashboardCustomerProps {
  currentUser: UserState;
  onTopUpWallet: (amount: number) => void;
  savedProviders: ServiceProvider[];
  bookingsList: Booking[];
  providersList: ServiceProvider[];
  onReleaseEscrow: (bookingId: string) => void;
  onAddReview: (review: Review) => void;
  onViewProvider: (providerId: string) => void;
  onRaiseDispute: (bookingId: string) => void;
  onUpdateCurrentUser: (updated: UserState) => void;
  onUpdateBooking: (updated: Booking) => void;
  triggerNotification: (text: string) => void;
}

export const DashboardCustomer: React.FC<DashboardCustomerProps> = ({
  currentUser,
  onTopUpWallet,
  savedProviders,
  bookingsList,
  onReleaseEscrow,
  onAddReview,
  onViewProvider,
  onRaiseDispute,
  onUpdateCurrentUser,
  onUpdateBooking,
  triggerNotification,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'bookings' | 'saved' | 'wallet' | 'profile' | 'referrals'>('bookings');
  
  // Review submission state
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForReview) return;

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      providerId: selectedBookingForReview.providerId,
      customerId: currentUser.id,
      customerName: currentUser.name,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().slice(0, 10),
    };

    onAddReview(newReview);
    setSelectedBookingForReview(null);
    setReviewComment('');
    setReviewRating(5);
  };

  return (
    <div className="space-y-6">
      
      {/* Sub tabs Menu */}
      <div className="flex border-b border-[#2a2a2a] gap-1.5 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveSubTab('bookings')}
          className={`px-4 py-2.5 text-xs font-bold font-mono tracking-wider uppercase transition-all whitespace-nowrap border-b-2 ${
            activeSubTab === 'bookings'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-[#849588] hover:text-white'
          }`}
        >
          My Luxury Bookings ({bookingsList.length})
        </button>

        <button
          onClick={() => setActiveSubTab('saved')}
          className={`px-4 py-2.5 text-xs font-bold font-mono tracking-wider uppercase transition-all whitespace-nowrap border-b-2 ${
            activeSubTab === 'saved'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-[#849588] hover:text-white'
          }`}
        >
          My Saved Creators ({savedProviders.length})
        </button>

        <button
          onClick={() => setActiveSubTab('wallet')}
          className={`px-4 py-2.5 text-xs font-bold font-mono tracking-wider uppercase transition-all whitespace-nowrap border-b-2 ${
            activeSubTab === 'wallet'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-[#849588] hover:text-white'
          }`}
        >
          Client Escrow Wallet (${currentUser.walletBalance})
        </button>

        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-4 py-2.5 text-xs font-bold font-mono tracking-wider uppercase transition-all whitespace-nowrap border-b-2 ${
            activeSubTab === 'profile'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-[#849588] hover:text-white'
          }`}
        >
          👤 My Luxe Profile
        </button>

        <button
          onClick={() => setActiveSubTab('referrals')}
          className={`px-4 py-2.5 text-xs font-bold font-mono tracking-wider uppercase transition-all whitespace-nowrap border-b-2 ${
            activeSubTab === 'referrals'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-[#849588] hover:text-white'
          }`}
        >
          🎁 Referrals &amp; Rewards
        </button>
      </div>

      {/* Workspace Area */}
      {activeSubTab === 'bookings' && (
        <div className="space-y-4">
          {bookingsList.length === 0 ? (
            <div className="text-center py-12 rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] p-6 space-y-3">
              <Calendar className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-xs font-bold text-neutral-300">No Premium Bookings Confirmed Yet</p>
              <p className="text-[11px] text-[#849588] max-w-sm mx-auto leading-relaxed font-mono uppercase">
                Discover select verified providers below, execute safe escrow deposits, and secure dates using our real-time synchronization calendar.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookingsList.map((book) => (
                <div key={book.id} className="p-5 bg-[#1c1b1b] border border-[#2a2a2a] rounded-xl relative overflow-hidden flex flex-col justify-between shadow-lg hover:border-primary/20 transition-all">
                  <div>
                    {/* Status badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono">Reference: {book.id}</span>
                      <span className={`text-[9px] uppercase font-bold font-mono tracking-wider px-2 py-0.5 rounded ${
                        book.status === 'active_escrow' ? 'bg-primary/10 text-primary border border-primary/20 glow-primary-sm' :
                        book.status === 'completed' ? 'bg-[#7c4dff]/15 text-[#cdbdff] border border-[#7c4dff]/20' :
                        book.status === 'disputed' ? 'bg-rose-400/15 text-rose-400 border border-rose-400/20' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        🛡️ {book.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Provider Brief */}
                    <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => onViewProvider(book.providerId)}>
                      <img src={book.providerAvatar} alt={book.providerName} className="w-10 h-10 rounded-full object-cover border border-[#2a2a2a]" />
                      <div>
                        <h4 className="text-white font-bold text-sm tracking-tight">{book.providerName}</h4>
                        <p className="text-[11px] text-[#cdbdff] font-mono font-medium">{book.categoryName}</p>
                      </div>
                    </div>

                    {/* Schedule block */}
                    <div className="grid grid-cols-2 gap-2 text-xs py-2 px-3 bg-[#131313] border border-[#2a2a2a] rounded-lg mb-4 text-neutral-400 text-center">
                      <div className="border-r border-[#2a2a2a]">
                        <span className="text-[9px] uppercase font-bold text-[#849588] block font-mono">Date</span>
                        <span className="font-semibold text-neutral-200 font-mono">{book.date}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-[#849588] block font-mono">Time Slot</span>
                        <span className="font-medium text-neutral-200 font-mono">{book.timeSlot}</span>
                      </div>
                    </div>

                    {/* Attached Questionnaire alignment check */}
                    {book.interviewQuestions && book.interviewQuestions.length > 0 && (
                      <div className="mb-4 bg-[#141212] border border-[#2a2a2a] p-3 rounded-lg space-y-2.5">
                        <div className="flex items-center justify-between text-[9px] font-mono">
                          <span className="text-primary font-bold uppercase tracking-wider flex items-center gap-1">
                            <span>📋</span> ESCROW QUESTIONNAIRE EVALUATION
                          </span>
                          <span className="bg-primary/10 border border-primary/20 text-primary px-1.5 py-0.2 rounded font-bold">
                            {book.overallCompatibilityScore || 80}% Compatibility Matches
                          </span>
                        </div>

                        <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                          {book.interviewQuestions.map((q, idx) => {
                            const weightVal = book.questionnaireScores?.[q] || 8;
                            const answerVal = book.questionnaireAnswers?.[q];
                            return (
                              <div key={idx} className="p-2 bg-[#1b1919] rounded border border-[#2c2a2a] space-y-1 text-xs">
                                <p className="text-neutral-200 leading-snug font-medium"><span className="text-primary mr-1">Q:</span>{q}</p>
                                <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#849588]">
                                  <span>Priority weight value:</span>
                                  <span className="text-neutral-300 font-bold">{weightVal}/10</span>
                                </div>
                                <div className="p-1.5 mt-1 rounded bg-[#100e0c]/80 text-[11px] leading-snug border border-neutral-800">
                                  <span className="text-primary font-bold text-[9px] font-mono uppercase block">Provider Alignment Reply:</span>
                                  {answerVal ? (
                                    <span className="text-neutral-300 italic">"{answerVal}"</span>
                                  ) : (
                                    <span className="text-neutral-500 italic">⌛ Awaiting response from provider...</span>
                                  )}
                                </div>

                                {/* Custom matching evaluation */}
                                {answerVal && (
                                  <div className="pt-1.5 border-t border-neutral-950/20 flex items-center justify-between gap-2">
                                    <span className="text-[9.5px] font-mono text-[#d6c3b4]">Score Align: <strong className="text-primary">{weightVal}/10</strong></span>
                                    <input 
                                      type="range"
                                      min="1"
                                      max="10"
                                      value={weightVal}
                                      onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        const updatedScores = { ...(book.questionnaireScores || {}), [q]: val };
                                        const newOverall = Math.round(book.interviewQuestions!.reduce((sum, item) => sum + (updatedScores[item] || 8), 0) / book.interviewQuestions!.length * 10);
                                        onUpdateBooking({
                                          ...book,
                                          questionnaireScores: updatedScores,
                                          overallCompatibilityScore: newOverall
                                        });
                                      }}
                                      className="w-20 accent-primary cursor-pointer"
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions according to slot status */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#2a2a2a] mt-2 gap-3">
                    <div>
                      <span className="text-[9px] text-[#849588] uppercase font-mono block">Deposited</span>
                      <span className="text-sm font-bold font-mono text-primary">${book.totalAmount}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {book.status === 'active_escrow' && (
                        <>
                          <button 
                            onClick={() => onRaiseDispute(book.id)}
                            className="px-2.5 py-1.5 rounded-lg border border-neutral-700 font-mono hover:bg-neutral-800 text-rose-400 text-[11px] transition-colors"
                          >
                            Dispute
                          </button>
                          <button 
                            onClick={() => onReleaseEscrow(book.id)}
                            className="bg-gradient-to-r from-primary to-emerald-400 hover:from-emerald-300 hover:to-primary text-[#003920] font-mono uppercase tracking-wider font-bold px-3.5 py-1.5 rounded-lg text-xs leading-none shadow transition-all active:scale-95 glow-primary-sm"
                          >
                            Release Funds
                          </button>
                        </>
                      )}

                      {book.status === 'completed' && !book.hasBeenReviewed && (
                        <button 
                          onClick={() => setSelectedBookingForReview(book)}
                          className="px-3.5 py-1.5 bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#3a4a3f] text-[#cdbdff] hover:text-white text-xs font-bold rounded-lg transition-colors font-mono uppercase tracking-wider"
                        >
                          Review ⭐
                        </button>
                      )}

                      {book.status === 'completed' && book.hasBeenReviewed && (
                        <span className="text-neutral-500 text-xs italic font-semibold">Review Lodged ✓</span>
                      )}

                      {book.status === 'disputed' && (
                        <span className="text-neutral-500 text-[10px] bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold uppercase py-0.5 px-2 rounded">
                          Mod Board Reviewing
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Review Submission Popup inside dashboard */}
          {selectedBookingForReview && (
            <div className="p-5 rounded-lg border border-primary/30 bg-[#1c1b1b] space-y-4 max-w-md shadow-2xl">
              <h3 className="text-sm font-semibold text-white tracking-tight font-mono uppercase">Review Experience with {selectedBookingForReview.providerName}</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-400 font-mono uppercase">Rating Index:</span>
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <button
                      type="button"
                      key={starValue}
                      className="p-1 text-primary hover:scale-115 transition-transform"
                      onClick={() => setReviewRating(starValue)}
                    >
                      <Star className={`w-5 h-5 ${starValue <= reviewRating ? 'fill-primary text-primary' : 'text-neutral-700'}`} />
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-500 font-mono uppercase block">Verified Client Description feedback</label>
                  <textarea
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="We appreciate your valuable feedback regarding punctuality, presentation and alignment."
                    className="w-full h-20 bg-[#131313] border border-[#2a2a2a] text-xs p-3 text-white rounded-lg outline-none focus:border-primary placeholder-neutral-500 leading-relaxed font-sans"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button 
                    type="button"
                    onClick={() => setSelectedBookingForReview(null)}
                    className="px-3.5 py-1.5 border border-[#2a2a2a] rounded-lg hover:bg-neutral-800 text-xs font-bold text-neutral-400 font-mono uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-1.5 bg-gradient-to-r from-primary to-emerald-400 text-neutral-950 font-bold text-xs rounded-lg shadow active:scale-95 font-mono uppercase tracking-wider glow-primary-sm"
                  >
                    Lodge Review
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}

      {activeSubTab === 'saved' && (
        <div>
          {savedProviders.length === 0 ? (
            <div className="text-center py-12 rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] p-6 space-y-3">
              <Heart className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-xs font-bold text-neutral-300">Your Private Vault is Empty</p>
              <p className="text-[11px] text-[#849588] max-w-sm mx-auto leading-relaxed font-mono uppercase">
                Save creators of interest so you can promptly verify, schedule, or interact securely when travel or entertainment demands arise.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedProviders.map((prov) => (
                <div key={prov.id} className="p-4 bg-[#1c1b1b] border border-[#2a2a2a] rounded-xl relative overflow-hidden flex flex-col justify-between shadow hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-3">
                    <img src={prov.avatarUrl} alt={prov.name} className="w-12 h-12 rounded-full object-cover border border-[#2a2a2a]" />
                    <div>
                      <h4 className="text-white font-bold text-sm tracking-tight">{prov.name}</h4>
                      <p className="text-[10px] text-[#cdbdff] font-mono uppercase font-semibold">{prov.title}</p>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-[#2a2a2a] flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-primary">${prov.pricePerEvent} / {prov.priceUnit}</span>
                    <button 
                      onClick={() => onViewProvider(prov.id)}
                      className="text-xs bg-gradient-to-r from-primary to-emerald-400 text-neutral-950 font-bold hover:from-emerald-300 px-3 py-1.5 rounded-lg active:scale-95 transition-all shadow font-mono uppercase tracking-wider glow-primary-sm"
                    >
                      Book Session
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'wallet' && (
        <div className="max-w-xl mx-auto p-6 bg-[#1c1b1b] border border-[#2a2a2a] rounded-xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#7c4dff]/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-6 text-center">
            <div>
              <p className="text-xs uppercase font-bold tracking-widest text-[#849588] font-mono">Secured Escrow Account Portfolio</p>
              <p className="text-4xl font-bold text-white font-mono tracking-tight mt-1.5">${currentUser.walletBalance}</p>
            </div>

            <div className="p-4 rounded-lg bg-[#131313] border border-[#2a2a2a] text-left space-y-3.5">
              <h4 className="text-xs uppercase font-extrabold text-[#cdbdff] tracking-wider font-mono flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Escrow System Protection Status</span>
              </h4>
              <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">
                Your client profile has premium wallet encryption active. Deposited funds are only processed under formal approval steps. Fully compliant with standard clearing protocols.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-left">
              <label className="text-[10px] font-bold text-[#849588] font-mono block uppercase">Simulate Secured Stripe Settlement Top-Up</label>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => { onTopUpWallet(250); }}
                  className="py-2.5 bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#3a4a3f] font-mono text-xs font-bold text-neutral-200 rounded-lg transition-colors shadow active:scale-95"
                >
                  +$250 USD
                </button>
                <button 
                  onClick={() => { onTopUpWallet(500); }}
                  className="py-2.5 bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#3a4a3f] font-mono text-xs font-bold text-neutral-200 rounded-lg transition-colors shadow active:scale-95"
                >
                  +$500 USD
                </button>
                <button 
                  onClick={() => { onTopUpWallet(1000); }}
                  className="py-2.5 bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#3a4a3f] font-mono text-xs font-bold text-[#cdbdff] rounded-lg transition-colors shadow active:scale-95"
                >
                  +$1000 USD
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'profile' && (
        <MyProfileSettings 
          currentUser={currentUser}
          myListing={undefined}
          onUpdateCurrentUser={onUpdateCurrentUser}
          onUpdateProviderListing={() => {}}
          triggerNotification={triggerNotification}
        />
      )}

      {activeSubTab === 'referrals' && (
        <div className="max-w-xl mx-auto p-6 bg-[#1c1b1b] border border-[#2a2a2a] rounded-xl relative overflow-hidden shadow-2xl space-y-6 animate-fade-in">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffdebf]/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="text-center space-y-1.5">
            <h3 className="text-lg font-bold font-serif uppercase text-white tracking-tight">🎁 Exclusive Referral Ambassador Vault</h3>
            <p className="text-[11px] text-neutral-400 font-mono uppercase">
              Introduce high-status clients or creators &amp; earn secure premium discount credits.
            </p>
          </div>

          {/* Referral Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-[#131313] border border-[#2a2a2a] rounded-lg text-center space-y-1">
              <span className="text-[9px] uppercase font-bold text-[#849588] font-mono block">Your Invite Code</span>
              <span className="text-sm font-bold font-mono text-primary uppercase select-all tracking-wider">
                {currentUser.referralCode || 'LUX-CLI-789'}
              </span>
            </div>
            
            <div className="p-3.5 bg-[#131313] border border-[#2a2a2a] rounded-lg text-center space-y-1">
              <span className="text-[9px] uppercase font-bold text-[#849588] font-mono block">Invites Dispatched</span>
              <span className="text-sm font-bold font-mono text-white">
                {currentUser.referralsMadeCount || 0} Successful
              </span>
            </div>
          </div>

          {/* Discounts Earned */}
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-[#ffdebf] tracking-wider font-mono">
              💎 Total Loyalty Discount Balance
            </span>
            <p className="text-2xl font-bold font-mono text-white">
              ${currentUser.discountsEarnedAmount || 0} USD
            </p>
            <p className="text-[9.5px] text-primary/80 font-serif italic text-center max-w-xs mx-auto">
              Automatically applied to lower escrow protection deposits on your upcoming reservations.
            </p>
          </div>

          {/* Referral form */}
          <div className="pt-4 border-t border-[#2a2a2a] space-y-4">
            <h4 className="text-xs uppercase font-extrabold text-neutral-200 tracking-wider font-mono flex items-center gap-1.5 text-left">
              <span>✉️</span> Refer a High-Status Friend or Provider
            </h4>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const email = formData.get('referralEmail') as string;
              if (!email) return;

              // Update the user state
              const updatedUser = {
                ...currentUser,
                referralsMadeCount: (currentUser.referralsMadeCount || 0) + 1,
                discountsEarnedAmount: (currentUser.discountsEarnedAmount || 0) + 100, // Client gets $100 off per referral
              };
              onUpdateCurrentUser(updatedUser);
              triggerNotification(`Diplomatic referral invitation dispatched securely to ${email}! You earned an instant $100.00 loyalty discount!`);
              e.currentTarget.reset();
            }} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#849588] font-mono uppercase block">Associate's Private Email</label>
                  <input
                    name="referralEmail"
                    type="email"
                    required
                    placeholder="partner@privateoffice.store"
                    className="w-full bg-[#131313] border border-[#2a2a2a] text-xs p-2.5 text-white rounded-lg outline-none focus:border-primary placeholder-neutral-600 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#849588] font-mono uppercase block">Ambassador Role Type</label>
                  <select
                    name="referralRole"
                    className="w-full bg-[#131313] border border-[#2a2a2a] text-xs p-2.5 text-[#ffdebf] rounded-lg outline-none focus:border-primary font-mono"
                  >
                    <option value="customer">Elite Client Invitee (Earns Coupons)</option>
                    <option value="provider">Luxury Provider / Creator (Earns Free Ads)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-primary to-emerald-400 text-[#003920] font-bold font-mono text-xs rounded-lg uppercase tracking-wider active:scale-[0.98] transition-all shadow glow-primary-sm cursor-pointer"
              >
                Dispatch Invitation &amp; Claim $100.00 Reward
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default DashboardCustomer;
