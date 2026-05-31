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
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Sidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
