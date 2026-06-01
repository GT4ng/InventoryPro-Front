import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

const StockFlow = () => {
  const { products, registerMovement } = useInventory();

  const [productId, setProductId] = useState('');
  const [type, setType] = useState('entrada');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const selectedProduct = products ? products.find(p => p.id === parseInt(productId)) : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const form = new FormData(e.target);
    const quantityVal = parseInt(form.get('quantity'));
    const reasonVal = form.get('reason').trim();

    if (!productId) {
      setError('Seleccione un componente de hardware.');
      return;
    }
    if (isNaN(quantityVal) || quantityVal <= 0) {
      setError('La cantidad debe ser un número entero mayor a cero.');
      return;
    }
    if (type === 'salida' && selectedProduct && quantityVal > selectedProduct.stock) {
      setError(`Stock insuficiente. Intentas retirar ${quantityVal} unidades pero solo quedan ${selectedProduct.stock} disponibles.`);
      return;
    }

    registerMovement(parseInt(productId), type, quantityVal, reasonVal);

    setProductId('');
    setSuccess(true);
    e.target.reset();
    setTimeout(() => setSuccess(false), 3500);
  };

  return (
    <div className="animar-aparicion" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div className="contenedor-formulario">
        
        <div className="cabecera-formulario">
          <h3>Operación de Almacén</h3> 
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div className="error-formulario">
              {error}
            </div>
          )}

          {success && (
            <div className="exito-formulario">
              Transacción registrada con éxito. Existencias físicas actualizadas.
            </div>
          )}

          <div className="grupo-formulario">
            <label>Componente de Hardware</label>
            <select
              required
              value={productId}
              onChange={(e) => { setProductId(e.target.value); setError(''); }}
              className="campo-seleccion"
            >
              <option value="">-- Seleccione --</option>
              {products && products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.brand} {p.model} - Stock: {p.stock} uds
                </option>
              ))}
            </select>
          </div>

          <div className="grupo-formulario">
            <label>Tipo de Movimiento</label>
            <div style={{ display: 'flex', gap: '16px'}}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', color: 'var(--verde)' }}>
                <input
                  type="radio"
                  name="type"
                  checked={type === 'entrada'}
                  onChange={() => setType('entrada')}
                  style={{ cursor: 'pointer' }}
                />
                Entrada (Suma)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', color: 'var(--rojo)' }}>
                <input
                  type="radio"
                  name="type"
                  checked={type === 'salida'}
                  onChange={() => setType('salida')}
                  style={{ cursor: 'pointer' }}
                />
                Salida (Resta)
              </label>
            </div>
          </div>

          <div className="grupo-formulario">
            <label>Cantidad</label>
            <input
              required
              name="quantity"
              type="number"
              min="1"
              placeholder="Ej. 10"
              className="campo-entrada"
            />
          </div>

          <div className="grupo-formulario">
            <label>Motivo / Justificación</label>
            <textarea
              required
              name="reason"
              rows="3"
              placeholder="Ej. Ingreso de proveedor local / Ajuste por inventario físico..."
              className="campo-texto"
            ></textarea>
          </div>

          <button type="submit" className="boton boton-primario boton-completo">
            Procesar Transacción
          </button>
        </form>

      </div>
    </div>
  );
};

export default StockFlow;
