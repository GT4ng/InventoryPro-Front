import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { InventoryProvider } from './context/InventoryContext';
import Layout from './components/Layout';

// Páginas correspondientes a todos los hitos del proyecto
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Catalog from './pages/Catalog';
import Users from './pages/Users';
import Alerts from './pages/Alerts';
import StockFlow from './pages/StockFlow';
import History from './pages/History';
import Reports from './pages/Reports';

function App() {
  return (
    <InventoryProvider>
      <Routes>
        {/* Ruta Pública de Acceso */}
        <Route path="/login" element={<Login />} />

        {/* Rutas Protegidas por la estructura base (Layout) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/users" element={<Users />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/flow" element={<StockFlow />} />
          <Route path="/history" element={<History />} />
          <Route path="/reports" element={<Reports />} />
        </Route>

        {/* Redirección comodín por defecto */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </InventoryProvider>
  );
}

export default App;
