import { useState, useCallback } from 'react';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  service: string;
  details?: string;
  price?: number;
  timestamp: string;
  source: 'contact_form' | 'price_calculator';
  status: 'new' | 'contacted' | 'completed';
}

const STORAGE_KEY = 'forty_captured_leads';

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const saveLead = useCallback((leadData: Omit<Lead, 'id' | 'timestamp' | 'status'>) => {
    const newLead: Lead = {
      ...leadData,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      status: 'new',
    };

    setLeads((prev) => {
      const updated = [newLead, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    return newLead;
  }, []);

  const deleteLead = useCallback((id: string) => {
    setLeads((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateLeadStatus = useCallback((id: string, status: Lead['status']) => {
    setLeads((prev) => {
      const updated = prev.map((l) => (l.id === id ? { ...l, status } : l));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearAllLeads = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setLeads([]);
  }, []);

  return {
    leads,
    saveLead,
    deleteLead,
    updateLeadStatus,
    clearAllLeads,
  };
};
