import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "AIzaSyBkjUzjpN-YnYwsTjuLbwFYTlqTe9q0gnU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "agendamento-ai-9fbfb.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "agendamento-ai-9fbfb",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "agendamento-ai-9fbfb.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "1036033907338",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "1:1036033907338:web:6b5ca70db2b28cd67c6b73",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? "G-Q0MJQPDW6Z"
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);

export const firebaseApp = hasFirebaseConfig ? initializeApp(firebaseConfig) : null;
export const firestore = firebaseApp ? getFirestore(firebaseApp) : null;
export const useMockApi = import.meta.env.VITE_ENABLE_MOCK_API === 'true' || !firestore;
