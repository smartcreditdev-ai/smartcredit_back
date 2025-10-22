import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserModal from '../components/UserModal';
import FormBuilder from '../components/FormBuilder';
import FormulaManager from '../components/FormulaManager';
import RoleManager from '../components/RoleManager';
import MobileUserApproval from '../components/MobileUserApproval';
import UsuarioForm from '../components/UsuarioForm';
import { useUsuarios } from '../hooks/useSupabaseData';
import { usePendingUsers } from '../hooks/usePendingUsers';
import { createAuthUser, inviteUserByEmail, createUserViaAPI, updateUser, toggleUserStatus, approveUser, rejectUser } from '../services/api';
import RejectUserModal from '../components/RejectUserModal';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Settings,
  Calculator,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Loader2,
  Lock
} from 'lucide-react';

const Administrador = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('usuarios');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingForm, setEditingForm] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [userToReject, setUserToReject] = useState(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // Obtener datos reales de usuarios
  const { usuarios, loading: usuariosLoading, error: usuariosError } = useUsuarios();
  const { pendingUsers, loading: pendingLoading, refetch: refetchPending } = usePendingUsers();

  const tabs = [
    { id: 'usuarios', label: t('administrador.gestionUsuarios'), icon: Users, enabled: true },
    { id: 'aprobar', label: t('administrador.aprobarUsuariosMoviles'), icon: CheckCircle, enabled: true },
    { id: 'formulas', label: 'Fórmulas de Cálculo', icon: Calculator, enabled: true },
    { id: 'roles', label: t('administrador.rolesPermisos'), icon: Shield, enabled: true },
    { id: 'formularios', label: t('administrador.formulariosMoviles'), icon: Settings, enabled: true }
  ];

  // Usar datos reales de usuarios
  const users = React.useMemo(() => {
    if (!usuarios || usuarios.length === 0) return [];
    
    return usuarios.map(usuario => ({
      id: usuario.id,
      nombre: usuario.nombre || 'Usuario sin nombre',
      apellido: usuario.apellido || '',
      email: usuario.email || 'Sin email',
      rol: usuario.rol || 'Sin rol',
      agencia: usuario.agencia || 'Sin agencia',
      agencia_id: usuario.agencia_id || '',
      estado: usuario.estado || 'Inactivo',
      fechaCreacion: usuario.fecha_creacion || new Date().toISOString().split('T')[0],
      ultimoAcceso: usuario.ultimo_acceso || 'Nunca'
    }));
  }, [usuarios]);


  // Datos de ejemplo para roles
  const [roles, setRoles] = useState([
    {
      id: 1,
      nombre: 'Administrador',
      descripcion: 'Acceso completo al sistema',
      permisos: ['usuarios', 'creditos', 'cobranzas', 'reportes', 'configuracion'],
      usuarios: 2
    },
    {
      id: 2,
      nombre: 'Supervisor',
      descripcion: 'Supervisión de operaciones',
      permisos: ['creditos', 'cobranzas', 'reportes'],
      usuarios: 3
    },
    {
      id: 3,
      nombre: 'Promotor',
      descripcion: 'Gestión de clientes y créditos',
      permisos: ['creditos', 'expedientes'],
      usuarios: 8
    }
  ]);

  // Datos de ejemplo para formularios móviles
  const [forms, setForms] = useState([
    {
      id: 1,
      nombre: 'Formulario de Cliente',
      descripcion: 'Formulario para crear nuevos clientes',
      campos: [
        { id: 1, nombre: 'Nombre', tipo: 'texto', requerido: true, orden: 1 },
        { id: 2, nombre: 'Apellido', tipo: 'texto', requerido: true, orden: 2 },
        { id: 3, nombre: 'Email', tipo: 'email', requerido: true, orden: 3 },
        { id: 4, nombre: 'Teléfono', tipo: 'telefono', requerido: true, orden: 4 },
        { id: 5, nombre: 'Dirección', tipo: 'texto', requerido: false, orden: 5 }
      ],
      activo: true
    }
  ]);

  const handleApproveUser = async (userId) => {
    try {
      await approveUser(userId);
      alert('Usuario aprobado exitosamente');
      refetchPending();
    } catch (error) {
      console.error('Error aprobando usuario:', error);
      alert('Error al aprobar usuario');
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      await rejectUser(userId);
      alert('Usuario rechazado exitosamente');
      refetchPending();
      setShowRejectModal(false);
      setUserToReject(null);
    } catch (error) {
      console.error('Error rechazando usuario:', error);
      alert('Error al rechazar usuario');
    } finally {
      setIsRejecting(false);
    }
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      // Aquí puedes agregar la lógica para eliminar el usuario de la base de datos
      // await deleteUserFromDatabase(userToDelete.id);
      
      // Por ahora solo actualizamos el estado local
      setUsers(prev => prev.filter(user => user.id !== userToDelete.id));
      setShowDeleteModal(false);
      setUserToDelete(null);
      alert('Usuario eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      alert('Error al eliminar usuario');
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      const user = users.find(u => u.id === userId);
      const newStatus = user.estado === 'Activo' ? 'Inactivo' : 'Activo';
      await toggleUserStatus(userId, newStatus);
      alert('Estado de usuario actualizado exitosamente');
      // Refrescar datos
      window.location.reload();
    } catch (error) {
      console.error('Error cambiando estado:', error);
      alert('Error al cambiar estado del usuario');
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        // Actualizar usuario existente
        await updateUser(editingUser.id, userData);
        alert('Usuario actualizado exitosamente');
        // Refrescar datos
        window.location.reload();
      } else {
        // Crear nuevo usuario en Supabase Auth
        console.log('Creando usuario en Supabase Auth:', userData);
        
        // Usar API route del servidor para crear usuario
        const newUser = userData.sendEmail 
          ? await inviteUserByEmail(userData)  // Envía email de invitación
          : await createUserViaAPI(userData);  // Crea usuario normal
        
        if (newUser) {
          console.log('Usuario creado exitosamente:', newUser);
          const emailMessage = userData.sendEmail 
            ? 'Se ha enviado un email de invitación al usuario para establecer su contraseña.'
            : 'Se ha enviado un email de confirmación al usuario para activar su cuenta.';
          alert(`Usuario creado exitosamente. ${emailMessage}`);
          
          // Recargar la lista de usuarios
          window.location.reload();
        } else {
          alert('Error al crear el usuario');
        }
      }
      setEditingUser(null);
    } catch (error) {
      console.error('Error guardando usuario:', error);
      alert(`Error al crear usuario: ${error.message}`);
    }
  };

  const handleSaveForm = (formData) => {
    if (editingForm) {
      // Actualizar formulario existente
      setForms(prev => prev.map(form => 
        form.id === editingForm.id 
          ? { ...formData, id: editingForm.id }
          : form
      ));
    } else {
      // Crear nuevo formulario
      const newForm = {
        ...formData,
        id: Date.now()
      };
      setForms(prev => [...prev, newForm]);
    }
    setEditingForm(null);
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Activo':
        return 'bg-green-100 text-green-800';
      case 'Inactivo':
        return 'bg-red-100 text-red-800';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (rol) => {
    switch (rol) {
      case 'Administrador':
        return 'bg-purple-100 text-purple-800';
      case 'Supervisor':
        return 'bg-blue-100 text-blue-800';
      case 'Promotor':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const isEnabled = tab.enabled;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (isEnabled) {
                        setActiveTab(tab.id);
                      } else {
                        setShowUpgradeModal(true);
                      }
                    }}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      isActive
                        ? 'border-primary-500 text-primary-600'
                        : isEnabled
                          ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          : 'border-transparent text-gray-400 cursor-pointer hover:text-gray-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {!isEnabled && <Lock className="w-3 h-3 ml-1" />}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Contenido de las tabs */}
        <div className="space-y-6">
          {/* Tab: Gestión de Usuarios */}
          {activeTab === 'usuarios' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">{t('administrador.usuariosSistema')}</h3>
                <button
                  onClick={() => setShowUserModal(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{t('administrador.crearUsuario')}</span>
                </button>
              </div>

              {usuariosLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-600">Cargando usuarios...</span>
                </div>
              ) : usuariosError ? (
                <div className="text-center text-red-600 py-8">
                  <p>Error al cargar los usuarios: {usuariosError}</p>
                </div>
              ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('common.formularios.nombre')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('common.formularios.rol')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Agencia
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('common.formularios.estado')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Último Acceso
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.nombre} {user.apellido}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.rol)}`}>
                              {user.rol}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.agencia}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.estado)}`}>
                              {user.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.ultimoAcceso}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => {
                                setEditingUser(user);
                                setShowUserModal(true);
                              }}
                              className="text-primary-600 hover:text-primary-900"
                              title="Editar usuario"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="text-red-600 hover:text-red-900"
                              title="Eliminar usuario"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}


          {/* Tab: Aprobar Usuarios Móviles */}
          {activeTab === 'aprobar' && (
            <MobileUserApproval />
          )}


          {/* Tab: Fórmulas de Cálculo */}
          {activeTab === 'formulas' && (
            <FormulaManager />
          )}

          {/* Tab: Roles y Permisos */}
          {activeTab === 'roles' && (
            <RoleManager />
          )}

          {/* Tab: Formularios Móviles */}
          {activeTab === 'formularios' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Formularios de la App Móvil</h3>
                <button
                  onClick={() => setShowFormBuilder(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Formulario</span>
                </button>
              </div>

              <div className="grid gap-6">
                {forms.map((form) => (
                  <div key={form.id} className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{form.nombre}</h4>
                        <p className="text-sm text-gray-500">{form.descripcion}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${form.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {form.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-600">Campos del Formulario</label>
                      <div className="mt-2 space-y-2">
                        {form.campos.map((campo) => (
                          <div key={campo.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-900">{campo.nombre}</span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {campo.tipo}
                              </span>
                              {campo.requerido && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                  Requerido
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">Orden: {campo.orden}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button 
                        onClick={() => {
                          setEditingForm(form);
                          setShowFormBuilder(true);
                        }}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                      <button className="btn-outline flex items-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>Vista Previa</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      {/* Modal de Usuario */}
      {showUserModal && (
        <UsuarioForm
          usuario={editingUser}
          onSuccess={() => {
            setShowUserModal(false);
            setEditingUser(null);
            // Recargar datos si es necesario
            window.location.reload();
          }}
          onClose={() => {
            setShowUserModal(false);
            setEditingUser(null);
          }}
        />
      )}

      {/* Modal de Constructor de Formularios */}
      {showFormBuilder && (
        <FormBuilder
          form={editingForm}
          onSave={handleSaveForm}
          onClose={() => {
            setShowFormBuilder(false);
            setEditingForm(null);
          }}
        />
      )}

      {/* Modal de Upgrade */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Lock className="w-6 h-6 text-primary-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Funcionalidad Premium</h3>
              </div>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Esta funcionalidad está disponible en el <strong>Plan Pro</strong>.
              </p>
              <p className="text-gray-600 mb-4">
                Para acceder a todas las funcionalidades de administración, contacta con el administrador del sistema.
              </p>
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <h4 className="font-medium text-primary-900 mb-2">Funcionalidades incluidas en Plan Pro:</h4>
                <ul className="text-sm text-primary-800 space-y-1">
                  <li>• Aprobar usuarios móviles</li>
                  <li>• Gestión de roles y permisos</li>
                  <li>• Constructor de formularios móviles</li>
                  <li>• Configuraciones avanzadas</li>
                </ul>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  // Aquí podrías agregar lógica para contactar administración
                  alert('Contacta con el administrador del sistema para obtener el Plan Pro');
                }}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Contactar Administración
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Rechazo de Usuario */}
      <RejectUserModal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setUserToReject(null);
        }}
        user={userToReject}
        onConfirm={() => handleRejectUser(userToReject?.id)}
        loading={isRejecting}
      />

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Trash2 className="w-6 h-6 text-red-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Eliminar Usuario</h3>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                ¿Estás seguro de que deseas eliminar este usuario?
              </p>
              {userToDelete && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">Usuario a eliminar:</h4>
                  <div className="text-sm text-red-700">
                    <p><strong>Nombre:</strong> {userToDelete.nombre} {userToDelete.apellido}</p>
                    <p><strong>Email:</strong> {userToDelete.email}</p>
                    <p><strong>Rol:</strong> {userToDelete.rol}</p>
                  </div>
                </div>
              )}
              <p className="text-sm text-red-600 mt-4">
                <strong>⚠️ Esta acción es irreversible</strong>
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteUser}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar Usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Administrador;
