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
    return titles[path] || 'InventoryPro';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="barra-cabecera">
      <h2>{getTitle()}</h2>
      
      <div className="acciones-cabecera">
        <div className="estado-cabecera">
          <span className="punto-estado"></span>
          <span>Almacén Central Activo</span>
        </div>
        
        <button onClick={handleLogout} className="boton boton-peligro">
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};

export default Header;
