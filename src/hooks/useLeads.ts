import { useState, useCallback, useEffect } from 'react';
import { getDb } from '@/lib/firebase';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  trackingCode: string;
  service: string;
  details?: string;
  price?: number;
  timestamp: string;
  source: 'contact_form' | 'price_calculator' | 'booking_system';
  status: 'new' | 'contacted' | 'completed';
}

interface UseLeadsOptions {
  subscribe?: boolean;
  limitCount?: number;
}

const generateTrackingCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const randomPart = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `FT-${randomPart}`;
};

export const useLeads = ({ subscribe = false, limitCount = 100 }: UseLeadsOptions = {}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const loading = isFetching;

  const loadLeads = useCallback(async () => {
    setIsFetching(true);
    try {
      const db = await getDb();
      const { collection, getDocs, limit, orderBy, query } = await import('firebase/firestore');
      const q = query(collection(db, 'leads'), orderBy('timestamp', 'desc'), limit(limitCount));
      const snapshot = await getDocs(q);
      const leadsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Lead[];
      setLeads(leadsData);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setIsFetching(false);
    }
  }, [limitCount]);

  useEffect(() => {
    if (!subscribe) return;
    loadLeads();
  }, [loadLeads, subscribe]);

  const saveLead = useCallback(async (leadData: Omit<Lead, 'id' | 'timestamp' | 'status' | 'trackingCode'>) => {
    try {
      const db = await getDb();
      const { addDoc, collection } = await import('firebase/firestore');
      const newLead = {
        ...leadData,
        trackingCode: generateTrackingCode(),
        timestamp: new Date().toISOString(),
        status: 'new',
      };
      const docRef = await addDoc(collection(db, 'leads'), newLead);
      return { id: docRef.id, ...newLead };
    } catch (error) {
      console.error("Error saving lead:", error);
      throw error;
    }
  }, []);

  const deleteLead = useCallback(async (id: string) => {
    try {
      const db = await getDb();
      const { deleteDoc, doc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'leads', id));
    } catch (error) {
      console.error("Error deleting lead:", error);
      throw error;
    }
  }, []);

  const updateLeadStatus = useCallback(async (id: string, status: Lead['status']) => {
    try {
      const db = await getDb();
      const { updateDoc, doc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'leads', id), { status });
    } catch (error) {
      console.error("Error updating lead status:", error);
      throw error;
    }
  }, []);

  return {
    leads,
    loading,
    loadLeads,
    saveLead,
    deleteLead,
    updateLeadStatus,
  };
};
