import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  
  const { login, currentUser } = useInventory();
  const navigate = useNavigate();

  // Si ya hay sesión activa, redirigir directo al dashboard
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const validate = () => {
    const tempErrors = {};
    if (!email.trim() || !email.includes('@')) {
      tempErrors.email = 'Ingrese un correo electrónico válido.';
    }
    if (password.length < 4) {
      tempErrors.password = 'La contraseña debe tener al menos 4 caracteres.';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) return;

    const result = login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setGeneralError(result.message);
    }
  };

  const handleQuickLogin = (quickEmail, quickPassword) => {
    setEmail(quickEmail);
    setPassword(quickPassword);
    
    // Ejecutar login inmediato
    const result = login(quickEmail, quickPassword);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setGeneralError(result.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 flex justify-center items-center p-5 text-slate-100">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-2xl transition-all duration-300 hover:border-blue-500/30">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2 mb-2">
            InventoryPro
          </h1>
          <p className="text-sm text-slate-400">Control de Inventario de Hardware</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {generalError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2">
              {generalError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@inventorypro.com"
              className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg px-4 py-2.5 text-sm text-slate-100 outline-none transition duration-200"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg px-4 py-2.5 text-sm text-slate-100 outline-none transition duration-200"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg text-sm transition duration-200 shadow-lg shadow-blue-600/20 cursor-pointer"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700/60 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3">
            Accesos Rápidos de Prueba
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleQuickLogin('admin@inventorypro.com', 'admin')}
              className="flex-1 bg-slate-700/40 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-[11px] font-semibold py-2 px-3 rounded-md transition duration-200 cursor-pointer"
            >
              Admin (Total)
            </button>
            <button
              onClick={() => handleQuickLogin('operario@inventorypro.com', 'user')}
              className="flex-1 bg-slate-700/40 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-[11px] font-semibold py-2 px-3 rounded-md transition duration-200 cursor-pointer"
            >
              Operario (Restringido)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
