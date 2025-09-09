import React, { useState } from 'react';
import { UserCheck, X, Save } from 'lucide-react';

const AssignPromoterModal = ({ isOpen, onClose, prospect, onAssign }) => {
  const [selectedPromoter, setSelectedPromoter] = useState(prospect?.promotor || '');

  const promotores = [
    { value: 'maria-garcia', label: 'María García', cartera: '$150,000', clientes: 25 },
    { value: 'carlos-lopez', label: 'Carlos López', cartera: '$200,000', clientes: 32 },
    { value: 'juan-perez', label: 'Juan Pérez', cartera: '$120,000', clientes: 18 },
    { value: 'ana-martinez', label: 'Ana Martínez', cartera: '$180,000', clientes: 28 }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedPromoter) {
      onAssign(prospect.id, selectedPromoter);
      onClose();
    }
  };

  if (!isOpen || !prospect) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <UserCheck className="w-5 h-5 mr-2 text-primary-600" />
            Asignar Promotor
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Prospecto</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-medium text-gray-900">{prospect.cliente}</div>
              <div className="text-sm text-gray-600">Monto: ${prospect.montoSolicitado?.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Producto: {prospect.producto}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Seleccionar Promotor *
              </label>
              <div className="space-y-3">
                {promotores.map((promotor) => (
                  <label key={promotor.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="promoter"
                      value={promotor.value}
                      checked={selectedPromoter === promotor.value}
                      onChange={(e) => setSelectedPromoter(e.target.value)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-gray-900">{promotor.label}</div>
                      <div className="text-sm text-gray-600">
                        Cartera: {promotor.cartera} • Clientes: {promotor.clientes}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!selectedPromoter}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Asignar Promotor
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignPromoterModal;
