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
    <div className="animar-aparicion">
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>Gestión de Personal</h3>
        <p style={{ fontSize: '12px', color: 'var(--color-mutado)' }}>Administra los accesos de los operadores y administradores de la plataforma.</p>
      </div>

      <div className="distribucion-usuarios">
        
        <form onSubmit={handleSubmit} className="contenedor-formulario">
          <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', borderBottom: '1px solid var(--color-borde)', paddingBottom: '8px', marginBottom: '16px' }}>Agregar Colaborador</h4>
          {error && <p className="error-formulario">{error}</p>}

          <div className="grupo-formulario">
            <label>Nombre Completo</label>
            <input required name="name" type="text" placeholder="Ej. Guillermo Pérez" className="campo-entrada" />
          </div>

          <div className="grupo-formulario">
            <label>Correo Electrónico</label>
            <input required name="email" type="email" placeholder="correo@ejemplo.com" className="campo-entrada" />
          </div>

          <div className="grupo-formulario">
            <label>Contraseña de Acceso</label>
            <input required name="password" type="password" placeholder="Contraseña de acceso" className="campo-entrada" />
          </div>
          
          <div className="grupo-formulario">
            <label>Rol de Acceso</label>
            <select required name="role" className="campo-seleccion">
              <option value="operario">Operario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <button type="submit" className="boton boton-primario boton-completo">
            Registrar Colaborador
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {users.map(u => (
            <div key={u.id} className="tarjeta-usuario">
              <div className="info-usuario">
                <h5>{u.name}</h5>
                <p>
                  {u.email} · Rol: <span className="etiqueta etiqueta-azul" style={{ fontSize: '10px', padding: '1px 6px' }}>{u.role}</span> · Estado: <span className={`etiqueta ${u.status === 'active' ? 'etiqueta-verde' : 'etiqueta-gris'}`} style={{ fontSize: '10px', padding: '1px 6px' }}>{u.status}</span>
                </p>
              </div>
              <div className="acciones-usuario">
                <button
                  onClick={() => {
                    if (currentUser && u.id === currentUser.id) return alert('No puedes desactivar tu propia cuenta.');
                    toggleUserStatus(u.id);
                  }}
                  className="boton boton-secundario"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  disabled={currentUser && u.id === currentUser.id}
                >
                  {u.status === 'active' ? 'Desactivar' : 'Activar'}
                </button>
                <button
                  onClick={() => {
                    if (currentUser && u.id === currentUser.id) return alert('No puedes eliminar tu propia cuenta.');
                    if (window.confirm(`¿Eliminar a ${u.name}?`)) deleteUser(u.id);
                  }}
                  className="boton boton-peligro"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  disabled={currentUser && u.id === currentUser.id}
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
