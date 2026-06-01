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

  return (
    <div className="contenedor-login">
      <div className="tarjeta-login">
        
        <div className="cabecera-login">
          <h1>InventoryPro</h1>
          <p>Control de Inventario de Hardware</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} noValidate>
          {generalError && (
            <div className="error-formulario">
              {generalError}
            </div>
          )}

          <div className="grupo-formulario">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@inventorypro.com"
              className="campo-entrada"
            />
            {errors.email && <p className="error-formulario" style={{ margin: '8px 0 0 0', padding: '4px 8px' }}>{errors.email}</p>}
          </div>

          <div className="grupo-formulario">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="campo-entrada"
            />
            {errors.password && <p className="error-formulario" style={{ margin: '8px 0 0 0', padding: '4px 8px' }}>{errors.password}</p>}
          </div>

          <button type="submit" className="boton boton-primario boton-completo">
            Iniciar Sesión
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;