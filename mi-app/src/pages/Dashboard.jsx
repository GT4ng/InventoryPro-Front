import React from 'react';

const Dashboard = () => {
  const mockValuation = 14589.90;
  const mockTotalProducts = 15;
  const mockAlertsCount = 2;

  const mockMovements = [
    { id: 1, productName: "Intel Core i9-13900K", type: "entrada", quantity: 5, date: "2026-05-25T14:30:00Z", user: "Administrador", role: "admin" },
    { id: 2, productName: "NVIDIA GeForce RTX 4080 Super", type: "salida", quantity: 2, date: "2026-05-26T10:15:00Z", user: "Operario", role: "operario" }
  ];

  return (
    <div className="space-y-8 text-white animate-in fade-in duration-300">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md transition-all duration-300 hover:border-slate-650">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Valor del Inventario
          </span>
          <div className="text-3xl font-extrabold text-white font-mono">
            ${mockValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-emerald-400 font-semibold block mt-2">
            Costo total de existencias (Semilla)
          </span>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md transition-all duration-300 hover:border-slate-650">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Componentes en Catálogo
          </span>
          <div className="text-3xl font-extrabold text-white font-mono">
            {mockTotalProducts}
          </div>
          <span className="text-xs text-slate-400 font-semibold block mt-2">
            Piezas de hardware registradas (Semilla)
          </span>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md transition-all duration-300 hover:border-slate-650">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Alertas de Stock
          </span>
          <div className={`text-3xl font-extrabold font-mono ${mockAlertsCount > 0 ? 'text-red-500' : 'text-white'}`}>
            {mockAlertsCount}
          </div>
          <span className={`text-xs font-semibold block mt-2 ${mockAlertsCount > 0 ? 'text-red-400' : 'text-slate-400'}`}>
            Requiere reabastecimiento crítico (Semilla)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-700">
            <h3 className="text-lg font-bold text-white">
              Últimas Transacciones de Almacén (Muestra)
            </h3>
          </div>

          <ul className="divide-y divide-slate-700">
            {mockMovements.map(m => (
              <li key={m.id} className="py-3.5 flex justify-between items-center text-sm">
                <div>
                  <strong className="text-white font-semibold">{m.productName}</strong>
                  <div className="text-xs text-slate-400 mt-0.5">Operado por: {m.user} ({m.role})</div>
                </div>
                <div className="flex items-center gap-3">
                  <strong className={`font-mono text-base ${m.type === 'entrada' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {m.type === 'entrada' ? '+' : '-'}{m.quantity}
                  </strong>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                    m.type === 'entrada' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {m.type === 'entrada' ? 'Entrada' : 'Salida'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>        
      </div>
    </div>
  );
};

export default Dashboard;
