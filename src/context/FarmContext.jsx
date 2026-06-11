import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  users as initialUsers, 
  animals as initialAnimals, 
  vetRecords as initialVetRecords, 
  feedStock as initialFeedStock 
} from '../data/mockData';

const FarmContext = createContext();

export function FarmProvider({ children }) {
  // --- 1. State initialization from LocalStorage or Mock Data ---
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('ziyoda_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [animals, setAnimals] = useState(() => {
    const saved = localStorage.getItem('ziyoda_animals');
    return saved ? JSON.parse(saved) : initialAnimals;
  });

  const [vetRecords, setVetRecords] = useState(() => {
    const saved = localStorage.getItem('ziyoda_vet_records');
    return saved ? JSON.parse(saved) : initialVetRecords;
  });

  const [feedStock, setFeedStock] = useState(() => {
    const saved = localStorage.getItem('ziyoda_feed_stock');
    return saved ? JSON.parse(saved) : initialFeedStock;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  // --- 2. Synchronize states with LocalStorage on change ---
  useEffect(() => {
    localStorage.setItem('ziyoda_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('ziyoda_animals', JSON.stringify(animals));
  }, [animals]);

  useEffect(() => {
    localStorage.setItem('ziyoda_vet_records', JSON.stringify(vetRecords));
  }, [vetRecords]);

  useEffect(() => {
    localStorage.setItem('ziyoda_feed_stock', JSON.stringify(feedStock));
  }, [feedStock]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // --- 3. Authentication actions ---
  const login = (username, password) => {
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );
    if (foundUser) {
      setCurrentUser(foundUser);
      return { success: true };
    }
    return { success: false, message: 'Foydalanuvchi nomi yoki parol notoʻgʻri!' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateSelfProfile = (updatedFields) => {
    if (!currentUser) return;
    
    // Check if new username is already taken by another user
    if (updatedFields.username && updatedFields.username !== currentUser.username) {
      const taken = users.some(u => u.username === updatedFields.username && u.id !== currentUser.id);
      if (taken) {
        throw new Error('Foydalanuvchi nomi band! Iltimos, boshqasini tanlang.');
      }
    }

    const updatedUser = { ...currentUser, ...updatedFields };
    
    // Update users list
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    // Update current session user
    setCurrentUser(updatedUser);
  };

  // --- 4. Animal actions ---
  const addAnimal = (animalData) => {
    const nextId = animals.length > 0 ? Math.max(...animals.map(a => a.id)) + 1 : 1;
    
    // Generate Tag ID based on type (QM for qoramol, QY for qo'y, EC for echki)
    let prefix = 'QM';
    if (animalData.type === "qo'y") prefix = 'QY';
    if (animalData.type === 'echki') prefix = 'EC';
    
    const sameTypeCount = animals.filter(a => a.type === animalData.type).length;
    const tagNum = String(sameTypeCount + 1).padStart(3, '0');
    const tag = `${prefix}-${tagNum}`;

    const newAnimal = {
      id: nextId,
      tag,
      vaccinated: false,
      entryDate: new Date().toISOString().split('T')[0],
      lastCheckup: new Date().toISOString().split('T')[0],
      dailyMilk: 0,
      image: animalData.type === 'qoramol' ? '🐄' : animalData.type === "qo'y" ? '🐑' : '🐐',
      ...animalData
    };

    setAnimals(prev => [...prev, newAnimal]);
    return newAnimal;
  };

  const updateAnimal = (id, fields) => {
    setAnimals(prev => prev.map(a => a.id === id ? { ...a, ...fields } : a));
  };

  const deleteAnimal = (id) => {
    setAnimals(prev => prev.filter(a => a.id !== id));
    // Optionally clean up vet records associated with this animal, or keep them
    setVetRecords(prev => prev.filter(r => r.animalId !== id));
  };

  // --- 5. Vet Records actions ---
  const addVetRecord = (recordData) => {
    const nextId = vetRecords.length > 0 ? Math.max(...vetRecords.map(r => r.id)) + 1 : 1;
    
    const newRecord = {
      id: nextId,
      date: new Date().toISOString().split('T')[0],
      cost: 0,
      notes: '',
      ...recordData
    };

    setVetRecords(prev => [...prev, newRecord]);

    // Reactive Automation Rules:
    // 1. If Treatment/Checkup indicates active sickness, update animal status
    if (newRecord.status === 'davom etmoqda' && newRecord.type === 'Davolash') {
      updateAnimal(newRecord.animalId, { status: 'davolanmoqda', lastCheckup: newRecord.date });
    }
    // 2. If vaccine was administered, set animal vaccinated state to true
    if (newRecord.type === 'Emlash') {
      updateAnimal(newRecord.animalId, { vaccinated: true, lastCheckup: newRecord.date });
    }
    // 3. Update last checkup date anyway
    updateAnimal(newRecord.animalId, { lastCheckup: newRecord.date });

    return newRecord;
  };

  const updateVetRecord = (id, fields) => {
    setVetRecords(prev => prev.map(r => r.id === id ? { ...r, ...fields } : r));
    
    // If we updated a record, we might trigger some reactive updates
    if (fields.status === 'yakunlangan') {
      const record = vetRecords.find(r => r.id === id);
      if (record) {
        // If there are no other active records for this animal, set status to healthy
        const otherActive = vetRecords.some(r => r.animalId === record.animalId && r.id !== id && r.status === 'davom etmoqda');
        if (!otherActive) {
          updateAnimal(record.animalId, { status: 'sog\'lom' });
        }
      }
    }
  };

  const deleteVetRecord = (id) => {
    setVetRecords(prev => prev.filter(r => r.id !== id));
  };

  // --- 6. Feed Stock actions ---
  const refillFeedStock = (name, amount) => {
    setFeedStock(prev => prev.map(item => 
      item.name === name 
        ? { 
            ...item, 
            amount: item.amount + amount, 
            status: (item.amount + amount) > 200 ? 'yetarli' : (item.amount + amount) > 50 ? 'kam' : 'juda kam'
          } 
        : item
    ));
  };

  // --- 7. User CRUD actions (for AdminPanel) ---
  const addUser = (userData) => {
    const taken = users.some(u => u.username === userData.username);
    if (taken) {
      throw new Error('Foydalanuvchi nomi band!');
    }

    const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = {
      id: nextId,
      avatar: userData.role === 'admin' ? '👨‍💼' : userData.role === 'veterinar' ? '👩‍⚕️' : '👨‍🌾',
      ...userData
    };

    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (id, fields) => {
    // Check username uniqueness if changed
    if (fields.username) {
      const taken = users.some(u => u.username === fields.username && u.id !== id);
      if (taken) {
        throw new Error('Foydalanuvchi nomi band!');
      }
    }

    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...fields } : u));
    
    // If updating current logged-in user, sync current session
    if (currentUser && currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, ...fields }));
    }
  };

  const deleteUser = (id) => {
    if (currentUser && currentUser.id === id) {
      throw new Error('Tizimga kirib turgan foydalanuvchini oʻchirib boʻlmaydi!');
    }
    setUsers(prev => prev.filter(u => u.id !== id));
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
