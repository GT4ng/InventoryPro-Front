import React from 'react';
import { NavLink } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';

const Sidebar = () => {
  const { currentUser } = useInventory();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/catalog', label: 'Catálogo Hardware' },
    { path: '/flow', label: 'Entradas / Salidas' },
    { path: '/history', label: 'Historial Almacén' },
    { path: '/alerts', label: 'Alertas Stock' },
    ...(currentUser?.role === 'admin' ? [{ path: '/users', label: 'Personal / Roles' }] : []),
    { path: '/reports', label: 'Reportes' }
  ];

  return (
    <aside className="barra-lateral">
      <div className="logo-lateral">
        InventoryPro
      </div>
      
      <nav style={{ flex: 1, overflowY: 'auto' }}>
        <ul className="menu-lateral">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? 'enlace-lateral active' : 'enlace-lateral'
                }
              >
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {currentUser && (
        <div className="usuario-lateral">
          <span className="nombre-usuario">{currentUser.name}</span>
          <span className="rol-usuario">
            {currentUser.role === 'admin' ? 'Administrador' : 'Operario'}
          </span>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
