import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, UserPlus, Mail, AlertCircle } from 'lucide-react';
import {
  crearUsuarioSistema,
  invitarUsuario,
  actualizarUsuarioSistema,
  getAgencias,
  verificarEmailExistente
} from '../services/sistemaUsuariosService';

const UsuarioForm = ({ usuario, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [agencias, setAgencias] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    rol: '',
    agencia_id: '',
    estado: 'Activo',
    password: '',
    confirmPassword: '',
    enviarEmail: true
  });
  const [errors, setErrors] = useState({});
  const [inviteMode, setInviteMode] = useState(true);

  useEffect(() => {
    loadAgencias();
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        email: usuario.email || '',
        rol: usuario.rol || '',
        agencia_id: usuario.agencia_id || '',
        estado: usuario.estado || 'Activo',
        password: '',
        confirmPassword: '',
        enviarEmail: false
      });
    }
  }, [usuario]);

  const loadAgencias = async () => {
    try {
      const data = await getAgencias();
      console.log('Agencias cargadas:', data);
      setAgencias(data);
    } catch (error) {
      console.error('Error cargando agencias:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario lo complete
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) newErrors.nombre = true;
    if (!formData.apellido.trim()) newErrors.apellido = true;
    if (!formData.email.trim()) newErrors.email = true;
    if (!formData.rol) newErrors.rol = true;
    if (!formData.agencia_id) newErrors.agencia_id = true;
    
    if (!usuario) { // Solo validar password para usuarios nuevos
      if (!inviteMode) {
        if (!formData.password.trim()) newErrors.password = true;
        if (!formData.confirmPassword.trim()) newErrors.confirmPassword = true;
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = true;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Verificar si el email ya existe (solo para usuarios nuevos)
      if (!usuario) {
        const emailExiste = await verificarEmailExistente(formData.email);
        if (emailExiste) {
          alert('Un usuario con este email ya existe en el sistema. Por favor, use un email diferente.');
          setLoading(false);
          return;
        }
      }

      let result;
      
      if (usuario) {
        // Actualizar usuario existente
        result = await actualizarUsuarioSistema(usuario.id, {
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          rol: formData.rol,
          agencia_id: formData.agencia_id,
          estado: formData.estado
        });
      } else {
        // Siempre invitar usuario por email
        result = await invitarUsuario(formData.email, {
          nombre: formData.nombre,
          apellido: formData.apellido,
          rol: formData.rol,
          agencia_id: formData.agencia_id,
          estado: formData.estado
        });
      }

      if (result.success) {
        onSuccess();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error guardando usuario:', error);
      alert('Error guardando usuario');
    } finally {
      setLoading(false);
    }
  };

  const getAgenciaNombre = (agenciaId) => {
    const agencia = agencias.find(a => a.id === agenciaId);
    return agencia ? agencia.nombre : '';
  };

  const getPermisosRol = (rol) => {
    const permisos = {
      'Administrador': [
        'Gestión de usuarios',
        'Gestión de clientes',
        'Gestión de créditos',
        'Gestión de expedientes',
        'Gestión de cobranzas',
        'Reportes y análisis',
        'Configuración del sistema'
      ],
      'Supervisor': [
        'Gestión de clientes',
        'Gestión de créditos',
        'Gestión de expedientes',
        'Reportes y análisis',
        'Supervisión de promotores'
      ],
      'Promotor': [
        'Gestión de clientes',
        'Gestión de créditos',
        'Gestión de expedientes',
        'Seguimiento de actividades'
      ],
      'Cobrador': [
        'Gestión de cobranzas',
        'Seguimiento de pagos',
        'Reportes de cobranza'
      ]
    };
    return permisos[rol] || [];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {usuario ? 'Editar Usuario' : 'Crear Cuenta de Usuario'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {usuario 
                ? 'Modifica la información del usuario del sistema'
                : 'Se creará una cuenta de usuario en el sistema. El usuario recibirá un email de invitación para establecer su propia contraseña.'
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {!usuario && (
          <div className="mb-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800">
                    <strong>Modo Invitación:</strong> Se enviará un email de invitación al usuario. 
                    El usuario podrá establecer su contraseña al aceptar la invitación.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.nombre 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300'
                }`}
                placeholder="Ej: Juan"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">El nombre es requerido</p>
              )}
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
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.apellido 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300'
                }`}
                placeholder="Ej: Pérez"
              />
              {errors.apellido && (
                <p className="mt-1 text-sm text-red-600">El apellido es requerido</p>
              )}
            </div>
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
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.email 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300'
              }`}
                placeholder="usuario@smartcredit.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">El email es requerido</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol *
              </label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.rol 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar rol</option>
                <option value="Administrador">Administrador</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Staff">Staff</option>
                <option value="Promotor">Promotor</option>
                <option value="Cobrador">Cobrador</option>
              </select>
              {errors.rol && (
                <p className="mt-1 text-sm text-red-600">El rol es requerido</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agencia *
              </label>
              <select
                name="agencia_id"
                value={formData.agencia_id}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.agencia_id 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar agencia</option>
                {agencias.length === 0 ? (
                  <option value="" disabled>Cargando agencias...</option>
                ) : (
                  agencias.map((agencia) => (
                    <option key={agencia.id} value={agencia.id}>
                      {agencia.nombre}
                    </option>
                  ))
                )}
              </select>
              {errors.agencia_id && (
                <p className="mt-1 text-sm text-red-600">La agencia es requerida</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Suspendido">Suspendido</option>
              </select>
            </div>

          </div>


          {formData.rol && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Permisos del Rol: {formData.rol}
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {getPermisosRol(formData.rol).map((permiso, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                    {permiso}
                  </li>
                ))}
              </ul>
            </div>
          )}


          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : (usuario ? 'Actualizar Usuario' : 'Enviar Invitación')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuarioForm;
