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
    cliente_id: '',
    monto_solicitado: '',
    plazo_deseado: '',
    product_id: '',
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
    proposito: '',
    observaciones: '',
    documento: '',
    comprobante_ingresos: '',
    estado: 'pendiente'
  });

  useEffect(() => {
    if (aplicacion) {
      setFormData({
        cliente_id: aplicacion.cliente_id || '',
        monto_solicitado: aplicacion.monto_solicitado || '',
        plazo_deseado: aplicacion.plazo_deseado || '',
        product_id: aplicacion.product_id || '',
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
        proposito: aplicacion.proposito || '',
        observaciones: aplicacion.observaciones || '',
        documento: aplicacion.documento || '',
        comprobante_ingresos: aplicacion.comprobante_ingresos || '',
        estado: aplicacion.estado || 'pendiente'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mostrar errores si el formulario no es válido
    if (!validateForm()) {
      showFieldErrors();
      return;
    }
    
    setLoading(true);
    
    try {
      await crearAplicacion(formData);
      await onSave(formData);
      
      // Limpiar el formulario después de crear exitosamente
      setFormData({
        cliente_id: '',
        monto_solicitado: '',
        plazo_deseado: '',
        product_id: '',
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
        proposito: '',
        observaciones: '',
        documento: '',
        comprobante_ingresos: '',
        estado: 'pendiente'
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
    const required = ['cliente_id', 'monto_solicitado', 'plazo_deseado', 'product_id', 'ingresos_mensuales', 'empresa', 'cargo', 'personal_ref1_nombre', 'personal_ref1_telefono', 'personal_ref1_relacion'];
    
    const missingFields = required.filter(field => !formData[field] || formData[field].toString().trim() === '');
    
    return missingFields.length === 0;
  };

  const showFieldErrors = () => {
    const required = ['cliente_id', 'monto_solicitado', 'plazo_deseado', 'product_id', 'ingresos_mensuales', 'empresa', 'cargo', 'personal_ref1_nombre', 'personal_ref1_telefono', 'personal_ref1_relacion'];
    
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

          {/* Información Laboral */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Información Laboral
            </h3>
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    fieldErrors.empresa 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300'
                  }`}
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    fieldErrors.cargo 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300'
                  }`}
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    fieldErrors.ingresos_mensuales 
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
                  Otros Ingresos
                </label>
                <input
                  type="number"
                  name="otros_ingresos"
                  value={formData.otros_ingresos}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                  step="0.01"
                />
              </div>
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
                  Producto *
                </label>
                <select
                  name="product_id"
                  value={formData.product_id}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    fieldErrors.product_id 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Seleccionar producto...</option>
                  {productos.map(producto => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre}
                    </option>
                  ))}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Propósito del Crédito
                </label>
                <input
                  type="text"
                  name="proposito"
                  value={formData.proposito}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Ej: Capital de trabajo, compra de equipo, etc."
                />
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
                  <input
                    type="text"
                    name="personal_ref1_relacion"
                    value={formData.personal_ref1_relacion}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      fieldErrors.personal_ref1_relacion 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Ej: Familiar, Amigo, Colega"
                    required
                  />
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

          {/* Información Adicional */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Información Adicional
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones
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
