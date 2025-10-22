import React, { useState, useEffect } from 'react';
import { FileText, X, Save, Loader2 } from 'lucide-react';
import { getClientes, insertAplicacion } from '../services/api';

const CreditApplicationForm = ({ isOpen, onClose, onSubmit, prospect = null, editData = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    cliente_id: prospect ? prospect.id : '',
    monto_solicitado: prospect ? prospect.montoSolicitado : '',
    plazo_deseado: '',
    proposito: '',
    ingresos_mensuales: '',
    empresa: '',
    cargo: '',
    telefono_empresa: '',
    anios_en_empresa: '',
    otros_ingresos: '',
    personal_ref1_nombre: '',
    personal_ref1_telefono: '',
    personal_ref1_relacion: '',
    personal_ref2_nombre: '',
    personal_ref2_telefono: '',
    observaciones: ''
  });

  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // Cargar clientes al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadClientes();
    }
  }, [isOpen]);

  // Cargar datos del prospecto si se pasa como prop
  useEffect(() => {
    if (isOpen && prospect) {
      setFormData(prev => ({
        ...prev,
        cliente_id: prospect.id,
        monto_solicitado: prospect.montoSolicitado || ''
      }));
      setClienteSeleccionado(prospect);
    }
  }, [isOpen, prospect]);

  // Cargar datos de edición si se pasa como prop
  useEffect(() => {
    if (isOpen && isEditing && editData) {
      setFormData({
        cliente_id: editData.cliente_id || '',
        monto_solicitado: editData.monto_solicitado || '',
        plazo_deseado: editData.plazo_deseado || '',
        proposito: editData.proposito || '',
        ingresos_mensuales: editData.ingresos_mensuales || '',
        empresa: editData.empresa || '',
        cargo: editData.cargo || '',
        telefono_empresa: editData.telefono_empresa || '',
        anios_en_empresa: editData.anios_en_empresa || '',
        otros_ingresos: editData.otros_ingresos || '',
        personal_ref1_nombre: editData.personal_ref1_nombre || '',
        personal_ref1_telefono: editData.personal_ref1_telefono || '',
        personal_ref1_relacion: editData.personal_ref1_relacion || '',
        personal_ref2_nombre: editData.personal_ref2_nombre || '',
        personal_ref2_telefono: editData.personal_ref2_telefono || '',
        observaciones: editData.observaciones || ''
      });
      
      // Buscar el cliente en la lista para mostrarlo
      if (editData.cliente_id && clientes.length > 0) {
        const cliente = clientes.find(c => c.id === editData.cliente_id);
        setClienteSeleccionado(cliente);
      }
    } else if (isOpen && !isEditing) {
      // Resetear formulario para nueva aplicación
      setFormData({
        cliente_id: '',
        monto_solicitado: '',
        plazo_deseado: '',
        proposito: '',
        ingresos_mensuales: '',
        empresa: '',
        cargo: '',
        telefono_empresa: '',
        anios_en_empresa: '',
        otros_ingresos: '',
        personal_ref1_nombre: '',
        personal_ref1_telefono: '',
        personal_ref1_relacion: '',
        personal_ref2_nombre: '',
        personal_ref2_telefono: '',
        observaciones: ''
      });
      setClienteSeleccionado(null);
    }
  }, [isOpen, isEditing, editData, clientes]);

  const loadClientes = async () => {
    try {
      setLoadingClientes(true);
      const clientesData = await getClientes();
      setClientes(clientesData);
    } catch (error) {
      console.error('Error cargando clientes:', error);
    } finally {
      setLoadingClientes(false);
    }
  };


  const plazos = [
    { value: '12', label: '12 meses' },
    { value: '24', label: '24 meses' },
    { value: '36', label: '36 meses' },
    { value: '48', label: '48 meses' },
    { value: '60', label: '60 meses' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cliente_id') {
      const cliente = clientes.find(c => c.id === value);
      setClienteSeleccionado(cliente);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        // En modo edición, solo pasar los datos al componente padre
        onSubmit(formData);
        onClose();
      } else {
        // En modo creación, insertar nueva aplicación
        const solicitudData = {
          id: crypto.randomUUID(),
          ...formData,
          fecha_solicitud: new Date().toISOString(),
          estado: 'Pendiente'
        };
        
        // Insertar en la base de datos
        const insertedAplicacion = await insertAplicacion(solicitudData);
        
        if (insertedAplicacion) {
          // Llamar al callback del componente padre
          onSubmit(insertedAplicacion);
          onClose();
          
          // Resetear formulario
          setFormData({
            cliente_id: '',
            monto_solicitado: '',
            plazo_deseado: '',
            proposito: '',
            ingresos_mensuales: '',
            empresa: '',
            cargo: '',
            telefono_empresa: '',
            anios_en_empresa: '',
            otros_ingresos: '',
            personal_ref1_nombre: '',
            personal_ref1_telefono: '',
            personal_ref1_relacion: '',
            personal_ref2_nombre: '',
            personal_ref2_telefono: '',
            observaciones: ''
          });
          setClienteSeleccionado(null);
        }
      }
    } catch (error) {
      console.error('Error procesando solicitud:', error);
      alert('Error al procesar la solicitud. Por favor, verifica los datos e inténtalo de nuevo.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-primary-600" />
            {isEditing ? 'Editar Solicitud de Crédito' : 'Solicitud de Crédito'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Selección de Cliente */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Selección de Cliente</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente *
                </label>
                {loadingClientes ? (
                  <div className="flex items-center justify-center p-3 border border-gray-300 rounded-lg">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Cargando clientes...</span>
                  </div>
                ) : (
                  <select
                    name="cliente_id"
                    value={formData.cliente_id}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar cliente...</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre} {cliente.apellido} - DNI: {cliente.dni}
                      </option>
                    ))}
                  </select>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Selecciona un cliente existente para crear la solicitud de crédito
                </p>
              </div>
              
              {/* Información del Cliente Seleccionado */}
              {clienteSeleccionado && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Información del Cliente</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Nombre:</span>
                      <span className="ml-2 text-gray-900">{clienteSeleccionado.nombre} {clienteSeleccionado.apellido}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">DNI:</span>
                      <span className="ml-2 text-gray-900">{clienteSeleccionado.dni}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Email:</span>
                      <span className="ml-2 text-gray-900">{clienteSeleccionado.email}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Teléfono:</span>
                      <span className="ml-2 text-gray-900">{clienteSeleccionado.telefono}</span>
                    </div>
                    {clienteSeleccionado.direccion && (
                      <div className="md:col-span-2">
                        <span className="font-medium text-gray-600">Dirección:</span>
                        <span className="ml-2 text-gray-900">{clienteSeleccionado.direccion}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Información Laboral */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información Laboral</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Empresa *
                </label>
                <input
                  type="text"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo *
                </label>
                <input
                  type="text"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono Empresa
                </label>
                <input
                  type="tel"
                  name="telefono_empresa"
                  value={formData.telefono_empresa}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Años en la Empresa
                </label>
                <input
                  type="number"
                  name="anios_en_empresa"
                  value={formData.anios_en_empresa}
                  onChange={handleChange}
                  min="0"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ingresos Mensuales *
                </label>
                <input
                  type="number"
                  name="ingresos_mensuales"
                  value={formData.ingresos_mensuales}
                  onChange={handleChange}
                  required
                  min="0"
                  step="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Otros Ingresos
                </label>
                <input
                  type="number"
                  name="otros_ingresos"
                  value={formData.otros_ingresos}
                  onChange={handleChange}
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
                  name="monto_solicitado"
                  value={formData.monto_solicitado}
                  onChange={handleChange}
                  required
                  min="0"
                  step="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Propósito *
                </label>
                <input
                  type="text"
                  name="proposito"
                  value={formData.proposito}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Compra de vehículo, Mejoras en el hogar, Capital de trabajo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plazo Deseado (meses) *
                </label>
                <select
                  name="plazo_deseado"
                  value={formData.plazo_deseado}
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
            </div>

          </div>

          {/* Referencias Personales */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Referencias Personales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referencia 1 - Nombre *
                </label>
                <input
                  type="text"
                  name="personal_ref1_nombre"
                  value={formData.personal_ref1_nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referencia 1 - Teléfono *
                </label>
                <input
                  type="tel"
                  name="personal_ref1_telefono"
                  value={formData.personal_ref1_telefono}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referencia 1 - Relación *
                </label>
                <input
                  type="text"
                  name="personal_ref1_relacion"
                  value={formData.personal_ref1_relacion}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Familiar, Amigo, Colega"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referencia 2 - Nombre
                </label>
                <input
                  type="text"
                  name="personal_ref2_nombre"
                  value={formData.personal_ref2_nombre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referencia 2 - Teléfono
                </label>
                <input
                  type="tel"
                  name="personal_ref2_telefono"
                  value={formData.personal_ref2_telefono}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información Adicional</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Observaciones adicionales sobre la solicitud..."
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
              {isEditing ? 'Actualizar Solicitud' : 'Enviar Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreditApplicationForm;
