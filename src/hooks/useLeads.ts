import { useState, useCallback, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  service: string;
  details?: string;
  price?: number;
  timestamp: string;
  source: 'contact_form' | 'price_calculator' | 'booking_system';
  status: 'new' | 'contacted' | 'completed';
}

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'leads'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Lead[];
      setLeads(leadsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching leads:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveLead = useCallback(async (leadData: Omit<Lead, 'id' | 'timestamp' | 'status'>) => {
    try {
      const newLead = {
        ...leadData,
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
      await deleteDoc(doc(db, 'leads', id));
    } catch (error) {
      console.error("Error deleting lead:", error);
      throw error;
    }
  }, []);

  const updateLeadStatus = useCallback(async (id: string, status: Lead['status']) => {
    try {
      await updateDoc(doc(db, 'leads', id), { status });
    } catch (error) {
      console.error("Error updating lead status:", error);
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
