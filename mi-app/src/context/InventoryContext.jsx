import React, { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

const USUARIOS_SEMILLA = [
  { id: 1, name: "Administrador", email: "admin@inventorypro.com", password: "admin", role: "admin", status: "active" },
  { id: 2, name: "Operario", email: "operario@inventorypro.com", password: "user", role: "operario", status: "active" }
];

const PRODUCTOS_SEMILLA = [
  { id: 1, brand: "Intel", model: "Core i9-13900K", category: "CPU", stock: 12, minStock: 5, price: 589.99, specs: "24 Cores (8 P-cores + 16 E-cores), 5.8 GHz Max Turbo, LGA1700, 36MB Cache" },
  { id: 2, brand: "NVIDIA", model: "GeForce RTX 4080 Super", category: "GPU", stock: 4, minStock: 5, price: 999.99, specs: "16GB GDDR6X, 256-bit, DLSS 3, Ray Tracing" },
  { id: 3, brand: "Corsair", model: "Vengeance RGB DDR5 32GB", category: "RAM", stock: 25, minStock: 10, price: 119.99, specs: "32GB (2 x 16GB), DDR5 6000MHz, C36" },
  { id: 4, brand: "Samsung", model: "990 PRO NVMe M.2 2TB", category: "Almacenamiento", stock: 3, minStock: 8, price: 169.99, specs: "PCIe Gen 4.0 x4, Lectura 7450 MB/s" },
  { id: 5, brand: "ASUS", model: "ROG Strix Z790-E WiFi", category: "Motherboard", stock: 8, minStock: 4, price: 379.99, specs: "LGA1700, DDR5, PCIe 5.0, WiFi 6E" }
];

const MOVIMIENTOS_SEMILLA = [];

const SESSION_KEY = "ip_react_session";
const USERS_KEY = "ip_react_users";
const PRODUCTS_KEY = "ip_react_products";
const MOVEMENTS_KEY = "ip_react_movements";

export const InventoryProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  const [products, setProducts] = useState([]);

  const [movements, setMovements] = useState([]);

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

    const localProducts = localStorage.getItem(PRODUCTS_KEY);
    if (!localProducts) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(PRODUCTOS_SEMILLA));
      setProducts(PRODUCTOS_SEMILLA);
    } else {
      setProducts(JSON.parse(localProducts));
    }

    const localMovements = localStorage.getItem(MOVEMENTS_KEY);
    if (!localMovements) {
      localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(MOVIMIENTOS_SEMILLA));
      setMovements(MOVIMIENTOS_SEMILLA);
    } else {
      setMovements(JSON.parse(localMovements));
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

  const addProduct = (newProd) => {
    const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const updatedList = [...products, { ...newProd, id: nextId }];
    setProducts(updatedList);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedList));
  };

  const updateProduct = (id, updatedFields) => {
    const updatedList = products.map(p => {
      if (p.id === id) {
        return { ...p, ...updatedFields };
      }
      return p;
    });
    setProducts(updatedList);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedList));
  };

  const deleteProduct = (id) => {
    const updatedList = products.filter(p => p.id !== id);
    setProducts(updatedList);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedList));
  };

  const registerMovement = (productId, type, quantity, reason) => {
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        const nextStock = type === 'entrada' ? p.stock + quantity : p.stock - quantity;
        return { ...p, stock: nextStock };
      }
      return p;
    });
    setProducts(updatedProducts);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));

    const product = products.find(p => p.id === productId);
    const nextId = movements.length > 0 ? Math.max(...movements.map(m => m.id)) + 1 : 1;
    const newMovement = {
      id: nextId,
      productId,
      productName: `${product.brand} ${product.model}`,
      type,
      quantity,
      reason,
      date: new Date().toISOString(),
      user: currentUser ? currentUser.name : "Administrador",
      role: currentUser ? currentUser.role : "admin"
    };
    const updatedMovements = [newMovement, ...movements];
    setMovements(updatedMovements);
    localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(updatedMovements));
  };

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
      deleteProduct,
      movements,
      registerMovement
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
