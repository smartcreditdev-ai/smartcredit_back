import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  MapPin,
  User,
  Search,
  Filter,
  Eye,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { getCarteraCreditos, getCarteraStats, actualizarEstadoCredito, registrarPago, getHistorialPagos, getRenovaciones, getDesertados } from '../services/carteraService';

const PortfolioManagement = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('cartera');
  
  // Función para capitalizar el estado
  const capitalizeEstado = (estado) => {
    if (!estado) return estado;
    return estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
  };

  // Función para calcular tramos basado en días de atraso
  const calcularTramo = (diasMora) => {
    if (diasMora <= 0) return 'Al día';
    if (diasMora <= 30) return '1-30 días';
    if (diasMora <= 60) return '31-60 días';
    if (diasMora <= 90) return '61-90 días';
    if (diasMora <= 180) return '91-180 días';
    if (diasMora <= 365) return '181-365 días';
    return 'Mayor a 365 días';
  };

  // Función para obtener el color del tramo
  const getTramoColor = (tramo) => {
    const colores = {
      'Al día': 'bg-green-100 text-green-800',
      '1-30 días': 'bg-yellow-100 text-yellow-800',
      '31-60 días': 'bg-orange-100 text-orange-800',
      '61-90 días': 'bg-red-100 text-red-800',
      '91-180 días': 'bg-red-200 text-red-900',
      '181-365 días': 'bg-red-300 text-red-900',
      'Mayor a 365 días': 'bg-red-400 text-white'
    };
    return colores[tramo] || 'bg-gray-100 text-gray-800';
  };
  const [cartera, setCartera] = useState([]);
  const [renovaciones, setRenovaciones] = useState([]);
  const [desertados, setDesertados] = useState([]);
  
  // Datos maquetados para renovaciones (créditos que ya pagaron exitosamente)
  const renovacionesMock = [
    {
      id: '1',
      cliente: 'María González',
      dni: '12345678',
      telefono: '5555-1234',
      email: 'maria@email.com',
      monto_solicitado: 20000, // Nuevo monto solicitado para renovación
      cuota_mensual: 1600, // Nueva cuota
      fecha_vencimiento: '2024-12-15', // Nueva fecha de vencimiento
      dias_mora: 0,
      estado: 'renovacion',
      promotor: 'Carlos López',
      fecha_aprobacion: '2023-01-15', // Fecha del crédito anterior
      tasa_interes: 16.5, // Nueva tasa
      observaciones: 'Cliente con excelente historial de pagos - crédito anterior pagado al 100%',
      credito_anterior: {
        monto: 15000,
        fecha_inicio: '2023-01-15',
        fecha_finalizacion: '2023-12-15',
        estado_pago: 'completado'
      }
    },
    {
      id: '2',
      cliente: 'José Rodríguez',
      dni: '87654321',
      telefono: '5555-5678',
      email: 'jose@email.com',
      monto_solicitado: 30000, // Nuevo monto mayor
      cuota_mensual: 2400, // Nueva cuota
      fecha_vencimiento: '2025-01-20', // Nueva fecha
      dias_mora: 0,
      estado: 'renovacion',
      promotor: 'Ana Martínez',
      fecha_aprobacion: '2023-02-20', // Fecha del crédito anterior
      tasa_interes: 15.0, // Mejor tasa por buen historial
      observaciones: 'Cliente con historial perfecto - solicita renovación por expansión de negocio',
      credito_anterior: {
        monto: 20000,
        fecha_inicio: '2023-02-20',
        fecha_finalizacion: '2024-01-20',
        estado_pago: 'completado'
      }
    },
    {
      id: '3',
      cliente: 'Carmen Silva',
      dni: '55667788',
      telefono: '5555-1111',
      email: 'carmen@email.com',
      monto_solicitado: 12000, // Nuevo monto
      cuota_mensual: 950, // Nueva cuota
      fecha_vencimiento: '2024-10-30', // Nueva fecha
      dias_mora: 0,
      estado: 'renovacion',
      promotor: 'Pedro García',
      fecha_aprobacion: '2023-03-15', // Fecha del crédito anterior
      tasa_interes: 17.0,
      observaciones: 'Cliente con pagos puntuales - solicita renovación para capital de trabajo',
      credito_anterior: {
        monto: 10000,
        fecha_inicio: '2023-03-15',
        fecha_finalizacion: '2024-02-15',
        estado_pago: 'completado'
      }
    }
  ];

  // Datos maquetados para desertados
  const desertadosMock = [
    {
      id: '3',
      cliente: 'Luis Hernández',
      dni: '11223344',
      telefono: '5555-9999',
      email: 'luis@email.com',
      monto_solicitado: 8000,
      cuota_mensual: 650,
      fecha_vencimiento: '2023-12-10',
      dias_mora: 45,
      estado: 'desertado',
      promotor: 'Pedro García',
      fecha_aprobacion: '2023-06-10',
      tasa_interes: 20.0,
      observaciones: 'Cliente no responde a contactos'
    },
    {
      id: '4',
      cliente: 'Carmen Silva',
      dni: '55667788',
      telefono: '5555-1111',
      email: 'carmen@email.com',
      monto_solicitado: 12000,
      cuota_mensual: 950,
      fecha_vencimiento: '2023-11-25',
      dias_mora: 60,
      estado: 'desertado',
      promotor: 'Sofia Ruiz',
      fecha_aprobacion: '2023-05-25',
      tasa_interes: 19.5,
      observaciones: 'Cliente cambió de domicilio sin notificar'
    }
  ];
  const [stats, setStats] = useState({ totalCartera: 0, carteraMes: 0, totalCreditos: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('all');
  const [filterTramo, setFilterTramo] = useState('all');
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    type: 'success'
  });
  const [selectedCredito, setSelectedCredito] = useState(null);
  const [historialPagos, setHistorialPagos] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
      try {
        setLoading(true);
      const [carteraData, statsData] = await Promise.all([
        getCarteraCreditos(),
        getCarteraStats()
      ]);
      setCartera(carteraData);
      setStats(statsData);
      } catch (error) {
        console.error('Error cargando datos de cartera:', error);
      } finally {
        setLoading(false);
      }
    };

  const handleRegistrarPago = (credito) => {
    setSelectedCredito(credito);
    setShowPagoModal(true);
  };

  const handleVerHistorial = async (credito) => {
    setSelectedCredito(credito);
    try {
      const historial = await getHistorialPagos(credito.id);
      setHistorialPagos(historial);
      setShowHistorialModal(true);
    } catch (error) {
      console.error('Error cargando historial:', error);
    }
  };

  const handleActualizarEstado = async (creditoId, nuevoEstado, observaciones = '') => {
    try {
      // Solo actualizar en base de datos si es cartera real
      if (activeTab === 'cartera') {
        await actualizarEstadoCredito(creditoId, nuevoEstado, observaciones);
        await loadData();
      } else {
        // Para renovaciones y desertados, mostrar modal de notificación
        const actionMessages = {
          'aprobado': {
            title: '✅ Renovación Aprobada',
            message: 'La solicitud de renovación ha sido aprobada exitosamente. El cliente será notificado.',
            type: 'success'
          },
          'rechazado': {
            title: '❌ Renovación Rechazada',
            message: 'La solicitud de renovación ha sido rechazada. Se notificará al cliente con los motivos.',
            type: 'error'
          },
          'en proceso': {
            title: '🔄 Cliente Reactivado',
            message: 'El cliente ha sido reactivado y se reanudará la gestión de cobranza.',
            type: 'info'
          },
          'vencido': {
            title: '⚠️ Cliente Marcado como Vencido',
            message: 'El cliente ha sido marcado como vencido. Se iniciará el proceso de cobranza legal.',
            type: 'warning'
          }
        };

        const notification = actionMessages[nuevoEstado] || {
          title: 'Acción Ejecutada',
          message: `${nuevoEstado}: ${observaciones}`,
          type: 'info'
        };

        setNotificationData(notification);
        setShowNotificationModal(true);
        console.log(`Simulando cambio de estado: ${creditoId} -> ${nuevoEstado}`);
      }
    } catch (error) {
      console.error('Error actualizando estado:', error);
    }
  };

  const handleGuardarPago = async (pagoData) => {
    try {
      await registrarPago({
        ...pagoData,
        aplicacion_id: selectedCredito.id,
        cliente_id: selectedCredito.cliente_id
      });
      await loadData();
      setShowPagoModal(false);
      setSelectedCredito(null);
    } catch (error) {
      console.error('Error guardando pago:', error);
    }
  };

  // Obtener datos actuales según la pestaña activa
  const getCurrentData = () => {
    switch (activeTab) {
      case 'cartera':
        return cartera;
      case 'renovacion':
        return renovacionesMock;
      case 'desertados':
        return desertadosMock;
      default:
        return cartera;
    }
  };

  // Filtrar datos actuales
  const filteredData = getCurrentData().filter(credito => {
    const matchesSearch = !searchTerm || 
      credito.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credito.dni?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credito.telefono?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = filterEstado === 'all' || credito.estado === filterEstado;
    
    const matchesTramo = filterTramo === 'all' || calcularTramo(credito.dias_mora || 0) === filterTramo;
    
    return matchesSearch && matchesEstado && matchesTramo;
  });

  // Cambiar pestaña activa
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="space-y-6">
     

      {/* Pestañas */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => handleTabClick('cartera')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'cartera'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cartera
            </button>
            <button
              onClick={() => handleTabClick('renovacion')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'renovacion'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Renovación
            </button>
            <button
              onClick={() => handleTabClick('desertados')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'desertados'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Desertados
            </button>
          </nav>
        </div>
      </div>

      {/* Estadísticas de Cartera */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Cartera</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalCartera?.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cartera del Mes</p>
              <p className="text-2xl font-bold text-gray-900">${stats.carteraMes?.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Créditos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCreditos}</p>
            </div>
          </div>
        </div>
              </div>

      {/* Lista de Cartera */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {activeTab === 'cartera' ? 'Cartera de Créditos' : 
                 activeTab === 'renovacion' ? 'Solicitudes de Renovación' : 
                 'Créditos Desertados'}
              </h3>
              {activeTab === 'renovacion' && (
                <p className="text-sm text-gray-600 mt-1">
                  Clientes que completaron su crédito anterior y solicitan un nuevo crédito
                </p>
              )}
              {activeTab === 'desertados' && (
                <p className="text-sm text-gray-600 mt-1">
                  Créditos con dificultades de pago o clientes que no responden
                </p>
              )}
            </div>
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por cliente, DNI, teléfono..."
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
                <option value="aprobado">Aprobado</option>
                <option value="en proceso">En Proceso</option>
                <option value="vencido">Vencido</option>
                <option value="pagado">Pagado</option>
                <option value="renovacion">Renovación</option>
                <option value="desertado">Desertado</option>
              </select>
              <select
                value={filterTramo}
                onChange={(e) => setFilterTramo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">Todos los tramos</option>
                <option value="Al día">Al día</option>
                <option value="1-30 días">1-30 días</option>
                <option value="31-60 días">31-60 días</option>
                <option value="61-90 días">61-90 días</option>
                <option value="91-180 días">91-180 días</option>
                <option value="181-365 días">181-365 días</option>
                <option value="Mayor a 365 días">Mayor a 365 días</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay créditos</h3>
              <p className="text-gray-500">No se encontraron créditos con los filtros aplicados.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plazo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cuota Mensual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Vencimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tramos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promotor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((credito) => (
                  <tr key={credito.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {credito.cliente}
                          </div>
                          <div className="text-sm text-gray-500">
                            DNI: {credito.dni}
                          </div>
                          <div className="text-sm text-gray-500">
                            {credito.telefono}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${credito.monto_solicitado?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {credito.plazo_deseado} meses
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${credito.cuota_mensual?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {credito.fecha_vencimiento ? new Date(credito.fecha_vencimiento).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        credito.estado === 'aprobado' ? 'bg-green-100 text-green-800' :
                        credito.estado === 'en proceso' ? 'bg-yellow-100 text-yellow-800' :
                        credito.estado === 'vencido' ? 'bg-red-100 text-red-800' :
                        credito.estado === 'pagado' ? 'bg-blue-100 text-blue-800' :
                        credito.estado === 'renovacion' ? 'bg-purple-100 text-purple-800' :
                        credito.estado === 'desertado' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {capitalizeEstado(credito.estado)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTramoColor(calcularTramo(credito.dias_mora || 0))}`}>
                        {calcularTramo(credito.dias_mora || 0)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {credito.promotor || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {activeTab === 'cartera' && (
                          <>
                            <button
                              onClick={() => handleRegistrarPago(credito)}
                              className="text-green-600 hover:text-green-900"
                              title="Registrar Pago"
                            >
                              <CreditCard className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleVerHistorial(credito)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Ver Historial"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {activeTab === 'renovacion' && (
                          <>
                            <button
                              onClick={() => handleActualizarEstado(credito.id, 'aprobado', 'Renovación aprobada')}
                              className="text-green-600 hover:text-green-900"
                              title="Aprobar Renovación"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleActualizarEstado(credito.id, 'rechazado', 'Renovación rechazada')}
                              className="text-red-600 hover:text-red-900"
                              title="Rechazar Renovación"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {activeTab === 'desertados' && (
                          <>
                            <button
                              onClick={() => handleActualizarEstado(credito.id, 'en proceso', 'Reactivando gestión')}
                              className="text-blue-600 hover:text-blue-900"
                              title="Reactivar Cliente"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleActualizarEstado(credito.id, 'vencido', 'Marcado como vencido')}
                              className="text-red-600 hover:text-red-900"
                              title="Marcar Vencido"
                            >
                              <AlertTriangle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal de Registro de Pago */}
      {showPagoModal && selectedCredito && (
        <PagoModal
          credito={selectedCredito}
          onSave={handleGuardarPago}
          onClose={() => setShowPagoModal(false)}
        />
      )}

      {/* Modal de Historial de Pagos */}
      {showHistorialModal && selectedCredito && (
        <HistorialModal
          credito={selectedCredito}
          historial={historialPagos}
          onClose={() => setShowHistorialModal(false)}
        />
      )}

      {/* Modal de Notificación */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className={`p-6 rounded-t-xl ${
              notificationData.type === 'success' ? 'bg-green-50' :
              notificationData.type === 'error' ? 'bg-red-50' :
              notificationData.type === 'warning' ? 'bg-yellow-50' :
              'bg-blue-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {notificationData.type === 'success' && <CheckCircle className="w-6 h-6 text-green-600 mr-3" />}
                  {notificationData.type === 'error' && <X className="w-6 h-6 text-red-600 mr-3" />}
                  {notificationData.type === 'warning' && <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />}
                  {notificationData.type === 'info' && <Clock className="w-6 h-6 text-blue-600 mr-3" />}
                  <h3 className={`text-lg font-semibold ${
                    notificationData.type === 'success' ? 'text-green-900' :
                    notificationData.type === 'error' ? 'text-red-900' :
                    notificationData.type === 'warning' ? 'text-yellow-900' :
                    'text-blue-900'
                  }`}>
                    {notificationData.title}
                  </h3>
                </div>
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                {notificationData.message}
              </p>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    notificationData.type === 'success' ? 'bg-green-600 text-white hover:bg-green-700' :
                    notificationData.type === 'error' ? 'bg-red-600 text-white hover:bg-red-700' :
                    notificationData.type === 'warning' ? 'bg-yellow-600 text-white hover:bg-yellow-700' :
                    'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Componente Modal de Pago
const PagoModal = ({ credito, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    fecha_pago: new Date().toISOString().split('T')[0],
    monto: credito?.cuota_mensual?.toString() || '',
    observaciones: '',
    tipo_de_pago: 'total',
    monto_capital: '',
    monto_interes: '',
    monto_mora: '',
    metodo_contacto: '',
    resultado_contacto: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Actualizar monto cuando cambie el crédito
  useEffect(() => {
    if (credito?.cuota_mensual && formData.tipo_de_pago === 'total') {
      setFormData(prev => ({
        ...prev,
        monto: credito.cuota_mensual.toString()
      }));
    }
  }, [credito, formData.tipo_de_pago]);

  const handleTipoPagoChange = (e) => {
    const tipo = e.target.value;
    setFormData(prev => ({
      ...prev,
      tipo_de_pago: tipo,
      monto: tipo === 'total' ? credito.cuota_mensual?.toString() || '' : prev.monto
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error guardando pago:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Registrar Pago
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Cliente:</strong> {credito.cliente}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Monto del Crédito:</strong> ${credito.monto_solicitado?.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Cuota Mensual:</strong> ${credito.cuota_mensual?.toLocaleString()}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Pago *
              </label>
              <input
                type="date"
                name="fecha_pago"
                value={formData.fecha_pago}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Pago *
              </label>
              <select
                name="tipo_de_pago"
                value={formData.tipo_de_pago}
                onChange={handleTipoPagoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="total">Pago Total (Cuota Completa)</option>
                <option value="parcial">Pago Parcial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto del Pago *
              </label>
              <input
                type="number"
                name="monto"
                value={formData.monto}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0.00"
                step="0.01"
                required
                disabled={formData.tipo_de_pago === 'total'}
              />
            </div>

            {formData.tipo_de_pago === 'parcial' && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capital
                    </label>
                    <input
                      type="number"
                      name="monto_capital"
                      value={formData.monto_capital}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interés
                    </label>
                    <input
                      type="number"
                      name="monto_interes"
                      value={formData.monto_interes}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mora
                    </label>
                    <input
                      type="number"
                      name="monto_mora"
                      value={formData.monto_mora}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Contacto
              </label>
              <select
                name="metodo_contacto"
                value={formData.metodo_contacto}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Seleccionar método</option>
                <option value="llamada">Llamada telefónica</option>
                <option value="visita">Visita personal</option>
                <option value="mensaje">Mensaje de texto</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="oficina">En oficina</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resultado del Contacto
              </label>
              <textarea
                name="resultado_contacto"
                value={formData.resultado_contacto}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Resultado del contacto con el cliente..."
              />
            </div>

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
                placeholder="Detalles del pago..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Registrar Pago
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Componente Modal de Historial
const HistorialModal = ({ credito, historial, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Historial de Pagos - {credito.cliente}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {historial.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay pagos registrados para este crédito.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de Pago
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Observaciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {historial.map((pago) => (
                    <tr key={pago.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(pago.fecha_pago).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${pago.monto?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          pago.estado === 'confirmado' ? 'bg-green-100 text-green-800' :
                          pago.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {pago.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {pago.observaciones || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioManagement;