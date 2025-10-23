import React, { useState, useEffect } from 'react';
import { FileText, X, Save, Loader2 } from 'lucide-react';
import { getClientes, insertAplicacion } from '../services/api';

const CreditApplicationForm = ({ isOpen, onClose, onSubmit, prospect = null, editData = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    cliente_id: prospect ? prospect.id : '',
    monto_solicitado: prospect ? prospect.montoSolicitado : '',
    plazo_deseado: '',
    tipo_producto: '',
    
    // Fuente de Ingresos
    tipo_ingresos: '',
    
    // Empleo
    empresa: '',
    cargo: '',
    telefono_empresa: '',
    anios_en_empresa: '',
    ingresos_mensuales: '',
    
    // Negocio Propio
    actividad_economica: '',
    antiguedad_negocio: '',
    descripcion_negocio: '',
    ingresos_mensuales_negocio: '',
    
    // Remesas
    ingresos_promedio_remesas: '',
    
    // Otros
    otros_ingresos_especificar: '',
    otros_ingresos_promedio: '',
    
    // Estado Financiero
    activos_caja_bancos: '',
    activos_inventario: '',
    activos_mobiliario: '',
    activos_total: '',
    pasivo_deudas_largo_plazo: '',
    pasivo_deudas_corto_plazo: '',
    patrimonio_capital: '',
    patrimonio_utilidades: '',
    ingresos_ventas: '',
    ingresos_extraordinario: '',
    gastos_compras: '',
    gastos_alquiler: '',
    gastos_alimentacion: '',
    gastos_otros: '',
    
    // Condiciones del Crédito
    plazo: '',
    tasa_interes: '',
    tipo_garantia: '',
    valor_garantia: '',
    
    // Referencias
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
        tipo_producto: editData.tipo_producto || '',
        tipo_ingresos: editData.tipo_ingresos || '',
        empresa: editData.empresa || '',
        cargo: editData.cargo || '',
        telefono_empresa: editData.telefono_empresa || '',
        anios_en_empresa: editData.anios_en_empresa || '',
        ingresos_mensuales: editData.ingresos_mensuales || '',
        actividad_economica: editData.actividad_economica || '',
        antiguedad_negocio: editData.antiguedad_negocio || '',
        descripcion_negocio: editData.descripcion_negocio || '',
        ingresos_mensuales_negocio: editData.ingresos_mensuales_negocio || '',
        ingresos_promedio_remesas: editData.ingresos_promedio_remesas || '',
        otros_ingresos_especificar: editData.otros_ingresos_especificar || '',
        otros_ingresos_promedio: editData.otros_ingresos_promedio || '',
        activos_caja_bancos: editData.activos_caja_bancos || '',
        activos_inventario: editData.activos_inventario || '',
        activos_mobiliario: editData.activos_mobiliario || '',
        activos_total: editData.activos_total || '',
        pasivo_deudas_largo_plazo: editData.pasivo_deudas_largo_plazo || '',
        pasivo_deudas_corto_plazo: editData.pasivo_deudas_corto_plazo || '',
        patrimonio_capital: editData.patrimonio_capital || '',
        patrimonio_utilidades: editData.patrimonio_utilidades || '',
        ingresos_ventas: editData.ingresos_ventas || '',
        ingresos_extraordinario: editData.ingresos_extraordinario || '',
        gastos_compras: editData.gastos_compras || '',
        gastos_alquiler: editData.gastos_alquiler || '',
        gastos_alimentacion: editData.gastos_alimentacion || '',
        gastos_otros: editData.gastos_otros || '',
        plazo: editData.plazo || '',
        tasa_interes: editData.tasa_interes || '',
        tipo_garantia: editData.tipo_garantia || '',
        valor_garantia: editData.valor_garantia || '',
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
        tipo_producto: '',
        tipo_ingresos: '',
        empresa: '',
        cargo: '',
        telefono_empresa: '',
        anios_en_empresa: '',
        ingresos_mensuales: '',
        actividad_economica: '',
        antiguedad_negocio: '',
        descripcion_negocio: '',
        ingresos_mensuales_negocio: '',
        ingresos_promedio_remesas: '',
        otros_ingresos_especificar: '',
        otros_ingresos_promedio: '',
        activos_caja_bancos: '',
        activos_inventario: '',
        activos_mobiliario: '',
        activos_total: '',
        pasivo_deudas_largo_plazo: '',
        pasivo_deudas_corto_plazo: '',
        patrimonio_capital: '',
        patrimonio_utilidades: '',
        ingresos_ventas: '',
        ingresos_extraordinario: '',
        gastos_compras: '',
        gastos_alquiler: '',
        gastos_alimentacion: '',
        gastos_otros: '',
        plazo: '',
        tasa_interes: '',
        tipo_garantia: '',
        valor_garantia: '',
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
            tipo_producto: '',
            tipo_ingresos: '',
            empresa: '',
            cargo: '',
            telefono_empresa: '',
            anios_en_empresa: '',
            ingresos_mensuales: '',
            actividad_economica: '',
            antiguedad_negocio: '',
            descripcion_negocio: '',
            ingresos_mensuales_negocio: '',
            ingresos_promedio_remesas: '',
            otros_ingresos_especificar: '',
            otros_ingresos_promedio: '',
            activos_caja_bancos: '',
            activos_inventario: '',
            activos_mobiliario: '',
            activos_total: '',
            pasivo_deudas_largo_plazo: '',
            pasivo_deudas_corto_plazo: '',
            patrimonio_capital: '',
            patrimonio_utilidades: '',
            ingresos_ventas: '',
            ingresos_extraordinario: '',
            gastos_compras: '',
            gastos_alquiler: '',
            gastos_alimentacion: '',
            gastos_otros: '',
            plazo: '',
            tasa_interes: '',
            tipo_garantia: '',
            valor_garantia: '',
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
                        {cliente.nombre} {cliente.apellido} - Identificación: {cliente.dni}
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
                      <span className="font-medium text-gray-600">Identificación:</span>
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
          {/* Fuente de Ingresos */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fuente de Ingresos</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Ingresos *
                </label>
                <select
                  name="tipo_ingresos"
                  value={formData.tipo_ingresos}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Seleccionar tipo de ingresos</option>
                  <option value="empleo">Empleo</option>
                  <option value="negocio_propio">Negocio Propio</option>
                  <option value="remesas">Remesas</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              {/* Información Laboral - Solo si selecciona Empleo */}
              {formData.tipo_ingresos === 'empleo' && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Información Laboral</h4>
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
                  </div>
                </div>
              )}

              {/* Negocio Propio - Solo si selecciona Negocio Propio */}
              {formData.tipo_ingresos === 'negocio_propio' && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Información del Negocio</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Actividad Económica *
                      </label>
                      <select
                        name="actividad_economica"
                        value={formData.actividad_economica}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Seleccionar actividad</option>
                        <option value="agricultura">Agricultura</option>
                        <option value="ganaderia">Ganadería</option>
                        <option value="forestal">Forestal</option>
                        <option value="comercio">Comercio</option>
                        <option value="construccion">Construcción</option>
                        <option value="servicios">Servicios (Salud, educación, transporte)</option>
                        <option value="industria">Industria</option>
                        <option value="micro_pequena_empresa">Micro y pequeña empresa</option>
                        <option value="manufactura">Manufactura</option>
                        <option value="artesania">Artesanía</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Antigüedad del Negocio (años) *
                      </label>
                      <input
                        type="number"
                        name="antiguedad_negocio"
                        value={formData.antiguedad_negocio}
                        onChange={handleChange}
                        required
                        min="0"
                        max="50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción del Negocio *
                      </label>
                      <textarea
                        name="descripcion_negocio"
                        value={formData.descripcion_negocio}
                        onChange={handleChange}
                        required
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Describe tu negocio..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ingresos Mensuales *
                      </label>
                      <input
                        type="number"
                        name="ingresos_mensuales_negocio"
                        value={formData.ingresos_mensuales_negocio}
                        onChange={handleChange}
                        required
                        min="0"
                        step="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Remesas - Solo si selecciona Remesas */}
              {formData.tipo_ingresos === 'remesas' && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Información de Remesas</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ingresos Promedio Mensual *
                      </label>
                      <input
                        type="number"
                        name="ingresos_promedio_remesas"
                        value={formData.ingresos_promedio_remesas}
                        onChange={handleChange}
                        required
                        min="0"
                        step="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Otros - Solo si selecciona Otros */}
              {formData.tipo_ingresos === 'otros' && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Otros Ingresos</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Especificar Fuente de Ingresos *
                      </label>
                      <input
                        type="text"
                        name="otros_ingresos_especificar"
                        value={formData.otros_ingresos_especificar}
                        onChange={handleChange}
                        required
                        placeholder="Especifica la fuente de tus ingresos..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ingreso Promedio Mensual *
                      </label>
                      <input
                        type="number"
                        name="otros_ingresos_promedio"
                        value={formData.otros_ingresos_promedio}
                        onChange={handleChange}
                        required
                        min="0"
                        step="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
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
                  Tipo de Producto *
                </label>
                <select
                  name="tipo_producto"
                  value={formData.tipo_producto}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Seleccionar tipo de producto</option>
                  <option value="compra_vehiculo">Compra de Vehículo</option>
                  <option value="mejoras_hogar">Mejoras en el Hogar</option>
                  <option value="capital_trabajo">Capital de Trabajo</option>
                  <option value="consolidacion_deudas">Consolidación de Deudas</option>
                  <option value="educacion">Educación</option>
                  <option value="salud">Salud</option>
                  <option value="negocio">Negocio</option>
                  <option value="inversion">Inversión</option>
                  <option value="emergencia">Emergencia</option>
                  <option value="otros">Otros</option>
                </select>
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
                <select
                  name="personal_ref1_relacion"
                  value={formData.personal_ref1_relacion}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Seleccionar relación</option>
                  <option value="familiar">Familiar</option>
                  <option value="amigo">Amigo</option>
                  <option value="otro">Otro</option>
                </select>
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

          {/* Estado Financiero */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Estado Financiero</h3>
            <div className="grid grid-cols-1 gap-6">
              {/* Activos */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Activos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Caja y Bancos
                    </label>
                    <input
                      type="number"
                      name="activos_caja_bancos"
                      value={formData.activos_caja_bancos}
                      onChange={handleChange}
                      min="0"
                      step="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Inventario
                    </label>
                    <input
                      type="number"
                      name="activos_inventario"
                      value={formData.activos_inventario}
                      onChange={handleChange}
                      min="0"
                      step="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobiliario
                    </label>
                    <input
                      type="number"
                      name="activos_mobiliario"
                      value={formData.activos_mobiliario}
                      onChange={handleChange}
                      min="0"
                      step="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total
                    </label>
                    <input
                      type="number"
                      name="activos_total"
                      value={formData.activos_total}
                      onChange={handleChange}
                      min="0"
                      step="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Pasivo */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Pasivo</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deudas Largo Plazo
                    </label>
                    <input
                      type="number"
                      name="pasivo_deudas_largo_plazo"
                      value={formData.pasivo_deudas_largo_plazo}
                      onChange={handleChange}
                      min="0"
                      step="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deudas Corto Plazo
                    </label>
                    <input
                      type="number"
                      name="pasivo_deudas_corto_plazo"
                      value={formData.pasivo_deudas_corto_plazo}
                      onChange={handleChange}
                      min="0"
                      step="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Patrimonio */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Patrimonio</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capital
                    </label>
                    <input
                      type="number"
                      name="patrimonio_capital"
                      value={formData.patrimonio_capital}
                      onChange={handleChange}
                      min="0"
                      step="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Utilidades
                    </label>
                    <input
                      type="number"
                      name="patrimonio_utilidades"
                      value={formData.patrimonio_utilidades}
                      onChange={handleChange}
                      min="0"
                      step="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Ingresos */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Ingresos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Por Ventas
                    </label>
                    <input
                      type="number"
                      name="ingresos_ventas"
                      value={formData.ingresos_ventas}
                      onChange={handleChange}
                      min="0"
                      step="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Extraordinario
                    </label>
                    <input
                      type="number"
                      name="ingresos_extraordinario"
                      value={formData.ingresos_extraordinario}
                      onChange={handleChange}
                      min="0"
                      step="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Gastos */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Gastos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Compras
                    </label>
                    <input
                      type="number"
                      name="gastos_compras"
                      value={formData.gastos_compras}
                      onChange={handleChange}
                      min="0"
                      step="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alquiler
                    </label>
                    <input
                      type="number"
                      name="gastos_alquiler"
                      value={formData.gastos_alquiler}
                      onChange={handleChange}
                      min="0"
                      step="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alimentación
                    </label>
                    <input
                      type="number"
                      name="gastos_alimentacion"
                      value={formData.gastos_alimentacion}
                      onChange={handleChange}
                      min="0"
                      step="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Otros
                    </label>
                    <input
                      type="number"
                      name="gastos_otros"
                      value={formData.gastos_otros}
                      onChange={handleChange}
                      min="0"
                      step="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Condiciones del Crédito */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Condiciones del Crédito</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plazo (meses) *
                </label>
                <input
                  type="number"
                  name="plazo"
                  value={formData.plazo}
                  onChange={handleChange}
                  required
                  min="1"
                  max="60"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tasa de Interés (%) *
                </label>
                <input
                  type="number"
                  name="tasa_interes"
                  value={formData.tasa_interes}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Garantía *
                </label>
                <select
                  name="tipo_garantia"
                  value={formData.tipo_garantia}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Seleccionar tipo de garantía</option>
                  <option value="fiduciaria">Fiduciaria</option>
                  <option value="solidaria">Solidaria</option>
                  <option value="prendaria">Prendaria</option>
                  <option value="mobiliaria">Mobiliaria</option>
                </select>
              </div>
              {(formData.tipo_garantia === 'prendaria' || formData.tipo_garantia === 'mobiliaria') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor de la Garantía *
                  </label>
                  <input
                    type="number"
                    name="valor_garantia"
                    value={formData.valor_garantia}
                    onChange={handleChange}
                    required
                    min="0"
                    step="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Observaciones</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones Adicionales
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
