import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, AlertCircle, UserX } from 'lucide-react';

const ProtectedRoute = ({ children, requireApproval = true }) => {
  const { user, userProfile, loading, isAuthenticated, isApproved, isActive } = useAuth();
  const location = useLocation();

  console.log('🔍 ProtectedRoute - Estado:', { 
    loading, 
    isAuthenticated, 
    isApproved, 
    isActive, 
    user: !!user, 
    userProfile: !!userProfile 
  });

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si requiere aprobación y el usuario no está aprobado
  if (requireApproval && !isApproved) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <UserX className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Cuenta Pendiente de Aprobación
          </h2>
          <p className="text-gray-600 mb-6">
            Tu cuenta está pendiente de aprobación por parte del administrador. 
            Por favor, contacta al administrador del sistema.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              <strong>Estado:</strong> {userProfile?.estado || 'Pendiente'}
            </p>
            <p className="text-yellow-800 text-sm">
              <strong>Email:</strong> {user?.email}
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  // Si el usuario no está activo
  if (!isActive) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Cuenta Inactiva
          </h2>
          <p className="text-gray-600 mb-6">
            Tu cuenta ha sido desactivada. Por favor, contacta al administrador del sistema.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">
              <strong>Estado:</strong> {userProfile?.estado || 'Inactivo'}
            </p>
            <p className="text-red-800 text-sm">
              <strong>Email:</strong> {user?.email}
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  // Si todo está bien, mostrar el contenido
  return children;
};

export default ProtectedRoute;
