import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserModal from '../components/UserModal';
import FormBuilder from '../components/FormBuilder';
import { useUsuarios } from '../hooks/useSupabaseData';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Loader2
} from 'lucide-react';

const Administrador = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('usuarios');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingForm, setEditingForm] = useState(null);
  
  // Obtener datos reales de usuarios
  const { usuarios, loading: usuariosLoading, error: usuariosError } = useUsuarios();

  const tabs = [
    { id: 'usuarios', label: t('administrador.gestionUsuarios'), icon: Users },
    { id: 'aprobar', label: t('administrador.aprobarUsuariosMoviles'), icon: CheckCircle },
    { id: 'roles', label: t('administrador.rolesPermisos'), icon: Shield },
    { id: 'formularios', label: t('administrador.formulariosMoviles'), icon: Settings }
  ];

  // Usar datos reales de usuarios
  const users = React.useMemo(() => {
    if (!usuarios || usuarios.length === 0) return [];
    
    return usuarios.map(usuario => ({
      id: usuario.id,
      nombre: usuario.nombre || 'Usuario sin nombre',
      email: usuario.email || 'Sin email',
      rol: usuario.rol || 'Sin rol',
      sucursal: usuario.sucursal || 'Sin sucursal',
      estado: usuario.estado || 'Inactivo',
      fechaCreacion: usuario.fecha_creacion || new Date().toISOString().split('T')[0],
      ultimoAcceso: usuario.ultimo_acceso || 'Nunca'
    }));
  }, [usuarios]);

  // Datos de ejemplo para usuarios móviles pendientes
  const [pendingUsers, setPendingUsers] = useState([
    {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan.perez@gmail.com',
      telefono: '+502 1234-5678',
      sucursal: 'Centro',
      fechaRegistro: '2024-01-15 14:30',
      estado: 'Pendiente',
      documentos: ['Cédula', 'Comprobante de ingresos']
    },
    {
      id: 2,
      nombre: 'Laura Rodríguez',
      email: 'laura.rodriguez@hotmail.com',
      telefono: '+502 8765-4321',
      sucursal: 'Norte',
      fechaRegistro: '2024-01-14 11:20',
      estado: 'Pendiente',
      documentos: ['Cédula', 'Comprobante de ingresos', 'Referencias']
    }
  ]);

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

  const handleApproveUser = (userId) => {
    setPendingUsers(prev => prev.filter(user => user.id !== userId));
    // Aquí se enviaría la aprobación al backend
  };

  const handleRejectUser = (userId) => {
    setPendingUsers(prev => prev.filter(user => user.id !== userId));
    // Aquí se enviaría el rechazo al backend
  };

  const handleDeleteUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const handleToggleUserStatus = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, estado: user.estado === 'Activo' ? 'Inactivo' : 'Activo' }
        : user
    ));
  };

  const handleSaveUser = (userData) => {
    if (editingUser) {
      // Actualizar usuario existente
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...userData, id: editingUser.id }
          : user
      ));
    } else {
      // Crear nuevo usuario
      const newUser = {
        ...userData,
        id: Date.now(),
        fechaCreacion: new Date().toISOString().split('T')[0],
        ultimoAcceso: new Date().toLocaleString('es-ES')
      };
      setUsers(prev => [...prev, newUser]);
    }
    setEditingUser(null);
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
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
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
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('common.formularios.nombre')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('common.formularios.rol')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('common.formularios.sucursal')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('common.formularios.estado')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Último Acceso
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.nombre}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.rol)}`}>
                              {user.rol}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.sucursal}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.estado)}`}>
                              {user.estado}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.ultimoAcceso}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setEditingUser(user)}
                                className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-gray-100"
                                title="Editar usuario"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleToggleUserStatus(user.id)}
                                className={`p-1 rounded hover:bg-gray-100 ${
                                  user.estado === 'Activo' 
                                    ? 'text-red-600 hover:text-red-900' 
                                    : 'text-green-600 hover:text-green-900'
                                }`}
                                title={user.estado === 'Activo' ? 'Desactivar usuario' : 'Activar usuario'}
                              >
                                {user.estado === 'Activo' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-gray-100"
                                title="Eliminar usuario"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Usuarios Móviles Pendientes</h3>
                <div className="text-sm text-gray-500">
                  {pendingUsers.length} usuarios pendientes de aprobación
                </div>
              </div>

              <div className="grid gap-6">
                {pendingUsers.map((user) => (
                  <div key={user.id} className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{user.nombre}</h4>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-sm text-gray-500">{user.telefono}</p>
                      </div>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(user.estado)}`}>
                        {user.estado}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Sucursal</label>
                        <p className="text-sm text-gray-900">{user.sucursal}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Fecha de Registro</label>
                        <p className="text-sm text-gray-900">{user.fechaRegistro}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-600">Documentos Subidos</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {user.documentos.map((doc, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleApproveUser(user.id)}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Aprobar</span>
                      </button>
                      <button
                        onClick={() => handleRejectUser(user.id)}
                        className="btn-secondary flex items-center space-x-2"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Rechazar</span>
                      </button>
                      <button className="btn-outline flex items-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>Ver Documentos</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Roles y Permisos */}
          {activeTab === 'roles' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Roles y Permisos</h3>
                <button className="btn-primary flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Crear Rol</span>
                </button>
              </div>

              <div className="grid gap-6">
                {roles.map((role) => (
                  <div key={role.id} className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{role.nombre}</h4>
                        <p className="text-sm text-gray-500">{role.descripcion}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">{role.usuarios}</div>
                        <div className="text-sm text-gray-500">usuarios</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-600">Permisos</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {role.permisos.map((permiso, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {permiso}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button className="btn-primary flex items-center space-x-2">
                        <Edit className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                      <button className="btn-outline flex items-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>Ver Usuarios</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
          <UserModal
            user={editingUser}
            onSave={handleSaveUser}
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
      </div>
  );
};

export default Administrador;
