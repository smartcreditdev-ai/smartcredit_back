import React, { useState } from 'react';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  FileText,
  Eye
} from 'lucide-react';

const ClientCreditHistory = ({ client, onClose }) => {
  const [selectedCredit, setSelectedCredit] = useState(null);

  // Datos de ejemplo del historial de créditos del cliente
  const creditHistory = [
    {
      id: 'C001',
      tipo: 'Personal',
      monto: 15000,
      fechaAprobacion: '2022-03-15',
      fechaVencimiento: '2023-03-15',
      estado: 'Pagado',
      cuotasPagadas: 12,
      cuotasTotales: 12,
      saldoFinal: 0,
      promotor: 'María García',
      observaciones: 'Crédito pagado completamente sin atrasos'
    },
    {
      id: 'C002',
      tipo: 'Automotriz',
      monto: 25000,
      fechaAprobacion: '2023-06-10',
      fechaVencimiento: '2025-06-10',
      estado: 'Activo',
      cuotasPagadas: 8,
      cuotasTotales: 24,
      saldoFinal: 16667,
      promotor: 'Carlos López',
      observaciones: 'Pagos al día, buen comportamiento'
    },
    {
      id: 'C003',
      tipo: 'Hipotecario',
      monto: 80000,
      fechaAprobacion: '2023-12-01',
      fechaVencimiento: '2033-12-01',
      estado: 'Activo',
      cuotasPagadas: 2,
      cuotasTotales: 120,
      saldoFinal: 78667,
      promotor: 'Ana Martínez',
      observaciones: 'Crédito hipotecario reciente, pagos puntuales'
    }
  ];

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'Pagado':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Activo':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'Vencido':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Pagado':
        return 'bg-green-100 text-green-800';
      case 'Activo':
        return 'bg-blue-100 text-blue-800';
      case 'Vencido':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProductColor = (tipo) => {
    switch (tipo) {
      case 'Personal':
        return 'bg-blue-100 text-blue-800';
      case 'Automotriz':
        return 'bg-purple-100 text-purple-800';
      case 'Hipotecario':
        return 'bg-green-100 text-green-800';
      case 'Comercial':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Estadísticas del cliente
  const stats = {
    totalCredits: creditHistory.length,
    activeCredits: creditHistory.filter(c => c.estado === 'Activo').length,
    paidCredits: creditHistory.filter(c => c.estado === 'Pagado').length,
    totalBorrowed: creditHistory.reduce((sum, c) => sum + c.monto, 0),
    currentDebt: creditHistory.filter(c => c.estado === 'Activo').reduce((sum, c) => sum + c.saldoFinal, 0),
    totalPaid: creditHistory.filter(c => c.estado === 'Pagado').reduce((sum, c) => sum + c.monto, 0)
  };

  if (!client) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Historial de Créditos</h2>
            <p className="text-sm text-gray-600 mt-1">{client.cliente} - {client.documento}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Estadísticas del Cliente */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalCredits}</div>
              <div className="text-sm text-blue-800">Total Créditos</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{stats.activeCredits}</div>
              <div className="text-sm text-green-800">Activos</div>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-emerald-600">{stats.paidCredits}</div>
              <div className="text-sm text-emerald-800">Pagados</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">${stats.totalBorrowed.toLocaleString()}</div>
              <div className="text-sm text-purple-800">Total Solicitado</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">${stats.currentDebt.toLocaleString()}</div>
              <div className="text-sm text-orange-800">Deuda Actual</div>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-indigo-600">${stats.totalPaid.toLocaleString()}</div>
              <div className="text-sm text-indigo-800">Total Pagado</div>
            </div>
          </div>

          {/* Línea de Tiempo de Créditos */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Línea de Tiempo de Créditos</h3>
            <div className="space-y-4">
              {creditHistory.map((credit, index) => (
                <div key={credit.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0">
                    {getStatusIcon(credit.estado)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">Crédito #{credit.id}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getProductColor(credit.tipo)}`}>
                          {credit.tipo}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(credit.estado)}`}>
                          {credit.estado}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedCredit(credit)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Ver Detalles
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Monto:</span>
                        <span className="font-medium ml-1">${credit.monto.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Aprobado:</span>
                        <span className="font-medium ml-1">{new Date(credit.fechaAprobacion).toLocaleDateString('es-ES')}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Vencimiento:</span>
                        <span className="font-medium ml-1">{new Date(credit.fechaVencimiento).toLocaleDateString('es-ES')}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Progreso:</span>
                        <span className="font-medium ml-1">{credit.cuotasPagadas}/{credit.cuotasTotales} cuotas</span>
                      </div>
                    </div>

                    {credit.estado === 'Activo' && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Saldo Pendiente:</span>
                          <span className="font-medium text-red-600">${credit.saldoFinal.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(credit.cuotasPagadas / credit.cuotasTotales) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal de Detalles del Crédito */}
        {selectedCredit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Detalles del Crédito #{selectedCredit.id}</h3>
                <button
                  onClick={() => setSelectedCredit(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tipo de Crédito</label>
                    <p className="text-gray-900">{selectedCredit.tipo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Monto Original</label>
                    <p className="text-gray-900">${selectedCredit.monto.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Fecha de Aprobación</label>
                    <p className="text-gray-900">{new Date(selectedCredit.fechaAprobacion).toLocaleDateString('es-ES')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Fecha de Vencimiento</label>
                    <p className="text-gray-900">{new Date(selectedCredit.fechaVencimiento).toLocaleDateString('es-ES')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Promotor</label>
                    <p className="text-gray-900">{selectedCredit.promotor}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Estado</label>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedCredit.estado)}`}>
                      {selectedCredit.estado}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Observaciones</label>
                  <p className="text-gray-900 mt-1">{selectedCredit.observaciones}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientCreditHistory;
