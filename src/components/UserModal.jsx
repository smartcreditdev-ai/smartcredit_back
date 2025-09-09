import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Save, Eye, EyeOff } from 'lucide-react';

const UserModal = ({ user, onSave, onClose }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(user || {
    nombre: '',
    email: '',
    rol: 'Promotor',
    sucursal: 'Centro',
    estado: 'Activo',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const roles = [
    { value: 'Administrador', label: t('common.roles.administrador') },
    { value: 'Supervisor', label: t('common.roles.supervisor') },
    { value: 'Promotor', label: t('common.roles.promotor') },
    { value: 'Cobrador', label: t('common.roles.cobrador') }
  ];

  const sucursales = [
    { value: 'Centro', label: t('common.sucursales.centro') },
    { value: 'Norte', label: t('common.sucursales.norte') },
    { value: 'Sur', label: t('common.sucursales.sur') },
    { value: 'Este', label: t('common.sucursales.este') },
    { value: 'Oeste', label: t('common.sucursales.oeste') }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!user && !formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    if (!user && formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!user && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {user ? t('userModal.editarUsuario') : t('userModal.crearUsuario')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('userModal.nombreCompleto')} *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.nombre ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Juan Pérez"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('common.formularios.email')} *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="usuario@smartcredit.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('common.formularios.rol')}
              </label>
              <select
                value={formData.rol}
                onChange={(e) => handleChange('rol', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('common.formularios.sucursal')}
              </label>
              <select
                value={formData.sucursal}
                onChange={(e) => handleChange('sucursal', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {sucursales.map((sucursal) => (
                  <option key={sucursal.value} value={sucursal.value}>
                    {sucursal.label}
                  </option>
                ))}
              </select>
            </div>

            {!user && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('userModal.confirmarContrasena')} *
              </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Repetir contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('common.formularios.estado')}
              </label>
              <select
                value={formData.estado}
                onChange={(e) => handleChange('estado', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Activo">{t('common.estados.activo')}</option>
                <option value="Inactivo">{t('common.estados.inactivo')}</option>
              </select>
            </div>
          </div>

          {/* Información de Permisos por Rol */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">{t('userModal.permisosRol')}: {formData.rol}</h3>
            <div className="text-sm text-gray-600">
              {formData.rol === 'Administrador' && (
                <p>{t('userModal.accesoCompleto')}</p>
              )}
              {formData.rol === 'Supervisor' && (
                <p>{t('userModal.supervisionOperaciones')}</p>
              )}
              {formData.rol === 'Promotor' && (
                <p>{t('userModal.gestionClientes')}</p>
              )}
              {formData.rol === 'Cobrador' && (
                <p>{t('userModal.gestionCobranzas')}</p>
              )}
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>{t('common.acciones.cancelar')}</span>
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{user ? t('common.acciones.actualizar') : t('common.acciones.crear')} Usuario</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
