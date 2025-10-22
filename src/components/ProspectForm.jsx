import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  X, 
  Save, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Building,
  DollarSign,
  Users,
  FileText,
  AlertCircle,
  Navigation,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { getProspectos, crearProspecto, actualizarProspecto } from '../services/creditosService';
import { supabase } from '../lib/supabase';

const ProspectForm = ({ prospect, onSave, onClose }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [promotores, setPromotores] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    // Información Personal
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    email: '',
    telefono_adicional: '',
    direccion: '',
    comentarios: '',
    fecha_nacimiento: '',
    departamento: '',
    latitud: '',
    longitud: '',
    
    // Información del Prospecto
    agencia: '',
    facilitador: '',
    campaña: '',
    sector_economico: '',
    experiencia_banca_comunal: '',
    tipo_garantia: '',
    antiguedad_negocio: '',
    tamaño_negocio: '',
    programa_recomendado: '',
    donde_se_entero: '',
    monto_solicitado: '',
    
    // Datos Adicionales
    grupo_etario: '',
    etnia: '',
    zona: '',
    
    // Campos adicionales
    estado: 'activo',
    promotor_id: '',
    agencia_id: '',
    dni_image: '',
    photos: ''
  });

  // Opciones para dropdowns
  const departamentos = [
    'Alta Verapaz', 'Baja Verapaz', 'Chimaltenango', 'Chiquimula', 'El Progreso', 
    'Escuintla', 'Guatemala', 'Huehuetenango', 'Izabal', 'Jalapa', 'Jutiapa', 
    'Petén', 'Quetzaltenango', 'Quiché', 'Retalhuleu', 'Sacatepéquez', 'San Marcos', 
    'Santa Rosa', 'Sololá', 'Suchitepéquez', 'Totonicapán', 'Zacapa'
  ];

  const agencias = [
    'San Marcos', 'Huehuetenango', 'Nebaj', 'Santo Tomás', 'La Democracia', 
    'Cobán', 'Chicacao', 'Ixcán', 'Sololá', 'Mazatenango', 'Quiché', 
    'Chimaltenango', 'Quetzaltenango'
  ];

  const facilitadores = [
    'San Pedro Sacatepéquez', 'San Antonio Sacatepéquez',
    'San Rafael Tumbador Rodeo',
    'San Miguel Ixtahuacán', 'Concepción Tutuapa',
    'Malacatán', 'San Pablo', 'Catarina',
    'Comitancillo', 'San Lorenzo Tejutla', 'Sipacapa', 'Tacaná', 'Cuilco', 'Sibinal',
    'Tajumulco', 'Ixchiguán', 'San Sebastián',
    'San Lorenzo', 'Comitancillo Bajo', 'Río Blanco',
    'Coatepeque Centro y Alto', 'Pajapita', 'Tecún', 'La Blanca',
    'Crédito Individual San Marcos 1'
  ];

  const campañas = [
    'Recuperación', 'Eventos', 'Brigadas de Promoción', 
    'Visita individual en campo', 'Personal en Oficina'
  ];

  const sectoresEconomicos = [
    'Comercio', 'Servicio', 'Producción', 'Sector Agrícola', 'Otro'
  ];

  const tiposGarantia = [
    'Fiduciaria', 'Prendaria', 'Derechos Posesorios', 'Hipotecaria', 'Solidaria'
  ];

  const antiguedadNegocio = [
    'Menor a 6 meses', '6 meses a 1 año', '1 a 2 años', 
    'Mayor o igual a 3 años', 'Inspección visual'
  ];

  const tamañoNegocio = [
    'Pequeño', 'Mediano', 'Grande'
  ];

  const programasRecomendados = [
    'Banca Comunal', 'Crédito Individual'
  ];

  const dondeSeEntero = [
    'Facebook', 'Talleres Propios o con aliados', 'Asesores de SmartCredit', 
    'TV', 'Promoción en campo', 'Volantes / Afiches / Mantas', 'Facilitador', 
    'Amiga – Conocida', 'Clienta de SmartCredit', 'Anuncio de Google', 
    'Radio', 'Otro'
  ];

  const gruposEtarios = [
    '15–19 años', '20–24 años', '25–29 años', '30 años o más'
  ];

  const etnias = [
    'Indígena', 'No indígena'
  ];

  const zonas = [
    'Urbana', 'Rural'
  ];

  useEffect(() => {
    if (prospect) {
      setFormData({
        nombre: prospect.nombre || '',
        apellido: prospect.apellido || '',
        dni: prospect.dni || '',
        telefono: prospect.telefono || '',
        email: prospect.email || '',
        telefono_adicional: prospect.telefono_adicional || '',
        direccion: prospect.direccion || '',
        comentarios: prospect.comentarios || '',
        fecha_nacimiento: prospect.fecha_nacimiento || '',
        departamento: prospect.departamento || '',
        latitud: prospect.latitud || '',
        longitud: prospect.longitud || '',
        agencia: prospect.agencia || '',
        facilitador: prospect.facilitador || '',
        campaña: prospect.campaña || '',
        sector_economico: prospect.sector_economico || '',
        experiencia_banca_comunal: prospect.experiencia_banca_comunal || '',
        tipo_garantia: prospect.tipo_garantia || '',
        antiguedad_negocio: prospect.antiguedad_negocio || '',
        tamaño_negocio: prospect.tamaño_negocio || '',
        programa_recomendado: prospect.programa_recomendado || '',
        donde_se_entero: prospect.donde_se_entero || '',
        monto_solicitado: prospect.monto_solicitado || '',
        grupo_etario: prospect.grupo_etario || '',
        etnia: prospect.etnia || '',
        zona: prospect.zona || '',
        estado: prospect.estado || 'activo',
        promotor_id: prospect.promotor_id || '',
        agencia_id: prospect.agencia_id || '',
        dni_image: prospect.dni_image || '',
        photos: prospect.photos || ''
      });
    }
    loadPromotores();
  }, [prospect]);

  const loadPromotores = async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, apellido, agencia_id')
        .eq('compania', 2)
        .eq('rol', 'Promotor');
      
      if (error) throw error;
      setPromotores(data || []);
    } catch (error) {
      console.error('Error cargando promotores:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Si se selecciona un promotor, obtener su agencia_id
    if (name === 'promotor_id' && value) {
      const promotorSeleccionado = promotores.find(p => p.id === value);
      if (promotorSeleccionado) {
        console.log('Promotor seleccionado:', promotorSeleccionado);
        console.log('Agencia ID asignada:', promotorSeleccionado.agencia_id);
        setFormData(prev => ({
          ...prev,
          [name]: value,
          agencia_id: promotorSeleccionado.agencia_id
        }));
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo cuando el usuario lo complete
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitud: position.coords.latitude.toString(),
            longitud: position.coords.longitude.toString()
          }));
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          alert('No se pudo obtener la ubicación GPS');
        }
      );
    } else {
      alert('Geolocalización no soportada por este navegador');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Preparar datos para envío, convirtiendo strings a boolean donde sea necesario
      const dataToSend = {
        ...formData,
        experiencia_banca_comunal: formData.experiencia_banca_comunal === 'Sí',
        compania: 2, // Agregar compañía por defecto
        fecha_creacion: new Date().toISOString()
      };
      
      if (prospect) {
        await actualizarProspecto(prospect.id, dataToSend);
      } else {
        await crearProspecto(dataToSend);
      }
      await onSave(dataToSend);
    } catch (error) {
      console.error('Error guardando prospecto:', error);
      alert('Error guardando prospecto');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.nombre && formData.apellido && formData.dni && 
               formData.telefono && formData.email && formData.departamento;
      case 2:
        // Validar solo los campos realmente requeridos
        const requiredFields = [
          'agencia', 'facilitador', 'campaña', 'sector_economico', 
          'experiencia_banca_comunal', 'antiguedad_negocio', 'tamaño_negocio',
          'programa_recomendado', 'donde_se_entero', 'monto_solicitado'
        ];
        
        const missingFields = requiredFields.filter(field => !formData[field] || formData[field] === '');
        
        return missingFields.length === 0;
      case 3:
        return formData.grupo_etario && formData.etnia && formData.zona;
      default:
        return false;
    }
  };

  const showFieldErrors = (step) => {
    if (step === 2) {
      const requiredFields = [
        'agencia', 'facilitador', 'campaña', 'sector_economico', 
        'experiencia_banca_comunal', 'antiguedad_negocio', 'tamaño_negocio',
        'programa_recomendado', 'donde_se_entero', 'monto_solicitado'
      ];
      
      const missingFields = requiredFields.filter(field => !formData[field] || formData[field] === '');
      
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
    }
  };

  const nextStep = (e) => {
    e.preventDefault();
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = (e) => {
    e.preventDefault();
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Información Personal
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
          
              <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DNI *
            </label>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleInputChange}
              pattern="[0-9]*"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono *
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              pattern="[0-9]*"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
          
              <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
          
              <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono Adicional
                </label>
                <input
                  type="tel"
              name="telefono_adicional"
              value={formData.telefono_adicional}
              onChange={handleInputChange}
              pattern="[0-9]*"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
                </label>
                <input
                  type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentarios
            </label>
            <textarea
              name="comentarios"
              value={formData.comentarios}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departamento *
            </label>
            <select
              name="departamento"
              value={formData.departamento}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
            >
              <option value="">Seleccionar Departamento</option>
              {departamentos.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación GPS
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="latitud"
                value={formData.latitud}
                onChange={handleInputChange}
                placeholder="Latitud"
                step="any"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <input
                type="number"
                name="longitud"
                value={formData.longitud}
                onChange={handleInputChange}
                placeholder="Longitud"
                step="any"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
              >
                <Navigation className="w-4 h-4 mr-2" />
                GPS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Building className="w-5 h-5 mr-2" />
          Información del Prospecto
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agencia *
            </label>
            <select
              name="agencia"
              value={formData.agencia}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                fieldErrors.agencia 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300'
              }`}
              required
            >
              <option value="">Seleccionar Agencia</option>
              {agencias.map(agencia => (
                <option key={agencia} value={agencia}>{agencia}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facilitador *
            </label>
            <select
              name="facilitador"
              value={formData.facilitador}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                fieldErrors.facilitador 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300'
              }`}
              required
            >
              <option value="">Seleccionar Facilitador</option>
              {facilitadores.map(facilitador => (
                <option key={facilitador} value={facilitador}>{facilitador}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaña *
            </label>
            <select
              name="campaña"
              value={formData.campaña}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                fieldErrors.campaña 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300'
              }`}
              required
            >
              <option value="">Seleccionar Campaña</option>
              {campañas.map(campaña => (
                <option key={campaña} value={campaña}>{campaña}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sector Económico *
            </label>
            <select
              name="sector_economico"
              value={formData.sector_economico}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                fieldErrors.sector_economico 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300'
              }`}
              required
            >
              <option value="">Seleccionar Sector</option>
              {sectoresEconomicos.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experiencia en Banca Comunal *
            </label>
            <select
              name="experiencia_banca_comunal"
              value={formData.experiencia_banca_comunal}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                fieldErrors.experiencia_banca_comunal 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300'
              }`}
              required
            >
              <option value="">Seleccionar</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Garantía
            </label>
            <select
              name="tipo_garantia"
              value={formData.tipo_garantia}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Seleccionar Garantía</option>
              {tiposGarantia.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Antigüedad del Negocio *
            </label>
            <select
              name="antiguedad_negocio"
              value={formData.antiguedad_negocio}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                fieldErrors.antiguedad_negocio 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300'
              }`}
              required
            >
              <option value="">Seleccionar Antigüedad</option>
              {antiguedadNegocio.map(antiguedad => (
                <option key={antiguedad} value={antiguedad}>{antiguedad}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamaño del Negocio *
            </label>
            <select
              name="tamaño_negocio"
              value={formData.tamaño_negocio}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                fieldErrors.tamaño_negocio 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300'
              }`}
              required
            >
              <option value="">Seleccionar Tamaño</option>
              {tamañoNegocio.map(tamaño => (
                <option key={tamaño} value={tamaño}>{tamaño}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Programa Recomendado *
            </label>
            <select
              name="programa_recomendado"
              value={formData.programa_recomendado}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                fieldErrors.programa_recomendado 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300'
              }`}
              required
            >
              <option value="">Seleccionar Programa</option>
              {programasRecomendados.map(programa => (
                <option key={programa} value={programa}>{programa}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Dónde se Enteró? *
            </label>
            <select
              name="donde_se_entero"
              value={formData.donde_se_entero}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                fieldErrors.donde_se_entero 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300'
              }`}
              required
            >
              <option value="">Seleccionar Fuente</option>
              {dondeSeEntero.map(fuente => (
                <option key={fuente} value={fuente}>{fuente}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto de Crédito (Q) *
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
              placeholder="0"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-green-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Datos Adicionales
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Edad (Grupo Etario) *
            </label>
            <select
              name="grupo_etario"
              value={formData.grupo_etario}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Seleccionar Grupo Etario</option>
              {gruposEtarios.map(grupo => (
                <option key={grupo} value={grupo}>{grupo}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etnia *
            </label>
            <select
              name="etnia"
              value={formData.etnia}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Seleccionar Etnia</option>
              {etnias.map(etnia => (
                <option key={etnia} value={etnia}>{etnia}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Región (Área) *
            </label>
            <select
              name="zona"
              value={formData.zona}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Seleccionar Región</option>
              {zonas.map(zona => (
                <option key={zona} value={zona}>{zona}</option>
              ))}
            </select>
          </div>
          
              <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promotor Asignado
                </label>
                  <select
                    name="promotor_id"
                    value={formData.promotor_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
              <option value="">Seleccionar Promotor</option>
              {promotores.map(promotor => (
                        <option key={promotor.id} value={promotor.id}>
                  {promotor.nombre} {promotor.apellido}
                        </option>
              ))}
                  </select>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <User className="w-6 h-6 text-primary-500 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {prospect ? 'Editar Prospecto' : 'Nuevo Prospecto'}
                </h2>
                <p className="text-sm text-gray-600">
                  Formulario de Prospecto - Descripción Completa
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="relative flex items-center justify-center">
              {[
                { step: 1, title: 'Información Personal', icon: User },
                { step: 2, title: 'Información del Prospecto', icon: Building },
                { step: 3, title: 'Datos Adicionales', icon: Users }
              ].map((item, index) => {
                const Icon = item.icon;
                const isActive = currentStep === item.step;
                const isCompleted = currentStep > item.step;
                
                return (
                  <div key={item.step} className="flex flex-col items-center relative">
                    {/* Línea conectora */}
                    {index < 2 && (
                      <div className="absolute top-6 left-12 w-24 h-0.5 bg-gray-200">
                        <div className={`h-full transition-all duration-300 ${
                          isCompleted ? 'bg-primary-500' : 'bg-gray-200'
                        }`} style={{ width: isCompleted ? '100%' : '0%' }} />
                      </div>
                    )}
                    
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 relative z-10 ${
                      isActive 
                        ? 'bg-primary-500 text-white shadow-lg scale-110' 
                        : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                    }`}>
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`text-xs font-medium mt-2 text-center max-w-20 ${
                      isActive ? 'text-primary-600 font-semibold' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {item.title}
                    </span>
              </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step Content */}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={(e) => prevStep(e)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </button>
                )}
              </div>
              
              <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={(e) => nextStep(e)}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
            <button
              type="submit"
                    disabled={!validateStep(currentStep) || loading}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
              <Save className="w-4 h-4 mr-2" />
                        {prospect ? 'Actualizar' : 'Crear'} Prospecto
                      </>
                    )}
            </button>
                )}
              </div>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default ProspectForm;