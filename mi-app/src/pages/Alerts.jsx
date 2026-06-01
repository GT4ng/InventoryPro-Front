import React from 'react';
import { useInventory } from '../context/InventoryContext';

const Alerts = () => {
  const { products } = useInventory();

  const criticalProducts = products ? products.filter(p => p.stock <= p.minStock) : [];

  const handleReorder = (p) => {
    const deficit = p.minStock - p.stock;
    const suggestedQuantity = deficit + 5;
    const totalCost = suggestedQuantity * p.price;

    alert(
      `Solicitud de reabastecimiento simulada:\n\n` +
      `Producto: ${p.brand} ${p.model}\n` +
      `Déficit actual: ${deficit} uds\n` +
      `Cantidad sugerida (Déficit + 5): ${suggestedQuantity} uds\n` +
      `Costo unitario: $${p.price.toFixed(2)}\n` +
      `Costo total estimado: $${totalCost.toFixed(2)}`
    );
  };

  return (
    <div className="animar-aparicion">
      
      <div className="panel-dashboard" style={{ marginBottom: '24px' }}>
        <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
          Control de Existencias Críticas
        </h3>
        <p style={{ color: 'var(--color-mutado)', fontSize: '14px', lineHeight: '1.5' }}>
          A continuación se presentan los componentes de hardware cuyo stock actual es menor o igual al stock de seguridad mínimo configurado.
        </p>
      </div>

      <div className="contenedor-tabla desplazamiento-horizontal">
        <table className="tabla-personalizada">
          <thead>
            <tr>
              <th>Componente</th>
              <th>Categoría</th>
              <th>Stock Actual</th>
              <th>Stock Mínimo</th>
              <th>Déficit</th>
              <th className="alineacion-derecha">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {criticalProducts.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--color-mutado)', padding: '32px 0' }}>
                  No hay componentes con stock crítico. Reposición al día.
                </td>
              </tr>
            ) : (
              criticalProducts.map(p => {
                const deficit = p.minStock - p.stock;
                return (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 'bold', color: 'white' }}>
                      {p.brand} {p.model}
                    </td>
                    <td>
                      <span className="etiqueta etiqueta-azul">
                        {p.category}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--rojo)', fontFamily: 'monospace', fontWeight: 'bold' }}>
                        {p.stock} uds
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--color-mutado)' }}>
                      {p.minStock} uds
                    </td>
                    <td>
                      <span className="etiqueta etiqueta-roja" style={{ fontWeight: 'bold' }}>
                        -{deficit} uds
                      </span>
                    </td>
                    <td className="alineacion-derecha">
                      <button onClick={() => handleReorder(p)} className="boton boton-advertencia">
                        Reabastecer
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Alerts;
