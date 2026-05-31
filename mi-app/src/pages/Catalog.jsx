import React from 'react';

const Catalog = () => {
  return (
    <div className="max-w-2xl mx-auto text-white mt-10">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-xl text-center space-y-5">
        <h3 className="text-xl font-bold text-white">Módulo: Catálogo de Hardware</h3>
        
        <div className="bg-blue-600/10 border border-blue-500/20 text-blue-400 text-sm p-4 rounded-lg">
          <strong>[Hito Planificado] - Plazo 2</strong><br />
          Este módulo está asignado a <strong>Guille</strong> y será implementado en la siguiente fase de desarrollo.
        </div>

        <p className="text-sm text-slate-400 leading-relaxed">
          En el Plazo 2 se añadirá la tabla reactiva con todos los componentes tecnológicos, búsqueda en tiempo real por texto, filtros por categoría (CPU, GPU, RAM, etc.) y la lógica CRUD completa para agregar, editar y eliminar piezas en almacén.
        </p>
      </div>
    </div>
  );
};

export default Catalog;
