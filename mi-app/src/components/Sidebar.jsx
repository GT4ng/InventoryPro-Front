import React from 'react';
import { NavLink } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';

const Sidebar = () => {
  const { currentUser } = useInventory();
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/catalog', label: 'Catálogo Hardware' },
    ...(currentUser?.role === 'admin' ? [{ path: '/users', label: 'Personal / Roles' }] : [])
  ];

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-slate-800 border-r border-slate-700 flex flex-col z-20">
      <div className="p-5 text-xl font-bold text-center border-b border-slate-700 text-white">
        InventoryPro
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between p-3 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`
                }
              >
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {currentUser && (
        <div className="p-4 border-t border-slate-700 bg-slate-900/50 flex flex-col">
          <span className="font-semibold text-sm text-slate-200">{currentUser.name}</span>
          <span className="text-xs text-slate-400 capitalize mt-0.5">
            {currentUser.role === 'admin' ? 'Administrador' : 'Operario'}
          </span>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
