import React from 'react';
import { useInventory } from '../context/InventoryContext';

const Dashboard = () => {
  const { products, movements } = useInventory();

  const totalValuation = products.reduce((acc, p) => acc + (p.stock * p.price), 0);
  const totalProducts = products.length;
  const alertsCount = products.filter(p => p.stock <= p.minStock).length;

  const recentMovements = movements.slice(0, 4);

  return (
    <div className="space-y-8 text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md hover:border-slate-600 transition-all">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Valor del Inventario
          </span>
          <div className="text-3xl font-extrabold text-white">
            ${totalValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-emerald-400 font-semibold block mt-2">
            Costo total de existencias
          </span>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md hover:border-slate-600 transition-all">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Componentes en Catálogo
          </span>
          <div className="text-3xl font-extrabold text-white">{totalProducts}</div>
          <span className="text-xs text-slate-400 font-semibold block mt-2">
            Piezas de hardware registradas
          </span>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md hover:border-slate-600 transition-all">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Alertas de Stock
          </span>
          <div className={`text-3xl font-extrabold ${alertsCount > 0 ? 'text-red-500' : 'text-white'}`}>
            {alertsCount}
          </div>
          <span className={`text-xs font-semibold block mt-2 ${alertsCount > 0 ? 'text-red-400' : 'text-slate-400'}`}>
            {alertsCount > 0 ? 'Requiere reabastecimiento crítico' : 'Reposición al día'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-700">
            <h3 className="text-lg font-bold text-white">
              Últimas Transacciones de Almacén
            </h3>
          </div>

          <ul className="divide-y divide-slate-700">
            {recentMovements.length === 0 ? (
              <li className="py-4 text-center text-slate-500 text-sm">
                No hay transacciones registradas recientemente.
              </li>
            ) : (
              recentMovements.map(m => (
                <li key={m.id} className="py-3.5 flex justify-between items-center text-sm">
                  <div>
                    <strong className="text-white font-semibold">{m.productName}</strong>
                    <div className="text-xs text-slate-400 mt-0.5">Operado por: {m.user} ({m.role})</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <strong className={`font-mono text-base ${m.type === 'entrada' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {m.type === 'entrada' ? '+' : '-'}{m.quantity}
                    </strong>
                    <span className={`badge text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      m.type === 'entrada' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {m.type === 'entrada' ? 'Entrada' : 'Salida'}
                    </span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-5 pb-3 border-b border-slate-700">
              Cronograma de Desarrollo
            </h3>
            <div className="space-y-4 text-xs">
              <div className="border-l-2 border-blue-500 pl-3">
                <span className="font-semibold text-blue-400 block">Plazo 1: Hugo (Actual)</span>
                <span className="text-slate-300">Layout, Login y Dashboard de Control.</span>
              </div>
              <div className="border-l-2 border-slate-600 pl-3">
                <span className="font-semibold text-slate-400 block">Plazo 2: Guille</span>
                <span className="text-slate-500">Catálogo (CRUD) y Fichas Técnicas de componentes.</span>
              </div>
              <div className="border-l-2 border-slate-600 pl-3">
                <span className="font-semibold text-slate-400 block">Plazo 3: Rodrigo</span>
                <span className="text-slate-500">Entradas/Salidas, Historiales, Alertas, Reportes y Roles.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
