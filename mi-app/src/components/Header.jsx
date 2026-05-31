import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useInventory();
  const titles = {
    '/dashboard': 'Resumen General',
    '/catalog': 'Catálogo de Componentes de Hardware',
    '/flow': 'Registrar Entrada y Salida de Existencias',
    '/history': 'Historial de Operaciones de Almacén',
    '/alerts': 'Margen Crítico / Stock Mínimo',
    '/users': 'Administración de Personal de Almacén',
    '/reports': 'Reporte y Valuación del Inventario'
  };

  const getTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/product/')) {
      return 'Ficha Técnica del Hardware';
    }
    return titles[path] || 'InventoryPro';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex justify-between items-center bg-slate-800 border-b border-slate-700 h-16 px-8 sticky top-0 z-10 text-white">
      <h2 className="text-lg font-semibold">{getTitle()}</h2>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"></span>
          <span>Almacén Central Activo</span>
        </div>
        
        <button
          onClick={handleLogout}
          className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 text-xs px-4 py-2 rounded-md font-semibold cursor-pointer transition-all duration-200"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};

export default Header;
