import React, { useState } from 'react';
import { ServiceProvider, UserState, Booking } from '../types';
import { Calendar as CalendarIcon, Clock, ShieldCheck, Check, CalendarCheck } from 'lucide-react';

interface BookingCalendarProps {
  currentUser: UserState;
  provider: ServiceProvider;
  onConfirmBooking: (booking: Booking) => void;
  onClose: () => void;
  onStartChat?: () => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  currentUser,
  provider,
  onConfirmBooking,
  onClose,
  onStartChat,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>(provider.availabilityCalendar[0] || 'Saturday');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('07:00 PM');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isBooked, setIsBooked] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // States for consulting inquiry interview questions - expanded to 15 prefilled items
  const [availableQuestions, setAvailableQuestions] = useState<string[]>([
    "What is your comfort level with high-profile NDAs and media anonymity?",
    "Can you provide a brief synopsis of your conversational specialities?",
    "Have you guided luxury lifestyle itineraries in this hub city before?",
    "What are your specific expectations for executive presentation alignment?",
    "How do you handle sudden schedule changes or travel plan deviations in high-stakes environments?",
    "Describe your experience acting as an interpreter or language assistant for international delegations.",
    "What is your styling preference for formal charity galas and state dinners?",
    "How do you maintain absolute discretion when handling sensitive financial or personal accounts?",
    "What level of custom fitness, massage, or wellness regimens can you coordinate?",
    "Describe your knowledge of private aviation processes, yacht charters, or elite transport sourcing.",
    "Are you specialized in arranging Michelin-star reservations or bespoke VIP events?",
    "What is your preferred conversational dynamic: low-key active listener or outgoing host/presenter?",
    "Do you have professional mentoring experience in venture capital, stock markets, or real estate?",
    "What is your protocol for coordinating with an executive security detail?",
    "Can you provide bespoke luxury shopping advice and high-end brand sourcing support?"
  ]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  // Individual questionnaires scoring system (importance / matching expectation weights: 1-10)
  const [questionScores, setQuestionScores] = useState<Record<string, number>>({});
  const [customQuestion, setCustomQuestion] = useState('');

  const timeSlots = ['12:00 PM', '02:00 PM', '04:00 PM', '07:00 PM', '09:00 PM'];

  // Calculations
  const bookingSubtotal = provider.pricePerEvent;
  const platformFee = Math.round(bookingSubtotal * 0.10); // 10% commission controls
  const totalDue = bookingSubtotal + platformFee - discount;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'LUXELIFE') {
      setDiscount(50);
      alert('Success: Applied $50 Exclusive Elite reduction!');
    } else {
      alert('Trial: Enter "LUXELIFE" to activate a mock code.');
    }
  };

  const handleToggleQuestion = (q: string) => {
    setSelectedQuestions(prev => 
      prev.includes(q) ? prev.filter(item => item !== q) : [...prev, q]
    );
  };

  const handleAddCustomQuestion = () => {
    const q = customQuestion.trim();
    if (!q) return;
    if (!availableQuestions.includes(q)) {
      setAvailableQuestions(prev => [...prev, q]);
    }
    if (!selectedQuestions.includes(q)) {
      setSelectedQuestions(prev => [...prev, q]);
    }
    setCustomQuestion('');
  };

  const handlePaymentSubmit = () => {
    if (currentUser.walletBalance < totalDue) {
      alert(`Insufficient funds. Your wallet has $${currentUser.walletBalance}. Use development simulated top-up button.`);
      return;
    }

    const finalScores: Record<string, number> = {};
    selectedQuestions.forEach(q => {
      finalScores[q] = questionScores[q] || 8;
    });

    const aggregatePct = selectedQuestions.length > 0 
      ? Math.round(selectedQuestions.reduce((sum, q) => sum + (questionScores[q] || 8), 0) / selectedQuestions.length * 10)
      : undefined;

    const newBooking: Booking = {
      id: `book_${Date.now()}`,
      providerId: provider.id,
      providerName: provider.name,
      providerAvatar: provider.avatarUrl,
      customerId: currentUser.id,
      customerName: currentUser.name,
      date: `${selectedDay}, June 27, 2026`,
      timeSlot: selectedTimeSlot,
      status: 'active_escrow', // Goes to escrow instantly according to system spec
      totalAmount: totalDue,
      categoryName: provider.categories[0] || 'Lifestyle Experience',
      createdAt: new Date().toISOString().slice(0, 10),
      interviewQuestions: selectedQuestions.length > 0 ? selectedQuestions : undefined,
      questionnaireScores: selectedQuestions.length > 0 ? finalScores : undefined,
      overallCompatibilityScore: aggregatePct,
    };

    onConfirmBooking(newBooking);
    setCreatedBooking(newBooking);
    setIsBooked(true);
  };

  // Mock ICS download
  const handleIcsDownload = (calendarType: 'google' | 'apple' | 'outlook') => {
    const calendarText = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Secured Elite Service with ${provider.name}\nDTSTART:20260627T190000Z\nDTEND:20260627T210000Z\nDESCRIPTION:Luxe booking escrow confirmed.\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([calendarText], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Luxe_Booking_${provider.name.replace(' ', '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-surface border border-outline-variant rounded-xl p-6 shadow-2xl relative overflow-hidden text-neutral-200">
      
      {/* Decorative Golden Corner Flare */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

      {!isBooked ? (
        <div className="space-y-6">
          <div className="flex justify-between items-start pb-4 border-b border-outline-variant">
            <div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-white tracking-tight font-serif uppercase">Book Elite Experience</h2>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Secured schedule alignment &amp; Escrow Deposit with <span className="text-primary font-semibold">{provider.name}</span>
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-neutral-400 hover:text-white font-bold text-lg p-1.5 rounded-lg hover:bg-surface-bright transition-colors"
            >
              &times;
            </button>
          </div>

          {/* Step 1: Select Day */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#9e8e80] uppercase tracking-widest block font-mono">1. Select Scheduled Day</label>
            <div className="flex flex-wrap gap-2">
              {provider.availabilityCalendar.length === 0 ? (
                <span className="text-xs font-semibold text-neutral-500">No defined schedules currently. Contact via chat.</span>
              ) : (
                provider.availabilityCalendar.map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all font-mono ${
                      selectedDay === day 
                        ? 'border-primary bg-primary/10 text-white shadow-lg shadow-primary/5' 
                        : 'border-outline-variant bg-[#100e0c]/40 text-neutral-400 hover:border-outline hover:text-white'
                    }`}
                  >
                    {day}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Step 2: Time Slots */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-[#9e8e80] uppercase tracking-widest block font-mono">2. Select Hour Block</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTimeSlot(time)}
                  className={`py-2 rounded-lg text-xs font-mono font-bold border text-center transition-all ${
                    selectedTimeSlot === time 
                      ? 'border-primary bg-primary/10 text-white shadow-lg shadow-primary/5' 
                      : 'border-outline-variant bg-[#100e0c]/40 text-neutral-400 hover:border-[#9e8e80]'
                  }`}
                >
                  <Clock className="w-3 h-3 inline mr-1 opacity-70" />
                  <span>{time}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Luxe Interview Questions & Inquiry preferences */}
          <div className="space-y-3 bg-[#131110] border border-outline-variant p-4 rounded-xl">
            <div>
              <label className="text-[10px] font-bold text-[#9e8e80] uppercase tracking-widest block font-mono">3. Luxe Consultation Interview Questions</label>
              <p className="text-[10px] text-neutral-400 mt-0.5 leading-snug">
                Select pre-filled questions or add your own to provide clear alignment details to the provider.
              </p>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {availableQuestions.map((question, idx) => {
                const isSelected = selectedQuestions.includes(question);
                return (
                  <div 
                    key={idx}
                    onClick={() => handleToggleQuestion(question)}
                    className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-primary/5 border-primary/45 text-white' 
                        : 'bg-[#100e0c]/40 border-outline-variant/60 text-neutral-400 hover:border-outline'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? 'border-primary bg-primary text-[#100e0c]' : 'border-outline-variant'
                    }`}>
                      {isSelected && <span className="text-[9px] font-extrabold font-sans">✓</span>}
                    </div>
                    <span className="leading-snug">{question}</span>
                  </div>
                );
              })}
            </div>

            {/* Input custom question */}
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="INPUT YOUR OWN EXQUISITE INTERVIEW QUESTION..."
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomQuestion();
                  }
                }}
                className="bg-[#100e0c] border border-outline-variant/80 text-xs px-3 py-2 rounded-lg text-white placeholder-neutral-500 flex-grow font-mono outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={handleAddCustomQuestion}
                className="px-3.5 py-2 bg-[#ffdebf]/20 hover:bg-[#ffdebf]/30 border border-primary/20 text-white text-xs font-bold rounded transition-all font-mono uppercase shrink-0"
              >
                + Add
              </button>
            </div>
            {selectedQuestions.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-[#100e0c]/62 border border-outline-variant/60 rounded-lg space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-primary font-mono tracking-wider flex items-center gap-1">
                      <span>✦</span> Question Quality &amp; Alignment Matrix
                    </span>
                    <span className="text-[9.5px] text-neutral-400 font-mono">
                      {selectedQuestions.length} Active Inquiries
                    </span>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {selectedQuestions.map((q, idx) => {
                      const score = questionScores[q] || 8;
                      return (
                        <div key={idx} className="p-2 rounded bg-neutral-900/60 border border-outline-variant/30 space-y-1">
                          <p className="text-[11px] text-neutral-200 leading-snug">{q}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-neutral-900">
                            <span className="text-[9.5px] font-mono text-neutral-400">
                              Target Match Priority: <span className="text-primary font-bold">{score}/10</span>
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-neutral-500">Low</span>
                              <input 
                                type="range" 
                                min="1" 
                                max="10" 
                                value={score}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  setQuestionScores(prev => ({ ...prev, [q]: val }));
                                }}
                                className="w-24 accent-primary cursor-pointer h-1.5 rounded-lg bg-neutral-800"
                              />
                              <span className="text-[9px] text-primary">High</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between bg-primary/10 border border-primary/20 p-2.5 rounded-lg text-xs leading-none">
                    <span className="font-mono text-[10px] text-neutral-300">ALIGNMENT MATRIX TARGET LEVEL:</span>
                    <span className="font-mono font-extrabold text-primary">
                      {Math.round(selectedQuestions.reduce((sum, q) => sum + (questionScores[q] || 8), 0) / selectedQuestions.length * 10)}% Match
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Table & Escrow Controls */}
          <div className="p-4 rounded-lg bg-[#100e0c]/80 border border-outline-variant space-y-3.5">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="font-mono">Luxe Service rate ({provider.priceUnit})</span>
              <span className="font-mono text-neutral-200 font-semibold">${bookingSubtotal}</span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <div className="flex items-center gap-1">
                <span className="font-mono">Secure Escrow Protection fee (10%)</span>
                <span className="text-[9px] bg-primary/15 border border-primary/30 text-primary px-1.5 py-0.2 rounded font-mono font-bold">MUTUAL PROTECTION</span>
              </div>
              <span className="font-mono text-neutral-200 font-semibold">+${platformFee}</span>
            </div>

            {discount > 0 && (
              <div className="flex items-center justify-between text-xs text-emerald-400 font-bold font-mono">
                <span>Loyalty Promo Saving Applied</span>
                <span>-${discount}</span>
              </div>
            )}

            <div className="pt-2 border-t border-outline-variant flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-neutral-400 font-mono tracking-wide">Total Secured Deposit</span>
                <span className="text-[10px] block text-[#9e8e80] font-mono">Kept in escrow custody until audit alignment check</span>
              </div>
              <span className="text-xl font-bold font-mono text-primary">${totalDue}</span>
            </div>
          </div>

          {/* Promo Code Input */}
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="ENTER PROMO CODE (e.g., LUXELIFE)"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="bg-[#100e0c] border border-outline-variant text-xs px-3 py-2 rounded-lg text-white placeholder-neutral-500 flex-grow font-mono uppercase outline-none focus:border-primary"
            />
            <button 
              onClick={handleApplyPromo}
              className="px-4 py-2 bg-[#2c2a27] hover:bg-[#373432] border border-outline-variant text-neutral-200 text-xs font-bold rounded transition-all font-mono uppercase tracking-wider"
            >
              Apply
            </button>
          </div>

          {/* Payment Warning notice */}
          <div className="flex items-start gap-2 bg-[#100e0c]/40 p-3 rounded-lg border border-outline-variant text-[11px] text-neutral-400 leading-relaxed font-sans">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p>
              Upon submittal, your payment is placed with our secure escrow clearing ledger. Funds will remain untouchable until both parties check off that the service was successfully done. Zero risk.
            </p>
          </div>

          {/* Submit Trigger */}
          <div className="flex flex-wrap gap-2.5 justify-end pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-outline-variant text-xs font-bold hover:bg-[#2c2a27] rounded transition-all text-neutral-400 hover:text-white font-mono uppercase tracking-wider"
            >
              Cancel
            </button>
            {onStartChat && (
              <button 
                type="button"
                onClick={onStartChat}
                className="px-4 py-2 bg-[#ffdebf]/10 hover:bg-[#ffdebf]/20 border border-primary/25 hover:border-primary/50 text-white text-xs font-bold rounded transition-all font-mono uppercase tracking-wider flex items-center gap-1.5"
                title="Send a message directly in secure private chat before booking"
              >
                <span>💬 Chat with Provider</span>
              </button>
            )}
            <button 
              type="button"
              onClick={handlePaymentSubmit}
              className="px-6 py-2 bg-[#ffdebf] hover:bg-[#fdba74] text-[#492900] font-mono uppercase tracking-wider font-extrabold text-xs rounded shadow-lg active:scale-95 transition-all text-center flex items-center gap-1.5 glow-primary-sm"
            >
              <span>Secure Booking Escrow</span>
              <span>(${totalDue})</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 space-y-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary flex items-center justify-center mx-auto text-primary animate-pulse shadow-[0_0_15px_rgba(255,222,191,0.25)]">
            <Check className="w-8 h-8 font-extrabold" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight font-serif uppercase">Escrow Confirmed &amp; Dispatched!</h2>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed font-sans">
              Your platform booking was successfully lodged! Escrow of <span className="text-primary font-bold font-mono">${createdBooking?.totalAmount}</span> is safely held under deposit block registration.
            </p>
          </div>

          {createdBooking?.interviewQuestions && createdBooking.interviewQuestions.length > 0 && (
            <div className="p-3.5 rounded-lg bg-[#100e0c]/65 border border-primary/10 max-w-sm mx-auto space-y-1.5 text-left text-xs">
              <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider block">📎 Inquiry Questions Attached</span>
              <ul className="list-disc list-inside space-y-1 text-neutral-300">
                {createdBooking.interviewQuestions.map((q, idx) => (
                  <li key={idx} className="leading-snug">{q}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Simulated ICS exports */}
          <div className="p-4 rounded-lg bg-[#100e0c]/65 border border-outline-variant max-w-sm mx-auto space-y-3 text-left">
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#9e8e80] font-mono flex items-center gap-1.5">
              <CalendarCheck className="w-3.5 h-3.5 text-primary" />
              <span>Calendar Integration Links</span>
            </p>
            
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => handleIcsDownload('google')}
                className="py-1.5 bg-[#2c2a27] hover:bg-[#373432] border border-outline-variant rounded text-[10px] font-bold text-neutral-300 text-center transition-colors shadow font-mono"
              >
                Google
              </button>
              <button 
                onClick={() => handleIcsDownload('apple')}
                className="py-1.5 bg-[#2c2a27] hover:bg-[#373432] border border-outline-variant rounded text-[10px] font-bold text-neutral-300 text-center transition-colors shadow font-mono"
              >
                Apple iCal
              </button>
              <button 
                onClick={() => handleIcsDownload('outlook')}
                className="py-1.5 bg-[#2c2a27] hover:bg-[#373432] border border-outline-variant rounded text-[10px] font-bold text-neutral-300 text-center transition-colors shadow font-mono"
              >
                Outlook
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-[#ffdebf] hover:bg-[#fdba74] text-[#492900] font-serif uppercase tracking-wider text-xs rounded shadow active:scale-95 glow-primary-sm font-bold"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
export default BookingCalendar;
