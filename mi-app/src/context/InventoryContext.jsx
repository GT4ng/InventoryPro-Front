import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

const InventoryContext = createContext();

const SESSION_KEY = 'ip_react_session';
const TOKEN_KEY = 'ip_token';

export const InventoryProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    const token = localStorage.getItem(TOKEN_KEY);

    if (session && token) {
      setCurrentUser(JSON.parse(session));
      loadInitialData();
    }
  }, []);

  const loadInitialData = async () => {
    const [componentsData, movementsData, usersData, summaryData, alertsData] =
      await Promise.all([
        api.getComponents(),
        api.getMovements(),
        api.getUsers(),
        api.getSummary(),
        api.getStockAlerts()
      ]);

    setProducts(componentsData);
    setMovements(movementsData);
    setUsers(usersData);
    setSummary(summaryData);
    setAlerts(alertsData);
  };

  const login = async (email, password) => {
    try {
      const data = await api.login(email, password);

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));

      setCurrentUser(data.user);
      await loadInitialData();

      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setUsers([]);
    setProducts([]);
    setMovements([]);
    setSummary(null);
    setAlerts([]);

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
  };

  const registerUser = async (newUser) => {
    await api.createUser(newUser);
    setUsers(await api.getUsers());
  };

  const toggleUserStatus = async (id) => {
    const user = users.find((u) => u.id === id);
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';

    await api.updateUserStatus(id, nextStatus);
    setUsers(await api.getUsers());
  };

  const deleteUser = async (id) => {
    await api.deleteUser(id);
    setUsers(await api.getUsers());
  };

  const addProduct = async (newProd) => {
    await api.createComponent(newProd);
    setProducts(await api.getComponents());
    setAlerts(await api.getStockAlerts());
    setSummary(await api.getSummary());
  };

  const updateProduct = async (id, updatedFields) => {
    await api.updateComponent(id, updatedFields);
    setProducts(await api.getComponents());
    setAlerts(await api.getStockAlerts());
    setSummary(await api.getSummary());
  };

  const deleteProduct = async (id) => {
    await api.deleteComponent(id);
    setProducts(await api.getComponents());
    setAlerts(await api.getStockAlerts());
    setSummary(await api.getSummary());
  };

  const registerMovement = async (productId, type, quantity, reason) => {
    await api.createMovement({
      productId,
      warehouseId: 1,
      type,
      quantity,
      reason
    });

    setProducts(await api.getComponents());
    setMovements(await api.getMovements());
    setAlerts(await api.getStockAlerts());
    setSummary(await api.getSummary());
  };

  return (
    <InventoryContext.Provider
      value={{
        currentUser,
        users,
        products,
        movements,
        summary,
        alerts,
        login,
        logout,
        registerUser,
        toggleUserStatus,
        deleteUser,
        addProduct,
        updateProduct,
        deleteProduct,
        registerMovement,
        reloadData: loadInitialData
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
