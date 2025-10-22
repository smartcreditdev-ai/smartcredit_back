import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const RejectUserModal = ({ isOpen, onClose, user, onConfirm, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Rechazar Usuario</h3>
              <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Detalles del Usuario</h4>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm"><span className="font-medium">Nombre:</span> {user?.nombre} {user?.apellido}</p>
              <p className="text-sm"><span className="font-medium">Email:</span> {user?.email}</p>
              <p className="text-sm"><span className="font-medium">Teléfono:</span> {user?.telefono}</p>
              <p className="text-sm"><span className="font-medium">Rol:</span> {user?.rol}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">¿Qué sucede al rechazar?</h4>
                  <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                    <li>• El usuario permanecerá en el sistema</li>
                    <li>• Su estado cambiará a "Inactivo"</li>
                    <li>• No podrá acceder a la aplicación</li>
                    <li>• Podrá ser aprobado nuevamente en el futuro</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Rechazando...' : 'Rechazar Usuario'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectUserModal;
