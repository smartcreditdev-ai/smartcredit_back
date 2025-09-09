import React, { useState } from 'react';
import { FileText, X, Save, Calculator } from 'lucide-react';

const CreditApplicationForm = ({ isOpen, onClose, onSubmit, prospect = null }) => {
  const [formData, setFormData] = useState({
    cliente: prospect ? prospect.cliente : '',
    documento: '',
    email: prospect ? prospect.email : '',
    telefono: '',
    direccion: '',
    ocupacion: '',
    ingresosMensuales: '',
    gastosMensuales: '',
    montoSolicitado: prospect ? prospect.montoSolicitado : '',
    plazo: '',
    producto: prospect ? prospect.producto : '',
    proposito: '',
    garantias: '',
    referencias: '',
    observaciones: ''
  });

  const productos = [
    { value: 'personal', label: 'Personal', tasa: '24%', plazoMax: 36 },
    { value: 'hipotecario', label: 'Hipotecario', tasa: '18%', plazoMax: 240 },
    { value: 'automotriz', label: 'Automotriz', tasa: '22%', plazoMax: 60 },
    { value: 'comercial', label: 'Comercial', tasa: '26%', plazoMax: 48 }
  ];

  const plazos = [
    { value: '12', label: '12 meses' },
    { value: '24', label: '24 meses' },
    { value: '36', label: '36 meses' },
    { value: '48', label: '48 meses' },
    { value: '60', label: '60 meses' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateCuota = () => {
    const monto = parseFloat(formData.montoSolicitado) || 0;
    const plazo = parseInt(formData.plazo) || 0;
    const producto = productos.find(p => p.value === formData.producto);
    
    if (monto && plazo && producto) {
      const tasaMensual = parseFloat(producto.tasa) / 100 / 12;
      const cuota = monto * (tasaMensual * Math.pow(1 + tasaMensual, plazo)) / (Math.pow(1 + tasaMensual, plazo) - 1);
      return cuota.toFixed(2);
    }
    return 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cuotaCalculada = calculateCuota();
    const solicitudData = {
      ...formData,
      cuotaMensual: cuotaCalculada,
      fechaSolicitud: new Date().toISOString(),
      estado: 'Pendiente'
    };
    onSubmit(solicitudData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-primary-600" />
            Solicitud de Crédito
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información del Cliente */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="cliente"
                  value={formData.cliente}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Documento de Identidad *
                </label>
                <input
                  type="text"
                  name="documento"
                  value={formData.documento}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección *
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ocupación *
                </label>
                <input
                  type="text"
                  name="ocupacion"
                  value={formData.ocupacion}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ingresos Mensuales *
                </label>
                <input
                  type="number"
                  name="ingresosMensuales"
                  value={formData.ingresosMensuales}
                  onChange={handleChange}
                  required
                  min="0"
                  step="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gastos Mensuales *
                </label>
                <input
                  type="number"
                  name="gastosMensuales"
                  value={formData.gastosMensuales}
                  onChange={handleChange}
                  required
                  min="0"
                  step="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Información del Crédito */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Crédito</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto Solicitado *
                </label>
                <input
                  type="number"
                  name="montoSolicitado"
                  value={formData.montoSolicitado}
                  onChange={handleChange}
                  required
                  min="0"
                  step="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Producto *
                </label>
                <select
                  name="producto"
                  value={formData.producto}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Seleccionar producto</option>
                  {productos.map(producto => (
                    <option key={producto.value} value={producto.value}>
                      {producto.label} - Tasa: {producto.tasa}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plazo (meses) *
                </label>
                <select
                  name="plazo"
                  value={formData.plazo}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Seleccionar plazo</option>
                  {plazos.map(plazo => (
                    <option key={plazo.value} value={plazo.value}>
                      {plazo.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Propósito del Crédito *
                </label>
                <input
                  type="text"
                  name="proposito"
                  value={formData.proposito}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Calculadora de Cuota */}
            {formData.montoSolicitado && formData.plazo && formData.producto && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calculator className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium text-blue-900">Cálculo de Cuota</span>
                </div>
                <div className="text-sm text-blue-800">
                  <p>Cuota mensual estimada: <span className="font-semibold">${calculateCuota()}</span></p>
                  <p>Total a pagar: <span className="font-semibold">${(parseFloat(calculateCuota()) * parseInt(formData.plazo)).toFixed(2)}</span></p>
                </div>
              </div>
            )}
          </div>

          {/* Información Adicional */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información Adicional</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Garantías
                </label>
                <textarea
                  name="garantias"
                  value={formData.garantias}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describa las garantías que puede ofrecer..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referencias
                </label>
                <textarea
                  name="referencias"
                  value={formData.referencias}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Referencias personales o comerciales..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Observaciones adicionales..."
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Enviar Solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreditApplicationForm;
