import React, { createContext, useContext, useState, useEffect } from 'react';

const FarmContext = createContext();

export function FarmProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [vetRecords, setVetRecords] = useState([]);
  const [feedStock, setFeedStock] = useState([]);
  const [feedPlans, setFeedPlans] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  // --- Loader States ---
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isMutating, setIsMutating] = useState(false);

  // Helper to start loading bar
  const simulateProgress = () => {
    setIsGlobalLoading(true);
    setLoadingProgress(10);
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);
    return interval;
  };

  // Helper to complete loading bar
  const endProgress = (interval) => {
    if (interval) clearInterval(interval);
    setLoadingProgress(100);
    setTimeout(() => {
      setIsGlobalLoading(false);
      setLoadingProgress(0);
    }, 300);
  };

  // --- API Loaders ---
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchAnimals = async () => {
    try {
      const res = await fetch('/api/animals');
      if (res.ok) {
        const data = await res.json();
        setAnimals(data);
      }
    } catch (err) {
      console.error("Error fetching animals:", err);
    }
  };

  const fetchVetRecords = async () => {
    try {
      const res = await fetch('/api/vet-records');
      if (res.ok) {
        const data = await res.json();
        setVetRecords(data);
      }
    } catch (err) {
      console.error("Error fetching vet records:", err);
    }
  };

  const fetchFeedStock = async () => {
    try {
      const res = await fetch('/api/feed-stock');
      if (res.ok) {
        const data = await res.json();
        setFeedStock(data);
      }
    } catch (err) {
      console.error("Error fetching feed stock:", err);
    }
  };

  const fetchFeedPlans = async () => {
    try {
      const res = await fetch('/api/feed-plans');
      if (res.ok) {
        const data = await res.json();
        setFeedPlans(data);
      }
    } catch (err) {
      console.error("Error fetching feed plans:", err);
    }
  };

  // Centralized initial load to handle skeletons and top progress bar
  const loadAllData = async () => {
    setIsInitialLoading(true);
    const p = simulateProgress();
    try {
      await Promise.all([
        fetchUsers(),
        fetchAnimals(),
        fetchVetRecords(),
        fetchFeedStock(),
        fetchFeedPlans()
      ]);
    } catch (err) {
      console.error("Error loading initial data:", err);
    } finally {
      setIsInitialLoading(false);
      endProgress(p);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Sync currentUser session to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // --- Authentication actions ---
  const login = async (username, password) => {
    const p = simulateProgress();
    setIsMutating(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setCurrentUser(result.user);
        return { success: true };
      }
      return { success: false, message: result.message || 'Kirishda xatolik yuz berdi!' };
    } catch (err) {
      return { success: false, message: 'Server bilan aloqa uzildi!' };
    } finally {
      setIsMutating(false);
      endProgress(p);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateSelfProfile = async (updatedFields) => {
    if (!currentUser) return;
    const p = simulateProgress();
    setIsMutating(true);
    try {
      const res = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      const result = await res.json();
      if (res.ok) {
        setCurrentUser(result);
        await fetchUsers(); // Sync list
      } else {
        throw new Error(result.message || 'Profilni saqlab boʻlmadi!');
      }
    } catch (err) {
      throw new Error(err.message);
    } finally {
      setIsMutating(false);
      endProgress(p);
    }
  };

  // --- Animal actions ---
  const addAnimal = async (animalData) => {
    const p = simulateProgress();
    setIsMutating(true);
    try {
      const res = await fetch('/api/animals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(animalData)
      });
      if (res.ok) {
        const created = await res.json();
        setAnimals(prev => [...prev, created]);
        await fetchAnimals(); // Refresh list to get proper Tag IDs from DB
        return created;
      }
    } catch (err) {
      console.error("Error adding animal:", err);
    } finally {
      setIsMutating(false);
      endProgress(p);
    }
  };

  const updateAnimal = async (id, fields) => {
    const p = simulateProgress();
    setIsMutating(true);
    try {
      const res = await fetch(`/api/animals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      });
      if (res.ok) {
        const updated = await res.json();
        setAnimals(prev => prev.map(a => a.id === id ? updated : a));
        await fetchAnimals();
      }
    } catch (err) {
      console.error("Error updating animal:", err);
    } finally {
      setIsMutating(false);
      endProgress(p);
    }
  };

  const deleteAnimal = async (id) => {
    const p = simulateProgress();
    setIsMutating(true);
    try {
      const res = await fetch(`/api/animals/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAnimals(prev => prev.filter(a => a.id !== id));
        await fetchAnimals();
        await fetchVetRecords(); // cascade delete updates
      }
    } catch (err) {
      console.error("Error deleting animal:", err);
    } finally {
      setIsMutating(false);
      endProgress(p);
    }
  };

  // --- Vet Records actions ---
  const addVetRecord = async (recordData) => {
    const p = simulateProgress();
    setIsMutating(true);
    try {
      const res = await fetch('/api/vet-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData)
      });
      if (res.ok) {
        const created = await res.json();
        setVetRecords(prev => [created, ...prev]);
        await fetchVetRecords();
        await fetchAnimals(); // Reactive status changes
        return created;
      }
    } catch (err) {
      console.error("Error adding vet record:", err);
    } finally {
      setIsMutating(false);
      endProgress(p);
    }
  };

  const updateVetRecord = async (id, fields) => {
    const p = simulateProgress();
    setIsMutating(true);
    try {
      const res = await fetch(`/api/vet-records/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      });
      if (res.ok) {
        const updated = await res.json();
        setVetRecords(prev => prev.map(r => r.id === id ? updated : r));
        await fetchVetRecords();
        await fetchAnimals(); // Reactive status resolution
      }
    } catch (err) {
      console.error("Error updating vet record:", err);
    } finally {
      setIsMutating(false);
      endProgress(p);
    }
  };

  const deleteVetRecord = async (id) => {
    const p = simulateProgress();
    setIsMutating(true);
    try {
      const res = await fetch(`/api/vet-records/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setVetRecords(prev => prev.filter(r => r.id !== id));
        await fetchVetRecords();
      }
    } catch (err) {
      console.error("Error deleting vet record:", err);
    } finally {
      setIsMutating(false);
      endProgress(p);
    }
  };

  // --- Feed Stock actions ---
  const refillFeedStock = async (name, amount, price) => {
    const p = simulateProgress();
    setIsMutating(true);
    try {
      const res = await fetch('/api/feed-stock/refill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, amount, price })
      });
      if (res.ok) {
        const updated = await res.json();
        setFeedStock(prev => prev.map(item => item.name === name ? updated : item));
        await fetchFeedStock();
      }
    } catch (err) {
      console.error("Error refilling feed stock:", err);
    } finally {
      setIsMutating(false);
      endProgress(p);
    }
  };

  const addFeedStock = async (stockData) => {
    const p = simulateProgress();
    setIsMutating(true);
    try {
      const res = await fetch('/api/feed-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stockData)
      });
      const created = await res.json();
      if (res.ok) {
        setFeedStock(prev => [...prev, created]);
        await fetchFeedStock();
        return created;
      } else {
        throw new Error(created.message || 'Ozuqa turi qoʻshib boʻlmadi!');
      }
    } catch (err) {
      throw new Error(err.message);
    } finally {
      setIsMutating(false);
      endProgress(p);
    }
  };

  const updateFeedStock = async (name, fields) => {
    const p = simulateProgress();
    setIsMutating(true);
    try {
      const res = await fetch(`/api/feed-stock/${encodeURIComponent(name)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      });
      const updated = await res.json();
      if (res.ok) {
        setFeedStock(prev => prev.map(item => item.name === name ? updated : item));
        await fetchFeedStock();
        return updated;
      } else {
        throw new Error(updated.message || 'Ozuqa zaxirasi yangilab boʻlmadi!');
      }
    } catch (err) {
      throw new Error(err.message);
    } finally {
      setIsMutating(false);
      endProgress(p);
    }
  };

  const deleteFeedStock = async (name) => {
    const p = simulateProgress();
    setIsMutating(true);
    try {
      const res = await fetch(`/api/feed-stock/${encodeURIComponent(name)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setFeedStock(prev => prev.filter(item => item.name !== name));
        await fetchFeedStock();
      } else {
        const result = await res.json();
        throw new Error(result.message || 'Ozuqa turi oʻchirib boʻlmadi!');
      }
    } catch (err) {
      throw new Error(err.message);
    } finally {
      setIsMutating(false);
      endProgress(p);
    }
  };

  // --- Feed Plans actions ---
  const addFeedPlan = async (planData) => {
    const p = simulateProgress();
    setIsMutating(true);
    try {
      const res = await fetch('/api/feed-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData)
      });
      if (res.ok) {
        const created = await res.json();
        setFeedPlans(prev => [...prev, created]);
        await fetchFeedPlans();
        return created;
      }
    } catch (err) {
      console.error("Error adding feed plan:", err);
    } finally {
      setIsMutating(false);
      endProgress(p);
    }
  };

  const updateFeedPlan = async (id, fields) => {
    const p = simulateProgress();
    setIsMutating(true);
    try {
      const res = await fetch(`/api/feed-plans/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      });
      if (res.ok) {
        const updated = await res.json();
        setFeedPlans(prev => prev.map(p => p.id === id ? updated : p));
        await fetchFeedPlans();
      }
    } catch (err) {
      console.error("Error updating feed plan:", err);
    } finally {
      setIsMutating(false);
      endProgress(p);
    }
  };

  const deleteFeedPlan = async (id) => {
    const p = simulateProgress();
    setIsMutating(true);
    try {
      const res = await fetch(`/api/feed-plans/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFeedPlans(prev => prev.filter(p => p.id !== id));
        await fetchFeedPlans();
      }
    } catch (err) {
      console.error("Error deleting feed plan:", err);
    } finally {
      setIsMutating(false);
      endProgress(p);
    }
  };

  const consumeFeedStock = async (items) => {
    const p = simulateProgress();
    setIsMutating(true);
    try {
      const res = await fetch('/api/feed-stock/consume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });
      const result = await res.json();
      if (res.ok) {
        await fetchFeedStock();
        return { success: true };
      } else {
        throw new Error(result.message || 'Ozuqani sarflab boʻlmadi!');
      }
    } catch (err) {
      throw new Error(err.message);
    } finally {
      setIsMutating(false);
      endProgress(p);
    }
  };

  // --- User CRUD actions (for AdminPanel) ---
  const addUser = async (userData) => {
    const p = simulateProgress();
    setIsMutating(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const result = await res.json();
      if (res.ok) {
        setUsers(prev => [...prev, result]);
        await fetchUsers();
        return result;
      } else {
        throw new Error(result.message || 'Foydalanuvchi qoʻshib boʻlmadi!');
      }
    } catch (err) {
      throw new Error(err.message);
    } finally {
      setIsMutating(false);
      endProgress(p);
    }
  };

  const updateUser = async (id, fields) => {
    const p = simulateProgress();
    setIsMutating(true);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      });
      const result = await res.json();
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === id ? result : u));
        await fetchUsers();
        if (currentUser && currentUser.id === id) {
          setCurrentUser(result);
        }
      } else {
        throw new Error(result.message || 'Foydalanuvchini yangilab boʻlmadi!');
      }
    } catch (err) {
      throw new Error(err.message);
    } finally {
      setIsMutating(false);
      endProgress(p);
    }
  };

  const deleteUser = async (id) => {
    if (currentUser && currentUser.id === id) {
      throw new Error('Tizimga kirib turgan foydalanuvchini oʻchirib boʻlmaydi!');
    }
    const p = simulateProgress();
    setIsMutating(true);
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
        await fetchUsers();
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    } finally {
      setIsMutating(false);
      endProgress(p);
    }
  };

  return (
    <FarmContext.Provider value={{
      users,
      animals,
      vetRecords,
      feedStock,
      feedPlans,
      currentUser,
      isInitialLoading,
      isGlobalLoading,
      loadingProgress,
      isMutating,
      login,
      logout,
      updateSelfProfile,
      addAnimal,
      updateAnimal,
      deleteAnimal,
      addVetRecord,
      updateVetRecord,
      deleteVetRecord,
      refillFeedStock,
      addFeedStock,
      updateFeedStock,
      deleteFeedStock,
      addFeedPlan,
      updateFeedPlan,
      deleteFeedPlan,
      consumeFeedStock,
      addUser,
      updateUser,
      deleteUser
    }}>
      {children}
    </FarmContext.Provider>
  );
}

export function useFarm() {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
}
