import React, { useState } from 'react';
import { CheckCircle, XCircle, X, Save, AlertTriangle } from 'lucide-react';

const ApprovalModal = ({ isOpen, onClose, application, onApprove, onReject }) => {
  const [decision, setDecision] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [montoAprobado, setMontoAprobado] = useState(application?.montoSolicitado || '');
  const [plazoAprobado, setPlazoAprobado] = useState(application?.plazo || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (decision === 'approve') {
      onApprove(application.id, {
        montoAprobado: parseFloat(montoAprobado),
        plazoAprobado: parseInt(plazoAprobado),
        comentarios
      });
    } else if (decision === 'reject') {
      onReject(application.id, comentarios);
    }
    setDecision('');
    setComentarios('');
    onClose();
  };

  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            {decision === 'approve' ? (
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            ) : decision === 'reject' ? (
              <XCircle className="w-5 h-5 mr-2 text-red-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
            )}
            Evaluación de Solicitud
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Información de la Solicitud */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles de la Solicitud</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Cliente:</span>
                  <span className="ml-2 text-gray-900">{application.cliente}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Documento:</span>
                  <span className="ml-2 text-gray-900">{application.documento}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Monto Solicitado:</span>
                  <span className="ml-2 text-gray-900">${application.montoSolicitado?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Producto:</span>
                  <span className="ml-2 text-gray-900">{application.producto}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Plazo:</span>
                  <span className="ml-2 text-gray-900">{application.plazo} meses</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Cuota Mensual:</span>
                  <span className="ml-2 text-gray-900">${application.cuotaMensual}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Ingresos Mensuales:</span>
                  <span className="ml-2 text-gray-900">${application.ingresosMensuales?.toLocaleString()}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Propósito:</span>
                  <span className="ml-2 text-gray-900">{application.proposito}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Análisis de Capacidad de Pago */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Análisis de Capacidad de Pago</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-700">Ingresos:</span>
                  <span className="ml-2 text-blue-900">${application.ingresosMensuales?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Gastos:</span>
                  <span className="ml-2 text-blue-900">${application.gastosMensuales?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Disponible:</span>
                  <span className="ml-2 text-blue-900">${(application.ingresosMensuales - application.gastosMensuales)?.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-2">
                <span className="font-medium text-blue-700">Capacidad de Pago:</span>
                <span className={`ml-2 font-semibold ${
                  (application.ingresosMensuales - application.gastosMensuales) >= application.cuotaMensual * 1.3
                    ? 'text-green-600' : 'text-red-600'
                }`}>
                  {((application.ingresosMensuales - application.gastosMensuales) >= application.cuotaMensual * 1.3) ? 'Adecuada' : 'Insuficiente'}
                </span>
              </div>
            </div>
          </div>

          {/* Decisiones */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Decisión</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDecision('approve')}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    decision === 'approve'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center">
                    <CheckCircle className={`w-6 h-6 mr-3 ${decision === 'approve' ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                      <div className="font-medium text-gray-900">Aprobar Crédito</div>
                      <div className="text-sm text-gray-600">Aprobar la solicitud de crédito</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDecision('reject')}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    decision === 'reject'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  <div className="flex items-center">
                    <XCircle className={`w-6 h-6 mr-3 ${decision === 'reject' ? 'text-red-600' : 'text-gray-400'}`} />
                    <div>
                      <div className="font-medium text-gray-900">Denegar Crédito</div>
                      <div className="text-sm text-gray-600">Rechazar la solicitud de crédito</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Campos de Aprobación */}
            {decision === 'approve' && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Condiciones de Aprobación</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monto Aprobado *
                    </label>
                    <input
                      type="number"
                      value={montoAprobado}
                      onChange={(e) => setMontoAprobado(e.target.value)}
                      required
                      min="0"
                      step="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plazo Aprobado (meses) *
                    </label>
                    <input
                      type="number"
                      value={plazoAprobado}
                      onChange={(e) => setPlazoAprobado(e.target.value)}
                      required
                      min="1"
                      max="240"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Comentarios */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comentarios {decision === 'approve' ? 'de Aprobación' : decision === 'reject' ? 'de Denegación' : ''} *
              </label>
              <textarea
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                required
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={decision === 'approve' 
                  ? 'Comentarios sobre la aprobación del crédito...'
                  : decision === 'reject'
                  ? 'Razones para denegar el crédito...'
                  : 'Comentarios sobre la evaluación...'
                }
              />
            </div>

            {/* Botones */}
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
                disabled={!decision || !comentarios}
                className={`px-4 py-2 text-white rounded-lg transition-colors duration-200 flex items-center ${
                  decision === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : decision === 'reject'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <Save className="w-4 h-4 mr-2" />
                {decision === 'approve' ? 'Aprobar Crédito' : decision === 'reject' ? 'Denegar Crédito' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;
