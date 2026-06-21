import React, { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup 
} from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { Mail, Lock, User, Sparkles, Check, X, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { Role } from '../types';

interface AuthPortalProps {
  onAuthSuccess: (firebaseUser: any, name: string, role: Role, token?: string) => void;
}

export default function AuthPortal({ onAuthSuccess }: AuthPortalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('customer');
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Password Validation States
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);

  useEffect(() => {
    setHasMinLength(password.length >= 8);
    setHasUppercase(/[A-Z]/.test(password));
    // check for special characters
    setHasSpecialChar(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password));
  }, [password]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        // Validation Checks
        if (!fullName.trim()) {
          throw new Error('Please enter your full name.');
        }
        if (!hasMinLength || !hasUppercase || !hasSpecialChar) {
          throw new Error('Password does not meet all security guidelines.');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }

        // Firebase registration
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        const idToken = await firebaseUser.getIdToken();

        // Sync with postgres via props callback
        onAuthSuccess(firebaseUser, fullName, selectedRole, idToken);
      } else {
        // Firebase login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        const idToken = await firebaseUser.getIdToken();
        
        // Sync with postgres via props callback
        onAuthSuccess(firebaseUser, firebaseUser.displayName || '', 'customer', idToken);
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || 'An authentication error occurred.';
      if (err.code === 'auth/email-already-in-use') {
        errMsg = 'This email address is already registered.';
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        errMsg = 'Invalid email or password.';
      } else if (err.code === 'auth/invalid-credential') {
        errMsg = 'Incorrect email or password combination.';
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      // workspace scopes
      googleAuthProvider.addScope('https://www.googleapis.com/auth/drive.file');
      googleAuthProvider.addScope('https://www.googleapis.com/auth/calendar.events');
      googleAuthProvider.addScope('https://www.googleapis.com/auth/forms.body');
      googleAuthProvider.addScope('https://www.googleapis.com/auth/contacts');

      const result = await signInWithPopup(auth, googleAuthProvider);
      const credential = (result as any)._credentials || {};
      const token = (result as any).accessToken || credential.accessToken;
      
      const firebaseUser = result.user;
      
      onAuthSuccess(firebaseUser, firebaseUser.displayName || '', 'customer', token);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Google sign-in abort or error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Decorative luxury sparkles backdrop */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-zinc-900 border border-zinc-800 rounded-2xl mb-4">
            <Sparkles className="h-8 w-8 text-amber-500 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-serif">LUXE HUB</h1>
          <p className="mt-2 text-sm text-zinc-400">
            {isSignUp ? 'Create your premium account' : 'Access your luxury business engine'}
          </p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl space-y-6">
          {error && (
            <div className="bg-red-950/40 border border-red-800/80 rounded-xl p-4 flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                      <User className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Marcus Sterling"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('customer')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold font-mono transition-all uppercase tracking-wider ${
                        selectedRole === 'customer'
                          ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                      }`}
                    >
                      Client / Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('provider')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold font-mono transition-all uppercase tracking-wider ${
                        selectedRole === 'provider'
                          ? 'bg-purple-500/10 border-purple-500 text-purple-400'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                      }`}
                    >
                      Luxe Provider
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@luxury.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignUp ? 'Create strong password' : '••••••••'}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Password Constraints Tracker */}
                <div className="bg-zinc-950 p-4 border border-zinc-800/60 rounded-xl space-y-2 mt-2">
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider font-mono">
                    Password Checklist
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-medium font-mono">
                    <div className="flex items-center gap-2">
                      {hasMinLength ? (
                        <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                      )}
                      <span className={hasMinLength ? 'text-zinc-300' : 'text-zinc-650'}>
                        At least 8 chars
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasUppercase ? (
                        <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                      )}
                      <span className={hasUppercase ? 'text-zinc-300' : 'text-zinc-650'}>
                        1 uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-2">
                      {hasSpecialChar ? (
                        <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                      )}
                      <span className={hasSpecialChar ? 'text-zinc-300' : 'text-zinc-650'}>
                        1 special char (!, @, #, $, etc.)
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-250 cursor-pointer text-center"
            >
              {loading ? 'Processing Hub Node...' : isSignUp ? 'Initiate Register Connection' : 'Connect Private Key'}
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink mx-4 text-zinc-500 text-xs font-mono">OR</span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          {/* Elegant Sign-in with Google */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-250 flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-4 w-4 shrink-0">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            </svg>
            Sign In with Google
          </button>

          <p className="text-center text-xs text-zinc-500 font-mono mt-4">
            {isSignUp ? 'Already have an invitation?' : "Don't have an account yet?"}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-amber-500 hover:underline hover:text-amber-400 font-bold ml-1 focus:outline-none"
            >
              {isSignUp ? 'Connect Profile' : 'Request Registry'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
