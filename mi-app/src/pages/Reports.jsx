import React from 'react';
import { useInventory } from '../context/InventoryContext';

const Reports = () => {
  const { products } = useInventory();

  const totalValuation = products ? products.reduce((acc, p) => acc + (p.stock * p.price), 0) : 0;
  const totalUnits = products ? products.reduce((acc, p) => acc + p.stock, 0) : 0;
  const totalProducts = products ? products.length : 0;

  const handleExportCSV = () => {
    alert(
      `Exportación simulada con éxito.\n\n` +
      `Se ha generado y descargado el reporte consolidado en formato CSV/Excel conteniendo ${totalProducts} componentes de hardware.`
    );
  };

  return (
    <div className="animar-aparicion">
      
      <div className="panel-dashboard" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>
            Reportes Analíticos y Valuación
          </h3>
          <p style={{ fontSize: '12px' }}>
            Resumen consolidado del costo de inventario y desglose por componente de hardware.
          </p>
        </div>
        <button onClick={handleExportCSV} className="boton boton-exito">
          Exportar a Excel / CSV
        </button>
      </div>

      <div className="rejilla-metricas">
        
        <div className="tarjeta-metrica">
          <span className="titulo-tarjeta">Valuación Total</span>
          <div className="valor-tarjeta">
            ${totalValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="desc-tarjeta mutado">Inversión total en stock</span>
        </div>

        <div className="tarjeta-metrica">
          <span className="titulo-tarjeta">Unidades Totales</span>
          <div className="valor-tarjeta">{totalUnits} uds</div>
          <span className="desc-tarjeta mutado">Cantidad total de hardware físico</span>
        </div>

        <div className="tarjeta-metrica">
          <span className="titulo-tarjeta">Variedad de Componentes</span>
          <div className="valor-tarjeta">{totalProducts} items</div>
          <span className="desc-tarjeta mutado">Modelos de hardware en catálogo</span>
        </div>

      </div>

      <div className="contenedor-tabla desplazamiento-horizontal">
        <table className="tabla-personalizada">
          <thead>
            <tr>
              <th>Componente</th>
              <th>Categoría</th>
              <th>Existencias</th>
              <th>Precio Unitario</th>
              <th>Valuación Total</th>
            </tr>
          </thead>
          <tbody>
            {totalProducts === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '32px 0' }}>
                  No hay componentes registrados para valuar.
                </td>
              </tr>
            ) : (
              products.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 'bold', color: 'white' }}>
                    {p.brand} {p.model}
                  </td>
                  <td>
                    <span className="etiqueta etiqueta-azul">
                      {p.category}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace' }}>
                    {p.stock} uds
                  </td>
                  <td style={{ fontFamily: 'monospace' }}>
                    ${p.price.toFixed(2)}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 'bold'}}>
                    ${(p.stock * p.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

export default Reports;
