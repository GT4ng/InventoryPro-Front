// --- Implementado por Rodrigo ---
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';

const Users = () => {
  const { currentUser, users, registerUser, toggleUserStatus, deleteUser } = useInventory();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const form = new FormData(e.target);
    const emailVal = form.get('email').trim().toLowerCase();
    const nameVal = form.get('name').trim();
    const passwordVal = form.get('password');
    const roleVal = form.get('role');

    if (users.some(u => u.email.toLowerCase() === emailVal)) {
      setError('El correo electrónico ya se encuentra registrado.');
      return;
    }

    registerUser({ name: nameVal, email: emailVal, password: passwordVal, role: roleVal });
    e.target.reset();
  };

  if (!currentUser || currentUser.role !== 'admin') return null;

  return (
    <div className="space-y-6 text-slate-100 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Gestión de Personal</h3>
        <p className="text-xs text-slate-400">Administra los accesos de los operadores y administradores de la plataforma.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg h-fit space-y-4">
          <h4 className="text-sm font-bold text-white border-b border-slate-700 pb-2">Agregar Colaborador</h4>
          {error && <p className="text-red-400 text-xs">{error}</p>}

          <input required name="name" type="text" placeholder="Nombre completo" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-100 outline-none" />
          <input required name="email" type="email" placeholder="correo@ejemplo.com" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-100 outline-none" />
          <input required name="password" type="password" placeholder="Contraseña de acceso" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-100 outline-none" />
          
          <select required name="role" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-100 outline-none">
            <option value="operario">Operario</option>
            <option value="admin">Administrador</option>
          </select>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-sm cursor-pointer">
            Registrar Colaborador
          </button>
        </form>

        <div className="md:col-span-2 space-y-3">
          {users.map(u => (
            <div key={u.id} className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h5 className="font-semibold text-white text-sm">{u.name}</h5>
                <p className="text-xs text-slate-400">
                  {u.email} · Rol: <span className="capitalize">{u.role}</span> · Estado: <span className="capitalize">{u.status}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (currentUser && u.id === currentUser.id) return alert('No puedes desactivar tu propia cuenta.');
                    toggleUserStatus(u.id);
                  }}
                  className="bg-slate-750 hover:bg-slate-700 text-slate-200 text-xs py-1 px-3 rounded cursor-pointer"
                >
                  {u.status === 'active' ? 'Desactivar' : 'Activar'}
                </button>
                <button
                  onClick={() => {
                    if (currentUser && u.id === currentUser.id) return alert('No puedes eliminar tu propia cuenta.');
                    if (window.confirm(`¿Eliminar a ${u.name}?`)) deleteUser(u.id);
                  }}
                  className="bg-red-600/10 hover:bg-red-650 text-red-500 border border-red-500/20 text-xs py-1 px-3 rounded cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Users;
