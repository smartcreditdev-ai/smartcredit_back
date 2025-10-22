import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  Key,
  Save,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const RoleManager = () => {
  const { t } = useTranslation();
  const [roles, setRoles] = useState([
    {
      id: 1,
      nombre: 'Administrador',
      descripcion: 'Acceso completo al sistema',
      permisos: ['usuarios', 'creditos', 'cobranzas', 'reportes', 'configuracion', 'formulas'],
      usuarios: 2,
      color: 'purple'
    },
    {
      id: 2,
      nombre: 'Supervisor',
      descripcion: 'Supervisión de operaciones',
      permisos: ['creditos', 'cobranzas', 'reportes', 'actividades'],
      usuarios: 3,
      color: 'blue'
    },
    {
      id: 3,
      nombre: 'Promotor',
      descripcion: 'Gestión de clientes y créditos',
      permisos: ['creditos', 'expedientes', 'actividades'],
      usuarios: 8,
      color: 'green'
    },
    {
      id: 4,
      nombre: 'Cobrador',
      descripcion: 'Gestión de cobranzas',
      permisos: ['cobranzas', 'actividades'],
      usuarios: 5,
      color: 'orange'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    permisos: [],
    color: 'blue'
  });

  const availablePermissions = [
    { id: 'usuarios', label: 'Gestión de Usuarios', description: 'Crear, editar y eliminar usuarios' },
    { id: 'creditos', label: 'Gestión de Créditos', description: 'Aprobar, rechazar y gestionar créditos' },
    { id: 'cobranzas', label: 'Gestión de Cobranzas', description: 'Gestionar cartera en mora y cobranzas' },
    { id: 'reportes', label: 'Reportes y BI', description: 'Acceso a reportes y análisis' },
    { id: 'configuracion', label: 'Configuración', description: 'Configurar parámetros del sistema' },
    { id: 'formulas', label: 'Fórmulas de Cálculo', description: 'Gestionar fórmulas del simulador' },
    { id: 'actividades', label: 'Seguimiento de Actividades', description: 'Ver y gestionar actividades de promotores' },
    { id: 'expedientes', label: 'Expedientes', description: 'Gestionar documentación de clientes' },
    { id: 'productos', label: 'Gestión de Productos', description: 'Crear y gestionar productos crediticios' },
    { id: 'integraciones', label: 'Integraciones', description: 'Configurar integraciones externas' }
  ];

  const colorOptions = [
    { value: 'blue', label: 'Azul', class: 'bg-blue-100 text-blue-800' },
    { value: 'green', label: 'Verde', class: 'bg-green-100 text-green-800' },
    { value: 'purple', label: 'Morado', class: 'bg-purple-100 text-purple-800' },
    { value: 'orange', label: 'Naranja', class: 'bg-orange-100 text-orange-800' },
    { value: 'red', label: 'Rojo', class: 'bg-red-100 text-red-800' },
    { value: 'yellow', label: 'Amarillo', class: 'bg-yellow-100 text-yellow-800' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionChange = (permissionId, checked) => {
    setFormData(prev => ({
      ...prev,
      permisos: checked 
        ? [...prev.permisos, permissionId]
        : prev.permisos.filter(p => p !== permissionId)
    }));
  };

  const handleSave = () => {
    if (editingRole) {
      setRoles(prev => prev.map(role => 
        role.id === editingRole.id 
          ? { ...formData, id: editingRole.id, usuarios: editingRole.usuarios }
          : role
      ));
    } else {
      const newRole = {
        ...formData,
        id: Date.now(),
        usuarios: 0
      };
      setRoles(prev => [...prev, newRole]);
    }
    
    setShowModal(false);
    setEditingRole(null);
    setFormData({
      nombre: '',
      descripcion: '',
      permisos: [],
      color: 'blue'
    });
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData(role);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de eliminar este rol?')) {
      setRoles(prev => prev.filter(role => role.id !== id));
    }
  };

  const getColorClass = (color) => {
    const colorOption = colorOptions.find(c => c.value === color);
    return colorOption ? colorOption.class : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-primary-500" />
            Gestión de Roles y Permisos
          </h3>
          <p className="text-gray-600 mt-1">Administra los roles del sistema y sus permisos</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Rol
        </button>
      </div>

      {/* Lista de Roles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h4 className="text-lg font-medium text-gray-900">{role.nombre}</h4>
                  <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getColorClass(role.color)}`}>
                    {role.color}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{role.descripcion}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  {role.usuarios} usuarios asignados
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(role)}
                  className="text-primary-600 hover:text-primary-800"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(role.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Key className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700">Permisos:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {role.permisos.map((permiso) => {
                  const permission = availablePermissions.find(p => p.id === permiso);
                  return (
                    <span key={permiso} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {permission ? permission.label : permiso}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {role.permisos.length} permisos asignados
                </span>
                <button className="text-sm text-primary-600 hover:text-primary-800">
                  Ver Usuarios
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Rol */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingRole ? 'Editar Rol' : 'Nuevo Rol'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingRole(null);
                    setFormData({
                      nombre: '',
                      descripcion: '',
                      permisos: [],
                      color: 'blue'
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Rol
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ej: Supervisor"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <select
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {colorOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe las responsabilidades de este rol..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Permisos
                  </label>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {availablePermissions.map((permission) => (
                      <div key={permission.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                        <input
                          type="checkbox"
                          id={permission.id}
                          checked={formData.permisos.includes(permission.id)}
                          onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                          className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <label htmlFor={permission.id} className="text-sm font-medium text-gray-900 cursor-pointer">
                            {permission.label}
                          </label>
                          <p className="text-xs text-gray-500 mt-1">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingRole(null);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Rol
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManager;
