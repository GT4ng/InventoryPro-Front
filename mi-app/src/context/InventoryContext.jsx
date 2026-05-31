import React, { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();
const USUARIOS_SEMILLA = [
  { id: 1, name: "Administrador", email: "admin@inventorypro.com", password: "admin", role: "admin", status: "active" },
  { id: 2, name: "Operario", email: "operario@inventorypro.com", password: "user", role: "operario", status: "active" }
];

const SESSION_KEY = "ip_react_session";
const USERS_KEY = "ip_react_users";

export const InventoryProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      setCurrentUser(JSON.parse(session));
    }

    const localUsers = localStorage.getItem(USERS_KEY);
    if (!localUsers) {
      localStorage.setItem(USERS_KEY, JSON.stringify(USUARIOS_SEMILLA));
      setUsers(USUARIOS_SEMILLA);
    } else {
      setUsers(JSON.parse(localUsers));
    }
  }, []);

  const login = (email, password) => {
    const foundUser = users.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (!foundUser) {
      return { success: false, message: "El usuario no se encuentra registrado." };
    }
    if (foundUser.password !== password) {
      return { success: false, message: "La contraseña ingresada es incorrecta." };
    }
    if (foundUser.status !== "active") {
      return { success: false, message: "Esta cuenta está desactivada por el administrador." };
    }

    const sessionData = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role
    };

    setCurrentUser(sessionData);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    return { success: true, user: sessionData };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const registerUser = (newUser) => {
    const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const updatedList = [...users, { ...newUser, id: nextId, status: 'active' }];
    setUsers(updatedList);
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedList));
  };

  const toggleUserStatus = (id) => {
    const updatedList = users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'active' ? 'inactive' : 'active' };
      }
      return u;
    });
    setUsers(updatedList);
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedList));
  };

  const deleteUser = (id) => {
    const updatedList = users.filter(u => u.id !== id);
    setUsers(updatedList);
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedList));
  };

  const products = [];
  const addProduct = () => {};
  const updateProduct = () => {};
  const deleteProduct = () => {};

  return (
    <InventoryContext.Provider value={{
      currentUser,
      users,
      login,
      logout,
      registerUser,
      toggleUserStatus,
      deleteUser,
      products,
      addProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
