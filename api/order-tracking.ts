import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

interface OrderTrackingRequestBody {
  phone?: string;
  trackingCode?: string;
}

interface ServerRequest {
  method?: string;
  body?: OrderTrackingRequestBody;
  headers?: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}

interface ServerResponse {
  status: (code: number) => ServerResponse;
  json: (payload: unknown) => void;
}

type RateLimitEntry = { count: number; resetAt: number };

const rateLimitStore = new Map<string, RateLimitEntry>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;

const getClientIp = (req: ServerRequest) => {
  const xForwardedFor = req.headers?.['x-forwarded-for'];
  if (typeof xForwardedFor === 'string' && xForwardedFor.length > 0) {
    return xForwardedFor.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
};

const isRateLimited = (ip: string) => {
  const now = Date.now();
  const current = rateLimitStore.get(ip);

  if (!current || current.resetAt < now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) return true;

  current.count += 1;
  rateLimitStore.set(ip, current);
  return false;
};

const ensureFirebaseAdmin = () => {
  if (getApps().length > 0) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
  const privateKey = privateKeyRaw?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY');
  }

  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
};

export default async function handler(req: ServerRequest, res: ServerResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({ message: 'Too many requests. Please try again later.' });
  }

  const phone = req.body?.phone?.replace(/\D/g, '') || '';
  const trackingCode = req.body?.trackingCode?.trim().toUpperCase() || '';

  if (phone.length !== 8 || trackingCode.length < 5) {
    return res.status(400).json({ message: 'Invalid phone or tracking code.' });
  }

  try {
    ensureFirebaseAdmin();
    const db = getFirestore();

    const snapshot = await db
      .collection('leads')
      .where('trackingCode', '==', trackingCode)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(200).json({ orders: [] });
    }

    const doc = snapshot.docs[0];
    const data = doc.data() as {
      phone?: string;
      service?: string;
      status?: string;
      timestamp?: string;
      trackingCode?: string;
    };

    if (data.phone !== phone) {
      return res.status(200).json({ orders: [] });
    }

    return res.status(200).json({
      orders: [
        {
          id: doc.id,
          service: data.service || '',
          status: data.status || 'new',
          timestamp: data.timestamp || '',
          trackingCode: data.trackingCode || trackingCode,
        },
      ],
    });
  } catch (error) {
    console.error('Order tracking API error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
