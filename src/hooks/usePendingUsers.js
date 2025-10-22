import { useState, useEffect } from 'react';
import { getPendingUsers } from '../services/api';

export const usePendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPendingUsers();
      setPendingUsers(data);
    } catch (err) {
      setError(err);
      console.error('Error fetching pending users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const refetch = () => {
    fetchPendingUsers();
  };

  return {
    pendingUsers,
    loading,
    error,
    refetch
  };
};
