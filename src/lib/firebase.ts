import { initializeApp } from "firebase/app";
import { reportAppError } from './appError';

const envConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

export const isFirebaseConfigured = Object.values(envConfig).every(
  (value) => Boolean(value && !value.startsWith('YOUR_'))
);

/**
 * Firebase config is sourced from Vite environment variables.
 * Placeholder fallbacks keep the app buildable until real values are provided.
 */
const firebaseConfig = {
  apiKey: envConfig.apiKey || "YOUR_API_KEY",
  authDomain: envConfig.authDomain || "YOUR_AUTH_DOMAIN",
  projectId: envConfig.projectId || "YOUR_PROJECT_ID",
  storageBucket: envConfig.storageBucket || "YOUR_STORAGE_BUCKET",
  messagingSenderId: envConfig.messagingSenderId || "YOUR_MESSAGING_SENDER_ID",
  appId: envConfig.appId || "YOUR_APP_ID"
};

if (!isFirebaseConfigured) {
  console.warn('Firebase config is missing. Set VITE_FIREBASE_* variables to enable live data.');
}

const app = initializeApp(firebaseConfig);

let firestorePromise: Promise<import('firebase/firestore').Firestore> | undefined;
let authPromise: Promise<import('firebase/auth').Auth> | undefined;

export const getDb = async () => {
  if (!firestorePromise) {
    firestorePromise = import('firebase/firestore').then(({ getFirestore }) => getFirestore(app));
  }
  return firestorePromise;
};

export const getFirebaseAuth = async () => {
  if (!authPromise) {
    authPromise = import('firebase/auth').then(({ getAuth }) => getAuth(app));
  }
  return authPromise;
};

export async function signInWithFirebaseCustomToken(customToken: string) {
  const auth = await getFirebaseAuth();
  const { signInWithCustomToken } = await import('firebase/auth');
  return signInWithCustomToken(auth, customToken);
}

export type AdminClaims = {
  isAdmin: boolean;
  role: string | null;
};

export async function getAdminClaims(user?: import('firebase/auth').User | null): Promise<AdminClaims> {
  const auth = await getFirebaseAuth();
  const targetUser = user ?? auth.currentUser;

  if (!targetUser) {
    return { isAdmin: false, role: null };
  }

  const { getIdTokenResult } = await import('firebase/auth');
  const tokenResult = await getIdTokenResult(targetUser);
  const role = typeof tokenResult.claims.role === 'string' ? tokenResult.claims.role : null;

  return {
    isAdmin: tokenResult.claims.admin === true || role === 'admin',
    role,
  };
}

export async function createCustomer(name: string, phone: string) {
  const trimmedName = name.trim();
  const trimmedPhone = phone.trim();

  if (!trimmedName || !trimmedPhone) {
    throw new Error('Customer name and phone are required.');
  }

  const auth = await getFirebaseAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('You must be signed in to create customers.');
  }

  const db = await getDb();
  const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
  const docRef = await addDoc(collection(db, 'customers'), {
    name: trimmedName,
    phone: trimmedPhone,
    createdAt: serverTimestamp(),
    userId: currentUser.uid,
    status: 'new',
  });

  return docRef.id;
}

export async function getCustomers() {
  try {
    const auth = await getFirebaseAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return [];
    }

    const db = await getDb();
    const { Timestamp, collection, getDocs, query, where } = await import('firebase/firestore');
    const customersQuery = query(
      collection(db, 'customers'),
      where('userId', '==', currentUser.uid)
    );
    const querySnapshot = await getDocs(customersQuery);

    const customers = querySnapshot.docs
      .map((doc): { id: string; createdAt?: unknown; [key: string]: unknown } => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a, b) => {
        const aCreatedAt = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : 0;
        const bCreatedAt = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : 0;
        return bCreatedAt - aCreatedAt;
      });

    return customers;
  } catch (error) {
    reportAppError({ scope: 'firebase-get-customers', error });
    return [];
  }
}

export default app;
