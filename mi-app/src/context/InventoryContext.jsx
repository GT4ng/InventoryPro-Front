import React, { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

const SEED_USERS = [
  { id: 1, name: "Administrador", email: "admin@inventorypro.com", password: "admin", role: "admin", status: "active" },
  { id: 2, name: "Operario", email: "operario@inventorypro.com", password: "user", role: "operario", status: "active" }
];

const SEED_PRODUCTS = [
  { id: 1, brand: "Intel", model: "Core i9-13900K", category: "CPU", stock: 12, minStock: 5, price: 589.99 },
  { id: 2, brand: "NVIDIA", model: "GeForce RTX 4080 Super", category: "GPU", stock: 4, minStock: 5, price: 999.99 },
  { id: 3, brand: "Corsair", model: "Vengeance RGB DDR5 32GB", category: "RAM", stock: 25, minStock: 10, price: 119.99 },
  { id: 4, brand: "Samsung", model: "990 PRO NVMe M.2 2TB", category: "Almacenamiento", stock: 3, minStock: 8, price: 169.99 },
  { id: 5, brand: "ASUS", model: "ROG Strix Z790-E WiFi", category: "Motherboard", stock: 8, minStock: 4, price: 379.99 }
];

const SEED_MOVEMENTS = [
  { id: 1, productId: 1, productName: "Intel Core i9-13900K", type: "entrada", quantity: 5, date: "2026-05-25T14:30:00Z", user: "Administrador", role: "admin" },
  { id: 2, productId: 2, productName: "NVIDIA GeForce RTX 4080 Super", type: "salida", quantity: 2, date: "2026-05-26T10:15:00Z", user: "Operario", role: "operario" }
];

const STORAGE_KEYS = {
  USERS: "ip_react_users",
  SESSION: "ip_react_session"
};

export const InventoryProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [products] = useState(SEED_PRODUCTS);
  const [movements] = useState(SEED_MOVEMENTS);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    }
    setUsers(JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)));
    
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (session) {
      setCurrentUser(JSON.parse(session));
    }
  }, []);

  const login = (email, password) => {
    const userMatch = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    
    if (!userMatch) {
      return { success: false, message: "El usuario no se encuentra registrado." };
    }
    if (userMatch.password !== password) {
      return { success: false, message: "La contraseña ingresada es incorrecta." };
    }
    if (userMatch.status !== "active") {
      return { success: false, message: "Esta cuenta está desactivada por el administrador." };
    }

    const sessionData = {
      id: userMatch.id,
      name: userMatch.name,
      email: userMatch.email,
      role: userMatch.role
    };

    setCurrentUser(sessionData);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
    return { success: true, user: sessionData };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  };

  return (
    <InventoryContext.Provider value={{
      users,
      products,
      movements,
      currentUser,
      login,
      logout
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
