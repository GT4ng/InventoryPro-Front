import React from 'react';

const Reports = () => {
  return (
    <div className="max-w-2xl mx-auto text-white mt-10">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-xl text-center space-y-5">
        <h3 className="text-xl font-bold text-white">Módulo: Reportes de Valoración</h3>
        
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-lg">
          <strong>[Hito Planificado] - Plazo 3</strong><br />
          Este módulo está asignado a <strong>Rodrigo</strong> y será implementado en la fase final de integración.
        </div>

        <p className="text-sm text-slate-400 leading-relaxed">
          En el Plazo 3 se integrará el consolidado de costos y cantidades físicas por categorías de hardware, filtros cruzados de existencias y la simulación de exportación de informes en libros de Excel.
        </p>
      </div>
    </div>
  );
};

export default Reports;
