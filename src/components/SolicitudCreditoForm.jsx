import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  X, 
  Save, 
  User, 
  Phone, 
  Mail, 
  Building,
  DollarSign,
  Calendar,
  Users,
  FileText,
  AlertCircle,
  Briefcase,
  MapPin
} from 'lucide-react';
import { getProspectos, crearAplicacion, getProducts } from '../services/creditosService';

const SolicitudCreditoForm = ({ aplicacion, onSave, onClose }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [prospectos, setProspectos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    // Campos de la base de datos
    cliente_id: '',
    monto_solicitado: '',
    plazo_deseado: '',
    proposito: '',
    ingresos_mensuales: '',
    otros_ingresos: '',
    empresa: '',
    cargo: '',
    telefono_empresa: '',
    anios_en_empresa: '',
    personal_ref1_nombre: '',
    personal_ref1_telefono: '',
    personal_ref1_relacion: '',
    personal_ref2_nombre: '',
    personal_ref2_telefono: '',
    observaciones: '',
    documento: '',
    comprobante_ingresos: '',
    estado: 'pendiente',
    tasa_interes: '',
    product_id: '',
    
    // Campos del formulario (no se guardan directamente)
    tipo_producto: '',
    tipo_ingresos: '',
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
    tipo_garantia: '',
    valor_garantia: ''
  });

  useEffect(() => {
    if (aplicacion) {
      setFormData({
        // Campos de la base de datos
        cliente_id: aplicacion.cliente_id || '',
        monto_solicitado: aplicacion.monto_solicitado || '',
        plazo_deseado: aplicacion.plazo_deseado || '',
        proposito: aplicacion.proposito || '',
        ingresos_mensuales: aplicacion.ingresos_mensuales || '',
        otros_ingresos: aplicacion.otros_ingresos || '',
        empresa: aplicacion.empresa || '',
        cargo: aplicacion.cargo || '',
        telefono_empresa: aplicacion.telefono_empresa || '',
        anios_en_empresa: aplicacion.anios_en_empresa || '',
        personal_ref1_nombre: aplicacion.personal_ref1_nombre || '',
        personal_ref1_telefono: aplicacion.personal_ref1_telefono || '',
        personal_ref1_relacion: aplicacion.personal_ref1_relacion || '',
        personal_ref2_nombre: aplicacion.personal_ref2_nombre || '',
        personal_ref2_telefono: aplicacion.personal_ref2_telefono || '',
        observaciones: aplicacion.observaciones || '',
        documento: aplicacion.documento || '',
        comprobante_ingresos: aplicacion.comprobante_ingresos || '',
        estado: aplicacion.estado || 'pendiente',
        tasa_interes: aplicacion.tasa_interes || '',
        product_id: aplicacion.product_id || '',
        
        // Campos del formulario (no se guardan directamente)
        tipo_producto: aplicacion.tipo_producto || '',
        tipo_ingresos: aplicacion.tipo_ingresos || '',
        actividad_economica: aplicacion.actividad_economica || '',
        antiguedad_negocio: aplicacion.antiguedad_negocio || '',
        descripcion_negocio: aplicacion.descripcion_negocio || '',
        ingresos_mensuales_negocio: aplicacion.ingresos_mensuales_negocio || '',
        ingresos_promedio_remesas: aplicacion.ingresos_promedio_remesas || '',
        otros_ingresos_especificar: aplicacion.otros_ingresos_especificar || '',
        otros_ingresos_promedio: aplicacion.otros_ingresos_promedio || '',
        activos_caja_bancos: aplicacion.activos_caja_bancos || '',
        activos_inventario: aplicacion.activos_inventario || '',
        activos_mobiliario: aplicacion.activos_mobiliario || '',
        activos_total: aplicacion.activos_total || '',
        pasivo_deudas_largo_plazo: aplicacion.pasivo_deudas_largo_plazo || '',
        pasivo_deudas_corto_plazo: aplicacion.pasivo_deudas_corto_plazo || '',
        patrimonio_capital: aplicacion.patrimonio_capital || '',
        patrimonio_utilidades: aplicacion.patrimonio_utilidades || '',
        ingresos_ventas: aplicacion.ingresos_ventas || '',
        ingresos_extraordinario: aplicacion.ingresos_extraordinario || '',
        gastos_compras: aplicacion.gastos_compras || '',
        gastos_alquiler: aplicacion.gastos_alquiler || '',
        gastos_alimentacion: aplicacion.gastos_alimentacion || '',
        gastos_otros: aplicacion.gastos_otros || '',
        plazo: aplicacion.plazo || '',
        tipo_garantia: aplicacion.tipo_garantia || '',
        valor_garantia: aplicacion.valor_garantia || ''
      });
    }
    loadProspectos();
    loadProductos();
  }, [aplicacion]);

  const loadProspectos = async () => {
    try {
      const data = await getProspectos();
      setProspectos(data || []);
    } catch (error) {
      console.error('Error cargando prospectos:', error);
    }
  };

  const loadProductos = async () => {
    try {
      const data = await getProducts();
      setProductos(data || []);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario lo complete
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  // Función para construir el estado financiero como JSON
  const buildEstadoFinanciero = () => {
    const estadoFinanciero = {};
    
    // Activos
    if (formData.activos_caja_bancos || formData.activos_inventario || formData.activos_mobiliario || formData.activos_total) {
      estadoFinanciero.activos = {};
      if (formData.activos_caja_bancos) estadoFinanciero.activos.cajaBancos = formData.activos_caja_bancos;
      if (formData.activos_inventario) estadoFinanciero.activos.inventario = formData.activos_inventario;
      if (formData.activos_mobiliario) estadoFinanciero.activos.mobiliario = formData.activos_mobiliario;
      if (formData.activos_total) estadoFinanciero.activos.total = formData.activos_total;
    }
    
    // Pasivo
    if (formData.pasivo_deudas_largo_plazo || formData.pasivo_deudas_corto_plazo) {
      estadoFinanciero.pasivo = {};
      if (formData.pasivo_deudas_largo_plazo) estadoFinanciero.pasivo.deudasLargoPlazo = formData.pasivo_deudas_largo_plazo;
      if (formData.pasivo_deudas_corto_plazo) estadoFinanciero.pasivo.deudasCortoPlazo = formData.pasivo_deudas_corto_plazo;
    }
    
    // Patrimonio
    if (formData.patrimonio_capital || formData.patrimonio_utilidades) {
      estadoFinanciero.patrimonio = {};
      if (formData.patrimonio_capital) estadoFinanciero.patrimonio.capital = formData.patrimonio_capital;
      if (formData.patrimonio_utilidades) estadoFinanciero.patrimonio.utilidades = formData.patrimonio_utilidades;
    }
    
    // Ingresos
    if (formData.ingresos_ventas || formData.ingresos_extraordinario) {
      estadoFinanciero.ingresos = {};
      if (formData.ingresos_ventas) estadoFinanciero.ingresos.porVentas = formData.ingresos_ventas;
      if (formData.ingresos_extraordinario) estadoFinanciero.ingresos.extraordinario = formData.ingresos_extraordinario;
    }
    
    // Gastos
    if (formData.gastos_compras || formData.gastos_alquiler || formData.gastos_alimentacion || formData.gastos_otros) {
      estadoFinanciero.gastos = {};
      if (formData.gastos_compras) estadoFinanciero.gastos.compras = formData.gastos_compras;
      if (formData.gastos_alquiler) estadoFinanciero.gastos.alquiler = formData.gastos_alquiler;
      if (formData.gastos_alimentacion) estadoFinanciero.gastos.alimentacion = formData.gastos_alimentacion;
      if (formData.gastos_otros) estadoFinanciero.gastos.otros = formData.gastos_otros;
    }
    
    return Object.keys(estadoFinanciero).length > 0 ? estadoFinanciero : null;
  };

  // Función para construir los datos de envío
  const buildSubmissionData = () => {
    const submissionData = {};
    
    // Campos de la base de datos - solo incluir si tienen valor
    const dbFields = [
      'cliente_id', 'monto_solicitado', 'plazo_deseado', 'proposito', 
      'ingresos_mensuales', 'otros_ingresos', 'empresa', 'cargo', 
      'telefono_empresa', 'anios_en_empresa', 'personal_ref1_nombre', 
      'personal_ref1_telefono', 'personal_ref1_relacion', 'personal_ref2_nombre', 
      'personal_ref2_telefono', 'observaciones', 'documento', 'comprobante_ingresos', 
      'estado', 'tasa_interes', 'product_id'
    ];
    
    dbFields.forEach(field => {
      if (formData[field] && formData[field] !== '') {
        submissionData[field] = formData[field];
      }
    });
    
    // Construir estado financiero
    const estadoFinanciero = buildEstadoFinanciero();
    if (estadoFinanciero) {
      submissionData.estado_financiero = estadoFinanciero;
    }
    
    return submissionData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mostrar errores si el formulario no es válido
    if (!validateForm()) {
      showFieldErrors();
      return;
    }
    
    setLoading(true);
    
    try {
      // Construir los datos de envío con solo los campos de la base de datos
      const submissionData = buildSubmissionData();
      
      await crearAplicacion(submissionData);
      await onSave(submissionData);
      
      // Limpiar el formulario después de crear exitosamente
      setFormData({
        // Campos de la base de datos
        cliente_id: '',
        monto_solicitado: '',
        plazo_deseado: '',
        proposito: '',
        ingresos_mensuales: '',
        otros_ingresos: '',
        empresa: '',
        cargo: '',
        telefono_empresa: '',
        anios_en_empresa: '',
        personal_ref1_nombre: '',
        personal_ref1_telefono: '',
        personal_ref1_relacion: '',
        personal_ref2_nombre: '',
        personal_ref2_telefono: '',
        observaciones: '',
        documento: '',
        comprobante_ingresos: '',
        estado: 'pendiente',
        tasa_interes: '',
        product_id: '',
        
        // Campos del formulario (no se guardan directamente)
        tipo_producto: '',
        tipo_ingresos: '',
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
        tipo_garantia: '',
        valor_garantia: ''
      });
      
      // Limpiar errores de validación
      setFieldErrors({});
      
    } catch (error) {
      console.error('Error guardando solicitud:', error);
      // Mostrar notificación de error más elegante
      alert('Error guardando solicitud. Por favor, verifica los datos e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const required = ['cliente_id', 'monto_solicitado', 'plazo_deseado', 'personal_ref1_nombre', 'personal_ref1_telefono', 'personal_ref1_relacion'];
    
    const missingFields = required.filter(field => !formData[field] || formData[field].toString().trim() === '');
    
    return missingFields.length === 0;
  };

  const showFieldErrors = () => {
    const required = ['cliente_id', 'monto_solicitado', 'plazo_deseado', 'personal_ref1_nombre', 'personal_ref1_telefono', 'personal_ref1_relacion'];
    
    const missingFields = required.filter(field => !formData[field] || formData[field].toString().trim() === '');
    
    // Marcar campos faltantes en rojo
    const newErrors = {};
    missingFields.forEach(field => {
      newErrors[field] = true;
    });
    setFieldErrors(newErrors);
    
    if (missingFields.length > 0) {
      console.log('Campos faltantes:', missingFields);
      console.log('Valores actuales:', formData);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selección de Prospecto */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Selección de Prospecto
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prospecto *
              </label>
              <select
                name="cliente_id"
                value={formData.cliente_id}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  fieldErrors.cliente_id 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300'
                }`}
                required
              >
                <option value="">Seleccionar prospecto...</option>
                {prospectos.map(prospecto => (
                  <option key={prospecto.id} value={prospecto.id}>
                    {prospecto.nombre} {prospecto.apellido} - {prospecto.dni}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Selecione un cliente existente para crear la solicitud de crédito
              </p>
            </div>
          </div>

          {/* Fuente de Ingresos */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Fuente de Ingresos
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Ingresos *
                </label>
                <select
                  name="tipo_ingresos"
                  value={formData.tipo_ingresos}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    fieldErrors.tipo_ingresos 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  required
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
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Información Laboral</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Empresa *
                      </label>
                      <input
                        type="text"
                        name="empresa"
                        value={formData.empresa}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cargo *
                </label>
                <input
                  type="text"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono Empresa
                </label>
                <input
                  type="tel"
                  name="telefono_empresa"
                  value={formData.telefono_empresa}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Años en la Empresa
                </label>
                <input
                  type="number"
                  name="anios_en_empresa"
                  value={formData.anios_en_empresa}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingresos Mensuales *
                </label>
                <input
                  type="number"
                  name="ingresos_mensuales"
                  value={formData.ingresos_mensuales}
                  onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Negocio Propio - Solo si selecciona Negocio Propio */}
              {formData.tipo_ingresos === 'negocio_propio' && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Información del Negocio</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Actividad Económica *
                      </label>
                      <select
                        name="actividad_economica"
                        value={formData.actividad_economica}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Antigüedad del Negocio (años) *
                      </label>
                      <input
                        type="number"
                        name="antiguedad_negocio"
                        value={formData.antiguedad_negocio}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                        min="0"
                        max="50"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción del Negocio *
                      </label>
                      <textarea
                        name="descripcion_negocio"
                        value={formData.descripcion_negocio}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                        rows="3"
                        placeholder="Describe tu negocio..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ingresos Mensuales *
                      </label>
                      <input
                        type="number"
                        name="ingresos_mensuales_negocio"
                        value={formData.ingresos_mensuales_negocio}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Remesas - Solo si selecciona Remesas */}
              {formData.tipo_ingresos === 'remesas' && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Información de Remesas</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ingresos Promedio Mensual *
                      </label>
                      <input
                        type="number"
                        name="ingresos_promedio_remesas"
                        value={formData.ingresos_promedio_remesas}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
                  </div>
                </div>
              )}

              {/* Otros - Solo si selecciona Otros */}
              {formData.tipo_ingresos === 'otros' && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Otros Ingresos</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Especificar Fuente de Ingresos *
                      </label>
                      <input
                        type="text"
                        name="otros_ingresos_especificar"
                        value={formData.otros_ingresos_especificar}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                        placeholder="Especifica la fuente de tus ingresos..."
                      />
                    </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ingreso Promedio Mensual *
                </label>
                <input
                  type="number"
                        name="otros_ingresos_promedio"
                        value={formData.otros_ingresos_promedio}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                  min="0"
                  step="0.01"
                />
              </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información del Crédito */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Información del Crédito
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto Solicitado *
                </label>
                <input
                  type="number"
                  name="monto_solicitado"
                  value={formData.monto_solicitado}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    fieldErrors.monto_solicitado 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Propósito del Crédito
                </label>
                <select
                  name="proposito"
                  value={formData.proposito}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Seleccionar propósito</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plazo Deseado (meses) *
                </label>
                <select
                  name="plazo_deseado"
                  value={formData.plazo_deseado}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    fieldErrors.plazo_deseado 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Seleccionar plazo</option>
                  <option value="6">6 meses</option>
                  <option value="12">12 meses</option>
                  <option value="18">18 meses</option>
                  <option value="24">24 meses</option>
                  <option value="30">30 meses</option>
                  <option value="36">36 meses</option>
                </select>
              </div>
            </div>
          </div>

          {/* Referencias Personales */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Referencias Personales
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referencia 1 - Nombre *
                  </label>
                  <input
                    type="text"
                    name="personal_ref1_nombre"
                    value={formData.personal_ref1_nombre}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      fieldErrors.personal_ref1_nombre 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referencia 1 - Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="personal_ref1_telefono"
                    value={formData.personal_ref1_telefono}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      fieldErrors.personal_ref1_telefono 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referencia 1 - Relación *
                  </label>
                  <select
                    name="personal_ref1_relacion"
                    value={formData.personal_ref1_relacion}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      fieldErrors.personal_ref1_relacion 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Seleccionar relación</option>
                    <option value="familiar">Familiar</option>
                    <option value="amigo">Amigo</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referencia 2 - Nombre
                  </label>
                  <input
                    type="text"
                    name="personal_ref2_nombre"
                    value={formData.personal_ref2_nombre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referencia 2 - Teléfono
                  </label>
                  <input
                    type="tel"
                    name="personal_ref2_telefono"
                    value={formData.personal_ref2_telefono}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Estado Financiero */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Estado Financiero
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {/* Activos */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Activos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Caja y Bancos
                    </label>
                    <input
                      type="number"
                      name="activos_caja_bancos"
                      value={formData.activos_caja_bancos}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inventario
                    </label>
                    <input
                      type="number"
                      name="activos_inventario"
                      value={formData.activos_inventario}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobiliario
                    </label>
                    <input
                      type="number"
                      name="activos_mobiliario"
                      value={formData.activos_mobiliario}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total
                    </label>
                    <input
                      type="number"
                      name="activos_total"
                      value={formData.activos_total}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Pasivo */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Pasivo</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deudas Largo Plazo
                    </label>
                    <input
                      type="number"
                      name="pasivo_deudas_largo_plazo"
                      value={formData.pasivo_deudas_largo_plazo}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deudas Corto Plazo
                    </label>
                    <input
                      type="number"
                      name="pasivo_deudas_corto_plazo"
                      value={formData.pasivo_deudas_corto_plazo}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Patrimonio */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Patrimonio</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capital
                    </label>
                    <input
                      type="number"
                      name="patrimonio_capital"
                      value={formData.patrimonio_capital}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Utilidades
                    </label>
                    <input
                      type="number"
                      name="patrimonio_utilidades"
                      value={formData.patrimonio_utilidades}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Ingresos */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Ingresos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Por Ventas
                    </label>
                    <input
                      type="number"
                      name="ingresos_ventas"
                      value={formData.ingresos_ventas}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Extraordinario
                    </label>
                    <input
                      type="number"
                      name="ingresos_extraordinario"
                      value={formData.ingresos_extraordinario}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Gastos */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Gastos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Compras
                    </label>
                    <input
                      type="number"
                      name="gastos_compras"
                      value={formData.gastos_compras}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alquiler
                    </label>
                    <input
                      type="number"
                      name="gastos_alquiler"
                      value={formData.gastos_alquiler}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alimentación
                    </label>
                    <input
                      type="number"
                      name="gastos_alimentacion"
                      value={formData.gastos_alimentacion}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Otros
                    </label>
                    <input
                      type="number"
                      name="gastos_otros"
                      value={formData.gastos_otros}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Condiciones del Crédito */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Condiciones del Crédito
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tasa de Interés (%) *
                </label>
                <input
                  type="number"
                  name="tasa_interes"
                  value={formData.tasa_interes}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Garantía *
                </label>
                <select
                  name="tipo_garantia"
                  value={formData.tipo_garantia}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor de la Garantía *
                  </label>
                  <input
                    type="number"
                    name="valor_garantia"
                    value={formData.valor_garantia}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Observaciones */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Observaciones
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones Adicionales
                </label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Observaciones adicionales sobre la solicitud..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Documento
                  </label>
                  <input
                    type="text"
                    name="documento"
                    value={formData.documento}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="URL del documento"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comprobante de Ingresos
                  </label>
                  <input
                    type="text"
                    name="comprobante_ingresos"
                    value={formData.comprobante_ingresos}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="URL del comprobante"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2"
              disabled={loading || !validateForm()}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Crear Solicitud</span>
                </>
              )}
            </button>
          </div>
        </form>
    </div>
  );
};

export default SolicitudCreditoForm;
