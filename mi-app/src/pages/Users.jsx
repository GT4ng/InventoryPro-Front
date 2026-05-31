import React from 'react';

const Users = () => {
  return (
    <div className="max-w-2xl mx-auto text-white mt-10">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-xl text-center space-y-5">
        <h3 className="text-xl font-bold text-white">Módulo: Personal / Roles</h3>
        
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-lg">
          <strong>[Hito Planificado] - Plazo 3</strong><br />
          Este módulo está asignado a <strong>Rodrigo</strong> y será implementado en la fase final de integración.
        </div>

        <p className="text-sm text-slate-400 leading-relaxed">
          En el Plazo 3 se habilitará el panel de administración de cuentas de colaboradores, permitiendo a los administradores registrar accesos de operarios, cambiar roles y suspender cuentas de personal.
        </p>
      </div>
    </div>
  );
};

export default Users;
