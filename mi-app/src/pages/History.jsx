import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

const History = () => {
  const { movements } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const filteredMovements = movements ? movements.filter(m => {
    const coincideTexto = 
      m.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.reason && m.reason.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const coincideTipo = selectedType === '' || m.type === selectedType;
    
    return coincideTexto && coincideTipo;
  }) : [];

  return (
    <div className="animar-aparicion">
      <div className="barra-filtros">
        <div className="entradas-filtros">
          <input
            type="text"
            placeholder="Buscar por componente, operador o motivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="campo-entrada"
            style={{ flex: 1, minWidth: '200px' }}
          />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="campo-seleccion"
          >
            <option value="">Todos los Movimientos</option>
            <option value="entrada">Entradas</option>
            <option value="salida">Salidas</option>
          </select>
        </div>
      </div>

      <div className="contenedor-tabla desplazamiento-horizontal">
        <table className="tabla-personalizada">
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Componente</th>
              <th>Operador</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Motivo</th>
            </tr>
          </thead>
          <tbody>
            {filteredMovements.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px 0' }}>
                  No se encontraron transacciones registradas.
                </td>
              </tr>
            ) : (
              filteredMovements.map(m => (
                <tr key={m.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                    {new Date(m.date).toLocaleString()}
                  </td>
                  <td style={{ fontWeight: 'bold', color: 'white' }}>
                    {m.productName}
                  </td>
                  <td>
                    <span style={{ display: 'block', fontWeight: '500' }}>{m.user}</span>
                    <span style={{ display: 'block', fontSize: '12px', textTransform: 'capitalize' }}>
                      {m.role === 'admin' ? 'Administrador' : 'Operario'}
                    </span>
                  </td>
                  <td>
                    <span className={`etiqueta ${m.type === 'entrada' ? 'etiqueta-verde' : 'etiqueta-roja'}`}>
                      {m.type === 'entrada' ? 'Entrada' : 'Salida'}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                    {m.quantity} uds
                  </td>
                  <td style={{ color: 'white' }}>
                    {m.reason}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
