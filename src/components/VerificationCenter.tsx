import React, { useState, useRef } from 'react';
import { VerificationChecklist } from '../types';
import { ShieldCheck, FileText, Smartphone, Mail, Camera, Upload, Lock, Shield } from 'lucide-react';

interface VerificationCenterProps {
  currentVerification: VerificationChecklist;
  onUpdateVerification: (updated: Partial<VerificationChecklist>) => void;
  userType: 'customer' | 'provider';
}

export const VerificationCenter: React.FC<VerificationCenterProps> = ({
  currentVerification,
  onUpdateVerification,
  userType,
}) => {
  const [activeTab, setActiveTab] = useState<'id' | 'selfie' | 'phone' | 'credential' | 'background'>('id');
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 234-5678');
  const [phoneCode, setPhoneCode] = useState('');
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [capturedSelfie, setCapturedSelfie] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [uploadedIdName, setUploadedIdName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const idInputRef = useRef<HTMLInputElement>(null);
  const credentialInputRef = useRef<HTMLInputElement>(null);

  const handleIdFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedIdName(file.name);
      onUpdateVerification({ governmentId: 'pending' });
    }
  };

  const handleCredentialFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpdateVerification({ professionalCredential: 'pending' });
    }
  };

  // Stats calculation
  const totalSteps = userType === 'provider' ? 6 : 4;
  const verifiedCount = Object.values(currentVerification).filter(v => v === 'verified').length;
  const trustScore = Math.round((verifiedCount / totalSteps) * 100);

  // Mock ID Drag & Drop handler
  const handleIdDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedIdName(file.name);
      onUpdateVerification({ governmentId: 'pending' });
    }
  };

  // Mock Camera verification simulator
  const simulateSelfieCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setCapturedSelfie('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200');
      setIsCapturing(false);
      onUpdateVerification({ selfie: 'pending' });
    }, 2000);
  };

  // Verify phone code helper
  const handleVerifyPhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneCode === '7777') {
      onUpdateVerification({ phone: 'verified' });
      setIsVerifyingPhone(false);
    } else {
      alert('Mock Code: Enter "7777" to pass verification instantly.');
    }
  };

  // Auto verify mock trigger
  const autoVerifyAll = () => {
    onUpdateVerification({
      governmentId: 'verified',
      selfie: 'verified',
      phone: 'verified',
      email: 'verified',
      ...(userType === 'provider' ? { professionalCredential: 'verified', backgroundCheck: 'verified' } : {}),
    });
  };

  return (
    <div className="bg-surface border border-outline-variant rounded-xl p-6 shadow-xl relative overflow-hidden">
      
      {/* Decorative Corner Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-outline-variant gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-white tracking-tight font-serif uppercase text-left">Identity Verification Center</h2>
          </div>
          <p className="text-neutral-400 text-xs mt-1 text-left">
            Build and audit verified credentials to operate securely on the premium services marketplace.
          </p>
        </div>

        {/* Trust Score Metric */}
        <div className="flex items-center gap-3 bg-[#100e0c] px-4 py-2.5 rounded border border-outline-variant">
          <div className="text-right">
            <span className="text-[9px] text-[#9e8e80] font-mono block uppercase">Trust Score</span>
            <span className="text-lg font-bold text-primary font-mono">{trustScore}%</span>
          </div>
          <div className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center relative">
            <div 
              className="absolute inset-0 rounded-full border-2 border-primary transition-all duration-500" 
              style={{ clipPath: `polygon(0 0, 100% 0, 100% ${trustScore}%, 0 ${trustScore}%)` }}
            />
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Trust Checklist Cards */}
      <div className={`grid grid-cols-2 ${userType === 'provider' ? 'md:grid-cols-5' : 'md:grid-cols-4'} gap-3 mb-6`}>
        
        {/* Government ID */}
        <div 
          onClick={() => setActiveTab('id')}
          className={`cursor-pointer p-3.5 rounded border transition-all text-center flex flex-col items-center justify-center relative ${
            activeTab === 'id' 
              ? 'border-primary bg-primary/5 text-white glow-primary-sm' 
              : 'border-outline-variant bg-[#100e0c]/60 hover:border-[#9e8e80] text-neutral-400'
          }`}
        >
          <div className="p-2 rounded bg-[#100e0c] border border-outline-variant text-primary mb-2">
            <FileText className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold font-mono uppercase tracking-wider">1. Gov ID</p>
          <span className={`text-[9px] mt-1 px-1.5 py-0.5 rounded font-mono ${
            currentVerification.governmentId === 'verified' ? 'bg-primary/10 text-primary border border-primary/20 glow-primary-sm' :
            currentVerification.governmentId === 'pending' ? 'bg-amber-300/10 text-amber-300 border border-amber-300/20' : 'bg-neutral-800 text-neutral-500'
          }`}>
            {currentVerification.governmentId.toUpperCase()}
          </span>
        </div>

        {/* Face / Selfie */}
        <div 
          onClick={() => setActiveTab('selfie')}
          className={`cursor-pointer p-3.5 rounded border transition-all text-center flex flex-col items-center justify-center relative ${
            activeTab === 'selfie' 
              ? 'border-primary bg-primary/5 text-white glow-primary-sm' 
              : 'border-outline-variant bg-[#100e0c]/60 hover:border-[#9e8e80] text-neutral-400'
          }`}
        >
          <div className="p-2 rounded bg-[#100e0c] border border-outline-variant text-primary mb-2">
            <Camera className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold font-mono uppercase tracking-wider">2. Selfie ID</p>
          <span className={`text-[9px] mt-1 px-1.5 py-0.5 rounded font-mono ${
            currentVerification.selfie === 'verified' ? 'bg-primary/10 text-primary border border-primary/20 glow-primary-sm' :
            currentVerification.selfie === 'pending' ? 'bg-amber-300/10 text-amber-300 border border-amber-300/20' : 'bg-neutral-800 text-neutral-500'
          }`}>
            {currentVerification.selfie.toUpperCase()}
          </span>
        </div>

        {/* Phone Authenticated */}
        <div 
          onClick={() => setActiveTab('phone')}
          className={`cursor-pointer p-3.5 rounded border transition-all text-center flex flex-col items-center justify-center relative ${
            activeTab === 'phone' 
              ? 'border-primary bg-primary/5 text-white glow-primary-sm' 
              : 'border-outline-variant bg-[#100e0c]/60 hover:border-[#9e8e80] text-neutral-400'
          }`}
        >
          <div className="p-2 rounded bg-[#100e0c] border border-outline-variant text-primary mb-2">
            <Smartphone className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold font-mono uppercase tracking-wider">3. SMS Phone</p>
          <span className={`text-[9px] mt-1 px-1.5 py-0.5 rounded font-mono ${
            currentVerification.phone === 'verified' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-neutral-800 text-neutral-500'
          }`}>
            {currentVerification.phone.toUpperCase()}
          </span>
        </div>

        {/* Optional Credentials / Email Verif */}
        {userType === 'provider' ? (
          <>
            <div 
              onClick={() => setActiveTab('credential')}
              className={`cursor-pointer p-3.5 rounded border transition-all text-center flex flex-col items-center justify-center relative ${
                activeTab === 'credential' 
                  ? 'border-primary bg-primary/5 text-white glow-primary-sm' 
                  : 'border-outline-variant bg-[#100e0c]/60 hover:border-[#9e8e80] text-neutral-400'
              }`}
            >
              <div className="p-2 rounded bg-[#100e0c] border border-outline-variant text-primary mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold font-mono uppercase tracking-wider">4. Credentials</p>
              <span className={`text-[9px] mt-1 px-1.5 py-0.5 rounded font-mono ${
                currentVerification.professionalCredential === 'verified' ? 'bg-primary/10 text-primary border border-primary/20' :
                currentVerification.professionalCredential === 'pending' ? 'bg-amber-300/10 text-amber-300 border border-amber-300/20' : 'bg-neutral-800 text-neutral-500'
              }`}>
                {(currentVerification.professionalCredential || 'unverified').toUpperCase()}
              </span>
            </div>
            
            <div 
              onClick={() => setActiveTab('background')}
              className={`cursor-pointer p-3.5 rounded border transition-all text-center flex flex-col items-center justify-center relative ${
                activeTab === 'background' 
                  ? 'border-primary bg-primary/5 text-white glow-primary-sm' 
                  : 'border-outline-variant bg-[#100e0c]/60 hover:border-[#9e8e80] text-neutral-400'
              }`}
            >
              <div className="p-2 rounded bg-[#100e0c] border border-outline-variant text-primary mb-2">
                <Shield className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold font-mono uppercase tracking-wider">5. Background</p>
              <span className={`text-[9px] mt-1 px-1.5 py-0.5 rounded font-mono ${
                currentVerification.backgroundCheck === 'verified' ? 'bg-primary/10 text-primary border border-primary/20' :
                currentVerification.backgroundCheck === 'pending' ? 'bg-amber-300/10 text-amber-300 border border-amber-300/20' : 'bg-neutral-800 text-neutral-500'
              }`}>
                {(currentVerification.backgroundCheck || 'unverified').toUpperCase()}
              </span>
            </div>
          </>
        ) : (
          <div 
            className="p-3.5 rounded border border-outline-variant bg-[#100e0c]/25 text-center flex flex-col items-center justify-center text-neutral-500 select-none"
          >
            <div className="p-2 rounded bg-[#100e0c] border border-outline-variant text-primary/40 mb-2">
              <Mail className="w-4 h-4 text-[#ffdebf]" />
            </div>
            <p className="text-xs font-bold font-mono uppercase tracking-wider text-neutral-400">4. Email verified</p>
            <span className="text-[9px] mt-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/25 font-mono">
              VERIFIED
            </span>
          </div>
        )}

      </div>

      {/* Verification Pane Action Workspace */}
      <div className="p-5 rounded bg-[#100e0c] border border-outline-variant">
        
        {activeTab === 'id' && (
          <div className="space-y-4 text-left">
            <h3 className="text-sm font-semibold text-white font-mono uppercase">Government-issued Photo ID</h3>
            <p className="text-xs text-neutral-400 max-w-xl leading-relaxed">
              We securely match your passport, international driver&apos;s license, or official state card against your biometric facial check. Data is encrypted end-to-end and deleted post-validation.
            </p>

            {currentVerification.governmentId === 'verified' ? (
              <div className="bg-primary/5 rounded p-4 border border-primary/20 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white uppercase font-mono">Government ID Verified</p>
                  <p className="text-[11px] text-[#9e8e80] font-mono mt-0.5">Security audit completed successfully. Vault record: SHA256-verified-id</p>
                </div>
              </div>
            ) : currentVerification.governmentId === 'pending' ? (
              <div className="bg-primary/5 rounded p-4 border border-primary/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-primary border-t-transparent animate-spin shrink-0" />
                  <div>
                     <p className="text-xs font-bold text-white font-mono uppercase">AUTHENTICATION PENDING</p>
                     <p className="text-[11px] font-mono text-[#d6c3b4]">Reviewing: <span className="text-neutral-200">{uploadedIdName || 'Simulated_Passport_ID.jpg'}</span></p>
                  </div>
                </div>
                <button 
                  onClick={() => onUpdateVerification({ governmentId: 'verified' })}
                  className="px-3.5 py-1.5 bg-[#ffdebf] hover:bg-[#fdba74] text-[#492900] text-xs font-mono font-bold uppercase rounded shadow"
                >
                  Approve ID
                </button>
              </div>
            ) : (
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleIdDrop}
                onClick={() => idInputRef.current?.click()}
                className={`border-2 border-dashed rounded p-6 text-center transition-colors cursor-pointer ${
                  isDragOver ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-[#849588]'
                }`}
              >
                <input 
                  type="file"
                  ref={idInputRef}
                  onChange={handleIdFileChange}
                  accept="image/*,application/pdf"
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-neutral-350">Drag &amp; Drop Passport / ID Card</p>
                <p className="text-[11px] text-neutral-500 mt-1">Supports PDF, PNG, JPG formats. Click to browse local files 📁</p>
                <div className="flex gap-2 justify-center mt-3">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      idInputRef.current?.click();
                    }}
                    className="px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary hover:text-white text-[11px] font-mono font-bold rounded border border-primary/30 active:scale-95 uppercase tracking-wider"
                  >
                    Browse Local File 📁
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedIdName('Simulated_Passport_ID.jpg');
                      onUpdateVerification({ governmentId: 'pending' });
                    }}
                    className="px-3 py-1.5 bg-[#2c2a27] hover:bg-[#373432] text-neutral-200 text-[11px] font-bold rounded font-mono border border-outline-variant active:scale-95 uppercase tracking-wider"
                  >
                    Simulate ID
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'selfie' && (
          <div className="space-y-4 text-left">
            <h3 className="text-sm font-semibold text-white font-mono uppercase">Biometric Selfie Validation</h3>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xl">
              Take a secure 3-D live facial alignment test. Ensures that you match your provided government ID details directly in real-time.
            </p>

            {currentVerification.selfie === 'verified' ? (
              <div className="bg-primary/5 rounded p-4 border border-primary/20 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-xs font-bold text-white uppercase font-mono">Biometric Face Check Cleared</p>
                  <p className="text-[11px] text-[#9e8e80] font-mono">Liveness test and 3D geometric face-matching score: 99.8% match.</p>
                </div>
              </div>
            ) : currentVerification.selfie === 'pending' ? (
              <div className="bg-primary/5 rounded p-4 border border-primary/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {capturedSelfie ? (
                    <img src={capturedSelfie} alt="Selfie" className="w-10 h-10 rounded-full object-cover border border-outline-variant" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-primary border-t-transparent animate-spin shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-bold text-white font-mono uppercase">LIVENESS MATCH PENDING</p>
                    <p className="text-[10px] text-[#9e8e80] font-mono">Comparing photograph credentials...</p>
                  </div>
                </div>
                <button 
                  onClick={() => onUpdateVerification({ selfie: 'verified' })}
                  className="px-3 py-1.5 bg-[#ffdebf] hover:bg-[#fdba74] text-[#492900] font-bold text-xs rounded font-mono uppercase tracking-wider"
                >
                  Match Instantly
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 border border-dashed border-outline-variant rounded bg-black/30">
                <Camera className="w-8 h-8 text-neutral-500 mb-2" />
                {isCapturing ? (
                  <div className="text-center py-2">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-xs font-mono text-primary animate-pulse uppercase">Accessing simulated webcam feed... hold steady...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-xs font-bold text-neutral-350">Device Web Camera Activation required</p>
                    <p className="text-[11px] text-neutral-500 mt-1">Keep stable lighting and follow center screen alignment directions</p>
                    <button 
                      onClick={simulateSelfieCapture}
                      className="mt-3 px-4 py-1.5 bg-[#ffdebf] hover:bg-[#fdba74] text-[#492900] font-extrabold text-xs rounded shadow active:scale-95 transition-all font-mono uppercase tracking-wider glow-primary-sm"
                    >
                      Activate Camera Liveness Test
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'phone' && (
          <div className="space-y-4 text-left">
            <h3 className="text-sm font-semibold text-white font-mono uppercase">SMS Phone Authentication</h3>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xl">
              Securely associate your legal phone line. Restricts fraudulent multi-account creation and handles booking notification reminders safely.
            </p>

            {currentVerification.phone === 'verified' ? (
              <div className="bg-primary/5 rounded p-4 border border-primary/20 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-xs font-bold text-white uppercase font-mono">SMS verified: {phoneNumber}</p>
                  <p className="text-[11px] text-[#9e8e80] font-mono">Authenticated. Authorized for secure smart calendar alerts.</p>
                </div>
              </div>
            ) : isVerifyingPhone ? (
              <form onSubmit={handleVerifyPhoneSubmit} className="space-y-3">
                <p className="text-xs text-neutral-350">
                  Verification script sent a code to <span className="text-primary font-mono">{phoneNumber}</span>. Enter code below:
                </p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter 7777"
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value)}
                    className="bg-surface border border-outline-variant text-white font-mono px-3 py-1.5 rounded text-sm w-36 outline-none focus:border-primary text-center"
                    maxLength={4}
                  />
                  <button 
                    type="submit"
                    className="bg-[#ffdebf] hover:bg-[#fdba74] text-[#492900] font-bold px-4 py-1.5 rounded text-xs font-mono uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-primary inline-flex items-center gap-1 glow-primary-sm"
                  >
                    Confirm Code
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsVerifyingPhone(false)}
                    className="text-neutral-400 font-bold px-2 py-1.5 hover:text-white text-xs font-mono uppercase"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-[10px] text-primary/85 font-mono font-medium block">✨ Tip: Enter &quot;7777&quot; to satisfy verification simulator checks.</p>
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                <input 
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-surface border border-outline-variant px-3 py-2 rounded text-xs text-white flex-grow font-mono outline-none focus:border-primary"
                />
                <button 
                  onClick={() => setIsVerifyingPhone(true)}
                  className="px-4 py-2 bg-[#ffdebf] hover:bg-[#fdba74] text-[#492900] font-extrabold text-xs rounded shadow active:scale-95 font-mono uppercase tracking-wider glow-primary-sm"
                >
                  Send Verification SMS
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'credential' && userType === 'provider' && (
          <div className="space-y-4 text-left">
            <h3 className="text-sm font-semibold text-white font-mono uppercase">Accreditations &amp; Licenses</h3>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xl">
              Service providers claim specialized status badges (such as Luxury Companion, Licensed Masseuse, Yacht Skipper, or Financial Mentor) by submitting legitimate credentials.
            </p>

            {currentVerification.professionalCredential === 'verified' ? (
              <div className="bg-primary/5 rounded p-4 border border-primary/20 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-xs font-bold text-white uppercase font-mono">Professional Credentials Verified</p>
                  <p className="text-[11px] text-[#9e8e80] font-mono">Assigned Provider Trust Status: legal elite practitioner.</p>
                </div>
              </div>
            ) : currentVerification.professionalCredential === 'pending' ? (
              <div className="bg-primary/5 rounded p-4 border border-primary/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-primary border-t-transparent animate-spin shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white font-mono font-semibold uppercase">CREDENTIAL TRANSCRIPT PENDING AUDIT</p>
                    <p className="text-[11px] text-[#d6c3b4]">State license credentials being verified by review board.</p>
                  </div>
                </div>
                <button 
                  onClick={() => onUpdateVerification({ professionalCredential: 'verified' })}
                  className="px-3.5 py-1.5 bg-[#ffdebf] hover:bg-[#fdba74] text-[#492900] font-bold text-xs rounded font-mono uppercase tracking-wide"
                >
                  Admit Verification
                </button>
              </div>
            ) : (
              <div 
                onClick={() => credentialInputRef.current?.click()}
                className="border border-dashed border-outline-variant p-6 rounded text-center bg-black/20 cursor-pointer hover:border-primary/50 transition-colors"
              >
                <input 
                  type="file"
                  ref={credentialInputRef}
                  onChange={handleCredentialFileChange}
                  accept="image/*,application/pdf"
                  className="hidden"
                />
                <FileText className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-neutral-350">Upload Professional Credentials or Licenses</p>
                <p className="text-[10px] text-neutral-500 mt-1">Accepts PDF, image formats. Click to browse local files 📁</p>
                
                <div className="flex gap-2 justify-center mt-3">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      credentialInputRef.current?.click();
                    }}
                    className="px-3.5 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary hover:text-white text-xs font-mono font-bold rounded border border-primary/30 active:scale-95 uppercase tracking-wider"
                  >
                    Browse Local File 📁
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateVerification({ professionalCredential: 'pending' });
                    }}
                    className="px-3.5 py-1.5 bg-[#2c2a27] hover:bg-[#373432] text-neutral-200 text-xs font-bold rounded font-mono border border-outline-variant active:scale-95 uppercase tracking-wider"
                  >
                    Submit Test Info
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'background' && userType === 'provider' && (
          <div className="space-y-4 text-left">
            <h3 className="text-sm font-semibold text-white font-mono uppercase">Comprehensive Background Check</h3>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xl">
              To ensure safety and quality on our platform, all providers must pass a comprehensive background check. A processing fee of $49 is required prior to initiating the review.
            </p>

            {currentVerification.backgroundCheck === 'verified' ? (
              <div className="bg-primary/5 rounded p-4 border border-primary/20 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-xs font-bold text-white uppercase font-mono">Background Check Approved</p>
                  <p className="text-[11px] text-[#9e8e80] font-mono">Status: Cleared. All security conditions met.</p>
                </div>
              </div>
            ) : currentVerification.backgroundCheck === 'pending' ? (
              <div className="bg-primary/5 rounded p-4 border border-primary/20 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-primary border-t-transparent animate-spin shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white font-mono uppercase">BACKGROUND INVESTIGATION PENDING</p>
                    <p className="text-[11px] text-[#d6c3b4]">Fee paid. Our security partners are processing your background data.</p>
                  </div>
                </div>
                <button 
                  onClick={() => onUpdateVerification({ backgroundCheck: 'verified' })}
                  className="w-full sm:w-auto self-start px-3.5 py-1.5 bg-[#ffdebf] hover:bg-[#fdba74] text-[#492900] font-bold text-xs rounded font-mono uppercase tracking-wide"
                >
                  Approve Background Check
                </button>
              </div>
            ) : (
              <div className="border border-outline-variant p-6 rounded bg-[#100e0c]/50">
                <h4 className="text-white font-bold text-sm mb-4">Background Processing Fee: <span className="text-primary font-mono">$49.00</span></h4>
                <div className="space-y-3 mb-5">
                  <input type="text" placeholder="Cardholder Name" className="w-full bg-[#100e0c] border border-outline-variant px-3 py-2 rounded text-xs text-white" />
                  <div className="flex gap-3">
                    <input type="text" placeholder="Card Number (0000 0000 0000 0000)" className="w-2/3 bg-[#100e0c] border border-outline-variant px-3 py-2 rounded text-xs text-white" />
                    <input type="text" placeholder="MM/YY" className="w-1/6 bg-[#100e0c] border border-outline-variant px-3 py-2 rounded text-xs text-white" />
                    <input type="text" placeholder="CVC" className="w-1/6 bg-[#100e0c] border border-outline-variant px-3 py-2 rounded text-xs text-white" />
                  </div>
                </div>
                
                <div 
                  onClick={() => credentialInputRef.current?.click()}
                  className="border border-dashed border-outline-variant p-5 rounded text-center cursor-pointer hover:border-primary/50 transition-colors mb-5 bg-[#0a0908]"
                >
                  <p className="text-xs font-bold text-neutral-350">Upload Authorization Consent Forms (Optional)</p>
                  <p className="text-[10px] text-neutral-500 mt-1">Accepts PDF, JPG formats 📁</p>
                </div>
                
                <button 
                  onClick={() => onUpdateVerification({ backgroundCheck: 'pending' })}
                  className="w-full py-2.5 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs rounded shadow uppercase font-mono tracking-wider glow-primary-sm"
                >
                  Pay $49.00 &amp; Submit For Review
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Simulator Actions */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between p-3.5 rounded bg-primary/10 border border-primary/25 gap-3">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary" />
          <span className="text-[9px] font-bold text-primary uppercase tracking-wider font-mono">Sandbox Developer mode active</span>
        </div>
        <button 
          onClick={autoVerifyAll}
          className="text-[10px] sm:text-xs font-extrabold font-mono px-3.5 py-2 bg-[#ffdebf] hover:bg-[#fdba74] text-[#492900] rounded shadow-md transition-all active:scale-95 uppercase tracking-wider"
        >
          🔑 Auto-Verify All Levels Instantly (Simulator)
        </button>
      </div>

    </div>
  );
};
export default VerificationCenter;
