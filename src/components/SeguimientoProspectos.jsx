import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Calendar,
  Activity,
  User,
  CheckCircle,
  Search,
  X,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { registrarActividad, getAplicaciones, actualizarSolicitud, actualizarEstadoAplicacion, actualizarDatosCliente } from '../services/creditosService';
import NotificationModal from './NotificationModal';

const SeguimientoProspectos = () => {
  const { t } = useTranslation();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('all');
  const [showSeguimientoModal, setShowSeguimientoModal] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [solicitudToEdit, setSolicitudToEdit] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    type: 'success',
    title: '',
    message: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  // Función para capitalizar estados automáticamente
  const capitalizarEstado = (estado) => {
    if (!estado) return estado;
    
    return estado
      .split(' ')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
      .join(' ');
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const solicitudesData = await getAplicaciones();
      setSolicitudes(solicitudesData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleSeguimiento = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setShowSeguimientoModal(true);
  };

  const handleRegistrarSeguimiento = async (seguimientoData) => {
    try {
      console.log('Datos recibidos en handleRegistrarSeguimiento:', seguimientoData);
      console.log('selectedSolicitud:', selectedSolicitud);
      
      // Usar promotor_id de la solicitud o un valor por defecto
      const promotorId = selectedSolicitud.promotor_id || selectedSolicitud.promotor_asignado_id || '00000000-0000-0000-0000-000000000000';
      
      const actividadData = {
        cliente_id: selectedSolicitud.cliente_id,
        promotor_id: promotorId,
        ...seguimientoData
      };
      
      console.log('Datos finales para registrarActividad:', actividadData);
      
      await registrarActividad(actividadData);
      await loadData();
      setShowSeguimientoModal(false);
      setSelectedSolicitud(null);
    } catch (error) {
      console.error('Error registrando seguimiento:', error);
    }
  };

  const handleEdit = (solicitud) => {
    setSolicitudToEdit(solicitud);
    setShowEditModal(true);
  };

  const handleEditarSolicitud = async (datosEditados) => {
    try {
      setLoading(true);
      console.log('Actualizando solicitud con datos:', datosEditados);
      
      const result = await actualizarSolicitud(solicitudToEdit.id, datosEditados);
      
      if (result.success) {
        console.log('Solicitud actualizada exitosamente:', result.data);
        // Actualizar la lista de solicitudes
        await loadData();
        setShowEditModal(false);
        // Mostrar notificación de éxito
        setNotificationData({
          type: 'success',
          title: '¡Solicitud Actualizada!',
          message: 'La solicitud de crédito ha sido actualizada exitosamente.'
        });
        setShowNotification(true);
      } else {
        console.error('Error actualizando solicitud:', result.error);
        setNotificationData({
          type: 'error',
          title: 'Error al Actualizar',
          message: 'Hubo un problema al actualizar la solicitud. Por favor, inténtalo de nuevo.'
        });
        setShowNotification(true);
      }
    } catch (error) {
      console.error('Error en handleEditarSolicitud:', error);
      setNotificationData({
        type: 'error',
        title: 'Error Inesperado',
        message: 'Ocurrió un error inesperado al actualizar la solicitud. Por favor, inténtalo de nuevo.'
      });
      setShowNotification(true);
    } finally {
      setLoading(false);
    }
  };


  // Filtrar solicitudes
  const filteredSolicitudes = solicitudes.filter(solicitud => {
    const matchesSearch = !searchTerm || 
      solicitud.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.cliente_dni?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = filterEstado === 'all' || solicitud.estado === filterEstado;
    
    return matchesSearch && matchesEstado;
  });

  // Estadísticas de solicitudes
  const totalSolicitudes = solicitudes.length;
  const solicitudesPendientes = solicitudes.filter(s => s.estado === 'pendiente').length;
  const solicitudesAprobadas = solicitudes.filter(s => s.estado === 'aprobado').length;
  const solicitudesRechazadas = solicitudes.filter(s => s.estado === 'rechazado').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Seguimiento de Solicitud</h2>
          <p className="text-gray-600">Monitorea las actividades de los promotores y el seguimiento de solicitudes</p>
        </div>
      </div>

      {/* Estadísticas de Solicitudes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Solicitudes</p>
              <p className="text-2xl font-bold text-gray-900">{totalSolicitudes}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{solicitudesPendientes}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aprobadas</p>
              <p className="text-2xl font-bold text-gray-900">{solicitudesAprobadas}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rechazadas</p>
              <p className="text-2xl font-bold text-gray-900">{solicitudesRechazadas}</p>
            </div>
          </div>
        </div>
      </div>


      {/* Lista de Solicitudes */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Solicitudes de Crédito</h3>
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar solicitudes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="aprobado">Aprobado</option>
                <option value="rechazado">Rechazado</option>
                <option value="recibido">Recibido</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredSolicitudes.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay solicitudes</h3>
              <p className="text-gray-500">No se encontraron solicitudes con los filtros aplicados.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto Solicitado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plazo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Solicitud
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSolicitudes.map((solicitud) => (
                  <tr key={solicitud.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {solicitud.cliente_nombre}
                          </div>
                          <div className="text-sm text-gray-500">
                            DNI: {solicitud.cliente_dni}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${solicitud.monto_solicitado?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {solicitud.producto_nombre || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {solicitud.plazo_deseado} meses
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        solicitud.estado === 'aprobado' ? 'bg-green-100 text-green-800' :
                        solicitud.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        solicitud.estado === 'rechazado' ? 'bg-red-100 text-red-800' :
                        solicitud.estado === 'recibido' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {capitalizarEstado(solicitud.estado)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(solicitud.fecha_solicitud).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(solicitud)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleSeguimiento(solicitud)}
                          className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                        >
                          Seguimiento
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>


      {/* Modal de Seguimiento */}
      {showSeguimientoModal && selectedSolicitud && (
        <SeguimientoModal
          solicitud={selectedSolicitud}
          onSave={handleRegistrarSeguimiento}
          onClose={() => {
            setShowSeguimientoModal(false);
            setSelectedSolicitud(null);
          }}
          onDataReload={loadData}
        />
      )}

      {/* Modal de Editar */}
      {showEditModal && solicitudToEdit && (
        <EditarSolicitudModal
          solicitud={solicitudToEdit}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditarSolicitud}
        />
      )}

      {/* Modal de Notificación */}
      <NotificationModal
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
        type={notificationData.type}
        title={notificationData.title}
        message={notificationData.message}
        autoClose={true}
        duration={4000}
      />
    </div>
  );
};

// Componente Modal de Seguimiento Detallado
const SeguimientoModal = ({ solicitud, onSave, onClose, onDataReload }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    tipo_actividad: 'llamada',
    fecha_actividad: new Date().toISOString().split('T')[0],
    duracion_minutos: '',
    observaciones: '',
    resultado: 'pendiente', // Valor por defecto para campo obligatorio
    proxima_visita: '',
    monto_desembolsado: '',
    codigo_grupo: '',
    motivo_rechazo: '',
    resultado_seguimiento: ''
  });

  // Estados del flujo de aprobación con contenido hardcodeado para demo
  const estadosFlujo = [
    'Recibido',
    'Análisis Inicial',
    'Documentación Básica',
    'Análisis Legal',
    'Documentación Adicional',
    'Aprobación Comité',
    'Pendiente de Firma',
    'Resolución'
  ];

  // Estado para los datos específicos de cada etapa
  const [etapaData, setEtapaData] = useState({});

  // Mapeo de estados UI a estados BD (minúsculas para Supabase)
  const mapeoEstadosBD = {
    'Recibido': 'recibido',
    'Análisis Inicial': 'analisis inicial', 
    'Documentación Básica': 'documentacion basica',
    'Análisis Legal': 'analisis legal',
    'Documentación Adicional': 'documentacion adicional',
    'Aprobación Comité': 'aprobacion comite',
    'Pendiente de Firma': 'pendiente de firma',
    'Resolución': 'resolucion'
  };

  // Mapeo inverso: estados BD a estados UI
  const mapeoEstadosUI = {
    'recibido': 'Recibido',
    'analisis inicial': 'Análisis Inicial',
    'documentacion basica': 'Documentación Básica', 
    'analisis legal': 'Análisis Legal',
    'documentacion adicional': 'Documentación Adicional',
    'aprobacion comite': 'Aprobación Comité',
    'pendiente de firma': 'Pendiente de Firma',
    'resolucion': 'Resolución',
    // Estados finales que mapean a Resolución
    'aprobado': 'Resolución',
    'rechazado': 'Resolución',
    'credito a futuro': 'Resolución'
  };

  // Definir funciones auxiliares antes de usarlas
  const getEstadoIndex = (estado) => {
    // Convertir estado de BD a estado UI
    const estadoUI = mapeoEstadosUI[estado] || estado;
    const index = estadosFlujo.findIndex(e => e === estadoUI);
    
    // Si es un estado final (aprobado, rechazado, credito a futuro), mapear a Resolución
    if (estado === 'aprobado' || estado === 'rechazado' || estado === 'credito a futuro') {
      const resolucionIndex = estadosFlujo.length - 1; // Última etapa es Resolución
      return resolucionIndex;
    }
    
    return index >= 0 ? index : 0;
  };

  const getProgreso = (estado) => {
    const index = getEstadoIndex(estado);
    return Math.round((index / (estadosFlujo.length - 1)) * 100);
  };

  // Verificar si una etapa es final (no se puede avanzar más)
  const esEtapaFinal = (index) => {
    const estado = estadosFlujo[index];
    return estado === 'Resolución';
  };

  // Definir estadoIndex y progreso antes de usarlos
  let estadoIndex = getEstadoIndex(solicitud.estado);
  console.log('🔍 Estado inicial:', solicitud.estado, 'estadoIndex inicial:', estadoIndex);
  
  // Asegurar que estados finales mapeen correctamente a Resolución
  if (solicitud.estado === 'aprobado' || solicitud.estado === 'rechazado' || solicitud.estado === 'credito a futuro') {
    estadoIndex = estadosFlujo.length - 1; // Índice de "Resolución"
    console.log('🔧 Estado final detectado:', solicitud.estado, '-> estadoIndex:', estadoIndex, 'etapa:', estadosFlujo[estadoIndex]);
  } else {
    console.log('❌ No es estado final, estadoIndex permanece:', estadoIndex);
  }
  
  const progreso = getProgreso(solicitud.estado);

  // Precargar datos del cliente y aplicación según la etapa
  useEffect(() => {
    const estadoActual = estadosFlujo[estadoIndex];
    
    // Datos comunes para todas las etapas (incluyendo documento)
    // Los datos vienen de la aplicación que ya incluye los datos del cliente
    console.log('🔍 Datos de la solicitud:', {
      dni_image: solicitud.dni_image,
      photos: solicitud.photos,
      cliente_nombre: solicitud.cliente_nombre
    });
    
    const datosComunes = {
      documento: solicitud.dni_image || '', // URL del DNI del cliente
      dni_image: solicitud.dni_image || '', // URL del DNI del cliente  
      photos: solicitud.photos || '', // URL de la foto del cliente
      resultado_seguimiento: solicitud.resultado_seguimiento || '' // Resultado del seguimiento
    };
    
    if (estadoActual === 'Recibido') {
      setEtapaData({
        ...datosComunes,
        nombre: solicitud.cliente_nombre || '',
        telefono: solicitud.cliente_telefono || '',
        email: solicitud.cliente_email || ''
      });
    } else if (estadoActual === 'Análisis Inicial') {
      setEtapaData({
        ...datosComunes,
        sector_economico: solicitud.sector_economico || '',
        experiencia_banca_comunal: solicitud.experiencia_banca_comunal ? 'Sí' : 'No',
        tamaño_negocio: solicitud.tamaño_negocio || ''
      });
    } else if (estadoActual === 'Documentación Básica') {
      setEtapaData({
        ...datosComunes,
        direccion: solicitud.direccion || '',
        latitud: solicitud.latitud || '',
        longitud: solicitud.longitud || ''
      });
    } else if (estadoActual === 'Análisis Legal') {
      setEtapaData({
        ...datosComunes,
        tipo_garantia: solicitud.tipo_garantia || '',
        antiguedad_negocio: solicitud.antiguedad_negocio || '',
        programa_recomendado: solicitud.programa_recomendado || ''
      });
    } else if (estadoActual === 'Documentación Adicional') {
      setEtapaData({
        ...datosComunes,
        telefono_adicional: solicitud.telefono_adicional || '',
        fecha_nacimiento: solicitud.fecha_nacimiento || '',
        grupo_etario: solicitud.grupo_etario || '',
        etnia: solicitud.etnia || '',
        zona: solicitud.zona || ''
      });
    } else if (estadoActual === 'Aprobación Comité') {
      setEtapaData({
        ...datosComunes,
        monto_solicitado: solicitud.monto_solicitado || '',
        comentarios: solicitud.observaciones || ''
      });
    } else if (estadoActual === 'Pendiente Firma') {
      setEtapaData({
        ...datosComunes,
        fecha_firma: solicitud.fecha_firma || '',
        lugar_firma: solicitud.lugar_firma || '',
        testigos: solicitud.testigos || ''
      });
    } else if (estadoActual === 'Aprobado') {
      setEtapaData({
        ...datosComunes,
        fecha_desembolso: solicitud.fecha_desembolso || '',
        monto_aprobado: solicitud.monto_aprobado || '',
        numero_cuenta: solicitud.numero_cuenta || ''
      });
    }
  }, [estadoIndex, solicitud]);

  // Contenido hardcodeado para cada etapa con formularios específicos
  const contenidoEtapas = {
    'Recibido': {
      titulo: 'Solicitud Recibida',
      descripcion: 'Verificar datos básicos del cliente y confirmar recepción.',
      acciones: ['Confirmar datos del cliente', 'Verificar contacto', 'Asignar promotor'],
      documentos: ['Datos básicos del cliente'],
      tiempoEstimado: 'Inmediato',
      camposRequeridos: [
        { campo: 'nombre', tipo: 'text', label: 'Nombre Completo', requerido: false, soloLectura: true },
        { campo: 'telefono', tipo: 'tel', label: 'Teléfono', requerido: false, soloLectura: true },
        { campo: 'email', tipo: 'email', label: 'Email', requerido: false, soloLectura: true },
        { campo: 'comentarios', tipo: 'textarea', label: 'Observaciones del Cliente', requerido: false }
      ]
    },
    'Análisis Inicial': {
      titulo: 'Análisis Inicial',
      descripcion: 'Evaluar el perfil del cliente y su capacidad de pago.',
      acciones: ['Evaluar ingresos', 'Verificar referencias', 'Analizar historial'],
      documentos: ['Comprobantes de ingresos', 'Referencias personales'],
      tiempoEstimado: '2-3 días',
      camposRequeridos: [
        { campo: 'sector_economico', tipo: 'select', label: 'Sector Económico', requerido: true, opciones: ['Comercio', 'Servicio', 'Producción', 'Sector Agrícola', 'Otro'] },
        { campo: 'experiencia_banca_comunal', tipo: 'select', label: 'Experiencia en Banca Comunal', requerido: true, opciones: ['Sí', 'No'] },
        { campo: 'tamaño_negocio', tipo: 'select', label: 'Tamaño del Negocio', requerido: true, opciones: ['Pequeño', 'Mediano', 'Grande'] },
        { campo: 'comentarios', tipo: 'textarea', label: 'Observaciones del Análisis', requerido: false }
      ]
    },
    'Documentación Básica': {
      titulo: 'Recopilación de Documentación',
      descripcion: 'Recopilar documentos básicos del cliente.',
      acciones: ['Solicitar documentos', 'Verificar autenticidad', 'Digitalizar'],
      documentos: ['DNI', 'Comprobante de ingresos', 'Referencias'],
      tiempoEstimado: '1-2 días',
      camposRequeridos: [
        { campo: 'dni_image', tipo: 'file', label: 'Documento', requerido: true },
        { campo: 'direccion', tipo: 'text', label: 'Dirección Completa', requerido: true },
        { campo: 'comentarios', tipo: 'textarea', label: 'Observaciones de Documentación', requerido: false }
      ]
    },
    'Análisis Legal': {
      titulo: 'Análisis Legal',
      descripcion: 'Revisar garantías y documentación legal.',
      acciones: ['Revisar garantías', 'Verificar documentación', 'Evaluar riesgos'],
      documentos: ['Garantías', 'Títulos de propiedad'],
      tiempoEstimado: '2-3 días',
      camposRequeridos: [
        { campo: 'tipo_garantia', tipo: 'select', label: 'Tipo de Garantía', requerido: true, opciones: ['Fiduciaria', 'Prendaria', 'Derechos Posesorios', 'Hipotecaria', 'Solidaria'] },
        { campo: 'antiguedad_negocio', tipo: 'select', label: 'Antigüedad del Negocio', requerido: true, opciones: ['Menor a 6 meses', '6 meses a 1 año', '1 a 2 años', 'Mayor o igual a 3 años', 'Inspección visual'] },
        { campo: 'programa_recomendado', tipo: 'select', label: 'Programa Recomendado', requerido: true, opciones: ['Banca Comunal', 'Crédito Individual'] },
        { campo: 'comentarios', tipo: 'textarea', label: 'Observaciones Legales', requerido: false }
      ]
    },
    'Documentación Adicional': {
      titulo: 'Documentación Adicional',
      descripcion: 'Completar información demográfica y de contacto.',
      acciones: ['Solicitar datos adicionales', 'Verificar información', 'Completar perfil'],
      documentos: ['Datos demográficos', 'Información de contacto'],
      tiempoEstimado: '1 día',
      camposRequeridos: [
        { campo: 'telefono_adicional', tipo: 'tel', label: 'Teléfono Adicional', requerido: false },
        { campo: 'fecha_nacimiento', tipo: 'date', label: 'Fecha de Nacimiento', requerido: true },
        { campo: 'grupo_etario', tipo: 'select', label: 'Grupo Etario', requerido: true, opciones: ['15–19 años', '20–24 años', '25–29 años', '30 años o más'] },
        { campo: 'etnia', tipo: 'select', label: 'Etnia', requerido: true, opciones: ['Indígena', 'No indígena'] },
        { campo: 'zona', tipo: 'select', label: 'Zona', requerido: true, opciones: ['Urbana', 'Rural'] },
        { campo: 'comentarios', tipo: 'textarea', label: 'Observaciones Adicionales', requerido: false }
      ]
    },
    'Aprobación Comité': {
      titulo: 'Revisión del Comité',
      descripcion: 'Evaluación final por el comité de créditos.',
      acciones: ['Presentar al comité', 'Evaluar recomendaciones', 'Tomar decisión'],
      documentos: ['Expediente completo', 'Recomendaciones'],
      tiempoEstimado: '1 día',
      camposRequeridos: [
        { campo: 'monto_solicitado', tipo: 'number', label: 'Monto Solicitado (Q)', requerido: true },
        { campo: 'comentarios', tipo: 'textarea', label: 'Recomendación del Promotor', requerido: true }
      ]
    },
    'Pendiente de Firma': {
      titulo: 'Pendiente de Firma',
      descripcion: 'Coordinar firma de contratos y documentación.',
      acciones: ['Preparar contratos', 'Coordinar firma', 'Verificar identidad'],
      documentos: ['Contrato de crédito', 'Garantías'],
      tiempoEstimado: '1 día',
      camposRequeridos: [
        { campo: 'fecha_firma', tipo: 'date', label: 'Fecha Programada para Firma', requerido: true },
        { campo: 'lugar_firma', tipo: 'text', label: 'Lugar de Firma', requerido: true },
        { campo: 'testigos', tipo: 'text', label: 'Testigos (nombres)', requerido: false },
        { campo: 'comentarios', tipo: 'textarea', label: 'Observaciones de Firma', requerido: false }
      ]
    },
    'aprobado': {
      titulo: 'Crédito Aprobado',
      descripcion: 'Programar desembolso y activar cuenta del cliente.',
      acciones: ['Programar desembolso', 'Notificar al cliente', 'Activar cuenta'],
      documentos: ['Contrato firmado', 'Autorización de desembolso'],
      tiempoEstimado: 'Inmediato',
      camposRequeridos: [
        { campo: 'fecha_desembolso', tipo: 'date', label: 'Fecha de Desembolso', requerido: true },
        { campo: 'monto_aprobado', tipo: 'number', label: 'Monto Aprobado (Q)', requerido: true },
        { campo: 'numero_cuenta', tipo: 'text', label: 'Número de Cuenta', requerido: true },
        { campo: 'comentarios', tipo: 'textarea', label: 'Observaciones Finales', requerido: false }
      ]
    },
    'Resolución': {
      titulo: 'Resolución Final',
      descripcion: 'Definir el resultado final del crédito: aprobado, rechazado o crédito a futuro.',
      acciones: ['Tomar decisión final', 'Notificar al cliente', 'Archivar expediente'],
      documentos: ['Resolución final', 'Notificación al cliente'],
      tiempoEstimado: 'Inmediato',
      camposRequeridos: [
        { campo: 'resultado_seguimiento', tipo: 'select', label: 'Resultado Final', requerido: true, opciones: ['Aprobado', 'Rechazado', 'Crédito a Futuro'] },
        { campo: 'fecha_desembolso', tipo: 'date', label: 'Fecha de Desembolso (si aprobado)', requerido: false },
        { campo: 'monto_aprobado', tipo: 'number', label: 'Monto Aprobado (Q)', requerido: false },
        { campo: 'numero_cuenta', tipo: 'text', label: 'Número de Cuenta', requerido: false },
        { campo: 'motivo_rechazo', tipo: 'textarea', label: 'Motivo del Rechazo (si rechazado)', requerido: false },
        { campo: 'comentarios', tipo: 'textarea', label: 'Observaciones Finales', requerido: false }
      ]
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResultadoChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      resultado_seguimiento: value
    }));
    
    // También actualizar etapaData para que el botón Resuelto aparezca
    setEtapaData(prev => ({
      ...prev,
      resultado_seguimiento: value
    }));

    // Mostrar/ocultar secciones según la selección
    const motivoRechazoSection = document.getElementById('motivo_rechazo_section');
    const infoConversion = document.getElementById('info_conversion');
    const infoFuturo = document.getElementById('info_futuro');

    if (value === 'rechazo') {
      motivoRechazoSection?.classList.remove('hidden');
      infoConversion?.classList.add('hidden');
      infoFuturo?.classList.add('hidden');
    } else if (value === 'conversion_inmediata') {
      motivoRechazoSection?.classList.add('hidden');
      infoConversion?.classList.remove('hidden');
      infoFuturo?.classList.add('hidden');
    } else if (value === 'credito_futuro') {
      motivoRechazoSection?.classList.add('hidden');
      infoConversion?.classList.add('hidden');
      infoFuturo?.classList.remove('hidden');
    } else {
      motivoRechazoSection?.classList.add('hidden');
      infoConversion?.classList.add('hidden');
      infoFuturo?.classList.add('hidden');
    }
  };

  // Funcion para cambiar de etapa (actualizar estado real en BD)
  const handleCambiarEtapa = async (nuevoIndex) => {
    try {
      const nuevoEstadoUI = estadosFlujo[nuevoIndex];
      const nuevoEstadoBD = mapeoEstadosBD[nuevoEstadoUI];
      
      console.log('Avanzando etapa a:', nuevoEstadoUI, '(BD:', nuevoEstadoBD, ')');
      console.log('Datos recopilados en esta etapa:', etapaData);
      
      // Actualizar el estado real en la base de datos (usar estado BD)
      await actualizarEstadoAplicacion(solicitud.id, nuevoEstadoBD);
      
      // Guardar los datos recopilados en la tabla clientes si hay datos
      if (Object.keys(etapaData).length > 0 && solicitud.cliente_id) {
        // Definir campos válidos para la tabla clientes
        const camposValidosCliente = [
          'nombre', 'apellido', 'telefono', 'email', 'direccion', 'fecha_nacimiento',
          'dni_image', 'photos', 'sector_economico', 'experiencia_banca_comunal', 
          'tamaño_negocio', 'tipo_garantia', 'antiguedad_negocio', 'programa_recomendado',
          'telefono_adicional', 'grupo_etario', 'etnia', 'zona', 'monto_solicitado',
          'observaciones', 'fecha_firma', 'lugar_firma', 'testigos', 'fecha_desembolso',
          'monto_aprobado', 'numero_cuenta'
        ];
        
        // Filtrar solo los campos válidos
        const camposCliente = {};
        Object.keys(etapaData).forEach(campo => {
          if (camposValidosCliente.includes(campo) && etapaData[campo] && etapaData[campo] !== '') {
            // Convertir 'Sí'/'No' a boolean para experiencia_banca_comunal
            if (campo === 'experiencia_banca_comunal') {
              camposCliente[campo] = etapaData[campo] === 'Sí';
            } else {
              camposCliente[campo] = etapaData[campo];
            }
          }
        });
        
        // Mapear campo documento a dni_imagen para la tabla clientes
        if (etapaData.documento && etapaData.documento !== '') {
          camposCliente.dni_image = etapaData.documento;
        }
        
        if (Object.keys(camposCliente).length > 0) {
          console.log('Actualizando datos del cliente:', camposCliente);
          try {
            await actualizarDatosCliente(solicitud.cliente_id, camposCliente);
            console.log('Datos del cliente actualizados exitosamente');
          } catch (error) {
            console.error('Error actualizando datos del cliente:', error);
            // Continuar con el proceso aunque falle la actualización de datos
          }
        }
      }
      
      // Recargar los datos si la función está disponible
      if (onDataReload) {
        await onDataReload();
      }
      
      console.log('Estado actualizado exitosamente a:', nuevoEstadoUI);
      
      // Cerrar el modal después de avanzar
      onClose();
      
    } catch (error) {
      console.error('Error avanzando etapa:', error);
      alert('Error al actualizar el estado de la aplicación');
    }
  };

  // Funcion para finalizar el proceso (actualizar estado real en BD)
  const handleFinalizarProceso = async () => {
    try {
      console.log('Finalizando proceso - Estado: aprobado');
      
      // Actualizar el estado a "aprobado" en la base de datos
      await actualizarEstadoAplicacion(solicitud.id, 'aprobado');
      
      // Recargar los datos si la función está disponible
      if (onDataReload) {
        await onDataReload();
      }
      
      alert('¡Proceso completado! La aplicación ha sido aprobada.');
      
      // Cerrar el modal
      onClose();
      
    } catch (error) {
      console.error('Error finalizando proceso:', error);
      alert('Error al finalizar el proceso');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Avanzar a la siguiente etapa (actualizar estado real en BD)
    const siguienteEtapa = estadoIndex + 1;
    if (siguienteEtapa < estadosFlujo.length && !esEtapaFinal(estadoIndex)) {
      handleCambiarEtapa(siguienteEtapa);
    } else {
      handleFinalizarProceso();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="w-6 h-6 text-white mr-3" />
              <h3 className="text-xl font-semibold text-white">
                Seguimiento de Prospecto
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-white hover:bg-opacity-20"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Contenido Hardcodeado de la Etapa Actual */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Información de la Etapa Actual</h4>
            
            {(() => {
              const estadoActual = estadosFlujo[estadoIndex];
              const contenido = contenidoEtapas[estadoActual];
              
              return (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h5 className="text-xl font-bold text-purple-900">{contenido.titulo}</h5>
                      <p className="text-sm text-gray-600 mt-1">Tiempo estimado: {contenido.tiempoEstimado}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">{progreso}%</div>
                      <div className="text-sm text-gray-600">Progreso</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{contenido.descripcion}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h6 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Acciones Requeridas
                      </h6>
                      <ul className="space-y-1">
                        {contenido.acciones.map((accion, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            {accion}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h6 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Activity className="w-4 h-4 mr-2 text-blue-600" />
                        Documentos Necesarios
                      </h6>
                      <ul className="space-y-1">
                        {contenido.documentos.map((documento, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            {documento}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Formulario Dinámico para la Etapa Actual */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Datos Requeridos para esta Etapa</h4>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              {(() => {
                const estadoActual = estadosFlujo[estadoIndex];
                const contenido = contenidoEtapas[estadoActual];
                
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contenido.camposRequeridos.map((campo, index) => (
                      <div key={index} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {campo.label} {campo.requerido && <span className="text-red-500">*</span>}
                        </label>
                        
                        {campo.soloLectura ? (
                          <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
                            {etapaData[campo.campo] || 'No disponible'}
                          </div>
                        ) : campo.tipo === 'select' ? (
                          <select
                            value={etapaData[campo.campo] || ''}
                            onChange={(e) => setEtapaData(prev => ({ ...prev, [campo.campo]: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          >
                            <option value="">Seleccionar...</option>
                            {campo.opciones.map((opcion, idx) => (
                              <option key={idx} value={opcion}>{opcion}</option>
                            ))}
                          </select>
                        ) : campo.tipo === 'textarea' ? (
                          <textarea
                            value={etapaData[campo.campo] || ''}
                            onChange={(e) => setEtapaData(prev => ({ ...prev, [campo.campo]: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder={`Ingrese ${campo.label.toLowerCase()}...`}
                          />
                        ) : campo.tipo === 'file' ? (
                          <div className="space-y-2">
                            {/* Mostrar documento existente si está disponible */}
                            {campo.campo === 'dni_image' && etapaData.documento && (
                              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="mb-3">
                                  <h4 className="font-medium text-blue-900">DNI Existente</h4>
                                  <p className="text-sm text-blue-700">Documento ya cargado en el sistema</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg border">
                                  <img
                                    src={etapaData.documento}
                                    alt="DNI del cliente"
                                    className="w-full max-w-md mx-auto rounded-lg shadow-sm"
                                    style={{ maxHeight: '300px', objectFit: 'contain' }}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextElementSibling.style.display = 'block';
                                    }}
                                  />
                                  <div className="hidden text-center text-gray-500 py-4">
                                    <p>No se pudo cargar la imagen</p>
                                    <a
                                      href={etapaData.documento}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      Abrir en nueva pestaña
                                    </a>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  // Convertir a base64 para almacenar
                                  const reader = new FileReader();
                                  reader.onload = (e) => {
                                    setEtapaData(prev => ({ ...prev, [campo.campo]: e.target.result }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                            {etapaData[campo.campo] && (
                              <div className="text-sm text-green-600">✓ Archivo seleccionado</div>
                            )}
                          </div>
                        ) : (
                          <input
                            type={campo.tipo}
                            value={etapaData[campo.campo] || ''}
                            onChange={(e) => setEtapaData(prev => ({ ...prev, [campo.campo]: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder={`Ingrese ${campo.label.toLowerCase()}...`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Navegación de Etapas */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Navegación de Etapas</h4>
            <div className="bg-gray-100 rounded-lg p-4">
              {/* Barra de progreso con puntos */}
              <div className="relative w-full mb-6">
                {/* Línea de progreso */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progreso}%` }}
                  ></div>
                </div>
                
                {/* Puntos de etapas */}
                <div className="absolute top-0 left-0 w-full h-2 flex justify-between">
                  {estadosFlujo.map((estado, index) => (
                    <div key={estado} className="relative">
                      {/* Punto */}
                      <div 
                        className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                          index <= estadoIndex 
                            ? 'bg-purple-600 border-purple-600' 
                            : 'bg-white border-gray-300'
                        }`}
                        style={{ 
                          transform: 'translateY(-6px)',
                          marginLeft: index === 0 ? '0' : index === estadosFlujo.length - 1 ? '0' : '-8px'
                        }}
                      ></div>
                      
                      {/* Label debajo del punto */}
                      <div 
                        className="absolute top-3 left-1/2 transform -translate-x-1/2 text-xs text-center whitespace-nowrap"
                        style={{ minWidth: '60px' }}
                      >
                        <div className={`${
                          index <= estadoIndex 
                            ? 'text-purple-600 font-medium' 
                            : 'text-gray-500'
                        }`}>
                          {estado}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones de navegación */}
              <div className="flex flex-wrap gap-2 justify-center">
                
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información del Cliente */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nombre Completo</label>
                  <p className="text-gray-900">{solicitud.cliente_nombre}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">DNI</label>
                  <p className="text-gray-900">{solicitud.cliente_dni}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Teléfono</label>
                  <p className="text-gray-900">{solicitud.cliente_telefono || 'No disponible'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{solicitud.cliente_email || 'No disponible'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Score Crediticio</label>
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-red-600">Score Insuficiente</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detalles de la Aplicación */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Detalles de la Aplicación</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Monto Solicitado</label>
                  <p className="text-xl font-bold text-green-600">${solicitud.monto_solicitado?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Plazo</label>
                  <p className="text-gray-900">{solicitud.plazo_deseado} meses</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Ingresos Mensuales</label>
                  <p className="text-gray-900">${solicitud.ingresos_mensuales?.toLocaleString() || 'No disponible'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Antigüedad Laboral</label>
                  <p className="text-gray-900">{solicitud.antiguedad_laboral || 0} años (0 meses)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Validaciones Automáticas */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Validaciones Automáticas</h4>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Ver Reglas
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>Score ≥ 300</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>Documentación Completa</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>DNI Válido (5-20 chars)</span>
              </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Ingresos &gt; $0</span>
                </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>Antigüedad &ge; 0 meses</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>Monto &le; 80% ingresos</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>Sin Mora (&le; 30 días)</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>Referencias (&ge; 0)</span>
              </div>
            </div>
          </div>

          {/* Documentación */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Documentación</h4>
            <div className="space-y-3">
              {/* DNI - Siempre visible en todas las etapas */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">Documento de Identidad</h5>
                  <p className="text-sm text-gray-600">DNI, pasaporte o documento de identidad</p>
                </div>
                <div className="flex items-center">
                  {(etapaData.documento || etapaData.dni_image) ? (
                    <>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Disponible</span>
                      <div className="ml-3 flex space-x-2">
                        {/* Mostrar dni_image si existe */}
                        {etapaData.dni_image && (
                          <img
                            src={etapaData.dni_image}
                            alt="DNI del cliente"
                            className="w-16 h-12 object-cover rounded border cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => {
                              const modal = document.createElement('div');
                              modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
                              modal.innerHTML = `
                                <div class="bg-white rounded-lg p-4 max-w-4xl max-h-[90vh] overflow-auto">
                                  <div class="flex justify-between items-center mb-4">
                                    <h3 class="text-lg font-semibold">DNI del Cliente</h3>
                                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                      </svg>
                                    </button>
                                  </div>
                                  <img src="${etapaData.dni_image}" alt="DNI del cliente" class="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />
                                </div>
                              `;
                              document.body.appendChild(modal);
                              modal.addEventListener('click', (e) => {
                                if (e.target === modal) modal.remove();
                              });
                            }}
                            title="Hacer clic para ver en tamaño completo"
                          />
                        )}
                        {/* Mostrar documento si existe */}
                        {etapaData.documento && (
                          <img
                            src={etapaData.documento}
                            alt="Documento del cliente"
                            className="w-16 h-12 object-cover rounded border cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => {
                              const modal = document.createElement('div');
                              modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
                              modal.innerHTML = `
                                <div class="bg-white rounded-lg p-4 max-w-4xl max-h-[90vh] overflow-auto">
                                  <div class="flex justify-between items-center mb-4">
                                    <h3 class="text-lg font-semibold">Documento del Cliente</h3>
                                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                      </svg>
                                    </button>
                                  </div>
                                  <img src="${etapaData.documento}" alt="Documento del cliente" class="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />
                                </div>
                              `;
                              document.body.appendChild(modal);
                              modal.addEventListener('click', (e) => {
                                if (e.target === modal) modal.remove();
                              });
                            }}
                            title="Hacer clic para ver en tamaño completo"
                          />
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pendiente</span>
                      <span className="ml-2 text-sm text-gray-500">No disponible</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Foto del Cliente */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">Foto del Cliente</h5>
                  <p className="text-sm text-gray-600">Fotografía del cliente</p>
                </div>
                <div className="flex items-center">
                  {etapaData.photos ? (
                    <>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Disponible</span>
                      <div className="ml-3">
                        <img
                          src={etapaData.photos}
                          alt="Foto del cliente"
                          className="w-16 h-12 object-cover rounded border cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => {
                            const modal = document.createElement('div');
                            modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
                            modal.innerHTML = `
                              <div class="bg-white rounded-lg p-4 max-w-4xl max-h-[90vh] overflow-auto">
                                <div class="flex justify-between items-center mb-4">
                                  <h3 class="text-lg font-semibold">Foto del Cliente</h3>
                                  <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                  </button>
                                </div>
                                <img src="${etapaData.photos}" alt="Foto del cliente" class="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />
                              </div>
                            `;
                            document.body.appendChild(modal);
                            modal.addEventListener('click', (e) => {
                              if (e.target === modal) modal.remove();
                            });
                          }}
                          title="Hacer clic para ver en tamaño completo"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pendiente</span>
                      <span className="ml-2 text-sm text-gray-500">No disponible</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">Comprobante de Ingresos</h5>
                  <p className="text-sm text-gray-600">Recibos de sueldo o comprobantes de ingresos</p>
                </div>
                <div className="flex items-center">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pendiente</span>
                  <span className="ml-2 text-sm text-gray-500">No disponible</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">Referencias Personales</h5>
                  <div className="text-sm text-gray-600">
                    <div className="font-medium">Referencia 1</div>
                    <div className="flex items-center mt-1">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Completa</span>
                    </div>
                    <div className="mt-1 text-xs">
                      <div>Nombre: greger</div>
                      <div>Teléfono: 35345</div>
                      <div>Relación: dfgd</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de Seguimiento - No mostrar en etapa Resolución */}
          {estadosFlujo[estadoIndex] !== 'Resolución' && solicitud.estado !== 'aprobado' && solicitud.estado !== 'rechazado' && solicitud.estado !== 'a futuro' && (
          <div className="mt-8 border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Seguimiento de Prospecto - Primer Seguimiento</h4>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Resultado del Seguimiento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resultado del Seguimiento *
                </label>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="conversion_inmediata"
                      name="resultado_seguimiento"
                      value="conversion_inmediata"
                      onChange={handleResultadoChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <label htmlFor="conversion_inmediata" className="ml-3">
                      <span className="text-sm font-medium text-gray-900">Conversión Inmediata</span>
                      <p className="text-xs text-gray-600">El prospecto se convierte en cliente y se desembolsa el crédito</p>
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="credito_futuro"
                      name="resultado_seguimiento"
                      value="credito_futuro"
                      onChange={handleResultadoChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="credito_futuro" className="ml-3">
                      <span className="text-sm font-medium text-gray-900">Crédito a Futuro</span>
                      <p className="text-xs text-gray-600">El prospecto está interesado pero no procede ahora</p>
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="rechazo"
                      name="resultado_seguimiento"
                      value="rechazo"
                      onChange={handleResultadoChange}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <label htmlFor="rechazo" className="ml-3">
                      <span className="text-sm font-medium text-gray-900">Rechazo</span>
                      <p className="text-xs text-gray-600">El prospecto no cumple con los requisitos o no está interesado</p>
                    </label>
                  </div>
                </div>
              </div>

              {/* Motivo del Rechazo (solo si se selecciona rechazo) */}
              <div id="motivo_rechazo_section" className="hidden">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo del Rechazo *
                </label>
                <select
                  name="motivo_rechazo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Seleccionar motivo...</option>
                  <option value="no_cumple_requisitos">No cumple con los requisitos</option>
                  <option value="no_interesado">No está interesado</option>
                  <option value="documentacion_incompleta">Documentación incompleta</option>
                  <option value="score_insuficiente">Score crediticio insuficiente</option>
                  <option value="ingresos_insuficientes">Ingresos insuficientes</option>
                  <option value="antiguedad_insuficiente">Antigüedad laboral insuficiente</option>
                  <option value="otro">Otro motivo</option>
                </select>
              </div>

              {/* Observaciones del Seguimiento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones del Seguimiento
                </label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Detalles adicionales del seguimiento..."
                />
              </div>

              {/* Información adicional para conversión inmediata */}
              <div id="info_conversion" className="hidden bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-medium text-green-900 mb-2">Información para Conversión</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monto a Desembolsar</label>
                    <input
                      type="number"
                      name="monto_desembolsado"
                      value={formData.monto_desembolsado}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Ej: 5000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código de Grupo</label>
                    <input
                      type="text"
                      name="codigo_grupo"
                      value={formData.codigo_grupo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Ej: GRP001"
                    />
                  </div>
                </div>
              </div>

              {/* Información adicional para crédito a futuro */}
              <div id="info_futuro" className="hidden bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-medium text-blue-900 mb-2">Información para Crédito Futuro</h5>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Próximo Contacto</label>
                  <input
                    type="date"
                    name="proxima_visita"
                    value={formData.proxima_visita}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

            </form>
          </div>
          )}
          
          {/* Botones de navegación - SIEMPRE visibles fuera del formulario */}
          <div className="mt-8 border-t pt-6">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              
              {/* Botón Retroceder */}
              {estadoIndex > 0 && (
                <button
                  type="button"
                  onClick={() => handleCambiarEtapa(estadoIndex - 1)}
                  className="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                >
                  ← Retroceder
                </button>
              )}
              
              {/* Botón Siguiente Etapa */}
              <button
                type="button"
                onClick={async () => {
                  const siguienteEtapa = estadoIndex + 1;
                  if (siguienteEtapa < estadosFlujo.length && !esEtapaFinal(estadoIndex)) {
                    await handleCambiarEtapa(siguienteEtapa);
                  } else {
                    await handleFinalizarProceso();
                  }
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {esEtapaFinal(estadoIndex) ? 'Finalizar' : (estadoIndex === estadosFlujo.length - 1 ? 'Aprobar' : 'Siguiente Etapa')}
              </button>
              
              {/* Botón Resuelto - aparece cuando hay resultado del seguimiento */}
              {etapaData.resultado_seguimiento && etapaData.resultado_seguimiento !== '' && !esEtapaFinal(estadoIndex) && (
                <button
                  type="button"
                  onClick={async () => {
                    // Mapear resultado a estado BD
                    let estadoBD = '';
                    if (etapaData.resultado_seguimiento === 'conversion_inmediata') {
                      estadoBD = 'aprobado';
                    } else if (etapaData.resultado_seguimiento === 'credito_futuro') {
                      estadoBD = 'credito a futuro';
                    } else if (etapaData.resultado_seguimiento === 'rechazo') {
                      estadoBD = 'rechazado';
                    }
                    
                    // Actualizar estado en BD
                    await actualizarEstadoAplicacion(solicitud.id, estadoBD);
                    
                    // Recargar datos
                    if (onDataReload) {
                      await onDataReload();
                    }
                    
                    // Cerrar modal
                    onClose();
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Resuelto
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Modal de Editar Solicitud
const EditarSolicitudModal = ({ solicitud, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    
    // Información de la solicitud
    monto_solicitado: solicitud.monto_solicitado || '',
    plazo_deseado: solicitud.plazo_deseado || '',
    producto_nombre: solicitud.producto_nombre || '',
    estado: solicitud.estado || 'pendiente',
    observaciones: solicitud.observaciones || '',
    
    // Información financiera
    ingresos_mensuales: solicitud.ingresos_mensuales || '',
    otros_ingresos: solicitud.otros_ingresos || '',
    anios_en_empresa: solicitud.anios_en_empresa || '',
    
    // Información laboral
    empresa: solicitud.empresa || '',
    cargo: solicitud.cargo || '',
    telefono_empresa: solicitud.telefono_empresa || '',
    
    // Información del crédito
    tasa_interes: solicitud.tasa_interes || '',
    cuota_mensual: solicitud.cuota_mensual || '',
    proposito: solicitud.proposito || '',
    
    // Referencias personales
    personal_ref1_nombre: solicitud.personal_ref1_nombre || '',
    personal_ref1_telefono: solicitud.personal_ref1_telefono || '',
    personal_ref1_relacion: solicitud.personal_ref1_relacion || '',
    personal_ref2_nombre: solicitud.personal_ref2_nombre || '',
    personal_ref2_telefono: solicitud.personal_ref2_telefono || '',
    
    
    
    // Rechazo
    motivo_rechazo: solicitud.motivo_rechazo || '',
    dias_mora: solicitud.dias_mora || ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error guardando cambios:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Edit className="w-6 h-6 text-white mr-3" />
              <h3 className="text-xl font-semibold text-white">
                Editar Solicitud de Crédito
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-white hover:bg-opacity-20"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Información de la Solicitud */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Información de la Solicitud</h4>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plazo Deseado (meses) *
                  </label>
                  <input
                    type="number"
                    name="plazo_deseado"
                    value={formData.plazo_deseado}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Producto
                  </label>
                  <input
                    type="text"
                    name="producto_nombre"
                    value={formData.producto_nombre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="recibido">Recibido</option>
                    <option value="en_revision">En Revisión</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="rechazado">Rechazado</option>
                    <option value="desembolsado">Desembolsado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Información Financiera */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Información Financiera</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingresos Mensuales
                  </label>
                  <input
                    type="number"
                    name="ingresos_mensuales"
                    value={formData.ingresos_mensuales}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Información Laboral */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Información Laboral</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cargo
                  </label>
                  <input
                    type="text"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono de la Empresa
                  </label>
                  <input
                    type="tel"
                    name="telefono_empresa"
                    value={formData.telefono_empresa}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Información del Crédito */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Información del Crédito</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tasa de Interés (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="tasa_interes"
                    value={formData.tasa_interes}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuota Mensual
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="cuota_mensual"
                    value={formData.cuota_mensual}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Propósito del Crédito
                  </label>
                  <input
                    type="text"
                    name="proposito"
                    value={formData.proposito}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Compra de vehículo, remodelación, etc."
                  />
                </div>
              </div>
            </div>

            {/* Referencias Personales */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Referencias Personales</h4>
              <div className="space-y-4">
                {/* Referencia 1 */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Referencia Personal 1</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre
                      </label>
                      <input
                        type="text"
                        name="personal_ref1_nombre"
                        value={formData.personal_ref1_nombre}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="personal_ref1_telefono"
                        value={formData.personal_ref1_telefono}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relación
                      </label>
                      <input
                        type="text"
                        name="personal_ref1_relacion"
                        value={formData.personal_ref1_relacion}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: Familiar, Amigo, Colega"
                      />
                    </div>
                  </div>
                </div>

                {/* Referencia 2 */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Referencia Personal 2</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre
                      </label>
                      <input
                        type="text"
                        name="personal_ref2_nombre"
                        value={formData.personal_ref2_nombre}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="personal_ref2_telefono"
                        value={formData.personal_ref2_telefono}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>



            {/* Información de Rechazo */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Información de Rechazo</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo del Rechazo
                  </label>
                  <textarea
                    name="motivo_rechazo"
                    value={formData.motivo_rechazo}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Motivo específico del rechazo..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Días en Mora
                  </label>
                  <input
                    type="number"
                    name="dias_mora"
                    value={formData.dias_mora}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones
              </label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Observaciones adicionales sobre la solicitud..."
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>


    </div>
  );
};

export default SeguimientoProspectos;