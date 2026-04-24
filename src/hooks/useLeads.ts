import { useCallback, useEffect, useState } from 'react';
import { reportAppError } from '@/lib/appError';
import { getDb, isFirebaseConfigured } from '@/lib/firebase';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  service: string;
  trackingCode: string;
  details?: string;
  price?: number;
  timestamp: string;
  source: 'contact_form' | 'price_calculator' | 'booking_system';
  status: 'new' | 'contacted' | 'completed';
}

type UseLeadsOptions = {
  subscribe?: boolean;
};

const createTrackingCode = () => {
  const token = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `FT-${token}`;
};

export const useLeads = ({ subscribe = true }: UseLeadsOptions = {}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(subscribe);

  useEffect(() => {
    if (!subscribe || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;
    let mounted = true;

    const setupSubscription = async () => {
      try {
        const db = await getDb();
        const { collection, onSnapshot, orderBy, query } = await import('firebase/firestore');
        const leadsQuery = query(collection(db, 'leads'), orderBy('timestamp', 'desc'));

        unsubscribe = onSnapshot(
          leadsQuery,
          (snapshot) => {
            if (!mounted) return;
            const leadsData = snapshot.docs.map((leadDoc) => ({
              id: leadDoc.id,
              ...leadDoc.data(),
            })) as Lead[];
            setLeads(leadsData);
            setLoading(false);
          },
          (error) => {
            reportAppError({ scope: 'leads-subscribe', error });
            if (mounted) {
              setLoading(false);
            }
          }
        );
      } catch (error) {
        reportAppError({ scope: 'leads-subscribe-init', error });
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void setupSubscription();

    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, [subscribe]);

  const saveLead = useCallback(
    async (
      leadData: Omit<Lead, 'id' | 'timestamp' | 'status' | 'trackingCode'>
    ): Promise<Pick<Lead, 'id' | 'trackingCode'>> => {
      const timestamp = new Date().toISOString();
      const trackingCode = createTrackingCode();

      if (!isFirebaseConfigured) {
        return {
          id: crypto.randomUUID(),
          trackingCode,
        };
      }

      try {
        const db = await getDb();
        const { addDoc, collection } = await import('firebase/firestore');
        const docRef = await addDoc(collection(db, 'leads'), {
          ...leadData,
          trackingCode,
          timestamp,
          status: 'new',
        });

        return { id: docRef.id, trackingCode };
      } catch (error) {
        reportAppError({ scope: 'leads-save', error });
        throw error;
      }
    },
    []
  );

  const deleteLead = useCallback(async (id: string) => {
    if (!isFirebaseConfigured) return;

    try {
      const db = await getDb();
      const { deleteDoc, doc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'leads', id));
    } catch (error) {
      reportAppError({ scope: 'leads-delete', error });
      throw error;
    }
  }, []);

  const updateLeadStatus = useCallback(async (id: string, status: Lead['status']) => {
    if (!isFirebaseConfigured) return;

    try {
      const db = await getDb();
      const { doc, updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'leads', id), { status });
    } catch (error) {
      reportAppError({ scope: 'leads-status', error });
      throw error;
    }
  }, []);

  return {
    leads,
    loading,
    saveLead,
    deleteLead,
    updateLeadStatus,
  };
};
