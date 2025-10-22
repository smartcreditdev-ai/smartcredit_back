import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock, 
  UserCheck, 
  UserX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  Loader2,
  User,
  Shield
} from 'lucide-react';
import { 
  getPendingUsers, 
  getApprovedUsers, 
  approveUser, 
  rejectUser, 
  getUserStats 
} from '../services/mobileUserService';

const MobileUserApproval = () => {
  const { t } = useTranslation();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [showApproved, setShowApproved] = useState(false);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [userToReject, setUserToReject] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');


  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const [pendingData, approvedData, statsData] = await Promise.all([
        getPendingUsers(),
        getApprovedUsers(),
        getUserStats()
      ]);
      
      setPendingUsers(pendingData);
      setApprovedUsers(approvedData);
      setStats(statsData);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    setProcessing(true);
    try {
      const result = await approveUser(userId);
      if (result.success) {
        await loadUsers(); // Recargar datos
        showNotificationModal('Usuario aprobado exitosamente', 'success');
      } else {
        showNotificationModal(`Error aprobando usuario: ${result.error}`, 'error');
      }
    } catch (error) {
      console.error('Error aprobando usuario:', error);
      showNotificationModal('Error aprobando usuario', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (userId, motivo) => {
    setProcessing(true);
    try {
      const result = await rejectUser(userId, motivo);
      if (result.success) {
        await loadUsers(); // Recargar datos
        showNotificationModal('Usuario rechazado exitosamente', 'success');
      } else {
        showNotificationModal(`Error rechazando usuario: ${result.error}`, 'error');
      }
    } catch (error) {
      console.error('Error rechazando usuario:', error);
      showNotificationModal('Error rechazando usuario', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectClick = (user) => {
    setUserToReject(user);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      showNotificationModal('Por favor ingresa un motivo para el rechazo', 'error');
      return;
    }

    setProcessing(true);
    try {
      const result = await rejectUser(userToReject.id, rejectReason);
      if (result.success) {
        await loadUsers(); // Recargar datos
        showNotificationModal('Usuario rechazado exitosamente', 'success');
        setShowRejectModal(false);
        setRejectReason('');
        setUserToReject(null);
      } else {
        showNotificationModal(`Error rechazando usuario: ${result.error}`, 'error');
      }
    } catch (error) {
      console.error('Error rechazando usuario:', error);
      showNotificationModal('Error rechazando usuario', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  const showNotificationModal = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
  };

  const filteredUsers = () => {
    const users = showApproved ? approvedUsers : pendingUsers;
    return users.filter(user => {
      const matchesSearch = user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'activo': return 'bg-green-100 text-green-800';
      case 'rechazado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'promotor': return 'bg-blue-100 text-blue-800';
      case 'cobrador': return 'bg-purple-100 text-purple-800';
      case 'supervisor': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2 text-primary-500" />
            Aprobar Usuarios Móviles
          </h3>
          <p className="text-gray-600 mt-1">Gestiona la aprobación de usuarios para la aplicación móvil</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={loadUsers}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </button>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar usuarios pendientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      </div>


      {/* Lista de Usuarios */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">
            Usuarios Pendientes
          </h4>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredUsers().map((user) => (
            <div key={user.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h5 className="text-lg font-medium text-gray-900">
                      {user.nombre} {user.apellido}
                    </h5>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.estado)}`}>
                      {user.estado}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.rol)}`}>
                      {user.rol}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {user.email}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Registro: {user.fecha_registro}
                      {user.fecha_aprobacion && (
                        <span className="ml-4">
                          Aprobación: {user.fecha_aprobacion}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleApprove(user.id)}
                    disabled={processing}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleRejectClick(user)}
                    disabled={processing}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Detalles */}
      {showDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-6 h-6 text-white mr-3" />
                  <h3 className="text-xl font-semibold text-white">
                    Detalles del Usuario
                  </h3>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-white hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-white hover:bg-opacity-20"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">

              <div className="space-y-6">
                {/* Información Personal */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-primary-600" />
                    Información Personal
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                      <p className="text-sm text-gray-900 font-medium">{selectedUser.nombre} {selectedUser.apellido}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-sm text-gray-900 font-medium">{selectedUser.email}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <p className="text-sm text-gray-900 font-medium">{selectedUser.telefono || 'No especificado'}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                      <p className="text-sm text-gray-900 font-medium">{selectedUser.direccion || 'No especificada'}</p>
                    </div>
                  </div>
                </div>

                {/* Estado y Rol */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-primary-600" />
                    Estado y Permisos
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getRoleColor(selectedUser.rol)}`}>
                        {selectedUser.rol}
                      </span>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedUser.estado)}`}>
                        {selectedUser.estado}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Documentos</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">DPI</span>
                      <span className="text-sm font-medium">{selectedUser.documentos.dpi}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Comprobante de Ingresos</span>
                      <span className="text-sm font-medium">
                        {selectedUser.documentos.comprobante_ingresos ? 'Sí' : 'No'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Referencias</span>
                      <span className="text-sm font-medium">{selectedUser.documentos.referencias}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedUser.observaciones}</p>
                </div>

                {!showApproved && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-primary-600" />
                      Acciones Disponibles
                    </h4>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          handleApprove(selectedUser.id);
                          setShowDetails(false);
                        }}
                        disabled={processing}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center font-medium transition-colors shadow-md hover:shadow-lg"
                      >
                        {processing ? (
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="w-5 h-5 mr-2" />
                        )}
                        Aprobar Usuario
                      </button>
                      <button
                        onClick={() => {
                          handleRejectClick(selectedUser);
                          setShowDetails(false);
                        }}
                        disabled={processing}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center font-medium transition-colors shadow-md hover:shadow-lg"
                      >
                        {processing ? (
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <XCircle className="w-5 h-5 mr-2" />
                        )}
                        Rechazar Usuario
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Rechazo */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <XCircle className="w-6 h-6 text-white mr-3" />
                  <h3 className="text-xl font-semibold text-white">
                    Rechazar Usuario
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                    setUserToReject(null);
                  }}
                  className="text-white hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-white hover:bg-opacity-20"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {userToReject && (
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Usuario a rechazar:</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-gray-900">{userToReject.nombre} {userToReject.apellido}</p>
                    <p className="text-sm text-gray-600">{userToReject.email}</p>
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo del rechazo *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Describe el motivo por el cual se rechaza este usuario..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  rows={4}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Este motivo será registrado en el sistema.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                    setUserToReject(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmReject}
                  disabled={processing || !rejectReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
                >
                  {processing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  Rechazar Usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Notificación */}
      {showNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className={`px-6 py-4 rounded-t-xl ${
              notificationType === 'success' 
                ? 'bg-gradient-to-r from-green-500 to-green-600' 
                : 'bg-gradient-to-r from-red-500 to-red-600'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {notificationType === 'success' ? (
                    <CheckCircle className="w-6 h-6 text-white mr-3" />
                  ) : (
                    <XCircle className="w-6 h-6 text-white mr-3" />
                  )}
                  <h3 className="text-xl font-semibold text-white">
                    {notificationType === 'success' ? 'Éxito' : 'Error'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowNotification(false)}
                  className="text-white hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-white hover:bg-opacity-20"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center">
                <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
                  notificationType === 'success' 
                    ? 'bg-green-100' 
                    : 'bg-red-100'
                }`}>
                  {notificationType === 'success' ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {notificationMessage}
                </p>
                <p className="text-sm text-gray-500">
                  {notificationType === 'success' 
                    ? 'La operación se completó correctamente.' 
                    : 'Hubo un problema al procesar la solicitud.'
                  }
                </p>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => setShowNotification(false)}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                    notificationType === 'success'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
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

export default MobileUserApproval;
