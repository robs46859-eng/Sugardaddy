import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Falls back to the known project config if VITE_FIREBASE_* build-time env vars
// aren't available (e.g. hosting platforms that don't expose env vars to the
// build step, only to the running server process). Firebase web API keys are
// meant to be public client identifiers, so this fallback is safe.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAM3MRgX18M462llRdtMiWkNj5JtDwCVBU',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'vertex1-490112.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'vertex1-490112',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'vertex1-490112.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '899325565183',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:899325565183:web:9e12b76afcdff11b9154ca'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure Google provider with workspace scopes once at init
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive.file');
googleAuthProvider.addScope('https://www.googleapis.com/auth/calendar.events');
googleAuthProvider.addScope('https://www.googleapis.com/auth/forms.body');
googleAuthProvider.addScope('https://www.googleapis.com/auth/contacts');
