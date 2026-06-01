import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const { currentUser } = useInventory();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="contenedor-app">
      <Sidebar />

      <div className="contenido-principal">
        <Header />

        <main className="cuerpo-principal">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
