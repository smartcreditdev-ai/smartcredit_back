import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [settingPassword, setSettingPassword] = useState(false);
  const [passwordSet, setPasswordSet] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      setLoading(true);
      
      // Obtener los parámetros de la URL
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');
      const error = hashParams.get('error');

      console.log('🔍 Parámetros de callback:', { type, error, hasAccessToken: !!accessToken });

      if (error) {
        setError(`Error de autenticación: ${error}`);
        setLoading(false);
        return;
      }

      if (type === 'invite' && accessToken) {
        // Es una invitación, el usuario necesita establecer su contraseña
        console.log('✅ Invitación detectada, usuario puede establecer contraseña');
        
        // Obtener información del usuario desde el token
        const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
        if (user && !userError) {
          console.log('🔍 Usuario detectado:', user);
          console.log('🔍 User metadata:', user.user_metadata);
          console.log('🔍 Rol detectado:', user.user_metadata?.rol);
          setUserEmail(user.email);
          setUserRole(user.user_metadata?.rol || '');
        }
        
        setSuccess(true);
        setLoading(false);
        return;
      }

      if (accessToken && refreshToken) {
        // Es un login normal, establecer la sesión
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (sessionError) {
          setError(`Error estableciendo sesión: ${sessionError.message}`);
        } else {
          console.log('✅ Sesión establecida correctamente');
          // Redirigir al dashboard
          navigate('/dashboard');
        }
      } else {
        setError('No se encontraron tokens de autenticación válidos');
      }

    } catch (err) {
      console.error('❌ Error en callback:', err);
      setError(`Error inesperado: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setSettingPassword(true);
      setPasswordError('');

      // Obtener la sesión actual
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('No hay sesión activa');
      }

      // Actualizar la contraseña del usuario
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        throw updateError;
      }

      console.log('✅ Contraseña establecida correctamente');
      
      // Obtener rol desde la tabla usuarios usando el email
      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .select('rol')
        .eq('email', userEmail)
        .single();
        
      if (usuarioData && !usuarioError) {
        console.log('🔍 Rol obtenido desde BD:', usuarioData.rol);
        setUserRole(usuarioData.rol);
      } else {
        console.log('❌ Error obteniendo rol desde BD:', usuarioError);
        setUserRole('');
      }
      
      // Mostrar mensaje de confirmación
      setPasswordSet(true);

    } catch (err) {
      console.error('❌ Error estableciendo contraseña:', err);
      setPasswordError(`Error: ${err.message}`);
    } finally {
      setSettingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Procesando invitación...
          </h2>
          <p className="text-gray-600">
            Por favor espera mientras verificamos tu invitación.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error de Autenticación
          </h2>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (passwordSet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            ¡Cuenta Activada Exitosamente!
          </h2>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-green-800 mb-3">
              🎉 ¡Bienvenido a SmartCredit!
            </h3>
            <p className="text-green-700 mb-4">
              Tu cuenta ha sido creada y activada correctamente. 
              {userRole === 'Promotor' 
                ? ' Como Promotor, necesitas descargar la aplicación móvil para acceder al sistema.' 
                : ' Ya puedes acceder a la aplicación.'
              }
            </p>
            
            <div className="bg-white border border-green-300 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-2">📧 Tus Credenciales de Acceso:</h4>
              <div className="text-left space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded border">
                    {userEmail}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Contraseña:</span>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded border">
                    ••••••••
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-green-600">
              <strong>✅ Tu contraseña ha sido establecida correctamente</strong>
            </p>
          </div>
          
          <div className="space-y-3">
            {console.log('🔍 Renderizando botones. Rol actual:', userRole)}
            {userRole === 'Promotor' ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-blue-900 mb-2">📱 Para Promotores</h4>
                <p className="text-blue-700 text-sm mb-3">
                  Como Promotor, necesitas descargar la aplicación móvil para acceder al sistema.
                </p>
                <div className="space-y-2">
                  <a
                    href="https://apps.apple.com/app/smartcredit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
                  >
                    📱 Descargar en App Store
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.smartcredit.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    🤖 Descargar en Google Play
                  </a>
                </div>
              </div>
            ) : (
              <button
                onClick={() => window.open('https://www.smartcreditla.com/login', '_blank')}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                🌐 Acceder al Backoffice Web
              </button>
            )}
          </div>
          
          <div className="mt-6 text-xs text-gray-500">
            <p>💡 <strong>Tip:</strong> Guarda estas credenciales en un lugar seguro</p>
            <p>🔒 Puedes cambiar tu contraseña desde tu perfil una vez dentro de la aplicación</p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              ¡Bienvenido a SmartCredit!
            </h2>
            <p className="text-gray-600">
              Tu invitación ha sido aceptada. Ahora establece tu contraseña para completar el registro.
            </p>
          </div>

          <form onSubmit={handleSetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nueva Contraseña *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Mínimo 6 caracteres"
                  required
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Contraseña *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Repetir contraseña"
                required
              />
            </div>

            {passwordError && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {passwordError}
              </div>
            )}

            <button
              type="submit"
              disabled={settingPassword}
              className="w-full btn-primary flex items-center justify-center"
            >
              {settingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Estableciendo contraseña...
                </>
              ) : (
                'Establecer Contraseña'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              ¿Ya tienes una cuenta?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Iniciar Sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
