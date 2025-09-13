import { useState, useEffect, useCallback } from 'react';
import { leadAPI } from '../services/api';

export const useLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const response = await leadAPI.getAll();
      setLeads(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Failed to load leads. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const refreshLeads = useCallback(() => {
    fetchLeads();
  }, [fetchLeads]);

  return { leads, loading, error, refreshLeads };
};