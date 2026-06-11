import React, { createContext, useContext, useState, useEffect } from 'react';

const FarmContext = createContext();

export function FarmProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [vetRecords, setVetRecords] = useState([]);
  const [feedStock, setFeedStock] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

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

  // Load all tables on mount
  useEffect(() => {
    fetchUsers();
    fetchAnimals();
    fetchVetRecords();
    fetchFeedStock();
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
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateSelfProfile = async (updatedFields) => {
    if (!currentUser) return;
    
    try {
      const res = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      const result = await res.json();
      if (res.ok) {
        setCurrentUser(result);
        fetchUsers(); // Sync list
      } else {
        throw new Error(result.message || 'Profilni saqlab boʻlmadi!');
      }
    } catch (err) {
      throw new Error(err.message);
    }
  };

  // --- Animal actions ---
  const addAnimal = async (animalData) => {
    try {
      const res = await fetch('/api/animals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(animalData)
      });
      if (res.ok) {
        const created = await res.json();
        setAnimals(prev => [...prev, created]);
        fetchAnimals(); // Refresh list to get proper Tag IDs from DB
        return created;
      }
    } catch (err) {
      console.error("Error adding animal:", err);
    }
  };

  const updateAnimal = async (id, fields) => {
    try {
      const res = await fetch(`/api/animals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      });
      if (res.ok) {
        const updated = await res.json();
        setAnimals(prev => prev.map(a => a.id === id ? updated : a));
        fetchAnimals();
      }
    } catch (err) {
      console.error("Error updating animal:", err);
    }
  };

  const deleteAnimal = async (id) => {
    try {
      const res = await fetch(`/api/animals/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAnimals(prev => prev.filter(a => a.id !== id));
        fetchAnimals();
        fetchVetRecords(); // cascade delete updates
      }
    } catch (err) {
      console.error("Error deleting animal:", err);
    }
  };

  // --- Vet Records actions ---
  const addVetRecord = async (recordData) => {
    try {
      const res = await fetch('/api/vet-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData)
      });
      if (res.ok) {
        const created = await res.json();
        setVetRecords(prev => [created, ...prev]);
        fetchVetRecords();
        fetchAnimals(); // Reactive status changes
        return created;
      }
    } catch (err) {
      console.error("Error adding vet record:", err);
    }
  };

  const updateVetRecord = async (id, fields) => {
    try {
      const res = await fetch(`/api/vet-records/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      });
      if (res.ok) {
        const updated = await res.json();
        setVetRecords(prev => prev.map(r => r.id === id ? updated : r));
        fetchVetRecords();
        fetchAnimals(); // Reactive status resolution
      }
    } catch (err) {
      console.error("Error updating vet record:", err);
    }
  };

  const deleteVetRecord = async (id) => {
    try {
      const res = await fetch(`/api/vet-records/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setVetRecords(prev => prev.filter(r => r.id !== id));
        fetchVetRecords();
      }
    } catch (err) {
      console.error("Error deleting vet record:", err);
    }
  };

  // --- Feed Stock actions ---
  const refillFeedStock = async (name, amount) => {
    try {
      const res = await fetch('/api/feed-stock/refill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, amount })
      });
      if (res.ok) {
        const updated = await res.json();
        setFeedStock(prev => prev.map(item => item.name === name ? updated : item));
        fetchFeedStock();
      }
    } catch (err) {
      console.error("Error refilling feed stock:", err);
    }
  };

  // --- User CRUD actions (for AdminPanel) ---
  const addUser = async (userData) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const result = await res.json();
      if (res.ok) {
        setUsers(prev => [...prev, result]);
        fetchUsers();
        return result;
      } else {
        throw new Error(result.message || 'Foydalanuvchi qoʻshib boʻlmadi!');
      }
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const updateUser = async (id, fields) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      });
      const result = await res.json();
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === id ? result : u));
        fetchUsers();
        if (currentUser && currentUser.id === id) {
          setCurrentUser(result);
        }
      } else {
        throw new Error(result.message || 'Foydalanuvchini yangilab boʻlmadi!');
      }
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const deleteUser = async (id) => {
    if (currentUser && currentUser.id === id) {
      throw new Error('Tizimga kirib turgan foydalanuvchini oʻchirib boʻlmaydi!');
    }
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
        fetchUsers();
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <FarmContext.Provider value={{
      users,
      animals,
      vetRecords,
      feedStock,
      currentUser,
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
