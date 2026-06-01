import React from 'react';
import { useInventory } from '../context/InventoryContext';

const Dashboard = () => {
  const { products, movements } = useInventory();

  const totalValuation = products ? products.reduce((acc, p) => acc + (p.stock * p.price), 0) : 0;

  const totalProducts = products ? products.length : 0;

  const alertsCount = products ? products.filter(p => p.stock <= p.minStock).length : 0;

  const recentMovements = movements ? movements.slice(0, 4) : [];

  return (
    <div className="animar-aparicion">
      
      <div className="rejilla-metricas">
        
        <div className="tarjeta-metrica">
          <span className="titulo-tarjeta">Valor del Inventario</span>
          <div className="valor-tarjeta">
            ${totalValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="desc-tarjeta verde">Costo total de existencias</span>
        </div>

        <div className="tarjeta-metrica">
          <span className="titulo-tarjeta">Componentes en Catálogo</span>
          <div className="valor-tarjeta">{totalProducts}</div>
          <span className="desc-tarjeta mutado">Piezas de hardware registradas</span>
        </div>

        <div className="tarjeta-metrica">
          <span className="titulo-tarjeta">Alertas de Stock</span>
          <div className="valor-tarjeta" style={{ color: alertsCount > 0 ? 'var(--rojo)' : 'white' }}>
            {alertsCount}
          </div>
          <span className={`desc-tarjeta ${alertsCount > 0 ? 'rojo' : 'mutado'}`}>
            {alertsCount > 0 ? 'Requiere reabastecimiento crítico' : 'Reposición al día'}
          </span>
        </div>
      </div>

      <div className="division-dashboard">
        
        <div className="panel-dashboard">
          <div className="cabecera-panel">
            <h3>Últimas Transacciones de Almacén</h3>
          </div>

          <ul className="lista-recientes">
            {recentMovements.length === 0 ? (
              <li className="item-reciente" style={{ justifyContent: 'center', color: 'var(--color-mutado)' }}>
                No hay transacciones registradas recientemente.
              </li>
            ) : (
              recentMovements.map(m => (
                <li key={m.id} className="item-reciente">
                  <div className="info-item">
                    <strong>{m.productName}</strong>
                    <div className="item-meta">Operado por: {m.user} ({m.role})</div>
                  </div>
                  <div className="accion-item">
                    <span 
                      className="cantidad-accion" 
                      style={{ color: m.type === 'entrada' ? 'var(--verde)' : 'var(--rojo)' }}
                    >
                      {m.type === 'entrada' ? '+' : '-'}{m.quantity}
                    </span>
                    <span className={`etiqueta ${m.type === 'entrada' ? 'etiqueta-verde' : 'etiqueta-roja'}`}>
                      {m.type === 'entrada' ? 'Entrada' : 'Salida'}
                    </span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>        
      </div>
    </div>
  );
};

export default Dashboard;
